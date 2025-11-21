import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useLanguage } from 'src/composables/useLanguage';

describe('useLanguage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should initialize with default language en-US', () => {
      const { currentLanguage } = useLanguage();
      expect(currentLanguage.value).toBe('en-US');
    });

    it('should load language from localStorage on initialization', () => {
      localStorage.setItem('app-language', 'fr-FR');
      const { currentLanguage } = useLanguage();
      expect(currentLanguage.value).toBe('fr-FR');
    });

    it('should ignore invalid language in localStorage', () => {
      localStorage.setItem('app-language', 'invalid-lang');
      const { currentLanguage } = useLanguage();
      expect(currentLanguage.value).toBe('en-US');
    });
  });

  describe('setLanguage', () => {
    it('should set language to en-US', () => {
      const { currentLanguage, setLanguage } = useLanguage();
      setLanguage('en-US');
      expect(currentLanguage.value).toBe('en-US');
      expect(localStorage.getItem('app-language')).toBe('en-US');
    });

    it('should set language to fr-FR', () => {
      const { currentLanguage, setLanguage } = useLanguage();
      setLanguage('fr-FR');
      expect(currentLanguage.value).toBe('fr-FR');
      expect(localStorage.getItem('app-language')).toBe('fr-FR');
    });

    it('should persist language selection', () => {
      const { setLanguage } = useLanguage();
      setLanguage('fr-FR');

      // Create new instance to simulate app restart
      const { currentLanguage } = useLanguage();
      expect(currentLanguage.value).toBe('fr-FR');
    });
  });

  describe('switching languages', () => {
    it('should switch from en-US to fr-FR', () => {
      const { currentLanguage, setLanguage } = useLanguage();
      expect(currentLanguage.value).toBe('en-US');

      setLanguage('fr-FR');
      expect(currentLanguage.value).toBe('fr-FR');
    });

    it('should switch from fr-FR to en-US', () => {
      const { currentLanguage, setLanguage } = useLanguage();
      setLanguage('fr-FR');
      expect(currentLanguage.value).toBe('fr-FR');

      setLanguage('en-US');
      expect(currentLanguage.value).toBe('en-US');
    });
  });

  describe('loadLanguage', () => {
    it('should reload language from localStorage', () => {
      const { currentLanguage, loadLanguage } = useLanguage();
      expect(currentLanguage.value).toBe('en-US');

      localStorage.setItem('app-language', 'fr-FR');
      loadLanguage();

      expect(currentLanguage.value).toBe('fr-FR');
    });
  });
});
