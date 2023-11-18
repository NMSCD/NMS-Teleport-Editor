<script setup lang="ts">
import EditEndpointDialogue from './EditEndpointDialogue.vue';
import { ref } from 'vue';

const isModalOpen = ref(false);
</script>

<template>
  <button
    class="button"
    @click="isModalOpen = true"
  >
    Add Teleport Endpoint
  </button>
  <EditEndpointDialogue v-model:open="isModalOpen" />
</template>
