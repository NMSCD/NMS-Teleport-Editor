<script setup lang="ts">
import { useEndpointDataStore } from '@/store/endpointData';
import { teleporterTypes } from '@/types/teleportEndpoint';
import { storeToRefs } from 'pinia';
import FilterInputWrapper from './FilterInputWrapper.vue';

const endpointData = useEndpointDataStore();
const { filter, filterType } = storeToRefs(endpointData);

// These are the possible filters. You can either filter by all teleporter types, or by nothing.
const teleporterFilterTypes = ['', ...teleporterTypes];
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
    <div class="select">
      <select v-model="filterType">
        <option
          v-for="teleporterType in teleporterFilterTypes"
          :value="teleporterType"
        >
          {{ teleporterType }}
        </option>
      </select>
    </div>
  </FilterInputWrapper>
</template>
