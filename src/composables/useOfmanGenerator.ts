/**
 * useOfmanGenerator - Handles OpenAI API calls for quadrant generation
 *
 * Responsibilities:
 * - Call OpenAI GPT-4o-mini API
 * - Handle loading and error states
 * - Parse AI responses into suggestions
 */

import { ref } from 'vue';
import type { QuadrantType, QuadrantSuggestions } from './useQuadrantState';
import { usePromptBuilder } from './usePromptBuilder';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

export function useOfmanGenerator() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const { buildPrompt } = usePromptBuilder();

  /**
   * Generate quadrant suggestions using OpenAI
   * @param apiKey - OpenAI API key
   * @param inputQuadrant - Which quadrant the user provided
   * @param inputValue - The trait/word the user entered
   * @param language - The language for suggestions ('en' or 'fr')
   * @returns Partial suggestions object (excluding the input quadrant)
   */
  const generateSuggestions = async (
    apiKey: string,
    inputQuadrant: QuadrantType,
    inputValue: string,
    language: 'en' | 'fr' = 'en',
  ): Promise<Partial<QuadrantSuggestions>> => {
    isLoading.value = true;
    error.value = null;

    try {
      const prompt = buildPrompt(inputQuadrant, inputValue, language);

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response from API');
      }

      // Parse JSON response
      const suggestions = JSON.parse(content) as QuadrantSuggestions;

      // Remove the input quadrant from suggestions
      const result: Partial<QuadrantSuggestions> = { ...suggestions };
      delete result[inputQuadrant];

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      error.value = errorMessage;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    generateSuggestions,
  };
}
