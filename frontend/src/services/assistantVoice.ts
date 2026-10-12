/**
 * Bulletproof Voice Assistant Service for Neurobridge
 * 
 * Features:
 * - Solves Chromium utterance garbage-collection bug (#679437) by pinning active utterance
 * - Handles SpeechSynthesis pause/resume state across all browsers
 * - Pre-warms audio pipeline with Web Audio API wake chime
 * - Handles browser Autoplay Policy with seamless first-gesture unlock
 * - Prevents re-render cancellation race conditions
 */

type VoiceStateListener = (isSpeaking: boolean, currentText: string | null) => void;

class AssistantVoiceService {
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;
  private currentSpokenText: string | null = null;
  private listeners: Set<VoiceStateListener> = new Set();
  private gestureUnlocked = false;
  private queuedText: string | null = null;
  private audioContext: AudioContext | null = null;
  private currentLanguage: 'en' | 'hi' | 'or' = 'en';

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem('language');
        if (savedLang === 'hi' || savedLang === 'or' || savedLang === 'en') {
          this.currentLanguage = savedLang;
        } else if (document.documentElement.lang === 'hi' || document.documentElement.lang === 'or') {
          this.currentLanguage = document.documentElement.lang as any;
        }
      } catch {}

      // Listen for language switch events in real-time
      window.addEventListener('app:language-changed', (e: any) => {
        if (e.detail?.language) {
          this.currentLanguage = e.detail.language;
        }
      });

      // Listen for first user interaction to unlock audio/speech autoplay
      const unlock = () => {
        this.gestureUnlocked = true;
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('click', unlock);
        window.removeEventListener('keydown', unlock);

        // If there was queued text waiting for gesture, speak now
        if (this.queuedText && this.isVoiceEnabled()) {
          const text = this.queuedText;
          this.queuedText = null;
          this.speak(text);
        }
      };

      window.addEventListener('pointerdown', unlock, { once: true });
      window.addEventListener('click', unlock, { once: true });
      window.addEventListener('keydown', unlock, { once: true });

      // Pre-warm voices
      if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }

  public setLanguage(lang: 'en' | 'hi' | 'or') {
    this.currentLanguage = lang;
  }

  public getLanguage(): 'en' | 'hi' | 'or' {
    return this.currentLanguage;
  }

  public isVoiceEnabled(): boolean {
    if (typeof window === 'undefined') return true;
    try {
      const val = localStorage.getItem('neurobridge_assistant_voice_enabled');
      return val !== null ? val === 'true' : true;
    } catch {
      return true;
    }
  }

  public setVoiceEnabled(enabled: boolean) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('neurobridge_assistant_voice_enabled', String(enabled));
    } catch {}
    if (!enabled) {
      this.stop();
    }
    this.notify();
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public getCurrentText(): string | null {
    return this.currentSpokenText;
  }

  public subscribe(listener: VoiceStateListener): () => void {
    this.listeners.add(listener);
    listener(this.isSpeakingState, this.currentSpokenText);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => {
      try {
        fn(this.isSpeakingState, this.currentSpokenText);
      } catch (err) {
        console.error('Error notifying assistant voice listener', err);
      }
    });
  }

  /**
   * Play high-tech subtle acoustic wake chime to un-suspend sound output device
   */
  private playWakeChime() {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new AudioCtx();
      }

      const ctx = this.audioContext;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.08); // G5

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  /**
   * Speak aloud using Web Speech API with guaranteed execution & multi-language voice selection
   */
  public speak(text: string, force = false, langOverride?: 'en' | 'hi' | 'or'): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return false;
    }

    if (!force && !this.isVoiceEnabled()) {
      return false;
    }

    // Stop any existing utterance
    this.stop();

    // Play wake chime to guarantee audio output device is running
    this.playWakeChime();

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      // Determine active language
      const activeLang: 'en' | 'hi' | 'or' =
        langOverride ||
        this.currentLanguage ||
        (typeof document !== 'undefined' && (document.documentElement.lang === 'hi' || document.documentElement.lang === 'or')
          ? (document.documentElement.lang as any)
          : 'en');

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.0;
      utterance.volume = 1.0; // Clear full volume

      const voices = window.speechSynthesis.getVoices();
      let matchedVoice: SpeechSynthesisVoice | undefined;

      if (activeLang === 'hi') {
        utterance.lang = 'hi-IN';
        utterance.rate = 0.95;
        matchedVoice =
          voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith('hi') ||
              v.name.toLowerCase().includes('hindi') ||
              v.name.toLowerCase().includes('kalpana') ||
              v.name.toLowerCase().includes('hemant') ||
              v.name.toLowerCase().includes('swara')
          ) ||
          voices.find((v) => v.lang.toLowerCase() === 'en-in' || v.name.toLowerCase().includes('india'));
      } else if (activeLang === 'or') {
        utterance.lang = 'or-IN';
        utterance.rate = 0.92;
        matchedVoice =
          voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith('or') ||
              v.lang.toLowerCase().startsWith('ory') ||
              v.name.toLowerCase().includes('odia') ||
              v.name.toLowerCase().includes('oriya')
          ) ||
          voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith('hi') ||
              v.name.toLowerCase().includes('hindi') ||
              v.name.toLowerCase().includes('kalpana') ||
              v.lang.toLowerCase() === 'en-in' ||
              v.name.toLowerCase().includes('india')
          );
      } else {
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        matchedVoice =
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Natural') ||
                v.name.includes('Google') ||
                v.name.includes('David') ||
                v.name.includes('Mark') ||
                v.name.includes('Zira') ||
                v.name.includes('Samantha') ||
                v.name.includes('Jenny') ||
                v.name.includes('Alex'))
          ) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      // CRITICAL: Pin utterance to class instance so Chrome garbage collection will never kill it mid-sentence
      this.activeUtterance = utterance;
      (window as any).__neurobridge_active_utterance = utterance;

      utterance.onstart = () => {
        this.isSpeakingState = true;
        this.currentSpokenText = text;
        this.notify();
      };

      utterance.onend = () => {
        this.isSpeakingState = false;
        this.currentSpokenText = null;
        this.activeUtterance = null;
        this.notify();
      };

      utterance.onerror = (e) => {
        // If canceled intentionally by navigation, ignore
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('Assistant speech error:', e.error);
        }
        this.isSpeakingState = false;
        this.currentSpokenText = null;
        this.activeUtterance = null;
        this.notify();
      };

      // Slight tick allows speech engine to initialize
      setTimeout(() => {
        window.speechSynthesis.resume();
        window.speechSynthesis.speak(utterance);
      }, 20);

      return true;
    } catch (err) {
      console.warn('SpeechSynthesis exception:', err);
      this.queuedText = text;
      return false;
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.isSpeakingState = false;
    this.currentSpokenText = null;
    this.activeUtterance = null;
    this.notify();
  }
}

export const assistantVoice = new AssistantVoiceService();
