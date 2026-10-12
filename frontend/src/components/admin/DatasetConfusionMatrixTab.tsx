import React, { useState, useMemo } from 'react';
import {
  Activity,
  Layers,
  Database,
  CheckCircle2,
  AlertTriangle,
  Search,
  Download,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Filter,
  Sliders,
  ExternalLink,
  HelpCircle,
  Cpu,
  BarChart2,
  FileSpreadsheet,
} from 'lucide-react';
import {
  DATASET_CLASSES,
  CONFUSION_MATRIX_COUNTS,
  SAMPLE_DATASET_RECORDS,
  calculateConfusionMetrics,
  classifyPromptLive,
  exportDatasetToCsv,
  type DatasetClassInfo,
  type DatasetRecordItem,
} from '../../services/datasetMatrixService';

export const DatasetConfusionMatrixTab: React.FC = () => {
  // Metric calculation
  const { classMetrics, overall } = useMemo(() => calculateConfusionMetrics(), []);

  // Display mode for matrix cells: raw counts or percentages
  const [matrixViewMode, setMatrixViewMode] = useState<'counts' | 'percentages'>('counts');

  // Selected cell filter in the confusion matrix [actualIndex, predictedIndex]
  const [selectedCellFilter, setSelectedCellFilter] = useState<{ actual: number; predicted: number } | null>(null);

  // Search & filters for Dataset Record Explorer
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [outcomeFilter, setOutcomeFilter] = useState<'all' | 'correct' | 'misclassified'>('all');
  const [minConfidence, setMinConfidence] = useState<number>(0.5);

  // Interactive Live Prompt Classifier state
  const [testInputText, setTestInputText] = useState("What is the relation between force, mass and acceleration in Newton's physics?");
  const [livePrediction, setLivePrediction] = useState<{
    predictedClass: DatasetClassInfo;
    confidence: number;
    tokens: number;
    reasoning: string;
  } | null>(() => classifyPromptLive("What is the relation between force, mass and acceleration in Newton's physics?"));

  // Quick preset test prompts
  const samplePrompts = [
    { label: 'Newton Physics', text: "Calculate the force needed to accelerate a 5kg mass at 3 m/s^2." },
    { label: 'Math Equation', text: "Solve the quadratic equation 2x^2 + 5x - 3 = 0." },
    { label: 'Indian Polity', text: "Which article of the Indian Constitution grants the Right to Equality?" },
    { label: 'Geography', text: "What is the longest river in Asia and which countries does it traverse?" },
    { label: 'History', text: "In which year did the Battle of Plassey take place and who commanded the forces?" },
    { label: 'General Knowledge', text: "Which nation won the highest number of medals at the 2024 Olympic Games?" },
  ];

  const handleRunLiveTest = () => {
    if (!testInputText.trim()) return;
    const res = classifyPromptLive(testInputText);
    setLivePrediction(res);
  };

  // Filter dataset records
  const filteredRecords = useMemo(() => {
    return SAMPLE_DATASET_RECORDS.filter((rec) => {
      // Matrix cell filter
      if (selectedCellFilter !== null) {
        const actualCls = DATASET_CLASSES[selectedCellFilter.actual]?.id;
        const predCls = DATASET_CLASSES[selectedCellFilter.predicted]?.id;
        if (rec.actualClass !== actualCls || rec.predictedClass !== predCls) {
          return false;
        }
      }

      // Category filter
      if (selectedCategoryFilter !== 'all' && rec.actualClass !== selectedCategoryFilter) {
        return false;
      }

      // Outcome filter
      if (outcomeFilter === 'correct' && !rec.isCorrect) return false;
      if (outcomeFilter === 'misclassified' && rec.isCorrect) return false;

      // Confidence slider
      if (rec.confidence < minConfidence) return false;

      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQ = rec.question.toLowerCase().includes(q);
        const matchesAns = rec.answer.toLowerCase().includes(q);
        const matchesSrc = rec.source.toLowerCase().includes(q);
        const matchesId = rec.id.toLowerCase().includes(q);
        if (!matchesQ && !matchesAns && !matchesSrc && !matchesId) return false;
      }

      return true;
    });
  }, [selectedCellFilter, selectedCategoryFilter, outcomeFilter, minConfidence, searchQuery]);

  // Max count in matrix for heatmap scaling
  const maxMatrixCount = useMemo(() => {
    let max = 1;
    CONFUSION_MATRIX_COUNTS.forEach((row) => {
      row.forEach((val) => {
        if (val > max) max = val;
      });
    });
    return max;
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. TOP HEADER & HUD STATUS */}
      <div
        style={{
          backgroundColor: '#0c1322',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '14px',
          padding: '1.5rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <BarChart2 size={13} />
              AI Model Evaluation Suite
            </span>
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              ● Validation Passed (96.4%)
            </span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: '0.5rem 0 0.25rem 0' }}>
            Dataset Inspection & Confusion Matrix
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, maxWidth: '680px' }}>
            Multi-class evaluation across 6 core academic domains. Inspect classification accuracy,
            off-diagonal misclassification clusters, and test records from the verified RAG fact repository.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Normalization Mode Switcher */}
          <div
            style={{
              backgroundColor: '#070b13',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '3px',
              display: 'inline-flex',
              gap: '2px',
            }}
          >
            <button
              type="button"
              id="matrix-toggle-counts"
              onClick={() => setMatrixViewMode('counts')}
              style={{
                backgroundColor: matrixViewMode === 'counts' ? '#38bdf8' : 'transparent',
                color: matrixViewMode === 'counts' ? '#040d1a' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Raw Counts (N)
            </button>
            <button
              type="button"
              id="matrix-toggle-percentages"
              onClick={() => setMatrixViewMode('percentages')}
              style={{
                backgroundColor: matrixViewMode === 'percentages' ? '#38bdf8' : 'transparent',
                color: matrixViewMode === 'percentages' ? '#040d1a' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Normalized (%)
            </button>
          </div>

          {/* Export Dataset Button */}
          <button
            type="button"
            id="export-dataset-csv-btn"
            onClick={() => exportDatasetToCsv(filteredRecords)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Download currently filtered dataset records as CSV"
          >
            <FileSpreadsheet size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. SUMMARY KPI STAT CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}
      >
        {/* Card 1: Total Dataset Records */}
        <div
          style={{
            backgroundColor: '#0c1322',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.25rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem' }}>
            <span>Total Dataset Corpus</span>
            <Database size={16} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.4rem', color: '#ffffff' }}>
            12,850 <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>records</span>
          </div>
          {/* Dataset split bar */}
          <div style={{ marginTop: '0.65rem' }}>
            <div
              style={{
                height: '6px',
                borderRadius: '9999px',
                display: 'flex',
                overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ width: '80%', backgroundColor: '#38bdf8' }} title="Train Split: 10,280 (80%)" />
              <div style={{ width: '10%', backgroundColor: '#a855f7' }} title="Val Split: 1,285 (10%)" />
              <div style={{ width: '10%', backgroundColor: '#10b981' }} title="Test Split: 1,285 (10%)" />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                color: '#94a3b8',
                marginTop: '4px',
              }}
            >
              <span>Train: 10.2k (80%)</span>
              <span>Val: 1.2k</span>
              <span>Test: 1.2k</span>
            </div>
          </div>
        </div>

        {/* Card 2: Overall Accuracy */}
        <div
          style={{
            backgroundColor: '#0c1322',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem' }}>
            <span>Overall Test Accuracy</span>
            <CheckCircle2 size={16} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.4rem', color: '#34d399' }}>
            {overall.overallAccuracy.toFixed(2)}%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            <strong style={{ color: '#ffffff' }}>{overall.totalCorrect}</strong> / {overall.totalSamples} correctly predicted
          </div>
        </div>

        {/* Card 3: Macro F1-Score */}
        <div
          style={{
            backgroundColor: '#0c1322',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            borderRadius: '12px',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem' }}>
            <span>Macro F1-Score</span>
            <Activity size={16} color="#c084fc" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.4rem', color: '#c084fc' }}>
            {overall.macroF1.toFixed(2)}%
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
            Precision: {overall.macroPrecision.toFixed(1)}% · Recall: {overall.macroRecall.toFixed(1)}%
          </div>
        </div>

        {/* Card 4: Misclassification Count */}
        <div
          style={{
            backgroundColor: '#0c1322',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '12px',
            padding: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.82rem' }}>
            <span>Confusion / Error Margin</span>
            <AlertTriangle size={16} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.4rem', color: '#fbbf24' }}>
            {overall.totalSamples - overall.totalCorrect}{' '}
            <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>samples</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#f59e0b', marginTop: '0.2rem' }}>
            Only {(100 - overall.overallAccuracy).toFixed(2)}% error rate across test queries
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE CONFUSION MATRIX GRID */}
      <div
        style={{
          backgroundColor: '#0c1322',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          padding: '1.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#38bdf8" />
              6×6 Multi-Class Confusion Matrix
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Rows represent the <strong>Ground Truth (Actual)</strong> class, and columns represent the <strong>Predicted</strong> class.
              Click any cell to filter the dataset records below.
            </p>
          </div>

          {selectedCellFilter && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#38bdf8',
              }}
            >
              <span>
                Filtered by cell: <strong>{DATASET_CLASSES[selectedCellFilter.actual]?.shortName}</strong> (Actual) →{' '}
                <strong>{DATASET_CLASSES[selectedCellFilter.predicted]?.shortName}</strong> (Predicted)
              </span>
              <button
                type="button"
                onClick={() => setSelectedCellFilter(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
                title="Clear filter"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Matrix Visualization Container */}
        <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <div style={{ minWidth: '760px' }}>
            {/* Predicted Label Header */}
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#38bdf8',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  padding: '3px 12px',
                  borderRadius: '9999px',
                }}
              >
                Predicted Domain (Columns) →
              </span>
            </div>

            {/* Matrix Table */}
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '6px' }}>
              <thead>
                <tr>
                  <th
                    style={{
                      width: '160px',
                      padding: '8px',
                      textAlign: 'left',
                      fontSize: '0.78rem',
                      color: '#64748b',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Actual Class ↓
                  </th>
                  {DATASET_CLASSES.map((cls) => (
                    <th
                      key={cls.id}
                      style={{
                        padding: '10px 8px',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: cls.color,
                        backgroundColor: '#070b13',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      {cls.shortName}
                    </th>
                  ))}
                  <th
                    style={{
                      width: '85px',
                      padding: '8px',
                      textAlign: 'center',
                      fontSize: '0.76rem',
                      color: '#94a3b8',
                      fontWeight: 700,
                    }}
                  >
                    Recall
                  </th>
                </tr>
              </thead>
              <tbody>
                {DATASET_CLASSES.map((actualCls, rowIdx) => {
                  const rowSum = CONFUSION_MATRIX_COUNTS[rowIdx].reduce((a, b) => a + b, 0);
                  const classRecall = rowSum > 0 ? (CONFUSION_MATRIX_COUNTS[rowIdx][rowIdx] / rowSum) * 100 : 0;

                  return (
                    <tr key={actualCls.id}>
                      {/* Actual Class Label Cell */}
                      <td
                        style={{
                          padding: '10px 12px',
                          backgroundColor: '#070b13',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              width: '9px',
                              height: '9px',
                              borderRadius: '50%',
                              backgroundColor: actualCls.color,
                            }}
                          />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                            {actualCls.shortName}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>
                          N = {rowSum} samples
                        </div>
                      </td>

                      {/* 6 Prediction Cells */}
                      {DATASET_CLASSES.map((predCls, colIdx) => {
                        const count = CONFUSION_MATRIX_COUNTS[rowIdx][colIdx];
                        const isDiagonal = rowIdx === colIdx;
                        const percentage = rowSum > 0 ? (count / rowSum) * 100 : 0;
                        const isSelected =
                          selectedCellFilter?.actual === rowIdx && selectedCellFilter?.predicted === colIdx;

                        // Heatmap styling calculation
                        let cellBg = '#070b13';
                        let cellBorder = 'rgba(255, 255, 255, 0.05)';
                        let textColor = '#64748b';

                        if (isDiagonal) {
                          // True positive: Rich Green / Cyan gradient
                          const intensity = Math.min(1, count / maxMatrixCount);
                          cellBg = `rgba(16, 185, 129, ${0.15 + intensity * 0.35})`;
                          cellBorder = `rgba(16, 185, 129, ${0.35 + intensity * 0.45})`;
                          textColor = '#34d399';
                        } else if (count > 0) {
                          // Confusion / Misclassification: Amber
                          cellBg = `rgba(245, 158, 11, ${0.1 + (count / 10) * 0.25})`;
                          cellBorder = `rgba(245, 158, 11, 0.3)`;
                          textColor = '#fbbf24';
                        }

                        if (isSelected) {
                          cellBorder = '2px solid #38bdf8';
                          cellBg = 'rgba(56, 189, 248, 0.3)';
                        }

                        return (
                          <td
                            key={predCls.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedCellFilter(null);
                              } else {
                                setSelectedCellFilter({ actual: rowIdx, predicted: colIdx });
                              }
                            }}
                            style={{
                              backgroundColor: cellBg,
                              border: isSelected ? '2px solid #38bdf8' : `1px solid ${cellBorder}`,
                              borderRadius: '8px',
                              padding: '12px 8px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                              boxShadow: isDiagonal ? 'inset 0 0 10px rgba(16, 185, 129, 0.1)' : 'none',
                            }}
                            title={`Actual: ${actualCls.name}\nPredicted: ${predCls.name}\nSamples: ${count} (${percentage.toFixed(1)}%)\nClick to filter dataset records`}
                          >
                            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: textColor }}>
                              {matrixViewMode === 'counts' ? count : `${percentage.toFixed(1)}%`}
                            </div>
                            <div style={{ fontSize: '0.66rem', color: isDiagonal ? '#10b981' : '#94a3b8', opacity: 0.85 }}>
                              {isDiagonal ? 'TP (Hit)' : count > 0 ? 'Error' : '0'}
                            </div>
                          </td>
                        );
                      })}

                      {/* Row Recall Metric */}
                      <td
                        style={{
                          backgroundColor: '#070b13',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          textAlign: 'center',
                          padding: '10px 6px',
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8' }}>
                          {classRecall.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Matrix Legend Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.78rem',
            color: '#94a3b8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '14px', height: '14px', backgroundColor: 'rgba(16, 185, 129, 0.4)', borderRadius: '4px', border: '1px solid #10b981' }} />
              <span>Diagonal = Correct Predictions (True Positives)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '14px', height: '14px', backgroundColor: 'rgba(245, 158, 11, 0.25)', borderRadius: '4px', border: '1px solid #f59e0b' }} />
              <span>Off-Diagonal = Misclassifications (Errors)</span>
            </div>
          </div>
          <div>
            Tip: Click on any matrix cell to isolate and inspect its exact dataset test records below.
          </div>
        </div>
      </div>

      {/* 4. PER-CLASS PERFORMANCE BENCHMARK REPORT */}
      <div
        style={{
          backgroundColor: '#0c1322',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          padding: '1.75rem',
        }}
      >
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 1rem 0' }}>
          Detailed Classification Report (Precision, Recall & F1-Score)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Domain Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Total Corpus</th>
                <th style={{ padding: '0.75rem 1rem' }}>Test Support</th>
                <th style={{ padding: '0.75rem 1rem' }}>Precision</th>
                <th style={{ padding: '0.75rem 1rem' }}>Recall</th>
                <th style={{ padding: '0.75rem 1rem' }}>F1-Score</th>
                <th style={{ padding: '0.75rem 1rem' }}>Evaluation Status</th>
              </tr>
            </thead>
            <tbody>
              {classMetrics.map((cm, idx) => {
                const clsInfo = DATASET_CLASSES[idx];
                return (
                  <tr
                    key={cm.classId}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      fontSize: '0.86rem',
                    }}
                  >
                    {/* Domain Category */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: clsInfo.color }} />
                        <span style={{ fontWeight: 700, color: '#f8fafc' }}>{clsInfo.name}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        {clsInfo.description}
                      </div>
                    </td>

                    {/* Total Corpus */}
                    <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>
                      {clsInfo.totalDatasetCount.toLocaleString()} items
                    </td>

                    {/* Test Support */}
                    <td style={{ padding: '0.85rem 1rem', color: '#f8fafc', fontWeight: 600 }}>
                      {cm.support} samples
                    </td>

                    {/* Precision */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#38bdf8' }}>{cm.precision.toFixed(1)}%</span>
                        <div style={{ width: '60px', height: '5px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ width: `${cm.precision}%`, height: '100%', backgroundColor: '#38bdf8' }} />
                        </div>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#64748b' }}>FP: {cm.falsePositives}</span>
                    </td>

                    {/* Recall */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#34d399' }}>{cm.recall.toFixed(1)}%</span>
                        <div style={{ width: '60px', height: '5px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ width: `${cm.recall}%`, height: '100%', backgroundColor: '#10b981' }} />
                        </div>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#64748b' }}>FN: {cm.falseNegatives}</span>
                    </td>

                    {/* F1-Score */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          color: cm.f1Score >= 95 ? '#34d399' : '#f59e0b',
                        }}
                      >
                        {cm.f1Score.toFixed(1)}%
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.12)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          color: '#34d399',
                          padding: '3px 9px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <CheckCircle2 size={12} />
                        Production Grade
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. INTERACTIVE LIVE INFERENCE / PROMPT CLASSIFICATION TESTER */}
      <div
        style={{
          backgroundColor: '#0c1322',
          border: '1px solid rgba(168, 85, 247, 0.25)',
          borderRadius: '14px',
          padding: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <Cpu size={20} color="#c084fc" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Live Query Inference & Category Routing Sandbox
          </h3>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 1.25rem 0' }}>
          Test any custom question or prompt in real-time to observe which category the model routes to,
          along with confidence probability and token telemetry.
        </p>

        {/* Input & Action */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            id="live-matrix-prompt-input"
            value={testInputText}
            onChange={(e) => setTestInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunLiveTest()}
            placeholder="Type any test query (e.g. 'What is the capital of Australia?', 'Explain Newton's third law')..."
            style={{
              flex: 1,
              minWidth: '280px',
              height: '44px',
              backgroundColor: '#070b13',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '0 14px',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />

          <button
            type="button"
            id="run-live-inference-btn"
            onClick={handleRunLiveTest}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#9333ea',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '0 18px',
              height: '44px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
          >
            <Sparkles size={16} />
            <span>Classify Query</span>
          </button>
        </div>

        {/* Quick Sample Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Quick Presets:</span>
          {samplePrompts.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => {
                setTestInputText(p.text);
                const res = classifyPromptLive(p.text);
                setLivePrediction(res);
              }}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                borderRadius: '6px',
                padding: '3px 9px',
                fontSize: '0.74rem',
                cursor: 'pointer',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Live Prediction Output HUD */}
        {livePrediction && (
          <div
            style={{
              marginTop: '1.25rem',
              backgroundColor: '#070b13',
              border: `1px solid ${livePrediction.predictedClass.color}40`,
              borderRadius: '10px',
              padding: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Predicted Routing Domain
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span
                  style={{
                    backgroundColor: livePrediction.predictedClass.accentBg,
                    color: livePrediction.predictedClass.color,
                    border: `1px solid ${livePrediction.predictedClass.color}60`,
                    padding: '4px 12px',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                  }}
                >
                  {livePrediction.predictedClass.name}
                </span>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  ({livePrediction.tokens} tokens parsed)
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                {livePrediction.reasoning}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Confidence Probability</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>
                {(livePrediction.confidence * 100).toFixed(1)}%
              </div>
              <div style={{ width: '120px', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden', marginTop: '4px' }}>
                <div style={{ width: `${livePrediction.confidence * 100}%`, height: '100%', backgroundColor: '#10b981' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. DATASET RECORDS INSPECTOR TABLE */}
      <div
        style={{
          backgroundColor: '#0c1322',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          padding: '1.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} color="#38bdf8" />
              Verified Dataset Explorer ({filteredRecords.length} Records)
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Direct inspection of ground truth questions, true labels, model predictions, confidence scores, and source citations.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Min Confidence: <strong>{(minConfidence * 100).toFixed(0)}%</strong>
            </span>
            <input
              type="range"
              min="0.5"
              max="0.99"
              step="0.01"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              style={{ width: '100px', cursor: 'pointer' }}
              title="Filter by model prediction confidence threshold"
            />
          </div>
        </div>

        {/* Filters Bar */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Search Bar */}
          <div
            style={{
              flex: 1,
              minWidth: '240px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#070b13',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '0 12px',
              gap: '8px',
            }}
          >
            <Search size={15} color="#64748b" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dataset questions, answers, or sources..."
              style={{
                width: '100%',
                height: '38px',
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            style={{
              height: '38px',
              backgroundColor: '#070b13',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '0 10px',
              color: '#ffffff',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Domains</option>
            {DATASET_CLASSES.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

          {/* Outcome Filter */}
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value as any)}
            style={{
              height: '38px',
              backgroundColor: '#070b13',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '0 10px',
              color: '#ffffff',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="all">All Outcomes</option>
            <option value="correct">✅ Correct Only (TP)</option>
            <option value="misclassified">⚠️ Misclassified Only</option>
          </select>

          {/* Reset Filters */}
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategoryFilter('all');
              setOutcomeFilter('all');
              setMinConfidence(0.5);
              setSelectedCellFilter(null);
            }}
            style={{
              height: '38px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              borderRadius: '8px',
              padding: '0 12px',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} />
            <span>Reset</span>
          </button>
        </div>

        {/* Dataset Table */}
        <div style={{ overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: '#070b13',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#94a3b8',
                  fontSize: '0.74rem',
                  textTransform: 'uppercase',
                }}
              >
                <th style={{ padding: '0.75rem 1rem', width: '110px' }}>Record ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Question / Prompt</th>
                <th style={{ padding: '0.75rem 1rem', width: '160px' }}>Actual Domain</th>
                <th style={{ padding: '0.75rem 1rem', width: '160px' }}>Predicted Domain</th>
                <th style={{ padding: '0.75rem 1rem', width: '110px' }}>Confidence</th>
                <th style={{ padding: '0.75rem 1rem', width: '140px' }}>Classification</th>
                <th style={{ padding: '0.75rem 1rem' }}>Verified Ground Truth & Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                    No dataset records match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((item) => {
                  const actualCls = DATASET_CLASSES.find((c) => c.id === item.actualClass);
                  const predCls = DATASET_CLASSES.find((c) => c.id === item.predictedClass);

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        backgroundColor: item.isCorrect ? 'transparent' : 'rgba(245, 158, 11, 0.04)',
                        fontSize: '0.84rem',
                      }}
                    >
                      {/* Record ID */}
                      <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: '#38bdf8', fontWeight: 600 }}>
                        {item.id}
                        <div style={{ fontSize: '0.68rem', color: '#64748b' }}>[{item.language.toUpperCase()}]</div>
                      </td>

                      {/* Question */}
                      <td style={{ padding: '0.85rem 1rem', color: '#f8fafc', fontWeight: 500, maxWidth: '280px' }}>
                        {item.question}
                      </td>

                      {/* Actual Domain */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            backgroundColor: actualCls?.accentBg || '#070b13',
                            color: actualCls?.color || '#94a3b8',
                            padding: '3px 8px',
                            borderRadius: '5px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          {actualCls?.shortName || item.actualClass}
                        </span>
                      </td>

                      {/* Predicted Domain */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            backgroundColor: predCls?.accentBg || '#070b13',
                            color: predCls?.color || '#94a3b8',
                            padding: '3px 8px',
                            borderRadius: '5px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          {predCls?.shortName || item.predictedClass}
                        </span>
                      </td>

                      {/* Confidence */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontWeight: 700, color: item.confidence > 0.9 ? '#34d399' : '#f59e0b' }}>
                          {(item.confidence * 100).toFixed(1)}%
                        </span>
                      </td>

                      {/* Classification Status */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {item.isCorrect ? (
                          <span
                            style={{
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              color: '#34d399',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <CheckCircle2 size={11} /> Correct (TP)
                          </span>
                        ) : (
                          <span
                            style={{
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              color: '#f87171',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <AlertTriangle size={11} /> Misclassified
                          </span>
                        )}
                      </td>

                      {/* Answer & Source */}
                      <td style={{ padding: '0.85rem 1rem', maxWidth: '320px' }}>
                        <div style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: '1.3' }}>
                          {item.answer}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.7rem', marginTop: '3px' }}>
                          Source: {item.source}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
