import { useState, useEffect, useRef, useCallback } from 'react';
import { splitIntoUnits, type SentenceUnit, type WordUnit } from './textUnits';
import { getSetting } from '../storage/settingsStore';
import { useLanguage } from '../i18n/LanguageContext';

export interface SpeechOutputState {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  currentWordIndex: number | null;
  currentSentenceIndex: number | null;
  currentCaptionText: string;
  sentences: SentenceUnit[];
  voices: SpeechSynthesisVoice[];
  rate: number;
  voiceName: string;
}

export function useSpeechOutput() {
  const { language, activeLocale } = useLanguage();
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number | null>(null);
  const [currentCaptionText, setCurrentCaptionText] = useState('');
  const [sentences, setSentences] = useState<SentenceUnit[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(1.0);
  const [voiceName, setVoiceName] = useState('');

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fullTextRef = useRef<string>('');
  const sentencesRef = useRef<SentenceUnit[]>([]);

  // Load available voices & user settings
  useEffect(() => {
    if (!isSupported) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    async function loadSettings() {
      const storedRate = await getSetting<number>('speechSpeed', 1.0);
      const storedVoice = await getSetting<string>('speechVoice', '');
      setRate(storedRate);
      setVoiceName(storedVoice);
    }
    loadSettings();

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(null);
    setCurrentSentenceIndex(null);
    setCurrentCaptionText('');
  }, [isSupported]);

  // Cancel ongoing audio whenever user switches language
  useEffect(() => {
    stop();
  }, [language, stop]);

  const pause = useCallback(() => {
    if (!isSupported || !isPlaying) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported, isPlaying]);

  const resume = useCallback(() => {
    if (!isSupported || !isPaused) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported, isPaused]);

  const speakText = useCallback(
    (text: string, startIndex = 0, langOverride?: string) => {
      if (!isSupported || !text.trim()) return;

      stop();

      const unitList = splitIntoUnits(text);
      setSentences(unitList);
      sentencesRef.current = unitList;
      fullTextRef.current = text;

      // Slice from sentence startIndex if requested
      let textToSpeak = text;
      if (startIndex > 0 && startIndex < unitList.length) {
        textToSpeak = text.substring(unitList[startIndex].start);
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = rate;

      // 1. Language matching & localized voice selection
      const effectiveLang = langOverride || language;
      let targetLang = effectiveLang === 'hi' ? 'hi-IN' : effectiveLang === 'or' ? 'or-IN' : activeLocale || 'en-IN';
      let matchedVoice: SpeechSynthesisVoice | undefined;

      // Only accept user-configured voiceName if its language is compatible
      if (voiceName) {
        const customCandidate = voices.find((v) => v.name === voiceName);
        if (customCandidate) {
          const cLang = customCandidate.lang.toLowerCase();
          if (effectiveLang === 'hi' && cLang.startsWith('hi')) {
            matchedVoice = customCandidate;
          } else if (
            effectiveLang === 'or' &&
            (cLang.startsWith('or') || cLang.startsWith('ory') || cLang.startsWith('hi') || customCandidate.name.toLowerCase().includes('india'))
          ) {
            matchedVoice = customCandidate;
          } else if (effectiveLang === 'en' && cLang.startsWith('en')) {
            matchedVoice = customCandidate;
          }
        }
      }

      if (!matchedVoice) {
        if (effectiveLang === 'hi') {
          targetLang = 'hi-IN';
          matchedVoice = voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith('hi') ||
              v.name.toLowerCase().includes('hindi') ||
              v.name.toLowerCase().includes('kalpana') ||
              v.name.toLowerCase().includes('hemant') ||
              v.name.toLowerCase().includes('swara')
          );
        } else if (effectiveLang === 'or') {
          targetLang = 'or-IN';
          matchedVoice = voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith('or') ||
              v.lang.toLowerCase().startsWith('ory') ||
              v.name.toLowerCase().includes('odia') ||
              v.name.toLowerCase().includes('oriya')
          );
          // Fallback to Indian phonetic voice if OS has no dedicated Odia TTS
          if (!matchedVoice) {
            matchedVoice = voices.find(
              (v) =>
                v.lang.toLowerCase().startsWith('hi') ||
                v.name.toLowerCase().includes('hindi') ||
                v.name.toLowerCase().includes('kalpana') ||
                v.lang.toLowerCase().includes('in') ||
                v.name.toLowerCase().includes('india')
            );
          }
        } else {
          targetLang = 'en-IN';
          matchedVoice =
            voices.find((v) => v.lang.toLowerCase() === 'en-in') ||
            voices.find((v) => v.lang.toLowerCase().startsWith('en'));
        }
      }

      utterance.lang = targetLang;
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      const startOffset = startIndex > 0 && startIndex < unitList.length ? unitList[startIndex].start : 0;

      utterance.onboundary = (event) => {
        const charIdx = startOffset + event.charIndex;

        // Find active sentence
        const foundSentence = unitList.find((s) => charIdx >= s.start && charIdx <= s.end);
        if (foundSentence) {
          setCurrentSentenceIndex(foundSentence.index);
          setCurrentCaptionText(foundSentence.sentence);

          // Find active word
          const foundWord = foundSentence.words.find((w) => charIdx >= w.start && charIdx <= w.end);
          if (foundWord) {
            setCurrentWordIndex(foundWord.index);
          }
        }
      };

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        if (unitList.length > 0) {
          const initialIdx = Math.min(startIndex, unitList.length - 1);
          setCurrentSentenceIndex(initialIdx);
          setCurrentCaptionText(unitList[initialIdx].sentence);
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentWordIndex(null);
        setCurrentSentenceIndex(null);
        setCurrentCaptionText('');
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Speech synthesis error:', e);
        }
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentWordIndex(null);
        setCurrentSentenceIndex(null);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported, rate, voiceName, voices, stop, language, activeLocale]
  );

  const jumpToSentence = useCallback(
    (sIndex: number) => {
      if (sIndex >= 0 && sIndex < sentencesRef.current.length) {
        speakText(fullTextRef.current, sIndex);
      }
    },
    [speakText]
  );

  const nextSentence = useCallback(() => {
    if (currentSentenceIndex !== null && currentSentenceIndex + 1 < sentencesRef.current.length) {
      jumpToSentence(currentSentenceIndex + 1);
    }
  }, [currentSentenceIndex, jumpToSentence]);

  const prevSentence = useCallback(() => {
    if (currentSentenceIndex !== null && currentSentenceIndex > 0) {
      jumpToSentence(currentSentenceIndex - 1);
    }
  }, [currentSentenceIndex, jumpToSentence]);

  return {
    isSupported,
    isPlaying,
    isPaused,
    currentWordIndex,
    currentSentenceIndex,
    currentCaptionText,
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
  };
}
