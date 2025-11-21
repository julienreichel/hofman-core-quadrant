<template>
  <div class="offline-db-button">
    <q-btn
      round
      color="secondary"
      icon="download"
      size="md"
      :title="t('offlineDb.buttonLabel')"
      @click="showDialog = true"
    >
      <q-tooltip>{{ t('offlineDb.buttonLabel') }}</q-tooltip>
    </q-btn>

    <!-- Dialog for entering core qualities -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ t('offlineDb.dialogTitle') }}</div>
          <div class="text-caption q-mt-sm">
            {{ t('offlineDb.dialogDescription') }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="coreQualitiesInput"
            :label="t('offlineDb.inputLabel')"
            :placeholder="t('offlineDb.inputPlaceholder')"
            type="textarea"
            rows="4"
            outlined
            :disable="isGenerating"
            autofocus
          />
        </q-card-section>

        <!-- Progress section -->
        <q-card-section v-if="isGenerating" class="q-pt-none">
          <q-linear-progress :value="progress / 100" color="primary" class="q-mb-sm" />
          <div class="text-caption text-center">{{ currentStatus }}</div>
        </q-card-section>

        <!-- Error message -->
        <q-card-section v-if="errorMessage" class="q-pt-none">
          <q-banner class="bg-negative text-white" rounded>
            {{ errorMessage }}
          </q-banner>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            :label="t('offlineDb.cancel')"
            color="primary"
            @click="handleCancel"
            :disable="isGenerating"
          />
          <q-btn
            flat
            :label="t('offlineDb.generate')"
            color="primary"
            @click="handleGenerate"
            :loading="isGenerating"
            :disable="!coreQualitiesInput.trim()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import { useApiKey } from 'src/composables/useApiKey';
import { useLanguage } from 'src/composables/useLanguage';
import { useOfflineDbGenerator } from 'src/composables/useOfflineDbGenerator';

const { t } = useI18n();
const $q = useQuasar();

// Composables
const { apiKey } = useApiKey();
const { currentLang } = useLanguage();
const { isGenerating, progress, currentStatus, generateOfflineDatabase } = useOfflineDbGenerator();

// Local state
const showDialog = ref(false);
const coreQualitiesInput = ref('');
const errorMessage = ref<string | null>(null);

// Handle generation
const handleGenerate = async () => {
  if (!coreQualitiesInput.value.trim()) {
    errorMessage.value = t('offlineDb.errorNoQualities');
    return;
  }

  if (!apiKey.value) {
    errorMessage.value = t('errors.noApiKey');
    return;
  }

  errorMessage.value = null;

  try {
    await generateOfflineDatabase(apiKey.value, coreQualitiesInput.value, currentLang.value);

    // Show success message
    $q.notify({
      type: 'positive',
      message: t('offlineDb.statusComplete'),
      position: 'top',
    });

    // Close dialog after short delay
    setTimeout(() => {
      showDialog.value = false;
      coreQualitiesInput.value = '';
    }, 1500);
  } catch (err) {
    errorMessage.value = t('offlineDb.errorGeneration', {
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

// Handle cancel
const handleCancel = () => {
  showDialog.value = false;
  coreQualitiesInput.value = '';
  errorMessage.value = null;
};
</script>

<style scoped lang="scss">
.offline-db-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}
</style>
