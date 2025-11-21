<template>
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn
      fab
      icon="upload_file"
      color="secondary"
      :title="$t('offlineDb.importButton')"
      @click="showDialog = true"
    />
  </q-page-sticky>

  <q-dialog v-model="showDialog">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">{{ $t('offlineDb.importTitle') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="text-body2">{{ $t('offlineDb.importDescription') }}</p>

        <q-file
          v-model="selectedFile"
          accept=".json"
          :label="$t('offlineDb.selectFile')"
          outlined
          :error="!!errorMessage"
          :error-message="errorMessage"
          @update:model-value="errorMessage = ''"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-file>

        <div v-if="isDatabaseLoaded && isCustomDatabase" class="q-mt-md">
          <q-banner dense rounded class="bg-positive text-white">
            <template v-slot:avatar>
              <q-icon name="check_circle" />
            </template>
            {{ $t('offlineDb.customDbLoaded', { count: traitCount }) }}
          </q-banner>
        </div>

        <div v-else-if="isDatabaseLoaded" class="q-mt-md">
          <q-banner dense rounded class="bg-info text-white">
            <template v-slot:avatar>
              <q-icon name="info" />
            </template>
            {{ $t('offlineDb.defaultDbLoaded', { count: traitCount }) }}
          </q-banner>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat :label="$t('offlineDb.cancel')" color="primary" v-close-popup />
        <q-btn
          flat
          :label="$t('offlineDb.import')"
          color="primary"
          :disable="!selectedFile"
          @click="handleImport"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useOfflineDatabase } from 'src/composables/useOfflineDatabase';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const { t } = useI18n();
const { importDatabase, isDatabaseLoaded, isCustomDatabase, traitCount } = useOfflineDatabase();

const showDialog = ref(false);
const selectedFile = ref<File | null>(null);
const errorMessage = ref('');

async function handleImport() {
  if (!selectedFile.value) return;

  try {
    const content = await selectedFile.value.text();
    importDatabase(content);

    $q.notify({
      type: 'positive',
      message: t('offlineDb.importSuccess'),
      position: 'top',
    });

    showDialog.value = false;
    selectedFile.value = null;
    errorMessage.value = '';
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('offlineDb.importError');
    $q.notify({
      type: 'negative',
      message: t('offlineDb.importError'),
      position: 'top',
    });
  }
}
</script>
