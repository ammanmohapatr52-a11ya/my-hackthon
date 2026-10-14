import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// Declare types for Web Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

/**
 * Normalizes spoken academic and mathematical expressions into standard notation
 * e.g. "two x plus six equals fourteen" -> "2x + 6 = 14"
 */
export function normalizeMathSpeech(raw: string): string {
  if (!raw) return '';

  let text = raw.trim();

  // Spoken number word conversions
  const numberWords: Record<string, string> = {
    zero: '0',
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
    ten: '10',
    शून्य: '0',
    एक: '1',
    दो: '2',
    तीन: '3',
    चार: '4',
    पाँच: '5',
    छह: '6',
    सात: '7',
    आठ: '8',
    नौ: '9',
    दस: '10',
  };

  // Replace single isolated number words
  Object.keys(numberWords).forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    text = text.replace(regex, numberWords[word]);
  });

  // Math operators and terms normalization (English, Hindi, Hinglish)
  return text
    .replace(/\bplus\b|\bजोड़\b|\bधन\b/gi, ' + ')
    .replace(/\bminus\b|\bघटाओ\b|\bऋण\b/gi, ' - ')
    .replace(/\btimes\b|\bmultiplied by\b|\binto\b|\bगुना\b/gi, ' * ')
    .replace(/\bdivided by\b|\bdivide by\b|\bover\b|\bभाग\b/gi, ' / ')
    .replace(/\bequals to\b|\bequal to\b|\bequals\b|\bis equal to\b|\bबराबर\b/gi, ' = ')
    .replace(/\bsquared\b|\bsquare\b|\bका वर्ग\b/gi, '²')
    .replace(/\bcubed\b|\bcube\b|\bका घन\b/gi, '³')
    .replace(/\bsquare root of\b|\broot of\b|\broot\b|\bवर्गमूल\b/gi, '√')
    .replace(/\bpower of\b|\bto the power\b|\bघात\b/gi, '^')
    .replace(/\bd by dx of\b|\bderivative of\b|\bअवकलन\b/gi, 'd/dx(')
    .replace(/\bintegral of\b|\bintegrate\b|\bसमाकलन\b/gi, '∫ ')
    .replace(/\bsine of\b|\bsin of\b|\bsine\b/gi, 'sin(')
    .replace(/\bcosine of\b|\bcos of\b|\bcosine\b/gi, 'cos(')
    .replace(/\btangent of\b|\btan of\b|\btangent\b/gi, 'tan(')
    .replace(/\bpie\b|\bpi\b/gi, 'π')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function useSpeechInput() {
  const { language, activeLocale } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const shouldListenRef = useRef(false);
  const restartTimerRef = useRef<any>(null);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    const SpeechRec = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    setIsSupported(Boolean(SpeechRec));

    return () => {
      shouldListenRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  /**
   * Safe locale resolver: Odia ('or') is not supported by Chrome Web Speech API.
   * Fallback to 'hi-IN' or 'en-IN' for Indian multilingual speech recognition.
   */
  const getSupportedSpeechLocale = useCallback((): string => {
    if (language === 'hi') return 'hi-IN';
    if (language === 'or') return 'hi-IN'; // Odia fallback to Indian phonetic model
    return activeLocale || 'en-IN';
  }, [language, activeLocale]);

  const initAndStartRecognition = useCallback(async () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setError('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      setIsSupported(false);
      return;
    }

    // 1. Proactively test microphone permissions via getUserMedia if available
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release tracks immediately so SpeechRecognition has full exclusive hardware control
        stream.getTracks().forEach((track) => track.stop());
      } catch (mediaErr: any) {
        console.warn('Microphone permission status:', mediaErr);
        if (mediaErr?.name === 'NotAllowedError' || mediaErr?.name === 'PermissionDeniedError') {
          setError('Microphone permission was denied. Please allow microphone access in your browser settings.');
          setIsListening(false);
          shouldListenRef.current = false;
          return;
        }
      }
    }

    // 2. Clear any lingering instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    const rec = new SpeechRec();
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.lang = getSupportedSpeechLocale();

    rec.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    rec.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscriptRef.current += ' ' + item[0].transcript;
        } else {
          interim += ' ' + item[0].transcript;
        }
      }

      const combined = (finalTranscriptRef.current + ' ' + interim).trim();
      const normalized = normalizeMathSpeech(combined);
      setTranscript(normalized);
    };

    rec.onerror = (event: any) => {
      const err = event.error;
      // Normal pause/silence in conversation, don't abort user session
      if (err === 'no-speech') {
        return;
      }
      if (err === 'aborted') {
        return;
      }

      console.warn('SpeechRecognition error encountered:', err);
      if (err === 'not-allowed') {
        setError('Microphone access blocked. Click the lock/camera icon in your address bar to allow microphone.');
        shouldListenRef.current = false;
        setIsListening(false);
      } else if (err === 'network') {
        setError('Speech network error. Please check your internet connection.');
      } else {
        setError(`Microphone notice: ${err}`);
      }
    };

    rec.onend = () => {
      // Auto-restart if user still wants to be listening (solves Chrome silence cutoff bug!)
      if (shouldListenRef.current) {
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          if (shouldListenRef.current) {
            try {
              rec.start();
            } catch (e) {
              console.warn('Could not auto-restart recognition:', e);
            }
          }
        }, 100);
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = rec;
    setError(null);

    try {
      rec.start();
    } catch (e: any) {
      console.warn('Direct SpeechRec.start() failed, will retry with user gesture:', e);
      // If already started or browser state pending, retry after tick
      setTimeout(() => {
        try {
          if (shouldListenRef.current) rec.start();
        } catch {}
      }, 150);
    }
  }, [getSupportedSpeechLocale]);

  const startListening = useCallback(() => {
    shouldListenRef.current = true;
    finalTranscriptRef.current = '';
    setTranscript('');
    setError(null);
    initAndStartRecognition();
  }, [initAndStartRecognition]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    setTranscript,
    normalizeMathSpeech,
  };
}
