import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, BookOpen, MessageSquare, Copy, Check } from 'lucide-react';
import { addFlashcard } from '../../storage/flashcardStore';
import { useVisualAlert } from '../../accessibility/VisualAlert';
import { useAnnounce } from '../../accessibility/useAnnounce';
import { useLanguage } from '../../i18n/LanguageContext';
import type { MathSolution } from '../../math/types';

interface SolutionActionsProps {
  solution: MathSolution;
  onListen: () => void;
}

export const SolutionActions: React.FC<SolutionActionsProps> = ({ solution, onListen }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { showAlert } = useVisualAlert();
  const { announcePolite } = useAnnounce();
  const [copied, setCopied] = useState(false);
  const [savedCard, setSavedCard] = useState(false);

  const handleCopy = async () => {
    try {
      const textToCopy = `Problem: ${solution.originalInput}\nSolution: ${solution.solutionText}\nVerified: ${solution.verification.statusText}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      announcePolite('Solution copied to clipboard.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSaveFlashcard = async () => {
    try {
      await addFlashcard({
        front: `Solve: ${solution.originalInput}`,
        back: solution.solutionText,
        mathLatex: solution.solutionLatex,
        category: solution.type.toUpperCase(),
      });
      setSavedCard(true);
      announcePolite('Saved solution as a flashcard.');
      showAlert({
        type: 'success',
        title: 'Saved as Flashcard',
        message: 'This problem was added to your spaced-repetition review deck.',
      });
      setTimeout(() => setSavedCard(false), 3000);
    } catch (e) {
      console.warn('Failed to save flashcard:', e);
    }
  };

  const handleAskAboutThis = () => {
    navigate('/ask', {
      state: {
        prefilledQuestion: `Can you explain the mathematical reasoning behind solving "${solution.originalInput}", which gave "${solution.solutionText}"?`,
      },
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginTop: '1.25rem',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={onListen}
        aria-label={t('math.btn_listen', 'Listen to step-by-step spoken explanation')}
      >
        <Volume2 size={16} />
        <span>{t('math.btn_listen', 'Listen Aloud')}</span>
      </button>

      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={handleSaveFlashcard}
        disabled={savedCard}
        aria-label={t('math.btn_save_card', 'Save this problem as a flashcard')}
      >
        {savedCard ? <Check size={16} color="var(--status-success)" /> : <BookOpen size={16} />}
        <span>{savedCard ? t('math.btn_saved', 'Saved!') : t('math.btn_save_card', 'Save Flashcard')}</span>
      </button>

      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={handleAskAboutThis}
        aria-label={t('math.btn_ask_about', 'Ask our AI tutor about this specific problem')}
      >
        <MessageSquare size={16} />
        <span>{t('math.btn_ask_about', 'Ask About This')}</span>
      </button>

      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={handleCopy}
        aria-label={t('math.btn_copy', 'Copy solution to clipboard')}
      >
        {copied ? <Check size={16} color="var(--status-success)" /> : <Copy size={16} />}
        <span>{copied ? t('math.btn_copied', 'Copied!') : t('math.btn_copy', 'Copy')}</span>
      </button>
    </div>
  );
};
