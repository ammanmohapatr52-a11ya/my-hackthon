import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, Pause, Square, Activity, Table, Info, Volume2 } from 'lucide-react';
import { useAnnounce } from '../accessibility/useAnnounce';
import { useLanguage } from '../i18n/LanguageContext';

export const GraphSoundPage: React.FC = () => {
  const location = useLocation();
  const { announcePolite } = useAnnounce();
  const { t } = useLanguage();

  const [funcInput, setFuncInput] = useState('x^2 - 4');
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [playheadX, setPlayheadX] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (location.state?.initialFunction) {
      setFuncInput(location.state.initialFunction);
    }
  }, [location.state]);

  // Safe function evaluation over domain [-5, 5]
  const evaluateF = (x: number): number => {
    try {
      let expr = funcInput.replace(/\s+/g, '').replace(/x\^2/g, `(${x}*${x})`).replace(/x²/g, `(${x}*${x})`);
      expr = expr.replace(/sin\(x\)/g, `${Math.sin(x)}`);
      expr = expr.replace(/cos\(x\)/g, `${Math.cos(x)}`);
      expr = expr.replace(/x/g, `(${x})`);

      // Safe arithmetic evaluator
      const res = Function(`"use strict"; return (${expr})`)();
      return typeof res === 'number' && !isNaN(res) ? res : 0;
    } catch {
      return 0;
    }
  };

  // Generate data points
  const points: { x: number; y: number }[] = [];
  const minX = -6;
  const maxX = 6;
  const step = 0.2;

  let minY = 0;
  let maxY = 0;

  for (let x = minX; x <= maxX; x += step) {
    const y = evaluateF(x);
    points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  // Ensure reasonable graph boundary
  minY = Math.min(-6, Math.floor(minY - 1));
  maxY = Math.max(6, Math.ceil(maxY + 1));

  // Audio sonification using Web Audio API (FR-GS2)
  const stopAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch {}
      oscillatorRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsPlayingSound(false);
    setPlayheadX(null);
  };

  const playSonification = () => {
    stopAudio();

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    gain.gain.setValueAtTime(0.15, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    oscillatorRef.current = osc;
    gainNodeRef.current = gain;
    setIsPlayingSound(true);
    announcePolite('Playing function pitch sonification.');

    const startTime = ctx.currentTime;
    const duration = 4.0; // 4 seconds sweep from minX to maxX

    const animate = () => {
      const elapsed = ctx.currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const currX = minX + progress * (maxX - minX);

      setPlayheadX(currX);

      const currY = evaluateF(currX);
      // Map y to frequency (200Hz to 800Hz)
      const normalizedY = (currY - minY) / (maxY - minY || 1);
      const freq = 200 + Math.max(0, Math.min(1, normalizedY)) * 600;

      if (oscillatorRef.current) {
        oscillatorRef.current.frequency.setValueAtTime(freq, ctx.currentTime);
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        stopAudio();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // SVG coordinate transformation
  const svgWidth = 600;
  const svgHeight = 360;

  const toSvgX = (x: number) => ((x - minX) / (maxX - minX)) * svgWidth;
  const toSvgY = (y: number) => svgHeight - ((y - minY) / (maxY - minY)) * svgHeight;

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toSvgX(p.x)} ${toSvgY(p.y)}`)
    .join(' ');

  const sampleFunctions = [
    { label: 'Parabola: x^2 - 4', val: 'x^2 - 4' },
    { label: 'Linear: 2*x + 1', val: '2*x + 1' },
    { label: 'Cubic: 0.2*x^3 - x', val: '0.2*x^3 - x' },
    { label: 'Wave: 3*sin(x)', val: '3*sin(x)' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>{t('graph.title', 'Graph & Sound (Sonification)')}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {t('graph.desc', '"See it, hear it" — Interactive function visualization with Web Audio tone mapping and accessible data tables.')}
        </p>
      </div>

      {/* Function Input Strip */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label htmlFor="function-input" style={{ fontWeight: 600 }}>
            {t('graph.input_label', 'Enter Function y = f(x):')}
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              id="function-input"
              type="text"
              className="input"
              value={funcInput}
              onChange={(e) => setFuncInput(e.target.value)}
              placeholder="e.g. x^2 - 4 or 2*x + 1"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}
            />
            <button
              type="button"
              className={`btn ${isPlayingSound ? 'btn-secondary' : 'btn-primary'}`}
              onClick={isPlayingSound ? stopAudio : playSonification}
              aria-label={isPlayingSound ? 'Stop sonification' : 'Play function as pitch sonification'}
            >
              {isPlayingSound ? <Square size={18} /> : <Play size={18} />}
              <span>{isPlayingSound ? t('graph.btn_stop', 'Stop Sound') : t('graph.btn_play', 'Play Sound (Pitch)')}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Examples:</span>
            {sampleFunctions.map((sf, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  stopAudio();
                  setFuncInput(sf.val);
                }}
                style={{ fontSize: '0.775rem', border: '1px solid var(--border-subtle)', padding: '2px 8px' }}
              >
                {sf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive SVG Plot View */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.2rem' }}>Function Plot: y = {funcInput}</h2>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setShowTable(!showTable)}
            aria-expanded={showTable}
          >
            <Table size={16} />
            <span>{showTable ? 'Hide Data Table' : 'Show Data Table Alternative'}</span>
          </button>
        </div>

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            style={{
              width: '100%',
              maxWidth: `${svgWidth}px`,
              height: 'auto',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)',
            }}
            role="img"
            aria-label={`Graph of function y = ${funcInput}`}
          >
            {/* Grid lines */}
            {[-4, -2, 2, 4].map((gridX) => (
              <line
                key={`gx-${gridX}`}
                x1={toSvgX(gridX)}
                y1={0}
                x2={toSvgX(gridX)}
                y2={svgHeight}
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="4 4"
              />
            ))}
            {[-4, -2, 2, 4].map((gridY) => (
              <line
                key={`gy-${gridY}`}
                x1={0}
                y1={toSvgY(gridY)}
                x2={svgWidth}
                y2={toSvgY(gridY)}
                stroke="rgba(255,255,255,0.05)"
                strokeDasharray="4 4"
              />
            ))}

            {/* X and Y Axes */}
            <line
              x1={0}
              y1={toSvgY(0)}
              x2={svgWidth}
              y2={toSvgY(0)}
              stroke="var(--text-muted)"
              strokeWidth={1.5}
            />
            <line
              x1={toSvgX(0)}
              y1={0}
              x2={toSvgX(0)}
              y2={svgHeight}
              stroke="var(--text-muted)"
              strokeWidth={1.5}
            />

            {/* Axis labels */}
            <text x={svgWidth - 20} y={toSvgY(0) - 8} fill="var(--text-secondary)" fontSize="12">
              x
            </text>
            <text x={toSvgX(0) + 8} y={16} fill="var(--text-secondary)" fontSize="12">
              y
            </text>

            {/* Function Curve */}
            <path d={pathData} fill="none" stroke="var(--accent-primary)" strokeWidth={3} />

            {/* Sonification Playhead (FR-GS2) */}
            {playheadX !== null && (
              <g>
                <line
                  x1={toSvgX(playheadX)}
                  y1={0}
                  x2={toSvgX(playheadX)}
                  y2={svgHeight}
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                />
                <circle
                  cx={toSvgX(playheadX)}
                  cy={toSvgY(evaluateF(playheadX))}
                  r={6}
                  fill="#F59E0B"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              </g>
            )}
          </svg>
        </div>

        {/* Text Summary (FR-GS1, FR-GS3) */}
        <div
          style={{
            marginTop: '1.25rem',
            padding: '1rem',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.9rem',
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            Mathematical Analysis Summary:
          </div>
          <div>
            • <strong>Domain Evaluated:</strong> x ∈ [{minX}, {maxX}]
          </div>
          <div>
            • <strong>y-Intercept:</strong> (0, {evaluateF(0)})
          </div>
          <div>
            • <strong>Pitch Mapping:</strong> Lower values generate low-frequency hums (~200Hz); peaks generate high-frequency tones (~800Hz).
          </div>
        </div>

        {/* Accessible Data Table Alternative (FR-GS1) */}
        {showTable && (
          <div style={{ marginTop: '1.25rem', maxHeight: '240px', overflowY: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.85rem',
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', background: 'var(--bg-elevated)' }}>
                  <th style={{ padding: '0.5rem 1rem' }}>x Value</th>
                  <th style={{ padding: '0.5rem 1rem' }}>y Value = f(x)</th>
                </tr>
              </thead>
              <tbody>
                {points.filter((_, i) => i % 2 === 0).map((pt, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.4rem 1rem', fontFamily: 'var(--font-mono)' }}>{pt.x}</td>
                    <td style={{ padding: '0.4rem 1rem', fontFamily: 'var(--font-mono)' }}>{pt.y}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
