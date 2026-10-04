<script setup lang="ts">
import type { TeleportEndpoint, TeleporterTypes } from '@/types/teleportEndpoint';
import { computed } from 'vue';
import { maxStations } from '@/variables/limits';
import { storeToRefs } from 'pinia';
import { useClipboard } from '@vueuse/core';
import { useEndpointDataStore } from '@/store/endpointData';

const endpointData = useEndpointDataStore();
const { json, addedEndpoints, typeCounter } = storeToRefs(endpointData);

const textToCopy = computed(() => prepareJson());

const { copy, copied: isCopied } = useClipboard({ source: textToCopy });

const buttonText = computed(() => (isCopied.value ? 'Copied!' : 'Copy modified JSON'));

function getExcessEndpoints(arr: TeleportEndpoint[], type: TeleporterTypes) {
  const endpointCount = typeCounter.value[type] ?? 0;
  const excessEndpoints = Math.max(endpointCount - maxStations, 0);
  const endpoints = arr.filter((item) => item.TeleporterType === type);
  const removeStations = endpoints.slice(0, excessEndpoints);
  return removeStations;
}

function prepareJson() {
  const indent = 2;
  const excessStations = getExcessEndpoints(json.value, 'Spacestation');
  const excessStationsFixPos = getExcessEndpoints(json.value, 'SpacestationFixPosition');
  const filteredEndpoints = json.value.filter(
    (item) => !excessStations.includes(item) && !excessStationsFixPos.includes(item),
  );
  const combinedEndpoints = [...filteredEndpoints, ...addedEndpoints.value];

  return JSON.stringify(combinedEndpoints, null, indent);
}
</script>

<template>
  <button
    :class="{ 'no-interaction': isCopied, 'is-outlined': !isCopied }"
    class="button is-success"
    @click="copy()"
  >
    {{ buttonText }}
  </button>
</template>

<style scoped>
.no-interaction {
  pointer-events: none;
}
</style>
