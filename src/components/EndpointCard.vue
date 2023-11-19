<script setup lang="ts">
import EditEndpointDialogue from './EditEndpointDialogue.vue';
import { xyzToAddress } from '@/common';
import { useEndpointDataStore } from '@/stores/endpointData';
import { type TeleportEndpoint } from '@/types/teleportEndpoint';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const props = defineProps<{
  endpointJson: TeleportEndpoint;
}>();

const endpointData = useEndpointDataStore();
const { json } = storeToRefs(endpointData);

const isModalOpen = ref(false);

const address = computed(() => {
  const { VoxelX, VoxelY, VoxelZ, SolarSystemIndex, PlanetIndex } = props.endpointJson.UniverseAddress.GalacticAddress;
  return xyzToAddress(VoxelX, VoxelY, VoxelZ, SolarSystemIndex, PlanetIndex);
});

function removeEndpoint() {
  json.value = json.value.filter((t) => t !== props.endpointJson);
}
</script>

<template>
  <div class="box">
    <div class="has-text-weight-bold">{{ endpointJson.Name }}</div>
    <div class="glyphs">{{ address }}</div>
    <div>Galaxy: {{ endpointJson.UniverseAddress.RealityIndex + 1 }}</div>
    <div>{{ endpointJson.TeleporterType }}</div>
    <div class="actions mt-2">
      <button
        class="button"
        @click="isModalOpen = true"
      >
        Edit
      </button>
      <button
        class="button is-danger"
        @click="removeEndpoint"
      >
        Delete
      </button>
    </div>
    <EditEndpointDialogue
      v-model:open="isModalOpen"
      :endpoint-data="endpointJson"
    />
  </div>
</template>

<style scoped lang="scss">
.actions {
  display: flex;
  gap: 0.5rem;
}

.glyphs {
  font-family: NMS-Glyphs-Mono;
  font-size: 1.75rem;
  line-height: 1.2rem;
}
</style>
