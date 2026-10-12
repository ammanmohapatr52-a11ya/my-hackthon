import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Play,
  Square,
  RotateCcw,
  Sparkles,
  Sliders,
  ChevronDown,
  Radio,
} from 'lucide-react';
import {
  welcomeTune,
  TUNE_PRESETS,
  type TuneState,
  type TunePresetId,
} from '../../audio/welcomeTune';
import { useAccessibility } from '../../accessibility/AccessibilityContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const WelcomeTunePlayer: React.FC = () => {
  const [tuneState, setTuneState] = useState<TuneState>(() => welcomeTune.getState());
  const [showSettings, setShowSettings] = useState(false);
  const { profile, modes } = useAccessibility();
  const { t } = useLanguage();

  useEffect(() => {
    // Subscribe to welcome tune state changes
    const unsubscribe = welcomeTune.subscribe((newState) => {
      setTuneState(newState);
    });

    // Attempt automatic welcome playback on first page arrival
    welcomeTune.attemptAutoWelcome(false);

    return () => {
      unsubscribe();
    };
  }, []);

  const handleTogglePlay = () => {
    if (tuneState.isPlaying) {
      welcomeTune.stop();
    } else {
      welcomeTune.play();
    }
  };

  const handleToggleMute = () => {
    welcomeTune.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    welcomeTune.setVolume(val);
  };

  const handleSelectTune = (presetId: TunePresetId) => {
    welcomeTune.setTune(presetId);
    welcomeTune.play(presetId);
  };

  const isDeafHoh = profile === 'deaf-hoh' || modes.visualAlerts;
  const currentPreset = TUNE_PRESETS[tuneState.activeTuneId] || TUNE_PRESETS.chime;

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        marginTop: '1.25rem',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.2s ease',
      }}
      role="region"
      aria-label="Welcome Music Tune Controls"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {/* Left: Icon, Name & Live Equalizer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              background: tuneState.isPlaying
                ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)'
                : 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: tuneState.isPlaying ? '#ffffff' : '#38bdf8',
              boxShadow: tuneState.isPlaying ? '0 0 14px rgba(56, 189, 248, 0.5)' : 'none',
              transition: 'all 0.25s ease',
            }}
          >
            {tuneState.isPlaying ? (
              <Radio size={18} className="animate-pulse" />
            ) : (
              <Music size={18} />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f8fafc' }}>
                {t('tune.welcome_tune', 'Welcome Tune')}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '1px 7px',
                  borderRadius: '999px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  fontWeight: 600,
                }}
              >
                {currentPreset.name}
              </span>

              {/* Active Playing Note Badge */}
              {tuneState.isPlaying && tuneState.activeNote && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: 'rgba(245, 158, 11, 0.25)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.5)',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                  }}
                  aria-live="polite"
                >
                  ♪ {tuneState.activeNote}
                </span>
              )}
            </div>

            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
              {tuneState.isPlaying ? (
                <span style={{ color: '#38bdf8', fontWeight: 500 }}>
                  {t('tune.playing', 'Playing arrival chime...')}
                </span>
              ) : tuneState.isMuted ? (
                <span style={{ color: '#f87171' }}>Muted (Click unmute to enable)</span>
              ) : (
                <span>{t('tune.ready_to_play', 'Harmonic arrival sound for first-page welcome')}</span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Live Equalizer Sound Waves */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '3px',
            height: '22px',
            padding: '0 8px',
          }}
          aria-hidden="true"
        >
          {[0.4, 0.8, 1.0, 0.6, 0.9, 0.5].map((scale, i) => (
            <div
              key={i}
              style={{
                width: '3px',
                height: tuneState.isPlaying ? `${10 + (i % 3) * 6}px` : '4px',
                background: tuneState.isPlaying
                  ? 'linear-gradient(to top, #0284c7, #38bdf8)'
                  : 'rgba(148, 163, 184, 0.3)',
                borderRadius: '2px',
                transition: 'height 0.12s ease',
                animation: tuneState.isPlaying
                  ? `equalizerWave 0.6s infinite ease-in-out alternate ${i * 0.1}s`
                  : 'none',
              }}
            />
          ))}
        </div>

        {/* Right: Quick Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Main Play/Replay Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`btn btn-sm ${tuneState.isPlaying ? 'btn-danger' : 'btn-primary'}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.4rem 0.85rem',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
            aria-label={tuneState.isPlaying ? 'Stop Welcome Tune' : 'Play Welcome Tune'}
          >
            {tuneState.isPlaying ? (
              <>
                <Square size={13} fill="currentColor" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <RotateCcw size={13} />
                <span>{t('tune.replay_melody', 'Replay Melody')}</span>
              </>
            )}
          </button>

          {/* Quick Mute / Unmute Button */}
          <button
            type="button"
            onClick={handleToggleMute}
            className="btn btn-ghost btn-sm"
            style={{
              padding: '0.4rem',
              color: tuneState.isMuted ? '#f87171' : '#94a3b8',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            title={tuneState.isMuted ? 'Unmute Welcome Tune' : 'Mute Welcome Tune'}
            aria-label={tuneState.isMuted ? 'Unmute Welcome Tune' : 'Mute Welcome Tune'}
          >
            {tuneState.isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Settings Toggle Dropdown */}
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="btn btn-ghost btn-sm"
            style={{
              padding: '0.4rem 0.6rem',
              color: showSettings ? '#38bdf8' : '#94a3b8',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
            }}
            title="Tune Settings & Selection"
            aria-expanded={showSettings}
            aria-label="Tune Options"
          >
            <Sliders size={14} />
            <ChevronDown
              size={12}
              style={{
                transform: showSettings ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>
        </div>
      </div>

      {/* Visual Melody Subtitle for Accessibility & Deaf/Hard-of-Hearing Preset */}
      {isDeafHoh && (
        <div
          style={{
            marginTop: '0.65rem',
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            fontSize: '0.78rem',
            color: '#7dd3fc',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          role="status"
        >
          <Sparkles size={14} color="#38bdf8" />
          <span>
            <strong>{t('tune.caption_prefix', 'Visual Caption')}:</strong>{' '}
            {tuneState.isPlaying
              ? `Playing "${currentPreset.name}" (${currentPreset.description})`
              : `Welcoming Melody: "${currentPreset.name}" ready to play`}
          </span>
        </div>
      )}

      {/* Expanded Tune Options Drawer */}
      {showSettings && (
        <div
          style={{
            marginTop: '0.85rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {/* Preset Buttons */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#94a3b8',
                marginBottom: '0.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Select Welcoming Melody Preset:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {(Object.keys(TUNE_PRESETS) as TunePresetId[]).map((key) => {
                const preset = TUNE_PRESETS[key];
                const isSelected = tuneState.activeTuneId === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectTune(key)}
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.3) 0%, rgba(56, 189, 248, 0.3) 100%)'
                        : 'rgba(15, 23, 42, 0.6)',
                      border: isSelected
                        ? '1px solid #38bdf8'
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.4rem 0.75rem',
                      color: isSelected ? '#38bdf8' : '#e2e8f0',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      transition: 'all 0.15s ease',
                      flex: '1 1 140px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Play size={10} fill={isSelected ? '#38bdf8' : 'currentColor'} />
                      <span>{preset.name}</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '2px' }}>
                      {preset.tempo} · {preset.description.substring(0, 36)}...
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume Slider & Autoplay Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingTop: '0.25rem',
            }}
          >
            {/* Volume Control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '180px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                Volume:
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={tuneState.isMuted ? 0 : tuneState.volume}
                onChange={handleVolumeChange}
                style={{
                  width: '100px',
                  accentColor: 'var(--accent-primary)',
                  cursor: 'pointer',
                }}
                aria-label="Welcome tune volume"
              />
              <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontFamily: 'monospace' }}>
                {tuneState.isMuted ? '0%' : `${Math.round(tuneState.volume * 100)}%`}
              </span>
            </div>

            {/* Autoplay on Visit Checkbox */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                color: '#cbd5e1',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={tuneState.autoPlayEnabled}
                onChange={(e) => welcomeTune.setAutoPlayEnabled(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
              <span>Play automatically on first arrival</span>
            </label>
          </div>
        </div>
      )}

      {/* Dynamic CSS keyframes for equalizer waves */}
      <style>{`
        @keyframes equalizerWave {
          0% { height: 4px; }
          100% { height: 20px; }
        }
      `}</style>
    </div>
  );
};

export default WelcomeTunePlayer;
