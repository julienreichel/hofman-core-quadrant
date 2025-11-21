/**
 * useLanguage - Manages language selection and persistence
 *
 * Responsibilities:
 * - Manage selected language (en-US, fr-FR)
 * - Persist to localStorage
 * - Provide default language
 */

import { ref } from 'vue';

const LANGUAGE_STORAGE_KEY = 'app-language';
const DEFAULT_LANGUAGE = 'en-US';

export type SupportedLanguage = 'en-US' | 'fr-FR';

export function useLanguage() {
  const currentLanguage = ref<SupportedLanguage>(DEFAULT_LANGUAGE);

  // Load language from localStorage
  const loadLanguage = () => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && (stored === 'en-US' || stored === 'fr-FR')) {
      currentLanguage.value = stored as SupportedLanguage;
    }
  };

  // Set and persist language
  const setLanguage = (language: SupportedLanguage) => {
    currentLanguage.value = language;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  };

  // Initialize on creation
  loadLanguage();

  return {
    currentLanguage,
    setLanguage,
    loadLanguage,
  };
}
