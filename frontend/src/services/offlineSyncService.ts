/**
 * Offline Sync Service (Rubric: "Sync on reconnect")
 * Queues actions performed while offline or on poor connectivity,
 * and synchronizes them with the live cloud backend (https://my-hackthon-api.onrender.com)
 * as soon as connectivity is restored.
 */

import { getApiUrl } from '../config/apiConfig';
import { getValidatedSessionUser } from './userService';
import { getAppMode, isBrowserNetworkOnline } from './offlineService';

export interface QueuedSyncItem {
  id: string;
  type: 'math_solved' | 'flashcard_review' | 'note' | 'profile_update' | 'session_heartbeat';
  data: any;
  timestamp: number;
}

export interface SyncResult {
  success: boolean;
  count: number;
  message: string;
}

const STORAGE_KEY_SYNC_QUEUE = 'neurobridge_offline_sync_queue';
const STORAGE_KEY_LAST_SYNC = 'neurobridge_last_sync_timestamp';

export const getSyncQueue = (): QueuedSyncItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SYNC_QUEUE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse sync queue', err);
  }
  return [];
};

export const getPendingSyncCount = (): number => {
  return getSyncQueue().length;
};

export const getLastSyncTime = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY_LAST_SYNC);
  } catch {
    return null;
  }
};

export const queueOfflineAction = (type: QueuedSyncItem['type'], data: any): void => {
  try {
    const queue = getSyncQueue();
    const item: QueuedSyncItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      data,
      timestamp: Date.now(),
    };
    queue.push(item);
    localStorage.setItem(STORAGE_KEY_SYNC_QUEUE, JSON.stringify(queue));
    window.dispatchEvent(new CustomEvent('neurobridge_sync_queue_changed', { detail: { count: queue.length } }));

    // If we happen to be online already, attempt immediate background flush
    if (isBrowserNetworkOnline() && getAppMode() === 'online') {
      syncOfflineQueue().catch(() => {});
    }
  } catch (err) {
    console.warn('Failed to queue offline action:', err);
  }
};

export const syncOfflineQueue = async (): Promise<SyncResult> => {
  const queue = getSyncQueue();
  if (queue.length === 0) {
    return {
      success: true,
      count: 0,
      message: 'All local data is already up to date.',
    };
  }

  if (!isBrowserNetworkOnline()) {
    return {
      success: false,
      count: queue.length,
      message: 'Cannot sync: Network is currently offline.',
    };
  }

  const user = getValidatedSessionUser();
  const payload = {
    userId: user?.id || 'anonymous_offline',
    username: user?.username || 'learner',
    appMode: getAppMode(),
    syncedItems: queue,
    timestamp: Date.now(),
  };

  try {
    const url = getApiUrl('/api/v1/sync');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Cloud server sync responded with HTTP ${response.status}`);
    }

    const data = await response.json();
    const syncedCount = queue.length;

    // Clear queue upon successful synchronization
    localStorage.removeItem(STORAGE_KEY_SYNC_QUEUE);
    const nowIso = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY_LAST_SYNC, nowIso);

    window.dispatchEvent(
      new CustomEvent('neurobridge_sync_completed', {
        detail: {
          count: syncedCount,
          timestamp: nowIso,
          serverMessage: data.message,
        },
      })
    );
    window.dispatchEvent(new CustomEvent('neurobridge_sync_queue_changed', { detail: { count: 0 } }));

    return {
      success: true,
      count: syncedCount,
      message: `Successfully synchronized ${syncedCount} item(s) to cloud server.`,
    };
  } catch (err: any) {
    console.warn('Sync attempt failed, items remain safely queued offline:', err.message);
    return {
      success: false,
      count: queue.length,
      message: `Sync delayed: ${err.message}. Changes are safely preserved locally.`,
    };
  }
};

/**
 * Initializes automatic sync listeners.
 * Triggers background sync whenever network connection is restored ('online' event)
 * or when user toggles mode to 'online'.
 */
export const initOfflineSyncListeners = (): void => {
  if (typeof window === 'undefined') return;

  window.addEventListener('online', () => {
    console.log('🌐 [Neurobridge] Reconnected to network. Triggering sync on reconnect...');
    syncOfflineQueue();
  });

  window.addEventListener('neurobridge_mode_changed', (e: any) => {
    if (e.detail?.mode === 'online' && isBrowserNetworkOnline()) {
      syncOfflineQueue();
    }
  });
};
