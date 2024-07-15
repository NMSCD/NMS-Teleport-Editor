<script setup lang="ts">
import { endpointToGlyphs } from '@/common';
import { useEndpointDataStore } from '@/store/endpointData';
import { type TeleportEndpoint } from '@/types/teleportEndpoint';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import EditDialogueButton from './EditDialogueButton.vue';

const props = defineProps<{
  endpointJson: TeleportEndpoint;
}>();

const endpointData = useEndpointDataStore();
const { json } = storeToRefs(endpointData);

const address = computed(() => endpointToGlyphs(props.endpointJson));

function removeEndpoint() {
  json.value = json.value.filter((t) => t !== props.endpointJson);
}
</script>

<template>
  <div class="box mb-5">
    <div class="has-text-weight-bold">{{ endpointJson.Name }}</div>
    <div class="glyphs">{{ address }}</div>
    <div>Galaxy: {{ endpointJson.UniverseAddress.RealityIndex + 1 }}</div>
    <div>{{ endpointJson.TeleporterType }}</div>
    <div class="actions mt-2">
      <EditDialogueButton
        :endpoint-data="endpointJson"
        label="Edit"
      />
      <button
        class="button is-danger"
        @click="removeEndpoint"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped>
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
