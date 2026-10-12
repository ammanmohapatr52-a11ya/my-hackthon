import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PrivacyBadge } from './PrivacyBadge';
import { LanguageSelect } from './LanguageSelect';
import { VoiceCommandModal } from '../features/voice-command/VoiceCommandModal';
import { Mic, Menu, LogIn, User as UserIcon } from 'lucide-react';
import { useAccessibility } from '../accessibility/AccessibilityContext';
import { useLanguage } from '../i18n/LanguageContext';
import { MarvelAvatar } from '../components/ui/MarvelAvatar';

interface HeaderProps {
  onToggleMobileNav?: () => void;
  isNavOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav, isNavOpen = false }) => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);
  const { profile } = useAccessibility();
  const { t } = useLanguage();

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
            <MarvelAvatar hero="ironman" size="sm" title="Neurobridge Stark AI" />
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

          <Link
            to={currentUser ? "/profile" : "/login"}
            className="btn btn-sm"
            id="header-login-btn"
            title={currentUser ? `My Profile (@${currentUser.username})` : 'Log In'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: currentUser ? 'rgba(56, 189, 248, 0.15)' : 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
              color: currentUser ? '#38bdf8' : '#ffffff',
              border: currentUser ? '1px solid rgba(56, 189, 248, 0.45)' : 'none',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontWeight: 600,
              fontSize: '0.85rem',
              textDecoration: 'none',
              boxShadow: currentUser ? '0 0 10px rgba(56, 189, 248, 0.2)' : '0 0 14px rgba(245, 158, 11, 0.45)',
              transition: 'all 0.2s ease',
            }}
          >
            {currentUser ? (
              <>
                <MarvelAvatar hero="ironman" size="xs" />
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.username}
                </span>
              </>
            ) : (
              <>
                <LogIn size={15} />
                <span>Log In</span>
              </>
            )}
          </Link>
        </div>
      </header>

      <VoiceCommandModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </>
  );
};
