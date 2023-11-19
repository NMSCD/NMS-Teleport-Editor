<script setup lang="ts">
import JsonInput from './components/JsonInput.vue';
import EndpointCard from './components/EndpointCard.vue';
import AddEndpoint from './components/AddEndpoint.vue';
import FilterInput from './components/FilterInput.vue';
import CopyButton from './components/CopyButton.vue';
import { useEndpointDataStore } from './stores/endpointData';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { endpointToAddress } from './common';

const endpointData = useEndpointDataStore();
const { json, filter, filterType } = storeToRefs(endpointData);

const renderJson = computed(() => {
  if (filter.value || filterType.value) {
    return json.value.filter(
      (item) =>
        (!filter.value ||
          item.Name.toLowerCase().includes(filter.value.toLowerCase()) ||
          endpointToAddress(item).includes(filter.value.toUpperCase())) &&
        (!filterType.value || item.TeleporterType === filterType.value)
    );
  } else {
    return json.value;
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
        <AddEndpoint />
        <CopyButton />
      </div>
    </div>
    <div class="endpoint-list mt-5 mb-6">
      <EndpointCard
        v-for="endpoint in json"
        v-show="renderJson.includes(endpoint)"
        :endpoint-json="endpoint"
        :key="endpoint.Name"
      />
    </div>
  </main>
</template>

<style scoped lang="scss">
nav {
  display: flex;
  flex-wrap: wrap;
  font-size: large;
}

.endpoint-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
