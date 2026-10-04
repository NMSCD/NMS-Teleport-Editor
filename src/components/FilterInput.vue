<script setup lang="ts">
import FilterInputWrapper from './FilterInputWrapper.vue';
import { storeToRefs } from 'pinia';
import { teleporterTypes } from '@/variables/teleporterTypes';
import { useEndpointDataStore } from '@/store/endpointData';

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
      >Search Endpoints</label
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
