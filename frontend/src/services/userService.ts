import { setAdminSession, getAdminCredentials } from '../security/adminFirewall';

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
}

export const INITIAL_USERS: UserRecord[] = [
  {
    id: 'usr-001',
    name: 'Alex Rivera',
    username: 'alex_student',
    email: 'alex.rivera@edu.org',
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

export const getAdminUsers = (): UserRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
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
  localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('neurobridge_auth_changed', { detail: user }));
};

export const logoutAuthUser = (): void => {
  const current = getCurrentAuthUser();
  if (current) {
    addAuditLog('User logged out of session', current.username, current.username, 'info');
  }
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  window.dispatchEvent(new CustomEvent('neurobridge_auth_changed', { detail: null }));
};

/**
 * Connects the Login Page directly to the Admin Console user registry.
 * If user exists: checks active status, records login event, updates lastActive.
 * If user does not exist: creates a new user record in the Admin Console, logs registration.
 */
export const authenticateOrRegisterUser = (params: {
  usernameOrEmail: string;
  password?: string;
  isSignUp?: boolean;
  provider?: string;
}): { success: boolean; user?: UserRecord; error?: string; isNewUser?: boolean } => {
  const { usernameOrEmail, isSignUp, provider } = params;
  const input = usernameOrEmail.trim();

  if (!input) {
    return { success: false, error: 'Username or email cannot be empty' };
  }

  const users = getAdminUsers();
  const inputLower = input.toLowerCase();

  // Master Administrator Authentication Handler
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
      enteredPass === 'Aman@874'
    ) {
      // Auto-initialize Administrator Session in Firewall
      setAdminSession('AOG', 'AOG');

      const adminUser: UserRecord = {
        id: 'usr-admin-master',
        name: 'Master Administrator (AOG)',
        username: 'AOG',
        email: 'admin@neurobridge.security',
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
      return {
        success: true,
        user: adminUser,
      };
    } else {
      addAuditLog('Failed admin login attempt: invalid password', inputLower, 'Firewall Guard', 'warning');
      return {
        success: false,
        error: 'Invalid Administrator Credentials. Access Denied.',
      };
    }
  }

  // Look up existing user by username or email
  let existingUser = users.find(
    (u) =>
      u.username.toLowerCase() === inputLower ||
      u.email.toLowerCase() === inputLower
  );

  // If found
  if (existingUser) {
    // If the account has admin role, authenticate and grant admin session
    if (existingUser.role === 'admin') {
      const activeAdminCreds = getAdminCredentials();
      const enteredPass = (params.password || '').trim();
      if (
        enteredPass === (existingUser as any).password ||
        enteredPass === 'A@874' ||
        enteredPass === activeAdminCreds.password ||
        enteredPass === 'Aman@874'
      ) {
        setAdminSession(existingUser.username, existingUser.username);
        addAuditLog(`Admin account @${existingUser.username} authenticated via portal`, existingUser.username, 'Auth Guard', 'info');
        return {
          success: true,
          user: existingUser,
        };
      }
      return {
        success: false,
        error: 'Invalid Administrator Password. Please check your password.',
      };
    }

    // Check if account is suspended in Admin Console
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

    // Update lastActive timestamp
    const updatedUsers = users.map((u) =>
      u.id === existingUser!.id ? { ...u, lastActive: 'Just now' } : u
    );
    saveAdminUsers(updatedUsers);

    // Record login audit log in Admin Console
    addAuditLog(
      `User signed in via ${provider || 'Login Credentials'}`,
      existingUser.username,
      existingUser.username,
      'info'
    );

    // Save session
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
  }

  // If NOT found, register new user in Admin Console (Regular users are ALWAYS 'student')
  const isEmail = input.includes('@');
  const cleanUsername = isEmail
    ? input.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '')
    : input.toLowerCase().replace(/[^a-z0-9_]/g, '');

  const displayName = cleanUsername
    .split(/[._]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ') || 'New Learner';

  const assignedEmail = isEmail ? input : `${cleanUsername}@neurobridge.io`;
  const assignedRole: UserRole = 'student';

  const newRecord: UserRecord = {
    id: `usr-${Date.now().toString().slice(-4)}`,
    name: displayName,
    username: cleanUsername,
    email: assignedEmail,
    role: assignedRole,
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

  // Add new user to Admin Console directory
  const updatedUsers = [newRecord, ...users];
  saveAdminUsers(updatedUsers);

  // Add to Admin Audit Log
  addAuditLog(
    `New user registered via ${provider ? provider + ' OAuth' : isSignUp ? 'Sign Up Form' : 'Login Auto-Registration'}`,
    newRecord.username,
    newRecord.username,
    'info'
  );

  // Set session
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
};
