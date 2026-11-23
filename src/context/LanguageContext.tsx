import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.en, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'salon_preferred_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved === 'gu' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: keyof typeof TRANSLATIONS.en, params?: Record<string, string | number>): string => {
    const dictionary = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = dictionary[key] || TRANSLATIONS.en[key] || String(key);
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramVal]) => {
        text = text.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramVal));
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
