<template>
  <q-header elevated>
    <q-toolbar>
      <q-toolbar-title>
        {{ $t('app.title') }}
      </q-toolbar-title>

      <q-space />

      <!-- Language Selector -->
      <q-btn-dropdown flat :label="currentLang.toUpperCase()">
        <q-list>
          <q-item
            v-for="lang in availableLanguages"
            :key="lang"
            v-close-popup
            clickable
            @click="setLang(lang)"
          >
            <q-item-section>
              <q-item-label>{{ lang.toUpperCase() }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <!-- API Key Status & Button -->
      <q-btn
        flat
        :icon="hasKey ? 'check_circle' : 'warning'"
        :color="hasKey ? 'positive' : 'warning'"
        :label="hasKey ? $t('header.apiKeyPresent') : $t('header.apiKeyMissing')"
        @click="openDialog"
      />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLanguage } from 'src/composables/useLanguage';
import { useApiKey } from 'src/composables/useApiKey';

// i18n
const { locale } = useI18n();

// Language management
const { currentLang, setLang, availableLanguages } = useLanguage();

// Sync currentLang with i18n locale
watch(
  currentLang,
  (newLang) => {
    // Map short code to full locale code
    locale.value = newLang === 'en' ? 'en-US' : 'fr-FR';
  },
  { immediate: true },
);

// API key management
const { hasKey } = useApiKey();

// Emit event to open API key dialog
const emit = defineEmits<{
  openApiKeyDialog: [];
}>();

const openDialog = () => {
  emit('openApiKeyDialog');
};
</script>
