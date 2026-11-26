import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import en from './locales/en';
import es from './locales/es';
import de from './locales/de';

const I18nContext = createContext(null);

const dictionaries = {
  en,
  es,
  de
};

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' }
];

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('app_language');
      return saved && dictionaries[saved] ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang) => {
    if (dictionaries[lang]) {
      setLanguageState(lang);
      try {
        localStorage.setItem('app_language', lang);
      } catch (e) {
        console.error('Failed to save language preference:', e);
      }
    }
  };

  const t = useMemo(() => {
    const dict = dictionaries[language] || dictionaries.en;
    const fallback = dictionaries.en;

    return (path, params = {}) => {
      const keys = path.split('.');
      let val = dict;
      for (const k of keys) {
        if (val && typeof val === 'object' && k in val) {
          val = val[k];
        } else {
          val = undefined;
          break;
        }
      }

      // Fallback to English if translation is missing in selected language
      if (val === undefined) {
        let fVal = fallback;
        for (const k of keys) {
          if (fVal && typeof fVal === 'object' && k in fVal) {
            fVal = fVal[k];
          } else {
            fVal = undefined;
            break;
          }
        }
        val = fVal !== undefined ? fVal : path;
      }

      if (typeof val === 'string') {
        return Object.entries(params).reduce((acc, [pKey, pVal]) => {
          return acc.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
        }, val);
      }

      return val;
    };
  }, [language]);

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages: AVAILABLE_LANGUAGES
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
