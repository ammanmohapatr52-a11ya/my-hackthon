import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Zap } from 'lucide-react';
import {
  canPromptPwaInstall,
  triggerPwaInstallPrompt,
  isRunningInStandaloneMode,
  isInAppBrowser,
} from '../../services/pwaDownloadService';
import { AppDownloadModal } from './AppDownloadModal';

export const MobileInstallBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [canInstall, setCanInstall] = useState(() => canPromptPwaInstall());
  const inApp = isInAppBrowser();

  useEffect(() => {
    // Check if already in standalone app mode
    if (isRunningInStandaloneMode()) {
      return;
    }

    // Check if dismissed in this session
    if (sessionStorage.getItem('neurobridge_mobile_banner_dismissed')) {
      return;
    }

    // Check if on a mobile or tablet screen
    const checkMobile = () => {
      const isMobile = window.innerWidth <= 768 || /android|iphone|ipad|ipod/i.test(navigator.userAgent);
      setIsVisible(isMobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleInstallable = () => setCanInstall(true);
    const handleInstalled = () => setIsVisible(false);

    window.addEventListener('neurobridge_pwa_installable', handleInstallable);
    window.addEventListener('neurobridge_pwa_installed', handleInstalled);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('neurobridge_pwa_installable', handleInstallable);
      window.removeEventListener('neurobridge_pwa_installed', handleInstalled);
    };
  }, []);

  if (!isVisible) return null;

  const handleInstallClick = async () => {
    if (canInstall) {
      const outcome = await triggerPwaInstallPrompt();
      if (outcome === 'accepted') {
        setIsVisible(false);
        return;
      }
    }
    // Open full modal for 1-tap instructions or direct download
    setIsModalOpen(true);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('neurobridge_mobile_banner_dismissed', 'true');
  };

  return (
    <>
      <aside
        id="mobile-install-banner"
        aria-label="Install mobile application"
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          zIndex: 890,
          background: 'linear-gradient(135deg, rgba(13, 22, 45, 0.98) 0%, rgba(6, 12, 28, 0.98) 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.55)',
          borderRadius: '16px',
          padding: '0.75rem 1rem',
          boxShadow: '0 0 30px rgba(56, 189, 248, 0.35), 0 10px 30px rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 14px rgba(245, 158, 11, 0.5)',
            }}
          >
            <Smartphone size={20} color="#ffffff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#ffffff' }}>Mobile App</span>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                }}
              >
                Offline Ready
              </span>
            </div>
            <div
              style={{
                fontSize: '0.72rem',
                color: inApp ? '#f87171' : '#94a3b8',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {inApp ? 'WhatsApp detected · Tap APK to download' : 'Direct APK download or Home Screen'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
          {/* Direct APK Download Button */}
          <a
            href="/downloads/Neurobridge-App.apk"
            download="Neurobridge-App.apk"
            id="mobile-banner-apk-btn"
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              borderRadius: '9999px',
              color: '#ffffff',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.76rem',
              padding: '6px 11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              boxShadow: '0 0 14px rgba(16, 185, 129, 0.45)',
              whiteSpace: 'nowrap',
            }}
          >
            <Download size={13} />
            <span>APK</span>
          </a>

          {/* Web App Install / Instructions Modal Button */}
          <button
            type="button"
            id="mobile-banner-install-btn"
            onClick={handleInstallClick}
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              border: 'none',
              borderRadius: '9999px',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.76rem',
              padding: '6px 11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              boxShadow: '0 0 14px rgba(56, 189, 248, 0.45)',
              whiteSpace: 'nowrap',
            }}
          >
            <Smartphone size={13} />
            <span>Install</span>
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              padding: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>
      </aside>

      <AppDownloadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
