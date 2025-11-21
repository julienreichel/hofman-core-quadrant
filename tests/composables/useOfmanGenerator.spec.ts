import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { useOfmanGenerator } from 'src/composables/useOfmanGenerator';

// Mock fetch globally
global.fetch = vi.fn() as Mock;

describe('useOfmanGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with isLoading false', () => {
      const { isLoading } = useOfmanGenerator();
      expect(isLoading.value).toBe(false);
    });

    it('should initialize with no error', () => {
      const { error } = useOfmanGenerator();
      expect(error.value).toBeNull();
    });
  });

  describe('generateSuggestions', () => {
    it('should call OpenAI API with correct parameters', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                core_quality: [],
                pitfall: ['Bossy', 'Rigid', 'Domineering', 'Stubborn', 'Inflexible'],
                challenge: ['Flexible', 'Adaptable', 'Open', 'Receptive', 'Yielding'],
                allergy: ['Indecisive', 'Wishy-washy', 'Weak', 'Spineless', 'Uncertain'],
              }),
            },
          },
        ],
      };

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const { generateSuggestions } = useOfmanGenerator();
      await generateSuggestions('sk-test123', 'core_quality', 'Decisive');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer sk-test123',
          },
        }),
      );
    });

    it('should use gpt-4o-mini model', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                core_quality: [],
                pitfall: ['Bossy'],
                challenge: ['Flexible'],
                allergy: ['Indecisive'],
              }),
            },
          },
        ],
      };

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const { generateSuggestions } = useOfmanGenerator();
      await generateSuggestions('sk-test123', 'core_quality', 'Decisive');

      const callArgs = (fetch as Mock).mock.calls[0]?.[1] as RequestInit | undefined;
      expect(callArgs).toBeDefined();
      const body = JSON.parse(callArgs!.body as string);
      expect(body.model).toBe('gpt-4o-mini');
    });

    it('should set isLoading to true during API call', async () => {
      (global.fetch as Mock).mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              choices: [
                {
                  message: {
                    content: JSON.stringify({
                      pitfall: ['Bossy'],
                      challenge: ['Flexible'],
                      allergy: ['Indecisive'],
                    }),
                  },
                },
              ],
            }),
        });
      });

      const { generateSuggestions, isLoading } = useOfmanGenerator();
      const promise = generateSuggestions('sk-test123', 'core_quality', 'Decisive');

      // Should be loading at this point
      expect(isLoading.value).toBe(true);

      await promise;

      // Should not be loading anymore
      expect(isLoading.value).toBe(false);
    });

    it('should parse JSON response correctly', async () => {
      const mockSuggestions = {
        core_quality: [],
        pitfall: ['Bossy', 'Rigid', 'Domineering', 'Stubborn', 'Inflexible'],
        challenge: ['Flexible', 'Adaptable', 'Open', 'Receptive', 'Yielding'],
        allergy: ['Indecisive', 'Wishy-washy', 'Weak', 'Spineless', 'Uncertain'],
      };

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify(mockSuggestions),
                },
              },
            ],
          }),
      });

      const { generateSuggestions } = useOfmanGenerator();
      const result = await generateSuggestions('sk-test123', 'core_quality', 'Decisive');

      expect(result.pitfall).toHaveLength(5);
      expect(result.challenge).toHaveLength(5);
      expect(result.allergy).toHaveLength(5);
      expect(result.core_quality).toBeUndefined(); // Input quadrant should be excluded
    });

    it('should exclude input quadrant from result', async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                core_quality: ['Should', 'Be', 'Excluded'],
                pitfall: ['Bossy', 'Rigid'],
                challenge: ['Flexible', 'Adaptable'],
                allergy: ['Indecisive', 'Weak'],
              }),
            },
          },
        ],
      };

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const { generateSuggestions } = useOfmanGenerator();
      const result = await generateSuggestions('sk-test123', 'core_quality', 'Decisive');

      expect(result.core_quality).toBeUndefined();
      expect(result.pitfall).toBeDefined();
      expect(result.challenge).toBeDefined();
      expect(result.allergy).toBeDefined();
    });

    it('should handle API errors', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () =>
          Promise.resolve({
            error: {
              message: 'Invalid API key',
            },
          }),
      });

      const { generateSuggestions, error } = useOfmanGenerator();

      await expect(generateSuggestions('sk-invalid', 'core_quality', 'Decisive')).rejects.toThrow(
        'Invalid API key',
      );

      expect(error.value).toBe('Invalid API key');
    });

    it('should handle network errors', async () => {
      (global.fetch as Mock).mockRejectedValueOnce(new Error('Network error'));

      const { generateSuggestions, error } = useOfmanGenerator();

      await expect(generateSuggestions('sk-test123', 'core_quality', 'Decisive')).rejects.toThrow(
        'Network error',
      );

      expect(error.value).toBe('Network error');
    });

    it('should handle missing response content', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {},
              },
            ],
          }),
      });

      const { generateSuggestions, error } = useOfmanGenerator();

      await expect(generateSuggestions('sk-test123', 'core_quality', 'Decisive')).rejects.toThrow(
        'No response from API',
      );

      expect(error.value).toBe('No response from API');
    });

    it('should clear error on successful call', async () => {
      const { generateSuggestions, error } = useOfmanGenerator();

      // First call fails
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: { message: 'Server error' } }),
      });

      await expect(generateSuggestions('sk-test123', 'core_quality', 'Decisive')).rejects.toThrow();
      expect(error.value).toBe('Server error');

      // Second call succeeds
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    pitfall: ['Bossy'],
                    challenge: ['Flexible'],
                    allergy: ['Indecisive'],
                  }),
                },
              },
            ],
          }),
      });

      await generateSuggestions('sk-test123', 'core_quality', 'Decisive');
      expect(error.value).toBeNull();
    });
  });
});
