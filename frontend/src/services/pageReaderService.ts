/**
 * Neurobridge AI Page Reader Service
 * Intelligently extracts page headings, text content, mathematics derivations,
 * and academic solutions, converting them into natural spoken narration.
 * Supports pause, resume, sentence skipping, speed control, and multi-language synthesis.
 */

export interface PageReaderState {
  isActive: boolean;
  isPaused: boolean;
  currentIndex: number;
  totalSentences: number;
  currentSentence: string;
  pageTitle: string;
}

type ReaderStateListener = (state: PageReaderState) => void;

class PageReaderService {
  private sentences: string[] = [];
  private currentIndex = 0;
  private isActive = false;
  private isPaused = false;
  private pageTitle = '';
  private listeners: Set<ReaderStateListener> = new Set();
  private rate = 1.0;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.stop());
    }
  }

  public subscribe(listener: ReaderStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch (e) {
        console.warn('Reader listener error:', e);
      }
    });
  }

  public getState(): PageReaderState {
    return {
      isActive: this.isActive,
      isPaused: this.isPaused,
      currentIndex: this.currentIndex,
      totalSentences: this.sentences.length,
      currentSentence: this.sentences[this.currentIndex] || '',
      pageTitle: this.pageTitle,
    };
  }

  /**
   * Subtle arc-reactor chime to unlock audio context
   */
  private playChime() {
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
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  /**
   * Formats mathematical notation for natural, clear spoken audio
   */
  private formatMathForSpeech(raw: string): string {
    return raw
      .replace(/x\^2|x²/g, ' x squared ')
      .replace(/x\^3|x³/g, ' x cubed ')
      .replace(/(\w+)\^2/g, ' $1 squared ')
      .replace(/(\w+)\^3/g, ' $1 cubed ')
      .replace(/√\s*(\d+|\w+)/g, ' square root of $1 ')
      .replace(/sqrt\(([^)]+)\)/gi, ' square root of $1 ')
      .replace(/d\/dx\s*\(([^)]+)\)/gi, ' derivative of $1 ')
      .replace(/d\/dx/gi, ' derivative ')
      .replace(/\s*\+\s*/g, ' plus ')
      .replace(/\s*-\s*/g, ' minus ')
      .replace(/\s*[×*]\s*/g, ' times ')
      .replace(/\s*[÷/]\s*/g, ' divided by ')
      .replace(/\s*=\s*/g, ' equals ')
      .replace(/≠/g, ' is not equal to ')
      .replace(/≤/g, ' is less than or equal to ')
      .replace(/≥/g, ' is greater than or equal to ')
      .replace(/±/g, ' plus or minus ')
      .replace(/π/g, ' pi ')
      .replace(/∫/g, ' integral of ')
      .replace(/sin\(([^)]+)\)|sin\s+([0-9a-zA-Z]+)/gi, ' sine of $1$2 ')
      .replace(/cos\(([^)]+)\)|cos\s+([0-9a-zA-Z]+)/gi, ' cosine of $1$2 ')
      .replace(/tan\(([^)]+)\)|tan\s+([0-9a-zA-Z]+)/gi, ' tangent of $1$2 ')
      .replace(/Step\s*(\d+):?/gi, ' Step $1: ')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  /**
   * Intelligently extracts readable educational & academic text from current DOM
   */
  public extractPageSentences(): { title: string; sentences: string[] } {
    if (typeof document === 'undefined') {
      return { title: 'Page', sentences: [] };
    }

    // Determine page title
    const h1 = document.querySelector('h1');
    const title = (h1?.textContent || document.title || 'Neurobridge Academic Portal').trim();

    // Candidates: primary content containers
    const mainContainer =
      document.querySelector('main') ||
      document.querySelector('[role="main"]') ||
      document.querySelector('.page-container') ||
      document.querySelector('.container') ||
      document.body;

    // Content tags to extract
    const contentNodes = mainContainer.querySelectorAll(
      'h1, h2, h3, h4, p, li, blockquote, label, .step-item, .final-ans, .card-body, .math-output'
    );

    const rawBlocks: string[] = [];

    // Add main title first if not present
    if (h1?.textContent) {
      rawBlocks.push(h1.textContent);
    }

    contentNodes.forEach((node) => {
      // Exclude hidden, non-readable, or UI chrome elements
      const el = node as HTMLElement;
      if (!el || el.offsetParent === null) return; // Hidden
      if (el.closest('nav, header, footer, button, .modal, .hud-toast, [aria-hidden="true"]')) return;

      const text = el.innerText || el.textContent || '';
      const trimmed = text.trim();

      // Skip empty or trivial strings
      if (trimmed.length > 2 && !rawBlocks.includes(trimmed)) {
        rawBlocks.push(trimmed);
      }
    });

    // Fallback if no specific tags found
    if (rawBlocks.length === 0) {
      const bodyText = (mainContainer as HTMLElement).innerText || '';
      rawBlocks.push(...bodyText.split('\n').filter((l) => l.trim().length > 10));
    }

    // Break blocks into sentences of manageable audio size
    const sentenceList: string[] = [];
    rawBlocks.forEach((block) => {
      const formatted = this.formatMathForSpeech(block);
      // Split on sentence terminators (. ! ? or newline)
      const parts = formatted
        .split(/(?<=[.!?\n])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 1);

      parts.forEach((p) => {
        // If part is very long (> 160 chars), break on commas or clauses
        if (p.length > 180) {
          const sub = p.split(/,\s+/).filter(Boolean);
          sentenceList.push(...sub);
        } else {
          sentenceList.push(p);
        }
      });
    });

    return {
      title,
      sentences: sentenceList.length > 0 ? sentenceList : ['Neurobridge Academic Portal. Page content ready.'],
    };
  }

  /**
   * Toggles reading: starts if idle/stopped, stops if already reading
   */
  public toggleReading(langOverride?: 'en' | 'hi' | 'or'): boolean {
    if (this.isActive) {
      this.stop();
      return false; // Stopped
    } else {
      this.start(langOverride);
      return true; // Started
    }
  }

  /**
   * Starts reading the current page from beginning or specified index
   */
  public start(langOverride?: 'en' | 'hi' | 'or', startIndex = 0) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported in this browser.');
      return;
    }

    this.stop();

    const { title, sentences } = this.extractPageSentences();
    this.pageTitle = title;
    this.sentences = sentences;
    this.currentIndex = Math.max(0, Math.min(startIndex, sentences.length - 1));
    this.isActive = true;
    this.isPaused = false;

    this.playChime();
    this.notify();
    this.speakCurrentSentence(langOverride);
  }

  private speakCurrentSentence(langOverride?: 'en' | 'hi' | 'or') {
    if (!this.isActive || this.currentIndex >= this.sentences.length) {
      this.finishReading();
      return;
    }

    const textToSpeak = this.sentences[this.currentIndex];
    if (!textToSpeak || !textToSpeak.trim()) {
      this.next();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = this.rate;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Select localized voice
      const activeLang =
        langOverride ||
        (document.documentElement.lang as any) ||
        (localStorage.getItem('language') as any) ||
        'en';

      const voices = window.speechSynthesis.getVoices();
      let matchedVoice: SpeechSynthesisVoice | undefined;

      if (activeLang === 'hi') {
        utterance.lang = 'hi-IN';
        matchedVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('hi') ||
            v.name.toLowerCase().includes('hindi') ||
            v.name.toLowerCase().includes('kalpana') ||
            v.name.toLowerCase().includes('swara')
        );
      } else if (activeLang === 'or') {
        utterance.lang = 'or-IN';
        matchedVoice =
          voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith('or') ||
              v.name.toLowerCase().includes('odia') ||
              v.name.toLowerCase().includes('oriya')
          ) ||
          voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith('hi') ||
              v.name.toLowerCase().includes('hindi') ||
              v.lang.toLowerCase() === 'en-in'
          );
      } else {
        utterance.lang = 'en-IN';
        matchedVoice =
          voices.find((v) => v.lang.toLowerCase() === 'en-in') ||
          voices.find((v) => v.lang.toLowerCase().startsWith('en'));
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      this.activeUtterance = utterance;

      utterance.onend = () => {
        if (this.isActive && !this.isPaused) {
          this.currentIndex++;
          this.notify();
          // Small natural breath pause between sentences (120ms)
          setTimeout(() => {
            if (this.isActive && !this.isPaused) {
              this.speakCurrentSentence(langOverride);
            }
          }, 120);
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('Utterance error:', e.error);
        }
        if (this.isActive && !this.isPaused) {
          this.currentIndex++;
          this.notify();
          setTimeout(() => this.speakCurrentSentence(langOverride), 100);
        }
      };

      window.speechSynthesis.speak(utterance);
      this.notify();
    } catch (err) {
      console.warn('SpeechSynthesis error:', err);
      this.stop();
    }
  }

  public pause() {
    if (!this.isActive || this.isPaused) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.isPaused = true;
    this.notify();
  }

  public resume(langOverride?: 'en' | 'hi' | 'or') {
    if (!this.isActive || !this.isPaused) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
    this.isPaused = false;
    this.notify();
    // If browser resume failed or was empty, re-speak current sentence
    if (!window.speechSynthesis.speaking) {
      this.speakCurrentSentence(langOverride);
    }
  }

  public next(langOverride?: 'en' | 'hi' | 'or') {
    if (!this.isActive) return;
    if (this.currentIndex < this.sentences.length - 1) {
      this.currentIndex++;
      this.speakCurrentSentence(langOverride);
    } else {
      this.finishReading();
    }
  }

  public previous(langOverride?: 'en' | 'hi' | 'or') {
    if (!this.isActive) return;
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.speakCurrentSentence(langOverride);
    }
  }

  public setRate(newRate: number, langOverride?: 'en' | 'hi' | 'or') {
    this.rate = Math.max(0.7, Math.min(2.0, newRate));
    if (this.isActive && !this.isPaused) {
      this.speakCurrentSentence(langOverride);
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.isActive = false;
    this.isPaused = false;
    this.currentIndex = 0;
    this.activeUtterance = null;
    this.notify();
  }

  private finishReading() {
    this.stop();
  }
}

export const pageReaderService = new PageReaderService();
