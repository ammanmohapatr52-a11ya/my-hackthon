import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getHistoryItems,
  deleteHistoryItem,
  toggleFlagHistoryItem,
  clearAllHistory,
} from '../storage/historyStore';
import type { HistoryItem } from '../storage/db';
import { exportAllDataAsJSON, downloadJSONFile, importDataFromJSON, deleteAllLocalData } from '../storage/exportImport';
import { getSetting, setSetting } from '../storage/settingsStore';
import { Modal } from '../components/ui/Modal';
import { useVisualAlert } from '../accessibility/VisualAlert';
import { useAnnounce } from '../accessibility/useAnnounce';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Clock,
  Trash2,
  Download,
  Upload,
  Flag,
  Calculator,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { showAlert } = useVisualAlert();
  const { announcePolite } = useAnnounce();
  const { t } = useLanguage();

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [saveHistoryEnabled, setSaveHistoryEnabled] = useState(true);
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const loadHistory = async () => {
    try {
      const items = await getHistoryItems();
      const saveSetting = await getSetting<boolean>('saveHistory', true);
      setHistoryItems(items);
      setSaveHistoryEnabled(saveSetting);
    } catch (e) {
      console.warn('Failed to load history:', e);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleToggleSaveHistory = async () => {
    const nextVal = !saveHistoryEnabled;
    setSaveHistoryEnabled(nextVal);
    await setSetting('saveHistory', nextVal);
    announcePolite(`Save history set to ${nextVal ? 'enabled' : 'disabled'}.`);
  };

  const handleDeleteItem = async (id?: number) => {
    if (!id) return;
    await deleteHistoryItem(id);
    announcePolite('History item deleted.');
    await loadHistory();
  };

  const handleToggleFlag = async (item: HistoryItem) => {
    if (!item.id) return;
    await toggleFlagHistoryItem(item.id, item.flagged);
    await loadHistory();
  };

  const handleExport = async () => {
    const json = await exportAllDataAsJSON();
    downloadJSONFile(json, `neurobridge-learning-backup-${new Date().toISOString().split('T')[0]}.json`);
    showAlert({
      type: 'success',
      title: 'Data Exported',
      message: 'Downloaded encrypted JSON archive to your device.',
    });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const res = await importDataFromJSON(content);
      if (res.success) {
        showAlert({ type: 'success', title: 'Import Successful', message: res.message });
        await loadHistory();
      } else {
        showAlert({ type: 'error', title: 'Import Failed', message: res.message });
      }
    };
    reader.readAsText(file);
  };

  const handleWipeAll = async () => {
    await deleteAllLocalData();
    setIsWipeModalOpen(false);
    announcePolite('All local data wiped.');
    showAlert({
      type: 'info',
      title: 'Local Data Cleared',
      message: 'All history, flashcards, and settings were erased from this browser.',
    });
    await loadHistory();
  };

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
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>{t('history.title', 'My Learning History')}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {t('history.desc', 'Review past math problems, answers, and data control settings stored privately in your browser.')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleExport}>
            <Download size={16} />
            <span>Export JSON</span>
          </button>

          <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
            <Upload size={16} />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </label>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setIsWipeModalOpen(true)}
            style={{ color: 'var(--status-error)', borderColor: 'rgba(239, 68, 68, 0.4)' }}
          >
            <Trash2 size={16} />
            <span>{t('history.btn_clear', 'Delete All Data')}</span>
          </button>
        </div>
      </div>

      {/* Privacy Toggle Banner (FR-HIST2) */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={22} color="var(--accent-primary)" />
          <div>
            <div style={{ fontWeight: 600 }}>Save Activity History: {saveHistoryEnabled ? 'Enabled' : 'Disabled'}</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              When disabled, new math problems and questions will not be written to local storage.
            </div>
          </div>
        </div>

        <button
          type="button"
          className={`btn ${saveHistoryEnabled ? 'btn-secondary' : 'btn-primary'} btn-sm`}
          onClick={handleToggleSaveHistory}
        >
          {saveHistoryEnabled ? 'Turn Off History Recording' : 'Turn On History Recording'}
        </button>
      </div>

      {/* History Items List */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
          Recent Activity ({historyItems.length})
        </h2>

        {historyItems.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Clock size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.5 }} />
            <p>{t('history.empty', 'No activity recorded yet.')}</p>
            <p style={{ fontSize: '0.85rem' }}>
              Solve a math problem or ask a question to see your history appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {historyItems.map((item) => {
              const isMath = item.type === 'math';
              const dateStr = new Date(item.timestamp).toLocaleString();

              return (
                <div
                  key={item.id}
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
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        background: isMath ? 'rgba(56, 189, 248, 0.1)' : 'rgba(129, 140, 248, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isMath ? <Calculator size={18} color="var(--accent-primary)" /> : <HelpCircle size={18} color="var(--accent-secondary)" />}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span className="badge" style={{ fontSize: '0.7rem' }}>
                          {item.type.toUpperCase()}
                        </span>
                        {item.flagged && <span className="badge badge-warning">Flagged for Review</span>}
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{dateStr}</span>
                      </div>

                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {item.title}
                      </div>

                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: 'var(--text-secondary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginTop: '2px',
                        }}
                      >
                        Result: {item.output}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, marginLeft: '1rem' }}>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleToggleFlag(item)}
                      title={item.flagged ? 'Unflag' : 'Flag as incorrect'}
                      aria-label="Flag history item"
                    >
                      <Flag size={16} color={item.flagged ? 'var(--status-error)' : 'currentColor'} />
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        if (item.type === 'math') {
                          navigate('/solve', { state: { initialProblem: item.input } });
                        } else {
                          navigate('/ask', { state: { prefilledQuestion: item.input } });
                        }
                      }}
                      title="Reopen in solver"
                      aria-label="Reopen item"
                    >
                      <span>Review</span>
                      <ArrowRight size={14} />
                    </button>

                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Delete item"
                      aria-label="Delete history item"
                      style={{ color: 'var(--status-error)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete All Confirmation Modal (FR-HIST3) */}
      <Modal isOpen={isWipeModalOpen} onClose={() => setIsWipeModalOpen(false)} title="Delete All Local Data">
        <div style={{ padding: '0.5rem 0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: 'var(--status-error)',
              marginBottom: '1rem',
            }}
          >
            <AlertTriangle size={24} />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>This action cannot be undone</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            This will permanently delete all saved history, created flashcards, and preferences from your
            browser's IndexedDB storage.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setIsWipeModalOpen(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleWipeAll}
              style={{ background: 'var(--status-error)', borderColor: 'var(--status-error)' }}
            >
              Yes, Delete Everything
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
