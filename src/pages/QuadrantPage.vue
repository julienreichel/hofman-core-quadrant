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
          @input="(value) => handleInput('core_quality', value)"
          @select="(word) => selectWord('core_quality', word)"
        />

        <!-- Pitfall (top-right) -->
        <quadrant-box
          quadrant-type="pitfall"
          :input-value="getInputValue('pitfall')"
          :selected-word="selectedWords.pitfall"
          :suggestions="suggestions.pitfall"
          @input="(value) => handleInput('pitfall', value)"
          @select="(word) => selectWord('pitfall', word)"
        />

        <!-- Allergy (bottom-left) -->
        <quadrant-box
          quadrant-type="allergy"
          :input-value="getInputValue('allergy')"
          :selected-word="selectedWords.allergy"
          :suggestions="suggestions.allergy"
          @input="(value) => handleInput('allergy', value)"
          @select="(word) => selectWord('allergy', word)"
        />

        <!-- Challenge (bottom-right) -->
        <quadrant-box
          quadrant-type="challenge"
          :input-value="getInputValue('challenge')"
          :selected-word="selectedWords.challenge"
          :suggestions="suggestions.challenge"
          @input="(value) => handleInput('challenge', value)"
          @select="(word) => selectWord('challenge', word)"
        />
      </div>

      <!-- Generate Panel (hide when all quadrants are complete) -->
      <div v-if="!allQuadrantsComplete" class="q-mt-md">
        <generate-panel
          :loading="isLoading"
          :error="errorMessage"
          :can-generate="canGenerate"
          @generate="handleGenerate"
          @reset="handleReset"
        />
      </div>
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
import { useLanguage } from 'src/composables/useLanguage';
import QuadrantBox from 'components/QuadrantBox.vue';
import GeneratePanel from 'components/GeneratePanel.vue';

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

const { generateSuggestions, isLoading, error } = useOfmanGenerator();

// Local state
const errorMessage = ref<string | null>(null);

// Computed
const canGenerate = computed(() => {
  return hasKey.value && isValidKey.value && isReadyToGenerate.value;
});

const allQuadrantsComplete = computed(() => {
  return (
    selectedWords.value.core_quality !== '' &&
    selectedWords.value.pitfall !== '' &&
    selectedWords.value.challenge !== '' &&
    selectedWords.value.allergy !== ''
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
      currentLang.value,
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
