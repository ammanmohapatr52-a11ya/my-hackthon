import React from 'react';
import { IndiaMapComponent } from '../features/india-map/IndiaMapComponent';
import { Compass, Sparkles, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const IndiaMapPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: '9999px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Compass size={13} />
            <span>Interactive India Atlas & Heritage Explorer</span>
          </span>
        </div>

        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.02em',
          }}
        >
          Interactive Map of India <span style={{ color: 'var(--accent-primary)' }}>(भारत का मानचित्र)</span>
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            lineHeight: 1.6,
            margin: 0,
            maxWidth: '820px',
          }}
        >
          Explore all Indian States and Union Territories interactively. Click on any state to inspect official State Birds,
          State Animals, State Flowers, UNESCO World Heritage monuments, real high-resolution photographs, major rivers, and rich cultural traditions with bilingual voice narration.
        </p>
      </div>

      {/* Main Interactive Map Component */}
      <IndiaMapComponent />
    </div>
  );
};
