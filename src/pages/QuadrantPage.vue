<template>
  <q-page class="q-pa-md">
    <div class="quadrant-container">
      <!-- 2x2 Grid: Quality-Pitfall / Allergy-Challenge -->
      <div class="quadrant-grid">
        <!-- Core Quality (top-left) -->
        <quadrant-box
          quadrant-type="core_quality"
          :input-value="getInputValue('core_quality')"
          :selected-word="selectedWords.core_quality"
          :suggestions="suggestions.core_quality"
          :is-offline-mode="!hasKey"
          :available-traits="getAvailableTraits('core_quality')"
          @input="(value) => handleInput('core_quality', value)"
          @select="(word) => selectWord('core_quality', word)"
        />

        <!-- Pitfall (top-right) -->
        <quadrant-box
          quadrant-type="pitfall"
          :input-value="getInputValue('pitfall')"
          :selected-word="selectedWords.pitfall"
          :suggestions="suggestions.pitfall"
          :is-offline-mode="!hasKey"
          :available-traits="getAvailableTraits('pitfall')"
          @input="(value) => handleInput('pitfall', value)"
          @select="(word) => selectWord('pitfall', word)"
        />

        <!-- Allergy (bottom-left) -->
        <quadrant-box
          quadrant-type="allergy"
          :input-value="getInputValue('allergy')"
          :selected-word="selectedWords.allergy"
          :suggestions="suggestions.allergy"
          :is-offline-mode="!hasKey"
          :available-traits="getAvailableTraits('allergy')"
          @input="(value) => handleInput('allergy', value)"
          @select="(word) => selectWord('allergy', word)"
        />

        <!-- Challenge (bottom-right) -->
        <quadrant-box
          quadrant-type="challenge"
          :input-value="getInputValue('challenge')"
          :selected-word="selectedWords.challenge"
          :suggestions="suggestions.challenge"
          :is-offline-mode="!hasKey"
          :available-traits="getAvailableTraits('challenge')"
          @input="(value) => handleInput('challenge', value)"
          @select="(word) => selectWord('challenge', word)"
        />
      </div>

      <!-- Generate Panel (hide Generate button when all quadrants complete) -->
      <div class="q-mt-md">
        <generate-panel
          :loading="isLoading"
          :error="errorMessage"
          :can-generate="canGenerate"
          :show-generate="!allQuadrantsComplete"
          @generate="handleGenerate"
          @reset="handleReset"
        />
      </div>
    </div>

    <!-- Offline DB Generator Button (only when API key is set) -->
    <generate-offline-db-button v-if="hasKey" />

    <!-- Import Database Button (only when NO API key is set) -->
    <import-database-button v-if="!hasKey" />
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import type { QuadrantType } from 'src/composables/useQuadrantState';
import { useApiKey } from 'src/composables/useApiKey';
import { useQuadrantState } from 'src/composables/useQuadrantState';
import { useOfmanGenerator } from 'src/composables/useOfmanGenerator';
import { useLanguage } from 'src/composables/useLanguage';
import { useOfflineDatabase } from 'src/composables/useOfflineDatabase';
import QuadrantBox from 'components/QuadrantBox.vue';
import GeneratePanel from 'components/GeneratePanel.vue';
import GenerateOfflineDbButton from 'components/GenerateOfflineDbButton.vue';
import ImportDatabaseButton from 'components/ImportDatabaseButton.vue';

const { t } = useI18n();
const $q = useQuasar();

// Composables
const { apiKey, hasKey, isValidKey } = useApiKey();
const { currentLang } = useLanguage();
const {
  inputQuadrant,
  inputValue,
  suggestions,
  selectedWords,
  setInput,
  setSuggestions,
  selectWord,
  isReadyToGenerate,
  reset,
} = useQuadrantState();

const { generateSuggestions, generateOfflineSuggestions, isLoading, error } = useOfmanGenerator();
const { loadDefaultDatabase, searchTraits, getTraitsByPolarity } = useOfflineDatabase();

// Local state
const errorMessage = ref<string | null>(null);

// Get available traits for autocomplete based on quadrant type
const getAvailableTraits = (quadrant: QuadrantType): string[] => {
  // Determine polarity based on quadrant type
  // core_quality and challenge are positive traits
  // pitfall and allergy are negative traits
  const polarity =
    quadrant === 'core_quality' || quadrant === 'challenge' ? 'positive' : 'negative';

  // Flatten all labels from all traits with matching polarity
  const allLabels = getTraitsByPolarity(polarity).flatMap((trait) => trait.labels);
  
  // Capitalize first letter of each label for uniform display
  const capitalizedLabels = allLabels.map((label) => {
    return label.charAt(0).toUpperCase() + label.slice(1);
  });
  
  // Deduplicate labels after capitalization (avoids "analytical" and "Analytical" as separate entries)
  return Array.from(new Set(capitalizedLabels));
};

// Initialize offline database on mount
onMounted(async () => {
  // Convert 'en'/'fr' to 'en-US'/'fr-FR' for database loading
  const dbLang = currentLang.value === 'fr' ? 'fr-FR' : 'en-US';
  try {
    await loadDefaultDatabase(dbLang);
  } catch (error) {
    console.error('Failed to load offline database:', error);
  }
});

// Computed
const canGenerate = computed(() => {
  // Can generate with API key OR in offline mode
  return isReadyToGenerate.value && ((hasKey.value && isValidKey.value) || !hasKey.value);
});

const allQuadrantsComplete = computed(() => {
  const words = selectedWords.value;
  return (
    words.core_quality.length > 0 &&
    words.pitfall.length > 0 &&
    words.challenge.length > 0 &&
    words.allergy.length > 0
  );
});

// Get input value for a specific quadrant
const getInputValue = (quadrant: QuadrantType) => {
  return inputQuadrant.value === quadrant ? inputValue.value : '';
};

// Handle input from a quadrant
const handleInput = (quadrant: QuadrantType, value: string) => {
  setInput(quadrant, value);
  errorMessage.value = null;
};

// Handle generate button
const handleGenerate = async () => {
  errorMessage.value = null;

  // Validation
  if (!isReadyToGenerate.value) {
    errorMessage.value = t('errors.noInput');
    return;
  }

  try {
    let newSuggestions;

    if (hasKey.value && isValidKey.value) {
      // Online mode: use OpenAI API
      newSuggestions = await generateSuggestions(
        apiKey.value,
        inputQuadrant.value!,
        inputValue.value,
        currentLang.value,
      );
    } else {
      // Offline mode: use database links
      // Determine polarity based on input quadrant
      // core_quality and challenge are positive traits
      // pitfall and allergy are negative traits
      const polarity =
        inputQuadrant.value === 'core_quality' || inputQuadrant.value === 'challenge'
          ? 'positive'
          : 'negative';

      const matchingTraits = searchTraits(inputValue.value, polarity);

      if (matchingTraits.length === 0) {
        throw new Error(
          'Trait not found in database. Please select from autocomplete suggestions.',
        );
      }

      // Use the first matching trait
      const selectedTrait = matchingTraits[0];
      if (!selectedTrait) {
        throw new Error('Invalid trait selection');
      }
      newSuggestions = generateOfflineSuggestions(inputQuadrant.value!, selectedTrait.id);
    }

    setSuggestions(newSuggestions);

    // Set the user's input as the selected word for that quadrant
    selectWord(inputQuadrant.value!, inputValue.value);

    $q.notify({
      type: 'positive',
      message: 'Suggestions generated successfully!',
      position: 'top',
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : t('errors.generationFailed');
    errorMessage.value = error.value || errMsg;
    $q.notify({
      type: 'negative',
      message: errorMessage.value,
      position: 'top',
    });
  }
};

// Handle reset button
const handleReset = () => {
  reset();
  errorMessage.value = null;
  $q.notify({
    type: 'info',
    message: 'Quadrant reset',
    position: 'top',
  });
};
</script>

<style scoped lang="scss">
.quadrant-container {
  max-width: 1200px;
  margin: 0 auto;
}

.quadrant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
