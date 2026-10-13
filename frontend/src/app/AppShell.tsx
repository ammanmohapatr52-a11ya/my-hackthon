import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { SideNav } from './SideNav';
import { SkipLinks } from '../accessibility/SkipLinks';
import { CaptionBar } from '../features/captions/CaptionBar';
import { PageAssistantPrompt, AssistantPageBanner } from '../features/assistant/PageAssistantPrompt';
import { MarvelBackground3D } from '../components/ui/MarvelBackground3D';

interface AppShellProps {
  currentCaption?: string;
  isPlaying?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentCaption = '',
  isPlaying = false,
}) => {
  const [navOpen, setNavOpen] = useState(false);

  // Accessible keyboard listener: ESC closes navigation drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && navOpen) {
        setNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navOpen]);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (navOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [navOpen]);

  return (
    <div className="app-container" style={{ position: 'relative', overflowX: 'hidden' }}>
      {/* 3D Marvel Cinematic Universe Luminous Background Engine for all main interfaces */}
      <MarvelBackground3D variant="main" />

      <SkipLinks />

      {/* Accessible Backdrop Overlay when nav is open */}
      {navOpen && (
        <div
          className="nav-backdrop"
          onClick={() => setNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Side Nav Drawer - ONLY shows when three-line menu is touched/clicked */}
      <aside
        id="navigation-drawer"
        className={`sidenav-wrapper ${navOpen ? 'open' : ''}`}
        role="dialog"
        aria-label="Navigation Menu Options"
        aria-modal="true"
        aria-hidden={!navOpen}
      >
        <SideNav
          onItemClick={() => setNavOpen(false)}
          onClose={() => setNavOpen(false)}
        />
      </aside>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          position: 'relative',
          width: '100%',
          zIndex: 1,
        }}
      >
        <Header
          isNavOpen={navOpen}
          onToggleMobileNav={() => setNavOpen(!navOpen)}
        />

        <main id="main-content" className="main-content" tabIndex={-1}>
          <AssistantPageBanner />
          <Outlet />
        </main>
      </div>

      <CaptionBar currentCaption={currentCaption} isPlaying={isPlaying} />
      <PageAssistantPrompt />
    </div>
  );
};

