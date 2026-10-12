import React, { useEffect, useState } from 'react';
import { Flame, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { calculateStreak, getTotalProblemsSolved } from '../../storage/activityStore';
import { getAllFlashcards, getDueFlashcards } from '../../storage/flashcardStore';

import { useLanguage } from '../../i18n/LanguageContext';

export const StatsRow: React.FC = () => {
  const { t } = useLanguage();
  const [streak, setStreak] = useState(0);
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [cardsDue, setCardsDue] = useState(0);
  const [cardsSaved, setCardsSaved] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const [currentStreak, totalSolved, due, all] = await Promise.all([
          calculateStreak(),
          getTotalProblemsSolved(),
          getDueFlashcards(),
          getAllFlashcards(),
        ]);
        setStreak(currentStreak);
        setProblemsSolved(totalSolved);
        setCardsDue(due.length);
        setCardsSaved(all.length);
      } catch (e) {
        console.warn('Could not load stats from DB:', e);
      }
    }
    loadStats();
  }, []);

  const stats = [
    {
      label: t('home.stats_streak', 'Day Streak'),
      value: `${streak}`,
      icon: Flame,
      color: '#F59E0B',
      sub: streak > 0 ? 'Consistent practice!' : 'Start solving',
    },
    {
      label: t('home.stats_solved', 'Problems Solved'),
      value: problemsSolved.toString(),
      icon: CheckCircle,
      color: '#10B981',
      sub: t('math.checked', 'Verified ✔'),
    },
    {
      label: t('home.stats_due', 'Cards Due Today'),
      value: cardsDue.toString(),
      icon: Clock,
      color: '#38BDF8',
      sub: cardsDue > 0 ? 'Ready for review' : 'All caught up!',
    },
    {
      label: t('home.stats_saved', 'Saved Cards'),
      value: cardsSaved.toString(),
      icon: BookOpen,
      color: '#818CF8',
      sub: t('cards.title', 'Flashcards'),
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        margin: '1.5rem 0',
      }}
    >
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.75rem',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {s.label}
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={18} color={s.color} />
              </div>
            </div>
            <div
              style={{
                fontSize: '1.85rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: '0.775rem',
                color: 'var(--text-muted)',
                marginTop: '0.25rem',
              }}
            >
              {s.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
};
