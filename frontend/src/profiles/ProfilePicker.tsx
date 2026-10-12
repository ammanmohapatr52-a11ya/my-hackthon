import React from 'react';
import { useAccessibility } from '../accessibility/AccessibilityContext';
import { LEARNER_PROFILES, type LearnerProfile } from './learnerProfiles';
import { Sparkles, Ear, EyeOff, Hand, Check } from 'lucide-react';
import { useAnnounce } from '../accessibility/useAnnounce';
import { useVisualAlert } from '../accessibility/VisualAlert';
import { useLanguage } from '../i18n/LanguageContext';

export const ProfilePicker: React.FC = () => {
  const { profile: currentProfile, selectProfile } = useAccessibility();
  const { announcePolite } = useAnnounce();
  const { showAlert } = useVisualAlert();
  const { t } = useLanguage();

  const handleSelect = async (p: LearnerProfile) => {
    if (!p.isAvailableInV1) return;
    await selectProfile(p.id as 'standard' | 'deaf-hoh');
    announcePolite(`Selected ${p.title} profile.`);
    showAlert({
      type: 'info',
      title: `${p.title} Profile Active`,
      message: p.id === 'deaf-hoh' ? 'Captions and visual alerts enabled.' : 'Standard settings applied.',
    });
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'deaf':
        return <Ear size={24} color="var(--accent-primary)" />;
      case 'eye':
        return <EyeOff size={24} color="var(--text-muted)" />;
      case 'hand':
        return <Hand size={24} color="var(--text-muted)" />;
      default:
        return <Sparkles size={24} color="var(--accent-primary)" />;
    }
  };

  return (
    <div style={{ margin: '2rem 0' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.25rem' }}>{t('home.profile_prompt', 'How do you learn best?')}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {t('home.profile_prompt_desc', 'Select a profile to customize audio, captions, and visual alerts for your workflow.')}
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
        }}
      >
        {LEARNER_PROFILES.map((p) => {
          const isSelected = currentProfile === p.id && p.isAvailableInV1;
          const isDisabled = !p.isAvailableInV1;

          return (
            <div
              key={p.id}
              role={isDisabled ? undefined : 'button'}
              tabIndex={isDisabled ? -1 : 0}
              aria-pressed={isSelected}
              aria-disabled={isDisabled}
              onClick={() => handleSelect(p)}
              onKeyDown={(e) => {
                if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleSelect(p);
                }
              }}
              style={{
                position: 'relative',
                background: isSelected ? 'var(--bg-elevated)' : 'var(--bg-glass-card)',
                border: isSelected
                  ? '2px solid var(--accent-primary)'
                  : isDisabled
                  ? '1px dashed var(--border-subtle)'
                  : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.55 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255,255,255,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {renderIcon(p.iconName)}
                  </div>
                  {isSelected && (
                    <span
                      className="badge badge-info"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Check size={14} /> {t('common.active', 'Active')}
                    </span>
                  )}
                  {isDisabled && (
                    <span
                      className="badge"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {t('nav.later', 'Coming later')}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {p.id === 'standard' ? t('home.profile_standard', p.title) :
                   p.id === 'deaf-hoh' ? t('home.profile_deaf', p.title) : p.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {p.id === 'standard' ? t('home.profile_standard_desc', p.description) :
                   p.id === 'deaf-hoh' ? t('home.profile_deaf_desc', p.description) : p.description}
                </p>
              </div>

              {p.comingSoonNote && (
                <div
                  style={{
                    marginTop: '1rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontStyle: 'italic',
                  }}
                >
                  {p.comingSoonNote}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
