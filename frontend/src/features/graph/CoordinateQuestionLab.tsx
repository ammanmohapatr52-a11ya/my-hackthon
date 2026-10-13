import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Play,
  Square,
  Volume2,
  Send,
  RotateCcw,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Compass,
  ArrowRight,
  Maximize2,
  Calculator,
} from 'lucide-react';
import { KaTeXMath } from '../../components/ui/KaTeXMath';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAnnounce } from '../../accessibility/useAnnounce';
import { useSpeechOutput } from '../../speech/useSpeechOutput';

export type QuestionMode = 'distance' | 'slope' | 'equation' | 'midpoint' | 'vector' | 'all';

export const CoordinateQuestionLab: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { announcePolite } = useAnnounce();
  const { speakText, stop: stopSpeech, isPlaying: isSpeaking } = useSpeechOutput();

  // Coordinates for Point A (x1, y1) and Point B (x2, y2)
  const [x1, setX1] = useState<number>(2);
  const [y1, setY1] = useState<number>(3);
  const [x2, setX2] = useState<number>(6);
  const [y2, setY2] = useState<number>(7);

  // Target point to update on graph click ('A' or 'B')
  const [activeClickTarget, setActiveClickTarget] = useState<'A' | 'B'>('B');

  // Active question type mode
  const [questionMode, setQuestionMode] = useState<QuestionMode>('distance');

  // Self-quiz practice state
  const [quizInput, setQuizInput] = useState<string>('');
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Audio tone sonification ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isSonifying, setIsSonifying] = useState(false);

  // Grid bounds: -10 to +10
  const minCoord = -10;
  const maxCoord = 10;
  const svgSize = 520;
  const padding = 40;
  const plotWidth = svgSize - padding * 2;
  const plotHeight = svgSize - padding * 2;

  // Convert Cartesian (x, y) to SVG (px, py)
  const toSvgX = useCallback(
    (x: number) => padding + ((x - minCoord) / (maxCoord - minCoord)) * plotWidth,
    [minCoord, maxCoord, padding, plotWidth]
  );
  const toSvgY = useCallback(
    (y: number) => padding + ((maxCoord - y) / (maxCoord - minCoord)) * plotHeight,
    [minCoord, maxCoord, padding, plotHeight]
  );

  // Convert SVG click (px, py) to nearest Cartesian coordinate
  const fromSvgCoords = useCallback(
    (px: number, py: number): { x: number; y: number } => {
      const clampedPx = Math.max(padding, Math.min(svgSize - padding, px));
      const clampedPy = Math.max(padding, Math.min(svgSize - padding, py));
      const cartX = minCoord + ((clampedPx - padding) / plotWidth) * (maxCoord - minCoord);
      const cartY = maxCoord - ((clampedPy - padding) / plotHeight) * (maxCoord - minCoord);
      return {
        x: Math.round(cartX),
        y: Math.round(cartY),
      };
    },
    [minCoord, maxCoord, padding, plotWidth, plotHeight, svgSize]
  );

  // Computed geometric values
  const deltaX = useMemo(() => x2 - x1, [x1, x2]);
  const deltaY = useMemo(() => y2 - y1, [y1, y2]);
  const distSq = useMemo(() => deltaX * deltaX + deltaY * deltaY, [deltaX, deltaY]);
  const distance = useMemo(() => Math.sqrt(distSq), [distSq]);
  const isVertical = deltaX === 0;
  const isHorizontal = deltaY === 0;

  const slope = useMemo(() => {
    if (isVertical) return null;
    return deltaY / deltaX;
  }, [deltaX, deltaY, isVertical]);

  const angleDeg = useMemo(() => {
    let rad = Math.atan2(deltaY, deltaX);
    let deg = (rad * 180) / Math.PI;
    if (deg < 0) deg += 180;
    return deg;
  }, [deltaX, deltaY]);

  const midpoint = useMemo(
    () => ({
      x: Number(((x1 + x2) / 2).toFixed(2)),
      y: Number(((y1 + y2) / 2).toFixed(2)),
    }),
    [x1, x2, y1, y2]
  );

  const getQuadrant = (x: number, y: number): string => {
    if (x === 0 && y === 0) return 'Origin (0,0)';
    if (x === 0) return 'Y-Axis';
    if (y === 0) return 'X-Axis';
    if (x > 0 && y > 0) return 'Quadrant I (+, +)';
    if (x < 0 && y > 0) return 'Quadrant II (−, +)';
    if (x < 0 && y < 0) return 'Quadrant III (−, −)';
    return 'Quadrant IV (+, −)';
  };

  const quadA = useMemo(() => getQuadrant(x1, y1), [x1, y1]);
  const quadB = useMemo(() => getQuadrant(x2, y2), [x2, y2]);

  // Line Equation String
  const lineEquation = useMemo(() => {
    if (isVertical) {
      return { slopeIntercept: `x = ${x1}`, standard: `x - ${x1} = 0` };
    }
    if (isHorizontal) {
      return { slopeIntercept: `y = ${y1}`, standard: `y - ${y1} = 0` };
    }
    const m = slope!;
    const c = y1 - m * x1;
    const mStr = Number.isInteger(m) ? `${m}` : `${m.toFixed(2)}`;
    const cStr = c >= 0 ? `+ ${c.toFixed(2)}` : `- ${Math.abs(c).toFixed(2)}`;
    const slopeIntercept = `y = ${mStr}x ${cStr}`;

    // Standard Form Ax + By + C = 0
    let A = deltaY;
    let B = -deltaX;
    let C = deltaX * y1 - deltaY * x1;
    if (A < 0) {
      A = -A;
      B = -B;
      C = -C;
    }
    const bSign = B >= 0 ? `+ ${B}` : `- ${Math.abs(B)}`;
    const cSign = C >= 0 ? `+ ${C}` : `- ${Math.abs(C)}`;
    const standard = `${A}x ${bSign}y ${cSign} = 0`;

    return { slopeIntercept, standard };
  }, [deltaX, deltaY, isHorizontal, isVertical, slope, x1, y1]);

  // Handle Graph SVG Click
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPx = ((e.clientX - rect.left) / rect.width) * svgSize;
    const clickPy = ((e.clientY - rect.top) / rect.height) * svgSize;
    const { x, y } = fromSvgCoords(clickPx, clickPy);

    if (activeClickTarget === 'A') {
      setX1(x);
      setY1(y);
      announcePolite(`Point A set to (${x}, ${y})`);
    } else {
      setX2(x);
      setY2(y);
      announcePolite(`Point B set to (${x}, ${y})`);
    }
    setQuizFeedback(null);
  };

  // Preset Configurations
  const applyPreset = (nx1: number, ny1: number, nx2: number, ny2: number) => {
    setX1(nx1);
    setY1(ny1);
    setX2(nx2);
    setY2(ny2);
    setQuizFeedback(null);
    announcePolite(`Applied preset coordinates A(${nx1}, ${ny1}) and B(${nx2}, ${ny2})`);
  };

  const randomizeCoordinates = () => {
    const rx1 = Math.floor(Math.random() * 17) - 8;
    const ry1 = Math.floor(Math.random() * 17) - 8;
    let rx2 = Math.floor(Math.random() * 17) - 8;
    let ry2 = Math.floor(Math.random() * 17) - 8;
    if (rx1 === rx2 && ry1 === ry2) rx2 += 3;
    setX1(rx1);
    setY1(ry1);
    setX2(rx2);
    setY2(ry2);
    setQuizFeedback(null);
    announcePolite(`Random coordinates generated: A(${rx1}, ${ry1}) and B(${rx2}, ${ry2})`);
  };

  // Dual-frequency coordinate Web Audio Sonification
  const sonifyCoordinates = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;
      setIsSonifying(true);

      // Map Y coordinates (-10 to 10) to frequencies (220Hz to 880Hz)
      const freqA = 220 + ((y1 + 10) / 20) * 440;
      const freqB = 220 + ((y2 + 10) / 20) * 440;

      const oscA = ctx.createOscillator();
      const oscB = ctx.createOscillator();
      const gain = ctx.createGain();

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

      oscA.frequency.setValueAtTime(freqA, ctx.currentTime);
      oscA.frequency.exponentialRampToValueAtTime(freqB, ctx.currentTime + 0.9);

      oscA.connect(gain);
      gain.connect(ctx.destination);

      oscA.start(ctx.currentTime);
      oscA.stop(ctx.currentTime + 1.8);

      setTimeout(() => {
        setIsSonifying(false);
      }, 1900);
    } catch {
      setIsSonifying(false);
    }
  };

  // Dynamically generated question strings
  const activeQuestionData = useMemo(() => {
    switch (questionMode) {
      case 'distance':
        return {
          title: 'Euclidean Distance (दूरी सूत्र)',
          question: `Find the distance between Point A(${x1}, ${y1}) and Point B(${x2}, ${y2}).`,
          mathKatex: `d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} = \\sqrt{(${x2} - (${x1}))^2 + (${y2} - (${y1}))^2} = \\sqrt{(${deltaX})^2 + (${deltaY})^2} = \\sqrt{${distSq}} \\approx ${distance.toFixed(3)}\\text{ units}`,
          speech: `Find the distance between Point A(${x1}, ${y1}) and Point B(${x2}, ${y2}). Distance is square root of ${distSq}, which is approximately ${distance.toFixed(2)} units.`,
          solvePrompt: `Find the distance between points A(${x1}, ${y1}) and B(${x2}, ${y2}) using the distance formula.`,
          correctAnswerNum: distance,
        };
      case 'slope':
        return {
          title: 'Slope & Angle of Inclination (ढाल व झुकाव कोण)',
          question: `Calculate the slope (m) and inclination angle (θ) of the line through A(${x1}, ${y1}) and B(${x2}, ${y2}).`,
          mathKatex: isVertical
            ? `m = \\frac{\\Delta y}{\\Delta x} = \\frac{${deltaY}}{0} \\implies \\text{Undefined (Vertical Line, } \\theta = 90^\\circ)`
            : `m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{${deltaY}}{${deltaX}} = ${slope!.toFixed(3)}, \\quad \\theta = \\arctan(m) = ${angleDeg.toFixed(1)}^\\circ`,
          speech: isVertical
            ? `The line passing through A(${x1}, ${y1}) and B(${x2}, ${y2}) is vertical with undefined slope and ninety degrees angle.`
            : `The slope is ${deltaY} divided by ${deltaX}, which equals ${slope!.toFixed(2)}. The angle of inclination is ${angleDeg.toFixed(1)} degrees.`,
          solvePrompt: `Calculate the slope and angle of inclination for the line segment joining (${x1}, ${y1}) and (${x2}, ${y2}).`,
          correctAnswerNum: slope ?? 0,
        };
      case 'equation':
        return {
          title: 'Linear Equation of Line (रेखा का समीकरण)',
          question: `Find the linear equation in slope-intercept form and standard form passing through A(${x1}, ${y1}) and B(${x2}, ${y2}).`,
          mathKatex: `\\text{Slope-Intercept: } ${lineEquation.slopeIntercept} \\qquad \\text{Standard Form: } ${lineEquation.standard}`,
          speech: `The linear equation of the line passing through points A(${x1}, ${y1}) and B(${x2}, ${y2}) is ${lineEquation.slopeIntercept}.`,
          solvePrompt: `Find the equation of the line passing through points (${x1}, ${y1}) and (${x2}, ${y2}) in slope-intercept and standard form.`,
          correctAnswerNum: slope ?? 0,
        };
      case 'midpoint':
        return {
          title: 'Midpoint Coordinates (मध्य बिंदु)',
          question: `Find the midpoint M of the line segment connecting A(${x1}, ${y1}) and B(${x2}, ${y2}).`,
          mathKatex: `M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right) = \\left(\\frac{${x1} + (${x2})}{2}, \\frac{${y1} + (${y2})}{2}\\right) = (${midpoint.x}, ${midpoint.y})`,
          speech: `The midpoint between point A(${x1}, ${y1}) and point B(${x2}, ${y2}) is at x equals ${midpoint.x} and y equals ${midpoint.y}.`,
          solvePrompt: `Find the midpoint between points A(${x1}, ${y1}) and B(${x2}, ${y2}).`,
          correctAnswerNum: midpoint.x,
        };
      case 'vector':
        return {
          title: 'Displacement Vector & Quadrants (सदिश व चतुर्थांश)',
          question: `Determine the quadrants of points A and B, and express the displacement vector \\vec{AB} in unit-vector form.`,
          mathKatex: `\\vec{AB} = (${deltaX})\\hat{i} + (${deltaY})\\hat{j}, \\quad |\\vec{AB}| = ${distance.toFixed(3)}, \\quad A \\in \\text{${quadA}}, \\quad B \\in \\text{${quadB}}`,
          speech: `Vector AB is ${deltaX} i hat plus ${deltaY} j hat. Point A is in ${quadA}, and Point B is in ${quadB}.`,
          solvePrompt: `Find the vector AB from (${x1}, ${y1}) to (${x2}, ${y2}) with magnitude and quadrant positions.`,
          correctAnswerNum: distance,
        };
      default:
        return {
          title: 'Full Coordinate Geometry Breakdown (सम्पूर्ण विश्लेषण)',
          question: `Analyze the geometry of segment AB between A(${x1}, ${y1}) and B(${x2}, ${y2}).`,
          mathKatex: `d = ${distance.toFixed(3)}, \\quad m = ${isVertical ? '\\infty' : slope!.toFixed(2)}, \\quad M = (${midpoint.x}, ${midpoint.y}), \\quad \\text{Eq: } ${lineEquation.slopeIntercept}`,
          speech: `Between Point A(${x1}, ${y1}) and Point B(${x2}, ${y2}), the distance is ${distance.toFixed(2)} units and the midpoint is (${midpoint.x}, ${midpoint.y}).`,
          solvePrompt: `Provide complete coordinate geometry analysis for points A(${x1}, ${y1}) and B(${x2}, ${y2}) including distance, slope, equation, and midpoint.`,
          correctAnswerNum: distance,
        };
    }
  }, [questionMode, x1, y1, x2, y2, deltaX, deltaY, distSq, distance, isVertical, slope, angleDeg, lineEquation, midpoint, quadA, quadB]);

  // Handle Send to AI Math Solver
  const handleSendToSolver = () => {
    navigate('/solve', {
      state: {
        initialProblem: activeQuestionData.solvePrompt,
      },
    });
  };

  // Voice Readout toggle
  const handleVoiceToggle = () => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      speakText(activeQuestionData.speech);
    }
  };

  // Check user answer in Quiz Mode
  const handleVerifyQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(quizInput.trim());
    if (isNaN(val)) {
      setQuizFeedback({ isCorrect: false, message: 'Please enter a valid numeric value.' });
      return;
    }

    const expected = activeQuestionData.correctAnswerNum;
    const diff = Math.abs(val - expected);
    const tolerance = 0.05;

    if (diff <= tolerance) {
      setQuizFeedback({
        isCorrect: true,
        message: `🎉 Excellent! Your answer ${val} is correct! (Exact value: ${expected.toFixed(2)})`,
      });
      announcePolite('Correct answer!');
    } else {
      setQuizFeedback({
        isCorrect: false,
        message: `Not quite! You entered ${val}, but the correct value is ${expected.toFixed(2)}. Check the formula steps above!`,
      });
      announcePolite('Incorrect answer. Check the formula steps.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner & Mode Description */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(129, 140, 248, 0.12) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: 'var(--radius-lg, 14px)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: 'var(--accent-primary)',
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              REAL-TIME SYNC
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Interactive (X, Y) Coordinate & Dynamic Question Lab
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Enter or slide coordinates for Point A and B — the Cartesian graph, math formulas, and question statement
            automatically re-generate instantly!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleSendToSolver}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Send size={15} />
            <span>Send to AI Solver</span>
          </button>
          <button
            type="button"
            className={`btn ${isSpeaking ? 'btn-secondary' : 'btn-outline'} btn-sm`}
            onClick={handleVoiceToggle}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Volume2 size={15} />
            <span>{isSpeaking ? 'Stop Voice' : 'Read Aloud'}</span>
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={sonifyCoordinates}
            disabled={isSonifying}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Activity size={15} color="#10B981" />
            <span>{isSonifying ? 'Beeping...' : 'Play Tone'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Controls & Graph | Right Dynamic Question */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* Left Column: Coordinates Inputs & Interactive Cartesian Graph */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Compass size={18} color="var(--accent-primary)" />
              Coordinate Inputs (X, Y)
            </h3>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={randomizeCoordinates}
              style={{ fontSize: '0.8rem', padding: '2px 8px' }}
              title="Generate random points"
            >
              <RotateCcw size={14} style={{ marginRight: '4px' }} />
              Random
            </button>
          </div>

          {/* Coordinate Inputs for Point A and Point B */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              background: 'var(--bg-elevated)',
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {/* Point A Controls */}
            <div
              style={{
                borderLeft: '4px solid #06B6D4',
                paddingLeft: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#06B6D4', fontSize: '0.95rem' }}>
                  Point A ({x1}, {y1})
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{quadA}</span>
              </div>

              {/* X1 Input & Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <label htmlFor="input-x1">X₁ Coordinate:</label>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{x1}</strong>
                </div>
                <input
                  id="input-x1"
                  type="range"
                  min={minCoord}
                  max={maxCoord}
                  step={1}
                  value={x1}
                  onChange={(e) => {
                    setX1(Number(e.target.value));
                    setQuizFeedback(null);
                  }}
                  style={{ width: '100%', accentColor: '#06B6D4' }}
                />
              </div>

              {/* Y1 Input & Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <label htmlFor="input-y1">Y₁ Coordinate:</label>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{y1}</strong>
                </div>
                <input
                  id="input-y1"
                  type="range"
                  min={minCoord}
                  max={maxCoord}
                  step={1}
                  value={y1}
                  onChange={(e) => {
                    setY1(Number(e.target.value));
                    setQuizFeedback(null);
                  }}
                  style={{ width: '100%', accentColor: '#06B6D4' }}
                />
              </div>
            </div>

            {/* Point B Controls */}
            <div
              style={{
                borderLeft: '4px solid #F59E0B',
                paddingLeft: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#F59E0B', fontSize: '0.95rem' }}>
                  Point B ({x2}, {y2})
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{quadB}</span>
              </div>

              {/* X2 Input & Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <label htmlFor="input-x2">X₂ Coordinate:</label>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{x2}</strong>
                </div>
                <input
                  id="input-x2"
                  type="range"
                  min={minCoord}
                  max={maxCoord}
                  step={1}
                  value={x2}
                  onChange={(e) => {
                    setX2(Number(e.target.value));
                    setQuizFeedback(null);
                  }}
                  style={{ width: '100%', accentColor: '#F59E0B' }}
                />
              </div>

              {/* Y2 Input & Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <label htmlFor="input-y2">Y₂ Coordinate:</label>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{y2}</strong>
                </div>
                <input
                  id="input-y2"
                  type="range"
                  min={minCoord}
                  max={maxCoord}
                  step={1}
                  value={y2}
                  onChange={(e) => {
                    setY2(Number(e.target.value));
                    setQuizFeedback(null);
                  }}
                  style={{ width: '100%', accentColor: '#F59E0B' }}
                />
              </div>
            </div>
          </div>

          {/* Quick Presets Strip */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Presets:</span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', padding: '2px 6px', border: '1px solid var(--border-subtle)' }}
              onClick={() => applyPreset(0, 0, 3, 4)}
            >
              Pythagorean (3, 4)
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', padding: '2px 6px', border: '1px solid var(--border-subtle)' }}
              onClick={() => applyPreset(-4, 5, 6, -3)}
            >
              Opposite Quadrants
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', padding: '2px 6px', border: '1px solid var(--border-subtle)' }}
              onClick={() => applyPreset(-6, 3, 6, 3)}
            >
              Horizontal (m=0)
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', padding: '2px 6px', border: '1px solid var(--border-subtle)' }}
              onClick={() => applyPreset(3, -6, 3, 6)}
            >
              Vertical (m=∞)
            </button>
          </div>

          {/* Graph Click Target Switcher */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              background: 'rgba(255,255,255,0.03)',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <span>💡 Click anywhere on graph to move:</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                className={`btn btn-sm ${activeClickTarget === 'A' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '2px 8px', fontSize: '0.75rem', height: '24px' }}
                onClick={() => setActiveClickTarget('A')}
              >
                Point A
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeClickTarget === 'B' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '2px 8px', fontSize: '0.75rem', height: '24px' }}
                onClick={() => setActiveClickTarget('B')}
              >
                Point B
              </button>
            </div>
          </div>

          {/* Interactive SVG Cartesian Coordinate Graph */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
              overflow: 'hidden',
              userSelect: 'none',
              cursor: 'crosshair',
            }}
          >
            <svg
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              onClick={handleSvgClick}
              role="img"
              aria-label={`Cartesian plane showing Point A at (${x1}, ${y1}) and Point B at (${x2}, ${y2})`}
            >
              {/* Background Quadrant Labels */}
              <text x={svgSize - padding - 40} y={padding + 30} fill="rgba(255,255,255,0.08)" fontSize="20" fontWeight="bold">
                Q I
              </text>
              <text x={padding + 20} y={padding + 30} fill="rgba(255,255,255,0.08)" fontSize="20" fontWeight="bold">
                Q II
              </text>
              <text x={padding + 20} y={svgSize - padding - 20} fill="rgba(255,255,255,0.08)" fontSize="20" fontWeight="bold">
                Q III
              </text>
              <text x={svgSize - padding - 45} y={svgSize - padding - 20} fill="rgba(255,255,255,0.08)" fontSize="20" fontWeight="bold">
                Q IV
              </text>

              {/* Minor Grid Lines (-10 to +10) */}
              {Array.from({ length: 21 }, (_, i) => i - 10).map((coord) => (
                <React.Fragment key={`grid-${coord}`}>
                  {/* Vertical */}
                  <line
                    x1={toSvgX(coord)}
                    y1={padding}
                    x2={toSvgX(coord)}
                    y2={svgSize - padding}
                    stroke={coord === 0 ? 'transparent' : coord % 5 === 0 ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.04)'}
                    strokeWidth={coord % 5 === 0 ? 1 : 0.5}
                    strokeDasharray={coord % 5 === 0 ? undefined : '2 2'}
                  />
                  {/* Horizontal */}
                  <line
                    x1={padding}
                    y1={toSvgY(coord)}
                    x2={svgSize - padding}
                    y2={toSvgY(coord)}
                    stroke={coord === 0 ? 'transparent' : coord % 5 === 0 ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.04)'}
                    strokeWidth={coord % 5 === 0 ? 1 : 0.5}
                    strokeDasharray={coord % 5 === 0 ? undefined : '2 2'}
                  />
                </React.Fragment>
              ))}

              {/* Major Axes: X-Axis and Y-Axis */}
              <line
                x1={padding}
                y1={toSvgY(0)}
                x2={svgSize - padding}
                y2={toSvgY(0)}
                stroke="var(--text-secondary, #94A3B8)"
                strokeWidth={2}
              />
              <line
                x1={toSvgX(0)}
                y1={padding}
                x2={toSvgX(0)}
                y2={svgSize - padding}
                stroke="var(--text-secondary, #94A3B8)"
                strokeWidth={2}
              />

              {/* Major Axis Arrowheads & Labels */}
              <text x={svgSize - padding + 8} y={toSvgY(0) + 4} fill="var(--text-secondary)" fontSize="13" fontWeight="bold">
                +X
              </text>
              <text x={padding - 26} y={toSvgY(0) + 4} fill="var(--text-muted)" fontSize="11">
                −X
              </text>
              <text x={toSvgX(0) - 10} y={padding - 10} fill="var(--text-secondary)" fontSize="13" fontWeight="bold">
                +Y
              </text>
              <text x={toSvgX(0) - 10} y={svgSize - padding + 20} fill="var(--text-muted)" fontSize="11">
                −Y
              </text>

              {/* Tick Labels on Axes (-8, -4, 4, 8) */}
              {[-8, -4, 4, 8].map((val) => (
                <React.Fragment key={`tick-${val}`}>
                  <text
                    x={toSvgX(val)}
                    y={toSvgY(0) + 14}
                    fill="var(--text-muted)"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {val}
                  </text>
                  <text
                    x={toSvgX(0) - 8}
                    y={toSvgY(val) + 3}
                    fill="var(--text-muted)"
                    fontSize="10"
                    textAnchor="end"
                  >
                    {val}
                  </text>
                </React.Fragment>
              ))}

              {/* Origin (0,0) */}
              <circle cx={toSvgX(0)} cy={toSvgY(0)} r={3} fill="var(--text-muted)" />
              <text x={toSvgX(0) - 12} y={toSvgY(0) + 14} fill="var(--text-muted)" fontSize="9">
                O(0,0)
              </text>

              {/* Right Triangle Delta Projections (Run & Rise) */}
              {x1 !== x2 && y1 !== y2 && (
                <g>
                  {/* Delta X (horizontal base): (x1, y1) to (x2, y1) */}
                  <line
                    x1={toSvgX(x1)}
                    y1={toSvgY(y1)}
                    x2={toSvgX(x2)}
                    y2={toSvgY(y1)}
                    stroke="#06B6D4"
                    strokeWidth={1.75}
                    strokeDasharray="4 4"
                  />
                  {/* Delta Y (vertical rise): (x2, y1) to (x2, y2) */}
                  <line
                    x1={toSvgX(x2)}
                    y1={toSvgY(y1)}
                    x2={toSvgX(x2)}
                    y2={toSvgY(y2)}
                    stroke="#F59E0B"
                    strokeWidth={1.75}
                    strokeDasharray="4 4"
                  />
                  {/* Right angle marker corner */}
                  <rect
                    x={x2 > x1 ? toSvgX(x2) - 12 : toSvgX(x2)}
                    y={y2 > y1 ? toSvgY(y1) - 12 : toSvgY(y1)}
                    width={12}
                    height={12}
                    fill="none"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth={1}
                  />
                  {/* Δx label */}
                  <text
                    x={(toSvgX(x1) + toSvgX(x2)) / 2}
                    y={toSvgY(y1) + (y2 >= y1 ? 18 : -8)}
                    fill="#06B6D4"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    Δx = {Math.abs(deltaX)}
                  </text>
                  {/* Δy label */}
                  <text
                    x={toSvgX(x2) + (x2 >= x1 ? 10 : -10)}
                    y={(toSvgY(y1) + toSvgY(y2)) / 2}
                    fill="#F59E0B"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor={x2 >= x1 ? 'start' : 'end'}
                  >
                    Δy = {Math.abs(deltaY)}
                  </text>
                </g>
              )}

              {/* Connecting Line Segment AB */}
              <line
                x1={toSvgX(x1)}
                y1={toSvgY(y1)}
                x2={toSvgX(x2)}
                y2={toSvgY(y2)}
                stroke="var(--accent-primary, #38BDF8)"
                strokeWidth={3.5}
                strokeLinecap="round"
              />

              {/* Midpoint M */}
              <circle
                cx={toSvgX(midpoint.x)}
                cy={toSvgY(midpoint.y)}
                r={5.5}
                fill="#10B981"
                stroke="#FFFFFF"
                strokeWidth={1.5}
              />
              <text
                x={toSvgX(midpoint.x) + 8}
                y={toSvgY(midpoint.y) - 8}
                fill="#10B981"
                fontSize="11"
                fontWeight="bold"
              >
                M({midpoint.x}, {midpoint.y})
              </text>

              {/* Point A Node & Coordinates Label */}
              <circle
                cx={toSvgX(x1)}
                cy={toSvgY(y1)}
                r={12}
                fill="rgba(6, 182, 212, 0.25)"
              />
              <circle
                cx={toSvgX(x1)}
                cy={toSvgY(y1)}
                r={7}
                fill="#06B6D4"
                stroke="#FFFFFF"
                strokeWidth={2}
              />
              <text
                x={toSvgX(x1)}
                y={toSvgY(y1) - 14}
                fill="#06B6D4"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
              >
                A({x1}, {y1})
              </text>

              {/* Point B Node & Coordinates Label */}
              <circle
                cx={toSvgX(x2)}
                cy={toSvgY(y2)}
                r={12}
                fill="rgba(245, 158, 11, 0.25)"
              />
              <circle
                cx={toSvgX(x2)}
                cy={toSvgY(y2)}
                r={7}
                fill="#F59E0B"
                stroke="#FFFFFF"
                strokeWidth={2}
              />
              <text
                x={toSvgX(x2)}
                y={toSvgY(y2) - 14}
                fill="#F59E0B"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}
              >
                B({x2}, {y2})
              </text>
            </svg>
          </div>

          {/* Quick Legend */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#06B6D4' }} />
              Point A: ({x1}, {y1})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
              Point B: ({x2}, {y2})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
              Midpoint M: ({midpoint.x}, {midpoint.y})
            </span>
          </div>
        </div>

        {/* Right Column: Dynamic Auto-Updating Question & Derivation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Question Mode Tabs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
              background: 'var(--bg-elevated)',
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {[
              { id: 'distance', label: '1. Distance (दूरी)' },
              { id: 'slope', label: '2. Slope (ढाल/प्रवणता)' },
              { id: 'equation', label: '3. Line Eq (समीकरण)' },
              { id: 'midpoint', label: '4. Midpoint (मध्यबिंदु)' },
              { id: 'vector', label: '5. Vector (सदिश)' },
              { id: 'all', label: '6. All In One (सम्पूर्ण)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`btn btn-sm ${questionMode === tab.id ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '0.78rem', padding: '4px 10px', borderRadius: 'var(--radius-sm)' }}
                onClick={() => {
                  setQuestionMode(tab.id as QuestionMode);
                  setQuizFeedback(null);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Dynamic Question Card */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              position: 'relative',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--accent-primary)" />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--accent-primary)',
                    letterSpacing: '0.05em',
                  }}
                >
                  DYNAMIC GENERATED QUESTION:
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                }}
              >
                {activeQuestionData.title}
              </span>
            </div>

            {/* Generated Question Statement */}
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.5,
                marginBottom: '1rem',
              }}
            >
              {activeQuestionData.question}
            </h3>

            {/* KaTeX Step-by-Step Mathematical Solution */}
            <div
              style={{
                background: 'var(--bg-elevated)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                overflowX: 'auto',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  marginBottom: '0.5rem',
                }}
              >
                Mathematical Derivation & Steps:
              </div>
              <KaTeXMath math={activeQuestionData.mathKatex} block />
            </div>

            {/* Coordinate Facts Table */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.75rem',
                fontSize: '0.82rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)' }}>Δx (Run):</div>
                <strong style={{ fontFamily: 'var(--font-mono)', color: '#06B6D4' }}>{deltaX}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)' }}>Δy (Rise):</div>
                <strong style={{ fontFamily: 'var(--font-mono)', color: '#F59E0B' }}>{deltaY}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)' }}>Slope (m):</div>
                <strong style={{ fontFamily: 'var(--font-mono)' }}>{isVertical ? 'Undefined' : slope!.toFixed(2)}</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)' }}>Distance:</div>
                <strong style={{ fontFamily: 'var(--font-mono)', color: '#10B981' }}>{distance.toFixed(3)} u</strong>
              </div>
            </div>

            {/* Actions: Send to SolveMathPage & Voice Readout */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSendToSolver}
                style={{ flex: 1, minWidth: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                <Calculator size={16} />
                <span>Open in Step-by-Step Solver</span>
              </button>
              <button
                type="button"
                className={`btn ${isSpeaking ? 'btn-secondary' : 'btn-outline'}`}
                onClick={handleVoiceToggle}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Volume2 size={16} />
                <span>{isSpeaking ? 'Pause Voice' : 'Hear Solution'}</span>
              </button>
            </div>
          </div>

          {/* Practice / Quiz Yourself Card */}
          <div className="card" style={{ padding: '1.25rem', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <HelpCircle size={18} color="#F59E0B" />
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
                Test Yourself (खुद हल करके चेक करें)
              </h4>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              {questionMode === 'distance'
                ? `What is the distance between A(${x1}, ${y1}) and B(${x2}, ${y2})? (Round to 2 decimal places)`
                : questionMode === 'slope'
                ? `What is the slope (m) of segment AB? (Round to 2 decimals)`
                : `Enter the calculated answer for this coordinate pair:`}
            </p>

            <form onSubmit={handleVerifyQuiz} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="number"
                step="0.01"
                className="input"
                value={quizInput}
                onChange={(e) => setQuizInput(e.target.value)}
                placeholder="e.g. 5.00"
                style={{ maxWidth: '160px', fontFamily: 'var(--font-mono)' }}
              />
              <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '8px 14px' }}>
                Verify Answer
              </button>
              {quizInput && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setQuizInput('');
                    setQuizFeedback(null);
                  }}
                >
                  Clear
                </button>
              )}
            </form>

            {quizFeedback && (
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: quizFeedback.isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${quizFeedback.isCorrect ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                  color: quizFeedback.isCorrect ? '#34D399' : '#F87171',
                }}
              >
                {quizFeedback.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span>{quizFeedback.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
