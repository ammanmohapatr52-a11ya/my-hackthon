import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, HelpCircle, Activity, Layers, Volume2, ArrowRight, FileText, Globe2 } from 'lucide-react';

import { useLanguage } from '../../i18n/LanguageContext';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const actions = [
    {
      title: t('news.action_title', 'Current Affairs & World Facts'),
      desc: t('news.action_desc', 'Verified real-time world news, Google News updates, breakthroughs in science & space, and today\'s mind-blowing facts.'),
      path: '/news',
      icon: Globe2,
      color: '#38BDF8',
      tag: 'LIVE WIRE & GK',
    },
    {
      title: t('math.title', 'Solve a Mathematics Problem'),
      desc: t('home.action_solve_desc', 'Exact, step-by-step algebra, calculus, and linear equation solver verified on your device.'),
      path: '/solve',
      icon: Calculator,
      color: '#38BDF8',
      tag: t('math.checked', 'Exact & Checked'),
    },
    {
      title: t('ask.title', 'Ask a Question'),
      desc: t('home.action_ask_desc', 'Connects directly to your local Ollama runtime for private academic tutoring and conceptual answers.'),
      path: '/ask',
      icon: HelpCircle,
      color: '#818CF8',
      tag: t('ask.provider_label', 'AI Engine'),
    },
    {
      title: t('scan.title', 'PDF Scanner & Lecture Analyzer'),
      desc: t('home.action_scan_desc', 'Scan textbooks or lecture notes page-by-page. Automatically detect chapters (LEC-1, LEC-2) and create flashcards.'),
      path: '/scan',
      icon: FileText,
      color: '#6366F1',
      tag: 'PyMuPDF RAG',
    },
    {
      title: t('graph.title', 'Graph and Sound'),
      desc: t('home.action_graph_desc', 'Interactive mathematical function plotter with Web Audio sonification tone mapping.'),
      path: '/graph',
      icon: Activity,
      color: '#10B981',
      tag: t('graph.btn_play', 'Audio Sonification'),
    },
    {
      title: t('cards.title', 'Flashcards'),
      desc: t('home.action_cards_desc', 'Spaced repetition memory practice using SM-2 scheduling, speech reading, and quick ratings.'),
      path: '/flashcards',
      icon: Layers,
      color: '#F59E0B',
      tag: 'SM-2',
    },
    {
      title: t('voice.title', 'Voice Learning'),
      desc: t('voice.desc', 'Listen to any problem or academic text with real-time synchronized word highlighting.'),
      path: '/voice-learning',
      icon: Volume2,
      color: '#EC4899',
      tag: t('voice.speed_label', 'Word Highlighting'),
    },
  ];

  return (
    <div style={{ margin: '2rem 0' }}>
      <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>{t('home.quick_actions', 'Quick Actions')}</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <div
              key={idx}
              className="card card-interactive"
              role="button"
              tabIndex={0}
              onClick={() => navigate(act.path)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(act.path);
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255,255,255,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={22} color={act.color} />
                  </div>
                  <span
                    className="badge"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.7rem',
                    }}
                  >
                    {act.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{act.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>
                  {act.desc}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  marginTop: '1.25rem',
                }}
              >
                <span>Launch tool</span>
                <ArrowRight size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
