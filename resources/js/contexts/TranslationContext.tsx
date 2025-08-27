import React, { createContext, useContext, useState, ReactNode } from 'react';
import { translations, Locale } from '@/locales';

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  availableLocales: Locale[];
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

interface TranslationProviderProps {
  children: ReactNode;
  defaultLocale?: Locale;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ 
  children, 
  defaultLocale = 'id' 
}) => {
  const [locale, setLocale] = useState<Locale>(() => {
    // Try to get locale from localStorage, fallback to defaultLocale
    const savedLocale = localStorage.getItem('locale') as Locale;
    return savedLocale && translations[savedLocale] ? savedLocale : defaultLocale;
  });

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // Also update document language
    document.documentElement.lang = newLocale;
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    try {
      const keys = key.split('.');
      let value: any = translations[locale];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to English if key not found in current locale
          value = translations['en'];
          for (const fallbackKey of keys) {
            if (value && typeof value === 'object' && fallbackKey in value) {
              value = value[fallbackKey];
            } else {
              // If not found in English either, return the key
              return key;
            }
          }
          break;
        }
      }
      
      if (typeof value !== 'string') {
        return key;
      }
      
      // Replace parameters in the translation
      if (params) {
        return value.replace(/:(\w+)/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match;
        });
      }
      
      return value;
    } catch (error) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
  };

  const availableLocales: Locale[] = Object.keys(translations) as Locale[];

  const value: TranslationContextType = {
    locale,
    setLocale: handleSetLocale,
    t,
    availableLocales,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};
