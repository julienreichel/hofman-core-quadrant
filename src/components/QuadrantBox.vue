<template>
  <q-card flat bordered class="quadrant-box">
    <q-card-section>
      <div class="text-h6">{{ $t(`quadrant.${quadrantType}.label`) }}</div>
      <div class="text-caption text-grey-7">
        {{ $t(`quadrant.${quadrantType}.description`) }}
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <!-- Input field (only when no value selected) -->
      <!-- Use autocomplete select in offline mode, regular input in online mode -->
      <q-select
        v-if="!selectedWord && isOfflineMode"
        :model-value="inputValue"
        :options="filteredOptions"
        :placeholder="$t(`quadrant.${quadrantType}.placeholder`)"
        outlined
        dense
        use-input
        input-debounce="0"
        @filter="filterOptions"
        @update:model-value="handleSelect"
        @input-value="handleInput"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              {{ $t('quadrant.noMatches') }}
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-input
        v-else-if="!selectedWord"
        :model-value="inputValue"
        :placeholder="$t(`quadrant.${quadrantType}.placeholder`)"
        outlined
        dense
        @update:model-value="handleInput"
      />

      <!-- Selected word -->
      <div v-if="selectedWord" class="selected-word">
        <div class="text-caption text-grey-7">{{ $t('quadrant.selected') }}</div>
        <div class="text-h6 text-primary">{{ selectedWord }}</div>
      </div>

      <!-- Suggestions list (only show when no word selected) -->
      <div v-if="suggestions.length > 0 && !selectedWord" class="q-mt-md">
        <div class="text-caption text-grey-7 q-mb-sm">
          {{ $t('quadrant.suggestions') }}
        </div>
        <SuggestionList
          :suggestions="suggestions"
          :selected="selectedWord"
          @select="handleSelect"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { QuadrantType } from 'src/composables/useQuadrantState';
import SuggestionList from 'components/SuggestionList.vue';

const props = defineProps<{
  quadrantType: QuadrantType;
  inputValue: string;
  selectedWord: string;
  suggestions: string[];
  isOfflineMode: boolean;
  availableTraits: string[];
}>();

const emit = defineEmits<{
  input: [value: string];
  select: [word: string];
}>();

const filteredOptions = ref<string[]>([]);

const handleInput = (value: string | number | null) => {
  emit('input', String(value || ''));
};

const handleSelect = (word: string) => {
  emit('select', word);
};

const filterOptions = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    if (val === '') {
      filteredOptions.value = [];
    } else {
      const needle = val.toLowerCase();
      filteredOptions.value = props.availableTraits
        .filter((v) => v.toLowerCase().includes(needle))
        .slice(0, 5);
    }
  });
};
</script>

<style scoped lang="scss">
.quadrant-box {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.selected-word {
  padding: 12px;
  background-color: rgba(25, 118, 210, 0.1);
  border-radius: 4px;
}
</style>
