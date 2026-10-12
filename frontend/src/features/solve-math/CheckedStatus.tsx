import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { VerificationResult } from '../../math/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { MarvelAvatar } from '../../components/ui/MarvelAvatar';

interface CheckedStatusProps {
  verification: VerificationResult;
}

export const CheckedStatus: React.FC<CheckedStatusProps> = ({ verification }) => {
  const { t } = useLanguage();
  const isVerified = verification.verified;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        padding: '0.875rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: isVerified
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(56, 189, 248, 0.12) 100%)'
          : 'var(--status-warning-subtle)',
        border: `1.5px solid ${isVerified ? 'rgba(56, 189, 248, 0.5)' : 'rgba(245, 158, 11, 0.4)'}`,
        boxShadow: isVerified
          ? '0 4px 16px rgba(16, 185, 129, 0.2), 0 0 14px rgba(56, 189, 248, 0.2)'
          : 'none',
        margin: '1rem 0',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        {isVerified ? (
          <MarvelAvatar hero="cap" size="md" title="Vibranium Verified Proof (Captain America Shield)" />
        ) : (
          <MarvelAvatar hero="ironman" size="md" title="Pending Verification" />
        )}
      </div>
      <div>
        <div
          style={{
            fontWeight: 700,
            fontSize: '0.95rem',
            color: isVerified ? 'var(--status-success)' : 'var(--status-warning)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>{verification.statusText}</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.85 }}>
            · {t('math.verified_on_device', 'Verified On-Device')}
          </span>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          {verification.details}
        </div>
      </div>
    </div>
  );
};
