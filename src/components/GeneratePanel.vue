<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <!-- Generate Button -->
        <div class="col-12 col-sm-6">
          <q-btn
            unelevated
            color="primary"
            :label="loading ? $t('actions.generating') : $t('actions.generate')"
            :loading="loading"
            :disable="loading || !canGenerate"
            class="full-width"
            icon="auto_awesome"
            @click="handleGenerate"
          />
        </div>

        <!-- Reset Button -->
        <div class="col-12 col-sm-6">
          <q-btn
            outline
            color="grey-7"
            :label="$t('actions.reset')"
            :disable="loading"
            class="full-width"
            icon="refresh"
            @click="handleReset"
          />
        </div>
      </div>

      <!-- Error message -->
      <div v-if="error" class="q-mt-md">
        <q-banner dense class="bg-negative text-white">
          <template #avatar>
            <q-icon name="error" />
          </template>
          {{ error }}
        </q-banner>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean;
  error: string | null;
  canGenerate: boolean;
}>();

const emit = defineEmits<{
  generate: [];
  reset: [];
}>();

const handleGenerate = () => {
  emit('generate');
};

const handleReset = () => {
  emit('reset');
};
</script>
