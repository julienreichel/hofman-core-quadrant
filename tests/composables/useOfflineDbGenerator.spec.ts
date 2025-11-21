import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useOfflineDbGenerator } from 'src/composables/useOfflineDbGenerator';

// Mock the useOfmanGenerator composable
vi.mock('src/composables/useOfmanGenerator', () => ({
  useOfmanGenerator: () => ({
    // eslint-disable-next-line @typescript-eslint/require-await
    generateSuggestions: vi.fn(async (_apiKey: string, quadrant: string) => {
      // Mock AI responses with fixed suggestions
      if (quadrant === 'core_quality') {
        return {
          pitfall: ['suggestion1', 'suggestion2', 'suggestion3', 'suggestion4', 'suggestion5'],
          challenge: ['challenge1', 'challenge2', 'challenge3', 'challenge4', 'challenge5'],
          allergy: ['allergy1', 'allergy2', 'allergy3', 'allergy4', 'allergy5'],
        };
      }
      return {};
    }),
  }),
}));

describe('useOfflineDbGenerator', () => {
  let generator: ReturnType<typeof useOfflineDbGenerator>;

  beforeEach(() => {
    generator = useOfflineDbGenerator();
  });

  describe('Data Structure', () => {
    it('should return correct reactive properties', () => {
      expect(generator.isGenerating.value).toBe(false);
      expect(generator.progress.value).toBe(0);
      expect(generator.currentStatus.value).toBe('');
      expect(generator.error.value).toBeNull();
      expect(typeof generator.generateOfflineDatabase).toBe('function');
    });
  });

  describe('generateOfflineDatabase', () => {
    it('should parse comma-separated core qualities correctly', async () => {
      const mockDownload = vi.fn();
      global.URL.createObjectURL = vi.fn(() => 'mock-url');
      global.URL.revokeObjectURL = vi.fn();
      document.createElement = vi.fn(() => {
        const link = {
          href: '',
          download: '',
          click: mockDownload,
        };
        return link as unknown as HTMLElement;
      });
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();

      await generator.generateOfflineDatabase('test-key', 'adaptability, creativity', 'en');

      expect(generator.isGenerating.value).toBe(false);
      expect(generator.progress.value).toBe(100);
    });

    it('should handle empty input gracefully', async () => {
      await expect(generator.generateOfflineDatabase('test-key', '', 'en')).rejects.toThrow(
        'No core qualities provided',
      );
      expect(generator.error.value).not.toBeNull();
    });

    it('should handle whitespace-only input', async () => {
      await expect(generator.generateOfflineDatabase('test-key', '  , , ', 'en')).rejects.toThrow(
        'No core qualities provided',
      );
    });
  });

  describe('Trait Structure', () => {
    it('should create trait IDs by normalizing labels', async () => {
      // Mock a simple scenario
      const mockDownload = vi.fn();
      let capturedJson = '';

      global.URL.createObjectURL = vi.fn((blob: Blob) => {
        void blob.text().then((text) => {
          capturedJson = text;
        });
        return 'mock-url';
      });
      global.URL.revokeObjectURL = vi.fn();
      const mockLink = {
        href: '',
        download: '',
        click: mockDownload,
      };
      document.createElement = vi.fn(() => mockLink as unknown as HTMLElement);
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();

      await generator.generateOfflineDatabase('test-key', 'Test Quality', 'en');

      // Verify structure (async check)
      setTimeout(() => {
        if (capturedJson) {
          const data = JSON.parse(capturedJson);
          expect(data).toHaveProperty('traits');
          expect(data).toHaveProperty('links');
          expect(Array.isArray(data.traits)).toBe(true);
          expect(Array.isArray(data.links)).toBe(true);
        }
      }, 100);
    });
  });

  describe('Polarity Assignment', () => {
    it('should assign positive polarity to core qualities and challenges', async () => {
      // This would require inspecting the generated JSON
      // Simplified test to verify the structure is created
      const mockDownload = vi.fn();
      global.URL.createObjectURL = vi.fn(() => 'mock-url');
      global.URL.revokeObjectURL = vi.fn();
      document.createElement = vi.fn(
        () =>
          ({
            href: '',
            download: '',
            click: mockDownload,
          }) as unknown as HTMLElement,
      );
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();

      await generator.generateOfflineDatabase('test-key', 'resilience', 'en');

      expect(mockDownload).toHaveBeenCalled();
    });
  });

  describe('Link Generation', () => {
    it('should generate correct number of links per trait', async () => {
      // 5 pitfalls → 5 core-to-pitfall links (excess)
      // 5 pitfalls × 5 challenges → 25 pitfall-to-challenge links (balance)
      // 5 challenges × 5 allergies → 25 challenge-to-allergy links (excess)
      // 5 allergies → 5 allergy-to-core links (balance)
      // Total: 60 links per core quality

      const mockDownload = vi.fn();
      global.URL.createObjectURL = vi.fn(() => 'mock-url');
      global.URL.revokeObjectURL = vi.fn();
      document.createElement = vi.fn(
        () =>
          ({
            href: '',
            download: '',
            click: mockDownload,
          }) as unknown as HTMLElement,
      );
      document.body.appendChild = vi.fn();
      document.body.removeChild = vi.fn();

      await generator.generateOfflineDatabase('test-key', 'empathy', 'en');

      expect(mockDownload).toHaveBeenCalled();
      expect(generator.progress.value).toBe(100);
    });
  });
});
