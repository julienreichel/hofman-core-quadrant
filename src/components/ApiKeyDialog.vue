<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">{{ $t('apiKeyDialog.title') }}</div>
        <div class="text-caption text-grey-7">
          {{ $t('apiKeyDialog.description') }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="localKey"
          type="password"
          :placeholder="$t('apiKeyDialog.placeholder')"
          outlined
          dense
          :error="showError"
          :error-message="$t('apiKeyDialog.invalidKey')"
        >
          <template #prepend>
            <q-icon name="key" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('apiKeyDialog.cancel')" color="grey" @click="handleCancel" />
        <q-btn flat :label="$t('apiKeyDialog.save')" color="primary" @click="handleSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useApiKey } from 'src/composables/useApiKey';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const { apiKey, saveKey, isValidKey } = useApiKey();

const localKey = ref(apiKey.value);
const showError = ref(false);
const isOpen = ref(props.modelValue);

// Sync with prop
watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
    if (newVal) {
      localKey.value = apiKey.value;
      showError.value = false;
    }
  },
);

// Sync back to parent
watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal);
});

const handleSave = () => {
  if (localKey.value.length === 0) {
    isOpen.value = false;
    return;
  }

  saveKey(localKey.value);

  // Show error if invalid, but still close after a moment
  if (!isValidKey.value) {
    showError.value = true;
    setTimeout(() => {
      isOpen.value = false;
    }, 1500);
  } else {
    isOpen.value = false;
  }
};

const handleCancel = () => {
  localKey.value = apiKey.value;
  showError.value = false;
  isOpen.value = false;
};
</script>
