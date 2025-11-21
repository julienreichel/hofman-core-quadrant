/**
 * useApiKey - Manages OpenAI API key in localStorage
 *
 * Responsibilities:
 * - Store and retrieve the API key from localStorage
 * - Validate basic format
 * - Indicate whether key is present
 */

import { ref, computed } from 'vue';

const API_KEY_STORAGE_KEY = 'openai-api-key';

export function useApiKey() {
  const apiKey = ref<string>('');

  // Load key from localStorage on initialization
  const loadKey = () => {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) {
      apiKey.value = stored;
    }
  };

  // Save key to localStorage
  const saveKey = (key: string) => {
    apiKey.value = key;
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
  };

  // Clear the API key
  const clearKey = () => {
    apiKey.value = '';
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  };

  // Basic validation (OpenAI keys start with "sk-")
  const isValidKey = computed(() => {
    return apiKey.value.startsWith('sk-') && apiKey.value.length > 20;
  });

  // Check if key is present
  const hasKey = computed(() => {
    return apiKey.value.length > 0;
  });

  // Initialize on creation
  loadKey();

  return {
    apiKey,
    saveKey,
    clearKey,
    loadKey,
    isValidKey,
    hasKey,
  };
}
