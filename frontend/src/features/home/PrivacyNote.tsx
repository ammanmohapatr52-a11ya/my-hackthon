import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const PrivacyNote: React.FC = () => {
  return (
    <footer
      style={{
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
        <ShieldCheck size={18} color="var(--status-success)" />
        <span>
          <strong>Private by design:</strong> All math solutions, queries, and flashcards stay on your device
          in local storage. History recording can be turned off anytime in Accessibility Settings.
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Info size={16} color="var(--text-muted)" />
        <span>
          Image and PDF inputs require a local OCR or vision model and are planned for a later desktop release.
        </span>
      </div>
    </footer>
  );
};
