<template>
  <q-page class="q-pa-md">
    <div class="quadrant-container">
      <!-- 2x2 Grid -->
      <div class="quadrant-grid">
        <!-- Core Quality -->
        <quadrant-box
          quadrant-type="core_quality"
          :input-value="getInputValue('core_quality')"
          :selected-word="selectedWords.core_quality"
          :suggestions="suggestions.core_quality"
          @input="(value) => handleInput('core_quality', value)"
          @select="(word) => selectWord('core_quality', word)"
        />

        <!-- Pitfall -->
        <quadrant-box
          quadrant-type="pitfall"
          :input-value="getInputValue('pitfall')"
          :selected-word="selectedWords.pitfall"
          :suggestions="suggestions.pitfall"
          @input="(value) => handleInput('pitfall', value)"
          @select="(word) => selectWord('pitfall', word)"
        />

        <!-- Challenge -->
        <quadrant-box
          quadrant-type="challenge"
          :input-value="getInputValue('challenge')"
          :selected-word="selectedWords.challenge"
          :suggestions="suggestions.challenge"
          @input="(value) => handleInput('challenge', value)"
          @select="(word) => selectWord('challenge', word)"
        />

        <!-- Allergy -->
        <quadrant-box
          quadrant-type="allergy"
          :input-value="getInputValue('allergy')"
          :selected-word="selectedWords.allergy"
          :suggestions="suggestions.allergy"
          @input="(value) => handleInput('allergy', value)"
          @select="(word) => selectWord('allergy', word)"
        />
      </div>

      <!-- Generate Panel -->
      <div class="q-mt-md">
        <generate-panel
          :loading="isLoading"
          :error="errorMessage"
          :can-generate="canGenerate"
          @generate="handleGenerate"
          @reset="handleReset"
        />
      </div>

      <!-- Summary View (Optional) -->
      <summary-view :selected-words="selectedWords" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import type { QuadrantType } from 'src/composables/useQuadrantState';
import { useApiKey } from 'src/composables/useApiKey';
import { useQuadrantState } from 'src/composables/useQuadrantState';
import { useOfmanGenerator } from 'src/composables/useOfmanGenerator';
import QuadrantBox from 'components/QuadrantBox.vue';
import GeneratePanel from 'components/GeneratePanel.vue';
import SummaryView from 'components/SummaryView.vue';

const { t } = useI18n();
const $q = useQuasar();

// Composables
const { apiKey, hasKey, isValidKey } = useApiKey();
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

const { generateSuggestions, isLoading, error } = useOfmanGenerator();

// Local state
const errorMessage = ref<string | null>(null);

// Computed
const canGenerate = computed(() => {
  return hasKey.value && isValidKey.value && isReadyToGenerate.value;
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
  if (!hasKey.value || !isValidKey.value) {
    errorMessage.value = t('errors.noApiKey');
    return;
  }

  if (!isReadyToGenerate.value) {
    errorMessage.value = t('errors.noInput');
    return;
  }

  try {
    const newSuggestions = await generateSuggestions(
      apiKey.value,
      inputQuadrant.value!,
      inputValue.value,
    );

    setSuggestions(newSuggestions);

    // Set the user's input as the selected word for that quadrant
    selectWord(inputQuadrant.value!, inputValue.value);

    $q.notify({
      type: 'positive',
      message: 'Suggestions generated successfully!',
      position: 'top',
    });
  } catch {
    errorMessage.value = error.value || t('errors.generationFailed');
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
