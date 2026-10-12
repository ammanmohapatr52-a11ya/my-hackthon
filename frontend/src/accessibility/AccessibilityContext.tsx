import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  type AccessibilityModes,
  DEFAULT_MODES,
  DEAF_HOH_MODES,
} from './modes';
import {
  getSetting,
  setSetting,
  applyProfile as applyProfileStore,
} from '../storage/settingsStore';

interface AccessibilityContextType {
  modes: AccessibilityModes;
  profile: 'standard' | 'deaf-hoh';
  toggleMode: (modeKey: keyof AccessibilityModes) => void;
  setTextScale: (scale: '100' | '125' | '150' | '200') => void;
  selectProfile: (profileId: 'standard' | 'deaf-hoh') => Promise<void>;
  isLoaded: boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  modes: DEFAULT_MODES,
  profile: 'standard',
  toggleMode: () => {},
  setTextScale: () => {},
  selectProfile: async () => {},
  isLoaded: false,
});

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modes, setModes] = useState<AccessibilityModes>(DEFAULT_MODES);
  const [profile, setProfile] = useState<'standard' | 'deaf-hoh'>('standard');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from Dexie settings store on mount
  useEffect(() => {
    async function loadInitial() {
      try {
        const storedProfile = await getSetting<'standard' | 'deaf-hoh'>('profile', 'standard');
        const storedModes = await getSetting<AccessibilityModes>('modes', DEFAULT_MODES);
        setProfile(storedProfile);
        setModes(storedModes);
      } catch (e) {
        console.warn('Could not load accessibility settings from DB, using defaults', e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadInitial();
  }, []);

  // Synchronize data attributes onto <html>
  useEffect(() => {
    const root = document.documentElement;

    if (modes.highContrast) {
      root.setAttribute('data-contrast', 'high');
    } else {
      root.removeAttribute('data-contrast');
    }

    root.setAttribute('data-text-scale', modes.textScale);

    if (modes.simplifiedLearning) {
      root.setAttribute('data-simplified', 'true');
    } else {
      root.removeAttribute('data-simplified');
    }
  }, [modes]);

  const toggleMode = useCallback((modeKey: keyof AccessibilityModes) => {
    setModes((prev) => {
      const next = {
        ...prev,
        [modeKey]: !prev[modeKey],
      };
      setSetting('modes', next);
      return next;
    });
  }, []);

  const setTextScale = useCallback((scale: '100' | '125' | '150' | '200') => {
    setModes((prev) => {
      const next = {
        ...prev,
        textScale: scale,
      };
      setSetting('modes', next);
      return next;
    });
  }, []);

  const selectProfile = useCallback(async (profileId: 'standard' | 'deaf-hoh') => {
    const updatedModes = await applyProfileStore(profileId);
    setProfile(profileId);
    setModes(updatedModes);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        modes,
        profile,
        toggleMode,
        setTextScale,
        selectProfile,
        isLoaded,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
