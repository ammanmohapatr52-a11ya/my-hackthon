import React, { useState, useEffect } from 'react';
import { checkOllamaHealth, type OllamaHealthResult } from '../../ollama/status';
import { getSetting, setSetting } from '../../storage/settingsStore';
import { CheckCircle2, AlertCircle, RefreshCw, Cpu, ExternalLink } from 'lucide-react';

interface OllamaStatusPanelProps {
  onModelChange?: (model: string) => void;
}

export const OllamaStatusPanel: React.FC<OllamaStatusPanelProps> = ({ onModelChange }) => {
  const [health, setHealth] = useState<OllamaHealthResult>({
    status: 'checking',
    models: [],
    message: 'Probing local Ollama instance...',
  });
  const [selectedModel, setSelectedModel] = useState('');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkStatus = async () => {
    setIsRefreshing(true);
    try {
      const url = await getSetting<string>('ollamaUrl', 'http://localhost:11434');
      setOllamaUrl(url);
      const res = await checkOllamaHealth(url);
      setHealth(res);

      if (res.models.length > 0) {
        const storedModel = await getSetting<string>('selectedModel', '');
        const active = res.models.includes(storedModel) ? storedModel : res.models[0];
        setSelectedModel(active);
        if (onModelChange) onModelChange(active);
      }
    } catch {
      setHealth({
        status: 'unreachable',
        models: [],
        message: 'Could not connect to Ollama runtime.',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleModelSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = e.target.value;
    setSelectedModel(model);
    await setSetting('selectedModel', model);
    if (onModelChange) onModelChange(model);
  };

  const isConnected = health.status === 'connected';

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        marginBottom: '1.5rem',
        borderLeft: `4px solid ${isConnected ? 'var(--status-success)' : 'var(--status-warning)'}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: isConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cpu size={20} color={isConnected ? 'var(--status-success)' : 'var(--status-warning)'} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Local Ollama AI Runtime</span>
              <span
                className={`badge ${isConnected ? 'badge-success' : 'badge-warning'}`}
                style={{ fontSize: '0.7rem' }}
              >
                {health.status}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Endpoint: <code style={{ color: 'var(--accent-primary)' }}>{ollamaUrl}</code> ·{' '}
              {health.message}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isConnected && health.models.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label htmlFor="model-select" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Model:
              </label>
              <select
                id="model-select"
                value={selectedModel}
                onChange={handleModelSelect}
                className="select"
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.85rem',
                  width: 'auto',
                }}
              >
                {health.models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={checkStatus}
            disabled={isRefreshing}
            aria-label="Refresh Ollama connection status"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Check</span>
          </button>
        </div>
      </div>

      {!isConnected && (
        <div
          style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            Quick Setup Guide (Local-first):
          </div>
          <div>
            1. Install and start Ollama from{' '}
            <a href="https://ollama.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
              ollama.com
            </a>
          </div>
          <div>
            2. Pull a model in terminal:{' '}
            <code style={{ background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px' }}>
              ollama pull llama3
            </code>{' '}
            or{' '}
            <code style={{ background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px' }}>
              ollama pull qwen2.5:3b
            </code>
          </div>
          <div style={{ color: 'var(--accent-primary)', fontStyle: 'italic' }}>
            * Note: When Ollama is offline, our built-in academic demo simulator will answer questions automatically so you can test all features!
          </div>
        </div>
      )}
    </div>
  );
};
