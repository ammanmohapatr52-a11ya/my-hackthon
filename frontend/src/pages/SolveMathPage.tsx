import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { solveMathProblem } from '../math/solve';
import { solveMathWithAI } from '../math/aiSolver';
import type { MathSolution, MathStep } from '../math/types';
import { KaTeXMath } from '../components/ui/KaTeXMath';
import { CheckedStatus } from '../features/solve-math/CheckedStatus';
import { StepList } from '../features/solve-math/StepList';
import { SolutionActions } from '../features/solve-math/SolutionActions';
import { useSpeechInput } from '../speech/useSpeechInput';
import { useSpeechOutput } from '../speech/useSpeechOutput';
import { useAccessibility } from '../accessibility/AccessibilityContext';
import { useAnnounce } from '../accessibility/useAnnounce';
import { useVisualAlert } from '../accessibility/VisualAlert';
import { useLanguage } from '../i18n/LanguageContext';
import { addHistoryItem } from '../storage/historyStore';
import { getSetting } from '../storage/settingsStore';
import {
  Calculator,
  Mic,
  MicOff,
  Sparkles,
  Layers,
  ArrowRight,
  HelpCircle,
  Activity,
  Keyboard,
  Delete,
  X,
  RotateCcw,
} from 'lucide-react';
import { VirtualKeypad } from '../components/ui/VirtualKeypad';

export const SolveMathPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { modes } = useAccessibility();
  const { announcePolite } = useAnnounce();
  const { showAlert } = useVisualAlert();
  const { t, language } = useLanguage();

  const [inputVal, setInputVal] = useState('2x + 6 = 14');
  const [level, setLevel] = useState<1 | 2 | 3>(2);
  const [solution, setSolution] = useState<MathSolution | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showKeypad, setShowKeypad] = useState(false);
  const [isAiSolving, setIsAiSolving] = useState(false);

  const { isSupported: micSupported, isListening, transcript, startListening, stopListening } = useSpeechInput();
  const { speakText, stop: stopSpeech, isPlaying } = useSpeechOutput();

  const quickMathSymbols = [
    { label: 'x²', val: '²' },
    { label: 'x³', val: '³' },
    { label: '√', val: '√' },
    { label: 'π', val: 'π' },
    { label: 'sin', val: 'sin(' },
    { label: 'cos', val: 'cos(' },
    { label: 'tan', val: 'tan(' },
    { label: 'log', val: 'log(' },
    { label: 'ln', val: 'ln(' },
    { label: '∫ dx', val: 'integrate ' },
    { label: '%', val: '% of ' },
    { label: '!', val: '!' },
    { label: '+', val: ' + ' },
    { label: '-', val: ' - ' },
    { label: '×', val: ' * ' },
    { label: '÷', val: ' / ' },
    { label: '=', val: ' = ' },
    { label: 'd/dx', val: 'd/dx(' },
    { label: '( )', val: '()' },
    { label: 'x', val: 'x' },
    { label: 'y', val: 'y' },
  ];

  const handleInsertSymbol = (val: string) => {
    setInputVal((prev) => prev + val);
    announcePolite(`Inserted ${val}`);
  };

  const handleBackspace = () => {
    setInputVal((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setInputVal('');
  };

  // Load default level from settings
  useEffect(() => {
    async function loadDefaultLevel() {
      const stored = await getSetting<1 | 2 | 3>('defaultLevel', 2);
      if (modes.simplifiedLearning) {
        setLevel(1);
      } else {
        setLevel(stored);
      }
    }
    loadDefaultLevel();
  }, [modes.simplifiedLearning]);

  // Handle incoming query from location state or initial load
  useEffect(() => {
    if (location.state?.initialProblem) {
      setInputVal(location.state.initialProblem);
      handleSolve(location.state.initialProblem);
    } else {
      // Solve initial default problem for immediate showcase
      handleSolve('2x + 6 = 14');
    }
  }, [location.state]);

  // Sync mic dictation
  useEffect(() => {
    if (transcript) {
      setInputVal(transcript);
    }
  }, [transcript]);

  const handleSolve = async (textToSolve = inputVal) => {
    if (!textToSolve.trim()) return;
    setErrorMsg(null);
    stopSpeech();

    try {
      let result = solveMathProblem(textToSolve);

      // If deterministic solver returns unsupported, seamlessly fall back to AI Mathematical Reasoning Engine
      if (result.type === 'unsupported') {
        setIsAiSolving(true);
        try {
          result = await solveMathWithAI(textToSolve, (language as any) || 'en');
        } catch (aiErr: any) {
          console.warn('AI Math Fallback notice:', aiErr);
        } finally {
          setIsAiSolving(false);
        }
      }

      setSolution(result);

      if (result.type !== 'unsupported') {
        announcePolite(`Problem solved. Result is ${result.solutionText}. Verification: ${result.verification.statusText}.`);
        showAlert({
          type: 'success',
          title: 'Problem Solved & Checked',
          message: `Result: ${result.solutionText}`,
        });

        // Add to learning history
        await addHistoryItem({
          type: 'math',
          title: `Solve: ${result.originalInput}`,
          input: result.originalInput,
          output: result.solutionText,
          steps: result.steps,
          verified: result.verification.verified,
        });

        // If voice mode is enabled, auto-speak the solution
        if (modes.voice) {
          speakText(result.spokenSummary);
        }
      } else {
        announcePolite(result.solutionText);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'An error occurred while solving.');
      setSolution(null);
    }
  };

  const handleListenFull = () => {
    if (!solution) return;
    const spokenSteps = solution.steps.map((s) => `Step ${s.stepNumber}: ${s.title}. ${s.spokenText}`).join('. ');
    const fullSpoken = `${solution.spokenSummary}. Here are the steps: ${spokenSteps}`;
    speakText(fullSpoken);
  };

  const handleListenStep = (step: MathStep) => {
    speakText(`Step ${step.stepNumber}: ${step.title}. ${step.spokenText}`);
  };

  const sampleProblems =
    language === 'or'
      ? [
          { label: 'ରୈଖିକ: 2x + 6 = 14', value: '2x + 6 = 14' },
          { label: 'ଦ୍ୱିଘାତ: x^2 - 5x + 6 = 0', value: 'x^2 - 5x + 6 = 0' },
          { label: 'ତ୍ରିକୋଣମିତି: sin(30)', value: 'sin(30)' },
          { label: 'ଲଗାରିଦମ: log(100)', value: 'log(100)' },
          { label: 'ସମାକଳନ (Integral): integrate 3x^2 + 4x', value: 'integrate 3x^2 + 4x' },
          { label: 'ଶତକଡ଼ା: 20% of 500', value: '20% of 500' },
          { label: 'ଶବ୍ଦ ସମସ୍ୟା (AI): A train travels 150 km in 2 hours. What is its speed?', value: 'A train travels 150 km in 2 hours. What is its speed?' },
        ]
      : language === 'hi'
      ? [
          { label: 'रैखिक: 2x + 6 = 14', value: '2x + 6 = 14' },
          { label: 'द्विघात: x^2 - 5x + 6 = 0', value: 'x^2 - 5x + 6 = 0' },
          { label: 'त्रिकोणमिति: sin(30)', value: 'sin(30)' },
          { label: 'लघुगणक: log(100)', value: 'log(100)' },
          { label: 'समाकलन (Integral): integrate 3x^2 + 4x', value: 'integrate 3x^2 + 4x' },
          { label: 'प्रतिशत: 20% of 500', value: '20% of 500' },
          { label: 'शब्द समस्या (AI): A train travels 150 km in 2 hours. What is its speed?', value: 'A train travels 150 km in 2 hours. What is its speed?' },
        ]
      : [
          { label: 'Linear: 2x + 6 = 14', value: '2x + 6 = 14' },
          { label: 'Quadratic: x^2 - 5x + 6 = 0', value: 'x^2 - 5x + 6 = 0' },
          { label: 'Trigonometry: sin(30)', value: 'sin(30)' },
          { label: 'Logarithm: log(100)', value: 'log(100)' },
          { label: 'Calculus Integral: integrate 3x^2 + 4x', value: 'integrate 3x^2 + 4x' },
          { label: 'Percentage: 20% of 500', value: '20% of 500' },
          { label: 'Word Problem (AI): A train travels 150 km in 2 hours. What is its speed?', value: 'A train travels 150 km in 2 hours. What is its speed?' },
        ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>{t('math.title', 'Solve a Mathematics Problem')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {t('math.desc', 'Step-by-step verifiable math solver with algebraic back-check and spoken explanations.')}
        </p>
      </div>

      {/* Input Section */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSolve();
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label htmlFor="math-input" style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {t('math.input_label', 'Enter Equation or Mathematical Expression:')}
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                id="math-input"
                type="text"
                className="input"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={t('math.placeholder', 'e.g. 2x + 6 = 14, x^2 - 5x + 6 = 0, or d/dx(3x^2+5x)')}
                style={{ fontSize: '1.1rem', fontFamily: 'var(--font-mono)' }}
                required
              />

              {micSupported && (
                <button
                  type="button"
                  className={`btn ${isListening ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={isListening ? stopListening : startListening}
                  aria-label={isListening ? 'Stop microphone dictation' : 'Dictate math problem with microphone'}
                  title={isListening ? 'Listening...' : 'Dictate math problem'}
                >
                  {isListening ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isAiSolving}
                style={{ padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {isAiSolving ? <Sparkles size={18} className="animate-spin" /> : <Calculator size={18} />}
                <span>{isAiSolving ? 'AI Computing...' : t('math.btn_solve', 'Solve')}</span>
              </button>
            </div>

            {/* Quick Math Symbol Palette & Easy Writing Tools */}
            <div
              style={{
                marginTop: '0.25rem',
                padding: '0.5rem 0.65rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    {t('math.quick_palette', 'Quick Formula Symbols')}:
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={handleBackspace}
                    title={t('math.backspace', 'Backspace')}
                    style={{ fontSize: '0.75rem', padding: '3px 8px', color: 'var(--text-secondary)' }}
                  >
                    <Delete size={14} />
                    <span>{t('math.backspace', 'Backspace')}</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={handleClear}
                    title={t('math.clear', 'Clear Input')}
                    style={{ fontSize: '0.75rem', padding: '3px 8px', color: 'var(--text-muted)' }}
                  >
                    <X size={14} />
                    <span>{t('math.clear', 'Clear')}</span>
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm ${showKeypad ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setShowKeypad((prev) => !prev)}
                    style={{ fontSize: '0.75rem', padding: '3px 10px', gap: '5px' }}
                    aria-expanded={showKeypad}
                  >
                    <Keyboard size={14} />
                    <span>{t('math.toggle_keypad', '⌨️ Easy Keypad & Starters')}</span>
                  </button>
                </div>
              </div>

              {/* Quick Symbol Buttons Strip */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.35rem',
                  alignItems: 'center',
                }}
              >
                {quickMathSymbols.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleInsertSymbol(item.val)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      padding: '4px 9px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      minWidth: '32px',
                      textAlign: 'center',
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                    }}
                    title={`Insert ${item.label}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Full Virtual Keypad & Academic Starters Accordion */}
              {showKeypad && (
                <div style={{ marginTop: '0.5rem' }}>
                  <VirtualKeypad onInsert={(text) => handleInsertSymbol(text)} />
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Quick Sample Presets */}
        <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('math.samples', 'Try example:')}</span>
          {sampleProblems.map((sp, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setInputVal(sp.value);
                handleSolve(sp.value);
              }}
              style={{
                fontSize: '0.775rem',
                border: '1px solid var(--border-subtle)',
                padding: '2px 8px',
              }}
            >
              {sp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Adaptive Explanation Level Selector (FR-LVL1) */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t('math.depth_label', 'Explanation Depth:')}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
            {t('math.depth_desc', 'Adapts wording of each step without changing the exact math')}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
      </div>

      {/* Solution Display Area */}
      {errorMsg && (
        <div className="card" style={{ borderLeft: '4px solid var(--status-error)', marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--status-error)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
            {t('math.unable_to_solve', 'Unable to Solve')}
          </h3>
          <p style={{ color: 'var(--text-secondary)' }}>{errorMsg}</p>
        </div>
      )}

      {solution && solution.type === 'unsupported' && (
        <div
          className="card"
          style={{
            borderLeft: '4px solid var(--status-warning)',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <h3 style={{ color: 'var(--status-warning)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            {t('math.unsupported_title', "This type isn't supported yet by the exact engine")}
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            {t('math.unsupported_desc', 'Our deterministic on-device engine never guesses or invents numbers. You can ask our local AI tutor in Ask a Question for conversational help with this topic!')}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              navigate('/ask', {
                state: { prefilledQuestion: `Can you help explain how to solve "${solution.originalInput}"?` },
              })
            }
          >
            <HelpCircle size={18} />
            <span>{t('math.ask_instead', 'Ask a Question Instead')}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {solution && solution.type !== 'unsupported' && (
        <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <div>
              <span className="badge badge-info">{solution.type}</span>
              <h2 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>{t('math.computed_solution', 'Computed Solution')}</h2>
            </div>
            {solution.graphableFunction && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() =>
                  navigate('/graph', {
                    state: { initialFunction: solution.graphableFunction },
                  })
                }
              >
                <Activity size={16} />
                <span>{t('math.plot_graph', 'Plot & Sonify Graph')}</span>
              </button>
            )}
          </div>

          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              textAlign: 'center',
            }}
          >
            <KaTeXMath math={solution.solutionLatex} block={true} />
            <div
              style={{
                fontSize: '1.15rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginTop: '0.5rem',
              }}
            >
              {solution.solutionText}
            </div>
          </div>

          {/* Verification Status */}
          <CheckedStatus verification={solution.verification} />

          {/* Step List Breakdown */}
          <StepList
            steps={solution.steps}
            level={level}
            onListenStep={handleListenStep}
            simplifiedMode={modes.simplifiedLearning}
          />

          {/* Actions: Save Flashcard, Ask About This, Listen, Copy */}
          <SolutionActions solution={solution} onListen={handleListenFull} />
        </div>
      )}
    </div>
  );
};
