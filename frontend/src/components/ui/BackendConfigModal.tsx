import React, { useState, useEffect } from 'react';
import { Server, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, X, ShieldCheck, Zap } from 'lucide-react';
import {
  getBackendBaseUrl,
  setBackendBaseUrl,
  checkBackendHealth,
  isLocalhost,
  isBackendConfigured,
} from '../../config/apiConfig';

interface BackendConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected?: () => void;
}

export const BackendConfigModal: React.FC<BackendConfigModalProps> = ({
  isOpen,
  onClose,
  onConnected,
}) => {
  const [urlInput, setUrlInput] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getBackendBaseUrl();
      setUrlInput(current);
      setTestResult(null);
      setSaveSuccess(false);
      // Auto-test current URL
      if (current) {
        runTest(current);
      }
    }
  }, [isOpen]);

  const runTest = async (targetUrl: string) => {
    const clean = targetUrl.trim().replace(/\/+$/, '');
    if (!clean) {
      setTestResult({
        ok: false,
        message: 'Please enter a valid backend URL (e.g. https://your-backend.onrender.com)',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const res = await checkBackendHealth(25000, clean);
    setIsTesting(false);

    if (res.ok) {
      setTestResult({
        ok: true,
        message: `Connected successfully! Latency: ${res.latencyMs || '<50'}ms`,
        latencyMs: res.latencyMs,
      });
      onConnected?.();
    } else {
      setTestResult({
        ok: false,
        message: res.error?.includes('timed out')
          ? 'Backend is taking a while to respond (Render free instances take ~40s to wake up on first ping). Please try again in 20 seconds.'
          : (res.error || 'Connection failed. Verify the URL and CORS settings.'),
      });
    }
  };

  const handleSave = () => {
    const clean = urlInput.trim().replace(/\/+$/, '');
    setBackendBaseUrl(clean);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  if (!isOpen) return null;

  const currentBackend = getBackendBaseUrl();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 24, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#0f172a',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '16px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.2)',
          padding: '1.75rem',
          position: 'relative',
          color: '#e2e8f0',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px',
            display: 'flex',
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b',
            }}
          >
            <Server size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
              Connect Render Backend
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
              Required for live email OTP dispatch, AI solver, & news sync
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: currentBackend ? '#10b981' : '#f59e0b',
                boxShadow: currentBackend ? '0 0 8px #10b981' : '0 0 8px #f59e0b',
              }}
            />
            <span style={{ color: '#94a3b8' }}>Active Base:</span>
            <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
              {currentBackend || '(None configured — OTP won\'t send)'}
            </span>
          </div>
          {isLocalhost() && (
            <span
              style={{
                fontSize: '0.7rem',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                padding: '2px 8px',
                borderRadius: '9999px',
              }}
            >
              Localhost Dev
            </span>
          )}
        </div>

        {/* Input Field */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#cbd5e1',
              marginBottom: '0.4rem',
            }}
          >
            Render Backend URL
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://your-service-name.onrender.com"
              style={{
                flex: 1,
                height: '42px',
                backgroundColor: '#1e293b',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '0 12px',
                color: '#f8fafc',
                fontSize: '0.88rem',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => runTest(urlInput)}
              disabled={isTesting || !urlInput.trim()}
              style={{
                height: '42px',
                padding: '0 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#f59e0b',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: isTesting ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <RefreshCw size={14} className={isTesting ? 'animate-spin' : ''} />
              <span>{isTesting ? 'Pinging...' : 'Test'}</span>
            </button>
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            style={{
              backgroundColor: testResult.ok ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${testResult.ok ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              fontSize: '0.8rem',
              color: testResult.ok ? '#10b981' : '#f87171',
            }}
          >
            {testResult.ok ? (
              <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div>
              <div style={{ fontWeight: 600 }}>{testResult.ok ? 'Connected!' : 'Connection Note'}</div>
              <div>{testResult.message}</div>
            </div>
          </div>
        )}

        {/* Permanent Fix Instructions for Vercel */}
        <div
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '10px',
            padding: '0.85rem',
            marginBottom: '1.25rem',
            fontSize: '0.76rem',
            color: '#94a3b8',
            lineHeight: 1.5,
          }}
        >
          <div style={{ fontWeight: 600, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <Zap size={13} />
            Permanent Fix for Vercel:
          </div>
          <div>
            1. In your Vercel Dashboard, go to <strong>Project Settings → Environment Variables</strong>.<br />
            2. Add key: <code style={{ color: '#38bdf8' }}>VITE_API_URL</code> with value of your Render URL.<br />
            3. Trigger a redeploy. Then all visitors will connect automatically without configuring manually!
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.1rem',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#94a3b8',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!urlInput.trim()}
            style={{
              padding: '0.55rem 1.35rem',
              borderRadius: '8px',
              backgroundColor: saveSuccess ? '#10b981' : '#f59e0b',
              border: 'none',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 size={16} />
                <span>Saved & Connected!</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Save & Connect</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
