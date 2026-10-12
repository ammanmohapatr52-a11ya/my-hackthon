import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Globe2,
  Sparkles,
  RefreshCw,
  Search,
  Bookmark,
  BookmarkCheck,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Share2,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Radio,
  Clock,
  Compass,
  Zap,
  Sliders,
  Languages,
} from 'lucide-react';
import {
  getNewsFeed,
  syncLiveWorldNews,
  getBookmarkedNewsIds,
  toggleNewsBookmark,
  SUPPORTED_AUDIO_LANGUAGES,
  getArticleLocalized,
  getFactLocalized,
  type NewsArticle,
  type TodayFact,
  type NewsCategory,
  type AudioLanguageOption,
} from '../services/newsService';
import { useLanguage } from '../i18n/LanguageContext';

export const NewsPage: React.FC = () => {
  const { language: appLanguage, t } = useLanguage();
  const [feed, setFeed] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [todayFact, setTodayFact] = useState<TodayFact | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => getBookmarkedNewsIds());
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);

  // Audio Language & Voice State
  const [audioLang, setAudioLang] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('news_audio_lang');
      if (saved) return saved;
    } catch {}
    return appLanguage === 'hi' || appLanguage === 'or' ? appLanguage : 'en';
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [translateDisplay, setTranslateDisplay] = useState<boolean>(false);

  // Active Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [nowPlayingTitle, setNowPlayingTitle] = useState<string>('');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);

  // Quiz State
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available system synthesis voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Filter voices that match the active audio language
  const compatibleVoices = useMemo(() => {
    if (!availableVoices.length) return [];
    const target = audioLang.toLowerCase();
    return availableVoices.filter((v) => {
      const vLang = v.lang.toLowerCase();
      if (target === 'hi') {
        return (
          vLang.startsWith('hi') ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.toLowerCase().includes('kalpana') ||
          v.name.toLowerCase().includes('hemant') ||
          v.name.toLowerCase().includes('swara')
        );
      }
      if (target === 'or') {
        return (
          vLang.startsWith('or') ||
          vLang.startsWith('ory') ||
          v.name.toLowerCase().includes('odia') ||
          v.name.toLowerCase().includes('oriya') ||
          // fallback to Indian phonetic voices
          vLang.includes('in') ||
          v.name.toLowerCase().includes('india') ||
          vLang.startsWith('hi')
        );
      }
      if (target === 'es') return vLang.startsWith('es');
      if (target === 'fr') return vLang.startsWith('fr');
      if (target === 'de') return vLang.startsWith('de');
      return vLang.startsWith('en');
    });
  }, [availableVoices, audioLang]);

  // Load news feed
  const loadData = async (cat?: string) => {
    setIsLoading(true);
    try {
      const res = await getNewsFeed(cat || activeCategory);
      setFeed(res.feed);
      setCategories(res.categories);
      if (res.today_fact) {
        setTodayFact(res.today_fact);
      }
      setLastUpdated(res.last_updated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeCategory);
  }, [activeCategory]);

  // Handle changing the Audio Language
  const handleAudioLanguageChange = (newCode: string) => {
    if (isPlaying) {
      stopAudio();
    }
    setAudioLang(newCode);
    setSelectedVoiceName('');
    try {
      localStorage.setItem('news_audio_lang', newCode);
    } catch {}

    const selectedOpt = SUPPORTED_AUDIO_LANGUAGES.find((l) => l.code === newCode);
    setToastMsg(`🎧 Audio Language changed to ${selectedOpt?.label || newCode}`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Stop currently playing audio
  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setActiveArticleId(null);
    setNowPlayingTitle('');
    utteranceRef.current = null;
  };

  // Pause speech
  const pauseAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Resume speech
  const resumeAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  // Core Speech Synthesis Method with Language & Voice Awareness
  const speakTextInLanguage = (text: string, title: string, articleId?: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser or device.');
      return;
    }

    // Toggle off if already playing the exact same article
    if (isPlaying && activeArticleId === articleId && !isPaused) {
      stopAudio();
      return;
    }

    stopAudio();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // 1. Language code configuration
    const langOpt = SUPPORTED_AUDIO_LANGUAGES.find((l) => l.code === audioLang);
    const locale = langOpt?.locale || 'en-IN';
    utterance.lang = locale;
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    // 2. Select explicit or auto-matched voice
    if (selectedVoiceName) {
      const v = availableVoices.find((voice) => voice.name === selectedVoiceName);
      if (v) utterance.voice = v;
    } else if (compatibleVoices.length > 0) {
      utterance.voice = compatibleVoices[0];
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setActiveArticleId(articleId || null);
      setNowPlayingTitle(title);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setActiveArticleId(null);
      setNowPlayingTitle('');
      utteranceRef.current = null;
    };

    utterance.onerror = (e) => {
      console.warn('[Speech] Error or interrupted:', e);
      setIsPlaying(false);
      setIsPaused(false);
      setActiveArticleId(null);
      setNowPlayingTitle('');
      utteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  };

  // Speak full article in active audio language
  const handleSpeakArticle = (article: NewsArticle) => {
    const loc = getArticleLocalized(article, audioLang);
    const textToSpeak = `${loc.title}. ${loc.summary}. ${
      loc.takeaways.length ? (audioLang === 'hi' ? 'मुख्य बिंदु: ' : audioLang === 'or' ? 'ମୁଖ୍ୟ ବିନ୍ଦୁ: ' : 'Key Takeaways: ') + loc.takeaways.join('. ') : ''
    }`;
    speakTextInLanguage(textToSpeak, loc.title, article.id);
  };

  // Speak Today's Fact
  const handleSpeakFact = () => {
    if (!todayFact) return;
    const loc = getFactLocalized(todayFact, audioLang);
    const textToSpeak = `${loc.headline}. ${loc.fact}. ${
      audioLang === 'hi' ? 'क्या आप जानते हैं? ' : audioLang === 'or' ? 'ଆପଣ ଜାଣନ୍ତି କି? ' : 'Did you know? '
    } ${loc.didYouKnow}`;
    speakTextInLanguage(textToSpeak, loc.headline, 'today-fact');
  };

  // Speak comprehensive briefing of top articles
  const handleSpeakBriefing = () => {
    if (!feed.length) return;
    const topArticles = feed.slice(0, 4);
    const intro =
      audioLang === 'hi'
        ? 'यहाँ आपका वैश्विक समाचार और करेंट अफेयर्स ब्रीफिंग है।'
        : audioLang === 'or'
        ? 'ଏଠାରେ ଆପଣଙ୍କର ବିଶ୍ୱ ସମ୍ବାଦ ବ୍ରିଫିଙ୍ଗ।'
        : 'Here is your world intelligence and current affairs briefing.';

    const body = topArticles
      .map((a) => {
        const loc = getArticleLocalized(a, audioLang);
        return `${loc.title}: ${loc.summary}`;
      })
      .join('. ');

    speakTextInLanguage(`${intro} ${body}`, 'World News Briefing', 'full-briefing');
  };

  const handleSyncLive = async () => {
    setIsSyncing(true);
    setToastMsg(null);
    try {
      const syncRes = await syncLiveWorldNews();
      setToastMsg(`⚡ ${syncRes.message}`);
      await loadData(activeCategory);
    } catch {
      setToastMsg('Failed to sync live news wire.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setToastMsg(null), 5000);
    }
  };

  const handleToggleBookmark = (id: string) => {
    toggleNewsBookmark(id);
    setBookmarkedIds(getBookmarkedNewsIds());
  };

  const handleCopyFact = () => {
    if (!todayFact) return;
    const loc = getFactLocalized(todayFact, audioLang);
    const text = `🌟 Today's Fact: ${loc.headline}\n${loc.fact}\n\nDid You Know? ${loc.didYouKnow}\n- Powered by Neurobridge Stark Intel`;
    navigator.clipboard.writeText(text);
    setToastMsg('Fact copied to clipboard!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filtered Articles list
  const filteredFeed = useMemo(() => {
    return feed.filter((article) => {
      if (showBookmarksOnly && !bookmarkedIds.includes(article.id)) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const loc = getArticleLocalized(article, audioLang);
      return (
        loc.title.toLowerCase().includes(q) ||
        loc.summary.toLowerCase().includes(q) ||
        article.source.toLowerCase().includes(q) ||
        loc.category.toLowerCase().includes(q) ||
        loc.takeaways.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [feed, searchQuery, showBookmarksOnly, bookmarkedIds, audioLang]);

  const activeAudioOption = SUPPORTED_AUDIO_LANGUAGES.find((l) => l.code === audioLang) || SUPPORTED_AUDIO_LANGUAGES[0];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.5rem 1rem 4rem 1rem',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Toast Alert Notification */}
      {toastMsg && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(2, 132, 199, 0.95) 100%)',
            color: '#ffffff',
            padding: '0.85rem 1.4rem',
            borderRadius: '9999px',
            fontSize: '0.9rem',
            fontWeight: 600,
            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Sparkles size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Floating Audio Playback Bar (when active) */}
      {isPlaying && (
        <div
          style={{
            position: 'sticky',
            top: '72px',
            zIndex: 900,
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.5)',
            boxShadow: '0 8px 30px rgba(2, 132, 199, 0.35)',
            backdropFilter: 'blur(16px)',
            borderRadius: '14px',
            padding: '0.75rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
              }}
            >
              <Volume2 size={18} className="pulse-icon" />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                Speaking in {activeAudioOption.label} ({activeAudioOption.locale})
              </div>
              <div style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600, maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {nowPlayingTitle || 'World Intelligence Audio'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isPaused ? (
              <button
                type="button"
                onClick={resumeAudio}
                className="btn btn-sm"
                style={{ background: '#10b981', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
              >
                <Play size={14} />
                <span>Resume</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={pauseAudio}
                className="btn btn-sm"
                style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid #f59e0b', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
              >
                <Pause size={14} />
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={stopAudio}
              className="btn btn-sm"
              style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
            >
              <Square size={14} />
              <span>Stop</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Feature Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.75) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '16px',
          padding: '1.75rem',
          marginBottom: '1.5rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(16px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '160px',
            height: '160px',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#38bdf8',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '0.4rem',
              }}
            >
              <Radio size={14} className="pulse-icon" style={{ color: '#22c55e' }} />
              <span>LIVE WORLD INTEL // CURRENT AFFAIRS & DAILY FACTS</span>
            </div>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: '#f8fafc',
                margin: '0 0 0.5rem 0',
                letterSpacing: '-0.02em',
              }}
            >
              {t('news.title', 'Global News & Current Affairs')}
            </h1>
            <p
              style={{
                color: '#94a3b8',
                margin: 0,
                fontSize: '0.95rem',
                maxWidth: '680px',
                lineHeight: 1.5,
              }}
            >
              {t(
                'news.subtitle',
                'Verified world intelligence, real-time Google News dispatches, breakthroughs in science & space, and mind-blowing daily facts updated regularly.'
              )}
            </p>
          </div>

          {/* Action Header Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              id="sync-live-news-btn"
              onClick={handleSyncLive}
              disabled={isSyncing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                padding: '0.6rem 1.15rem',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: isSyncing ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)',
                transition: 'all 0.2s ease',
              }}
            >
              <RefreshCw size={15} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isSyncing ? 'Syncing Google Wire...' : 'Sync Live World Intel'}</span>
            </button>

            <button
              type="button"
              id="listen-briefing-btn"
              onClick={handleSpeakBriefing}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                color: isPlaying ? '#f87171' : '#f8fafc',
                border: isPlaying ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.15)',
                padding: '0.6rem 1.15rem',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span>{isPlaying ? 'Stop Audio' : `Listen Briefing (${activeAudioOption.label})`}</span>
            </button>
          </div>
        </div>

        {/* --- DEDICATED AUDIO LANGUAGE & VOICE CONTROL BAR --- */}
        <div
          id="audio-language-controller"
          style={{
            background: 'rgba(2, 132, 199, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '12px',
            padding: '0.9rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Audio Language Selection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem' }}>
              <Languages size={17} />
              <span>Audio Language:</span>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {SUPPORTED_AUDIO_LANGUAGES.map((lang) => {
                const isSelected = audioLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    id={`audio-lang-btn-${lang.code}`}
                    onClick={() => handleAudioLanguageChange(lang.code)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.12)',
                      background: isSelected ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'rgba(15, 23, 42, 0.6)',
                      color: isSelected ? '#ffffff' : '#cbd5e1',
                      boxShadow: isSelected ? '0 0 10px rgba(56, 189, 248, 0.4)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice Engine & Speed Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Speed selection */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Speed:</span>
              <select
                id="audio-speed-select"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f8fafc',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  outline: 'none',
                }}
              >
                <option value="0.8">0.8x (Slower)</option>
                <option value="1.0">1.0x (Normal)</option>
                <option value="1.25">1.25x (Faster)</option>
                <option value="1.5">1.5x (Fast)</option>
              </select>
            </div>

            {/* Compatible Voices Dropdown (if multiple voices available) */}
            {compatibleVoices.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Voice:</span>
                <select
                  id="audio-voice-select"
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#38bdf8',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    outline: 'none',
                    maxWidth: '180px',
                  }}
                >
                  <option value="">Default ({compatibleVoices[0].name.slice(0, 20)})</option>
                  {compatibleVoices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name.slice(0, 25)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Translate on-screen cards toggle */}
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                color: '#cbd5e1',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                id="toggle-translate-cards"
                checked={translateDisplay}
                onChange={(e) => setTranslateDisplay(e.target.checked)}
                style={{ accentColor: '#38bdf8', cursor: 'pointer' }}
              />
              <span>Translate Cards on Screen</span>
            </label>
          </div>
        </div>

        {lastUpdated && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#64748b',
              fontSize: '0.78rem',
              marginTop: '0.75rem',
            }}
          >
            <Clock size={12} />
            <span>Last Sync: {lastUpdated}</span>
          </div>
        )}
      </div>

      {/* Mind-Blowing Fact of the Day Highlight Banner */}
      {todayFact && (() => {
        const displayFact = translateDisplay ? getFactLocalized(todayFact, audioLang) : getFactLocalized(todayFact, 'en');
        return (
          <div
            id="today-fact-card"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.06) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem',
              position: 'relative',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.25)',
                    color: '#f59e0b',
                    padding: '6px',
                    borderRadius: '8px',
                    display: 'flex',
                  }}
                >
                  <Lightbulb size={20} />
                </div>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#f59e0b',
                    letterSpacing: '0.06em',
                  }}
                >
                  TODAY'S MIND-BLOWING FACT & GK BOOSTER
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    color: '#fde047',
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontWeight: 600,
                  }}
                >
                  {displayFact.category}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  id="listen-today-fact-btn"
                  onClick={handleSpeakFact}
                  className="btn btn-ghost btn-sm"
                  title={`Listen to Today's Fact in ${activeAudioOption.label}`}
                  style={{
                    color: isPlaying && activeArticleId === 'today-fact' ? '#38bdf8' : '#f59e0b',
                    padding: '4px 10px',
                    fontSize: '0.8rem',
                    background: isPlaying && activeArticleId === 'today-fact' ? 'rgba(56, 189, 248, 0.2)' : 'none',
                    borderRadius: '6px',
                  }}
                >
                  <Volume2 size={15} style={{ marginRight: '4px' }} />
                  <span>{isPlaying && activeArticleId === 'today-fact' ? 'Stop' : `Listen (${activeAudioOption.code.toUpperCase()})`}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyFact}
                  className="btn btn-ghost btn-sm"
                  title="Copy Fact"
                  style={{ color: '#f59e0b', padding: '4px 10px', fontSize: '0.8rem' }}
                >
                  <Share2 size={15} style={{ marginRight: '4px' }} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <h3
              style={{
                color: '#fef08a',
                fontSize: '1.25rem',
                fontWeight: 700,
                margin: '0 0 0.5rem 0',
                lineHeight: 1.4,
              }}
            >
              {displayFact.headline}
            </h3>

            <p
              style={{
                color: '#e2e8f0',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                margin: '0 0 0.85rem 0',
              }}
            >
              {displayFact.fact}
            </p>

            <div
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                borderLeft: '3px solid #f59e0b',
                fontSize: '0.85rem',
                color: '#cbd5e1',
              }}
            >
              <strong style={{ color: '#fbbf24' }}>
                {audioLang === 'hi' ? 'क्या आप जानते हैं? ' : audioLang === 'or' ? 'ଆପଣ ଜାଣନ୍ତି କି? ' : 'Did You Know? '}
              </strong>
              {displayFact.didYouKnow}
            </div>
          </div>
        );
      })()}

      {/* Filter Tabs & Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Category Pill Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id && !showBookmarksOnly;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setShowBookmarksOnly(false);
                  setActiveCategory(cat.id);
                }}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isActive ? 'rgba(2, 132, 199, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>{cat.label}</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    opacity: 0.75,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                  }}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: showBookmarksOnly ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
              background: showBookmarksOnly ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              color: showBookmarksOnly ? '#f59e0b' : '#94a3b8',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Bookmark size={13} />
            <span>Saved Bookmarks ({bookmarkedIds.length})</span>
          </button>
        </div>

        {/* Live Search Input */}
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news, topics, facts..."
            style={{
              width: '100%',
              padding: '0.5rem 1rem 0.5rem 2.25rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#f8fafc',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* News Cards Grid Feed */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94a3b8' }}>
          <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }} />
          <p>Syncing world intelligence & verified Google dispatches...</p>
        </div>
      ) : filteredFeed.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '16px',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            color: '#94a3b8',
          }}
        >
          <Compass size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
          <h3>No articles found</h3>
          <p style={{ fontSize: '0.9rem' }}>
            Try selecting another category or clear your search term.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredFeed.map((article) => {
            const isBookmarked = bookmarkedIds.includes(article.id);
            const isThisSpeaking = isPlaying && activeArticleId === article.id;
            const isQuizOpen = expandedQuizId === article.id;
            const selectedOpt = selectedAnswers[article.id];

            // Localized display content (if translateDisplay enabled)
            const locDisplay = translateDisplay ? getArticleLocalized(article, audioLang) : getArticleLocalized(article, 'en');

            return (
              <article
                key={article.id}
                id={`article-${article.id}`}
                style={{
                  background: isThisSpeaking ? 'rgba(2, 132, 199, 0.18)' : 'rgba(15, 23, 42, 0.75)',
                  border: isThisSpeaking ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isThisSpeaking ? '0 0 25px rgba(56, 189, 248, 0.25)' : '0 4px 20px rgba(0, 0, 0, 0.25)',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  {/* Category, Date & Impact Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#38bdf8',
                          background: 'rgba(2, 132, 199, 0.18)',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {locDisplay.category}
                      </span>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: article.impact_color || '#10b981',
                          background: `${article.impact_color || '#10b981'}15`,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: `1px solid ${article.impact_color || '#10b981'}30`,
                        }}
                      >
                        {article.impact}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{article.date}</span>
                  </div>

                  {/* Headline Title */}
                  <h2
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: isThisSpeaking ? '#38bdf8' : '#f8fafc',
                      lineHeight: 1.4,
                      margin: '0 0 0.65rem 0',
                    }}
                  >
                    {locDisplay.title}
                  </h2>

                  {/* Summary */}
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: '#94a3b8',
                      lineHeight: 1.55,
                      margin: '0 0 1rem 0',
                    }}
                  >
                    {locDisplay.summary}
                  </p>

                  {/* Key Takeaways Highlights */}
                  {locDisplay.takeaways && locDisplay.takeaways.length > 0 && (
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.025)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '0.75rem 0.85rem',
                        marginBottom: '1rem',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#cbd5e1',
                          marginBottom: '0.4rem',
                          letterSpacing: '0.04em',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <Zap size={12} color="#38bdf8" />
                        <span>{audioLang === 'hi' ? 'मुख्य बिंदु' : audioLang === 'or' ? 'ମୁଖ୍ୟ ବିନ୍ଦୁ' : 'Key Takeaways'}</span>
                      </div>
                      <ul
                        style={{
                          margin: 0,
                          paddingLeft: '1.1rem',
                          fontSize: '0.82rem',
                          color: '#94a3b8',
                          lineHeight: 1.45,
                        }}
                      >
                        {locDisplay.takeaways.map((takeaway, i) => (
                          <li key={i} style={{ marginBottom: '0.25rem' }}>
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Interactive Mini-Quiz (if available) */}
                  {article.quiz && (
                    <div
                      style={{
                        background: 'rgba(2, 132, 199, 0.08)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedQuizId(isQuizOpen ? null : article.id)}
                        style={{
                          width: '100%',
                          padding: '0.55rem 0.85rem',
                          background: 'none',
                          border: 'none',
                          color: '#38bdf8',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <HelpCircle size={14} />
                          <span>Quiz Me on This Fact</span>
                        </span>
                        {isQuizOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {isQuizOpen && (
                        <div style={{ padding: '0.75rem 0.85rem', borderTop: '1px solid rgba(56, 189, 248, 0.15)' }}>
                          <p style={{ fontSize: '0.82rem', color: '#f1f5f9', fontWeight: 600, margin: '0 0 0.5rem 0' }}>
                            {(audioLang === 'hi' && article.quiz.question_hi) ||
                              (audioLang === 'or' && article.quiz.question_or) ||
                              article.quiz.question}
                          </p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {((audioLang === 'hi' && article.quiz.options_hi) ||
                              (audioLang === 'or' && article.quiz.options_or) ||
                              article.quiz.options
                            ).map((opt, optIdx) => {
                              const isSelected = selectedOpt === optIdx;
                              const isCorrect = optIdx === article.quiz?.correct_index;
                              const showValidation = selectedOpt !== undefined;

                              let optBg = 'rgba(255, 255, 255, 0.04)';
                              let optBorder = 'rgba(255, 255, 255, 0.1)';
                              if (showValidation) {
                                if (isCorrect) {
                                  optBg = 'rgba(16, 185, 129, 0.2)';
                                  optBorder = 'rgba(16, 185, 129, 0.5)';
                                } else if (isSelected) {
                                  optBg = 'rgba(239, 68, 68, 0.2)';
                                  optBorder = 'rgba(239, 68, 68, 0.5)';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => setSelectedAnswers((prev) => ({ ...prev, [article.id]: optIdx }))}
                                  style={{
                                    textAlign: 'left',
                                    padding: '0.45rem 0.65rem',
                                    borderRadius: '6px',
                                    backgroundColor: optBg,
                                    border: `1px solid ${optBorder}`,
                                    color: '#e2e8f0',
                                    fontSize: '0.78rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {selectedOpt !== undefined && (
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.5rem 0 0 0', lineHeight: 1.4 }}>
                              <strong>Explanation:</strong>{' '}
                              {(audioLang === 'hi' && article.quiz.explanation_hi) ||
                                (audioLang === 'or' && article.quiz.explanation_or) ||
                                article.quiz.explanation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Controls: Source Link, Voice Listen, Bookmark */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: '0.78rem',
                  }}
                >
                  <a
                    href={article.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: '#64748b',
                      textDecoration: 'none',
                    }}
                  >
                    <span>{article.source}</span>
                    <ExternalLink size={12} />
                  </a>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      id={`listen-article-btn-${article.id}`}
                      onClick={() => handleSpeakArticle(article)}
                      title={isThisSpeaking ? 'Stop Audio' : `Listen in ${activeAudioOption.label}`}
                      style={{
                        background: isThisSpeaking ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                        border: isThisSpeaking ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                        color: isThisSpeaking ? '#38bdf8' : '#e2e8f0',
                        cursor: 'pointer',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Volume2 size={14} />
                      <span>{isThisSpeaking ? 'Stop' : `Listen (${activeAudioOption.code.toUpperCase()})`}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleBookmark(article.id)}
                      title={isBookmarked ? 'Remove Bookmark' : 'Save Article'}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isBookmarked ? '#f59e0b' : '#94a3b8',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewsPage;
