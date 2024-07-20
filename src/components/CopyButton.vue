<script setup lang="ts">
import { useEndpointDataStore } from '@/store/endpointData';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const endpointData = useEndpointDataStore();
const { json, addedEndpoints } = storeToRefs(endpointData);

const defaultText = 'Copy modified JSON';
const buttonText = ref(defaultText);
const copied = ref(false);

function copyJson() {
  const indent = 2;
  const displayTime = 1500;
  const combinedEndpoints = [...json.value, ...addedEndpoints.value];
  navigator.clipboard.writeText(JSON.stringify(combinedEndpoints, null, indent));
  buttonText.value = 'Copied!';
  copied.value = true;
  setTimeout(() => {
    buttonText.value = defaultText;
    copied.value = false;
  }, displayTime);
}
</script>

<template>
  <button
    :class="{ 'no-interaction': copied, 'is-outlined': !copied }"
    class="button is-success"
    @click="copyJson"
  >
    {{ buttonText }}
  </button>
</template>

<style scoped>
.no-interaction {
  pointer-events: none;
}
</style>
