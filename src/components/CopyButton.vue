<script setup lang="ts">
import { useEndpointDataStore } from '@/stores/endpointData';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const endpointData = useEndpointDataStore();
const { json } = storeToRefs(endpointData);

const defaultText = 'Copy modified JSON';
const buttonText = ref(defaultText);
const copied = ref(false);

function copyJson() {
  const indent = 2;
  const displayTime = 1500;
  navigator.clipboard.writeText(JSON.stringify(json.value, null, indent));
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
    :class="{ 'no-interaction': copied }"
    class="button is-success is-outlined"
    @click="copyJson"
  >
    {{ buttonText }}
  </button>
</template>

<style scoped lang="scss">
button {
  flex-grow: 1;
}

.no-interaction {
  pointer-events: none;
}
</style>
