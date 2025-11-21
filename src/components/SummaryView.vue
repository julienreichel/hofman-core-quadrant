<template>
  <q-card v-if="hasAllSelections" flat bordered class="summary-view">
    <q-card-section>
      <div class="text-h6">Your Complete Ofman Quadrant</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="row q-col-gutter-sm">
        <div v-for="quadrantType in quadrantTypes" :key="quadrantType" class="col-12 col-sm-6">
          <div class="summary-item">
            <div class="text-caption text-grey-7">
              {{ $t(`quadrant.${quadrantType}.label`) }}
            </div>
            <div class="text-body1 text-weight-medium">
              {{ selectedWords[quadrantType] || '—' }}
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QuadrantType, SelectedWords } from 'src/composables/useQuadrantState';

const props = defineProps<{
  selectedWords: SelectedWords;
}>();

const quadrantTypes: QuadrantType[] = ['core_quality', 'pitfall', 'challenge', 'allergy'];

const hasAllSelections = computed(() => {
  return quadrantTypes.every((type) => props.selectedWords[type]?.length > 0);
});
</script>

<style scoped lang="scss">
.summary-view {
  margin-top: 16px;
}

.summary-item {
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 4px;
}
</style>
