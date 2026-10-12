import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calculator,
  ArrowRight,
  Sparkles,
  Clock,
  Calendar,
  User,
  Shield,
  LogOut,
  HelpCircle,
  FileText,
  Sun,
  Moon,
  Sunrise,
  Sunset,
} from 'lucide-react';

import { useLanguage } from '../../i18n/LanguageContext';
import { getCurrentAuthUser, logoutAuthUser, type AuthSessionUser } from '../../services/userService';
import { getAdminSession } from '../../security/adminFirewall';
import { WelcomeTunePlayer } from './WelcomeTunePlayer';

export const WelcomeBanner: React.FC = () => {
  const navigate = useNavigate();
  const { t, activeLocale } = useLanguage();

  // Current time state updating every second
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [currentUser, setCurrentUser] = useState<AuthSessionUser | null>(() => getCurrentAuthUser());
  const [hasAdminSession, setHasAdminSession] = useState<boolean>(() => Boolean(getAdminSession()));

  useEffect(() => {
    // Tick clock every 1 second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Listen for auth changes
    const handleAuthChange = (e: any) => {
      if (e.detail) {
        setCurrentUser(e.detail);
      } else {
        setCurrentUser(getCurrentAuthUser());
      }
    };

    const handleAdminAuthChange = () => {
      setHasAdminSession(Boolean(getAdminSession()));
    };

    window.addEventListener('neurobridge_auth_changed', handleAuthChange as EventListener);
    window.addEventListener('neurobridge_admin_auth_changed', handleAdminAuthChange);
    window.addEventListener('storage', () => {
      setCurrentUser(getCurrentAuthUser());
      setHasAdminSession(Boolean(getAdminSession()));
    });

    return () => {
      clearInterval(timer);
      window.removeEventListener('neurobridge_auth_changed', handleAuthChange as EventListener);
      window.removeEventListener('neurobridge_admin_auth_changed', handleAdminAuthChange);
    };
  }, []);

  // Compute greeting and period with dynamic localization
  const getGreetingData = (date: Date) => {
    const hours = date.getHours();
    if (hours >= 5 && hours < 12) {
      return {
        greeting: t('home.greeting_morning', 'Good morning'),
        icon: Sunrise,
        iconColor: '#f59e0b',
        periodLabel: t('home.period_morning', 'Morning Session'),
        tagline: t('home.tagline_morning', 'Start your morning with focus and clarity.'),
        gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(2, 132, 199, 0.22) 100%)',
      };
    } else if (hours >= 12 && hours < 17) {
      return {
        greeting: t('home.greeting_afternoon', 'Good afternoon'),
        icon: Sun,
        iconColor: '#fbbf24',
        periodLabel: t('home.period_afternoon', 'Afternoon Session'),
        tagline: t('home.tagline_afternoon', 'Keep up the great momentum and power through your study goals!'),
        gradient: 'linear-gradient(135deg, rgba(2, 132, 199, 0.22) 0%, rgba(56, 189, 248, 0.18) 100%)',
      };
    } else if (hours >= 17 && hours < 21) {
      return {
        greeting: t('home.greeting_evening', 'Good evening'),
        icon: Sunset,
        iconColor: '#f97316',
        periodLabel: t('home.period_evening', 'Evening Review'),
        tagline: t('home.tagline_evening', 'Great time to review your concepts and complete practice flashcards.'),
        gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.18) 0%, rgba(99, 102, 241, 0.2) 100%)',
      };
    } else {
      return {
        greeting: t('home.greeting_night', 'Good night'),
        icon: Moon,
        iconColor: '#a78bfa',
        periodLabel: t('home.period_night', 'Night Session'),
        tagline: t('home.tagline_night', 'Late night learning? Stay curious and remember to rest well.'),
        gradient: 'linear-gradient(135deg, rgba(79, 70, 229, 0.22) 0%, rgba(15, 23, 42, 0.4) 100%)',
      };
    }
  };

  const greetingInfo = getGreetingData(currentTime);
  const GreetingIcon = greetingInfo.icon;

  const timeString = currentTime.toLocaleTimeString(activeLocale || 'en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = currentTime.toLocaleDateString(activeLocale || 'en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleLogout = () => {
    logoutAuthUser();
    setCurrentUser(null);
  };

  const displayName = currentUser ? (currentUser.name || currentUser.username) : null;

  return (
    <div
      style={{
        background: greetingInfo.gradient,
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '1.75rem',
      }}
    >
      {/* Decorative ambient background blur */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.25rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left Column: Greeting, User, and Message */}
        <div style={{ maxWidth: '720px', flex: '1 1 360px' }}>
          {/* Top Pill Row: Brand + Time Period */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: 'var(--radius-full)',
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--accent-primary)',
              }}
            >
              <GreetingIcon size={14} color={greetingInfo.iconColor} />
              <span>{greetingInfo.periodLabel}</span>
            </div>

            {currentUser && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: currentUser.role === 'admin' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: currentUser.role === 'admin' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: currentUser.role === 'admin' ? '#fca5a5' : '#86efac',
                }}
              >
                <span>{currentUser.avatar}</span>
                <span>@{currentUser.username} ({currentUser.role.toUpperCase()})</span>
              </div>
            )}
          </div>

          {/* Main Greeting Headline */}
          <h1
            style={{
              fontSize: '2.35rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '0.5rem',
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
            }}
          >
            {displayName ? (
              <>
                {greetingInfo.greeting},{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #38bdf8 0%, #f59e0b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {displayName}
                </span>
                ! 👋
              </>
            ) : (
              <>
                {greetingInfo.greeting}! {t('home.welcome_to', 'Welcome to')}{' '}
                <span style={{ color: 'var(--accent-primary)' }}>Neurobridge</span>
              </>
            )}
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '1.5rem',
            }}
          >
            {greetingInfo.tagline}{' '}
            {t(
              'home.welcome_desc',
              'Solve mathematics with verifiable steps, explore PDF study notes, and master concepts with adaptive voice AI.'
            )}
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/solve')}
              aria-label={t('math.btn_solve', 'Solve a Problem')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Calculator size={18} />
              <span>{t('home.action_solve_title', 'Solve Math Problem')}</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/ask')}
              aria-label={t('nav.ask', 'Ask AI Question')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <HelpCircle size={18} />
              <span>{t('home.action_ask_title', 'Ask AI Question')}</span>
            </button>

            <button
              type="button"
              className="btn btn-outline btn-lg"
              onClick={() => navigate('/scan')}
              aria-label={t('nav.scan_pdf', 'PDF Scanner')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FileText size={18} />
              <span>{t('nav.scan_pdf', 'PDF Scanner')}</span>
            </button>

            {(currentUser?.role === 'admin' || hasAdminSession) && (
              <Link
                to="/admin"
                className="btn btn-outline btn-lg"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderColor: 'rgba(56, 189, 248, 0.5)',
                  color: '#38bdf8',
                }}
              >
                <Shield size={18} />
                <span>Admin Console</span>
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: Live Clock & Date Badge + Session Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            alignItems: 'flex-start',
            minWidth: '220px',
          }}
        >
          {/* Live Digital Clock Card */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              width: '100%',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>
              <Clock size={14} color="var(--accent-primary)" />
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                {t('home.current_time', 'Current Time')}
              </span>
            </div>
            <div
              style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#f8fafc',
                fontFamily: 'monospace',
                letterSpacing: '0.04em',
                lineHeight: 1.2,
              }}
            >
              {timeString}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.825rem',
                color: '#38bdf8',
                marginTop: '6px',
                fontWeight: 500,
              }}
            >
              <Calendar size={13} />
              <span>{dateString}</span>
            </div>
          </div>

          {/* User Session Quick Card / Action */}
          {currentUser ? (
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.825rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{currentUser.avatar}</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{currentUser.name || currentUser.username}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {t('home.session_active', 'Session active')}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                style={{
                  padding: '4px 8px',
                  color: '#f87171',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                }}
                title={t('home.logout', 'Log out')}
              >
                <LogOut size={13} />
                <span>{t('home.logout', 'Log out')}</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.25) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '0.65rem 1rem',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#f59e0b',
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <User size={15} />
              <span>Log In to Save History</span>
            </Link>
          )}
        </div>
      </div>

      {/* Accessible Welcome Music Melody Bar */}
      <WelcomeTunePlayer />
    </div>
  );
};

export default WelcomeBanner;
