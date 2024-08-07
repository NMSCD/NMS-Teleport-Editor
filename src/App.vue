<script setup lang="ts">
import JsonInput from './components/JsonInput.vue';
import EndpointCard from './components/EndpointCard.vue';
import EditDialogueButton from './components/EditDialogueButton.vue';
import FilterInput from './components/FilterInput.vue';
import CopyButton from './components/CopyButton.vue';
import { useEndpointDataStore } from './store/endpointData';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { endpointToGlyphs } from './common';

const endpointData = useEndpointDataStore();
const { allEndpoints, filter, filterType } = storeToRefs(endpointData);

const renderJson = computed(() => {
  if (filter.value || filterType.value) {
    return allEndpoints.value.filter(
      (item) =>
        (!filter.value ||
          item.Name.toLowerCase().includes(filter.value.toLowerCase()) ||
          endpointToGlyphs(item).includes(filter.value.toUpperCase())) &&
        (!filterType.value || item.TeleporterType === filterType.value)
    );
  } else {
    return allEndpoints.value;
  }
});
</script>

<template>
  <header class="mb-5">
    <nav class="my-4">
      <a
        href=".."
        title="Other pages"
        >&larr; View other pages</a
      >
    </nav>
    <h1 class="title has-text-centered">NMS-Teleport-Editor</h1>
  </header>

  <main>
    <div class="input-wrapper">
      <JsonInput />
      <div class="action-wrapper">
        <FilterInput />
        <EditDialogueButton label="Add Teleport Endpoint" />
        <CopyButton />
      </div>
    </div>
    <div class="endpoint-list mt-5 mb-6">
      <EndpointCard
        v-for="endpoint in allEndpoints.toReversed()"
        v-show="renderJson.includes(endpoint)"
        :endpoint-json="endpoint"
        :key="endpoint.Name"
      />
    </div>
  </main>
</template>

<style scoped>
nav {
  display: flex;
  flex-wrap: wrap;
  font-size: large;
}

.endpoint-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1rem;
}

.input-wrapper {
  display: flex;
  gap: 1rem;
  flex-direction: column;

  .action-wrapper {
    display: flex;
    flex-grow: 1;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: end;
  }
}
</style>
