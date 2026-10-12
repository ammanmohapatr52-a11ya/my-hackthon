import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AnswerView } from '../features/ask/AnswerView';
import {
  askIntelligentTutor,
  developQuestion,
  reResearchQuestion,
  type GKAnswer,
  type DevelopedQuestionOption,
  DEFAULT_OPENROUTER_MODEL,
} from '../ai/llmClient';
import { useSpeechInput } from '../speech/useSpeechInput';
import { useSpeechOutput } from '../speech/useSpeechOutput';
import { useAccessibility } from '../accessibility/AccessibilityContext';
import { useAnnounce } from '../accessibility/useAnnounce';
import { useVisualAlert } from '../accessibility/VisualAlert';
import { addHistoryItem } from '../storage/historyStore';
import { getSetting, setSetting } from '../storage/settingsStore';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Mic,
  MicOff,
  Send,
  Square,
  Sparkles,
  Cpu,
  Globe,
  RotateCw,
  Keyboard,
  X,
  ArrowRight,
} from 'lucide-react';
import { VirtualKeypad } from '../components/ui/VirtualKeypad';

export const AskPage: React.FC = () => {
  const location = useLocation();
  const { modes } = useAccessibility();
  const { announcePolite } = useAnnounce();
  const { showAlert } = useVisualAlert();
  const { t, language } = useLanguage();

  const getDefaultQuestion = (lang: string) => {
    if (lang === 'or') return 'ଭାରତର ସମ୍ବିଧାନ କେବେ କାର୍ଯ୍ୟକାରୀ ହୋଇଥିଲା?';
    if (lang === 'hi') return 'भारत का संविधान कब लागू हुआ था?';
    return 'When did the Indian Constitution come into force?';
  };

  const [question, setQuestion] = useState(() => getDefaultQuestion(language));
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const [showKeypad, setShowKeypad] = useState(false);
  const [aiProvider, setAiProvider] = useState<'openrouter' | 'ollama'>('openrouter');
  const [activeModel, setActiveModel] = useState(DEFAULT_OPENROUTER_MODEL);
  const [isOllamaRunning, setIsOllamaRunning] = useState<boolean | null>(null);

  const [currentResult, setCurrentResult] = useState<GKAnswer | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Question Development Studio state
  const [developedOptions, setDevelopedOptions] = useState<DevelopedQuestionOption[]>([]);
  const [isDevelopingQuestion, setIsDevelopingQuestion] = useState(false);

  // Deep Re-Research state
  const [isReResearching, setIsReResearching] = useState(false);
  const [reResearchStep, setReResearchStep] = useState<1 | 2 | 3>(1);

  const abortControllerRef = useRef<AbortController | null>(null);
  const prevLangRef = useRef(language);

  const { isSupported: micSupported, isListening, transcript, startListening, stopListening } = useSpeechInput();
  const { speakText, stop: stopSpeech } = useSpeechOutput();

  useEffect(() => {
    async function loadSettings() {
      const prov = await getSetting<'openrouter' | 'ollama'>('aiProvider', 'openrouter');
      const orModel = await getSetting<string>('openRouterModel', DEFAULT_OPENROUTER_MODEL);
      const defaultLvl = await getSetting<1 | 2 | 3>('defaultLevel', 2);
      setAiProvider(prov);
      setActiveModel(orModel);
      if (modes.simplifiedLearning) {
        setLevel(1);
      } else {
        setLevel(defaultLvl);
      }

      // Check if Local Ollama is actually reachable
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const res = await fetch('http://localhost:11434/api/tags', { signal: controller.signal });
        clearTimeout(timeoutId);
        setIsOllamaRunning(res.ok);
      } catch {
        setIsOllamaRunning(false);
      }
    }
    loadSettings();
  }, [modes.simplifiedLearning]);

  // Synchronize language changes: adapt default question and refresh current answer in selected language
  useEffect(() => {
    if (prevLangRef.current !== language) {
      const prevDefault = getDefaultQuestion(prevLangRef.current);
      const newDefault = getDefaultQuestion(language);
      prevLangRef.current = language;

      if (!question || question === prevDefault) {
        setQuestion(newDefault);
      }

      setDevelopedOptions([]);

      if (currentResult) {
        const targetQ = question === prevDefault ? newDefault : question;
        handleAsk(targetQ);
      }
    }
  }, [language]);

  useEffect(() => {
    if (location.state?.prefilledQuestion) {
      setQuestion(location.state.prefilledQuestion);
      handleAsk(location.state.prefilledQuestion);
    }
  }, [location.state]);

  useEffect(() => {
    if (transcript) {
      setQuestion(transcript);
    }
  }, [transcript]);

  const handleProviderToggle = async (newProvider: 'openrouter' | 'ollama') => {
    setAiProvider(newProvider);
    await setSetting('aiProvider', newProvider);
    announcePolite(`Switched AI provider to ${newProvider === 'openrouter' ? 'OpenRouter Cloud API' : 'Local Ollama'}.`);
  };

  const handleAsk = async (qText = question) => {
    if (!qText.trim() || isGenerating) return;
    stopSpeech();

    setCurrentResult(null);
    setIsGenerating(true);
    setDevelopedOptions([]);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    announcePolite('Querying intelligent academic tutor...');

    try {
      await askIntelligentTutor(qText, level, controller.signal, {
        onChunk: () => {},
        onDone: async (result) => {
          setIsGenerating(false);
          setCurrentResult(result);
          announcePolite(`Answer ready: ${result.answer}`);
          showAlert({
            type: 'info',
            title: 'Tutor Answer Ready',
            message: result.answer.slice(0, 90) + (result.answer.length > 90 ? '...' : ''),
          });

          // Save to history (gated by saveHistory preference)
          await addHistoryItem({
            type: 'ask',
            title: qText.slice(0, 50) + (qText.length > 50 ? '...' : ''),
            input: qText,
            output: result.answer,
          });

          if (modes.voice) {
            speakText(result.spoken || result.answer);
          }
        },
        onError: (err) => {
          setIsGenerating(false);
          showAlert({ type: 'error', title: 'Query Failed', message: err.message });
        },
      });
    } catch (err: any) {
      setIsGenerating(false);
      showAlert({ type: 'error', title: 'Generation Error', message: err.message });
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setIsReResearching(false);
      announcePolite('Query generation canceled.');
    }
  };

  const handleDevelopQuestion = async () => {
    if (!question.trim() || isDevelopingQuestion || isGenerating) return;
    setIsDevelopingQuestion(true);
    announcePolite('Analyzing question to produce developed academic variations...');

    try {
      const options = await developQuestion(question, language, level);
      setDevelopedOptions(options);
      announcePolite(`Generated ${options.length} developed question variations.`);
      showAlert({
        type: 'info',
        title: 'Questions Developed',
        message: '3 rich academic variations generated in the Question Development Studio below.',
      });
    } catch (err: any) {
      showAlert({ type: 'error', title: 'Could not develop question', message: err.message });
    } finally {
      setIsDevelopingQuestion(false);
    }
  };

  const handleReResearch = async (reason: string, feedback: string) => {
    if (!currentResult || isReResearching) return;
    stopSpeech();
    setIsReResearching(true);
    setReResearchStep(1);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    announcePolite('Starting deep academic re-research...');

    try {
      const refined = await reResearchQuestion({
        question,
        previousAnswer: currentResult.answer,
        dissatisfactionReason: reason,
        customFeedback: feedback,
        level,
        signal: controller.signal,
        onStepChange: (step) => setReResearchStep(step),
      });

      setCurrentResult(refined);
      setIsReResearching(false);
      announcePolite(`Deep academic re-research completed. Refined answer ready.`);
      showAlert({
        type: 'success',
        title: 'Deep Re-Research Completed',
        message: refined.answer.slice(0, 90) + (refined.answer.length > 90 ? '...' : ''),
      });

      // Save refined answer to local history
      await addHistoryItem({
        type: 'ask',
        title: `[Re-Researched] ${question.slice(0, 45)}`,
        input: question,
        output: `${refined.answer}\n\nExplanation: ${refined.detailed_explanation || ''}`,
      });

      if (modes.voice) {
        speakText(refined.spoken || refined.answer);
      }
    } catch (err: any) {
      setIsReResearching(false);
      if (!abortControllerRef.current?.signal.aborted) {
        showAlert({ type: 'error', title: 'Re-Research Failed', message: err.message });
      }
    }
  };

  const sampleQuestions =
    language === 'or'
      ? [
          { label: 'ଜିକେ ତଥ୍ୟ: ସାଧାରଣତନ୍ତ୍ର ଦିବସ / ସମ୍ବିଧାନ', val: 'ଭାରତର ସମ୍ବିଧାନ କେବେ କାର୍ଯ୍ୟକାରୀ ହୋଇଥିଲା?' },
          { label: 'ଭୁଲ ଧାରଣା: ସିଡନୀ ରାଜଧାନୀ?', val: 'ଅଷ୍ଟ୍ରେଲିଆର ରାଜଧାନୀ ସିଡନୀ କାହିଁକି?' },
          { label: 'ବିଜ୍ଞାନ: ଆଲୋକ ଶ୍ଳେଷଣ ସୂତ୍ର', val: 'ଆଲୋକ ଶ୍ଳେଷଣ କିପରି ଗ୍ଲୁକୋଜ୍ ଏବଂ ଅମ୍ଳଜାନ ଉତ୍ପନ୍ନ କରେ?' },
          { label: 'ସମୟ-ସମ୍ବେଦନଶୀଳ: ଭାରତର ଜନସଂଖ୍ୟା', val: 'ଭାରତର ବର୍ତ୍ତମାନର ଜନସଂଖ୍ୟା କେତେ?' },
          { label: 'ଗଣିତ ପରୀକ୍ଷା: 2x + 6 = 14 ସମାଧାନ', val: '2x + 6 = 14 ସମାଧାନ କରନ୍ତୁ' },
        ]
      : language === 'hi'
      ? [
          { label: 'सामान्य ज्ञान: गणतंत्र दिवस / संविधान', val: 'भारत का संविधान कब लागू हुआ था?' },
          { label: 'गलत धारणा: क्या सिडनी राजधानी है?', val: 'ऑस्ट्रेलिया की राजधानी सिडनी क्यों है?' },
          { label: 'विज्ञान: प्रकाश संश्लेषण सूत्र', val: 'प्रकाश संश्लेषण से ग्लूकोज और ऑक्सीजन कैसे बनते हैं?' },
          { label: 'समय-संवेदनशील: भारत की जनसंख्या', val: 'वर्तमान में भारत की जनसंख्या कितनी है?' },
          { label: 'गणित रूटिंग: 2x + 6 = 14 हल करें', val: '2x + 6 = 14 हल करें' },
        ]
      : [
          { label: 'GK Fact: Republic Day / Constitution', val: 'When did the Indian Constitution come into force?' },
          { label: 'False Premise Test: Sydney Capital?', val: 'Why is Sydney the capital of Australia?' },
          { label: 'Science: Photosynthesis Formula', val: 'How does photosynthesis produce glucose and oxygen?' },
          { label: 'Time-Sensitive: India Population', val: 'What is the current population of India?' },
          { label: 'Math Routing Test: Solve 2x + 6 = 14', val: 'Solve 2x + 6 = 14' },
        ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>{t('ask.title', 'Ask an Academic Question')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {t('ask.desc', 'Accessible general-knowledge and conceptual tutoring powered by verifiable prompt engineering and RAG.')}
        </p>
      </div>

      {/* Provider Selector Banner */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(129, 140, 248, 0.05) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {aiProvider === 'openrouter' ? (
              <Globe size={20} color="var(--accent-primary)" />
            ) : (
              <Cpu size={20} color="var(--status-success)" />
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                {t('ask.provider_label', 'Active AI Engine')}: {aiProvider === 'openrouter' ? t('ask.provider_openrouter', 'OpenRouter Cloud AI') : t('ask.provider_ollama', 'Local Ollama')}
              </span>
              {aiProvider === 'openrouter' ? (
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                  {t('common.ready', 'Cloud Ready')}
                </span>
              ) : isOllamaRunning ? (
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                  {t('common.ready', 'Ollama Online')}
                </span>
              ) : (
                <span className="badge badge-warning" style={{ fontSize: '0.7rem', background: 'rgba(234, 179, 8, 0.2)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.4)' }}>
                  Offline · Auto-Failover to Cloud
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {aiProvider === 'openrouter'
                ? t('ask.model_configured', `Model: ${activeModel} · Verified Knowledge`).replace('{model}', activeModel)
                : isOllamaRunning
                ? t('ask.runs_localhost', 'Runs 100% on localhost:11434')
                : 'Ollama not detected on localhost:11434 · Auto-routing queries to OpenRouter Cloud'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${aiProvider === 'openrouter' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleProviderToggle('openrouter')}
          >
            <Globe size={14} />
            <span>{t('ask.provider_openrouter', 'OpenRouter Cloud')}</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${aiProvider === 'ollama' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleProviderToggle('ollama')}
          >
            <Cpu size={14} />
            <span>{t('ask.provider_ollama', 'Local Ollama')}</span>
          </button>
        </div>
      </div>

      {/* Question Form */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="question-input" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {t('ask.input_label', 'What would you like to understand?')}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {question.length}/2000 {t('ask.characters', 'characters')}
                </span>
              </div>
            </div>

            <textarea
              id="question-input"
              className="textarea"
              rows={3}
              maxLength={2000}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t('ask.placeholder', 'Ask any academic concept, history, science, or general knowledge question...')}
              style={{ fontSize: '1rem', resize: 'vertical' }}
              required
            />

            {/* Question Development Studio Button + Options Panel */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={handleDevelopQuestion}
                  disabled={!question.trim() || isDevelopingQuestion || isGenerating}
                  style={{
                    borderColor: 'var(--accent-secondary)',
                    color: 'var(--accent-secondary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}
                >
                  {isDevelopingQuestion ? (
                    <RotateCw size={14} className="spinning" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  <span>
                    {isDevelopingQuestion
                      ? t('ask.develop_btn_analyzing', 'Developing Question...')
                      : t('ask.develop_btn', '✨ Develop Question')}
                  </span>
                </button>

                <button
                  type="button"
                  className={`btn btn-sm ${showKeypad ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setShowKeypad((prev) => !prev)}
                  style={{
                    fontSize: '0.825rem',
                    gap: '4px',
                    border: '1px solid var(--border-subtle)',
                  }}
                  aria-expanded={showKeypad}
                >
                  <Keyboard size={14} />
                  <span>{t('cards.toggle_keypad', '⌨️ Easy Keypad & Symbols')}</span>
                </button>

                {question && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setQuestion('')}
                    style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                    title={t('ask.btn_clear', 'Clear')}
                  >
                    <X size={13} />
                    <span>{t('ask.btn_clear', 'Clear')}</span>
                  </button>
                )}
              </div>

              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {t('ask.develop_hint', 'Develop query with academic scope, deeper mechanisms, or broader context')}
              </span>
            </div>

            {/* Virtual Keypad & Academic Starters Accordion */}
            {showKeypad && (
              <div style={{ marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                <VirtualKeypad
                  onInsert={(text) => {
                    setQuestion((prev) => {
                      if (!prev) return text;
                      if (prev.endsWith(' ') || text.startsWith('²') || text.startsWith('³') || text.startsWith('°')) {
                        return prev + text;
                      }
                      return prev + ' ' + text;
                    });
                    announcePolite(`Inserted ${text}`);
                  }}
                />
              </div>
            )}

            {/* Collapsible Question Development Studio Panel */}
            {developedOptions.length > 0 && (
              <div
                className="card"
                style={{
                  marginTop: '0.5rem',
                  padding: '1.25rem',
                  background: 'linear-gradient(135deg, rgba(129, 140, 248, 0.08) 0%, rgba(56, 189, 248, 0.05) 100%)',
                  border: '1px solid rgba(129, 140, 248, 0.35)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} color="var(--accent-secondary)" />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t('ask.develop_title', 'Question Development Studio')}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setDevelopedOptions([])}
                    style={{ fontSize: '0.75rem' }}
                  >
                    ✕ {t('ask.develop_close', 'Close Suggestions')}
                  </button>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  {t('ask.develop_desc', 'Develop and refine your question into rich, academic variations before asking:')}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                  {developedOptions.map((opt, i) => (
                    <div
                      key={i}
                      className="card"
                      style={{
                        padding: '1rem',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>{opt.title}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          {opt.description}
                        </div>
                        <div style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.45 }}>
                          "{opt.developedText}"
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          setQuestion(opt.developedText);
                          setDevelopedOptions([]);
                          announcePolite(`Applied developed question: ${opt.developedText}`);
                        }}
                        style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}
                      >
                        <span>{t('ask.develop_use_btn', 'Use this developed question')}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginTop: '0.25rem',
              }}
            >
              {/* Explanation Level Selector */}
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${level === 1 ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setLevel(1)}
                  aria-pressed={level === 1}
                >
                  {t('ask.level1', 'Level 1: Very Simple')}
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${level === 2 ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setLevel(2)}
                  aria-pressed={level === 2}
                >
                  {t('ask.level2', 'Level 2: Student')}
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${level === 3 ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setLevel(3)}
                  aria-pressed={level === 3}
                >
                  {t('ask.level3', 'Level 3: Advanced')}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {micSupported && (
                  <button
                    type="button"
                    className={`btn ${isListening ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={isListening ? stopListening : startListening}
                    aria-label={isListening ? 'Stop recording voice' : 'Dictate question with mic'}
                  >
                    {isListening ? <Mic size={18} /> : <MicOff size={18} />}
                  </button>
                )}

                {isGenerating || isReResearching ? (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    style={{ borderColor: 'var(--status-error)', color: 'var(--status-error)' }}
                  >
                    <Square size={16} />
                    <span>{t('common.cancel', 'Cancel')}</span>
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    <Send size={16} />
                    <span>{t('ask.btn_ask', 'Ask Tutor')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Example Presets showcasing Document 06 test cases */}
        <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('ask.try_test_questions', 'Try test questions:')}</span>
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setQuestion(sq.val);
                handleAsk(sq.val);
              }}
              style={{
                fontSize: '0.775rem',
                border: '1px solid var(--border-subtle)',
                padding: '2px 8px',
              }}
            >
              {sq.label}
            </button>
          ))}
        </div>
      </div>

      {/* Answer View with Rich GK Schema, Satisfaction Feedback & Deep Re-Research */}
      {currentResult && (
        <AnswerView
          question={question}
          result={currentResult}
          level={level}
          isStreaming={isGenerating}
          onListen={(txt) => speakText(txt)}
          onAskFollowUp={(followUp) => {
            setQuestion(followUp);
            handleAsk(followUp);
          }}
          onReResearch={handleReResearch}
          isReResearching={isReResearching}
          reResearchStep={reResearchStep}
        />
      )}
    </div>
  );
};
