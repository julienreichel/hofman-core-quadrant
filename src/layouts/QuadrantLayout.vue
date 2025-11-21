<template>
  <q-layout view="lHh Lpr lFf">
    <header-bar @open-api-key-dialog="showApiKeyDialog = true" />

    <q-page-container>
      <router-view />
    </q-page-container>

    <api-key-dialog v-model="showApiKeyDialog" />
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HeaderBar from 'components/HeaderBar.vue';
import ApiKeyDialog from 'components/ApiKeyDialog.vue';

const showApiKeyDialog = ref(false);
</script>
