<script setup lang="ts">
import { useEndpointDataStore } from '@/store/endpointData';
import type { TeleportEndpoint, TeleporterTypes } from '@/types/teleportEndpoint';
import { maxStations } from '@/variables/limits';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const endpointData = useEndpointDataStore();
const { json, addedEndpoints, typeCounter } = storeToRefs(endpointData);

const defaultText = 'Copy modified JSON';
const buttonText = ref(defaultText);
const copied = ref(false);

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
  buttonText.value = 'Copied!';
  copied.value = true;
  setTimeout(() => {
    buttonText.value = defaultText;
    copied.value = false;
  }, displayTime);
}
</script>

<template>
  <button
    :class="{ 'no-interaction': copied, 'is-outlined': !copied }"
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
