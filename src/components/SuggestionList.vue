<template>
  <div class="suggestion-list">
    <q-chip
      v-for="(suggestion, index) in suggestions"
      :key="index"
      clickable
      :outline="selected !== suggestion"
      :color="selected === suggestion ? 'primary' : 'blue-2'"
      :text-color="selected === suggestion ? 'white' : 'blue-9'"
      @click="handleSelect(suggestion)"
    >
      {{ suggestion }}
    </q-chip>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  suggestions: string[];
  selected?: string;
}>();

const emit = defineEmits<{
  select: [word: string];
}>();

const handleSelect = (word: string) => {
  emit('select', word);
};
</script>

<style scoped lang="scss">
.suggestion-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
