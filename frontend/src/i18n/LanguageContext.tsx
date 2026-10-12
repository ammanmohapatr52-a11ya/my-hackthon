import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, type LanguageCode } from './translations';
import { getSetting, setSetting } from '../storage/settingsStore';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
  t: (key: string, fallback?: string) => string;
  activeLocale: string;
  activeLanguageName: string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: async () => {},
  t: (key: string, fallback?: string) => fallback || key,
  activeLocale: 'en-IN',
  activeLanguageName: 'English',
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  // Load saved language on mount
  useEffect(() => {
    async function initLanguage() {
      const stored = await getSetting<string>('language', 'en');
      const validLang: LanguageCode = stored === 'hi' || stored === 'or' ? stored : 'en';
      setLanguageState(validLang);
      document.documentElement.lang = validLang;
      document.documentElement.setAttribute('data-lang', validLang);
      if (document.body) {
        document.body.setAttribute('data-lang', validLang);
      }
      try {
        localStorage.setItem('language', validLang);
      } catch {}
    }
    initLanguage();
  }, []);

  const setLanguage = useCallback(async (newLang: LanguageCode) => {
    setLanguageState(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.setAttribute('data-lang', newLang);
    if (document.body) {
      document.body.setAttribute('data-lang', newLang);
    }
    try {
      localStorage.setItem('language', newLang);
    } catch {}
    await setSetting('language', newLang);
    // Broadcast event for audio/speech and non-React listeners
    window.dispatchEvent(new CustomEvent('app:language-changed', { detail: { language: newLang } }));
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const langDict = translations[language] || translations.en;
      if (langDict && langDict[key]) {
        return langDict[key];
      }
      // Fallback to English dictionary
      if (translations.en && translations.en[key]) {
        return translations.en[key];
      }
      return fallback || key;
    },
    [language]
  );

  const activeLocale = language === 'hi' ? 'hi-IN' : language === 'or' ? 'or-IN' : 'en-IN';
  const activeLanguageName = language === 'hi' ? 'Hindi' : language === 'or' ? 'Odia' : 'English';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeLocale,
        activeLanguageName,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
