import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Calculator,
  HelpCircle,
  Activity,
  Layers,
  Volume2,
  Clock,
  Settings,
  Grid,
  FileText,
  LogIn,
  LogOut,
  Shield,
  Globe2,
  X,
  User,
} from 'lucide-react';

import { useLanguage } from '../i18n/LanguageContext';
import { getCurrentAuthUser, logoutAuthUser, type AuthSessionUser } from '../services/userService';

interface SideNavProps {
  onItemClick?: () => void;
  onClose?: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({ onItemClick, onClose }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<AuthSessionUser | null>(() => getCurrentAuthUser());

  useEffect(() => {
    const syncUser = () => setCurrentUser(getCurrentAuthUser());
    window.addEventListener('neurobridge_auth_changed', syncUser);
    return () => window.removeEventListener('neurobridge_auth_changed', syncUser);
  }, []);

  const navItems = [
    { to: '/', label: t('nav.home', 'Home'), icon: Home },
    { to: '/news', label: t('nav.news', 'Current Affairs & News'), icon: Globe2, badge: 'LIVE' },
    { to: '/solve', label: t('nav.solve', 'Solve Math'), icon: Calculator },
    { to: '/ask', label: t('nav.ask', 'Ask a Question'), icon: HelpCircle },
    { to: '/scan', label: t('nav.scan', 'PDF Scanner'), icon: FileText },
    { to: '/graph', label: t('nav.graph', 'Graph & Sound'), icon: Activity },
    { to: '/flashcards', label: t('nav.flashcards', 'Flashcards'), icon: Layers },
    { to: '/voice-learning', label: t('nav.voice', 'Voice Learning'), icon: Volume2 },
    { to: '/history', label: t('nav.history', 'My History'), icon: Clock },
    { to: '/profile', label: t('nav.profile', 'My Profile'), icon: User },
    { to: '/settings', label: t('nav.settings', 'Accessibility Settings'), icon: Settings },
    ...(currentUser
      ? [{ to: '/login', label: `Switch / Sign Out (@${currentUser.username})`, icon: LogOut }]
      : [{ to: '/login', label: t('nav.login', 'Login / Account'), icon: LogIn }]),
  ];

  return (
    <nav
      role="navigation"
      aria-label="Main Navigation"
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--bg-surface)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem 0.75rem',
        overflowY: 'auto',
      }}
    >
      {/* Drawer Header with Title and Accessible Close Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.25rem 0.5rem 0.75rem 0.5rem',
          marginBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#ffffff',
              fontSize: '0.9rem',
            }}
          >
            N
          </div>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
            {t('nav.title', 'Menu Options')}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose || onItemClick}
          className="btn btn-ghost"
          aria-label={t('nav.close', 'Close menu')}
          title="Close menu (Esc)"
          style={{
            padding: '6px',
            minWidth: '38px',
            minHeight: '38px',
            borderRadius: 'var(--radius-md)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <X size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onItemClick}
              className={({ isActive }) => (isActive ? 'active-nav-link' : 'nav-link')}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                background: isActive ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.4) 0%, rgba(56, 189, 248, 0.15) 100%)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.925rem',
                border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    color={isActive ? 'var(--accent-primary)' : 'currentColor'}
                  />
                  <span>{item.label}</span>
                  {(item as any).badge && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        padding: '1px 6px',
                        borderRadius: '9999px',
                        letterSpacing: '0.04em',
                        boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
                      }}
                    >
                      {(item as any).badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* Deferred feature: Braille Tools (disabled with Coming later per FR-SHELL3) */}
        <div
          title="Braille display hardware output planned for later phase"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)',
            fontSize: '0.925rem',
            marginTop: '0.5rem',
            border: '1px dashed var(--border-subtle)',
            cursor: 'not-allowed',
            opacity: 0.6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Grid size={20} />
            <span>{t('nav.braille', 'Braille Tools')}</span>
          </div>
          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
            {t('nav.later', 'Later')}
          </span>
        </div>

        {currentUser && (
          <button
            type="button"
            id="sidenav-signout-btn"
            onClick={() => {
              logoutAuthUser();
              if (onClose) onClose();
              if (onItemClick) onItemClick();
              navigate('/login');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              color: '#f87171',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              marginTop: '0.5rem',
              width: '100%',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
          >
            <LogOut size={20} color="#f87171" />
            <span>Sign Out (@{currentUser.username})</span>
          </button>
        )}
      </div>

      <div
        style={{
          padding: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}
      >
        <div>Team Neurobridge · NEXTECH 2.0</div>
        <div style={{ marginTop: '2px', color: 'var(--accent-primary)' }}>{t('nav.tagline', 'Make It Accessible.')}</div>
      </div>
    </nav>
  );
};
