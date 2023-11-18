<script setup lang="ts">
import { addressToXYZ, createEndpoint } from '@/common';
import { useEndpointDataStore } from '@/stores/endpointData';
import { teleporterTypesEnum, type TeleporterTypes } from '@/types/teleportEndpoint';
import { storeToRefs } from 'pinia';
import { ref, watchEffect } from 'vue';

interface Props {
  open: boolean;
  endpointName?: string;
  endpointAddress?: string;
  endpointGalaxy?: string;
  endpointType?: TeleporterTypes;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  endpointName: '',
  endpointAddress: '',
  endpointGalaxy: '',
  endpointType: 'Base',
});

const dialog = ref<HTMLDialogElement | null>(null);
const newEndpointName = ref(props.endpointName);
const newEndpointAddress = ref(props.endpointAddress);
const newEndpointGalaxy = ref(props.endpointGalaxy);
const newEndpointType = ref<TeleporterTypes>(props.endpointType);

const endpointData = useEndpointDataStore();
const { json } = storeToRefs(endpointData);

defineEmits(['update:open']);

watchEffect(() => {
  if (props.open) openModal();
});

function openModal() {
  dialog.value?.showModal();
}

function closeModal() {
  dialog.value?.close();
}

function cancelEndpointAdd() {
  newEndpointName.value = '';
  newEndpointAddress.value = '';
  newEndpointGalaxy.value = '';
  newEndpointType.value = 'Base';
}

function addEndpoint() {
  const minGalaxy = 1;
  const maxGalaxy = 256;
  const coordinateData = addressToXYZ(newEndpointAddress.value);
  const galaxyNumber = parseInt(newEndpointGalaxy.value);
  if (!coordinateData || isNaN(galaxyNumber) || galaxyNumber < minGalaxy || galaxyNumber > maxGalaxy) return;
  const { VoxelX, VoxelY, VoxelZ, SolarSystemIndex } = coordinateData;

  const endpoint = createEndpoint(
    newEndpointName.value,
    newEndpointType.value,
    VoxelX,
    VoxelY,
    VoxelZ,
    SolarSystemIndex,
    galaxyNumber
  );
  json.value.unshift(endpoint);
  cancelEndpointAdd();
}

const uniqueIdAddition = Math.random() + Math.random();
const ids = {
  nameInput: 'nameInput' + uniqueIdAddition,
  addressInput: 'addressInput' + uniqueIdAddition,
  galaxyInput: 'galaxyInput' + uniqueIdAddition,
};
</script>

<template>
  <dialog
    class="p-0"
    ref="dialog"
    @click.self="closeModal"
    @close="$emit('update:open', false)"
  >
    <div class="p-4 dialog-content">
      <form
        class="mb-4 endpoint-add-form"
        @submit.prevent
      >
        <label :for="ids.nameInput">Name:</label>
        <input
          v-model="newEndpointName"
          class="input"
          type="text"
          :id="ids.nameInput"
          autofocus
        />
        <label :for="ids.addressInput">Address:</label>
        <input
          v-model="newEndpointAddress"
          class="input"
          type="text"
          :id="ids.addressInput"
          maxlength="19"
        />
        <label :for="ids.galaxyInput">Galaxy:</label>
        <input
          v-model="newEndpointGalaxy"
          class="input"
          type="text"
          :id="ids.galaxyInput"
          maxlength="3"
        />
        <label>Type:</label>
        <select
          v-model="newEndpointType"
          class="select"
        >
          <option
            v-for="endpointType in teleporterTypesEnum"
            :value="endpointType"
          >
            {{ endpointType }}
          </option>
        </select>
      </form>

      <form
        class="submit-buttons"
        method="dialog"
      >
        <button
          class="button is-success"
          @click="addEndpoint"
        >
          Add Endpoint
        </button>
        <button
          class="button is-danger"
          @click="cancelEndpointAdd"
        >
          Cancel
        </button>
      </form>
    </div>
  </dialog>
</template>

<style scoped lang="scss">
.submit-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.endpoint-add-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>
