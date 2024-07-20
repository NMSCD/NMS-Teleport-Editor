<script setup lang="ts">
import { useEndpointDataStore } from '@/store/endpointData';
import type { TeleportEndpoint, TeleporterTypes } from '@/types/teleportEndpoint';
import { maxStations } from '@/variables/limits';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const endpointData = useEndpointDataStore();
const { json, addedEndpoints, typeCounter } = storeToRefs(endpointData);

const isCopied = ref(false);

const buttonText = computed(() => (isCopied.value ? 'Copied!' : 'Copy modified JSON'));

function getExcessEndpoints(arr: TeleportEndpoint[], type: TeleporterTypes) {
  const endpointCount = typeCounter.value[type] ?? 0;
  const excessEndpoints = Math.max(endpointCount - maxStations, 0);
  const endpoints = arr.filter((item) => item.TeleporterType === type);
  const removeStations = endpoints.slice(0, excessEndpoints);
  return removeStations;
}

function copyJson() {
  const indent = 2;
  const displayTime = 1500;
  const excessStations = getExcessEndpoints(json.value, 'Spacestation');
  const excessStationsFixPos = getExcessEndpoints(json.value, 'SpacestationFixPosition');
  const filteredEndpoints = json.value.filter(
    (item) => !excessStations.includes(item) && !excessStationsFixPos.includes(item)
  );
  const combinedEndpoints = [...filteredEndpoints, ...addedEndpoints.value];

  navigator.clipboard.writeText(JSON.stringify(combinedEndpoints, null, indent));
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, displayTime);
}
</script>

<template>
  <button
    :class="{ 'no-interaction': isCopied, 'is-outlined': !isCopied }"
    class="button is-success"
    @click="copyJson"
  >
    {{ buttonText }}
  </button>
</template>

<style scoped>
.no-interaction {
  pointer-events: none;
}
</style>
