<script setup lang="ts">
import { useEndpointDataStore } from '@/stores/endpointData';
import { storeToRefs } from 'pinia';

const endpointData = useEndpointDataStore();
const { filter } = storeToRefs(endpointData);
</script>

<template>
  <div>
    <label
      class="has-text-weight-bold"
      for="filterInput"
      >Filter Endpoints</label
    >
    <input
      v-model="filter"
      class="input"
      id="filterInput"
      type="text"
    />
  </div>
</template>

<style scoped lang="scss">
label {
  display: block;
  margin-block-end: 3px;
}
</style>
