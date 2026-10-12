/**
 * Welcome Music & Chime Engine for Neurobridge
 * Synthesizes rich, harmonic, acoustic-style musical tunes via Web Audio API.
 * 
 * Features:
 * - Polyphonic harmonic synthesis (sine fundamental + detuned triangle harmonic warmth)
 * - Anti-click ADSR envelopes with smooth exponential decay
 * - Browser Autoplay policy compliance with seamless gesture unlock
 * - WCAG 1.4.2 audio control compliance (instant mute, volume, stop)
 */

export type TunePresetId = 'chime' | 'ambient' | 'fanfare';

export interface NoteDefinition {
  frequency: number;
  startTime: number;
  duration: number;
  noteName: string;
  gainMultiplier?: number;
}

export interface TunePreset {
  id: TunePresetId;
  name: string;
  description: string;
  tempo: string;
  notes: NoteDefinition[];
}

export interface TuneState {
  isPlaying: boolean;
  activeNote: string | null;
  activeTuneId: TunePresetId;
  isMuted: boolean;
  volume: number;
  autoPlayEnabled: boolean;
}

// Preset Melodies
export const TUNE_PRESETS: Record<TunePresetId, TunePreset> = {
  chime: {
    id: 'chime',
    name: 'Harmonic Chime',
    description: 'Warm, uplifting pentatonic chime resolving in a lush major chord',
    tempo: 'Uplifting',
    notes: [
      { frequency: 261.63, startTime: 0.00, duration: 0.45, noteName: 'C4', gainMultiplier: 0.9 },
      { frequency: 329.63, startTime: 0.16, duration: 0.45, noteName: 'E4', gainMultiplier: 0.9 },
      { frequency: 392.00, startTime: 0.32, duration: 0.50, noteName: 'G4', gainMultiplier: 0.95 },
      { frequency: 493.88, startTime: 0.48, duration: 0.55, noteName: 'B4', gainMultiplier: 0.95 },
      { frequency: 587.33, startTime: 0.64, duration: 0.60, noteName: 'D5', gainMultiplier: 1.0 },
      // Sustained resolving harmony chord (C Major 9th shimmer)
      { frequency: 523.25, startTime: 0.82, duration: 2.20, noteName: 'C5', gainMultiplier: 0.85 },
      { frequency: 659.25, startTime: 0.84, duration: 2.20, noteName: 'E5', gainMultiplier: 0.80 },
      { frequency: 783.99, startTime: 0.86, duration: 2.40, noteName: 'G5', gainMultiplier: 0.75 },
      { frequency: 1046.50, startTime: 0.90, duration: 2.50, noteName: 'C6', gainMultiplier: 0.65 },
    ],
  },
  ambient: {
    id: 'ambient',
    name: 'Calm Focus',
    description: 'Soothing, gentle marimba tones crafted for deep concentration',
    tempo: 'Peaceful',
    notes: [
      { frequency: 349.23, startTime: 0.00, duration: 0.55, noteName: 'F4', gainMultiplier: 0.85 },
      { frequency: 440.00, startTime: 0.22, duration: 0.55, noteName: 'A4', gainMultiplier: 0.9 },
      { frequency: 523.25, startTime: 0.44, duration: 0.60, noteName: 'C5', gainMultiplier: 0.95 },
      { frequency: 659.25, startTime: 0.66, duration: 0.70, noteName: 'E5', gainMultiplier: 1.0 },
      // Ambient warm chord
      { frequency: 349.23, startTime: 0.90, duration: 2.00, noteName: 'F4', gainMultiplier: 0.75 },
      { frequency: 523.25, startTime: 0.92, duration: 2.20, noteName: 'C5', gainMultiplier: 0.80 },
      { frequency: 698.46, startTime: 0.94, duration: 2.40, noteName: 'F5', gainMultiplier: 0.70 },
    ],
  },
  fanfare: {
    id: 'fanfare',
    name: 'Joyful Fanfare',
    description: 'Bright, celebratory musical flourish welcoming you back',
    tempo: 'Energetic',
    notes: [
      { frequency: 392.00, startTime: 0.00, duration: 0.28, noteName: 'G4', gainMultiplier: 0.9 },
      { frequency: 523.25, startTime: 0.14, duration: 0.28, noteName: 'C5', gainMultiplier: 0.95 },
      { frequency: 659.25, startTime: 0.28, duration: 0.32, noteName: 'E5', gainMultiplier: 1.0 },
      { frequency: 783.99, startTime: 0.42, duration: 0.40, noteName: 'G5', gainMultiplier: 1.0 },
      { frequency: 659.25, startTime: 0.58, duration: 0.35, noteName: 'E5', gainMultiplier: 0.9 },
      // Triumphant chord
      { frequency: 523.25, startTime: 0.72, duration: 2.20, noteName: 'C5', gainMultiplier: 0.85 },
      { frequency: 783.99, startTime: 0.74, duration: 2.20, noteName: 'G5', gainMultiplier: 0.85 },
      { frequency: 1046.50, startTime: 0.76, duration: 2.40, noteName: 'C6', gainMultiplier: 0.75 },
    ],
  },
};

// Storage Keys
const STORAGE_MUTED = 'neurobridge_welcome_tune_muted';
const STORAGE_VOLUME = 'neurobridge_welcome_tune_volume';
const STORAGE_TUNE_ID = 'neurobridge_welcome_tune_id';
const STORAGE_AUTOPLAY = 'neurobridge_welcome_tune_autoplay';
const SESSION_PLAYED_KEY = 'neurobridge_welcome_tune_session_played';

class WelcomeTuneManager {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private lowpassFilter: BiquadFilterNode | null = null;
  private activeTimeouts: number[] = [];
  private listeners: Set<(state: TuneState) => void> = new Set();
  private unlockListenerAttached = false;

  private state: TuneState = {
    isPlaying: false,
    activeNote: null,
    activeTuneId: 'chime',
    isMuted: false,
    volume: 0.3,
    autoPlayEnabled: true,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const storedMuted = localStorage.getItem(STORAGE_MUTED);
        if (storedMuted !== null) {
          this.state.isMuted = storedMuted === 'true';
        }

        const storedVol = localStorage.getItem(STORAGE_VOLUME);
        if (storedVol !== null) {
          const parsed = parseFloat(storedVol);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
            this.state.volume = parsed;
          }
        }

        const storedTune = localStorage.getItem(STORAGE_TUNE_ID) as TunePresetId;
        if (storedTune && storedTune in TUNE_PRESETS) {
          this.state.activeTuneId = storedTune;
        }

        const storedAutoplay = localStorage.getItem(STORAGE_AUTOPLAY);
        if (storedAutoplay !== null) {
          this.state.autoPlayEnabled = storedAutoplay === 'true';
        }
      } catch {
        // Safe fallback in restrictive environments
      }
    }
  }

  public getState(): TuneState {
    return { ...this.state };
  }

  public subscribe(listener: (state: TuneState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((fn) => {
      try {
        fn(currentState);
      } catch (err) {
        console.error('Error notifying welcome tune listener', err);
      }
    });
  }

  private initAudio(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return null;

      this.audioCtx = new AudioCtxClass();

      // Master lowpass filter for gentle, warm tone (removes harsh digital buzz)
      this.lowpassFilter = this.audioCtx.createBiquadFilter();
      this.lowpassFilter.type = 'lowpass';
      this.lowpassFilter.frequency.setValueAtTime(2400, this.audioCtx.currentTime);
      this.lowpassFilter.Q.setValueAtTime(1.1, this.audioCtx.currentTime);

      // Master gain node
      this.masterGain = this.audioCtx.createGain();
      const effectiveGain = this.state.isMuted ? 0 : this.state.volume;
      this.masterGain.gain.setValueAtTime(effectiveGain, this.audioCtx.currentTime);

      this.lowpassFilter.connect(this.masterGain);
      this.masterGain.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    return this.audioCtx;
  }

  /**
   * Plays a specific note using dual-oscillator acoustic bell/chime modeling
   */
  private playNote(
    ctx: AudioContext,
    destination: AudioNode,
    note: NoteDefinition,
    baseStartTime: number
  ) {
    const startTime = baseStartTime + note.startTime;
    const duration = note.duration;
    const gainMultiplier = note.gainMultiplier ?? 1.0;

    // Note envelope gain
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0.0001, startTime);

    // Fast, smooth attack (15ms)
    const attackTime = 0.015;
    const peakGain = 0.32 * gainMultiplier;
    noteGain.gain.exponentialRampToValueAtTime(peakGain, startTime + attackTime);

    // Exponential decay to tail
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    // Oscillator 1: Pure fundamental sine wave
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(note.frequency, startTime);

    // Oscillator 2: Triangle wave with subtle warm detuning (+4 cents) for acoustic resonance
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(note.frequency, startTime);
    osc2.detune.setValueAtTime(4, startTime);

    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.24, startTime);

    osc1.connect(noteGain);
    osc2.connect(osc2Gain);
    osc2Gain.connect(noteGain);
    noteGain.connect(destination);

    osc1.start(startTime);
    osc2.start(startTime);

    osc1.stop(startTime + duration + 0.05);
    osc2.stop(startTime + duration + 0.05);

    // Update active note for UI visualizer
    const noteTimer = window.setTimeout(() => {
      this.state.activeNote = note.noteName;
      this.notify();
    }, note.startTime * 1000);

    const clearNoteTimer = window.setTimeout(() => {
      if (this.state.activeNote === note.noteName) {
        this.state.activeNote = null;
        this.notify();
      }
    }, (note.startTime + Math.min(0.35, note.duration)) * 1000);

    this.activeTimeouts.push(noteTimer, clearNoteTimer);
  }

  /**
   * Play the selected welcoming tune
   */
  public async play(presetId?: TunePresetId): Promise<boolean> {
    this.stop();

    if (presetId) {
      this.setTune(presetId);
    }

    const currentPreset = TUNE_PRESETS[this.state.activeTuneId] || TUNE_PRESETS.chime;
    const ctx = this.initAudio();
    if (!ctx || !this.lowpassFilter || !this.masterGain) {
      return false;
    }

    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
    } catch {
      // Browser autoplay policy might require interaction
    }

    this.state.isPlaying = true;
    this.notify();

    const baseStartTime = ctx.currentTime + 0.04;
    let maxEndTime = 0;

    currentPreset.notes.forEach((note) => {
      this.playNote(ctx, this.lowpassFilter!, note, baseStartTime);
      const noteEnd = note.startTime + note.duration;
      if (noteEnd > maxEndTime) {
        maxEndTime = noteEnd;
      }
    });

    // Mark as played in session
    try {
      sessionStorage.setItem(SESSION_PLAYED_KEY, 'true');
    } catch {}

    const finishTimeout = window.setTimeout(() => {
      this.state.isPlaying = false;
      this.state.activeNote = null;
      this.notify();
    }, (maxEndTime + 0.15) * 1000);

    this.activeTimeouts.push(finishTimeout);
    return true;
  }

  /**
   * Stop any currently playing tune
   */
  public stop() {
    this.activeTimeouts.forEach((id) => clearTimeout(id));
    this.activeTimeouts = [];

    if (this.masterGain && this.audioCtx) {
      try {
        // Quickly fade out without clicks
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.audioCtx.currentTime);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.05);

        // Reset gain after fade out
        setTimeout(() => {
          if (this.masterGain && this.audioCtx) {
            const targetGain = this.state.isMuted ? 0 : this.state.volume;
            this.masterGain.gain.setValueAtTime(targetGain, this.audioCtx.currentTime);
          }
        }, 60);
      } catch {}
    }

    this.state.isPlaying = false;
    this.state.activeNote = null;
    this.notify();
  }

  /**
   * Toggle or set mute
   */
  public toggleMute(): boolean {
    return this.setMuted(!this.state.isMuted);
  }

  public setMuted(muted: boolean): boolean {
    this.state.isMuted = muted;
    try {
      localStorage.setItem(STORAGE_MUTED, String(muted));
    } catch {}

    if (this.masterGain && this.audioCtx) {
      const target = muted ? 0 : this.state.volume;
      this.masterGain.gain.setValueAtTime(target, this.audioCtx.currentTime);
    }

    if (muted && this.state.isPlaying) {
      this.stop();
    }

    this.notify();
    return this.state.isMuted;
  }

  /**
   * Adjust master volume (0.0 to 1.0)
   */
  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.state.volume = clamped;
    try {
      localStorage.setItem(STORAGE_VOLUME, String(clamped));
    } catch {}

    if (this.masterGain && this.audioCtx && !this.state.isMuted) {
      this.masterGain.gain.setValueAtTime(clamped, this.audioCtx.currentTime);
    }
    this.notify();
  }

  /**
   * Select tune preset
   */
  public setTune(presetId: TunePresetId) {
    if (presetId in TUNE_PRESETS) {
      this.state.activeTuneId = presetId;
      try {
        localStorage.setItem(STORAGE_TUNE_ID, presetId);
      } catch {}
      this.notify();
    }
  }

  /**
   * Toggle autoplay on page arrival
   */
  public setAutoPlayEnabled(enabled: boolean) {
    this.state.autoPlayEnabled = enabled;
    try {
      localStorage.setItem(STORAGE_AUTOPLAY, String(enabled));
    } catch {}
    this.notify();
  }

  /**
   * Checks session storage to see if tune has already played this session
   */
  public hasPlayedThisSession(): boolean {
    try {
      return sessionStorage.getItem(SESSION_PLAYED_KEY) === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Attempt automatic playback when landing on the welcome/first page.
   * If blocked by the browser autoplay policy, it gracefully attaches
   * a single gesture listener to immediately play upon user interaction.
   */
  public attemptAutoWelcome(force = false): void {
    if (this.state.isMuted || (!this.state.autoPlayEnabled && !force)) {
      return;
    }

    if (!force && this.hasPlayedThisSession()) {
      return;
    }

    // Attempt to start audio context
    const ctx = this.initAudio();
    if (!ctx) return;

    if (ctx.state === 'running') {
      // Allowed immediately
      setTimeout(() => {
        this.play();
      }, 350);
      return;
    }

    // If suspended due to browser policy, wait for first user gesture
    if (!this.unlockListenerAttached) {
      this.unlockListenerAttached = true;

      const unlockAndPlay = () => {
        window.removeEventListener('pointerdown', unlockAndPlay);
        window.removeEventListener('keydown', unlockAndPlay);
        this.unlockListenerAttached = false;

        if (this.state.isMuted || (!this.state.autoPlayEnabled && !force)) return;
        if (!force && this.hasPlayedThisSession()) return;

        this.play();
      };

      window.addEventListener('pointerdown', unlockAndPlay, { once: true });
      window.addEventListener('keydown', unlockAndPlay, { once: true });
    }
  }
}

// Export singleton instance
export const welcomeTune = new WelcomeTuneManager();
