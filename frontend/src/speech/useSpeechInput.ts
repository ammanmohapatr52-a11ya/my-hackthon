import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// Declare types for Web Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useSpeechInput() {
  const { activeLocale } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(Boolean(SpeechRec));
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const startListening = useCallback(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setError('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      setIsSupported(false);
      return;
    }

    // Abort previous instance if any
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    const rec = new SpeechRec();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = activeLocale || 'en-IN';

    rec.onstart = () => {
      setIsListening(true);
      isListeningRef.current = true;
      setError(null);
    };

    rec.onresult = (event: any) => {
      let fullTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript + ' ';
      }
      setTranscript(fullTranscript.trim());
    };

    rec.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        // Normal silence, keep listening
        return;
      }
      console.warn('SpeechRecognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access in your browser settings.');
      } else {
        setError(`Microphone: ${event.error}`);
      }
      setIsListening(false);
      isListeningRef.current = false;
    };

    rec.onend = () => {
      setIsListening(false);
      isListeningRef.current = false;
    };

    recognitionRef.current = rec;
    setError(null);
    setTranscript('');

    try {
      rec.start();
    } catch (e: any) {
      console.warn('Recognition start exception:', e);
      setIsListening(false);
      isListeningRef.current = false;
    }
  }, [activeLocale]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {}
    setIsListening(false);
    isListeningRef.current = false;
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    setTranscript,
  };
}
