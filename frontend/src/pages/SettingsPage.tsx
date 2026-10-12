import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../accessibility/AccessibilityContext';
import { getSetting, setSetting } from '../storage/settingsStore';
import { useSpeechOutput } from '../speech/useSpeechOutput';
import { useVisualAlert } from '../accessibility/VisualAlert';
import { useAnnounce } from '../accessibility/useAnnounce';
import { deleteAllLocalData } from '../storage/exportImport';
import { Modal } from '../components/ui/Modal';
import { useLanguage } from '../i18n/LanguageContext';
import { DEFAULT_OPENROUTER_KEY, DEFAULT_OPENROUTER_MODEL } from '../ai/llmClient';
import {
  Settings,
  Eye,
  Type,
  Subtitles,
  Bell,
  Volume2,
  Keyboard,
  Sparkles,
  Cpu,
  Trash2,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { modes, toggleMode, setTextScale } = useAccessibility();
  const { voices, rate, setRate, voiceName, setVoiceName } = useSpeechOutput();
  const { showAlert } = useVisualAlert();
  const { announcePolite } = useAnnounce();
  const { language, setLanguage, t } = useLanguage();

  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [defaultLevel, setDefaultLevel] = useState<1 | 2 | 3>(2);
  const [saveHistory, setSaveHistory] = useState(true);
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false);

  const [aiProvider, setAiProvider] = useState<'openrouter' | 'ollama'>('openrouter');
  const [openRouterApiKey, setOpenRouterApiKey] = useState(DEFAULT_OPENROUTER_KEY);
  const [openRouterModel, setOpenRouterModel] = useState(DEFAULT_OPENROUTER_MODEL);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const url = await getSetting<string>('ollamaUrl', 'http://localhost:11434');
      const lvl = await getSetting<1 | 2 | 3>('defaultLevel', 2);
      const hist = await getSetting<boolean>('saveHistory', true);
      const prov = await getSetting<'openrouter' | 'ollama'>('aiProvider', 'openrouter');
      const key = await getSetting<string>('openRouterApiKey', DEFAULT_OPENROUTER_KEY);
      const model = await getSetting<string>('openRouterModel', DEFAULT_OPENROUTER_MODEL);
      const lang = await getSetting<string>('language', 'en');

      setOllamaUrl(url);
      setDefaultLevel(lvl);
      setSaveHistory(hist);
      setAiProvider(prov);
      setOpenRouterApiKey(key);
      setOpenRouterModel(model);
    }
    loadSettings();
  }, []);

  const handleLanguageChange = async (newLang: string) => {
    await setLanguage(newLang as any);
    const langLabel = newLang === 'or' ? 'ଓଡ଼ିଆ (Odia)' : newLang === 'hi' ? 'हिन्दी (Hindi)' : 'English';
    announcePolite(`Learning language changed to ${langLabel}.`);
  };

  const handleProviderChange = async (prov: 'openrouter' | 'ollama') => {
    setAiProvider(prov);
    await setSetting('aiProvider', prov);
    announcePolite(`AI provider switched to ${prov === 'openrouter' ? 'OpenRouter Cloud' : 'Local Ollama'}.`);
  };

  const handleApiKeyChange = async (newKey: string) => {
    setOpenRouterApiKey(newKey);
    await setSetting('openRouterApiKey', newKey);
  };

  const handleModelChange = async (newModel: string) => {
    setOpenRouterModel(newModel);
    await setSetting('openRouterModel', newModel);
    announcePolite(`OpenRouter model set to ${newModel}.`);
  };

  const handleOllamaUrlChange = async (newUrl: string) => {
    setOllamaUrl(newUrl);
    await setSetting('ollamaUrl', newUrl);
  };

  const handleLevelChange = async (newLevel: 1 | 2 | 3) => {
    setDefaultLevel(newLevel);
    await setSetting('defaultLevel', newLevel);
    announcePolite(`Default explanation level set to ${newLevel}.`);
  };

  const handleToggleHistory = async () => {
    const nextVal = !saveHistory;
    setSaveHistory(nextVal);
    await setSetting('saveHistory', nextVal);
    announcePolite(`Save history set to ${nextVal ? 'on' : 'off'}.`);
  };

  const handleWipeAll = async () => {
    await deleteAllLocalData();
    setIsWipeModalOpen(false);
    announcePolite('All data wiped.');
    showAlert({
      type: 'info',
      title: 'Local Storage Cleared',
      message: 'All settings and data have been reset.',
    });
  };

  const modeItems = [
    {
      key: 'captions' as const,
      title: 'Synchronized Captions',
      desc: 'Show real-time caption subtitles for all spoken mathematics and audio explanations.',
      icon: Subtitles,
      enabled: modes.captions,
    },
    {
      key: 'visualAlerts' as const,
      title: 'Visual Alerts',
      desc: 'Display high-contrast visual banners and icons instead of relying solely on sound cues.',
      icon: Bell,
      enabled: modes.visualAlerts,
    },
    {
      key: 'voice' as const,
      title: 'Voice Auto-Speech Mode',
      desc: 'Automatically read out solutions and responses using text-to-speech upon completion.',
      icon: Volume2,
      enabled: modes.voice,
    },
    {
      key: 'highContrast' as const,
      title: 'High Contrast Mode',
      desc: 'Enhance visibility with ≥ 7:1 contrast tokens, vivid borders, and zero transparent overlays.',
      icon: Eye,
      enabled: modes.highContrast,
    },
    {
      key: 'simplifiedLearning' as const,
      title: 'Simplified Learning',
      desc: 'Sets Level 1 explanations by default and shows step-by-step solutions one step at a time.',
      icon: Sparkles,
      enabled: modes.simplifiedLearning,
    },
    {
      key: 'keyboardNav' as const,
      title: 'Keyboard Navigation Indicators',
      desc: 'Enforce thick focus indicators, skip links, and direct number shortcuts (1–4).',
      icon: Keyboard,
      enabled: modes.keyboardNav,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>{t('settings.title', 'Settings & Accessibility')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {t('settings.desc', 'Configure visual contrast, text scaling, speech playback, and local AI endpoints.')}
        </p>
      </div>

      {/* Text Size Scale Selector */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
          <Type size={20} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.2rem' }}>Text Size & Display Scale</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Scales all typography proportionally across every screen without introducing horizontal scrolling.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {(['100', '125', '150', '200'] as const).map((scale) => (
            <button
              key={scale}
              type="button"
              className={`btn ${modes.textScale === scale ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => {
                setTextScale(scale);
                announcePolite(`Text scale set to ${scale} percent.`);
              }}
              aria-pressed={modes.textScale === scale}
              style={{ minWidth: '90px' }}
            >
              {scale}%
            </button>
          ))}
        </div>
      </div>

      {/* Accessibility Modes Grid */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Combinable Accessibility Modes</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {modeItems.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.key}
                role="button"
                tabIndex={0}
                aria-pressed={m.enabled}
                onClick={() => {
                  toggleMode(m.key);
                  announcePolite(`${m.title} toggled.`);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMode(m.key);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  background: m.enabled ? 'rgba(56, 189, 248, 0.08)' : 'var(--bg-surface)',
                  border: m.enabled ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255,255,255,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={m.enabled ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {m.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                      {m.desc}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: m.enabled ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000000',
                    flexShrink: 0,
                    marginLeft: '0.75rem',
                  }}
                >
                  {m.enabled && <Check size={14} strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Engine & Intelligence Configuration */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.2rem' }}>AI Engine & Scalability Settings</h2>
          </div>
          <span className="badge badge-success">RAG Fact Pack: 10 Verified Facts Active</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '650px' }}>
          {/* Provider Selection */}
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Active AI Provider:</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${aiProvider === 'openrouter' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleProviderChange('openrouter')}
              >
                OpenRouter Cloud (High Intelligence)
              </button>
              <button
                type="button"
                className={`btn btn-sm ${aiProvider === 'ollama' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleProviderChange('ollama')}
              >
                Local Ollama (100% Offline)
              </button>
            </div>
          </div>

          {aiProvider === 'openrouter' ? (
            <>
              {/* OpenRouter API Key */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label htmlFor="openrouter-api-key" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    OpenRouter API Key:
                  </label>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                    style={{ fontSize: '0.75rem', padding: '2px 6px' }}
                  >
                    {showApiKey ? 'Hide Key' : 'Reveal Key'}
                  </button>
                </div>
                <input
                  id="openrouter-api-key"
                  type={showApiKey ? 'text' : 'password'}
                  className="input"
                  value={openRouterApiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="sk-or-v1-..."
                  style={{ marginTop: '0.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Supplied API key is stored securely in your browser's IndexedDB.
                </div>
              </div>

              {/* OpenRouter Model Selection */}
              <div>
                <label htmlFor="openrouter-model-select" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  OpenRouter Model:
                </label>
                <select
                  id="openrouter-model-select"
                  className="select"
                  value={openRouterModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                  style={{ marginTop: '0.25rem' }}
                >
                  <option value="liquid/lfm-2.5-2.6b:free">Liquid LFM 2.5 2.6B (Free · Ultra Fast)</option>
                  <option value="google/gemma-4-31b-it:free">Google Gemma 4 31B IT (Free · High Intelligence)</option>
                  <option value="nvidia/nemotron-3.5-lightning:free">NVIDIA Nemotron 3.5 Lightning (Free)</option>
                  <option value="openrouter/auto">OpenRouter Auto (Best Available Model)</option>
                </select>
              </div>
            </>
          ) : (
            /* Ollama Local URL */
            <div>
              <label htmlFor="ollama-url" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                Ollama Server Base Address:
              </label>
              <input
                id="ollama-url"
                type="text"
                className="input"
                value={ollamaUrl}
                onChange={(e) => handleOllamaUrlChange(e.target.value)}
                placeholder="http://localhost:11434"
                style={{ marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Default: <code>http://localhost:11434</code>. Must allow origin if served from non-localhost.
              </div>
            </div>
          )}

          {/* Default Level Selector */}
          <div>
            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Default Explanation Level:</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${defaultLevel === 1 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleLevelChange(1)}
              >
                Level 1: Very Simple
              </button>
              <button
                type="button"
                className={`btn btn-sm ${defaultLevel === 2 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleLevelChange(2)}
              >
                Level 2: Student
              </button>
              <button
                type="button"
                className={`btn btn-sm ${defaultLevel === 3 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleLevelChange(3)}
              >
                Level 3: Advanced
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Speech Audio Output Configuration */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
          <Volume2 size={20} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.2rem' }}>{t('settings.speech_title', 'Speech & Audio Output Settings')}</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
          {/* Preferred Learning Language */}
          <div>
            <label htmlFor="settings-language-select" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {t('settings.lang_label', 'Preferred Learning Language:')}
            </label>
            <select
              id="settings-language-select"
              className="select"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{ marginTop: '0.25rem' }}
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="or">ଓଡ଼ିଆ (Odia)</option>
            </select>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {t('settings.lang_desc', 'Controls the tutoring language for general-knowledge explanations, speech, and live captions.')}
            </div>
          </div>

          <div>
            <label htmlFor="settings-speech-rate" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              {t('settings.rate_label', 'Playback Rate:')} <strong>{rate}x</strong>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
              <input
                id="settings-speech-rate"
                type="range"
                min="0.75"
                max="2.0"
                step="0.25"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                style={{ width: '180px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Range: 0.75x (slower) to 2.0x (faster)
              </span>
            </div>
          </div>

          {voices.length > 0 && (
            <div>
              <label htmlFor="settings-voice-select" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                {t('settings.voice_label', 'Synthesized Voice:')}
              </label>
              <select
                id="settings-voice-select"
                className="select"
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                style={{ marginTop: '0.25rem' }}
              >
                <option value="">Default System Voice</option>
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Privacy & Local Data Storage Controls */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{t('settings.data_title', 'Data & Privacy Controls')}</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>Record Learning History in Browser</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Keep past math solutions and queries for spaced review.
              </div>
            </div>
            <button
              type="button"
              className={`btn ${saveHistory ? 'btn-primary' : 'btn-outline'} btn-sm`}
              onClick={handleToggleHistory}
            >
              {saveHistory ? 'Recording Active' : 'Recording Off'}
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.05)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: 'var(--status-error)' }}>{t('settings.wipe_btn', 'Delete All Local Data')}</div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                Completely erase all saved history, deck cards, and settings from this browser.
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setIsWipeModalOpen(true)}
              style={{
                background: 'var(--status-error)',
                color: '#FFFFFF',
                border: 'none',
              }}
            >
              <Trash2 size={16} />
              <span>{t('settings.wipe_btn', 'Delete Everything')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wipe Confirmation Modal */}
      <Modal isOpen={isWipeModalOpen} onClose={() => setIsWipeModalOpen(false)} title="Confirm Data Wipe">
        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Are you sure you want to permanently erase all locally stored data? This will reset the application to its default initial state.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsWipeModalOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleWipeAll}
              style={{ background: 'var(--status-error)', borderColor: 'var(--status-error)' }}
            >
              Confirm Wipe
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
