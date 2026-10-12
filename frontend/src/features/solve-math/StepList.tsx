import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KaTeXMath } from '../../components/ui/KaTeXMath';
import { Volume2, MessageSquare, ChevronRight } from 'lucide-react';
import type { MathStep } from '../../math/types';
import { useLanguage } from '../../i18n/LanguageContext';
import { MarvelAvatar, type MarvelHeroId } from '../../components/ui/MarvelAvatar';

interface StepListProps {
  steps: MathStep[];
  level: 1 | 2 | 3;
  onListenStep?: (step: MathStep) => void;
  simplifiedMode?: boolean;
}

export const StepList: React.FC<StepListProps> = ({
  steps,
  level,
  onListenStep,
  simplifiedMode = false,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!steps || steps.length === 0) return null;

  // In Simplified Learning mode (FR-LVL4), show one step at a time with Prev/Next controls
  const visibleSteps = simplifiedMode ? [steps[activeStepIndex]] : steps;

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>{t('math.steps_breakdown', 'Step-by-Step Breakdown')}</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {steps.length} {steps.length === 1 ? t('math.step_singular', 'step') : t('math.steps_total', 'steps total')}
        </span>
      </div>

      {simplifiedMode && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            padding: '0.5rem 1rem',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            {t('math.simplified_learning', 'Simplified Learning')}: {t('math.step_singular', 'Step')} {activeStepIndex + 1} / {steps.length}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={activeStepIndex === 0}
              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
            >
              {t('math.previous', 'Previous')}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={activeStepIndex === steps.length - 1}
              onClick={() => setActiveStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
            >
              {t('math.next_step', 'Next Step')}
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {visibleSteps.map((step) => {
          const explanationText =
            level === 1
              ? step.explanation.level1
              : level === 2
              ? step.explanation.level2
              : step.explanation.level3;

          return (
            <div
              key={step.stepNumber}
              className="card"
              style={{
                borderLeft: '4px solid var(--accent-primary)',
                padding: '1.25rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {(() => {
                    const heroCycle: MarvelHeroId[] = ['ironman', 'spiderman', 'thor', 'strange', 'panther', 'cap'];
                    const stepHero = heroCycle[(step.stepNumber - 1) % heroCycle.length];
                    return <MarvelAvatar hero={stepHero} size="sm" title={`Step ${step.stepNumber}`} />;
                  })()}
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(56, 189, 248, 0.18)',
                      color: 'var(--accent-primary)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                    }}
                  >
                    Step {step.stepNumber}
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {step.title}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {onListenStep && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => onListenStep(step)}
                      title="Read step aloud"
                      aria-label={`Read step ${step.stepNumber} aloud`}
                      style={{ padding: '4px' }}
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      navigate('/ask', {
                        state: {
                          prefilledQuestion: `Can you clarify this specific step: "${step.title}" (${step.mathLatex}) - ${explanationText}?`,
                        },
                      });
                    }}
                    title="Ask AI about this step"
                    aria-label={`Ask about step ${step.stepNumber}`}
                    style={{ padding: '4px' }}
                  >
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>

              <div style={{ margin: '0.75rem 0' }}>
                <KaTeXMath math={step.mathLatex} block={true} />
              </div>

              <div
                style={{
                  fontSize: '0.925rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  padding: '0.5rem 0.75rem',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {explanationText}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
