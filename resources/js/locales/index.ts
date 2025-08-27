import id from './id';
import en from './en';

export const translations = {
  id,
  en,
};

export type Locale = keyof typeof translations;
export type TranslationKey = keyof typeof id;
