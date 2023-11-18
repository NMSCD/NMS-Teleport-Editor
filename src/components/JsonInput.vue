<script setup lang="ts">
import { useEndpointDataStore } from '@/stores/endpointData';
import { storeToRefs } from 'pinia';

const endpointData = useEndpointDataStore();
const { jsonInputString } = storeToRefs(endpointData);
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
  </div>
</template>

<style scoped label="scss">
label {
  margin-block-end: 3px;
  display: block;
}
</style>
