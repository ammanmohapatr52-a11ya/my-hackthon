import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Mic, Sparkles, Volume2, X } from 'lucide-react';
import { assistantVoice } from '../../services/assistantVoice';
import { useLanguage } from '../../i18n/LanguageContext';

interface RipplePoint {
  id: number;
  x: number;
  y: number;
}

export const DoubleTapVoiceListener: React.FC = () => {
  const [hudToast, setHudToast] = useState<{ visible: boolean; text: string } | null>(null);
  const [ripples, setRipples] = useState<RipplePoint[]>([]);
  const lastTapRef = useRef<{ time: number; x: number; y: number }>({ time: 0, x: 0, y: 0 });
  const hudTimerRef = useRef<any>(null);
  const { language } = useLanguage();

  // Play futuristic Tony Stark Arc Reactor chime via Web Audio API
  const playWakeChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // First tone: 587.33 Hz (D5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain1.gain.setValueAtTime(0.18, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.12);

      // Second tone: 880 Hz (A5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain2.gain.setValueAtTime(0.22, ctx.currentTime + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.08);
      osc2.stop(ctx.currentTime + 0.28);
    } catch {
      // AudioContext policy fallback
    }
  }, []);

  // Trigger voice unlock flow
  const unlockVoiceAccess = useCallback((clientX: number, clientY: number) => {
    // 1. Haptic vibration feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 50, 40]);
      } catch {}
    }

    // 2. Play wake sound chime
    playWakeChime();

    // 3. Add visual expanding ripple at tap coordinates
    const newRipple: RipplePoint = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY,
    };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 900);

    // 4. Open global Voice Command Modal
    window.dispatchEvent(new CustomEvent('neurobridge_open_voice_modal'));

    // 5. Visual HUD notification
    const localizedMsg =
      language === 'hi'
        ? 'डबल-टैप पहचाना गया: वॉयस एक्सेस अनलॉक!'
        : language === 'or'
        ? 'ଡବଲ୍-ଟ୍ୟାପ୍ ଚିହ୍ନଟ: ଭଏସ୍ ଆକ୍ସେସ୍ ଅନଲକ୍!'
        : 'Double-Tap Detected: Voice Access Unlocked!';

    setHudToast({ visible: true, text: localizedMsg });
    if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
    hudTimerRef.current = setTimeout(() => {
      setHudToast(null);
    }, 3500);

    // 6. Vocal feedback chime
    const wakeSpoken =
      language === 'hi'
        ? 'सर, आवाज़ से बोलिए।'
        : language === 'or'
        ? 'ସାର୍, କୁହନ୍ତୁ କଣ ସାହାଯ୍ୟ କରିବି।'
        : 'Voice access unlocked, Sir. Listening.';
    assistantVoice.speak(wakeSpoken, false, language);
  }, [language, playWakeChime]);

  // Global Double-Tap & Double-Click Gesture Detector
  useEffect(() => {
    const isInteractiveInput = (target: HTMLElement | null): boolean => {
      if (!target) return false;
      const tag = target.tagName?.toUpperCase();
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (target.isContentEditable) return true;
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

      // Double tap detected: within 350ms and distance < 40px
      if (timeDiff > 40 && timeDiff <= 350 && dist < 40) {
        lastTapRef.current = { time: 0, x: 0, y: 0 };
        unlockVoiceAccess(touch.clientX, touch.clientY);
      } else {
        lastTapRef.current = { time: now, x: touch.clientX, y: touch.clientY };
      }
    };

    // 2. Desktop Mouse Double-Click Detector
    const handleDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (isInteractiveInput(target)) return;
      unlockVoiceAccess(e.clientX, e.clientY);
    };

    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('dblclick', handleDblClick);

    return () => {
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('dblclick', handleDblClick);
      if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
    };
  }, [unlockVoiceAccess]);

  return (
    <>
      {/* 3D Arc Reactor Shockwave Ripples at Double-Tap Location */}
      {ripples.map((r) => (
        <div
          key={r.id}
          style={{
            position: 'fixed',
            left: r.x,
            top: r.y,
            width: '20px',
            height: '20px',
            marginLeft: '-10px',
            marginTop: '-10px',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 99999,
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.8) 0%, rgba(245, 158, 11, 0.6) 45%, transparent 70%)',
            boxShadow: '0 0 30px #38bdf8, 0 0 60px #f59e0b',
            animation: 'doubleTapPulse 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
          }}
        />
      ))}

      {/* Floating HUD Arc Reactor Voice Banner Toast */}
      {hudToast && hudToast.visible && (
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
            boxShadow: '0 10px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.4), inset 0 0 15px rgba(245, 158, 11, 0.2)',
            backdropFilter: 'blur(16px)',
            color: '#f8fafc',
            fontSize: '0.88rem',
            fontWeight: 700,
            animation: 'hudSlideDown 0.3s cubic-bezier(0.2, 0.8, 0.3, 1) forwards',
            maxWidth: '92vw',
          }}
        >
          {/* Pulsing Arc Reactor Core Icon */}
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
              animation: 'pulseCore 1.5s ease-in-out infinite',
            }}
          >
            <Mic size={16} color="#0f172a" strokeWidth={2.5} />
          </div>

          <div>
            <div style={{ color: '#38bdf8', fontWeight: 800, letterSpacing: '0.02em', fontSize: '0.85rem' }}>
              {hudToast.text}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: '1px' }}>
              Microphone listening · Speak your math problem or question
            </div>
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
        @keyframes pulseCore {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 6px #38bdf8);
          }
          50% {
            transform: scale(1.12);
            filter: drop-shadow(0 0 12px #f59e0b);
          }
        }
      `}</style>
    </>
  );
};
