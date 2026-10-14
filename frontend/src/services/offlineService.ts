import type { AuthSessionUser } from './userService';

export type AppMode = 'online' | 'offline';

export const STORAGE_KEY_APP_MODE = 'neurobridge_app_mode';
export const STORAGE_KEY_OFFLINE_USER = 'neurobridge_offline_user';

/**
 * Returns current application operating mode ('online' | 'offline').
 * Defaults to 'online' unless user explicitly toggled to 'offline'
 * or physical network is unreachable.
 */
export const getAppMode = (): AppMode => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_APP_MODE);
    if (stored === 'offline' || stored === 'online') {
      return stored;
    }
  } catch {
    // ignore local storage errors
  }
  return 'online';
};

/**
 * Checks whether the application is running in Offline Mode.
 */
export const isOfflineMode = (): boolean => {
  return getAppMode() === 'offline';
};

/**
 * Sets application operating mode and dispatches a system-wide custom event.
 */
export const setAppMode = (mode: AppMode): void => {
  try {
    localStorage.setItem(STORAGE_KEY_APP_MODE, mode);
    window.dispatchEvent(new CustomEvent('neurobridge_mode_changed', { detail: { mode } }));
  } catch (e) {
    console.error('Failed to set application mode in localStorage', e);
  }
};

/**
 * Toggles between Online and Offline modes.
 */
export const toggleAppMode = (): AppMode => {
  const current = getAppMode();
  const next = current === 'online' ? 'offline' : 'online';
  setAppMode(next);
  return next;
};

/**
 * Returns true if the browser reports active network connectivity.
 */
export const isBrowserNetworkOnline = (): boolean => {
  if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
    return navigator.onLine;
  }
  return true;
};

/**
 * Authenticates or restores an offline student session.
 * Does not contact any remote servers or require internet connection.
 */
export const loginOffline = (displayName?: string): AuthSessionUser => {
  const cleanName = (displayName || '').trim();
  const rawUsername = cleanName ? cleanName.toLowerCase().replace(/[^a-z0-9_]/g, '') : 'offline_learner';
  const username = rawUsername || 'offline_learner';
  const finalDisplayName = cleanName || 'Offline Scholar';

  const offlineSession: AuthSessionUser = {
    id: 'usr-offline-local',
    username,
    name: finalDisplayName,
    email: `${username}@local.neurobridge`,
    role: 'student',
    avatar: '⚡',
    loggedInAt: new Date().toISOString(),
    provider: 'Offline Local Engine',
    isOffline: true,
  };

  try {
    localStorage.setItem(STORAGE_KEY_OFFLINE_USER, JSON.stringify(offlineSession));
    localStorage.setItem('neurobridge_user', JSON.stringify(offlineSession));
    setAppMode('offline');
    window.dispatchEvent(new CustomEvent('neurobridge_auth_changed', { detail: offlineSession }));
    window.dispatchEvent(new CustomEvent('neurobridge_mode_changed', { detail: { mode: 'offline' } }));
  } catch (e) {
    console.error('Failed to store offline session', e);
  }

  return offlineSession;
};
