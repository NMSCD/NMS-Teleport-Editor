<script setup lang="ts">
import { useEndpointDataStore } from '@/store/endpointData';
import { teleporterTypesEnum } from '@/types/teleportEndpoint';
import { storeToRefs } from 'pinia';
import FilterInputWrapper from './FilterInputWrapper.vue';

const endpointData = useEndpointDataStore();
const { filter, filterType } = storeToRefs(endpointData);

// what the actual fuck is this, please explain what the hell this empty string property is
const teleporterFilterTypes = {
  '': '',
  ...teleporterTypesEnum,
};
</script>

<template>
  <FilterInputWrapper>
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
  </FilterInputWrapper>
  <FilterInputWrapper>
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
  </FilterInputWrapper>
</template>
