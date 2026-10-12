import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Volume2,
  BookOpen,
  Flag,
  Check,
  AlertCircle,
  Lightbulb,
  ShieldCheck,
  Calculator,
  ArrowRight,
  Info,
  Clock,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  Sparkles,
  CheckCircle2,
  GitCompare,
  ChevronDown,
  ChevronUp,
  Layers,
  History,
  FileCheck2,
} from 'lucide-react';
import { addFlashcard } from '../../storage/flashcardStore';
import { useVisualAlert } from '../../accessibility/VisualAlert';
import { useAnnounce } from '../../accessibility/useAnnounce';
import { useLanguage } from '../../i18n/LanguageContext';
import { deriveAnswerWithProof, type GKAnswer } from '../../ai/llmClient';
import { MarvelAvatar } from '../../components/ui/MarvelAvatar';

interface AnswerViewProps {
  question: string;
  result: GKAnswer;
  level: 1 | 2 | 3;
  isStreaming: boolean;
  onListen: (text: string) => void;
  onAskFollowUp: (q: string) => void;
  onReResearch?: (reason: string, feedback: string) => Promise<void>;
  isReResearching?: boolean;
  reResearchStep?: 1 | 2 | 3;
}

export const AnswerView: React.FC<AnswerViewProps> = ({
  question,
  result,
  level,
  isStreaming,
  onListen,
  onAskFollowUp,
  onReResearch,
  isReResearching = false,
  reResearchStep = 1,
}) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { showAlert } = useVisualAlert();
  const { announcePolite } = useAnnounce();

  const [activeResult, setActiveResult] = useState<GKAnswer>(result);
  const [isDerivingProof, setIsDerivingProof] = useState(false);
  const [derivationTab, setDerivationTab] = useState<'steps' | 'timeline' | 'citations'>('steps');
  const [showDerivationStudio, setShowDerivationStudio] = useState(true);

  useEffect(() => {
    setActiveResult(result);
  }, [result]);

  const [isFlagged, setIsFlagged] = useState(false);
  const [savedCard, setSavedCard] = useState(false);

  // Satisfaction & Re-Research Studio state
  const [satisfactionState, setSatisfactionState] = useState<'unanswered' | 'satisfied' | 'not_satisfied'>(
    result.is_deep_researched ? 'satisfied' : 'unanswered'
  );
  const [selectedReason, setSelectedReason] = useState<string>('Need deeper evidence & facts');
  const [customFeedback, setCustomFeedback] = useState<string>('');
  const [showCompareDrawer, setShowCompareDrawer] = useState<boolean>(false);

  const handleDeriveProof = async () => {
    if (isDerivingProof) return;
    setIsDerivingProof(true);
    announcePolite('Deriving answer with formal logical steps and citations...');
    try {
      const derived = await deriveAnswerWithProof(question, language, level);
      setActiveResult(derived);
      setShowDerivationStudio(true);
      announcePolite(`Derived verified answer: ${derived.answer}`);
      showAlert({
        type: 'success',
        title: 'Answer Derived & Verified',
        message: 'Step-by-step logical proof and citations generated successfully.',
      });
    } catch (err: any) {
      showAlert({ type: 'error', title: 'Derivation failed', message: err.message });
    } finally {
      setIsDerivingProof(false);
    }
  };

  const handleFlag = () => {
    setIsFlagged(true);
    announcePolite('Answer flagged as potentially incorrect.');
    showAlert({
      type: 'warning',
      title: 'Flagged Answer',
      message: 'This response has been recorded in your local history as flagged for review.',
    });
  };

  const handleSaveCard = async () => {
    try {
      await addFlashcard({
        front: question,
        back: result.answer,
        category: result.kind === 'gk' ? 'GENERAL KNOWLEDGE' : 'ACADEMIC CONCEPT',
      });
      setSavedCard(true);
      announcePolite('Saved question and answer as a flashcard.');
      showAlert({
        type: 'success',
        title: 'Saved to Flashcards',
        message: 'Question added to spaced repetition deck.',
      });
      setTimeout(() => setSavedCard(false), 3000);
    } catch {
      //
    }
  };

  const handleSatisfied = () => {
    setSatisfactionState('satisfied');
    announcePolite('Marked answer as satisfying.');
    showAlert({
      type: 'success',
      title: 'Satisfied',
      message: t('ask.satisfied_message', 'Great! Marked as satisfying your academic question.'),
    });
  };

  const handleNotSatisfiedClick = () => {
    setSatisfactionState('not_satisfied');
    announcePolite('Opened deep re-research options.');
  };

  const handleTriggerReResearch = async () => {
    if (!onReResearch || isReResearching) return;
    await onReResearch(selectedReason, customFeedback);
  };

  // If routed to math engine (Truth Rule 6)
  if (result.route === 'math_engine') {
    return (
      <div
        className="card"
        style={{
          borderLeft: '4px solid var(--accent-primary)',
          padding: '1.75rem',
          marginTop: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calculator size={22} color="var(--accent-primary)" />
          </div>
          <div>
            <span className="badge badge-info">{t('ask.math_route_title', 'Exact Math Engine Route')}</span>
            <h2 style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>{t('ask.math_route_desc', 'Deterministic Equation Detected')}</h2>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          {result.answer} {t('ask.math_route_body', 'The AI model never guesses arithmetic or invents formulas. Our on-device exact math solver can solve this with verified step-by-step proofs!')}
        </p>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate('/solve', { state: { initialProblem: question } })}
        >
          <Calculator size={18} />
          <span>{t('ask.btn_open_math', 'Solve in Exact Math Solver')}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  const confidenceBadge =
    result.confidence === 'high' ? (
      <span className="badge badge-success" title="High confidence: stable, verified fact" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <MarvelAvatar hero="cap" size="xs" />
        {t('ask.confidence', 'Confidence')}: {t('common.high', 'High')}
      </span>
    ) : result.confidence === 'medium' ? (
      <span className="badge badge-warning" title="Medium confidence: numbers/dates may vary by source" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <MarvelAvatar hero="ironman" size="xs" />
        {t('ask.confidence', 'Confidence')}: {t('common.medium', 'Medium')}
      </span>
    ) : (
      <span className="badge badge-error" title="Low confidence: uncertain, verify with official source" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <MarvelAvatar hero="strange" size="xs" />
        {t('ask.confidence', 'Confidence')}: {t('common.low', 'Low')}
      </span>
    );

  const quickReasons = [
    { id: 'Need deeper evidence & facts', label: t('ask.reason_evidence', 'Need deeper evidence & facts') },
    { id: 'Too brief / missing explanation', label: t('ask.reason_too_brief', 'Too brief / missing explanation') },
    { id: 'Too complex / simplify language', label: t('ask.reason_too_complex', 'Too complex / simplify language') },
    { id: 'Missed my specific point', label: t('ask.reason_missed_point', 'Missed my specific point') },
  ];

  return (
    <div
      className="card"
      style={{
        padding: '1.75rem',
        marginTop: '1.5rem',
        border: result.is_deep_researched ? '1px solid rgba(56, 189, 248, 0.4)' : undefined,
        boxShadow: result.is_deep_researched ? '0 0 20px rgba(56, 189, 248, 0.15)' : undefined,
      }}
    >
      {/* Header bar with Level, Badges, Re-Researched indicator, Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <MarvelAvatar hero={level === 1 ? 'spiderman' : level === 2 ? 'ironman' : 'strange'} size="xs" />
            {t('ask.level_prefix', 'Level')} {level}
          </span>
          {confidenceBadge}
          {result.is_deep_researched && (
            <span
              className="badge"
              style={{
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(129, 140, 248, 0.2) 100%)',
                color: 'var(--accent-primary)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <MarvelAvatar hero="jarvis" size="xs" />
              {t('ask.badge_re_researched', 'Deep Re-Research (Pass 2)')}
            </span>
          )}
          {result.time_sensitive && (
            <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}>
              <Clock size={12} style={{ marginRight: '4px' }} /> {t('ask.time_sensitive', 'Time-Sensitive')}
            </span>
          )}
          {result.retrievedFacts && result.retrievedFacts.length > 0 && (
            <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <MarvelAvatar hero="cap" size="xs" />
              {t('ask.verified_citations', 'Verified Fact Pack')}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleDeriveProof}
            disabled={isStreaming || isDerivingProof}
            aria-label={t('ask.btn_deep_derive', '✨ Deep Derive & Verify')}
            title={t('ask.btn_deep_derive_title', 'Execute logical derivation steps with gazette verification')}
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
              border: 'none',
              fontWeight: 600,
            }}
          >
            <Sparkles size={15} className={isDerivingProof ? 'spinning' : ''} />
            <span>{isDerivingProof ? t('ask.deriving', 'Deriving...') : t('ask.btn_deep_derive', '✨ Deep Derive & Verify')}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onListen(activeResult.spoken || activeResult.answer)}
            disabled={isStreaming || isReResearching || isDerivingProof}
            aria-label={t('ask.btn_listen', 'Listen to answer read aloud')}
          >
            <Volume2 size={16} />
            <span>{t('ask.btn_listen', 'Listen')}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleSaveCard}
            disabled={isStreaming || savedCard || isReResearching || isDerivingProof}
            aria-label={t('math.btn_save_card', 'Save this answer as a flashcard')}
          >
            {savedCard ? <Check size={16} color="var(--status-success)" /> : <BookOpen size={16} />}
            <span>{savedCard ? t('math.btn_saved', 'Saved!') : t('math.btn_save_card', 'Save Flashcard')}</span>
          </button>

          <button
            type="button"
            className={`btn btn-sm ${isFlagged ? 'btn-secondary' : 'btn-outline'}`}
            onClick={handleFlag}
            disabled={isFlagged || isReResearching || isDerivingProof}
            aria-label={t('ask.flag', 'Flag as incorrect')}
            title={t('ask.flag', 'Flag as incorrect')}
          >
            <Flag size={16} color={isFlagged ? 'var(--status-error)' : 'currentColor'} />
            <span>{isFlagged ? t('ask.flagged', 'Flagged') : t('ask.flag', 'Flag')}</span>
          </button>
        </div>
      </div>

      {/* Direct Answer (First Sentence Priority) */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>
          {activeResult.is_deep_researched
            ? t('ask.refined_answer_label', 'RE-RESEARCHED & REFINED ANSWER')
            : t('ask.direct_answer', 'DIRECT ANSWER')}
        </div>
        <div
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            lineHeight: 1.5,
            color: 'var(--text-primary)',
          }}
        >
          {activeResult.answer}
        </div>
      </div>

      {/* 🔬 Step-by-Step Fact Derivation & Verification Studio */}
      <div
        style={{
          marginTop: '1.25rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Studio Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <Layers size={19} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>{t('ask.derivation_studio_title', 'Step-by-Step Fact Derivation & Verification')}</span>
                <span
                  className="badge"
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10B981',
                    fontSize: '0.75rem',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <ShieldCheck size={11} style={{ marginRight: '3px' }} />
                  {t('ask.verified_proof_badge', 'Verified Proof')}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {t('ask.derivation_studio_desc', 'Formal logical deduction distinguishing current officeholders from historical figures')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleDeriveProof}
              disabled={isDerivingProof || isStreaming}
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                fontSize: '0.8rem',
                padding: '5px 12px',
              }}
            >
              <Sparkles size={14} className={isDerivingProof ? 'spinning' : ''} />
              <span>{isDerivingProof ? t('ask.deriving', 'Deriving...') : t('ask.btn_deep_derive', '✨ Deep Derive & Verify')}</span>
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowDerivationStudio((prev) => !prev)}
              aria-label="Toggle Derivation Studio"
            >
              {showDerivationStudio ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {showDerivationStudio && (
          <div style={{ marginTop: '1rem' }}>
            {/* Tabs Bar */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                paddingBottom: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                className={`btn btn-sm ${derivationTab === 'steps' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setDerivationTab('steps')}
                style={{ fontSize: '0.8rem', padding: '4px 10px' }}
              >
                <Layers size={14} />
                <span>{t('ask.tab_derivation_steps', '1. Logical Derivation Steps')}</span>
              </button>

              {activeResult.timeline_context && (
                <button
                  type="button"
                  className={`btn btn-sm ${derivationTab === 'timeline' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setDerivationTab('timeline')}
                  style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                >
                  <History size={14} />
                  <span>{t('ask.tab_timeline', '2. Officeholder Timeline (Current vs 1st)')}</span>
                </button>
              )}

              <button
                type="button"
                className={`btn btn-sm ${derivationTab === 'citations' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setDerivationTab('citations')}
                style={{ fontSize: '0.8rem', padding: '4px 10px' }}
              >
                <FileCheck2 size={14} />
                <span>{t('ask.tab_citations', '3. Gazette & Legal Authority')}</span>
              </button>
            </div>

            {/* Tab 1: Derivation Steps */}
            {derivationTab === 'steps' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {activeResult.derivation_steps && activeResult.derivation_steps.length > 0 ? (
                  activeResult.derivation_steps.map((st) => (
                    <div
                      key={st.step}
                      style={{
                        padding: '0.85rem 1rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 'var(--radius-md)',
                        borderLeft:
                          st.status === 'concluded'
                            ? '3px solid #10B981'
                            : st.status === 'disambiguated'
                            ? '3px solid #F59E0B'
                            : '3px solid #38BDF8',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '0.4rem',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              background: 'rgba(56, 189, 248, 0.15)',
                              color: 'var(--accent-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            {st.step}
                          </span>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                            {st.title}
                          </span>
                        </div>

                        <span
                          className="badge"
                          style={{
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            background:
                              st.status === 'concluded'
                                ? 'rgba(16, 185, 129, 0.15)'
                                : st.status === 'disambiguated'
                                ? 'rgba(245, 158, 11, 0.15)'
                                : 'rgba(56, 189, 248, 0.15)',
                            color:
                              st.status === 'concluded'
                                ? '#10B981'
                                : st.status === 'disambiguated'
                                ? '#F59E0B'
                                : 'var(--accent-primary)',
                          }}
                        >
                          {st.status}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.35rem' }}>
                        {st.summary}
                      </div>

                      {st.evidence && (
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>🔍 <strong>Evidence:</strong> {st.evidence}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0.75rem' }}>
                    Click &ldquo;✨ Deep Derive & Verify&rdquo; above to generate formal derivation steps for this question.
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Timeline Context */}
            {derivationTab === 'timeline' && activeResult.timeline_context && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                }}
              >
                {/* Historical */}
                <div
                  style={{
                    padding: '1rem',
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#EF4444', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    🏛️ Historical Predecessor (1st)
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {activeResult.timeline_context.historical_figure}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    <strong>Tenure:</strong> {activeResult.timeline_context.historical_tenure}
                  </div>
                  <div
                    style={{
                      fontSize: '0.775rem',
                      padding: '4px 8px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#F87171',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    ⚠️ Historical Officeholder — Not the current incumbent!
                  </div>
                </div>

                {/* Incumbent */}
                <div
                  style={{
                    padding: '1rem',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    🇮🇳 Active Incumbent (Current)
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {activeResult.timeline_context.incumbent_figure}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    <strong>Tenure:</strong> {activeResult.timeline_context.incumbent_tenure}
                  </div>
                  <div
                    style={{
                      fontSize: '0.775rem',
                      padding: '4px 8px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34D399',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    ✅ Active Executive Head of Government (2026)
                  </div>
                </div>

                {/* Legal Mandate */}
                {activeResult.timeline_context.governing_law && (
                  <div
                    style={{
                      gridColumn: '1 / -1',
                      padding: '0.75rem 1rem',
                      background: 'rgba(56, 189, 248, 0.06)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    ⚖️ <strong>Governing Constitutional Framework:</strong> {activeResult.timeline_context.governing_law}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Official Citations */}
            {derivationTab === 'citations' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  🏛️ <strong>Prime Minister&apos;s Office (PMO India):</strong> Official gazette portal at <code>pmindia.gov.in</code>
                </div>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  🗳️ <strong>Election Commission of India:</strong> Certified general election results (2014, 2019, 2024 Lok Sabha)
                </div>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  📜 <strong>Constitution of India (Article 75):</strong> Legislative Department, Ministry of Law and Justice, Govt of India
                </div>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Visual Image Support for Archive Questions (e.g., Identify Tree, Monument, Bird) */}
      {activeResult.retrievedFacts && activeResult.retrievedFacts.some((f) => f.image) && (
        <div
          style={{
            margin: '1rem 0 1.25rem',
            padding: '1rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
          }}
        >
          {activeResult.retrievedFacts
            .filter((f): f is typeof f & { image: string } => Boolean(f.image))
            .map((f, i) => (
              <div key={i} style={{ display: 'inline-block', maxWidth: '360px', width: '100%' }}>
                <img
                  src={f.image}
                  alt={f.answer}
                  style={{
                    maxHeight: '240px',
                    width: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    boxShadow: 'var(--shadow-md)',
                  }}
                />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  📸 {f.answer}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Dedicated Why & How: Concise Explanation Card (Provided especially during deep research or detailed reasoning) */}
      {activeResult.detailed_explanation && (
        <div
          style={{
            padding: '1.25rem',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(129, 140, 248, 0.06) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'var(--accent-primary)',
              marginBottom: '0.4rem',
            }}
          >
            <Sparkles size={18} />
            <span>{t('ask.concise_explanation_title', 'Why & How: Concise Explanation')}</span>
          </div>
          <p style={{ fontSize: '0.975rem', color: 'var(--text-primary)', lineHeight: 1.65, margin: 0 }}>
            {activeResult.detailed_explanation}
          </p>
          {activeResult.satisfaction_guarantee && (
            <div
              style={{
                marginTop: '0.6rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle2 size={14} color="var(--status-success)" />
              <span>{activeResult.satisfaction_guarantee}</span>
            </div>
          )}
        </div>
      )}

      {/* Compare Drawer: Previous Answer vs. Re-Researched Answer */}
      {activeResult.previous_answer && (
        <div style={{ marginBottom: '1.25rem' }}>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setShowCompareDrawer((prev) => !prev)}
            style={{
              fontSize: '0.85rem',
              color: 'var(--accent-secondary)',
              border: '1px dashed var(--border-medium)',
              padding: '4px 10px',
            }}
          >
            <GitCompare size={15} />
            <span>{t('ask.compare_versions', 'Compare: Original vs. Re-Researched Answer')}</span>
            {showCompareDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showCompareDrawer && (
            <div
              style={{
                marginTop: '0.75rem',
                padding: '1rem',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>
                  {t('ask.prev_answer_label', 'Original Answer')}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {activeResult.previous_answer}
                </div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid var(--accent-primary)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
                  {t('ask.refined_answer_label', 'Re-Researched & Refined Answer')}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {activeResult.answer}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Key Facts (2 to 5 Bullet Points) */}
      {activeResult.key_facts && activeResult.key_facts.length > 0 && (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>
            {t('ask.key_facts', 'Key Facts')}:
          </div>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {activeResult.key_facts.map((fact, idx) => (
              <li key={idx} style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {fact}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Don't Confuse With Callout */}
      {activeResult.dont_confuse_with && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            padding: '0.875rem 1rem',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
          }}
        >
          <Info size={18} color="var(--status-warning)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 600, color: 'var(--status-warning)' }}>{t('ask.dont_confuse', 'Don\'t Confuse With')}: </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {activeResult.dont_confuse_with}
            </span>
          </div>
        </div>
      )}

      {/* Memory Hook Card (Levels 1 & 2) */}
      {activeResult.memory_hook && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            padding: '0.875rem 1rem',
            background: 'rgba(129, 140, 248, 0.1)',
            border: '1px solid rgba(129, 140, 248, 0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
          }}
        >
          <Lightbulb size={18} color="var(--accent-secondary)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <span style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>{t('ask.memory_hook', 'Memory Hook')}: </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {activeResult.memory_hook}
            </span>
          </div>
        </div>
      )}

      {/* Time-Sensitive Caveat */}
      {activeResult.caveat && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            padding: '0.75rem 1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-medium)',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}
        >
          <AlertCircle size={16} color="var(--status-warning)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <strong>{t('ask.notice', 'Notice')}:</strong> {activeResult.caveat} {activeResult.as_of ? `(${t('ask.info_as_of', 'Information as of')}: ${activeResult.as_of})` : ''}
          </div>
        </div>
      )}

      {/* RAG Fact Citations */}
      {activeResult.retrievedFacts && activeResult.retrievedFacts.length > 0 && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
            {t('ask.verified_citations', 'Verified Fact Pack Citations')}:
          </div>
          {activeResult.retrievedFacts.map((rf) => (
            <div key={rf.id}>
              • <strong>{rf.answer}</strong> — {t('ask.source', 'Source')}: {rf.source} ({t('ask.verified_on', 'Verified')}: {rf.verified_on})
            </div>
          ))}
        </div>
      )}


      {/* SATISFACTION FEEDBACK & DEEP RE-RESEARCH MODULE */}
      <div
        style={{
          margin: '1.5rem 0',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
        }}
      >
        {satisfactionState === 'unanswered' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {t('ask.satisfaction_prompt', 'Are you satisfied with this answer?')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {t('ask.satisfaction_sub', 'If not satisfied, our AI will re-evaluate and research deeper to provide a satisfying, concise explanation.')}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleSatisfied}
                style={{ borderColor: 'var(--status-success)', color: 'var(--status-success)' }}
              >
                <ThumbsUp size={16} />
                <span>{t('ask.btn_satisfied', 'Yes, Satisfied 👍')}</span>
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleNotSatisfiedClick}
              >
                <ThumbsDown size={16} />
                <span>{t('ask.btn_not_satisfied', 'Not Satisfied — Research Again 👎')}</span>
              </button>
            </div>
          </div>
        )}

        {satisfactionState === 'satisfied' && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--status-success)', fontWeight: 600 }}>
              <CheckCircle2 size={18} />
              <span>{t('ask.satisfied_message', 'Great! Marked as satisfying your academic question.')}</span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setSatisfactionState('not_satisfied')}
              style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}
            >
              <RotateCw size={12} />
              <span>{t('ask.btn_research_anyway', 'Want deeper research anyway?')}</span>
            </button>
          </div>
        )}

        {satisfactionState === 'not_satisfied' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <Sparkles size={18} color="var(--accent-primary)" />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                {t('ask.research_again_title', 'Deep Academic Re-Research')}
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
              {t('ask.research_again_desc', 'Tell us what was missing so the AI can re-evaluate the question, cross-reference verified knowledge, and deliver a concise, satisfying explanation.')}
            </p>

            {/* Quick Reason Chips */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                {t('ask.research_reason_label', 'What could be improved? (Select a quick reason):')}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {quickReasons.map((qr) => {
                  const isSelected = selectedReason === qr.id;
                  return (
                    <button
                      key={qr.id}
                      type="button"
                      className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setSelectedReason(qr.id)}
                      disabled={isReResearching}
                      style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                    >
                      {qr.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Custom Feedback */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="custom-feedback" style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                {t('ask.custom_feedback_label', 'Custom guidance (optional):')}
              </label>
              <input
                id="custom-feedback"
                type="text"
                className="input"
                value={customFeedback}
                onChange={(e) => setCustomFeedback(e.target.value)}
                placeholder={t('ask.custom_feedback_placeholder', 'e.g., Focus on the exact mechanism, clarify dates, or explain with an analogy...')}
                disabled={isReResearching}
                style={{ width: '100%', fontSize: '0.9rem' }}
              />
            </div>

            {/* Live Step-by-Step Research Progress Tracker */}
            {isReResearching && (
              <div
                style={{
                  marginBottom: '1.25rem',
                  padding: '1rem',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RotateCw size={16} className="spinning" />
                  <span>{t('ask.live_research_in_progress', 'Deep Re-Research in Progress...')}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: reResearchStep >= 1 ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: reResearchStep === 1 ? 600 : 400,
                    }}
                  >
                    {reResearchStep > 1 ? (
                      <CheckCircle2 size={16} color="var(--status-success)" />
                    ) : (
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--accent-primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                    )}
                    <span>{t('ask.research_step1', 'Step 1: Re-evaluating question nuances and identifying previous gaps...')}</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: reResearchStep >= 2 ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: reResearchStep === 2 ? 600 : 400,
                    }}
                  >
                    {reResearchStep > 2 ? (
                      <CheckCircle2 size={16} color="var(--status-success)" />
                    ) : reResearchStep === 2 ? (
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--accent-primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--border-medium)' }} />
                    )}
                    <span>{t('ask.research_step2', 'Step 2: Deep-searching academic sources and cross-referencing verified knowledge...')}</span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      color: reResearchStep >= 3 ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: reResearchStep === 3 ? 600 : 400,
                    }}
                  >
                    {reResearchStep === 3 ? (
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid var(--accent-primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--border-medium)' }} />
                    )}
                    <span>{t('ask.research_step3', 'Step 3: Synthesizing verified result with clear, concise explanation...')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setSatisfactionState('unanswered')}
                disabled={isReResearching}
              >
                {t('common.cancel', 'Cancel')}
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleTriggerReResearch}
                disabled={isReResearching}
              >
                <Sparkles size={16} />
                <span>{isReResearching ? t('ask.btn_researching', 'Researching...') : t('ask.btn_start_re_research', 'Start Deep Re-Research')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Follow-Up Question */}
      {result.follow_up && (
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            {t('ask.follow_up', 'Suggested Next Question')}:
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => onAskFollowUp(result.follow_up)}
            style={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              width: '100%',
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: 'var(--accent-primary)',
              padding: '0.6rem 1rem',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            <span>👉 {result.follow_up}</span>
          </button>
        </div>
      )}

      {/* AI Limits Disclaimer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <AlertCircle size={14} />
        <span>
          {t('ask.disclaimer', 'AI can make mistakes — always cross-reference critical facts in official school textbooks.')}
        </span>
      </div>
    </div>
  );
};
