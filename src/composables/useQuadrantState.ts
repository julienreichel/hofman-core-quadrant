/**
 * useQuadrantState - Manages the state of the Ofman quadrant
 *
 * Responsibilities:
 * - Track user input for one quadrant
 * - Store AI-generated suggestions for remaining quadrants
 * - Track selected final words
 * - Provide reset functionality
 * - Determine readiness for generation
 */

import { ref, computed } from 'vue';

export type QuadrantType = 'core_quality' | 'pitfall' | 'challenge' | 'allergy';

export interface QuadrantSuggestions {
  core_quality: string[];
  pitfall: string[];
  challenge: string[];
  allergy: string[];
}

export interface SelectedWords {
  core_quality: string;
  pitfall: string;
  challenge: string;
  allergy: string;
}

export function useQuadrantState() {
  // Which quadrant the user is entering
  const inputQuadrant = ref<QuadrantType | null>(null);
  const inputValue = ref<string>('');

  // AI-generated suggestions (5 per quadrant)
  const suggestions = ref<QuadrantSuggestions>({
    core_quality: [],
    pitfall: [],
    challenge: [],
    allergy: [],
  });

  // User-selected final words
  const selectedWords = ref<SelectedWords>({
    core_quality: '',
    pitfall: '',
    challenge: '',
    allergy: '',
  });

  // Set the input quadrant and value
  const setInput = (quadrant: QuadrantType, value: string) => {
    inputQuadrant.value = quadrant;
    inputValue.value = value;
    selectedWords.value[quadrant] = value; // User input becomes selected word
  };

  // Set suggestions from AI generation
  const setSuggestions = (newSuggestions: Partial<QuadrantSuggestions>) => {
    suggestions.value = { ...suggestions.value, ...newSuggestions };
  };

  // Select a word for a specific quadrant
  const selectWord = (quadrant: QuadrantType, word: string) => {
    selectedWords.value[quadrant] = word;
  };

  // Check if ready to generate (has input quadrant and value)
  const isReadyToGenerate = computed(() => {
    return inputQuadrant.value !== null && inputValue.value.trim().length > 0;
  });

  // Reset all state except input
  const reset = () => {
    inputQuadrant.value = null;
    inputValue.value = '';
    suggestions.value = {
      core_quality: [],
      pitfall: [],
      challenge: [],
      allergy: [],
    };
    selectedWords.value = {
      core_quality: '',
      pitfall: '',
      challenge: '',
      allergy: '',
    };
  };

  return {
    inputQuadrant,
    inputValue,
    suggestions,
    selectedWords,
    setInput,
    setSuggestions,
    selectWord,
    isReadyToGenerate,
    reset,
  };
}
