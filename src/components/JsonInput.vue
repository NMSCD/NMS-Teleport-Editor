<script setup lang="ts">
import { useEndpointDataStore } from '@/stores/endpointData';
import { storeToRefs } from 'pinia';

const endpointData = useEndpointDataStore();
const { jsonInputString, jsonError } = storeToRefs(endpointData);
</script>

<template>
  <div>
    <label
      class="has-text-weight-bold"
      for="jsonInput"
      >Copy your TeleportEndpoints JSON section here:</label
    >
    <textarea
      v-model="jsonInputString"
      class="textarea"
      id="jsonInput"
      @input="endpointData.parseJson"
    ></textarea>
    <p
      v-if="jsonError"
      class="error mt-1 p-1"
    >
      Malformed JSON detected. The app will not work.
    </p>
  </div>
</template>

<style scoped label="scss">
label {
  margin-block-end: 3px;
  display: block;
}

.error {
  background-color: red;
  color: white;
  border-radius: 4px;
}
</style>
