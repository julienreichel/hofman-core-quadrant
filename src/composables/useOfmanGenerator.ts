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
   * Uses links to traverse from the input trait following the circular pattern:
   * core_quality → pitfall → challenge → allergy → core_quality
   * Returns all labels from linked traits (up to 5 labels per quadrant)
   */
  const generateOfflineSuggestions = (
    inputQuadrant: QuadrantType,
    inputTraitId: string,
  ): Partial<QuadrantSuggestions> => {
    const result: Partial<QuadrantSuggestions> = {};

    // Define the circular order of quadrants
    const quadrantOrder: QuadrantType[] = ['core_quality', 'pitfall', 'challenge', 'allergy'];

    // Define link types between quadrants (alternates: excess, balance, excess, balance)
    // core→pitfall: excess, pitfall→challenge: balance, challenge→allergy: excess, allergy→core: balance
    const linkTypes: Array<'excess' | 'balance'> = ['excess', 'balance', 'excess', 'balance'];

    // Find starting position
    const startIndex = quadrantOrder.indexOf(inputQuadrant);

    // Track current traits for traversal (use TraitNode type from database)
    let currentTraits: Array<{ id: string; labels: string[] }> = [{ id: inputTraitId, labels: [] }];

    // Iterate through the next 3 quadrants (skip the input quadrant)
    for (let i = 1; i <= 3; i++) {
      const currentIndex = (startIndex + i) % 4;
      const targetQuadrant = quadrantOrder[currentIndex];
      const linkTypeIndex = (startIndex + i - 1) % 4;
      const linkType = linkTypes[linkTypeIndex]!; // Safe to assert - always valid index

      // Get all linked traits from current traits
      const allNextTraits = currentTraits.flatMap((trait) =>
        getLinkedTraits(trait.id, linkType, 5),
      );

      // Deduplicate and pick up to 5 traits
      const uniqueTraits = Array.from(new Map(allNextTraits.map((t) => [t.id, t])).values());
      const shuffledTraits = uniqueTraits.sort(() => Math.random() - 0.5);
      const selectedTraits = shuffledTraits.slice(0, 5);

      // Flatten all labels from selected traits
      const allLabels = selectedTraits.flatMap((t) => t.labels);

      // Randomly select 5 labels if more than 5 available (provides variety on each generation)
      const finalLabels =
        allLabels.length > 5 ? allLabels.sort(() => Math.random() - 0.5).slice(0, 5) : allLabels;

      // Store result
      if (targetQuadrant) {
        result[targetQuadrant] = finalLabels;
      }

      // Update current traits for next iteration
      currentTraits = selectedTraits;
    }

    return result;
  };

  /**
   * Generate quadrant suggestions using OpenAI
   * @param apiKey - OpenAI API key
   * @param inputQuadrant - Which quadrant the user provided
   * @param inputValue - The trait/word the user entered
   * @param language - The language for suggestions ('en' or 'fr')
   * @param includeInputQuadrant - Whether to include GPT suggestions for the input quadrant (default: false for UI, true for database generation)
   * @returns Partial suggestions object (optionally excluding the input quadrant)
   */
  const generateSuggestions = async (
    apiKey: string,
    inputQuadrant: QuadrantType,
    inputValue: string,
    language: 'en' | 'fr' = 'en',
    includeInputQuadrant = false,
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

      // Optionally remove the input quadrant from suggestions (for UI usage)
      // For database generation, we keep all quadrants to get GPT's synonym suggestions
      if (!includeInputQuadrant) {
        const result: Partial<QuadrantSuggestions> = { ...suggestions };
        delete result[inputQuadrant];
        return result;
      }

      return suggestions;
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
