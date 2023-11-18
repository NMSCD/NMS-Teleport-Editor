<script setup lang="ts">
import { useEndpointDataStore } from '@/stores/endpointData';
import { teleporterTypesEnum } from '@/types/teleportEndpoint';
import { storeToRefs } from 'pinia';

const endpointData = useEndpointDataStore();
const { filter, filterType } = storeToRefs(endpointData);

const teleporterFilterTypes = {
  '': '',
  ...teleporterTypesEnum,
};
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
  <div>
    <label class="has-text-weight-bold">Filter Types</label>
    <select
      v-model="filterType"
      class="select"
    >
      <option
        v-for="teleporterType in teleporterFilterTypes"
        :value="teleporterType"
      >
        {{ teleporterType }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
label {
  display: block;
  margin-block-end: 3px;
}
</style>
