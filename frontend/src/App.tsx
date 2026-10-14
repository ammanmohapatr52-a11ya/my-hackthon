import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { AccessibilityProvider } from './accessibility/AccessibilityContext';
import { AnnouncerProvider } from './accessibility/Announcer';
import { VisualAlertProvider } from './accessibility/VisualAlert';
import { AppRoutes } from './routes';
import { DoubleTapVoiceListener } from './features/voice-command/DoubleTapVoiceListener';
import { MobileInstallBanner } from './components/ui/MobileInstallBanner';

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AccessibilityProvider>
          <AnnouncerProvider>
            <VisualAlertProvider>
              <DoubleTapVoiceListener />
              <AppRoutes />
              <MobileInstallBanner />
            </VisualAlertProvider>
          </AnnouncerProvider>
        </AccessibilityProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
