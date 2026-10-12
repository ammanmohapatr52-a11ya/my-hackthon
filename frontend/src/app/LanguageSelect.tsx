import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { LanguageCode } from '../i18n/translations';

export const LanguageSelect: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as LanguageCode;
    await setLanguage(val);
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'var(--bg-elevated)',
        borderRadius: 'var(--radius-md)',
        padding: '0.25rem 0.5rem',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <Globe size={16} color="var(--text-secondary)" />
      <label htmlFor="language-selector" className="sr-only" style={{ display: 'none' }}>
        Select Language
      </label>
      <select
        id="language-selector"
        value={language}
        onChange={handleChange}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: '0.825rem',
          fontWeight: 500,
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <option value="en" style={{ background: '#111827' }}>English (EN)</option>
        <option value="hi" style={{ background: '#111827' }}>हिन्दी (Hindi)</option>
        <option value="or" style={{ background: '#111827' }}>ଓଡ଼ିଆ (Odia)</option>
      </select>
    </div>
  );
};
