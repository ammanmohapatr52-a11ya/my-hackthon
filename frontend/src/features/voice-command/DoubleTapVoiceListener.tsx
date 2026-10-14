import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Pause, Play, SkipForward, X, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { pageReaderService, type PageReaderState } from '../../services/pageReaderService';

interface RipplePoint {
  id: number;
  x: number;
  y: number;
}

export const DoubleTapVoiceListener: React.FC = () => {
  const [ripples, setRipples] = useState<RipplePoint[]>([]);
  const [readerState, setReaderState] = useState<PageReaderState>(() => pageReaderService.getState());
  const [hudToast, setHudToast] = useState<{ visible: boolean; text: string; subtext?: string } | null>(null);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);

  const lastTapRef = useRef<{ time: number; x: number; y: number }>({ time: 0, x: 0, y: 0 });
  const hudTimerRef = useRef<any>(null);
  const { language } = useLanguage();

  // Subscribe to page reader state
  useEffect(() => {
    const unsub = pageReaderService.subscribe((state) => {
      setReaderState(state);
    });
    return unsub;
  }, []);

  // Play high-tech Tony Stark Arc Reactor chime via Web Audio API
  const playWakeChime = useCallback((isStop = false) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (isStop) {
        // Falling tone for stop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc.frequency.exponentialRampToValueAtTime(329.63, ctx.currentTime + 0.18); // E4
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      } else {
        // Ascending double harmonic tone for activation
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        gain1.gain.setValueAtTime(0.14, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.1);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.08); // G5
        gain2.gain.setValueAtTime(0.18, ctx.currentTime + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.26);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(ctx.currentTime + 0.08);
        osc2.stop(ctx.currentTime + 0.26);
      }
    } catch {
      // AudioContext fallback
    }
  }, []);

  // Trigger AI Page Reader on Double Tap
  const handleDoubleTapAction = useCallback(
    (clientX: number, clientY: number) => {
      // 1. Tactile haptic vibration feedback
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([35, 45, 35]);
        } catch {}
      }

      // 2. Add visual Arc-Reactor shockwave ripple
      const newRipple: RipplePoint = {
        id: Date.now() + Math.random(),
        x: clientX,
        y: clientY,
      };
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 850);

      // 3. Toggle AI Page Reader (Starts reading page text, or stops if already active)
      const isNowActive = pageReaderService.toggleReading(language as any);
      playWakeChime(!isNowActive);

      // 4. Quick HUD alert banner
      let localizedTitle = '';
      let localizedSub = '';

      if (isNowActive) {
        localizedTitle =
          language === 'hi'
            ? '⚡ एआई रीडर सक्रिय — पूरा पेज पढ़कर सुना रहा है'
            : language === 'or'
            ? '⚡ ଏଆଇ ରିଡର୍ ସକ୍ରିୟ — ସମ୍ପୂର୍ଣ୍ଣ ପୃଷ୍ଠା ପଢ଼ି ଶୁଣାଉଛି'
            : '⚡ AI Page Reader Active — Reading entire page aloud';
        localizedSub =
          language === 'hi'
            ? 'रोकने के लिए स्क्रीन पर फिर से डबल-टैप करें'
            : language === 'or'
            ? 'ବନ୍ଦ କରିବାକୁ ପୁଣି ଡବଲ୍-ଟ୍ୟାପ୍ କରନ୍ତୁ'
            : 'Double-tap anywhere again to stop reading';
      } else {
        localizedTitle =
          language === 'hi'
            ? '⏹ एआई रीडर बंद कर दिया गया'
            : language === 'or'
            ? '⏹ ଏଆଇ ରିଡର୍ ବନ୍ଦ ହୋଇଗଲା'
            : '⏹ AI Page Reader Stopped';
        localizedSub =
          language === 'hi'
            ? 'दोबारा शुरू करने के लिए डबल-टैप करें'
            : language === 'or'
            ? 'ପୁଣି ଆରମ୍ଭ କରିବାକୁ ଡବଲ୍-ଟ୍ୟାପ୍ କରନ୍ତୁ'
            : 'Double-tap again to start reading';
      }

      setHudToast({ visible: true, text: localizedTitle, subtext: localizedSub });
      if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
      hudTimerRef.current = setTimeout(() => {
        setHudToast(null);
      }, 4000);
    },
    [language, playWakeChime]
  );

  // Global Double-Tap & Double-Click Gesture Detector
  useEffect(() => {
    const isInteractiveInput = (target: HTMLElement | null): boolean => {
      if (!target) return false;
      const tag = target.tagName?.toUpperCase();
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (target.isContentEditable) return true;
      if (target.closest('.ai-reader-hud-controls')) return true;
      return false;
    };

    // 1. Mobile & Touch Screen Double-Tap Detector
    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (isInteractiveInput(target)) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const now = Date.now();
      const last = lastTapRef.current;
      const timeDiff = now - last.time;
      const dist = Math.hypot(touch.clientX - last.x, touch.clientY - last.y);

      // Double tap detected: within 350ms and distance < 45px
      if (timeDiff > 40 && timeDiff <= 350 && dist < 45) {
        lastTapRef.current = { time: 0, x: 0, y: 0 };
        handleDoubleTapAction(touch.clientX, touch.clientY);
      } else {
        lastTapRef.current = { time: now, x: touch.clientX, y: touch.clientY };
      }
    };

    // 2. Desktop Mouse Double-Click Detector
    const handleDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (isInteractiveInput(target)) return;
      handleDoubleTapAction(e.clientX, e.clientY);
    };

    // 3. Custom Event Listener to trigger AI Reader from voice or commands
    const handleCustomTrigger = () => {
      handleDoubleTapAction(window.innerWidth / 2, 80);
    };

    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('dblclick', handleDblClick);
    window.addEventListener('neurobridge_toggle_ai_reader', handleCustomTrigger);

    return () => {
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('dblclick', handleDblClick);
      window.removeEventListener('neurobridge_toggle_ai_reader', handleCustomTrigger);
      if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
    };
  }, [handleDoubleTapAction]);

  const handleSpeedToggle = () => {
    const nextSpeed = speechSpeed === 1.0 ? 1.25 : speechSpeed === 1.25 ? 1.5 : 1.0;
    setSpeechSpeed(nextSpeed);
    pageReaderService.setRate(nextSpeed, language as any);
  };

  return (
    <>
      {/* 3D Arc-Reactor Shockwave Ripples at Double-Tap Location */}
      {ripples.map((r) => (
        <div
          key={r.id}
          style={{
            position: 'fixed',
            left: r.x,
            top: r.y,
            width: '24px',
            height: '24px',
            marginLeft: '-12px',
            marginTop: '-12px',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 99999,
            background:
              'radial-gradient(circle, rgba(56, 189, 248, 0.9) 0%, rgba(245, 158, 11, 0.7) 45%, transparent 70%)',
            boxShadow: '0 0 35px #38bdf8, 0 0 70px #f59e0b',
            animation: 'doubleTapPulse 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
          }}
        />
      ))}

      {/* PERSISTENT FLOATING STARK AI READER HUD CONTROL BAR (Active during narration) */}
      {readerState.isActive && (
        <aside
          role="region"
          aria-label="AI Page Screen Reader Controls"
          className="ai-reader-hud-controls"
          style={{
            position: 'fixed',
            top: '18px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 16px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(8, 14, 28, 0.96) 0%, rgba(13, 22, 43, 0.98) 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.75)',
            boxShadow:
              '0 12px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.45), inset 0 0 16px rgba(245, 158, 11, 0.25)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            maxWidth: '92vw',
            width: 'auto',
            animation: 'hudSlideDown 0.3s cubic-bezier(0.2, 0.8, 0.3, 1) forwards',
          }}
        >
          {/* Animated Equalizer Wave / Reading Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              padding: '6px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.15)',
            }}
          >
            <span
              style={{
                width: '3px',
                height: readerState.isPaused ? '6px' : '16px',
                backgroundColor: '#38bdf8',
                borderRadius: '2px',
                animation: readerState.isPaused ? 'none' : 'equalizerBar 0.8s ease-in-out infinite',
              }}
            />
            <span
              style={{
                width: '3px',
                height: readerState.isPaused ? '10px' : '22px',
                backgroundColor: '#f59e0b',
                borderRadius: '2px',
                animation: readerState.isPaused ? 'none' : 'equalizerBar 0.8s ease-in-out 0.2s infinite',
              }}
            />
            <span
              style={{
                width: '3px',
                height: readerState.isPaused ? '6px' : '14px',
                backgroundColor: '#10b981',
                borderRadius: '2px',
                animation: readerState.isPaused ? 'none' : 'equalizerBar 0.8s ease-in-out 0.4s infinite',
              }}
            />
          </div>

          {/* Reading Progress & Text */}
          <div style={{ maxWidth: '340px', overflow: 'hidden' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#38bdf8',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              <BookOpen size={13} color="#38bdf8" />
              <span>
                AI Page Reader ({readerState.currentIndex + 1}/{readerState.totalSentences})
              </span>
              {readerState.isPaused && (
                <span style={{ color: '#f59e0b', marginLeft: '4px' }}>[Paused]</span>
              )}
            </div>

            <div
              style={{
                fontSize: '0.8rem',
                color: '#e2e8f0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginTop: '1px',
                fontWeight: 500,
              }}
              title={readerState.currentSentence}
            >
              {readerState.currentSentence || 'Reading page content...'}
            </div>
          </div>

          {/* Controls: Pause/Resume, Skip Next, Speed, Stop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
            {readerState.isPaused ? (
              <button
                type="button"
                id="ai-reader-resume-btn"
                onClick={() => pageReaderService.resume(language as any)}
                title="Resume Reading"
                style={{
                  background: 'rgba(16, 185, 129, 0.25)',
                  border: '1px solid #10b981',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#34d399',
                  transition: 'all 0.15s ease',
                }}
              >
                <Play size={14} />
              </button>
            ) : (
              <button
                type="button"
                id="ai-reader-pause-btn"
                onClick={() => pageReaderService.pause()}
                title="Pause Reading"
                style={{
                  background: 'rgba(245, 158, 11, 0.25)',
                  border: '1px solid #f59e0b',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#f59e0b',
                  transition: 'all 0.15s ease',
                }}
              >
                <Pause size={14} />
              </button>
            )}

            <button
              type="button"
              id="ai-reader-next-btn"
              onClick={() => pageReaderService.next(language as any)}
              title="Next Sentence"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#94a3b8',
                transition: 'all 0.15s ease',
              }}
            >
              <SkipForward size={14} />
            </button>

            <button
              type="button"
              id="ai-reader-speed-btn"
              onClick={handleSpeedToggle}
              title={`Speech Speed: ${speechSpeed}x`}
              style={{
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '9999px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#38bdf8',
                cursor: 'pointer',
              }}
            >
              {speechSpeed}x
            </button>

            <button
              type="button"
              id="ai-reader-stop-btn"
              onClick={() => {
                pageReaderService.stop();
                playWakeChime(true);
              }}
              title="Stop Reading (or Double-Tap anywhere)"
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#f87171',
                marginLeft: '4px',
              }}
            >
              <X size={15} />
            </button>
          </div>
        </aside>
      )}

      {/* Floating HUD Arc-Reactor Toast on Double-Tap */}
      {hudToast && hudToast.visible && !readerState.isActive && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 20px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(8, 14, 28, 0.96) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.6)',
            boxShadow:
              '0 10px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.4), inset 0 0 15px rgba(245, 158, 11, 0.2)',
            backdropFilter: 'blur(16px)',
            color: '#f8fafc',
            fontSize: '0.86rem',
            fontWeight: 700,
            animation: 'hudSlideDown 0.3s cubic-bezier(0.2, 0.8, 0.3, 1) forwards',
            maxWidth: '92vw',
          }}
        >
          {/* Pulsing Arc Reactor Book Icon */}
          <div
            style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #38bdf8 20%, #f59e0b 70%, transparent 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 14px #38bdf8',
            }}
          >
            <BookOpen size={16} color="#0f172a" strokeWidth={2.5} />
          </div>

          <div>
            <div style={{ color: '#38bdf8', fontWeight: 800, letterSpacing: '0.02em', fontSize: '0.84rem' }}>
              {hudToast.text}
            </div>
            {hudToast.subtext && (
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: '1px' }}>
                {hudToast.subtext}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setHudToast(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '2px',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '4px',
            }}
            aria-label="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Embedded Styles for HUD animation */}
      <style>{`
        @keyframes doubleTapPulse {
          0% {
            transform: scale(0.2);
            opacity: 1;
          }
          100% {
            transform: scale(6.5);
            opacity: 0;
          }
        }
        @keyframes hudSlideDown {
          0% {
            transform: translate(-50%, -24px);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        @keyframes equalizerBar {
          0%, 100% {
            transform: scaleY(0.4);
          }
          50% {
            transform: scaleY(1.3);
          }
        }
      `}</style>
    </>
  );
};
