/**
 * useLanguage - Manages language selection and persistence
 *
 * Responsibilities:
 * - Manage selected language (en, fr)
 * - Persist to localStorage
 * - Provide default language
 */

import { ref } from 'vue';

const LANGUAGE_STORAGE_KEY = 'ofman_lang';
const DEFAULT_LANGUAGE = 'en';

export type SupportedLanguage = 'en' | 'fr';

export const availableLanguages: SupportedLanguage[] = ['en', 'fr'];

export function useLanguage() {
  const currentLang = ref<SupportedLanguage>(DEFAULT_LANGUAGE);

  // Load language from localStorage
  const loadLanguage = () => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && availableLanguages.includes(stored as SupportedLanguage)) {
      currentLang.value = stored as SupportedLanguage;
    } else {
      // Reset to default if invalid
      currentLang.value = DEFAULT_LANGUAGE;
    }
  };

  // Set and persist language with validation
  const setLang = (language: string) => {
    // Validate input - reset to default if invalid
    if (availableLanguages.includes(language as SupportedLanguage)) {
      currentLang.value = language as SupportedLanguage;
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } else {
      currentLang.value = DEFAULT_LANGUAGE;
      localStorage.setItem(LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE);
    }
  };

  // Initialize on creation
  loadLanguage();

  return {
    currentLang,
    setLang,
    loadLanguage,
    availableLanguages,
  };
}
