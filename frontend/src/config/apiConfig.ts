/**
 * Neurobridge Dynamic API Base URL Configuration
 * Handles environment-driven backend routing across:
 * - Local development (http://127.0.0.1:8000)
 * - Vercel production with Render backend (VITE_API_URL or VITE_BACKEND_URL)
 * - Runtime user-configured Render backend URL (saved in localStorage)
 * - Relative URL fallback for reverse proxies / rewrites
 */

export const STORAGE_KEY_BACKEND_URL = 'neurobridge_backend_url';

export const isLocalhost = (): boolean => {
  if (typeof window === 'undefined') return true;
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
};

export const getBackendBaseUrl = (): string => {
  // 1. Build-time Vite Environment Variable (Set in Vercel project Settings -> Environment Variables)
  const envUrl = (
    (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL)) ||
    ''
  ).trim();

  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }

  // 2. Localhost development fallback (always prioritize local FastAPI when on localhost)
  if (isLocalhost()) {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY_BACKEND_URL);
        if (stored && stored.trim() && (stored.includes('localhost') || stored.includes('127.0.0.1'))) {
          return stored.trim().replace(/\/+$/, '');
        }
      }
    } catch {
      // ignore
    }
    return 'http://127.0.0.1:8000';
  }

  // 3. Runtime override saved in localStorage for production / custom deployments
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY_BACKEND_URL);
      if (stored && stored.trim()) {
        return stored.trim().replace(/\/+$/, '');
      }
    }
  } catch {
    // ignore storage access errors
  }

  // 4. If running directly on the backend web service domain
  if (typeof window !== 'undefined' && window.location.hostname === 'my-hackthon-api.onrender.com') {
    return ''; // Same-origin relative URLs (/api/v1/...)
  }

  // 5. Production backend on Render (used by static site my-hackthon.onrender.com & Vercel):
  return 'https://my-hackthon-api.onrender.com';
};

export const setBackendBaseUrl = (url: string): void => {
  try {
    const clean = url.trim().replace(/\/+$/, '');
    if (clean) {
      localStorage.setItem(STORAGE_KEY_BACKEND_URL, clean);
    } else {
      localStorage.removeItem(STORAGE_KEY_BACKEND_URL);
    }
  } catch {
    // ignore
  }
};

export const isBackendConfigured = (): boolean => {
  const url = getBackendBaseUrl();
  return Boolean(url && url.length > 0);
};

export const getApiUrl = (path: string): string => {
  const base = getBackendBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!base) {
    return cleanPath;
  }
  return `${base}${cleanPath}`;
};

/**
 * Pings backend health endpoint with a timeout (helpful for detecting Render cold starts).
 */
export const checkBackendHealth = async (
  timeoutMs = 15000,
  overrideUrl?: string
): Promise<{ ok: boolean; status?: number; url: string; error?: string; latencyMs?: number }> => {
  const baseUrl = (overrideUrl ? overrideUrl.trim().replace(/\/+$/, '') : getBackendBaseUrl());
  if (!baseUrl) {
    return { ok: false, url: '', error: 'No backend URL configured' };
  }
  const target = `${baseUrl}/api/v1/health`;
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(target, { signal: controller.signal });
    clearTimeout(timer);
    const latencyMs = Date.now() - startTime;
    return { ok: res.ok, status: res.status, url: target, latencyMs };
  } catch (err: any) {
    return {
      ok: false,
      url: target,
      error: err?.name === 'AbortError' ? 'Connection timed out (backend may be sleeping)' : (err?.message || 'Connection failed'),
    };
  }
};
