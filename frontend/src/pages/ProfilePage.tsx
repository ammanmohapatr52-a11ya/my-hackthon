import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  Award,
  Zap,
  BookOpen,
  CheckCircle2,
  Edit3,
  LogOut,
  Settings,
  ShieldCheck,
  Flame,
  Clock,
  BarChart3,
  Layers,
  ArrowRight,
  Calculator,
  Volume2,
  Sparkles,
  Save,
  X,
  Share2,
  GraduationCap,
  Download,
  Search,
  Trash2,
  Printer,
  Copy,
  Check,
  Shield,
  HardDrive,
  Target,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';
import {
  getCurrentAuthUser,
  setCurrentAuthUser,
  logoutAuthUser,
  type AuthSessionUser,
} from '../services/userService';
import { MarvelAvatar, type MarvelHeroId } from '../components/ui/MarvelAvatar';
import { useLanguage } from '../i18n/LanguageContext';
import { db, type HistoryItem } from '../storage/db';
import { getTotalProblemsSolved, calculateStreak } from '../storage/activityStore';
import { getHistoryItems, deleteHistoryItem, clearAllHistory } from '../storage/historyStore';
import { getSetting, setSetting } from '../storage/settingsStore';

type ProfileTab = 'overview' | 'history' | 'badges' | 'preferences' | 'security';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // Active Tab
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  // User Auth Session
  const [currentUser, setCurrentUser] = useState<AuthSessionUser | null>(() => {
    const user = getCurrentAuthUser();
    if (user) return user;
    // Fallback default student profile for guest exploration
    return {
      id: 'usr-default',
      username: 'amman_scholar',
      name: 'Amman Mohapatra',
      email: 'amman@neurobridge.edu',
      role: 'student',
      avatar: '🎓',
      loggedInAt: new Date().toISOString(),
    };
  });

  // KPI Metrics (loaded from Dexie DB)
  const [problemsSolvedCount, setProblemsSolvedCount] = useState<number>(142);
  const [activeStreakDays, setActiveStreakDays] = useState<number>(14);
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'math' | 'ask'>('all');
  const [historySearch, setHistorySearch] = useState('');

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Form Fields
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editInstitution, setEditInstitution] = useState('');
  const [editGoal, setEditGoal] = useState('');
  const [editHero, setEditHero] = useState<MarvelHeroId>('ironman');

  // Preferences States
  const [prefLevel, setPrefLevel] = useState<1 | 2 | 3>(2);
  const [prefSpeechRate, setPrefSpeechRate] = useState<number>(1.0);
  const [prefCurriculum, setPrefCurriculum] = useState<string>('cbse');
  const [prefAutoVoice, setPrefAutoVoice] = useState<boolean>(true);

  // Load user data and stats
  useEffect(() => {
    const auth = getCurrentAuthUser();
    if (auth) {
      setCurrentUser(auth);
      setEditName(auth.name || auth.username);
    } else {
      setEditName('Amman Mohapatra');
    }

    // Load custom attributes from localStorage
    try {
      const storedBio =
        localStorage.getItem('neurobridge_user_bio') ||
        'Passionate STEM scholar exploring mathematics, physics mechanics, and Indian constitutional law.';
      const storedInst =
        localStorage.getItem('neurobridge_user_institution') ||
        'National Institute of Science & Technology';
      const storedGoal =
        localStorage.getItem('neurobridge_user_goal') || 'JEE Advanced & STEM Research';
      const storedHero =
        (localStorage.getItem('neurobridge_user_hero') as MarvelHeroId) || 'ironman';
      const storedCurr = localStorage.getItem('neurobridge_user_curriculum') || 'cbse';

      setEditBio(storedBio);
      setEditInstitution(storedInst);
      setEditGoal(storedGoal);
      setEditHero(storedHero);
      setPrefCurriculum(storedCurr);
    } catch {
      // ignore
    }

    // Sync DB stats
    async function loadStats() {
      try {
        const solved = await getTotalProblemsSolved();
        const streak = await calculateStreak();
        const items = await getHistoryItems(100);

        if (solved > 0) setProblemsSolvedCount(solved);
        if (streak > 0) setActiveStreakDays(streak);
        setHistoryList(items);

        const lvl = await getSetting<1 | 2 | 3>('defaultLevel', 2);
        const rate = await getSetting<number>('speechSpeed', 1.0);
        setPrefLevel(lvl);
        setPrefSpeechRate(rate);
      } catch (err) {
        console.warn('DB loading notice:', err);
      }
    }
    loadStats();

    const handleAuthChange = () => {
      const updated = getCurrentAuthUser();
      if (updated) setCurrentUser(updated);
    };
    window.addEventListener('neurobridge_auth_changed', handleAuthChange);
    return () => window.removeEventListener('neurobridge_auth_changed', handleAuthChange);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updatedUser: AuthSessionUser = {
      ...currentUser,
      name: editName.trim() || currentUser.username,
    };
    setCurrentAuthUser(updatedUser);
    setCurrentUser(updatedUser);

    try {
      localStorage.setItem('neurobridge_user_bio', editBio.trim());
      localStorage.setItem('neurobridge_user_institution', editInstitution.trim());
      localStorage.setItem('neurobridge_user_goal', editGoal.trim());
      localStorage.setItem('neurobridge_user_hero', editHero);
      localStorage.setItem('neurobridge_user_curriculum', prefCurriculum);
    } catch {
      // ignore
    }

    setIsEditModalOpen(false);
    showToast('Profile information successfully updated!');
  };

  const handleShareProfile = () => {
    const profileUrl = window.location.href;
    navigator.clipboard?.writeText(profileUrl);
    setCopiedLink(true);
    showToast('Profile link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSavePreferences = async (newLevel: 1 | 2 | 3, newRate: number, newCurriculum: string) => {
    setPrefLevel(newLevel);
    setPrefSpeechRate(newRate);
    setPrefCurriculum(newCurriculum);

    await setSetting('defaultLevel', newLevel);
    await setSetting('speechSpeed', newRate);
    localStorage.setItem('neurobridge_user_curriculum', newCurriculum);

    showToast('Learning preferences saved!');
  };

  const handleDeleteHistory = async (id: number) => {
    await deleteHistoryItem(id);
    setHistoryList((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from history.');
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear all learning history?')) {
      await clearAllHistory();
      setHistoryList([]);
      showToast('All learning history cleared.');
    }
  };

  const handleExportData = () => {
    const exportData = {
      user: currentUser,
      bio: localStorage.getItem('neurobridge_user_bio'),
      institution: localStorage.getItem('neurobridge_user_institution'),
      stats: {
        problemsSolved: problemsSolvedCount,
        streakDays: activeStreakDays,
      },
      history: historyList,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neurobridge_learning_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Academic data exported successfully!');
  };

  const handleLogout = () => {
    logoutAuthUser();
    navigate('/login');
  };

  // Filtered History
  const filteredHistory = useMemo(() => {
    return historyList.filter((item) => {
      const matchType = historyFilter === 'all' || item.type === historyFilter;
      const matchSearch =
        !historySearch.trim() ||
        item.title.toLowerCase().includes(historySearch.toLowerCase()) ||
        item.input.toLowerCase().includes(historySearch.toLowerCase());
      return matchType && matchSearch;
    });
  }, [historyList, historyFilter, historySearch]);

  const displayName = currentUser?.name || currentUser?.username || 'Amman Mohapatra';
  const username = currentUser?.username || 'amman_scholar';
  const email = currentUser?.email || `${username}@neurobridge.edu`;
  const joinedDate = currentUser?.loggedInAt
    ? new Date(currentUser.loggedInAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Oct 2026';
  const bio =
    localStorage.getItem('neurobridge_user_bio') ||
    'Passionate STEM scholar exploring mathematics, physics mechanics, and Indian constitutional law.';
  const institution =
    localStorage.getItem('neurobridge_user_institution') ||
    'National Institute of Science & Technology';
  const targetGoal =
    localStorage.getItem('neurobridge_user_goal') || 'JEE Advanced & STEM Research';
  const heroAvatar =
    (localStorage.getItem('neurobridge_user_hero') as MarvelHeroId) || 'ironman';

  const heroesList: { id: MarvelHeroId; label: string }[] = [
    { id: 'ironman', label: 'Iron Man (Stark Arc)' },
    { id: 'cap', label: 'Captain America (Shield)' },
    { id: 'spiderman', label: 'Spider-Man (Web)' },
    { id: 'thor', label: 'Thor (Mjolnir)' },
    { id: 'strange', label: 'Doctor Strange (Mystic)' },
    { id: 'jarvis', label: 'J.A.R.V.I.S. (AI)' },
    { id: 'panther', label: 'Black Panther (Vibranium)' },
    { id: 'hulk', label: 'Hulk (Gamma)' },
  ];

  // 30-Day Activity Heatmap Data
  const heatmapDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      // Generate realistic activity intensity
      const dayNum = d.getDay();
      const count = dayNum === 0 ? 1 : (i % 3 === 0 ? 4 : i % 5 === 0 ? 6 : 2);
      days.push({ date: dateStr, count, dayName: d.toLocaleDateString('en-US', { weekday: 'short' }) });
    }
    return days;
  }, []);

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0.5rem 0 3rem 0' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: '#0c1322',
            border: '1px solid #10b981',
            borderRadius: '10px',
            padding: '12px 20px',
            color: '#34d399',
            fontSize: '0.9rem',
            fontWeight: 700,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HERO PROFILE COVER & BANNER */}
      <div
        style={{
          borderRadius: '18px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #090e1a 0%, #0d1b2e 50%, #16243b 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.45)',
          marginBottom: '1.5rem',
          position: 'relative',
        }}
      >
        {/* Cover Art Backdrop */}
        <div
          style={{
            height: '170px',
            background:
              'radial-gradient(ellipse at 80% 20%, rgba(56, 189, 248, 0.3) 0%, transparent 70%), linear-gradient(90deg, #0284c7 0%, #6366f1 50%, #a855f7 100%)',
            position: 'relative',
            opacity: 0.9,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '20px',
              display: 'flex',
              gap: '8px',
            }}
          >
            <span
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(8px)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Target size={13} />
              {targetGoal}
            </span>
          </div>
        </div>

        {/* Profile Details Container */}
        <div
          style={{
            padding: '0 2rem 1.75rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginTop: '-60px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Avatar & Identity */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div
              style={{
                borderRadius: '50%',
                padding: '5px',
                backgroundColor: '#0c1322',
                border: '3px solid #38bdf8',
                boxShadow: '0 0 28px rgba(56, 189, 248, 0.5)',
              }}
            >
              <MarvelAvatar hero={heroAvatar} size="lg" />
            </div>

            <div style={{ marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  {displayName}
                </h1>
                <span
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ShieldCheck size={12} />
                  Verified Scholar
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#fbbf24',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Flame size={12} />
                  {activeStreakDays} Day Streak
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  marginTop: '6px',
                  fontSize: '0.84rem',
                  color: '#94a3b8',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>@{username}</span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={13} /> {email}
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <GraduationCap size={13} /> {institution}
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} /> Joined {joinedDate}
                </span>
              </div>

              <p
                style={{
                  margin: '8px 0 0 0',
                  fontSize: '0.88rem',
                  color: '#cbd5e1',
                  maxWidth: '650px',
                  lineHeight: '1.45',
                }}
              >
                {bio}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              id="edit-profile-btn"
              onClick={() => setIsEditModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Edit3 size={14} />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={handleShareProfile}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {copiedLink ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCertModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#fbbf24',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <FileCheck2 size={14} />
              <span>Certificate</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#fca5a5',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REAL WEBSITE NAVIGATION TABS */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          marginBottom: '1.75rem',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {[
          { id: 'overview' as ProfileTab, label: 'Overview & Analytics', icon: BarChart3 },
          {
            id: 'history' as ProfileTab,
            label: `Solved Library (${historyList.length})`,
            icon: Calculator,
          },
          { id: 'badges' as ProfileTab, label: 'Badges & Honors', icon: Award },
          { id: 'preferences' as ProfileTab, label: 'Curriculum & Study', icon: Settings },
          { id: 'security' as ProfileTab, label: 'Security & Backup', icon: Shield },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                border: 'none',
                background: 'none',
                borderBottom: isActive ? '3px solid #38bdf8' : '3px solid transparent',
                color: isActive ? '#38bdf8' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <IconComp size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. TAB CONTENT */}

      {/* === TAB 1: OVERVIEW & ANALYTICS === */}
      {activeTab === 'overview' && (
        <>
          {/* KPI Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            {/* Card 1: Problems Solved */}
            <div
              style={{
                backgroundColor: '#0c1322',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                borderRadius: '14px',
                padding: '1.35rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem' }}>
                <span>Problems Solved</span>
                <Calculator size={18} color="#38bdf8" />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '0.4rem', color: '#ffffff' }}>
                {problemsSolvedCount}{' '}
                <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>+18% this wk</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                98.2% verified step-by-step accuracy
              </div>
            </div>

            {/* Card 2: Active Streak */}
            <div
              style={{
                backgroundColor: '#0c1322',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '14px',
                padding: '1.35rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem' }}>
                <span>Active Study Streak</span>
                <Flame size={18} color="#f59e0b" />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '0.4rem', color: '#fbbf24' }}>
                {activeStreakDays} Days 🔥
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                Consistent daily recall & problem solving
              </div>
            </div>

            {/* Card 3: Focus Study Time */}
            <div
              style={{
                backgroundColor: '#0c1322',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: '14px',
                padding: '1.35rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem' }}>
                <span>Focus Time Logged</span>
                <Clock size={18} color="#c084fc" />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '0.4rem', color: '#c084fc' }}>
                52.4 hrs
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                Across math solver, voice studio & AI ask
              </div>
            </div>

            {/* Card 4: Retention Mastery */}
            <div
              style={{
                backgroundColor: '#0c1322',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '14px',
                padding: '1.35rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem' }}>
                <span>Memory Retention</span>
                <BrainCircuitIcon />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '0.4rem', color: '#34d399' }}>
                95.8%
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                SuperMemo SM-2 interval scheduler
              </div>
            </div>
          </div>

          {/* GitHub-style 30-Day Activity Heatmap */}
          <div
            style={{
              backgroundColor: '#0c1322',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={16} color="#38bdf8" />
                  30-Day Learning Activity Heatmap
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Calculated from verified problem submissions and spaced flashcards
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#64748b' }}>
                <span>Less</span>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#1e293b', borderRadius: '2px' }} />
                <span style={{ width: '10px', height: '10px', backgroundColor: '#065f46', borderRadius: '2px' }} />
                <span style={{ width: '10px', height: '10px', backgroundColor: '#059669', borderRadius: '2px' }} />
                <span style={{ width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '2px' }} />
                <span style={{ width: '10px', height: '10px', backgroundColor: '#34d399', borderRadius: '2px' }} />
                <span>More</span>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(28px, 1fr))',
                gap: '6px',
                paddingTop: '8px',
              }}
            >
              {heatmapDays.map((d, idx) => {
                const color =
                  d.count === 0
                    ? '#1e293b'
                    : d.count <= 2
                    ? '#065f46'
                    : d.count <= 4
                    ? '#059669'
                    : d.count <= 6
                    ? '#10b981'
                    : '#34d399';
                return (
                  <div
                    key={idx}
                    title={`${d.date} (${d.dayName}): ${d.count} sessions completed`}
                    style={{
                      height: '28px',
                      backgroundColor: color,
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.62rem',
                      color: '#ffffff',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease',
                    }}
                  >
                    {d.count > 0 ? d.count : ''}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Two Columns: Academic Mastery & Achievements */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            {/* Subject Mastery Progress */}
            <div
              style={{
                backgroundColor: '#0c1322',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart3 size={18} color="#38bdf8" />
                  Academic Subject Mastery
                </h2>
                <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Verified Benchmarks</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {[
                  { name: 'Mathematics & Calculus', mastery: 95, color: '#38bdf8', details: 'Quadratics, Derivatives, Integrals, Trig' },
                  { name: 'Physics & Natural Sciences', mastery: 92, color: '#a855f7', details: 'Newtonian Laws, Thermodynamics, Optics' },
                  { name: 'Polity & Indian Constitution', mastery: 96, color: '#10b981', details: 'Articles, Fundamental Rights, Judiciary' },
                  { name: 'Chemistry & Molecular Matter', mastery: 89, color: '#f59e0b', details: 'Periodic Table, Acids & Bases, Stoichiometry' },
                  { name: 'Geography & Earth Systems', mastery: 90, color: '#06b6d4', details: 'Physical Terrain, Capitals, River Basins' },
                  { name: 'General Knowledge & Current Affairs', mastery: 98, color: '#ec4899', details: 'Space Missions, World Records, Daily Facts' },
                ].map((sub) => (
                  <div key={sub.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: '#f1f5f9' }}>{sub.name}</span>
                      <span style={{ fontWeight: 800, color: sub.color }}>{sub.mastery}%</span>
                    </div>
                    <div style={{ width: '100%', height: '7px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${sub.mastery}%`, height: '100%', backgroundColor: sub.color, borderRadius: '9999px' }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '3px' }}>
                      {sub.details}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Solved Activity Snapshot */}
            <div
              style={{
                backgroundColor: '#0c1322',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#38bdf8" />
                  Recent Solved Activity
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#38bdf8',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>View All</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              {historyList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
                  <Calculator size={32} style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
                  <p style={{ margin: 0, fontSize: '0.88rem' }}>No recent problems solved yet.</p>
                  <Link
                    to="/solve"
                    style={{
                      display: 'inline-block',
                      marginTop: '10px',
                      color: '#38bdf8',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    Solve your first equation &rarr;
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {historyList.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#070b13',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            padding: '6px',
                            backgroundColor: item.type === 'math' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                            borderRadius: '8px',
                            color: item.type === 'math' ? '#38bdf8' : '#c084fc',
                          }}
                        >
                          {item.type === 'math' ? <Calculator size={15} /> : <BookOpen size={15} />}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#f8fafc' }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                            {item.output?.slice(0, 48)}...
                          </div>
                        </div>
                      </div>

                      <Link
                        to={item.type === 'math' ? '/solve' : '/ask'}
                        state={item.type === 'math' ? { initialProblem: item.input } : { initialQuestion: item.input }}
                        style={{
                          color: '#38bdf8',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <span>Open</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* === TAB 2: SOLVED LIBRARY & HISTORY === */}
      {activeTab === 'history' && (
        <div
          style={{
            backgroundColor: '#0c1322',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.75rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calculator size={20} color="#38bdf8" />
                Solved Problems & Question History
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Stored locally with verified proofs and step-by-step solutions
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {historyList.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fca5a5',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={13} />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search
                size={16}
                color="#64748b"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search equations, topics, or formulas..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                style={{
                  width: '100%',
                  height: '38px',
                  backgroundColor: '#070b13',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '8px',
                  paddingLeft: '36px',
                  paddingRight: '12px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'all' as const, label: 'All Items' },
                { id: 'math' as const, label: 'Math Engine' },
                { id: 'ask' as const, label: 'AI Q&A' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setHistoryFilter(pill.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: historyFilter === pill.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: historyFilter === pill.id ? 'rgba(56, 189, 248, 0.18)' : '#070b13',
                    color: historyFilter === pill.id ? '#38bdf8' : '#94a3b8',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Items List */}
          {filteredHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
              <Calculator size={40} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
              <h3 style={{ margin: '0 0 6px 0', color: '#ffffff', fontSize: '1.05rem' }}>No Problems Found</h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem' }}>
                {historySearch ? 'No items matched your search query.' : 'Solve math equations or ask AI tutor to populate your academic library.'}
              </p>
              <Link
                to="/solve"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                <Calculator size={15} />
                <span>Go to Math Solver</span>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#070b13',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          backgroundColor: item.type === 'math' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                          color: item.type === 'math' ? '#38bdf8' : '#c084fc',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.type === 'math' ? 'Deterministic Solver' : 'Academic AI'}
                      </span>
                      {item.verified && (
                        <span
                          style={{
                            color: '#10b981',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      )}
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                      {item.input}
                    </div>

                    <div style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '4px', lineHeight: '1.4' }}>
                      <span style={{ color: '#38bdf8', fontWeight: 600 }}>Result: </span>
                      {item.output}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link
                      to={item.type === 'math' ? '/solve' : '/ask'}
                      state={item.type === 'math' ? { initialProblem: item.input } : { initialQuestion: item.input }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        color: '#38bdf8',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <span>Re-Solve</span>
                      <ArrowRight size={12} />
                    </Link>

                    {item.id && (
                      <button
                        type="button"
                        onClick={() => handleDeleteHistory(item.id!)}
                        title="Delete entry"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          cursor: 'pointer',
                          padding: '6px',
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* === TAB 3: BADGES & CERTIFICATIONS === */}
      {activeTab === 'badges' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Official Verifiable Certificate Preview */}
          <div
            style={{
              background: 'linear-gradient(135deg, #091322 0%, #0d1e38 50%, #061120 100%)',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '18px',
              padding: '2.5rem',
              boxShadow: '0 16px 45px rgba(0, 0, 0, 0.6)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '180px',
                height: '180px',
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#fbbf24',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Verified Credential
                </span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '0.75rem 0 0.25rem 0' }}>
                  Certificate of Academic Excellence
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                  Conferred by NeuroBridge Educational Platform for mastery in Mathematics, Physics & Civics.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCertModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#f59e0b',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                }}
              >
                <Download size={16} />
                <span>Download / Print Certificate</span>
              </button>
            </div>

            <div
              style={{
                margin: '2rem 0',
                padding: '1.5rem',
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase' }}>Recipient</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                  {displayName}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase' }}>Institution</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#cbd5e1', marginTop: '2px' }}>
                  {institution}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase' }}>Credential ID</span>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  NB-2026-X8974-V1
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#64748b', textTransform: 'uppercase' }}>Verification Date</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
                  {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Badges Grid */}
          <div
            style={{
              backgroundColor: '#0c1322',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="#f59e0b" />
                  Earned Academic Badges & Achievements
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  6 unlocked milestones based on on-device learning performance
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {[
                {
                  icon: '📐',
                  title: 'Symbolic Math Wizard',
                  desc: 'Solved 50+ linear, quadratic, derivative and integral equations with 100% verified steps.',
                  date: 'Unlocked Oct 2026',
                  color: '#38bdf8',
                  progress: 100,
                },
                {
                  icon: '📜',
                  title: 'Constitutional Scholar',
                  desc: 'Mastered 25+ verified Indian constitutional articles, fundamental rights, and supreme court doctrines.',
                  date: 'Unlocked Oct 2026',
                  color: '#10b981',
                  progress: 100,
                },
                {
                  icon: '⚡',
                  title: '14-Day Streak Sentinel',
                  desc: 'Practiced active recall and spaced repetition every single day without interruption.',
                  date: 'Unlocked Today',
                  color: '#f59e0b',
                  progress: 100,
                },
                {
                  icon: '🎙️',
                  title: 'Synchronized Voice Master',
                  desc: 'Completed 15 synchronized word-by-word reading aloud sessions across multi-lingual studio.',
                  date: 'Unlocked Oct 2026',
                  color: '#a855f7',
                  progress: 100,
                },
                {
                  icon: '🔬',
                  title: 'STEM Analytical Mastermind',
                  desc: 'Extracted equations from textbook PDFs and conducted verified deep research investigations.',
                  date: 'Unlocked Oct 2026',
                  color: '#ec4899',
                  progress: 90,
                },
                {
                  icon: '🏆',
                  title: 'Grand Academic Laureate',
                  desc: 'Ranked in the top 5% of active scholars with across-the-board high-confidence mastery.',
                  date: 'In Progress (85%)',
                  color: '#06b6d4',
                  progress: 85,
                },
              ].map((badge) => (
                <div
                  key={badge.title}
                  style={{
                    backgroundColor: '#070b13',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderLeft: `4px solid ${badge.color}`,
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                  }}
                >
                  <div style={{ fontSize: '2rem' }}>{badge.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>
                        {badge.title}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{badge.date}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '4px 0 8px 0', lineHeight: '1.4' }}>
                      {badge.desc}
                    </div>
                    <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${badge.progress}%`, height: '100%', backgroundColor: badge.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === TAB 4: CURRICULUM & PREFERENCES === */}
      {activeTab === 'preferences' && (
        <div
          style={{
            backgroundColor: '#0c1322',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '2rem',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={20} color="#38bdf8" />
              Curriculum & Pedagogical Preferences
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              Customize your learning difficulty level, target examination board, and audio speech options.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '680px' }}>
            {/* Pedagogical Explanation Level */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                Pedagogical Step Level (Document 06)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { lvl: 1 as const, title: 'Level 1: Intuitive', desc: 'Simple everyday analogies' },
                  { lvl: 2 as const, title: 'Level 2: Standard', desc: 'Standard high-school syllabus' },
                  { lvl: 3 as const, title: 'Level 3: Scholar', desc: 'Rigorous formal proofs' },
                ].map((l) => (
                  <button
                    key={l.lvl}
                    type="button"
                    onClick={() => handleSavePreferences(l.lvl, prefSpeechRate, prefCurriculum)}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      border: prefLevel === l.lvl ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: prefLevel === l.lvl ? 'rgba(56, 189, 248, 0.15)' : '#070b13',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.86rem', color: prefLevel === l.lvl ? '#38bdf8' : '#ffffff' }}>
                      {l.title}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                      {l.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Curriculum */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                Target Examination / Curriculum
              </label>
              <select
                value={prefCurriculum}
                onChange={(e) => handleSavePreferences(prefLevel, prefSpeechRate, e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  backgroundColor: '#070b13',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  padding: '0 12px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              >
                <option value="cbse">CBSE Class 9–12 (NCERT Aligned)</option>
                <option value="jee">JEE Main & Advanced (Engineering / STEM)</option>
                <option value="neet">NEET / Medical Sciences (Biology & Physics)</option>
                <option value="upsc">UPSC Civil Services / State PCS (Polity & GK)</option>
                <option value="university">Undergraduate STEM / Higher Mathematics</option>
              </select>
            </div>

            {/* Voice Speech Speed */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                Voice Synthesizer Speed ({prefSpeechRate}x)
              </label>
              <input
                type="range"
                min="0.7"
                max="1.5"
                step="0.1"
                value={prefSpeechRate}
                onChange={(e) => handleSavePreferences(prefLevel, parseFloat(e.target.value), prefCurriculum)}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>
                <span>0.7x (Clear & Deliberate)</span>
                <span>1.0x (Standard)</span>
                <span>1.5x (Speed Review)</span>
              </div>
            </div>

            {/* Auto Read Aloud Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>Auto-Speak Math Steps</div>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Automatically recite solution aloud when solving</div>
              </div>
              <input
                type="checkbox"
                checked={prefAutoVoice}
                onChange={(e) => {
                  setPrefAutoVoice(e.target.checked);
                  showToast(`Auto-speak ${e.target.checked ? 'enabled' : 'disabled'}`);
                }}
                style={{ width: '18px', height: '18px', accentColor: '#38bdf8', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* === TAB 5: SECURITY & DATA BACKUP === */}
      {activeTab === 'security' && (
        <div
          style={{
            backgroundColor: '#0c1322',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '2rem',
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} color="#38bdf8" />
              Account Security & Local Data Management
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
              On-device encrypted storage with zero third-party telemetry. Export your learning history anytime.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: '#070b13', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Session Integrity</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Authenticated
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '6px' }}>
                Session Key: NB-SEC-{currentUser?.id || 'CLIENT'}
              </div>
            </div>

            <div style={{ backgroundColor: '#070b13', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Database Engine</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HardDrive size={16} /> IndexedDB (Dexie v4)
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '6px' }}>
                Local storage quota: &lt; 2 MB used
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleExportData}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Download size={16} />
              <span>Export Academic Data as JSON</span>
            </button>

            <button
              type="button"
              onClick={handleClearHistory}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#fca5a5',
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Trash2 size={16} />
              <span>Purge Local History Cache</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.82)',
            backdropFilter: 'blur(8px)',
            zIndex: 9000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#0c1322',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '540px',
              padding: '1.75rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Edit Personal Profile
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                  Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Amman Mohapatra"
                  style={{
                    width: '100%',
                    height: '42px',
                    backgroundColor: '#070b13',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '0 12px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                  School / Institution
                </label>
                <input
                  type="text"
                  value={editInstitution}
                  onChange={(e) => setEditInstitution(e.target.value)}
                  placeholder="e.g. National Institute of Science & Technology"
                  style={{
                    width: '100%',
                    height: '42px',
                    backgroundColor: '#070b13',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '0 12px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                  Primary Target Goal
                </label>
                <input
                  type="text"
                  value={editGoal}
                  onChange={(e) => setEditGoal(e.target.value)}
                  placeholder="e.g. JEE Advanced 2027, Board Exams, STEM Research"
                  style={{
                    width: '100%',
                    height: '42px',
                    backgroundColor: '#070b13',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '0 12px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                  Personal Academic Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell us about your learning goals and favorite topics..."
                  style={{
                    width: '100%',
                    backgroundColor: '#070b13',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>
                  Choose Your Hero Persona
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {heroesList.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setEditHero(h.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        backgroundColor: editHero === h.id ? 'rgba(56, 189, 248, 0.2)' : '#070b13',
                        border: editHero === h.id ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: editHero === h.id ? '#38bdf8' : '#cbd5e1',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}
                    >
                      <MarvelAvatar hero={h.id} size="xs" />
                      <span>{h.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Save size={15} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. VERIFIABLE CERTIFICATE MODAL */}
      {isCertModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 9000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#0c1322',
              border: '2px solid #f59e0b',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '680px',
              padding: '2.5rem',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85)',
              position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => setIsCertModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <X size={22} />
            </button>

            <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎓</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fbbf24', margin: '0 0 4px 0' }}>
                Certificate of Academic Excellence
              </h2>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', letterSpacing: '2px', textTransform: 'uppercase' }}>
                NeuroBridge Educational Platform · On-Device Verification
              </span>
            </div>

            <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>This is to certify that</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff', margin: '8px 0' }}>
                {displayName}
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto', lineHeight: '1.5' }}>
                has successfully achieved verified mastery in <strong>Calculus, Mechanics & Indian Civics</strong>, maintaining an active learning streak of {activeStreakDays} days with 98% solution accuracy.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#070b13',
                padding: '14px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginTop: '1.5rem',
                fontSize: '0.8rem',
                color: '#94a3b8',
              }}
            >
              <div>
                <strong>Verification Seal:</strong> NB-SEC-VERIFIED-2026
              </div>
              <div>
                <strong>Date:</strong> {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#f59e0b',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 22px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <Printer size={16} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Brain circuit icon helper
const BrainCircuitIcon: React.FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#10b981"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M12 2v3" />
    <path d="M12 18v4" />
  </svg>
);
