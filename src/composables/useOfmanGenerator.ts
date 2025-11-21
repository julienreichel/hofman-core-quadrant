/**
 * useOfmanGenerator - Handles OpenAI API calls for quadrant generation
 *
 * Responsibilities:
 * - Call OpenAI GPT-4o-mini API (online mode)
 * - Use offline database for suggestions (offline mode)
 * - Handle loading and error states
 * - Parse AI responses into suggestions
 */

import { ref } from 'vue';
import type { QuadrantType, QuadrantSuggestions } from './useQuadrantState';
import { usePromptBuilder } from './usePromptBuilder';
import { useOfflineDatabase } from './useOfflineDatabase';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

export function useOfmanGenerator() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const { buildPrompt } = usePromptBuilder();
  const { getLinkedTraits } = useOfflineDatabase();

  /**
   * Generate suggestions using offline database
   * Uses links to traverse from the input trait
   * Simplified: Only supports starting from core_quality
   */
  const generateOfflineSuggestions = (
    inputQuadrant: QuadrantType,
    inputTraitId: string,
  ): Partial<QuadrantSuggestions> => {
    // For MVP, only support starting from core_quality
    if (inputQuadrant !== 'core_quality') {
      throw new Error('Offline mode currently only supports starting from core quality');
    }

    const result: Partial<QuadrantSuggestions> = {};

    // core_quality → pitfall (excess links)
    const pitfalls = getLinkedTraits(inputTraitId, 'excess', 5);
    result.pitfall = pitfalls.map((t) => t.label);

    // For each pitfall, get challenges (balance links)
    const allChallenges = pitfalls.flatMap((pitfall) =>
      getLinkedTraits(pitfall.id, 'balance', 5)
    );
    // Deduplicate and pick 5 random
    const uniqueChallenges = Array.from(
      new Map(allChallenges.map((t) => [t.id, t])).values()
    );
    const shuffled = uniqueChallenges.sort(() => Math.random() - 0.5);
    result.challenge = shuffled.slice(0, 5).map((t) => t.label);

    // From challenges, get allergies (excess links)
    const allAllergies = shuffled.slice(0, 5).flatMap((challenge) =>
      getLinkedTraits(challenge.id, 'excess', 5)
    );
    const uniqueAllergies = Array.from(
      new Map(allAllergies.map((t) => [t.id, t])).values()
    );
    const shuffledAllergies = uniqueAllergies.sort(() => Math.random() - 0.5);
    result.allergy = shuffledAllergies.slice(0, 5).map((t) => t.label);

    return result;
  };

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
    generateOfflineSuggestions,
  };
}
