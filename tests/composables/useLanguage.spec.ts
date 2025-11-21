import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useLanguage, availableLanguages } from 'src/composables/useLanguage';

describe('useLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset the shared state to default
    const { loadLanguage } = useLanguage();
    loadLanguage();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('default language is "en"', () => {
      const { currentLang } = useLanguage();
      expect(currentLang.value).toBe('en');
    });

    it('should load language from localStorage on initialization', () => {
      localStorage.setItem('ofman_lang', 'fr');
      const { loadLanguage, currentLang } = useLanguage();
      loadLanguage(); // Reload after setting localStorage
      expect(currentLang.value).toBe('fr');
    });

    it('invalid input resets to "en"', () => {
      localStorage.setItem('ofman_lang', 'invalid-lang');
      const { loadLanguage, currentLang } = useLanguage();
      loadLanguage(); // Reload after setting localStorage
      expect(currentLang.value).toBe('en');
    });
  });

  describe('setLang', () => {
    it('should set language to en', () => {
      const { currentLang, setLang } = useLanguage();
      setLang('en');
      expect(currentLang.value).toBe('en');
      expect(localStorage.getItem('ofman_lang')).toBe('en');
    });

    it('switching to "fr" works', () => {
      const { currentLang, setLang } = useLanguage();
      setLang('fr');
      expect(currentLang.value).toBe('fr');
      expect(localStorage.getItem('ofman_lang')).toBe('fr');
    });

    it('invalid input resets to "en" when calling setLang', () => {
      const { currentLang, setLang } = useLanguage();
      setLang('invalid-language');
      expect(currentLang.value).toBe('en');
      expect(localStorage.getItem('ofman_lang')).toBe('en');
    });

    it('should persist language selection', () => {
      const { setLang } = useLanguage();
      setLang('fr');

      // Create new instance to simulate app restart
      const { currentLang } = useLanguage();
      expect(currentLang.value).toBe('fr');
    });
  });

  describe('switching languages', () => {
    it('should switch from en to fr', () => {
      const { currentLang, setLang } = useLanguage();
      expect(currentLang.value).toBe('en');

      setLang('fr');
      expect(currentLang.value).toBe('fr');
    });

    it('should switch from fr to en', () => {
      const { currentLang, setLang } = useLanguage();
      setLang('fr');
      expect(currentLang.value).toBe('fr');

      setLang('en');
      expect(currentLang.value).toBe('en');
    });
  });

  describe('persistence in localStorage', () => {
    it('should persist language to localStorage', () => {
      const { setLang } = useLanguage();
      setLang('fr');
      expect(localStorage.getItem('ofman_lang')).toBe('fr');
    });

    it('localStorage roundtrip works', () => {
      const { setLang } = useLanguage();
      setLang('fr');

      // Clear and reload
      const { currentLang, loadLanguage } = useLanguage();
      loadLanguage();

      expect(currentLang.value).toBe('fr');
    });
  });

  describe('availableLanguages', () => {
    it('should expose availableLanguages array', () => {
      const { availableLanguages: langs } = useLanguage();
      expect(langs).toEqual(['en', 'fr']);
    });

    it('availableLanguages should be exported', () => {
      expect(availableLanguages).toEqual(['en', 'fr']);
    });
  });
});
