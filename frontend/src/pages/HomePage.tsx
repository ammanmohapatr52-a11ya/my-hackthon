import React, { useState, useEffect } from 'react';
import { WelcomeBanner } from '../features/home/WelcomeBanner';
import { ProfilePicker } from '../profiles/ProfilePicker';
import { StatsRow } from '../features/home/StatsRow';
import { WeekStrip } from '../features/home/WeekStrip';
import { QuickActions } from '../features/home/QuickActions';
import { PrivacyNote } from '../features/home/PrivacyNote';
import { Sparkles, X, CheckCircle2 } from 'lucide-react';

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

      <ProfilePicker />
      <StatsRow />
      <QuickActions />
      <WeekStrip />
      <PrivacyNote />
    </div>
  );
};

export default HomePage;
