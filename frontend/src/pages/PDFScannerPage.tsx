import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  BookOpen,
  Volume2,
  HelpCircle,
  Calculator,
  Search,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Copy,
  Download,
  AlertCircle,
  Clock,
  ArrowRight,
  List,
  Eye,
  AlignLeft,
  Sliders,
  Check,
  ChevronDown,
  Compass,
} from 'lucide-react';
import { addFlashcard } from '../storage/flashcardStore';
import { useSpeechOutput } from '../speech/useSpeechOutput';
import { useVisualAlert } from '../accessibility/VisualAlert';
import { useAnnounce } from '../accessibility/useAnnounce';
import { useLanguage } from '../i18n/LanguageContext';
import {
  scanPdfDocument,
  type ScannedPage,
  type ChapterMetadata,
  type ScanResult,
} from '../services/pdfScannerClient';
import { MarvelAvatar } from '../components/ui/MarvelAvatar';

export const PDFScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { speakText } = useSpeechOutput();
  const { showAlert } = useVisualAlert();
  const { announcePolite } = useAnnounce();

  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [currentPageIdx, setCurrentPageIdx] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [showOutline, setShowOutline] = useState<boolean>(false);

  const chapterScrollRef = useRef<HTMLDivElement>(null);

  // Active page safely bounded
  const activePage: ScannedPage | undefined = scanResult?.pages?.[currentPageIdx];

  // Active Chapter calculation
  const currentChapterIdx = useMemo(() => {
    if (!scanResult || !activePage) return 0;
    const idx = scanResult.chapters.findIndex(
      (ch) => activePage.page_number >= ch.start_page && activePage.page_number <= ch.end_page
    );
    return idx >= 0 ? idx : 0;
  }, [scanResult, activePage]);

  const activeChapter = scanResult?.chapters?.[currentChapterIdx];

  // Keyboard navigation listener (Left / Right arrow keys to turn pages)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (!scanResult) return;

      if (e.key === 'ArrowLeft') {
        setCurrentPageIdx((p) => Math.max(0, p - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentPageIdx((p) => Math.min(scanResult.total_pages - 1, p + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scanResult]);

  // Horizontal scroll buttons for chapter bar
  const scrollChapters = (direction: 'left' | 'right') => {
    if (chapterScrollRef.current) {
      chapterScrollRef.current.scrollBy({
        left: direction === 'left' ? -280 : 280,
        behavior: 'smooth',
      });
    }
  };

  // Jump to sequential chapter
  const handleJumpToChapter = (ch: ChapterMetadata) => {
    setSelectedChapterFilter(ch.chapter_id);
    setCurrentPageIdx(Math.max(0, ch.start_page - 1));
  };

  const handlePrevChapter = () => {
    if (!scanResult || currentChapterIdx <= 0) return;
    const prev = scanResult.chapters[currentChapterIdx - 1];
    handleJumpToChapter(prev);
  };

  const handleNextChapter = () => {
    if (!scanResult || currentChapterIdx >= scanResult.chapters.length - 1) return;
    const next = scanResult.chapters[currentChapterIdx + 1];
    handleJumpToChapter(next);
  };

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showAlert({
        type: 'error',
        title: 'Invalid File',
        message: 'Please upload a valid PDF document.',
      });
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    announcePolite(`Scanning ${file.name}...`);

    try {
      const data = await scanPdfDocument(file);
      setScanResult(data);
      setCurrentPageIdx(0);
      setSelectedChapterFilter('all');
      announcePolite(`Successfully scanned ${data.filename} (${data.total_pages} pages).`);
      showAlert({
        type: 'success',
        title: 'PDF Scanned Successfully',
        message: `Extracted ${data.total_pages} pages and detected ${data.chapters.length} chapter(s).`,
      });
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMessage(
        'Could not process this PDF document. You can still use the sample lecture preview below.'
      );
      showAlert({
        type: 'error',
        title: 'Scan Error',
        message: 'Unable to extract structure from file. Please check file format.',
      });
    } finally {
      setIsLoading(false);
      try {
        e.target.value = '';
      } catch {
        // ignore
      }
    }
  };

  // Load Built-in Demo Lecture
  const loadDemoLecture = () => {
    const samplePages: ScannedPage[] = [
      {
        page_number: 1,
        chapter: 'LEC-1: Introduction to Mechanics & Kinematics',
        headings: ['LEC-1: Introduction to Mechanics & Kinematics', '1.1 Definition of Position & Velocity'],
        word_count: 142,
        char_count: 890,
        math_formulas: ['v = dx / dt', 'a = dv / dt = d^2x / dt^2'],
        text: `LEC-1: Introduction to Mechanics & Kinematics
1.1 Definition of Position & Velocity
In classical physics, mechanics is the branch of science studying the motion of bodies under the action of forces.

Kinematics describes the motion of points, bodies, and systems of bodies without considering the forces that cause them.
Key definitions:
- Position vector r(t) represents the location of a point relative to a chosen coordinate origin.
- Average velocity is defined as displacement divided by elapsed time: v_avg = Δx / Δt.
- Instantaneous velocity is the time-derivative of position:
v = dx / dt
- Acceleration measures the time rate of change of velocity:
a = dv / dt = d^2x / dt^2`,
      },
      {
        page_number: 2,
        chapter: 'LEC-1: Introduction to Mechanics & Kinematics',
        headings: ['1.2 Uniform Acceleration Equations'],
        word_count: 135,
        char_count: 810,
        math_formulas: ['v = u + a*t', 's = u*t + 0.5*a*t^2', 'v^2 = u^2 + 2*a*s'],
        text: `1.2 Uniform Acceleration Equations
When an object travels with constant linear acceleration a, three fundamental kinematic relations govern the trajectory:

First kinematic relation:
v = u + a*t

Second kinematic relation:
s = u*t + 0.5*a*t^2

Third kinematic relation:
v^2 = u^2 + 2*a*s

Where:
- u is initial velocity at time t=0
- v is final velocity at time t
- a is constant uniform acceleration
- s is total linear displacement traveled`,
      },
      {
        page_number: 3,
        chapter: 'LEC-2: Newton\'s Laws & Dynamic Equilibrium',
        headings: ['LEC-2: Newton\'s Laws of Motion', '2.1 First and Second Laws'],
        word_count: 168,
        char_count: 980,
        math_formulas: ['F_net = m * a', 'p = m * v', 'F = dp / dt'],
        text: `LEC-2: Newton's Laws of Motion
2.1 First and Second Laws
Dynamics studies why objects move by analyzing forces and masses.

Newton's First Law (Law of Inertia):
A body remains at rest or moves in a straight line at constant speed unless acted upon by a net external force.

Newton's Second Law:
The acceleration of a body is directly proportional to the net force acting upon it and inversely proportional to its mass:
F_net = m * a

Linear Momentum is defined as:
p = m * v

In differential form, force is the rate of change of linear momentum:
F = dp / dt`,
      },
      {
        page_number: 4,
        chapter: 'LEC-2: Newton\'s Laws & Dynamic Equilibrium',
        headings: ['2.2 Third Law & Friction Forces'],
        word_count: 140,
        char_count: 840,
        math_formulas: ['F_AB = -F_BA', 'f_s <= mu_s * N', 'f_k = mu_k * N'],
        text: `2.2 Third Law & Friction Forces
Newton's Third Law (Action and Reaction):
Whenever one body exerts a force on a second body, the second body exerts an equal and opposite force on the first body:
F_AB = -F_BA

Friction is the resistive contact force parallel to the interface between two contacting surfaces:
- Maximum static friction before slipping:
f_s <= mu_s * N
- Kinetic friction during motion:
f_k = mu_k * N

Where mu is the coefficient of friction and N is normal contact force.`,
      },
    ];

    const demoResult: ScanResult = {
      filename: 'Physics_101_Lecture_Notes_Mechanics.pdf',
      total_pages: 4,
      total_words: 585,
      chapters: [
        {
          chapter_id: 'LEC-1',
          title: 'LEC-1: Mechanics & Kinematics',
          full_title: 'LEC-1: Introduction to Mechanics & Kinematics',
          start_page: 1,
          end_page: 2,
          page_count: 2,
        },
        {
          chapter_id: 'LEC-2',
          title: 'LEC-2: Newton\'s Laws & Dynamics',
          full_title: 'LEC-2: Newton\'s Laws & Dynamic Equilibrium',
          start_page: 3,
          end_page: 4,
          page_count: 2,
        },
      ],
      pages: samplePages,
      source: 'backend',
    };

    setScanResult(demoResult);
    setCurrentPageIdx(0);
    setSelectedChapterFilter('all');
    announcePolite('Loaded built-in physics lecture demo.');
  };

  // Convert Page to Flashcard
  const handleCreateFlashcardFromPage = async () => {
    if (!activePage) return;

    try {
      const title = activePage.headings[0] || `${activePage.chapter} (Page ${activePage.page_number})`;
      const snippet = activePage.text.slice(0, 320) + (activePage.text.length > 320 ? '...' : '');

      await addFlashcard({
        front: `What are the core concepts covered in ${title}?`,
        back: snippet,
        category: activePage.chapter || 'PDF SCANNER',
      });
      announcePolite('Flashcard created from scanned page.');
      showAlert({
        type: 'success',
        title: 'Flashcard Saved',
        message: `Saved flashcard for Page ${activePage.page_number} into your study queue.`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Quick Action: Send to Math Solver
  const handleSendMath = (formula: string) => {
    navigate(`/solve?problem=${encodeURIComponent(formula)}`);
  };

  // Quick Action: Ask AI Tutor
  const handleAskAITutor = () => {
    if (!activePage) return;
    const prompt = `From ${activePage.chapter} (Page ${activePage.page_number}): ${activePage.text.slice(0, 200)}... Explain this concept in detail.`;
    navigate(`/ask?q=${encodeURIComponent(prompt)}`);
  };

  // Filtered pages for search
  const searchMatches = useMemo(() => {
    if (!scanResult || !searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return scanResult.pages.filter((p) => p.text.toLowerCase().includes(q));
  }, [scanResult, searchQuery]);

  // Clean formatting for paragraphs in reader
  const formattedParagraphs = useMemo(() => {
    if (!activePage) return [];
    const rawLines = activePage.text.split('\n');
    const result: Array<{ type: 'heading' | 'bullet' | 'formula' | 'text'; content: string }> = [];

    for (const rawLine of rawLines) {
      const line = rawLine.trim();
      if (!line) continue;

      // Check if line matches an extracted heading or section marker
      const isHeading =
        activePage.headings.some((h) => line.toLowerCase().includes(h.toLowerCase()) || h.toLowerCase().includes(line.toLowerCase())) ||
        /^(?:CHAPTER|LEC|SECTION|PART|\d+\.\d+)\b/i.test(line) ||
        (line.length < 50 && line === line.toUpperCase() && /[A-Z]/.test(line));

      if (isHeading) {
        result.push({ type: 'heading', content: line });
        continue;
      }

      // Check if bullet point
      if (/^[-*•]\s+/.test(line) || /^\d+[\).]\s+/.test(line)) {
        result.push({ type: 'bullet', content: line });
        continue;
      }

      // Check if formula
      if (activePage.math_formulas.some((f) => line.includes(f)) || /[=><]\s*[-+]?[0-9a-zA-Z\(\)\/\*]/.test(line)) {
        result.push({ type: 'formula', content: line });
        continue;
      }

      result.push({ type: 'text', content: line });
    }

    return result;
  }, [activePage]);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Page Title & Intro */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.35)',
            }}
          >
            <FileText size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.85rem', margin: 0, fontWeight: 800, letterSpacing: '-0.02em' }}>
              {t('scan.title', 'PDF Scanner & Lecture Analyzer')}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '2px 0 0' }}>
              {t(
                'scan.desc',
                'Scan textbooks, slides, and lecture notes. Automatically detect chapters (e.g. LEC-1, LEC-2), extract equations, and study with instant flashcards.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Upload Zone / Drop Area */}
      {!scanResult && (
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(56, 189, 248, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <Upload size={32} color="var(--accent-primary)" />
          </div>

          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>
            {t('scan.upload_prompt', 'Upload Academic PDF or Lecture Notes')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            Supports scanned e-books, slide decks with lecture demarcations (LEC-1, LEC-2), textbook chapters, and math problem sets.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <label className="btn btn-primary btn-lg" style={{ cursor: 'pointer', position: 'relative' }}>
              <Upload size={18} />
              <span>{isLoading ? 'Scanning PDF...' : 'Choose PDF File'}</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
            </label>

            <button type="button" className="btn btn-secondary btn-lg" onClick={loadDemoLecture} disabled={isLoading}>
              <Sparkles size={18} color="var(--accent-primary)" />
              <span>Load Demo Lecture (LEC-1 & LEC-2)</span>
            </button>
          </div>

          {errorMessage && (
            <div style={{ marginTop: '1.5rem', color: 'var(--status-error)', fontSize: '0.9rem' }}>
              <AlertCircle size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Scanned Document Interactive Viewer */}
      {scanResult && activePage && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Document Header Bar */}
          <div
            className="card"
            style={{
              padding: '1.15rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45), 0 0 16px rgba(56, 189, 248, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span
                className="badge badge-info"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.88rem',
                  padding: '6px 12px',
                  fontWeight: 700,
                  maxWidth: '340px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={scanResult.filename}
              >
                <MarvelAvatar hero="ironman" size="xs" />
                {scanResult.filename}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#94a3b8' }}>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>{scanResult.total_pages} Pages</span>
                <span>•</span>
                <span>{scanResult.total_words.toLocaleString()} Words</span>
                <span>•</span>
                <span style={{ color: '#a78bfa', fontWeight: 600 }}>{scanResult.chapters.length} Chapters</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              {/* Table of Contents / Outline Toggle */}
              <button
                type="button"
                className={`btn btn-sm ${showOutline ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setShowOutline(!showOutline)}
                title="Toggle sequential table of contents"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderColor: showOutline ? undefined : 'rgba(56, 189, 248, 0.4)',
                }}
              >
                <List size={15} />
                <span>Outline ({scanResult.chapters.length})</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: showOutline ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {/* Upload Another PDF */}
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Upload size={15} />
                <span>Upload Another</span>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Sequential Table of Contents Drawer (Collapsible) */}
          {showOutline && (
            <div
              className="card"
              style={{
                padding: '1.25rem',
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.15)',
                animation: 'outlineFade 0.2s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MarvelAvatar hero="cap" size="xs" />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
                    Document Table of Contents (Sequential Index)
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Click any chapter to jump directly
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '8px',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  paddingRight: '6px',
                }}
              >
                {scanResult.chapters.map((ch, idx) => {
                  const isCurrent = currentChapterIdx === idx;
                  return (
                    <button
                      key={ch.chapter_id}
                      type="button"
                      onClick={() => {
                        handleJumpToChapter(ch);
                        setShowOutline(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: isCurrent ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                        border: isCurrent ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.06)',
                        color: isCurrent ? '#38bdf8' : '#e2e8f0',
                        fontSize: '0.825rem',
                        fontWeight: isCurrent ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isCurrent) {
                          e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                          e.currentTarget.style.background = 'rgba(30, 41, 59, 0.9)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isCurrent) {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                          e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: isCurrent ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
                            color: isCurrent ? '#0f172a' : '#94a3b8',
                            flexShrink: 0,
                          }}
                        >
                          {idx + 1}
                        </span>
                        <span
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={ch.full_title || ch.title}
                        >
                          {ch.title}
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: '0.72rem',
                          color: '#94a3b8',
                          flexShrink: 0,
                          background: 'rgba(0, 0, 0, 0.25)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        pp. {ch.start_page}–{ch.end_page}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sequential Chapter Navigation Carousel (Clean Pill Bar with Scroll Arrows) */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 8px',
              background: 'rgba(15, 23, 42, 0.75)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={() => scrollChapters('left')}
              className="btn btn-ghost btn-sm"
              style={{
                padding: '6px',
                minWidth: '32px',
                height: '32px',
                borderRadius: '50%',
                flexShrink: 0,
                color: '#38bdf8',
              }}
              title="Scroll chapters left"
              aria-label="Scroll chapters left"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Scrollable Container with Pills */}
            <div
              ref={chapterScrollRef}
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'thin',
                padding: '4px 2px',
                flex: 1,
              }}
            >
              {/* 'All Sections' Pill */}
              <button
                type="button"
                className={`btn btn-sm ${selectedChapterFilter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedChapterFilter('all')}
                style={{
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  borderRadius: '9999px',
                  padding: '5px 14px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: selectedChapterFilter === 'all' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                }}
              >
                All Sections
              </button>

              {/* Individual Chapter Pills */}
              {scanResult.chapters.map((ch, idx) => {
                const isActive = selectedChapterFilter === ch.chapter_id || (selectedChapterFilter === 'all' && currentChapterIdx === idx);

                return (
                  <button
                    key={ch.chapter_id}
                    type="button"
                    onClick={() => handleJumpToChapter(ch)}
                    title={ch.full_title || ch.title}
                    style={{
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      borderRadius: '9999px',
                      padding: '5px 12px',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'rgba(30, 41, 59, 0.7)',
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: isActive ? '0 0 14px rgba(56, 189, 248, 0.45)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                        color: isActive ? '#ffffff' : '#94a3b8',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span
                      style={{
                        maxWidth: '190px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {ch.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        opacity: isActive ? 0.9 : 0.65,
                        background: 'rgba(0, 0, 0, 0.25)',
                        padding: '1px 5px',
                        borderRadius: '3px',
                      }}
                    >
                      pp. {ch.start_page}–{ch.end_page}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            <button
              type="button"
              onClick={() => scrollChapters('right')}
              className="btn btn-ghost btn-sm"
              style={{
                padding: '6px',
                minWidth: '32px',
                height: '32px',
                borderRadius: '50%',
                flexShrink: 0,
                color: '#38bdf8',
              }}
              title="Scroll chapters right"
              aria-label="Scroll chapters right"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Search Bar Across Document */}
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              className="input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all scanned pages and keywords..."
              style={{
                paddingLeft: '2.75rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(15, 23, 42, 0.7)',
                borderColor: 'rgba(56, 189, 248, 0.2)',
              }}
            />
            {searchQuery && (
              <div style={{ fontSize: '0.85rem', color: '#38bdf8', marginTop: '0.4rem', fontWeight: 600 }}>
                Found matches in {searchMatches.length} page(s):{' '}
                {searchMatches.slice(0, 6).map((m) => (
                  <button
                    key={m.page_number}
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setCurrentPageIdx(m.page_number - 1)}
                    style={{
                      padding: '2px 8px',
                      margin: '0 3px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    Page {m.page_number}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Main 2-Column Split Interface */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.85fr) minmax(310px, 1.15fr)', gap: '1.5rem', alignItems: 'start' }}>
            {/* Column 1: Page Text Reader & Sequential Stepper */}
            <div
              className="card"
              style={{
                padding: '1.75rem',
                background: 'rgba(15, 23, 42, 0.92)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
              }}
            >
              {/* Sequential Header: Chapter & Section Breadcrumb */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        padding: '1px 7px',
                        borderRadius: '4px',
                        background: 'rgba(56, 189, 248, 0.2)',
                        color: '#38bdf8',
                      }}
                    >
                      Section {currentChapterIdx + 1} of {scanResult.chapters.length}
                    </span>
                    {activeChapter && (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        (Pages {activeChapter.start_page}–{activeChapter.end_page})
                      </span>
                    )}
                  </div>
                  <h3
                    style={{
                      fontSize: '1.12rem',
                      fontWeight: 700,
                      color: '#f8fafc',
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {activeChapter ? (activeChapter.full_title || activeChapter.title) : activePage.chapter}
                  </h3>
                </div>

                {/* Section Previous / Next Jump Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handlePrevChapter}
                    disabled={currentChapterIdx <= 0}
                    title="Jump to previous section"
                    style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                  >
                    <ChevronLeft size={14} />
                    <span>Prev Section</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleNextChapter}
                    disabled={currentChapterIdx >= scanResult.chapters.length - 1}
                    title="Jump to next section"
                    style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                  >
                    <span>Next Section</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Page Scrubber & Direct Page Jump Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '1rem',
                  padding: '8px 14px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                {/* Page Navigation Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    disabled={currentPageIdx === 0}
                    onClick={() => setCurrentPageIdx((p) => Math.max(0, p - 1))}
                    title="Previous page (Left Arrow key)"
                    aria-label="Previous page"
                    style={{ padding: '4px 8px', minWidth: '32px', height: '32px' }}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem' }}>
                    <span style={{ color: '#94a3b8' }}>Page</span>
                    <input
                      type="number"
                      min={1}
                      max={scanResult.total_pages}
                      value={currentPageIdx + 1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1 && val <= scanResult.total_pages) {
                          setCurrentPageIdx(val - 1);
                        }
                      }}
                      style={{
                        width: '54px',
                        padding: '3px 6px',
                        textAlign: 'center',
                        borderRadius: '4px',
                        background: '#0f172a',
                        border: '1px solid rgba(56, 189, 248, 0.4)',
                        color: '#38bdf8',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    />
                    <span style={{ color: '#94a3b8' }}>of {scanResult.total_pages}</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    disabled={currentPageIdx === scanResult.total_pages - 1}
                    onClick={() => setCurrentPageIdx((p) => Math.min(scanResult.total_pages - 1, p + 1))}
                    title="Next page (Right Arrow key)"
                    aria-label="Next page"
                    style={{ padding: '4px 8px', minWidth: '32px', height: '32px' }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Range Slider for Fast Scrubbing */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 180px', maxWidth: '300px' }}>
                  <input
                    type="range"
                    min={0}
                    max={scanResult.total_pages - 1}
                    value={currentPageIdx}
                    onChange={(e) => setCurrentPageIdx(Number(e.target.value))}
                    style={{
                      width: '100%',
                      cursor: 'pointer',
                      accentColor: '#38bdf8',
                    }}
                    title={`Scrub to page ${currentPageIdx + 1}`}
                  />
                </div>

                {/* Reader View Mode Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setViewMode('formatted')}
                    className={`btn btn-sm ${viewMode === 'formatted' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                    title="Read with formatted typography and structure"
                  >
                    <BookOpen size={13} />
                    <span>Formatted</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('raw')}
                    className={`btn btn-sm ${viewMode === 'raw' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                    title="View raw extracted text"
                  >
                    <AlignLeft size={13} />
                    <span>Raw Text</span>
                  </button>
                </div>
              </div>

              {/* Headings detected on this page */}
              {activePage.headings.length > 0 && (
                <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activePage.headings.map((h, i) => (
                    <span
                      key={i}
                      className="badge"
                      style={{
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        border: '1px solid rgba(56, 189, 248, 0.35)',
                        fontSize: '0.76rem',
                        padding: '3px 8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>📌</span>
                      <span>{h}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Page Content Display (Formatted Reader Mode vs Raw Text) */}
              {viewMode === 'formatted' ? (
                <div
                  style={{
                    background: 'rgba(11, 15, 25, 0.85)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    minHeight: '380px',
                    maxHeight: '520px',
                    overflowY: 'auto',
                    lineHeight: 1.8,
                    fontSize: '0.96rem',
                    color: '#f8fafc',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  {formattedParagraphs.map((item, idx) => {
                    if (item.type === 'heading') {
                      return (
                        <h4
                          key={idx}
                          style={{
                            fontSize: '1.15rem',
                            fontWeight: 800,
                            color: '#38bdf8',
                            margin: '1.25rem 0 0.5rem 0',
                            paddingLeft: '10px',
                            borderLeft: '3.5px solid #38bdf8',
                            lineHeight: 1.35,
                          }}
                        >
                          {item.content}
                        </h4>
                      );
                    }

                    if (item.type === 'bullet') {
                      return (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            gap: '8px',
                            margin: '0.4rem 0',
                            paddingLeft: '0.5rem',
                            color: '#e2e8f0',
                          }}
                        >
                          <span style={{ color: '#38bdf8', fontWeight: 800 }}>•</span>
                          <span>{item.content.replace(/^[-*•]\s+/, '')}</span>
                        </div>
                      );
                    }

                    if (item.type === 'formula') {
                      return (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(16, 185, 129, 0.08)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '6px',
                            padding: '8px 12px',
                            margin: '0.75rem 0',
                            fontFamily: 'monospace',
                            color: '#6ee7b7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>{item.content}</span>
                          <button
                            type="button"
                            onClick={() => handleSendMath(item.content)}
                            className="btn btn-outline btn-sm"
                            style={{
                              padding: '2px 8px',
                              fontSize: '0.72rem',
                              borderColor: '#10b981',
                              color: '#10b981',
                            }}
                          >
                            Solve <ArrowRight size={12} />
                          </button>
                        </div>
                      );
                    }

                    return (
                      <p
                        key={idx}
                        style={{
                          margin: '0.65rem 0',
                          color: '#f1f5f9',
                          textAlign: 'justify',
                        }}
                      >
                        {item.content}
                      </p>
                    );
                  })}
                </div>
              ) : (
                /* Raw Monospace Text View */
                <pre
                  style={{
                    background: '#090d16',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontFamily: 'Consolas, Monaco, monospace',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    whiteSpace: 'pre-wrap',
                    minHeight: '380px',
                    maxHeight: '520px',
                    overflowY: 'auto',
                    color: '#e2e8f0',
                    margin: 0,
                  }}
                >
                  {activePage.text}
                </pre>
              )}

              {/* Page Footer Navigation & Metrics */}
              <div
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                }}
              >
                <div>
                  <span>{activePage.word_count} words ({activePage.char_count} chars)</span>
                  <span style={{ margin: '0 8px' }}>•</span>
                  <span>Use ← / → keys to flip pages</span>
                </div>

                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(activePage.text);
                    showAlert({ type: 'info', title: 'Copied', message: 'Page text copied to clipboard.' });
                  }}
                  style={{ color: '#38bdf8' }}
                >
                  <Copy size={13} style={{ marginRight: '4px' }} />
                  <span>Copy Page Text</span>
                </button>
              </div>
            </div>

            {/* Column 2: Smart Intelligence Studio & Extraction Tools */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Interactive Actions Panel */}
              <div
                className="card"
                style={{
                  padding: '1.5rem',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  boxShadow: '0 10px 28px rgba(0, 0, 0, 0.4)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.15rem' }}>
                  <MarvelAvatar hero="ironman" size="xs" />
                  <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700, color: '#f8fafc' }}>
                    Interactive Intelligence Tools
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Action 1: Read Aloud */}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      padding: '10px 14px',
                      background: 'rgba(30, 41, 59, 0.7)',
                      borderColor: 'rgba(56, 189, 248, 0.25)',
                    }}
                    onClick={() => speakText(`Page ${activePage.page_number}. ${activePage.text}`)}
                  >
                    <Volume2 size={20} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
                        Read Page Aloud (TTS)
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Listen with synchronized speech voice
                      </div>
                    </div>
                  </button>

                  {/* Action 2: Convert Page to Flashcard */}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      padding: '10px 14px',
                      background: 'rgba(30, 41, 59, 0.7)',
                      borderColor: 'rgba(245, 158, 11, 0.25)',
                    }}
                    onClick={handleCreateFlashcardFromPage}
                  >
                    <Layers size={20} color="#F59E0B" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
                        Extract Page into Flashcard
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Saves key definitions directly to SM-2 spaced repetition deck
                      </div>
                    </div>
                  </button>

                  {/* Action 3: Ask AI Tutor */}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      padding: '10px 14px',
                      background: 'rgba(30, 41, 59, 0.7)',
                      borderColor: 'rgba(129, 140, 248, 0.25)',
                    }}
                    onClick={handleAskAITutor}
                  >
                    <HelpCircle size={20} color="#818CF8" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
                        Ask AI Tutor with Page Citation
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Deep question studio with verified RAG evidence
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Detected Mathematical Formulas */}
              {activePage.math_formulas && activePage.math_formulas.length > 0 && (
                <div
                  className="card"
                  style={{
                    padding: '1.25rem',
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                    <MarvelAvatar hero="cap" size="xs" />
                    <h3
                      style={{
                        fontSize: '0.98rem',
                        margin: 0,
                        fontWeight: 700,
                        color: '#34d399',
                      }}
                    >
                      Detected Equations ({activePage.math_formulas.length})
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {activePage.math_formulas.map((formula, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          padding: '0.55rem 0.75rem',
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.25)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        <code
                          style={{
                            fontSize: '0.85rem',
                            color: '#a7f3d0',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formula}
                        </code>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleSendMath(formula)}
                          style={{
                            padding: '3px 8px',
                            fontSize: '0.75rem',
                            borderColor: '#10B981',
                            color: '#10B981',
                            flexShrink: 0,
                          }}
                        >
                          Solve <ArrowRight size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes outlineFade {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
