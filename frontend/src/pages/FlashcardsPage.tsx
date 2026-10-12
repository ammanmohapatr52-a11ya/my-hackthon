import React, { useState, useEffect } from 'react';
import {
  getAllFlashcards,
  getDueFlashcards,
  reviewFlashcard,
  addFlashcard,
  deleteFlashcard,
  importGKDeck,
} from '../storage/flashcardStore';
import type { Flashcard } from '../storage/db';
import type { Rating } from '../srs/scheduler';
import { KaTeXMath } from '../components/ui/KaTeXMath';
import { Modal } from '../components/ui/Modal';
import { useSpeechOutput } from '../speech/useSpeechOutput';
import { useSpeechInput } from '../speech/useSpeechInput';
import { useVisualAlert } from '../accessibility/VisualAlert';
import { useAnnounce } from '../accessibility/useAnnounce';
import { useLanguage } from '../i18n/LanguageContext';
import { VirtualKeypad } from '../components/ui/VirtualKeypad';
import {
  generateFlashcardWithAI,
  READY_FLASHCARD_LIBRARY,
  type PreMadeCard,
} from '../services/aiFlashcardGenerator';
import {
  Layers,
  CheckCircle,
  Plus,
  Volume2,
  Trash2,
  RotateCw,
  Eye,
  Award,
  Sparkles,
  Mic,
  MicOff,
  Check,
  X,
  Filter,
  Lightbulb,
  BookOpen,
  Calculator,
  Keyboard,
} from 'lucide-react';

interface SubjectPreset {
  id: string;
  nameEn: string;
  nameHi: string;
  nameOr: string;
  icon: string;
  templates: { front: string; back: string }[];
}

const SUBJECT_PRESETS: SubjectPreset[] = [
  {
    id: 'Physics',
    nameEn: 'Physics',
    nameHi: 'भौतिकी (Physics)',
    nameOr: 'ପଦାର୍ଥ ବିଜ୍ଞାନ (Physics)',
    icon: '⚡',
    templates: [
      { front: "What is Newton's Second Law of Motion?", back: "F = m · a (Force = mass × acceleration)" },
      { front: "What is the formula for Kinetic Energy?", back: "KE = 1/2 · m · v²" },
      { front: "What is Ohm's Law?", back: "V = I · R (Voltage = Current × Resistance)" },
    ],
  },
  {
    id: 'Chemistry',
    nameEn: 'Chemistry',
    nameHi: 'रसायन विज्ञान (Chemistry)',
    nameOr: 'ରସାୟନ ବିଜ୍ଞାନ (Chemistry)',
    icon: '🧪',
    templates: [
      { front: "What is the chemical formula for water?", back: "H₂O" },
      { front: "What is Avogadro's constant?", back: "6.022 × 10²³ mol⁻¹" },
      { front: "What is the formula for calculating pH?", back: "pH = -log₁₀[H⁺]" },
    ],
  },
  {
    id: 'Mathematics',
    nameEn: 'Mathematics',
    nameHi: 'गणित (Mathematics)',
    nameOr: 'ଗଣିତ (Mathematics)',
    icon: '📐',
    templates: [
      { front: "What is the Quadratic Formula?", back: "x = (-b ± √(b² - 4ac)) / (2a)" },
      { front: "What is the Pythagorean Theorem?", back: "a² + b² = c² in any right-angled triangle" },
      { front: "What is the area of a circle?", back: "A = π · r²" },
    ],
  },
  {
    id: 'Biology',
    nameEn: 'Biology',
    nameHi: 'जीव विज्ञान (Biology)',
    nameOr: 'ଜୀବ ବିଜ୍ଞାନ (Biology)',
    icon: '🧬',
    templates: [
      { front: "What is known as the powerhouse of the cell?", back: "Mitochondria" },
      { front: "What is the basic unit of heredity in living organisms?", back: "Gene (DNA sequence)" },
      { front: "What is the chemical equation for Photosynthesis?", back: "6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂" },
    ],
  },
  {
    id: 'Computer Science',
    nameEn: 'Computer Science',
    nameHi: 'कंप्यूटर विज्ञान (CS)',
    nameOr: 'କମ୍ପ୍ୟୁଟର ବିଜ୍ଞାନ (CS)',
    icon: '💻',
    templates: [
      { front: "What is the time complexity of Binary Search?", back: "O(log n)" },
      { front: "What does CPU stand for?", back: "Central Processing Unit" },
      { front: "What is an Algorithm?", back: "A finite step-by-step procedure to solve a problem or calculation." },
    ],
  },
  {
    id: 'History',
    nameEn: 'History',
    nameHi: 'इतिहास (History)',
    nameOr: 'ଇତିହାସ (History)',
    icon: '📜',
    templates: [
      { front: "When did India gain independence from British rule?", back: "August 15, 1947" },
      { front: "When did World War II officially end?", back: "September 2, 1945" },
      { front: "Who was the first President of India?", back: "Dr. Rajendra Prasad" },
    ],
  },
  {
    id: 'Geography',
    nameEn: 'Geography',
    nameHi: 'भूगोल (Geography)',
    nameOr: 'ଭୂଗୋଳ (Geography)',
    icon: '🌍',
    templates: [
      { front: "What is the highest mountain peak in the world?", back: "Mount Everest (8,848.86 meters above sea level)" },
      { front: "Which river is the longest on Earth?", back: "The Nile River (approximately 6,650 km)" },
      { front: "What is the capital of Odisha?", back: "Bhubaneswar" },
    ],
  },
  {
    id: 'Literature',
    nameEn: 'Literature & Language',
    nameHi: 'साहित्य व भाषा (Literature)',
    nameOr: 'ସାହିତ୍ୟ ଓ ଭାଷା (Literature)',
    icon: '📚',
    templates: [
      { front: "What is a metaphor in literature?", back: "A figure of speech directly referring to one thing by mentioning another for symbolic effect." },
      { front: "What is alliteration?", back: "The repetition of initial consonant sounds in successive words." },
    ],
  },
  {
    id: 'General Knowledge',
    nameEn: 'General Knowledge',
    nameHi: 'सामान्य ज्ञान (GK)',
    nameOr: 'ସାଧାରଣ ଜ୍ଞାନ (GK)',
    icon: '🧠',
    templates: [
      { front: "Which planet is known as the Red Planet in our Solar System?", back: "Mars" },
      { front: "How many bones are in an adult human body?", back: "206 bones" },
    ],
  },
  {
    id: 'Economics',
    nameEn: 'Economics',
    nameHi: 'अर्थशास्त्र (Economics)',
    nameOr: 'ଅର୍ଥନୀତି (Economics)',
    icon: '📊',
    templates: [
      { front: "What is the Law of Supply and Demand?", back: "As price rises, quantity supplied increases and quantity demanded decreases until equilibrium is reached." },
      { front: "What does GDP stand for?", back: "Gross Domestic Product — total monetary value of goods & services produced in a country." },
    ],
  },
];

export const FlashcardsPage: React.FC = () => {
  const [allCards, setAllCards] = useState<Flashcard[]>([]);
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // New card modal form state
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newCategory, setNewCategory] = useState('Physics');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [activeMicField, setActiveMicField] = useState<'category' | 'front' | 'back' | null>(null);

  const { speakText } = useSpeechOutput();
  const {
    isSupported: isMicSupported,
    isListening,
    transcript,
    startListening,
    stopListening,
    setTranscript,
  } = useSpeechInput();
  const { showAlert } = useVisualAlert();
  const { announcePolite } = useAnnounce();
  const { t, language } = useLanguage();

  // Listen for speech dictation into the focused field
  useEffect(() => {
    if (transcript && activeMicField) {
      if (activeMicField === 'category') {
        setNewCategory(transcript);
      } else if (activeMicField === 'front') {
        setNewFront(transcript);
      } else if (activeMicField === 'back') {
        setNewBack(transcript);
      }
    }
  }, [transcript, activeMicField]);

  useEffect(() => {
    if (!isListening && activeMicField) {
      setActiveMicField(null);
    }
  }, [isListening, activeMicField]);

  const toggleMic = (field: 'category' | 'front' | 'back') => {
    if (isListening && activeMicField === field) {
      stopListening();
      setActiveMicField(null);
    } else {
      setTranscript('');
      setActiveMicField(field);
      startListening();
      announcePolite(`Listening for ${field}. Speak now into your microphone.`);
    }
  };

  // Easy-writing assistant states for zero-effort typing
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showReadyLibrary, setShowReadyLibrary] = useState(false);
  const [lastFocusedField, setLastFocusedField] = useState<'category' | 'front' | 'back'>('front');

  const handleAIAutoWrite = async () => {
    setIsGeneratingAI(true);
    announcePolite('AI is writing your flashcard question and answer...');
    try {
      const res = await generateFlashcardWithAI(newCategory, '', language);
      setNewFront(res.front);
      setNewBack(res.back);
      announcePolite(`Flashcard generated: ${res.front}`);
      showAlert({
        type: 'success',
        title: 'Flashcard Auto-Written by AI',
        message: res.front.slice(0, 80) + '...',
      });
    } catch (err: any) {
      showAlert({ type: 'error', title: 'Generation failed', message: err.message });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleInsertKeypad = (text: string) => {
    if (lastFocusedField === 'category') {
      setNewCategory((prev) => prev + text);
    } else if (lastFocusedField === 'back') {
      setNewBack((prev) => prev + text);
    } else {
      setNewFront((prev) => prev + text);
    }
    announcePolite(`Inserted ${text}`);
  };

  const handleSelectReadyCard = (card: PreMadeCard) => {
    setNewCategory(card.category);
    setNewFront(card.front);
    setNewBack(card.back);
    setShowReadyLibrary(false);
    announcePolite(`Selected pre-made flashcard for ${card.category}`);
    showAlert({
      type: 'info',
      title: 'Ready Card Loaded',
      message: `${card.category}: ${card.front.slice(0, 60)}...`,
    });
  };

  const loadCards = async () => {
    try {
      const [all, due] = await Promise.all([getAllFlashcards(), getDueFlashcards()]);
      setAllCards(all);
      setDueCards(due);
      setCurrentReviewIdx(0);
      setIsFlipped(false);
    } catch (e) {
      console.warn('Could not load flashcards:', e);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  // Keyboard shortcuts 1-4 for rating and Space to flip (FR-FLASH3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (dueCards.length === 0 || isAddModalOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRate('again');
        else if (e.key === '2') handleRate('hard');
        else if (e.key === '3') handleRate('good');
        else if (e.key === '4') handleRate('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dueCards, isFlipped, isAddModalOpen]);

  const handleRate = async (rating: Rating) => {
    const card = dueCards[currentReviewIdx];
    if (!card) return;

    try {
      await reviewFlashcard(card, rating);
      announcePolite(`Rated ${rating}. Next card scheduled.`);

      if (currentReviewIdx + 1 < dueCards.length) {
        setCurrentReviewIdx((prev) => prev + 1);
        setIsFlipped(false);
      } else {
        // Finished all due cards!
        showAlert({
          type: 'success',
          title: 'Review Complete!',
          message: 'All due flashcards for today have been reviewed.',
        });
        await loadCards();
      }
    } catch (e) {
      console.warn('Review failed:', e);
    }
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    await addFlashcard({
      front: newFront,
      back: newBack,
      category: newCategory,
    });

    setIsAddModalOpen(false);
    setNewFront('');
    setNewBack('');
    announcePolite('New flashcard created.');
    showAlert({
      type: 'success',
      title: 'Flashcard Created',
      message: 'Card added to your review queue.',
    });
    await loadCards();
  };

  const handleImportGKDeck = async () => {
    try {
      setIsImporting(true);
      const count = await importGKDeck();
      showAlert({
        type: 'success',
        title: 'GK Deck Loaded',
        message: `Successfully loaded ${count} General Knowledge cards into your study deck.`,
      });
      announcePolite(`Loaded ${count} cards.`);
      await loadCards();
    } catch (err) {
      console.error(err);
      showAlert({
        type: 'error',
        title: 'Import Failed',
        message: 'Could not import the General Knowledge deck.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    await deleteFlashcard(id);
    announcePolite('Flashcard deleted.');
    await loadCards();
  };

  const activeCard = dueCards[currentReviewIdx];

  return (
    <div>
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
        <div>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>{t('cards.title', 'Flashcards & Spaced Repetition')}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t('cards.desc', 'Strengthen your academic recall with SM-2 spaced repetition and speech audio reviews.')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleImportGKDeck}
            disabled={isImporting}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Sparkles size={18} color="var(--accent-primary)" />
            <span>{isImporting ? 'Importing 900+ Cards...' : 'Load 900+ GK Deck'}</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={18} />
            <span>{t('cards.new_card', 'New Flashcard')}</span>
          </button>
        </div>
      </div>

      {/* Review Queue Area */}
      {dueCards.length > 0 && activeCard ? (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}
          >
            <span className="badge badge-info">{activeCard.category || 'General'}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Card {currentReviewIdx + 1} of {dueCards.length} Due
            </span>
          </div>

          {/* Card Front */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              QUESTION (FRONT)
            </div>
            {activeCard.image && (
              <div
                style={{
                  margin: '1rem auto 1.5rem auto',
                  maxWidth: '360px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  background: 'rgba(0,0,0,0.2)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                }}
              >
                <img
                  src={activeCard.image.startsWith('/') ? activeCard.image : `/${activeCard.image}`}
                  alt="Reference Visual"
                  style={{ width: '100%', height: 'auto', maxHeight: '260px', objectFit: 'contain', display: 'block' }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {activeCard.front}
            </div>
            {activeCard.mathLatex && (
              <div style={{ margin: '1rem 0' }}>
                <KaTeXMath math={activeCard.mathLatex} block={true} />
              </div>
            )}
          </div>

          {/* Flip / Reveal Action */}
          {!isFlipped ? (
            <div style={{ marginTop: '2rem' }}>
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={() => setIsFlipped(true)}
                style={{ padding: '0.75rem 2rem' }}
              >
                <Eye size={20} />
                <span>{t('cards.btn_reveal', 'Reveal Answer (Space / Enter)')}</span>
              </button>
            </div>
          ) : (
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-subtle)',
                animation: 'fadeIn 0.25s ease',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                ANSWER (BACK)
              </div>
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--status-success)',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                }}
              >
                {activeCard.back}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => speakText(`Question: ${activeCard.front}. Answer: ${activeCard.back}`)}
                >
                  <Volume2 size={16} />
                  <span>{t('math.btn_listen', 'Listen to Card')}</span>
                </button>
              </div>

              {/* SM-2 Rating Buttons (Again, Hard, Good, Easy) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {t('cards.shortcut_hint', 'How easily did you recall this? (Keys 1–4)')}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                    gap: '0.75rem',
                    maxWidth: '600px',
                    margin: '0 auto',
                    width: '100%',
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleRate('again')}
                    style={{ borderColor: 'var(--status-error)' }}
                  >
                    {t('cards.rating_again', '1 · Again')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleRate('hard')}
                    style={{ borderColor: 'var(--status-warning)' }}
                  >
                    {t('cards.rating_hard', '2 · Hard')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleRate('good')}
                  >
                    {t('cards.rating_good', '3 · Good')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleRate('easy')}
                    style={{ borderColor: 'var(--status-success)' }}
                  >
                    {t('cards.rating_easy', '4 · Easy')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="card"
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(56, 189, 248, 0.05) 100%)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--status-success-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
            }}
          >
            <CheckCircle size={32} color="var(--status-success)" />
          </div>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{t('cards.empty_title', 'All Caught Up for Today!')}</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
            {t('cards.empty_desc', 'Great job! You have completed all scheduled cards for today.')}
          </p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>{t('cards.new_card', 'Create New Flashcard')}</span>
          </button>
        </div>
      )}

      {/* Deck Overview Table */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>
              All Deck Flashcards ({(() => {
                const filtered = selectedCategoryFilter === 'all'
                  ? allCards
                  : allCards.filter(c => (c.category || 'General').toLowerCase() === selectedCategoryFilter.toLowerCase());
                return `${filtered.length} / ${allCards.length}`;
              })()})
            </h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Stored locally in your browser's IndexedDB
            </span>
          </div>

          {/* Subject Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={14} /> {t('cards.filter_by_subject', 'Filter:')}
            </span>
            <button
              type="button"
              className={`btn btn-sm ${selectedCategoryFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setSelectedCategoryFilter('all')}
              style={{ fontSize: '0.75rem', borderRadius: 'var(--radius-full)', padding: '2px 8px' }}
            >
              {t('cards.all_subjects', 'All')} ({allCards.length})
            </button>
            {Array.from(new Set(allCards.map(c => c.category?.trim()).filter(Boolean))).slice(0, 8).map((cat) => {
              const count = allCards.filter(c => (c.category || 'General').toLowerCase() === cat!.toLowerCase()).length;
              const isSelected = selectedCategoryFilter.toLowerCase() === cat!.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setSelectedCategoryFilter(cat!)}
                  style={{
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-full)',
                    padding: '2px 8px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(() => {
            const filteredCards = selectedCategoryFilter === 'all'
              ? allCards
              : allCards.filter(c => (c.category || 'General').toLowerCase() === selectedCategoryFilter.toLowerCase());

            if (filteredCards.length === 0) {
              return (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No flashcards found for subject "{selectedCategoryFilter}".
                </div>
              );
            }

            return filteredCards.map((card) => {
              const isDue = card.dueAt <= Date.now();
              return (
                <div
                  key={card.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.12)', color: 'var(--accent-primary)', fontWeight: 600 }}>
                        {card.category || 'General'}
                      </span>
                      {isDue && <span className="badge badge-warning">Due Now</span>}
                      {card.image && <span className="badge badge-info">Visual</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      {card.image && (
                        <img
                          src={card.image.startsWith('/') ? card.image : `/${card.image}`}
                          alt="thumb"
                          style={{
                            width: '52px',
                            height: '52px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            border: '1px solid var(--border-subtle)',
                            flexShrink: 0,
                            background: '#000',
                          }}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{card.front}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {card.back}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => speakText(`${card.front}. ${card.back}`)}
                      title="Read aloud"
                      aria-label="Read card aloud"
                    >
                      <Volume2 size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDelete(card.id)}
                      title="Delete card"
                      aria-label="Delete flashcard"
                      style={{ color: 'var(--status-error)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Ultra-Accessible New Card Modal with Quick Subject Chips, Voice Dictation & Autocomplete */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t('cards.new_card', 'Create New Flashcard')} maxWidth="680px">
        <form onSubmit={handleCreateCard}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* ZERO-EFFORT WRITING SUITE: For users who cannot write easily */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(129, 140, 248, 0.1) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} />
                  <span>Cannot Write Easily? Use These Zero-Effort Tools:</span>
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  1-Click Instant Card Fill
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {/* 1. AI Auto-Write Button */}
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleAIAutoWrite}
                  disabled={isGeneratingAI}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                    fontWeight: 600,
                    gap: '6px',
                  }}
                  title="AI will automatically write a complete study question & answer for the chosen subject"
                >
                  <Sparkles size={15} className={isGeneratingAI ? 'spinning' : ''} />
                  <span>{isGeneratingAI ? t('cards.ai_writing', 'Generating with AI...') : t('cards.ai_write', '✨ AI Auto-Write Flashcard')}</span>
                </button>

                {/* 2. Ready-to-Use Library Button */}
                <button
                  type="button"
                  className={`btn btn-sm ${showReadyLibrary ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setShowReadyLibrary(!showReadyLibrary)}
                  style={{ gap: '6px' }}
                >
                  <BookOpen size={15} color="var(--accent-primary)" />
                  <span>{showReadyLibrary ? t('cards.close_library', 'Close Ready Cards') : t('cards.browse_library', '📚 Pick from Ready Cards')}</span>
                </button>

                {/* 3. On-Screen Virtual Keypad & Symbols Toggle */}
                <button
                  type="button"
                  className={`btn btn-sm ${showKeypad ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setShowKeypad(!showKeypad)}
                  style={{ gap: '6px' }}
                >
                  <Calculator size={15} />
                  <span>{t('cards.toggle_keypad', '⌨️ Keypad & Symbols')}</span>
                </button>
              </div>

              {/* Ready-to-use Cards Drawer */}
              {showReadyLibrary && (
                <div
                  style={{
                    marginTop: '0.5rem',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                    Click ANY ready card below to copy it into your flashcard:
                  </div>
                  {READY_FLASHCARD_LIBRARY.filter(c => c.language === language || language === 'en').map((card) => (
                    <div
                      key={card.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        padding: '0.5rem 0.75rem',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                          <span>{card.subjectIcon}</span>
                          <span>{card.category}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                          {card.front}
                        </div>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                          {card.back}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSelectReadyCard(card)}
                        style={{ fontSize: '0.75rem', padding: '4px 10px', flexShrink: 0 }}
                      >
                        {t('cards.use_this_card', 'Use This Card')}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Virtual Keypad & Symbols */}
              {showKeypad && (
                <VirtualKeypad onInsert={handleInsertKeypad} />
              )}
            </div>
            
            {/* Subject / Category Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label htmlFor="card-category" style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={16} color="var(--accent-primary)" />
                  <span>{t('cards.category_label', 'Subject / Category:')}</span>
                </label>
                {newCategory && (
                  <button
                    type="button"
                    onClick={() => setNewCategory('')}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.75rem', padding: '2px 6px', color: 'var(--text-muted)' }}
                    title={t('cards.clear_subject', 'Clear subject')}
                  >
                    <X size={13} /> {t('cards.clear_subject', 'Clear')}
                  </button>
                )}
              </div>

              {/* Quick-Pick Popular Subjects Chips */}
              <div style={{ marginBottom: '0.65rem' }}>
                <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 500 }}>
                  {t('cards.quick_subjects', 'Popular Subjects (Click to select):')}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.4rem',
                    maxHeight: '125px',
                    overflowY: 'auto',
                    padding: '2px',
                  }}
                >
                  {SUBJECT_PRESETS.map((preset) => {
                    const isSelected = newCategory.toLowerCase().trim() === preset.id.toLowerCase().trim();
                    const displayName = language === 'or' ? preset.nameOr : language === 'hi' ? preset.nameHi : preset.nameEn;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setNewCategory(preset.id);
                          announcePolite(`Selected subject ${preset.id}`);
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          background: isSelected ? 'rgba(56, 189, 248, 0.22)' : 'var(--bg-surface)',
                          color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                          border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                          boxShadow: isSelected ? '0 0 10px rgba(56, 189, 248, 0.3)' : 'none',
                        }}
                        aria-pressed={isSelected}
                      >
                        <span>{preset.icon}</span>
                        <span>{displayName}</span>
                        {isSelected && <Check size={13} color="var(--accent-primary)" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category Input Field with HTML5 Datalist Autocomplete & Voice Dictation */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    id="card-category"
                    list="flashcard-subjects-list"
                    type="text"
                    className="input"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onFocus={() => setLastFocusedField('category')}
                    placeholder={t('cards.category_placeholder', 'Type or select any subject (e.g. Physics, Algebra, Chemistry)...')}
                    autoComplete="off"
                    style={{ width: '100%' }}
                  />
                  <datalist id="flashcard-subjects-list">
                    {/* All presets */}
                    {SUBJECT_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>{p.icon} {p.nameEn}</option>
                    ))}
                    {/* Common academic subjects */}
                    <option value="Philosophy">Philosophy (ଦର୍ଶନ ଶାସ୍ତ୍ର / दर्शन शास्त्र)</option>
                    <option value="Psychology">Psychology (ମନୋବିଜ୍ଞାନ / मनोविज्ञान)</option>
                    <option value="Astronomy">Astronomy (ଜ୍ୟୋତିର୍ବିଜ୍ଞାନ / खगोल विज्ञान)</option>
                    <option value="Environmental Science">Environmental Science (ପରିବେଶ ବିଜ୍ଞାନ / पर्यावरण)</option>
                    <option value="Political Science">Political Science (ରାଜନୀତି ବିଜ୍ଞାନ / राजनीति विज्ञान)</option>
                    <option value="Commerce & Accounting">Commerce & Accounting (ବାଣିଜ୍ୟ / वाणिज्य)</option>
                    <option value="English">English</option>
                    <option value="Hindi">हिन्दी (Hindi)</option>
                    <option value="Odia">ଓଡ଼ିଆ (Odia)</option>
                    {/* Existing deck categories */}
                    {Array.from(new Set(allCards.map(c => c.category?.trim()).filter(Boolean))).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </datalist>
                </div>

                {/* Voice Dictation Button for Subject */}
                {isMicSupported && (
                  <button
                    type="button"
                    className={`btn ${isListening && activeMicField === 'category' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => toggleMic('category')}
                    aria-label={t('cards.mic_listen_subject', 'Speak subject name')}
                    title={isListening && activeMicField === 'category' ? 'Listening... click to stop' : 'Click to dictate subject name with mic'}
                    style={{
                      flexShrink: 0,
                      gap: '4px',
                      animation: isListening && activeMicField === 'category' ? 'subtle-pulse 1.2s infinite' : 'none',
                    }}
                  >
                    {isListening && activeMicField === 'category' ? (
                      <>
                        <MicOff size={16} />
                        <span style={{ fontSize: '0.75rem' }}>Listening...</span>
                      </>
                    ) : (
                      <>
                        <Mic size={16} color="var(--accent-primary)" />
                        <span style={{ fontSize: '0.75rem' }}>Voice</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Sample Question Templates for Selected Subject */}
              {(() => {
                const activePreset = SUBJECT_PRESETS.find(
                  (p) => p.id.toLowerCase().trim() === newCategory.toLowerCase().trim()
                );
                if (!activePreset || !activePreset.templates || activePreset.templates.length === 0) return null;

                return (
                  <div
                    style={{
                      marginTop: '0.65rem',
                      background: 'rgba(56, 189, 248, 0.06)',
                      border: '1px dashed rgba(56, 189, 248, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 0.85rem',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <Lightbulb size={13} />
                      <span>{t('cards.autofill_prompt', 'Click to autofill sample:')}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {activePreset.templates.map((tpl, tplIdx) => (
                        <button
                          key={tplIdx}
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setNewFront(tpl.front);
                            setNewBack(tpl.back);
                            announcePolite(`Autofilled: ${tpl.front}`);
                          }}
                          style={{
                            fontSize: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '3px 8px',
                            color: 'var(--text-secondary)',
                            textAlign: 'left',
                          }}
                        >
                          ⚡ {tpl.front.slice(0, 36)}...
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Question (Front) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label htmlFor="card-front" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {t('cards.question_label', 'Question (Front):')}
                </label>
                {isMicSupported && (
                  <button
                    type="button"
                    className={`btn btn-sm ${isListening && activeMicField === 'front' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => toggleMic('front')}
                    aria-label={t('cards.mic_listen_question', 'Speak question')}
                    title={isListening && activeMicField === 'front' ? 'Stop recording' : 'Dictate question with mic'}
                    style={{ fontSize: '0.75rem', gap: '4px', padding: '2px 8px' }}
                  >
                    {isListening && activeMicField === 'front' ? <MicOff size={14} /> : <Mic size={14} color="var(--accent-primary)" />}
                    <span>{isListening && activeMicField === 'front' ? 'Listening...' : 'Voice Dictate'}</span>
                  </button>
                )}
              </div>
              <textarea
                id="card-front"
                className="textarea"
                rows={3}
                value={newFront}
                onChange={(e) => setNewFront(e.target.value)}
                onFocus={() => setLastFocusedField('front')}
                placeholder="What is the formula for...?"
                required
              />
            </div>

            {/* Answer (Back) */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label htmlFor="card-back" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {t('cards.answer_label', 'Answer (Back):')}
                </label>
                {isMicSupported && (
                  <button
                    type="button"
                    className={`btn btn-sm ${isListening && activeMicField === 'back' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => toggleMic('back')}
                    aria-label={t('cards.mic_listen_answer', 'Speak answer')}
                    title={isListening && activeMicField === 'back' ? 'Stop recording' : 'Dictate answer with mic'}
                    style={{ fontSize: '0.75rem', gap: '4px', padding: '2px 8px' }}
                  >
                    {isListening && activeMicField === 'back' ? <MicOff size={14} /> : <Mic size={14} color="var(--accent-primary)" />}
                    <span>{isListening && activeMicField === 'back' ? 'Listening...' : 'Voice Dictate'}</span>
                  </button>
                )}
              </div>
              <textarea
                id="card-back"
                className="textarea"
                rows={3}
                value={newBack}
                onChange={(e) => setNewBack(e.target.value)}
                onFocus={() => setLastFocusedField('back')}
                placeholder="The answer or explanation..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ gap: '6px' }}>
                <Check size={16} />
                <span>{t('cards.btn_save_flashcard', 'Save Flashcard')}</span>
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
