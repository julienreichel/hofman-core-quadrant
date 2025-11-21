import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useOfflineDatabase } from 'src/composables/useOfflineDatabase';
import databaseEn from 'src/assets/database.en.json';
import databaseFr from 'src/assets/database.fr.json';

// Mock fetch
global.fetch = vi.fn((input: RequestInfo | URL) => {
  let url = '';
  if (typeof input === 'string') {
    url = input;
  } else if (input instanceof URL) {
    url = input.href;
  } else if (input instanceof Request) {
    url = input.url;
  }
  
  if (url.includes('database.en.json')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(databaseEn),
    } as Response);
  }
  if (url.includes('database.fr.json')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(databaseFr),
    } as Response);
  }
  return Promise.resolve({
    ok: false,
    statusText: 'Not Found',
  } as Response);
}) as typeof fetch;

describe('useOfflineDatabase', () => {
  let db: ReturnType<typeof useOfflineDatabase>;

  beforeEach(async () => {
    db = useOfflineDatabase();
  });

  describe('loadDefaultDatabase', () => {
    it('should load English database', async () => {
      await await db.loadDefaultDatabase('en-US');
      expect(db.isDatabaseLoaded.value).toBe(true);
      expect(db.isCustomDatabase.value).toBe(false);
      expect(db.traitCount.value).toBeGreaterThan(0);
    });

    it('should load French database', async () => {
      await await db.loadDefaultDatabase('fr-FR');
      expect(db.isDatabaseLoaded.value).toBe(true);
      expect(db.isCustomDatabase.value).toBe(false);
      expect(db.traitCount.value).toBeGreaterThan(0);
    });
  });

  describe('importDatabase', () => {
    it('should import valid JSON database', () => {
      const validDb = JSON.stringify({
        traits: [
          { id: 'test1', label: 'Test 1', polarity: 'positive' },
          { id: 'test2', label: 'Test 2', polarity: 'negative' },
        ],
        links: [{ from: 'test1', to: 'test2', type: 'excess' }],
      });

      db.importDatabase(validDb);
      expect(db.isDatabaseLoaded.value).toBe(true);
      expect(db.isCustomDatabase.value).toBe(true);
      expect(db.traitCount.value).toBe(2);
    });

    it('should reject invalid JSON', () => {
      expect(() => db.importDatabase('invalid json')).toThrow();
    });

    it('should reject database without traits array', () => {
      const invalidDb = JSON.stringify({
        links: [],
      });
      expect(() => db.importDatabase(invalidDb)).toThrow('missing traits array');
    });

    it('should reject database without links array', () => {
      const invalidDb = JSON.stringify({
        traits: [],
      });
      expect(() => db.importDatabase(invalidDb)).toThrow('missing links array');
    });

    it('should reject traits with invalid polarity', () => {
      const invalidDb = JSON.stringify({
        traits: [{ id: 'test', label: 'Test', polarity: 'invalid' }],
        links: [],
      });
      expect(() => db.importDatabase(invalidDb)).toThrow('Invalid polarity');
    });

    it('should reject links with invalid type', () => {
      const invalidDb = JSON.stringify({
        traits: [{ id: 'test', label: 'Test', polarity: 'positive' }],
        links: [{ from: 'test', to: 'test', type: 'invalid' }],
      });
      expect(() => db.importDatabase(invalidDb)).toThrow('Invalid link type');
    });
  });

  describe('getTraitsByPolarity', () => {
    beforeEach(async () => {
      await await db.loadDefaultDatabase('en-US');
    });

    it('should return positive traits', () => {
      const positiveTraits = db.getTraitsByPolarity('positive');
      expect(positiveTraits.length).toBeGreaterThan(0);
      expect(positiveTraits.every((t) => t.polarity === 'positive')).toBe(true);
    });

    it('should return negative traits', () => {
      const negativeTraits = db.getTraitsByPolarity('negative');
      expect(negativeTraits.length).toBeGreaterThan(0);
      expect(negativeTraits.every((t) => t.polarity === 'negative')).toBe(true);
    });
  });

  describe('getTraitById', () => {
    beforeEach(async () => {
      await db.loadDefaultDatabase('en-US');
    });

    it('should find existing trait', () => {
      const trait = db.getTraitById('analytical');
      expect(trait).toBeDefined();
      expect(trait?.id).toBe('analytical');
    });

    it('should return undefined for non-existent trait', () => {
      const trait = db.getTraitById('non-existent-id');
      expect(trait).toBeUndefined();
    });
  });

  describe('searchTraits', () => {
    beforeEach(async () => {
      await db.loadDefaultDatabase('en-US');
    });

    it('should find traits by partial label match', () => {
      const results = db.searchTraits('ana');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((t) => t.label.toLowerCase().includes('ana'))).toBe(true);
    });

    it('should filter by polarity when specified', () => {
      const results = db.searchTraits('a', 'positive');
      expect(results.every((t) => t.polarity === 'positive')).toBe(true);
    });

    it('should be case-insensitive', () => {
      const resultsLower = db.searchTraits('analytical');
      const resultsUpper = db.searchTraits('ANALYTICAL');
      expect(resultsLower).toEqual(resultsUpper);
    });

    it('should return empty array for empty query', () => {
      const results = db.searchTraits('');
      expect(results).toEqual([]);
    });
  });

  describe('getLinkedTraits', () => {
    beforeEach(async () => {
      await db.loadDefaultDatabase('en-US');
    });

    it('should return linked traits via excess type', () => {
      const links = db.getLinkedTraits('analytical', 'excess', 10);
      expect(links.length).toBeGreaterThan(0);
      expect(links.every((t) => t.polarity === 'negative')).toBe(true);
    });

    it('should return linked traits via balance type', () => {
      const links = db.getLinkedTraits('overthinking', 'balance', 10);
      expect(links.length).toBeGreaterThan(0);
      expect(links.every((t) => t.polarity === 'positive')).toBe(true);
    });

    it('should limit results to maxResults', () => {
      const links = db.getLinkedTraits('analytical', 'excess', 3);
      expect(links.length).toBeLessThanOrEqual(3);
    });

    it('should return random subset when more than maxResults', () => {
      // analytical has 5 excess links, request 3
      const links1 = db.getLinkedTraits('analytical', 'excess', 3);
      const links2 = db.getLinkedTraits('analytical', 'excess', 3);

      expect(links1.length).toBe(3);
      expect(links2.length).toBe(3);
      // Note: randomness means they might be the same sometimes
    });

    it('should return empty array for non-existent trait', () => {
      const links = db.getLinkedTraits('non-existent', 'excess', 5);
      expect(links).toEqual([]);
    });
  });

  describe('getReverseLinkedTraits', () => {
    beforeEach(async () => {
      await db.loadDefaultDatabase('en-US');
    });

    it('should return traits that link TO this trait via excess', () => {
      // overthinking is linked FROM analytical via excess
      const reverseLinks = db.getReverseLinkedTraits('overthinking', 'excess', 10);
      expect(reverseLinks.length).toBeGreaterThan(0);
      expect(reverseLinks.some((t) => t.id === 'analytical')).toBe(true);
      expect(reverseLinks.every((t) => t.polarity === 'positive')).toBe(true);
    });

    it('should return traits that link TO this trait via balance', () => {
      // intuition is linked TO FROM overthinking via balance
      const reverseLinks = db.getReverseLinkedTraits('intuition', 'balance', 10);
      expect(reverseLinks.length).toBeGreaterThan(0);
      expect(reverseLinks.every((t) => t.polarity === 'negative')).toBe(true);
    });

    it('should limit results to maxResults', () => {
      const reverseLinks = db.getReverseLinkedTraits('intuition', 'balance', 3);
      expect(reverseLinks.length).toBeLessThanOrEqual(3);
    });

    it('should return random subset when more than maxResults', () => {
      const links1 = db.getReverseLinkedTraits('intuition', 'balance', 3);
      const links2 = db.getReverseLinkedTraits('intuition', 'balance', 3);

      expect(links1.length).toBe(3);
      expect(links2.length).toBe(3);
    });

    it('should return empty array for non-existent trait', () => {
      const reverseLinks = db.getReverseLinkedTraits('non-existent', 'excess', 5);
      expect(reverseLinks).toEqual([]);
    });
  });
});
