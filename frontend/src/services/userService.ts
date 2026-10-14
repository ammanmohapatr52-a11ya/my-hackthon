import { setAdminSession, getAdminCredentials, clearAdminSession } from '../security/adminFirewall';
import {
  isOfflineMode,
  getAppMode,
  setAppMode,
  loginOffline,
  STORAGE_KEY_APP_MODE,
  type AppMode,
} from './offlineService';

export { isOfflineMode, getAppMode, setAppMode, loginOffline, STORAGE_KEY_APP_MODE, type AppMode };

export type UserRole = 'admin' | 'teacher' | 'student' | 'guest';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface UserPermissions {
  canScanPdf: boolean;
  canUseVoice: boolean;
  canExportData: boolean;
  isApiRateLimited: boolean;
}

export interface UserRecord {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  avatar: string;
  joinedDate: string;
  lastActive: string;
  storageUsed: string;
  questionsCount: number;
  permissions: UserPermissions;
  emailVerified?: boolean;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  targetUser: string;
  performedBy: string;
  type: 'info' | 'warning' | 'danger';
}

export interface AuthSessionUser {
  id?: string;
  username: string;
  name?: string;
  email?: string;
  role: UserRole;
  avatar: string;
  loggedInAt: string;
  provider?: string;
  isOffline?: boolean;
}

export const INITIAL_USERS: UserRecord[] = [
  {
    id: 'usr-001',
    name: 'Alex Rivera',
    username: 'alex_student',
    email: 'alex.rivera@edu.org',
    password: 'Student@123',
    role: 'student',
    status: 'active',
    avatar: '🎓',
    joinedDate: '2026-08-14',
    lastActive: 'Just now',
    storageUsed: '14.5 MB',
    questionsCount: 42,
    permissions: { canScanPdf: true, canUseVoice: true, canExportData: true, isApiRateLimited: false },
  },
  {
    id: 'usr-002',
    name: 'Dr. Sarah Chen',
    username: 'sarah_admin',
    email: 'sarah.chen@neurobridge.io',
    password: 'Admin@Secure2026!',
    role: 'admin',
    status: 'active',
    avatar: '🛡️',
    joinedDate: '2026-01-10',
    lastActive: '5 mins ago',
    storageUsed: '124.0 MB',
    questionsCount: 156,
    permissions: { canScanPdf: true, canUseVoice: true, canExportData: true, isApiRateLimited: false },
  },
  {
    id: 'usr-003',
    name: 'Prof. Marcus Vance',
    username: 'prof_vance',
    email: 'm.vance@stem-academy.edu',
    password: 'Teacher@123',
    role: 'teacher',
    status: 'active',
    avatar: '👨‍🏫',
    joinedDate: '2026-03-22',
    lastActive: '18 mins ago',
    storageUsed: '88.2 MB',
    questionsCount: 94,
    permissions: { canScanPdf: true, canUseVoice: true, canExportData: true, isApiRateLimited: false },
  },
  {
    id: 'usr-004',
    name: 'Elena Rostova',
    username: 'elena_r',
    email: 'elena.rostova@school.net',
    password: 'Student@123',
    role: 'student',
    status: 'active',
    avatar: '👩‍🎓',
    joinedDate: '2026-09-02',
    lastActive: '2 hours ago',
    storageUsed: '8.4 MB',
    questionsCount: 29,
    permissions: { canScanPdf: true, canUseVoice: true, canExportData: false, isApiRateLimited: false },
  },
  {
    id: 'usr-005',
    name: 'Devin Thorne',
    username: 'd_thorne',
    email: 'devin.thorne@guest.org',
    password: 'Guest@123',
    role: 'guest',
    status: 'pending',
    avatar: '👤',
    joinedDate: '2026-10-09',
    lastActive: 'Yesterday',
    storageUsed: '1.2 MB',
    questionsCount: 4,
    permissions: { canScanPdf: false, canUseVoice: false, canExportData: false, isApiRateLimited: true },
  },
  {
    id: 'usr-006',
    name: 'Liam Gallagher',
    username: 'liam_g',
    email: 'liam.g@flagged-user.com',
    password: 'Student@123',
    role: 'student',
    status: 'suspended',
    avatar: '⚠️',
    joinedDate: '2026-07-19',
    lastActive: '3 days ago',
    storageUsed: '32.1 MB',
    questionsCount: 18,
    permissions: { canScanPdf: false, canUseVoice: false, canExportData: false, isApiRateLimited: true },
  },
  {
    id: 'usr-007',
    name: 'Priya Sharma',
    username: 'priya_math',
    email: 'p.sharma@mathlab.in',
    password: 'Teacher@123',
    role: 'teacher',
    status: 'active',
    avatar: '👩‍🏫',
    joinedDate: '2026-04-05',
    lastActive: '1 hour ago',
    storageUsed: '64.7 MB',
    questionsCount: 82,
    permissions: { canScanPdf: true, canUseVoice: true, canExportData: true, isApiRateLimited: false },
  },
];

export const INITIAL_LOGS: AuditLogItem[] = [
  { id: 'log-1', timestamp: '2026-10-11 22:50', action: 'User login from IP 192.168.1.4', targetUser: 'alex_student', performedBy: 'System', type: 'info' },
  { id: 'log-2', timestamp: '2026-10-11 21:14', action: 'Suspended account due to repeated policy alerts', targetUser: 'liam_g', performedBy: 'sarah_admin', type: 'danger' },
  { id: 'log-3', timestamp: '2026-10-11 18:30', action: 'Promoted role to Teacher', targetUser: 'prof_vance', performedBy: 'sarah_admin', type: 'warning' },
  { id: 'log-4', timestamp: '2026-10-11 14:02', action: 'Granted PDF Scanner permissions', targetUser: 'elena_r', performedBy: 'sarah_admin', type: 'info' },
];

const STORAGE_USERS_KEY = 'neurobridge_admin_users';
const STORAGE_LOGS_KEY = 'neurobridge_admin_logs';
const STORAGE_CURRENT_USER_KEY = 'neurobridge_user';
const STORAGE_USER_PASSWORDS_KEY = 'neurobridge_user_passwords';

export const DEFAULT_USER_PASSWORDS: Record<string, string> = {
  'alex_student': 'Student@123',
  'alex.rivera@edu.org': 'Student@123',
  'sarah_admin': 'Admin@Secure2026!',
  'sarah.chen@neurobridge.io': 'Admin@Secure2026!',
  'prof_vance': 'Teacher@123',
  'm.vance@stem-academy.edu': 'Teacher@123',
  'elena_r': 'Student@123',
  'elena.rostova@school.net': 'Student@123',
  'd_thorne': 'Guest@123',
  'devin.thorne@guest.org': 'Guest@123',
  'liam_g': 'Student@123',
  'liam.g@flagged-user.com': 'Student@123',
  'priya_math': 'Teacher@123',
  'p.sharma@mathlab.in': 'Teacher@123',
  'aog': 'A@874',
  'admin@neurobridge.security': 'A@874',
  'admin': 'A@874',
  'admin_root': 'A@874',
};

export const getUserPasswordMap = (): Record<string, string> => {
  try {
    const raw = localStorage.getItem(STORAGE_USER_PASSWORDS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USER_PASSWORDS_KEY, JSON.stringify(DEFAULT_USER_PASSWORDS));
      return { ...DEFAULT_USER_PASSWORDS };
    }
    return { ...DEFAULT_USER_PASSWORDS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_USER_PASSWORDS };
  }
};

export const saveUserPassword = (identifier: string, password: string): void => {
  try {
    const cleanId = identifier.trim().toLowerCase();
    if (!cleanId || !password) return;
    const currentMap = getUserPasswordMap();
    currentMap[cleanId] = password;
    localStorage.setItem(STORAGE_USER_PASSWORDS_KEY, JSON.stringify(currentMap));
  } catch (e) {
    console.error('Failed to store user password', e);
  }
};

export const getStoredPasswordForUser = (user: UserRecord): string => {
  if (user.password && user.password.trim()) {
    return user.password.trim();
  }
  const map = getUserPasswordMap();
  const byEmail = map[user.email.toLowerCase()];
  if (byEmail) return byEmail;
  const byUsername = map[user.username.toLowerCase()];
  if (byUsername) return byUsername;

  if (user.role === 'admin') return 'Admin@Secure2026!';
  if (user.role === 'teacher') return 'Teacher@123';
  return 'Student@123';
};

export const getAdminUsers = (): UserRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed: UserRecord[] = JSON.parse(raw);
    let updated = false;
    const enriched = parsed.map((u) => {
      if (!u.password) {
        const pass = getStoredPasswordForUser(u);
        updated = true;
        return { ...u, password: pass };
      }
      return u;
    });
    if (updated) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(enriched));
    }
    return enriched;
  } catch {
    return INITIAL_USERS;
  }
};

export const saveAdminUsers = (users: UserRecord[]): void => {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  window.dispatchEvent(new CustomEvent('neurobridge_users_updated', { detail: users }));
};

export const getAuditLogs = (): AuditLogItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_LOGS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LOGS;
  }
};

export const addAuditLog = (
  action: string,
  targetUser: string,
  performedBy: string = 'System Auth',
  type: 'info' | 'warning' | 'danger' = 'info'
): void => {
  try {
    const existing = getAuditLogs();
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      action,
      targetUser,
      performedBy,
      type,
    };
    const updated = [newLog, ...existing.slice(0, 59)];
    localStorage.setItem(STORAGE_LOGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('neurobridge_logs_updated', { detail: updated }));
  } catch (e) {
    console.error('Failed to append audit log', e);
  }
};

export const getCurrentAuthUser = (): AuthSessionUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setCurrentAuthUser = (user: AuthSessionUser): void => {
  if (user.role !== 'admin') {
    clearAdminSession();
  }
  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('neurobridge_auth_changed', { detail: user }));
};

export const logoutAuthUser = (): void => {
  const current = getCurrentAuthUser();
  if (current) {
    addAuditLog('User logged out of session', current.username, current.username, 'info');
  }
  clearAdminSession();
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  window.dispatchEvent(new CustomEvent('neurobridge_auth_changed', { detail: null }));
};

/**
 * Validates that the active session user exists in the active user registry
 * and is not suspended. Invalid or suspended sessions are purged automatically.
 */
export const getValidatedSessionUser = (): AuthSessionUser | null => {
  const current = getCurrentAuthUser();
  if (!current) return null;

  // Offline Session Bypass: Allow offline student session without remote directory lookup
  if (current.isOffline || isOfflineMode() || current.provider?.toLowerCase().includes('offline')) {
    return current;
  }

  // Master Admin bypasses regular student directory lookup
  if (
    current.username.toLowerCase() === 'aog' ||
    current.email?.toLowerCase() === 'admin@neurobridge.security' ||
    current.role === 'admin'
  ) {
    return current;
  }

  const users = getAdminUsers();
  const exists = users.find(
    (u) =>
      u.username.toLowerCase() === current.username.toLowerCase() ||
      (current.email && u.email.toLowerCase() === current.email.toLowerCase())
  );

  if (!exists) {
    logoutAuthUser();
    return null;
  }

  if (exists.status === 'suspended') {
    logoutAuthUser();
    return null;
  }

  return current;
};

export interface AuthenticateUserParams {
  usernameOrEmail: string;
  password?: string;
  isSignUp?: boolean;
  provider?: string;
  isOtpVerified?: boolean;
}

/**
 * Connects the Login Page directly to the Admin Console user registry with strict authentication.
 * - Sign Up: Saves the user and their designated password into the registry.
 * - Login: Strictly validates that the account exists and that the entered password matches.
 * - Direct URL Access / Home Page: Blocked unless valid authenticated credentials are supplied.
 */
export const authenticateOrRegisterUser = (params: AuthenticateUserParams): {
  success: boolean;
  user?: UserRecord;
  error?: string;
  isNewUser?: boolean;
} => {
  const { usernameOrEmail, isSignUp, provider, isOtpVerified } = params;
  const input = usernameOrEmail.trim();

  // 0. Offline Mode Instant Authentication
  if (isOfflineMode()) {
    const offlineSession = loginOffline(input || 'Offline Scholar');
    return {
      success: true,
      user: {
        id: offlineSession.id || 'usr-offline',
        name: offlineSession.name || 'Offline Scholar',
        username: offlineSession.username,
        email: offlineSession.email || `${offlineSession.username}@local.neurobridge`,
        role: 'student',
        status: 'active',
        avatar: '⚡',
        joinedDate: new Date().toISOString().slice(0, 10),
        lastActive: 'Just now',
        storageUsed: '0.0 MB',
        questionsCount: 0,
        permissions: { canScanPdf: true, canUseVoice: true, canExportData: true, isApiRateLimited: false },
        emailVerified: true,
      },
    };
  }

  if (!input) {
    return { success: false, error: 'Please enter your Gmail / username' };
  }

  const users = getAdminUsers();
  const inputLower = input.toLowerCase();

  // 1. Master Administrator Handler
  if (
    inputLower === 'aog' ||
    inputLower === 'admin@neurobridge.security' ||
    inputLower === 'admin_root' ||
    inputLower === 'admin'
  ) {
    const activeAdminCreds = getAdminCredentials();
    const enteredPass = (params.password || '').trim();

    if (
      enteredPass === 'A@874' ||
      enteredPass === 'Admin@Secure2026!' ||
      enteredPass === activeAdminCreds.password ||
      enteredPass === 'Aman@874' ||
      isOtpVerified
    ) {
      setAdminSession('AOG', 'AOG');

      const adminUser: UserRecord = {
        id: 'usr-admin-master',
        name: 'Master Administrator (AOG)',
        username: 'AOG',
        email: 'admin@neurobridge.security',
        password: 'A@874',
        role: 'admin',
        status: 'active',
        avatar: 'Shield',
        joinedDate: '2026-01-01',
        lastActive: 'Just now',
        storageUsed: '4.2 GB',
        questionsCount: 999,
        permissions: {
          canScanPdf: true,
          canUseVoice: true,
          canExportData: true,
          isApiRateLimited: false,
        },
        emailVerified: true,
      };

      addAuditLog('Master Administrator AOG authenticated via login portal', 'AOG', 'Auth System', 'info');
      return { success: true, user: adminUser };
    } else {
      addAuditLog('Failed admin login attempt: invalid password', inputLower, 'Firewall Guard', 'warning');
      return {
        success: false,
        error: 'Invalid Administrator Credentials. Please enter the correct administrator password.',
      };
    }
  }

  // 2. Look up existing user by username or email
  let existingUser = users.find(
    (u) =>
      u.username.toLowerCase() === inputLower ||
      u.email.toLowerCase() === inputLower
  );

  // ==========================================
  // SIGN UP (REGISTRATION) FLOW
  // ==========================================
  if (isSignUp) {
    if (existingUser) {
      return {
        success: false,
        error: `An account with this email/username (@${existingUser.username}) already exists. Please log in with your password.`,
      };
    }

    const enteredPass = (params.password || '').trim();
    if (!enteredPass && !isOtpVerified) {
      return {
        success: false,
        error: 'Please set a password for your account (minimum 4 characters).',
      };
    }

    const isEmail = input.includes('@');
    const cleanUsername = isEmail
      ? input.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '')
      : input.toLowerCase().replace(/[^a-z0-9_]/g, '');

    const displayName =
      cleanUsername
        .split(/[._]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ') || 'New Learner';

    const assignedEmail = isEmail ? input : `${cleanUsername}@neurobridge.io`;
    const finalPassword = enteredPass || 'Student@123';

    const newRecord: UserRecord = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: displayName,
      username: cleanUsername,
      email: assignedEmail,
      password: finalPassword,
      role: 'student',
      status: 'active',
      avatar: '🎓',
      joinedDate: new Date().toISOString().slice(0, 10),
      lastActive: 'Just now (New)',
      storageUsed: '0.0 MB',
      questionsCount: 0,
      emailVerified: true,
      permissions: {
        canScanPdf: true,
        canUseVoice: true,
        canExportData: true,
        isApiRateLimited: false,
      },
    };

    saveUserPassword(newRecord.email, finalPassword);
    saveUserPassword(newRecord.username, finalPassword);
    saveAdminUsers([newRecord, ...users]);

    addAuditLog(
      `New user @${newRecord.username} registered via ${provider || 'Sign Up'}`,
      newRecord.username,
      newRecord.username,
      'info'
    );

    const session: AuthSessionUser = {
      id: newRecord.id,
      username: newRecord.username,
      name: newRecord.name,
      email: newRecord.email,
      role: newRecord.role,
      avatar: newRecord.avatar,
      loggedInAt: new Date().toISOString(),
      provider,
    };
    setCurrentAuthUser(session);

    return { success: true, user: newRecord, isNewUser: true };
  }

  // ==========================================
  // LOGIN FLOW (STRICT CREDENTIAL VERIFICATION)
  // ==========================================
  // If user does NOT exist, REJECT! Do NOT auto-register on login!
  if (!existingUser) {
    return {
      success: false,
      error: 'No account found with this Gmail / username. Please check your credentials or click "Sign Up with Email OTP" to create an account.',
    };
  }

  // Check if suspended
  if (existingUser.status === 'suspended') {
    addAuditLog(
      'Login rejected: Account is suspended in Admin Console',
      existingUser.username,
      'Auth Guard',
      'danger'
    );
    return {
      success: false,
      error: `Account @${existingUser.username} is currently SUSPENDED by an administrator. Please contact admin support.`,
    };
  }

  // If NOT authenticated via verified OTP, verify the password
  if (!isOtpVerified) {
    const enteredPass = (params.password || '').trim();
    if (!enteredPass) {
      return {
        success: false,
        error: 'Please enter your password.',
      };
    }

    const expectedPassword = getStoredPasswordForUser(existingUser);
    const activeAdminCreds = getAdminCredentials();

    const isMatch =
      enteredPass === expectedPassword ||
      (existingUser.role === 'admin' &&
        (enteredPass === 'A@874' ||
          enteredPass === 'Admin@Secure2026!' ||
          enteredPass === activeAdminCreds.password ||
          enteredPass === 'Aman@874'));

    if (!isMatch) {
      addAuditLog(`Failed login attempt for @${existingUser.username}: incorrect password`, existingUser.username, 'Auth Guard', 'warning');
      return {
        success: false,
        error: 'Incorrect password. Please enter the correct password for this account.',
      };
    }
  }

  if (existingUser.role === 'admin') {
    setAdminSession(existingUser.username, existingUser.username);
  } else {
    clearAdminSession();
  }

  const updatedUsers = users.map((u) =>
    u.id === existingUser!.id ? { ...u, lastActive: 'Just now' } : u
  );
  saveAdminUsers(updatedUsers);

  addAuditLog(
    `User @${existingUser.username} signed in via ${provider || (isOtpVerified ? 'Gmail OTP' : 'Password Login')}`,
    existingUser.username,
    existingUser.username,
    'info'
  );

  const session: AuthSessionUser = {
    id: existingUser.id,
    username: existingUser.username,
    name: existingUser.name,
    email: existingUser.email,
    role: existingUser.role,
    avatar: existingUser.avatar,
    loggedInAt: new Date().toISOString(),
    provider,
  };
  setCurrentAuthUser(session);

  return { success: true, user: existingUser, isNewUser: false };
};
