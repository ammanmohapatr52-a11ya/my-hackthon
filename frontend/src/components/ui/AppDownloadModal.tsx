import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  CheckCircle,
  Zap,
  X,
  Share,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HardDriveDownload,
} from 'lucide-react';
import {
  canPromptPwaInstall,
  triggerPwaInstallPrompt,
  isRunningInStandaloneMode,
  detectDevicePlatform,
  preCacheAllOfflineAssets,
  downloadOfflinePortableApp,
} from '../../services/pwaDownloadService';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'mobile' | 'laptop' | 'offline_bundle'>('laptop');
  const [canInstall, setCanInstall] = useState<boolean>(() => canPromptPwaInstall());
  const [isStandalone, setIsStandalone] = useState<boolean>(() => isRunningInStandaloneMode());
  const [isCaching, setIsCaching] = useState<boolean>(false);
  const [cacheProgress, setCacheProgress] = useState<number>(0);
  const [cacheStatusText, setCacheStatusText] = useState<string>('');
  const [cacheSuccess, setCacheSuccess] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  const platform = detectDevicePlatform();

  useEffect(() => {
    if (platform === 'android' || platform === 'ios') {
      setActiveTab('mobile');
    } else {
      setActiveTab('laptop');
    }
  }, [platform]);

  useEffect(() => {
    const handleInstallable = () => setCanInstall(true);
    const handleInstalled = () => {
      setInstallSuccess(true);
      setIsStandalone(true);
    };

    window.addEventListener('neurobridge_pwa_installable', handleInstallable);
    window.addEventListener('neurobridge_pwa_installed', handleInstalled);
    return () => {
      window.removeEventListener('neurobridge_pwa_installable', handleInstallable);
      window.removeEventListener('neurobridge_pwa_installed', handleInstalled);
    };
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (canInstall) {
      const outcome = await triggerPwaInstallPrompt();
      if (outcome === 'accepted') {
        setInstallSuccess(true);
      }
    }
  };

  const handlePreCacheAll = async () => {
    setIsCaching(true);
    setCacheProgress(10);
    setCacheSuccess(false);

    const res = await preCacheAllOfflineAssets((pct, text) => {
      setCacheProgress(pct);
      setCacheStatusText(text);
    });

    setIsCaching(false);
    if (res.success) {
      setCacheSuccess(true);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(3, 7, 18, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: 'linear-gradient(145deg, rgba(13, 22, 43, 0.96) 0%, rgba(6, 12, 26, 0.98) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.45)',
          borderRadius: '24px',
          maxWidth: '680px',
          width: '100%',
          boxShadow: '0 0 50px rgba(56, 189, 248, 0.25), 0 25px 60px rgba(0, 0, 0, 0.8)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
        }}
      >
        {/* Top Radiant Accent Line */}
        <div
          style={{
            height: '3px',
            background: 'linear-gradient(90deg, #38bdf8 0%, #f59e0b 50%, #10b981 100%)',
            boxShadow: '0 0 16px #38bdf8',
          }}
        />

        {/* Modal Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem 1rem',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(245, 158, 11, 0.2) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)',
              }}
            >
              <Download size={24} color="#38bdf8" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2
                  id="download-modal-title"
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#ffffff',
                    margin: 0,
                  }}
                >
                  Download & Install App
                </h2>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                  }}
                >
                  Offline Ready
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                Run Neurobridge directly on your Laptop or Mobile without an active internet connection.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close download modal"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#94a3b8',
              transition: 'all 0.15s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher: Laptop vs Mobile vs Offline Bundle */}
        <div
          style={{
            padding: '1rem 1.75rem 0.5rem',
            display: 'flex',
            gap: '0.5rem',
            background: 'rgba(4, 9, 22, 0.5)',
          }}
        >
          <button
            type="button"
            id="tab-download-laptop"
            onClick={() => setActiveTab('laptop')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0.6rem 0.85rem',
              borderRadius: '12px',
              border: activeTab === 'laptop' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeTab === 'laptop' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: activeTab === 'laptop' ? '#38bdf8' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'laptop' ? '0 0 16px rgba(56, 189, 248, 0.2)' : 'none',
            }}
          >
            <Laptop size={16} />
            <span>💻 Laptop / PC</span>
          </button>

          <button
            type="button"
            id="tab-download-mobile"
            onClick={() => setActiveTab('mobile')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0.6rem 0.85rem',
              borderRadius: '12px',
              border: activeTab === 'mobile' ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeTab === 'mobile' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: activeTab === 'mobile' ? '#f59e0b' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'mobile' ? '0 0 16px rgba(245, 158, 11, 0.2)' : 'none',
            }}
          >
            <Smartphone size={16} />
            <span>📱 Mobile Phone</span>
          </button>

          <button
            type="button"
            id="tab-download-bundle"
            onClick={() => setActiveTab('offline_bundle')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0.6rem 0.85rem',
              borderRadius: '12px',
              border: activeTab === 'offline_bundle' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
              background: activeTab === 'offline_bundle' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: activeTab === 'offline_bundle' ? '#10b981' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'offline_bundle' ? '0 0 16px rgba(16, 185, 129, 0.2)' : 'none',
            }}
          >
            <Zap size={16} />
            <span>⚡ Offline Cache</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '1.25rem 1.75rem', overflowY: 'auto' }}>
          {isStandalone && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#34d399',
                fontSize: '0.84rem',
                fontWeight: 600,
              }}
            >
              <CheckCircle size={18} />
              <span>Great news! You are already running Neurobridge as an installed Standalone App.</span>
            </div>
          )}

          {/* TAB 1: LAPTOP / PC INSTALLATION */}
          {activeTab === 'laptop' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  background: 'rgba(56, 189, 248, 0.06)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                      Windows / Mac Desktop Application
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                      Creates a desktop shortcut, taskbar icon, and runs in an independent app window with 100% offline support.
                    </p>
                  </div>
                  <Laptop size={32} color="#38bdf8" />
                </div>

                {canInstall ? (
                  <button
                    type="button"
                    id="btn-install-laptop-pwa"
                    onClick={handleNativeInstall}
                    style={{
                      background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      padding: '0.75rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Download size={18} />
                    <span>Click Here to Install on Windows / Mac Now</span>
                  </button>
                ) : (
                  <div
                    style={{
                      background: 'rgba(4, 9, 22, 0.85)',
                      borderRadius: '10px',
                      padding: '0.85rem 1rem',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', marginBottom: '6px' }}>
                      How to install in Chrome / Edge / Brave:
                    </div>
                    <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                      <li>
                        Look at the right side of your browser address bar for the <strong>Install icon (⊕ or 💻)</strong> and click it.
                      </li>
                      <li>
                        Or click the three dots menu <strong>(⋮) ➔ Cast, save, and share ➔ Install Neurobridge</strong>.
                      </li>
                      <li>Click <strong>Install</strong> to launch as a standalone desktop application!</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Direct Standalone HTML Runner Download */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc' }}>
                    📦 Download Portable Offline File (.html)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                    Downloads a single-file portable offline solver you can keep on a USB drive or your hard disk.
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-download-portable-laptop"
                  onClick={downloadOfflinePortableApp}
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    color: '#38bdf8',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <HardDriveDownload size={14} />
                  <span>Download .html</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MOBILE INSTALLATION */}
          {activeTab === 'mobile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.06)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                      Android & iPhone Mobile App
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                      Adds Neurobridge icon to your Home Screen with fullscreen view and lightning-fast offline startup.
                    </p>
                  </div>
                  <Smartphone size={32} color="#f59e0b" />
                </div>

                {canInstall && (
                  <button
                    type="button"
                    id="btn-install-mobile-pwa"
                    onClick={handleNativeInstall}
                    style={{
                      background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      padding: '0.75rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Download size={18} />
                    <span>Install on Mobile Home Screen</span>
                  </button>
                )}

                {/* Android Steps */}
                <div
                  style={{
                    background: 'rgba(4, 9, 22, 0.85)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b', marginBottom: '6px' }}>
                    🤖 For Android (Chrome / Samsung Internet):
                  </div>
                  <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                    <li>Tap the <strong>three dots menu (⋮)</strong> in top-right corner.</li>
                    <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                    <li>Tap <strong>Install</strong> to add the Neurobridge app icon!</li>
                  </ol>
                </div>

                {/* iOS Safari Steps */}
                <div
                  style={{
                    background: 'rgba(4, 9, 22, 0.85)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                  }}
                >
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', marginBottom: '6px' }}>
                    🍏 For iPhone / iPad (Safari):
                  </div>
                  <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                    <li>
                      Tap the <strong>Share button</strong> (<Share size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> square with arrow pointing up) at the bottom.
                    </li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                    <li>Tap <strong>Add</strong> in the top-right corner.</li>
                  </ol>
                </div>
              </div>

              {/* Direct Standalone HTML Runner Download for Mobile */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc' }}>
                    📥 Save Offline Runner File to Phone
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                    Directly saves the offline app HTML file to your phone's Downloads.
                  </div>
                </div>
                <button
                  type="button"
                  id="btn-download-portable-mobile"
                  onClick={downloadOfflinePortableApp}
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    color: '#f59e0b',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <HardDriveDownload size={14} />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: OFFLINE CACHE BOOSTER */}
          {activeTab === 'offline_bundle' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                      Pre-Cache Full Application for Zero-Internet Use
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                      Downloads all routes, symbolic math libraries, offline flashcard store, and assets directly into your device's browser cache.
                    </p>
                  </div>
                  <Zap size={32} color="#10b981" />
                </div>

                {cacheSuccess ? (
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.5)',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#34d399',
                      fontSize: '0.86rem',
                      fontWeight: 700,
                    }}
                  >
                    <CheckCircle size={22} color="#10b981" />
                    <div>
                      <div>100% Offline Package Downloaded!</div>
                      <div style={{ fontSize: '0.76rem', fontWeight: 500, color: '#a7f3d0', marginTop: '2px' }}>
                        You can now turn off WiFi or mobile data — Neurobridge will continue running completely offline.
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    id="btn-precache-now"
                    onClick={handlePreCacheAll}
                    disabled={isCaching}
                    style={{
                      background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      padding: '0.85rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: isCaching ? 'wait' : 'pointer',
                      boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Zap size={18} />
                    <span>{isCaching ? 'Downloading & Caching Assets...' : '⚡ Download Full Offline Cache (1-Click)'}</span>
                  </button>
                )}

                {isCaching && (
                  <div>
                    <div
                      style={{
                        height: '8px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${cacheProgress}%`,
                          background: 'linear-gradient(90deg, #10b981, #38bdf8)',
                          borderRadius: '9999px',
                          transition: 'width 0.3s ease',
                          boxShadow: '0 0 10px #10b981',
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: '0.74rem',
                        color: '#94a3b8',
                        marginTop: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>{cacheStatusText || 'Caching offline bundles...'}</span>
                      <span style={{ fontWeight: 700, color: '#38bdf8' }}>{cacheProgress}%</span>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '0.75rem',
                    marginTop: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '10px',
                      padding: '0.75rem',
                      fontSize: '0.78rem',
                      color: '#cbd5e1',
                    }}
                  >
                    <ShieldCheck size={16} color="#10b981" style={{ marginBottom: '4px' }} />
                    <div style={{ fontWeight: 700, color: '#ffffff' }}>Symbolic Math Engine</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Calculates without servers</div>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '10px',
                      padding: '0.75rem',
                      fontSize: '0.78rem',
                      color: '#cbd5e1',
                    }}
                  >
                    <Sparkles size={16} color="#f59e0b" style={{ marginBottom: '4px' }} />
                    <div style={{ fontWeight: 700, color: '#ffffff' }}>Spaced Repetition</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Runs on-device IndexedDB</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(4, 8, 20, 0.75)',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Neurobridge PWA · Offline Compatibility Enabled
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              padding: '6px 16px',
              color: '#cbd5e1',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
