import React, { useState, useEffect } from 'react';
import { WelcomeBanner } from '../features/home/WelcomeBanner';
import { ProfilePicker } from '../profiles/ProfilePicker';
import { StatsRow } from '../features/home/StatsRow';
import { WeekStrip } from '../features/home/WeekStrip';
import { QuickActions } from '../features/home/QuickActions';
import { PrivacyNote } from '../features/home/PrivacyNote';
import { StudyPlannerWidget } from '../features/planner/StudyPlannerWidget';
import { Sparkles, X, CheckCircle2, Mic, Zap, Volume2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [welcomeToast, setWelcomeToast] = useState<string | null>(null);

  useEffect(() => {
    // Check if user just redirected from Login Page
    const justLoggedInName = sessionStorage.getItem('just_logged_in_name');
    if (justLoggedInName) {
      setWelcomeToast(`Login successful! Welcome to your learning space, ${justLoggedInName}.`);
      sessionStorage.removeItem('just_logged_in_name');
      const timer = setTimeout(() => {
        setWelcomeToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTestDoubleTapVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('neurobridge_open_voice_modal'));
  };

  return (
    <div>
      {/* Post-Login Welcome Toast Banner */}
      {welcomeToast && (
        <div
          role="status"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(56, 189, 248, 0.15) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.45)',
            color: '#86efac',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.925rem',
            fontWeight: 600,
            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <Sparkles size={16} color="#38bdf8" />
            <span>{welcomeToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setWelcomeToast(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              opacity: 0.8,
            }}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Dynamic Welcome Banner with Live Clock & Greeting */}
      <WelcomeBanner />

      {/* Double-Tap Voice Feature Notification Card */}
      <div
        style={{
          marginTop: '1.25rem',
          marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(8, 14, 28, 0.8) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(56, 189, 248, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1.5px solid rgba(56, 189, 248, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)',
              flexShrink: 0,
            }}
          >
            <Mic size={22} color="#38bdf8" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.01em' }}>
                Double-Tap Voice Access Active
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(16, 185, 129, 0.18)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                }}
              >
                ● Gesture Live
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
              Double-tap anywhere on your screen or interface (or double-click with mouse) to instantly unlock the voice assistant & speak your questions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTestDoubleTapVoice}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.45)',
            color: '#38bdf8',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 0 12px rgba(56, 189, 248, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.25)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(56, 189, 248, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.12)';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(56, 189, 248, 0.2)';
          }}
        >
          <Zap size={15} color="#38bdf8" />
          <span>Activate Voice Access</span>
        </button>
      </div>

      <ProfilePicker />
      <StatsRow />
      <StudyPlannerWidget />
      <QuickActions />
      <WeekStrip />
      <PrivacyNote />
    </div>
  );
};

export default HomePage;
