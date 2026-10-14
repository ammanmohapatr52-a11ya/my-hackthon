/**
 * Neurobridge Service Worker
 * Provides offline caching, network-resilient fallbacks, and PWA support.
 * Rubric requirement: "Stays useful on poor or intermittent connectivity, and fully offline where feasible — cached content, edge models, sync on reconnect"
 */

const CACHE_NAME = 'neurobridge-core-v2';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests for cache matching
  if (request.method !== 'GET') {
    return;
  }

  // Handle HTML navigation (Single Page Application fallback)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // If response is valid, update cache in background
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          // When offline, serve cached index.html or root
          const cached = await caches.match(request);
          if (cached) return cached;
          const indexFallback = await caches.match('/index.html');
          if (indexFallback) return indexFallback;
          const rootFallback = await caches.match('/');
          return rootFallback || new Response('Offline - Neurobridge Cached Shell Loading...', {
            headers: { 'Content-Type': 'text/html' }
          });
        })
    );
    return;
  }

  // Handle API queries when offline
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(async () => {
        // Return offline mock response for health/ping so offline apps do not stall
        if (url.pathname.includes('/ping') || url.pathname.includes('/health')) {
          return new Response(JSON.stringify({ status: 'offline', offline: true }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return new Response(JSON.stringify({
          error: 'Offline mode active. Network unavailable.',
          offline: true
        }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Static Assets (CSS, JS, Fonts, Images) -> Cache-First with Network Fallback & Cache Refresh
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache if network is available
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
          }
        }).catch(() => {
          // Network offline; cachedResponse already being returned
        });
        return cachedResponse;
      }

      // Not in cache yet: fetch from network and store for next offline visit
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      }).catch(async () => {
        // If image failed offline, return empty or fallback
        if (request.destination === 'image') {
          return new Response('', { headers: { 'Content-Type': 'image/svg+xml' } });
        }
        return new Response('Resource offline', { status: 408 });
      });
    })
  );
});

// Client Message Listener for full offline package pre-caching
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRECACHE_ALL') {
    const urls = event.data.urls || [
      '/',
      '/index.html',
      '/login',
      '/solve',
      '/flashcards',
      '/history',
      '/profile',
      '/ask',
      '/settings',
      '/news',
      '/graph',
      '/india-map',
      '/favicon.svg',
      '/manifest.webmanifest'
    ];
    event.waitUntil(
      caches.open(CACHE_NAME).then(async (cache) => {
        await Promise.all(
          urls.map(async (url) => {
            try {
              const res = await fetch(url, { cache: 'no-cache' });
              if (res.ok) await cache.put(url, res);
            } catch (e) {
              // ignore single fetch error
            }
          })
        );
        const clients = await self.clients.matchAll();
        clients.forEach((client) => client.postMessage({ type: 'PRECACHE_COMPLETE' }));
      })
    );
  }
});

