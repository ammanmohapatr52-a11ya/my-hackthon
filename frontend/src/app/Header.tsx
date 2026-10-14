import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PrivacyBadge } from './PrivacyBadge';
import { LanguageSelect } from './LanguageSelect';
import { VoiceCommandModal } from '../features/voice-command/VoiceCommandModal';
import { Mic, Menu, LogIn, LogOut, User as UserIcon, Globe, Zap, RefreshCw, CheckCircle } from 'lucide-react';
import { useAccessibility } from '../accessibility/AccessibilityContext';
import { useLanguage } from '../i18n/LanguageContext';
import { MarvelAvatar } from '../components/ui/MarvelAvatar';
import { logoutAuthUser } from '../services/userService';
import { getAppMode, setAppMode, type AppMode } from '../services/offlineService';
import { getPendingSyncCount, syncOfflineQueue } from '../services/offlineSyncService';

interface HeaderProps {
  onToggleMobileNav?: () => void;
  isNavOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav, isNavOpen = false }) => {
  const navigate = useNavigate();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);
  const [appMode, setAppModeState] = useState<AppMode>(() => getAppMode());
  const [pendingSync, setPendingSync] = useState<number>(() => getPendingSyncCount());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const { profile } = useAccessibility();
  const { t } = useLanguage();

  useEffect(() => {
    const handleMode = (e: any) => {
      if (e.detail?.mode) setAppModeState(e.detail.mode);
      else setAppModeState(getAppMode());
    };
    const handleSyncQueue = (e: any) => {
      setPendingSync(e.detail?.count ?? getPendingSyncCount());
    };
    const handleSyncDone = (e: any) => {
      setPendingSync(0);
      setSyncToast(`Synced ${e.detail?.count || ''} items`);
      setTimeout(() => setSyncToast(null), 3000);
    };

    window.addEventListener('neurobridge_mode_changed', handleMode);
    window.addEventListener('neurobridge_sync_queue_changed', handleSyncQueue);
    window.addEventListener('neurobridge_sync_completed', handleSyncDone);
    return () => {
      window.removeEventListener('neurobridge_mode_changed', handleMode);
      window.removeEventListener('neurobridge_sync_queue_changed', handleSyncQueue);
      window.removeEventListener('neurobridge_sync_completed', handleSyncDone);
    };
  }, []);

  const handleManualSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    const res = await syncOfflineQueue();
    setIsSyncing(false);
    setSyncToast(res.message);
    setTimeout(() => setSyncToast(null), 3500);
  };

  const handleToggleMode = () => {
    const nextMode = appMode === 'offline' ? 'online' : 'offline';
    setAppMode(nextMode);
    setAppModeState(nextMode);
  };

  useEffect(() => {
    const syncUser = () => {
      try {
        const stored = localStorage.getItem('neurobridge_user');
        setCurrentUser(stored ? JSON.parse(stored) : null);
      } catch {
        setCurrentUser(null);
      }
    };
    syncUser();

    const handleOpenVoice = () => setIsVoiceModalOpen(true);
    window.addEventListener('neurobridge_open_voice_modal', handleOpenVoice);
    window.addEventListener('neurobridge_auth_changed', syncUser);
    return () => {
      window.removeEventListener('neurobridge_open_voice_modal', handleOpenVoice);
      window.removeEventListener('neurobridge_auth_changed', syncUser);
    };
  }, []);

  return (
    <>
      <header
        role="banner"
        style={{
          height: 'var(--header-height)',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 800,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {onToggleMobileNav && (
            <button
              type="button"
              className="btn btn-ghost hamburger-btn"
              id="nav-toggle-btn"
              onClick={onToggleMobileNav}
              aria-label={isNavOpen ? t('header.close_nav', 'Close navigation menu') : t('header.toggle_nav', 'Open navigation menu (Options)')}
              aria-expanded={isNavOpen}
              aria-controls="navigation-drawer"
              aria-haspopup="dialog"
              title={isNavOpen ? 'Close menu (Esc)' : 'Open menu (3 lines)'}
              style={{
                padding: '8px',
                minWidth: '44px',
                minHeight: '44px',
                borderRadius: 'var(--radius-md)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isNavOpen ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: isNavOpen ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                color: isNavOpen ? 'var(--accent-primary)' : 'var(--text-primary)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
            >
              <Menu size={22} />
            </button>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src="/images/login_logo.png"
              alt="Neurobridge Logo"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid #f59e0b',
                boxShadow: '0 0 10px rgba(245, 158, 11, 0.45)',
              }}
            />
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                }}
              >
                Neurobridge
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  marginLeft: '0.5rem',
                  display: 'none',
                }}
              >
                Make It Accessible
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="hide-on-mobile">
            <PrivacyBadge />
          </div>

          {/* Mode Switch Toggle Pill */}
          <button
            type="button"
            id="header-mode-toggle-btn"
            onClick={handleToggleMode}
            title={appMode === 'offline' ? 'Offline Mode Active (Click to switch to Online)' : 'Online Mode Active (Click to switch to Offline)'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 11px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: appMode === 'offline' ? 'rgba(245, 158, 11, 0.18)' : 'rgba(56, 189, 248, 0.12)',
              color: appMode === 'offline' ? '#f59e0b' : '#38bdf8',
              border: appMode === 'offline' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(56, 189, 248, 0.35)',
              boxShadow: appMode === 'offline' ? '0 0 12px rgba(245, 158, 11, 0.3)' : '0 0 10px rgba(56, 189, 248, 0.15)',
              transition: 'all 0.2s ease',
            }}
          >
            {appMode === 'offline' ? (
              <>
                <Zap size={13} color="#f59e0b" />
                <span>Offline</span>
              </>
            ) : (
              <>
                <Globe size={13} color="#38bdf8" />
                <span>Online</span>
              </>
            )}
          </button>

          {/* Sync on Reconnect Action Button */}
          {pendingSync > 0 && (
            <button
              type="button"
              id="header-sync-btn"
              onClick={handleManualSync}
              disabled={isSyncing}
              title={`Sync ${pendingSync} pending offline item(s) to Cloud Backend`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: isSyncing ? 'wait' : 'pointer',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.45)',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.25)',
                transition: 'all 0.2s ease',
              }}
            >
              <RefreshCw size={12} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isSyncing ? 'Syncing...' : `Sync (${pendingSync})`}</span>
            </button>
          )}

          {/* Sync notification toast pill */}
          {syncToast && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 600,
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
              }}
            >
              <CheckCircle size={11} />
              <span>{syncToast}</span>
            </div>
          )}

          <LanguageSelect />

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setIsVoiceModalOpen(true)}
            aria-label={t('header.voice_cmd', 'Voice command')}
            style={{
              borderColor: 'var(--border-medium)',
              gap: '6px',
            }}
          >
            <Mic size={16} color="var(--accent-primary)" />
            <span className="hide-on-mobile">{t('header.voice_cmd', 'Voice command')}</span>
          </button>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link
                to="/profile"
                className="btn btn-sm"
                id="header-profile-btn"
                title={`My Profile (@${currentUser.username})`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.45)',
                  borderRadius: '9999px',
                  padding: '6px 12px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  boxShadow: '0 0 10px rgba(56, 189, 248, 0.2)',
                  transition: 'all 0.2s ease',
                }}
              >
                <MarvelAvatar hero="ironman" size="xs" />
                <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.username}
                </span>
              </Link>

              <button
                type="button"
                id="header-signout-btn"
                onClick={() => {
                  logoutAuthUser();
                  navigate('/login');
                }}
                title="Sign Out / Lock Workspace"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  color: '#f87171',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  borderRadius: '9999px',
                  padding: '6px 11px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <LogOut size={13} />
                <span className="hide-on-mobile">Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-sm"
              id="header-login-btn"
              title="Log In to Workspace"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '6px 14px',
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none',
                boxShadow: '0 0 14px rgba(245, 158, 11, 0.45)',
                transition: 'all 0.2s ease',
              }}
            >
              <LogIn size={15} />
              <span>Log In</span>
            </Link>
          )}
        </div>
      </header>

      <VoiceCommandModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </>
  );
};
