import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Search,
  Download,
  Trash2,
  Edit,
  Key,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Activity,
  Sliders,
  Check,
  X,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  UserCheck,
  UserX,
  LogOut,
  ArrowLeft,
  Terminal,
  Eye,
  EyeOff,
  Flame,
  Globe,
  Radio,
  Server,
  Zap,
  Layers,
  BarChart2,
  Database,
} from 'lucide-react';
import { DatasetConfusionMatrixTab } from '../components/admin/DatasetConfusionMatrixTab';
import {
  getAdminUsers,
  saveAdminUsers,
  getAuditLogs,
  addAuditLog as addGlobalAuditLog,
  INITIAL_USERS,
  INITIAL_LOGS,
  type UserRecord,
  type AuditLogItem,
  type UserRole,
  type UserStatus,
} from '../services/userService';
import {
  getFirewallConfig,
  saveFirewallConfig,
  getFirewallEvents,
  clearFirewallEvents,
  recordFirewallIntrusion,
  unblockIp,
  blockIp,
  toggleFirewallState,
  simulateSecurityProbe,
  getAdminSession,
  clearAdminSession,
  getAdminSessionRemainingSeconds,
  getAdminCredentials,
  updateAdminCredentials,
  type FirewallConfig,
  type FirewallIntrusionEvent,
} from '../security/adminFirewall';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  // Users & Logs State
  const [users, setUsers] = useState<UserRecord[]>(() => getAdminUsers());
  const [logs, setLogs] = useState<AuditLogItem[]>(() => getAuditLogs());

  // Firewall State
  const [firewallConfig, setFirewallConfig] = useState<FirewallConfig>(() => getFirewallConfig());
  const [firewallEvents, setFirewallEvents] = useState<FirewallIntrusionEvent[]>(() => getFirewallEvents());
  const [newBlockedIpInput, setNewBlockedIpInput] = useState('');
  const [blockReasonInput, setBlockReasonInput] = useState('Manual Administrative Quarantine');

  // Admin Credentials State
  const [adminCreds, setAdminCreds] = useState(() => getAdminCredentials());
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [editAdminId, setEditAdminId] = useState(() => getAdminCredentials().adminId);
  const [editAdminPass, setEditAdminPass] = useState(() => getAdminCredentials().password);
  const [editAdminPassConfirm, setEditAdminPassConfirm] = useState(() => getAdminCredentials().password);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Active Session & Timer
  const [sessionRemaining, setSessionRemaining] = useState<number>(() => getAdminSessionRemainingSeconds());
  const adminSession = useMemo(() => getAdminSession(), []);

  // Navigation tabs inside isolated Admin console
  const [activeTab, setActiveTab] = useState<'users' | 'permissions' | 'firewall' | 'credentials' | 'logs' | 'dataset_matrix'>('users');

  // Search & Filters for User Directory
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [sortBy, setSortBy] = useState<'name' | 'lastActive' | 'joinedDate' | 'questions'>('lastActive');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selected for bulk actions
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Modals state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<UserRecord | null>(null);
  const [tempPasswordGenerated, setTempPasswordGenerated] = useState<string | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserRecord | null>(null);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('student');
  const [newUserPassword, setNewUserPassword] = useState('Passcode2026!');

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time listener for users, logs, firewall and credentials
  useEffect(() => {
    const handleUsersUpdate = (e: any) => {
      setUsers(e.detail || getAdminUsers());
    };

    const handleLogsUpdate = (e: any) => {
      setLogs(e.detail || getAuditLogs());
    };

    const handleFirewallConfigUpdate = (e: any) => {
      setFirewallConfig(e.detail || getFirewallConfig());
    };

    const handleFirewallEvent = () => {
      setFirewallEvents(getFirewallEvents());
    };

    const handleCredentialsUpdate = (e: any) => {
      if (e.detail) {
        setAdminCreds(e.detail);
        setEditAdminId(e.detail.adminId);
        setEditAdminPass(e.detail.password);
        setEditAdminPassConfirm(e.detail.password);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'neurobridge_admin_users') setUsers(getAdminUsers());
      else if (e.key === 'neurobridge_admin_logs') setLogs(getAuditLogs());
      else if (e.key === 'neurobridge_firewall_config') setFirewallConfig(getFirewallConfig());
      else if (e.key === 'neurobridge_firewall_events') setFirewallEvents(getFirewallEvents());
      else if (e.key === 'neurobridge_admin_credentials') setAdminCreds(getAdminCredentials());
    };

    window.addEventListener('neurobridge_users_updated', handleUsersUpdate as EventListener);
    window.addEventListener('neurobridge_logs_updated', handleLogsUpdate as EventListener);
    window.addEventListener('neurobridge_firewall_config_changed', handleFirewallConfigUpdate as EventListener);
    window.addEventListener('neurobridge_firewall_event_logged', handleFirewallEvent as EventListener);
    window.addEventListener('neurobridge_admin_credentials_changed', handleCredentialsUpdate as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('neurobridge_users_updated', handleUsersUpdate as EventListener);
      window.removeEventListener('neurobridge_logs_updated', handleLogsUpdate as EventListener);
      window.removeEventListener('neurobridge_firewall_config_changed', handleFirewallConfigUpdate as EventListener);
      window.removeEventListener('neurobridge_firewall_event_logged', handleFirewallEvent as EventListener);
      window.removeEventListener('neurobridge_admin_credentials_changed', handleCredentialsUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Session expiry ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionRemaining((prev) => {
        if (prev <= 1) {
          clearAdminSession();
          navigate('/admin-login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const addLog = (action: string, targetUser: string, type: 'info' | 'warning' | 'danger' = 'info') => {
    addGlobalAuditLog(action, targetUser, 'Admin Console', type);
    setLogs(getAuditLogs());
  };

  const updateUsers = (newUsers: UserRecord[] | ((prev: UserRecord[]) => UserRecord[])) => {
    setUsers((prev) => {
      const updated = typeof newUsers === 'function' ? newUsers(prev) : newUsers;
      saveAdminUsers(updated);
      return updated;
    });
  };

  // Terminate admin session (Logout)
  const handleAdminLogout = () => {
    clearAdminSession();
    addGlobalAuditLog('Admin terminated administrative session', adminCreds.adminId, 'Admin Session Guard', 'info');
    navigate('/admin-login');
  };

  // Unblock IP Handler
  const handleUnblockIp = (ip: string) => {
    unblockIp(ip);
    setFirewallConfig(getFirewallConfig());
    setFirewallEvents(getFirewallEvents());
    showToast(`Quarantine lifted: IP ${ip} unblocked successfully`);
  };

  // Block IP Handler
  const handleBlockIp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIp = newBlockedIpInput.trim();
    if (!cleanIp) return;
    blockIp(cleanIp, blockReasonInput.trim());
    setFirewallConfig(getFirewallConfig());
    setFirewallEvents(getFirewallEvents());
    setNewBlockedIpInput('');
    showToast(`Firewall Rule Applied: IP ${cleanIp} quarantined`);
  };

  // Toggle Firewall
  const handleToggleFirewall = () => {
    const updated = toggleFirewallState(!firewallConfig.enabled, firewallConfig.strictMode);
    setFirewallConfig({ ...updated });
    showToast(`Firewall Protection ${updated.enabled ? 'ENGAGED (ACTIVE)' : 'DISARMED (BYPASS)'}`);
  };

  // Toggle Strict Mode
  const handleToggleStrictMode = () => {
    const updated = toggleFirewallState(firewallConfig.enabled, !firewallConfig.strictMode);
    setFirewallConfig({ ...updated });
    showToast(`Strict WAF Route Defense ${updated.strictMode ? 'ACTIVATED' : 'PERMISSIVE'}`);
  };

  // Simulate Probe
  const handleSimulateProbe = () => {
    const ev = simulateSecurityProbe();
    setFirewallEvents(getFirewallEvents());
    setFirewallConfig(getFirewallConfig());
    showToast(`Threat Intercepted: ${ev.eventType} from ${ev.clientIp} blocked`);
  };

  // Update Admin Credentials
  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = editAdminId.trim().toLowerCase();
    const cleanPass = editAdminPass.trim();

    if (!cleanId || !cleanId.includes('@')) {
      showToast('Admin Identifier must be a valid email or security identity');
      return;
    }
    if (cleanPass.length < 6) {
      showToast('Passcode must be at least 6 characters');
      return;
    }
    if (cleanPass !== editAdminPassConfirm.trim()) {
      showToast('Passwords do not match');
      return;
    }

    updateAdminCredentials(cleanId, cleanPass);
    setAdminCreds(getAdminCredentials());
    addGlobalAuditLog('Updated Master Admin Identifier and Passcode', cleanId, 'Chief Security Officer', 'warning');
    showToast('Admin Credentials updated successfully! Remember your new passcode.');
  };

  // Filter & sort logic for Users
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const matchesQuery =
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
        return matchesQuery && matchesRole && matchesStatus;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'name') comp = a.name.localeCompare(b.name);
        else if (sortBy === 'joinedDate') comp = a.joinedDate.localeCompare(b.joinedDate);
        else if (sortBy === 'questions') comp = a.questionsCount - b.questionsCount;
        else comp = a.id.localeCompare(b.id);
        return sortOrder === 'asc' ? comp : -comp;
      });
  }, [users, searchQuery, roleFilter, statusFilter, sortBy, sortOrder]);

  // User Actions
  const handleToggleStatus = (user: UserRecord) => {
    const newStatus: UserStatus = user.status === 'active' ? 'suspended' : 'active';
    updateUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    addLog(
      newStatus === 'active' ? 'Account unblocked & reactivated' : 'Account suspended from all services',
      user.username,
      newStatus === 'active' ? 'info' : 'danger'
    );
    showToast(`Status updated: ${user.name} is now ${newStatus.toUpperCase()}`);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const user = users.find((u) => u.id === userId);
    updateUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (user) {
      addLog(`Role changed to ${newRole.toUpperCase()}`, user.username, 'warning');
      showToast(`Role updated: ${user.name} is now ${newRole}`);
    }
  };

  const handlePermissionToggle = (
    userId: string,
    permissionKey: keyof UserRecord['permissions']
  ) => {
    updateUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = {
            ...u,
            permissions: {
              ...u.permissions,
              [permissionKey]: !u.permissions[permissionKey],
            },
          };
          return updated;
        }
        return u;
      })
    );
    const user = users.find((u) => u.id === userId);
    if (user) {
      addLog(`Updated permission [${String(permissionKey)}]`, user.username, 'info');
      showToast(`Updated permissions for ${user.name}`);
    }
  };

  const handleResetPassword = (user: UserRecord) => {
    const generated = `NB-${Math.random().toString(36).substring(2, 8).toUpperCase()}#26`;
    setTempPasswordGenerated(generated);
    setResetPasswordUser(user);
    addLog('Admin generated temporary password reset credential', user.username, 'warning');
  };

  const handleDeleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    updateUsers((prev) => prev.filter((u) => u.id !== userId));
    setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    if (target) {
      addLog('Permanently deleted user account', target.username, 'danger');
      showToast(`Deleted user account: ${target.name}`);
    }
    setDeleteConfirmUser(null);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast('Please provide a name and email');
      return;
    }

    const newUser: UserRecord = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: newUserName.trim(),
      username: newUserUsername.trim() || newUserName.toLowerCase().replace(/\s+/g, '_'),
      email: newUserEmail.trim(),
      role: newUserRole,
      status: 'active',
      avatar: newUserRole === 'admin' ? '🛡️' : newUserRole === 'teacher' ? '👨‍🏫' : '🎓',
      joinedDate: new Date().toISOString().slice(0, 10),
      lastActive: 'Just registered',
      storageUsed: '0.0 MB',
      questionsCount: 0,
      emailVerified: true,
      permissions: {
        canScanPdf: true,
        canUseVoice: true,
        canExportData: newUserRole !== 'guest',
        isApiRateLimited: newUserRole === 'guest',
      },
    };

    updateUsers((prev) => [newUser, ...prev]);
    addLog(`Created new account with role [${newUserRole}]`, newUser.username, 'info');
    showToast(`Account successfully created for ${newUser.name}`);

    setNewUserName('');
    setNewUserUsername('');
    setNewUserEmail('');
    setNewUserRole('student');
    setIsAddUserModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['ID,Name,Username,Email,Role,Status,Verified,JoinedDate,Usage'];
    const rows = filteredUsers.map(
      (u) =>
        `"${u.id}","${u.name}","${u.username}","${u.email}","${u.role}","${u.status}","${u.emailVerified ? 'YES' : 'NO'}","${u.joinedDate}","${u.questionsCount}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `neurobridge_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported users to CSV file');
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#070a11',
        backgroundImage: 'radial-gradient(circle at 50% 0%, #0d1728 0%, #060910 70%, #030508 100%)',
        color: '#f8fafc',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '9999px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP ISOLATED ADMIN COMMAND BAR */}
      <header
        style={{
          backgroundColor: 'rgba(11, 17, 30, 0.95)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
          backdropFilter: 'blur(12px)',
          padding: '0.85rem 1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        {/* Left: Brand & Classification */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.35)',
            }}
          >
            <ShieldCheck size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Admin Command Console
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '1px 7px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Decoupled
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
              Isolated Administrative Perimeter · Active Defense Shield
            </div>
          </div>
        </div>

        {/* Center: Live Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Firewall Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: firewallConfig.enabled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
              border: `1px solid ${firewallConfig.enabled ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              color: firewallConfig.enabled ? '#34d399' : '#f87171',
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: firewallConfig.enabled ? '#10b981' : '#ef4444',
                boxShadow: firewallConfig.enabled ? '0 0 8px #10b981' : '0 0 8px #ef4444',
              }}
            />
            <span>{firewallConfig.enabled ? 'FIREWALL ARMORED' : 'FIREWALL BYPASS'}</span>
          </div>

          {/* Threats Blocked Counter */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              color: '#38bdf8',
              fontWeight: 600,
            }}
          >
            <Activity size={13} />
            <span>{firewallConfig.totalThreatsBlocked} Threats Blocked</span>
          </div>

          {/* Session Timer */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              color: '#f59e0b',
              fontWeight: 600,
              fontFamily: 'monospace',
            }}
            title="Session Token Expiration Timer"
          >
            <Lock size={12} />
            <span>Token: {formatTimer(sessionRemaining)}</span>
          </div>
        </div>

        {/* Right: Actions (Probe Simulator, Return to App, Logout) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            type="button"
            id="admin-simulate-probe-button"
            onClick={handleSimulateProbe}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              color: '#f59e0b',
              fontSize: '0.78rem',
              fontWeight: 600,
              padding: '5px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Simulate Malicious Route Traversal to verify real-time firewall interception"
          >
            <Flame size={13} />
            <span>Test Probe</span>
          </button>

          <Link
            to="/"
            id="admin-return-to-learner-app-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              color: '#94a3b8',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowLeft size={13} />
            <span>Learner App</span>
          </Link>

          <button
            type="button"
            id="admin-logout-button"
            onClick={handleAdminLogout}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: 'rgba(239, 68, 68, 0.18)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Terminate Administrative Session and Quench Tokens"
          >
            <LogOut size={13} />
            <span>Exit Admin</span>
          </button>
        </div>
      </header>

      {/* SUB-HEADER / TAB NAVIGATION BAR */}
      <nav
        style={{
          backgroundColor: '#0a101d',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0 1.75rem',
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          style={{
            padding: '0.85rem 1.15rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'users' ? '2px solid #38bdf8' : '2px solid transparent',
            color: activeTab === 'users' ? '#38bdf8' : '#94a3b8',
            fontWeight: activeTab === 'users' ? 700 : 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            fontSize: '0.9rem',
            transition: 'color 0.15s ease',
          }}
        >
          <Users size={16} />
          <span>User Directory ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('permissions')}
          style={{
            padding: '0.85rem 1.15rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'permissions' ? '2px solid #38bdf8' : '2px solid transparent',
            color: activeTab === 'permissions' ? '#38bdf8' : '#94a3b8',
            fontWeight: activeTab === 'permissions' ? 700 : 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            fontSize: '0.9rem',
            transition: 'color 0.15s ease',
          }}
        >
          <Sliders size={16} />
          <span>Feature & AI Permissions</span>
        </button>

        {/* FIREWALL TAB */}
        <button
          type="button"
          id="admin-tab-firewall"
          onClick={() => setActiveTab('firewall')}
          style={{
            padding: '0.85rem 1.15rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'firewall' ? '2px solid #f59e0b' : '2px solid transparent',
            color: activeTab === 'firewall' ? '#f59e0b' : '#94a3b8',
            fontWeight: activeTab === 'firewall' ? 700 : 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            fontSize: '0.9rem',
            transition: 'color 0.15s ease',
          }}
        >
          <ShieldAlert size={16} color={activeTab === 'firewall' ? '#f59e0b' : 'currentColor'} />
          <span>Firewall & WAF Defense ({firewallConfig.blockedIps.length} Blocked)</span>
        </button>

        {/* DEDICATED ADMIN CREDENTIALS TAB */}
        <button
          type="button"
          id="admin-tab-credentials"
          onClick={() => setActiveTab('credentials')}
          style={{
            padding: '0.85rem 1.15rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'credentials' ? '2px solid #a855f7' : '2px solid transparent',
            color: activeTab === 'credentials' ? '#c084fc' : '#94a3b8',
            fontWeight: activeTab === 'credentials' ? 700 : 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            fontSize: '0.9rem',
            transition: 'color 0.15s ease',
          }}
        >
          <Key size={16} color={activeTab === 'credentials' ? '#c084fc' : 'currentColor'} />
          <span>Admin Login ID & Passcode</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          style={{
            padding: '0.85rem 1.15rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'logs' ? '2px solid #38bdf8' : '2px solid transparent',
            color: activeTab === 'logs' ? '#38bdf8' : '#94a3b8',
            fontWeight: activeTab === 'logs' ? 700 : 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            fontSize: '0.9rem',
            transition: 'color 0.15s ease',
          }}
        >
          <Activity size={16} />
          <span>Audit Log & Events ({logs.length})</span>
        </button>

        {/* DATASET & CONFUSION MATRIX TAB */}
        <button
          type="button"
          id="admin-tab-dataset-matrix"
          onClick={() => setActiveTab('dataset_matrix')}
          style={{
            padding: '0.85rem 1.15rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'dataset_matrix' ? '2px solid #38bdf8' : '2px solid transparent',
            color: activeTab === 'dataset_matrix' ? '#38bdf8' : '#94a3b8',
            fontWeight: activeTab === 'dataset_matrix' ? 700 : 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            fontSize: '0.9rem',
            transition: 'color 0.15s ease',
          }}
        >
          <Layers size={16} color={activeTab === 'dataset_matrix' ? '#38bdf8' : 'currentColor'} />
          <span>Dataset & Confusion Matrix</span>
        </button>
      </nav>

      {/* MAIN CONTENT BODY */}
      <main style={{ padding: '2rem 1.75rem', maxWidth: '1360px', width: '100%', margin: '0 auto', flex: 1 }}>
        {/* ========================================================================= */}
        {/* TAB 1: USER DIRECTORY                                                     */}
        {/* ========================================================================= */}
        {activeTab === 'users' && (
          <div>
            {/* Top Stats Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
                marginBottom: '1.75rem',
              }}
            >
              <div
                style={{
                  backgroundColor: '#0c1322',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <span>Registered Accounts</span>
                  <Users size={17} color="#38bdf8" />
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '0.4rem', color: '#ffffff' }}>
                  {users.length}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.2rem' }}>
                  ● {users.filter((u) => u.status === 'active').length} Active accounts
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#0c1322',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <span>Verified Registrations</span>
                  <CheckCircle2 size={17} color="#f59e0b" />
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '0.4rem', color: '#ffffff' }}>
                  {users.filter((u) => u.emailVerified !== false).length}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '0.2rem' }}>
                  Email OTP Verified Users
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#0c1322',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <span>Security Locks</span>
                  <Lock size={17} color="#ef4444" />
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '0.4rem', color: '#ffffff' }}>
                  {users.filter((u) => u.status === 'suspended').length}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '0.2rem' }}>
                  Suspended accounts
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#0c1322',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <span>Total Queries</span>
                  <Activity size={17} color="#a855f7" />
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '0.4rem', color: '#ffffff' }}>
                  {users.reduce((acc, u) => acc + u.questionsCount, 0)}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                  Across AI solving features
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div
              style={{
                backgroundColor: '#0b1220',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Search */}
              <div style={{ position: 'relative', flex: '1 1 260px' }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, username, or email..."
                  style={{
                    width: '100%',
                    height: '38px',
                    backgroundColor: '#070b13',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '9999px',
                    paddingLeft: '36px',
                    paddingRight: '12px',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#cbd5e1',
                    borderRadius: '8px',
                    padding: '0 12px',
                    height: '38px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  id="admin-add-user-btn"
                  onClick={() => setIsAddUserModalOpen(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '8px',
                    padding: '0 14px',
                    height: '38px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 0 15px rgba(2, 132, 199, 0.3)',
                  }}
                >
                  <UserPlus size={15} />
                  <span>+ Add New User</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div
              style={{
                backgroundColor: '#0b1220',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                overflowX: 'auto',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                    <th style={{ padding: '0.9rem 1rem' }}>User Profile</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Role</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Email Verification</th>
                    <th style={{ padding: '0.9rem 1rem' }}>Activity</th>
                    <th style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
                        No matching users found for "{searchQuery}".
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.1rem',
                              }}
                            >
                              {user.avatar}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#f8fafc' }}>{user.name}</div>
                              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                @{user.username} · {user.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                            style={{
                              backgroundColor:
                                user.role === 'admin'
                                  ? 'rgba(239, 68, 68, 0.15)'
                                  : user.role === 'teacher'
                                  ? 'rgba(245, 158, 11, 0.15)'
                                  : 'rgba(2, 132, 199, 0.15)',
                              color:
                                user.role === 'admin'
                                  ? '#fca5a5'
                                  : user.role === 'teacher'
                                  ? '#fbbf24'
                                  : '#38bdf8',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              borderRadius: '9999px',
                              padding: '3px 8px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin</option>
                            <option value="guest">Guest</option>
                          </select>
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(user)}
                            style={{
                              backgroundColor:
                                user.status === 'active'
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : 'rgba(239, 68, 68, 0.15)',
                              color: user.status === 'active' ? '#10b981' : '#ef4444',
                              border: 'none',
                              borderRadius: '9999px',
                              padding: '3px 9px',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
                            <span>{user.status.toUpperCase()}</span>
                          </button>
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: user.emailVerified !== false ? '#34d399' : '#f59e0b',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                            }}
                          >
                            <CheckCircle2 size={13} />
                            <span>{user.emailVerified !== false ? 'OTP Verified' : 'Pending OTP'}</span>
                          </span>
                        </td>

                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ color: '#cbd5e1' }}>{user.lastActive}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Joined {user.joinedDate}</div>
                        </td>

                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <button
                              type="button"
                              onClick={() => handleResetPassword(user)}
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
                              title="Reset Password"
                            >
                              <Key size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingUser(user)}
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
                              title="Edit User"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmUser(user)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                              title="Delete Account"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PERMISSIONS MATRIX                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'permissions' && (
          <div
            style={{
              backgroundColor: '#0b1220',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.75rem',
            }}
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.35rem 0' }}>
                Granular AI & Module Permissions
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
                Control access to resource-intensive learning features and AI modules per user.
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>User</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Role</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>📄 PDF Scanner</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>🎙️ Voice Engine</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>💾 Export Data</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>⚡ Rate Limited</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>@{u.username}</div>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#cbd5e1', textTransform: 'capitalize' }}>
                          {u.role}
                        </span>
                      </td>

                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={u.permissions.canScanPdf}
                          onChange={() => handlePermissionToggle(u.id, 'canScanPdf')}
                          style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                        />
                      </td>

                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={u.permissions.canUseVoice}
                          onChange={() => handlePermissionToggle(u.id, 'canUseVoice')}
                          style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                        />
                      </td>

                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={u.permissions.canExportData}
                          onChange={() => handlePermissionToggle(u.id, 'canExportData')}
                          style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                        />
                      </td>

                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={u.permissions.isApiRateLimited}
                          onChange={() => handlePermissionToggle(u.id, 'isApiRateLimited')}
                          style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FIREWALL & INTRUSION DEFENSE SHIELD                                */}
        {/* ========================================================================= */}
        {activeTab === 'firewall' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Firewall Metrics Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
              }}
            >
              {/* Defense Armoring State Card */}
              <div
                style={{
                  backgroundColor: '#0c1322',
                  border: `1px solid ${firewallConfig.enabled ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <span>Active Defense Status</span>
                    <ShieldCheck size={18} color={firewallConfig.enabled ? '#10b981' : '#ef4444'} />
                  </div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      marginTop: '0.5rem',
                      color: firewallConfig.enabled ? '#34d399' : '#f87171',
                    }}
                  >
                    {firewallConfig.enabled ? 'ARMORED & ENGAGED' : 'DISARMED'}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.35rem 0 0 0' }}>
                    Blocks unauthorized route traversals, malformed headers, and brute-force IPs.
                  </p>
                </div>
                <button
                  type="button"
                  id="admin-toggle-firewall-btn"
                  onClick={handleToggleFirewall}
                  style={{
                    marginTop: '1rem',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: firewallConfig.enabled ? '#ef4444' : '#10b981',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {firewallConfig.enabled ? 'Disarm Firewall' : 'Engage Firewall Defense'}
                </button>
              </div>

              {/* Strict WAF Mode Card */}
              <div
                style={{
                  backgroundColor: '#0c1322',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <span>Strict WAF Route Defense</span>
                    <Radio size={18} color="#38bdf8" />
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.5rem', color: '#38bdf8' }}>
                    {firewallConfig.strictMode ? 'STRICT (ZERO TRUST)' : 'PERMISSIVE'}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.35rem 0 0 0' }}>
                    Requires strict cryptographic session signature checking on every admin request.
                  </p>
                </div>
                <button
                  type="button"
                  id="admin-toggle-strict-btn"
                  onClick={handleToggleStrictMode}
                  style={{
                    marginTop: '1rem',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    color: '#38bdf8',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {firewallConfig.strictMode ? 'Switch to Permissive' : 'Switch to Strict Mode'}
                </button>
              </div>

              {/* Total Blocked Threats */}
              <div
                style={{
                  backgroundColor: '#0c1322',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <span>Total Attacks Intercepted</span>
                  <Flame size={18} color="#f59e0b" />
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.4rem', color: '#f59e0b' }}>
                  {firewallConfig.totalThreatsBlocked}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
                  Intrusions quarantined since initialization
                </p>
              </div>
            </div>

            {/* Quarantined IP Addresses Management Box */}
            <div
              style={{
                backgroundColor: '#0b1220',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: '#ffffff' }}>
                    Quarantined IP Addresses ({firewallConfig.blockedIps.length})
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
                    IP addresses locked out by brute-force limits or administrative quarantine. Click unblock to release immediately.
                  </p>
                </div>

                {/* Form to quarantine an IP */}
                <form onSubmit={handleBlockIp} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Enter IP (e.g. 192.168.1.18)"
                    value={newBlockedIpInput}
                    onChange={(e) => setNewBlockedIpInput(e.target.value)}
                    style={{
                      height: '36px',
                      backgroundColor: '#070b13',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      borderRadius: '6px',
                      padding: '0 12px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                    }}
                  />
                  <button
                    type="submit"
                    id="admin-quarantine-ip-btn"
                    style={{
                      height: '36px',
                      backgroundColor: '#ef4444',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      padding: '0 14px',
                      cursor: 'pointer',
                    }}
                  >
                    + Quarantine IP
                  </button>
                </form>
              </div>

              {/* Blocked IPs Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Quarantined IP</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Reason</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Firewall Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {firewallConfig.blockedIps.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#10b981' }}>
                          ✓ No IP addresses currently quarantined in the firewall.
                        </td>
                      </tr>
                    ) : (
                      firewallConfig.blockedIps.map((ip) => (
                        <tr key={ip} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: '#f87171' }}>
                            {ip}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span
                              style={{
                                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                color: '#ef4444',
                                padding: '2px 8px',
                                borderRadius: '9999px',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                              }}
                            >
                              BLOCKED
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>
                            Intrusion attempt / Brute force protection
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => handleUnblockIp(ip)}
                              id={`admin-unblock-ip-${ip.replace(/[^0-9]/g, '')}`}
                              style={{
                                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid rgba(16, 185, 129, 0.4)',
                                color: '#34d399',
                                padding: '4px 12px',
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              Unblock IP
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Firewall Intrusion Events */}
            <div
              style={{
                backgroundColor: '#0b1220',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.35rem 0' }}>
                    Live Threat Interception Feed
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
                    Chronological events recorded by the Neurobridge Firewall Gateway.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearFirewallEvents();
                    setFirewallEvents([]);
                    showToast('Intrusion event feed cleared');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Clear Feed
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {firewallEvents.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.8rem 1rem',
                      backgroundColor: '#070b13',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor:
                            ev.severity === 'critical' ? '#ef4444' : ev.severity === 'high' ? '#f59e0b' : '#38bdf8',
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 700, color: '#f8fafc' }}>{ev.eventType}</span>
                          <span style={{ fontFamily: 'monospace', color: '#f87171', fontSize: '0.8rem' }}>
                            IP: {ev.clientIp}
                          </span>
                          <span style={{ fontFamily: 'monospace', color: '#64748b', fontSize: '0.8rem' }}>
                            Route: {ev.path}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                          {ev.reason}
                        </div>
                      </div>
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{ev.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DEDICATED ADMIN ACCESS CREDENTIALS                                 */}
        {/* ========================================================================= */}
        {activeTab === 'credentials' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Info Notice Banner */}
            <div
              style={{
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <Key size={32} color="#c084fc" style={{ flexShrink: 0 }} />
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem', color: '#f3e8ff' }}>
                  Decoupled Administrator Security Credentials
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#d8b4fe', lineHeight: 1.45 }}>
                  The Admin Console uses completely isolated credentials and authentication tokens separate from student and regular user accounts. Normal users cannot sign in here, and admin credentials cannot be accessed from public portals.
                </p>
              </div>
            </div>

            {/* Credentials Card & Form */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {/* Left: Active Credentials Display */}
              <div
                style={{
                  backgroundColor: '#0b1220',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.75rem',
                }}
              >
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#ffffff' }}>
                  Active Master Credentials
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Admin Security Identifier
                    </label>
                    <div
                      style={{
                        padding: '10px 14px',
                        backgroundColor: '#070b13',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        borderRadius: '8px',
                        color: '#38bdf8',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                      }}
                    >
                      {adminCreds.adminId}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Admin Security Passcode
                    </label>
                    <div
                      style={{
                        padding: '10px 14px',
                        backgroundColor: '#070b13',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '8px',
                        color: '#f59e0b',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{showAdminPassword ? adminCreds.password : '••••••••••••••••'}</span>
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                      >
                        {showAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Active Session Token Details */}
                  {adminSession && (
                    <div
                      style={{
                        marginTop: '0.5rem',
                        padding: '1rem',
                        backgroundColor: 'rgba(10, 15, 26, 0.9)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        fontSize: '0.78rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                      }}
                    >
                      <div style={{ color: '#64748b' }}>Active Session Token:</div>
                      <code style={{ color: '#38bdf8', wordBreak: 'break-all' }}>{adminSession.token}</code>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginTop: '4px' }}>
                        <span>Role:</span>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>ROOT ADMINISTRATOR</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                        <span>Cryptographic Signature:</span>
                        <code style={{ color: '#f59e0b' }}>{adminSession.signature}</code>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Change Administrator Credentials Form */}
              <div
                style={{
                  backgroundColor: '#0b1220',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  borderRadius: '12px',
                  padding: '1.75rem',
                }}
              >
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
                  Update Administrator Credentials
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: '0 0 1.25rem 0' }}>
                  Modify the designated admin login ID or passcode. Changes apply immediately to the Admin Gateway.
                </p>

                <form onSubmit={handleSaveCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>
                      New Admin Security Identifier (Email or ID)
                    </label>
                    <input
                      type="text"
                      required
                      value={editAdminId}
                      onChange={(e) => setEditAdminId(e.target.value)}
                      style={{
                        width: '100%',
                        height: '42px',
                        backgroundColor: '#070b13',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        padding: '0 12px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontFamily: 'monospace',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>
                      New Passcode (Min 6 characters)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={editAdminPass}
                        onChange={(e) => setEditAdminPass(e.target.value)}
                        style={{
                          width: '100%',
                          height: '42px',
                          backgroundColor: '#070b13',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '8px',
                          padding: '0 40px 0 12px',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                          fontFamily: 'monospace',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                        }}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>
                      Confirm New Passcode
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={editAdminPassConfirm}
                      onChange={(e) => setEditAdminPassConfirm(e.target.value)}
                      style={{
                        width: '100%',
                        height: '42px',
                        backgroundColor: '#070b13',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        padding: '0 12px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontFamily: 'monospace',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    id="admin-save-credentials-btn"
                    style={{
                      marginTop: '0.5rem',
                      height: '44px',
                      background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Save & Enforce New Admin Credentials</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: AUDIT LOGS & SECURITY EVENTS                                       */}
        {/* ========================================================================= */}
        {activeTab === 'logs' && (
          <div
            style={{
              backgroundColor: '#0b1220',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.35rem 0' }}>
                  System & Security Audit Log
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>
                  Chronological record of administrator actions, privilege changes, and authentication events.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLogs([]);
                  showToast('Cleared audit logs');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear Logs
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {logs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No audit log entries recorded yet.
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#070b13',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor:
                            log.type === 'danger' ? '#ef4444' : log.type === 'warning' ? '#f59e0b' : '#38bdf8',
                        }}
                      />
                      <div>
                        <span style={{ fontWeight: 600, color: '#f8fafc' }}>{log.action}</span>
                        <span style={{ color: '#64748b', marginLeft: '6px' }}>
                          on @{log.targetUser} by {log.performedBy}
                        </span>
                      </div>
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{log.timestamp}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: DATASET & CONFUSION MATRIX                                         */}
        {/* ========================================================================= */}
        {activeTab === 'dataset_matrix' && <DatasetConfusionMatrixTab />}
      </main>

      {/* MODAL 1: ADD USER */}
      {isAddUserModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#0e172a',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '460px',
              padding: '1.75rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>Add New User Account</h2>
              <button
                type="button"
                onClick={() => setIsAddUserModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  style={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: '#070b13',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '0 12px',
                    color: '#ffffff',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={newUserUsername}
                  onChange={(e) => setNewUserUsername(e.target.value)}
                  placeholder="e.g. maya_lin (defaults to name)"
                  style={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: '#070b13',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '0 12px',
                    color: '#ffffff',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. maya.lin@school.edu"
                  style={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: '#070b13',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '0 12px',
                    color: '#ffffff',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Account Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  style={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: '#070b13',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '0 10px',
                    color: '#ffffff',
                  }}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                  <option value="guest">Guest</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Initial Password
                </label>
                <input
                  type="text"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: '#070b13',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '0 12px',
                    color: '#ffffff',
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '8px 14px',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontWeight: 600,
                    padding: '8px 18px',
                    cursor: 'pointer',
                  }}
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RESET PASSWORD */}
      {resetPasswordUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#0e172a',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '420px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
              }}
            >
              <Key size={24} />
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
              Reset Credentials
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Generated temporary access token for <strong>{resetPasswordUser.name}</strong> (@{resetPasswordUser.username}):
            </p>

            <div
              style={{
                backgroundColor: '#070b13',
                border: '1px dashed rgba(56, 189, 248, 0.4)',
                borderRadius: '8px',
                padding: '0.75rem',
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#38bdf8',
                letterSpacing: '0.05em',
                marginBottom: '1.25rem',
                userSelect: 'all',
              }}
            >
              {tempPasswordGenerated}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(tempPasswordGenerated || '');
                  showToast('Temporary password copied to clipboard!');
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                Copy Password
              </button>
              <button
                type="button"
                onClick={() => setResetPasswordUser(null)}
                style={{
                  backgroundColor: '#0284c7',
                  border: 'none',
                  color: '#ffffff',
                  padding: '6px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT USER DETAILS */}
      {editingUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#0e172a',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '460px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                Edit User: {editingUser.name}
              </h2>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  style={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: '#070b13',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '0 12px',
                    color: '#ffffff',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  style={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: '#070b13',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '0 12px',
                    color: '#ffffff',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Role
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  style={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: '#070b13',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '0 10px',
                    color: '#ffffff',
                  }}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                  <option value="guest">Guest</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '8px 14px' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateUsers((prev) => prev.map((u) => (u.id === editingUser.id ? editingUser : u)));
                    addLog('Updated account profile details', editingUser.username, 'info');
                    showToast(`Updated user: ${editingUser.name}`);
                    setEditingUser(null);
                  }}
                  style={{
                    backgroundColor: '#0284c7',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontWeight: 600,
                    padding: '8px 18px',
                    cursor: 'pointer',
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DELETE CONFIRMATION */}
      {deleteConfirmUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(6px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#0e172a',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '420px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
              }}
            >
              <AlertTriangle size={24} />
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
              Permanently Delete Account?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Are you sure you want to remove <strong>{deleteConfirmUser.name}</strong> (@{deleteConfirmUser.username})? This will delete all user data, queries, and saved history.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  padding: '6px 14px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteUser(deleteConfirmUser.id)}
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 16px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Yes, Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
