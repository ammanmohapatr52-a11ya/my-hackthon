import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const PrivacyBadge: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div
      className="badge badge-success"
      title="All calculations and storage happen locally on your computer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '0.35rem 0.75rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
      }}
    >
      <ShieldCheck size={14} />
      <span>{t('header.privacy', 'Runs on this device · nothing is uploaded')}</span>
    </div>
  );
};
