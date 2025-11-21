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
  const { getLinkedTraits, getReverseLinkedTraits } = useOfflineDatabase();

  /**
   * Generate suggestions using offline database
   * Uses links to traverse from the input trait
   * Supports starting from any quadrant
   */
  const generateOfflineSuggestions = (
    inputQuadrant: QuadrantType,
    inputTraitId: string,
  ): Partial<QuadrantSuggestions> => {
    const result: Partial<QuadrantSuggestions> = {};

    if (inputQuadrant === 'core_quality') {
      // STARTING FROM CORE QUALITY (positive trait)
      // core_quality → pitfall (excess links)
      const pitfalls = getLinkedTraits(inputTraitId, 'excess', 5);
      result.pitfall = pitfalls.map((t) => t.label);

      // pitfall → challenge (balance links)
      const allChallenges = pitfalls.flatMap((pitfall) =>
        getLinkedTraits(pitfall.id, 'balance', 5),
      );
      const uniqueChallenges = Array.from(new Map(allChallenges.map((t) => [t.id, t])).values());
      const shuffledChallenges = uniqueChallenges.sort(() => Math.random() - 0.5);
      result.challenge = shuffledChallenges.slice(0, 5).map((t) => t.label);

      // challenge → allergy (excess links)
      const allAllergies = shuffledChallenges
        .slice(0, 5)
        .flatMap((challenge) => getLinkedTraits(challenge.id, 'excess', 5));
      const uniqueAllergies = Array.from(new Map(allAllergies.map((t) => [t.id, t])).values());
      const shuffledAllergies = uniqueAllergies.sort(() => Math.random() - 0.5);
      result.allergy = shuffledAllergies.slice(0, 5).map((t) => t.label);
    } else if (inputQuadrant === 'pitfall') {
      // STARTING FROM PITFALL (negative trait)
      // pitfall → challenge (balance links - forward)
      const challenges = getLinkedTraits(inputTraitId, 'balance', 5);
      result.challenge = challenges.map((t) => t.label);

      // pitfall ← core_quality (excess links - reverse)
      const coreQualities = getReverseLinkedTraits(inputTraitId, 'excess', 5);
      result.core_quality = coreQualities.map((t) => t.label);

      // challenge → allergy (excess links)
      const allAllergies = challenges.flatMap((challenge) =>
        getLinkedTraits(challenge.id, 'excess', 5),
      );
      const uniqueAllergies = Array.from(new Map(allAllergies.map((t) => [t.id, t])).values());
      const shuffledAllergies = uniqueAllergies.sort(() => Math.random() - 0.5);
      result.allergy = shuffledAllergies.slice(0, 5).map((t) => t.label);
    } else if (inputQuadrant === 'challenge') {
      // STARTING FROM CHALLENGE (positive trait)
      // challenge → allergy (excess links - forward)
      const allergies = getLinkedTraits(inputTraitId, 'excess', 5);
      result.allergy = allergies.map((t) => t.label);

      // challenge ← pitfall (balance links - reverse)
      const pitfalls = getReverseLinkedTraits(inputTraitId, 'balance', 5);
      result.pitfall = pitfalls.map((t) => t.label);

      // pitfall ← core_quality (excess links - reverse)
      const allCoreQualities = pitfalls.flatMap((pitfall) =>
        getReverseLinkedTraits(pitfall.id, 'excess', 5),
      );
      const uniqueCoreQualities = Array.from(
        new Map(allCoreQualities.map((t) => [t.id, t])).values(),
      );
      const shuffledCoreQualities = uniqueCoreQualities.sort(() => Math.random() - 0.5);
      result.core_quality = shuffledCoreQualities.slice(0, 5).map((t) => t.label);
    } else if (inputQuadrant === 'allergy') {
      // STARTING FROM ALLERGY (negative trait)
      // allergy ← challenge (excess links - reverse)
      const challenges = getReverseLinkedTraits(inputTraitId, 'excess', 5);
      result.challenge = challenges.map((t) => t.label);

      // challenge ← pitfall (balance links - reverse)
      const allPitfalls = challenges.flatMap((challenge) =>
        getReverseLinkedTraits(challenge.id, 'balance', 5),
      );
      const uniquePitfalls = Array.from(new Map(allPitfalls.map((t) => [t.id, t])).values());
      const shuffledPitfalls = uniquePitfalls.sort(() => Math.random() - 0.5);
      result.pitfall = shuffledPitfalls.slice(0, 5).map((t) => t.label);

      // pitfall ← core_quality (excess links - reverse)
      const allCoreQualities = shuffledPitfalls
        .slice(0, 5)
        .flatMap((pitfall) => getReverseLinkedTraits(pitfall.id, 'excess', 5));
      const uniqueCoreQualities = Array.from(
        new Map(allCoreQualities.map((t) => [t.id, t])).values(),
      );
      const shuffledCoreQualities = uniqueCoreQualities.sort(() => Math.random() - 0.5);
      result.core_quality = shuffledCoreQualities.slice(0, 5).map((t) => t.label);
    }

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
