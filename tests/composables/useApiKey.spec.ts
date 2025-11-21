import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useApiKey } from 'src/composables/useApiKey';

describe('useApiKey', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should initialize with empty key when localStorage is empty', () => {
      const { apiKey, hasKey } = useApiKey();
      expect(apiKey.value).toBe('');
      expect(hasKey.value).toBe(false);
    });

    it('should load key from localStorage on initialization', () => {
      localStorage.setItem('openai_api_key', 'sk-test123456789012345678901234567890');
      const { apiKey, hasKey } = useApiKey();
      expect(apiKey.value).toBe('sk-test123456789012345678901234567890');
      expect(hasKey.value).toBe(true);
    });
  });

  describe('saveKey', () => {
    it('should save key to state and localStorage', () => {
      const { apiKey, saveKey, hasKey } = useApiKey();
      const testKey = 'sk-test123456789012345678901234567890';

      saveKey(testKey);

      expect(apiKey.value).toBe(testKey);
      expect(hasKey.value).toBe(true);
      expect(localStorage.getItem('openai_api_key')).toBe(testKey);
    });
  });

  describe('clearKey', () => {
    it('should clear key from state and localStorage', () => {
      const { apiKey, saveKey, clearKey, hasKey } = useApiKey();
      const testKey = 'sk-test123456789012345678901234567890';

      saveKey(testKey);
      expect(apiKey.value).toBe(testKey);

      clearKey();

      expect(apiKey.value).toBe('');
      expect(hasKey.value).toBe(false);
      expect(localStorage.getItem('openai_api_key')).toBeNull();
    });
  });

  describe('validation', () => {
    it('should validate correct OpenAI key format', () => {
      const { saveKey, isValidKey } = useApiKey();
      const validKey = 'sk-test123456789012345678901234567890';

      saveKey(validKey);

      expect(isValidKey.value).toBe(true);
    });

    it('should invalidate key without sk- prefix', () => {
      const { saveKey, isValidKey } = useApiKey();
      const invalidKey = 'test123456789012345678901234567890';

      saveKey(invalidKey);

      expect(isValidKey.value).toBe(false);
    });

    it('should invalidate key that is too short', () => {
      const { saveKey, isValidKey } = useApiKey();
      const shortKey = 'sk-short';

      saveKey(shortKey);

      expect(isValidKey.value).toBe(false);
    });

    it('should invalidate empty key', () => {
      const { isValidKey } = useApiKey();
      expect(isValidKey.value).toBe(false);
    });
  });

  describe('hasKey', () => {
    it('should return false when key is empty', () => {
      const { hasKey } = useApiKey();
      expect(hasKey.value).toBe(false);
    });

    it('should return true when key is present (even if invalid)', () => {
      const { saveKey, hasKey } = useApiKey();
      saveKey('invalid-key');
      expect(hasKey.value).toBe(true);
    });
  });

  describe('loadKey', () => {
    it('should reload key from localStorage', () => {
      const { apiKey, loadKey } = useApiKey();
      expect(apiKey.value).toBe('');

      localStorage.setItem('openai_api_key', 'sk-newkey123456789012345678901234567890');
      loadKey();

      expect(apiKey.value).toBe('sk-newkey123456789012345678901234567890');
    });
  });
});
