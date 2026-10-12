import React, { useState } from 'react';
import { useSpeechOutput } from '../speech/useSpeechOutput';
import { useAccessibility } from '../accessibility/AccessibilityContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Volume2,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  RotateCcw,
  Type,
  CheckCircle2,
} from 'lucide-react';

export const VoiceLearningPage: React.FC = () => {
  const { modes } = useAccessibility();
  const { t } = useLanguage();
  const defaultSample = `Quadratic equations model parabolic trajectories and orbits.
The standard form is ax squared plus bx plus c equals zero.
The discriminant delta determines the quantity and nature of the solutions.
When delta is positive, two distinct real roots cross the horizontal axis.
When delta equals zero, a single repeated root touches the vertex.
When delta is negative, two complex conjugate roots exist.`;

  const [text, setText] = useState(defaultSample);

  const {
    isSupported,
    isPlaying,
    isPaused,
    currentWordIndex,
    currentSentenceIndex,
    sentences,
    voices,
    rate,
    setRate,
    voiceName,
    setVoiceName,
    speakText,
    stop,
    pause,
    resume,
    jumpToSentence,
    nextSentence,
    prevSentence,
  } = useSpeechOutput();

  const handleStartSpeaking = () => {
    speakText(text);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>{t('voice.title', 'Voice Learning')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {t('voice.desc', 'Listen to any academic text or solved problem with real-time synchronized word highlighting and sentence replay.')}
        </p>
      </div>

      {!isSupported && (
        <div className="card" style={{ borderLeft: '4px solid var(--status-warning)', marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--status-warning)', fontSize: '1.1rem' }}>
            Speech Synthesis Not Supported
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Your browser does not expose the Web Speech API. You can still read the text and use all visual modes!
          </p>
        </div>
      )}

      {/* Playback Controls Strip */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Main Transport Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {!isPlaying || isPaused ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={isPaused ? resume : handleStartSpeaking}
                aria-label={isPaused ? 'Resume reading' : 'Start reading aloud'}
              >
                <Play size={18} />
                <span>{isPaused ? 'Resume' : t('voice.btn_play', 'Play / Read')}</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={pause}
                aria-label="Pause reading"
              >
                <Pause size={18} />
                <span>{t('voice.btn_pause', 'Pause')}</span>
              </button>
            )}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={stop}
              disabled={!isPlaying && !isPaused}
              aria-label="Stop reading"
            >
              <Square size={18} />
              <span>{t('voice.btn_stop', 'Stop')}</span>
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={prevSentence}
              disabled={!isPlaying}
              aria-label="Previous sentence"
              title="Previous sentence"
            >
              <SkipBack size={18} />
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={nextSentence}
              disabled={!isPlaying}
              aria-label="Next sentence"
              title="Next sentence"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Speed & Voice Controls */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label htmlFor="speed-slider" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {t('voice.speed_label', 'Speed:')} <strong>{rate}x</strong>
              </label>
              <input
                id="speed-slider"
                type="range"
                min="0.75"
                max="2.0"
                step="0.25"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                style={{ width: '90px', cursor: 'pointer' }}
              />
            </div>

            {voices.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label htmlFor="voice-select" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {t('settings.voice_label', 'Voice:')}
                </label>
                <select
                  id="voice-select"
                  className="select"
                  value={voiceName}
                  onChange={(e) => setVoiceName(e.target.value)}
                  style={{ padding: '0.35rem 0.6rem', fontSize: '0.825rem', width: 'auto' }}
                >
                  <option value="">System Default Voice</option>
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
      </div>

      {/* Interactive Reader View with Word & Sentence Highlighting (FR-VOICE2, FR-VOICE4, FR-VOICE5) */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <h2 style={{ fontSize: '1.25rem' }}>{t('voice.reader_title', 'Synchronized Reader')}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {t('voice.hint', 'Tip: Click or press Enter on any sentence below to listen directly.')}
          </span>
        </div>

        {sentences.length > 0 && isPlaying ? (
          <div
            style={{
              fontSize: '1.2rem',
              lineHeight: 1.9,
              padding: '1.5rem',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
            }}
          >
            {sentences.map((sent) => {
              const isSentenceActive = currentSentenceIndex === sent.index;

              return (
                <p
                  key={sent.index}
                  role="button"
                  tabIndex={0}
                  onClick={() => jumpToSentence(sent.index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      jumpToSentence(sent.index);
                    }
                  }}
                  className={`spoken-sentence ${isSentenceActive ? 'active-sentence' : ''}`}
                  style={{
                    cursor: 'pointer',
                    marginBottom: '0.75rem',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {sent.words.map((w) => {
                    const isWordActive = currentWordIndex === w.index;
                    return (
                      <span
                        key={w.index}
                        className={`spoken-word ${isWordActive ? 'active' : ''}`}
                      >
                        {w.word}{' '}
                      </span>
                    );
                  })}
                </p>
              );
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label htmlFor="custom-speech-text" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Edit or paste text to read aloud:
            </label>
            <textarea
              id="custom-speech-text"
              className="textarea"
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste any academic text, formulas, or notes to read aloud with synchronized highlighting..."
              style={{ fontSize: '1.1rem', lineHeight: 1.6 }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
