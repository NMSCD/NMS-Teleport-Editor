<script setup lang="ts">
import { addressToXYZ, createEndpoint, endpointToAddress } from '@/common';
import { useEndpointDataStore } from '@/stores/endpointData';
import { teleporterTypesEnum, type TeleporterTypes, type TeleportEndpoint } from '@/types/teleportEndpoint';
import { storeToRefs } from 'pinia';
import { computed, ref, watchEffect } from 'vue';

interface Props {
  open: boolean;
  endpointData?: TeleportEndpoint;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  endpointData: () => createEndpoint(),
});

const dialog = ref<HTMLDialogElement | null>(null);
const newEndpointName = ref<string>(props.endpointData.Name);
const newEndpointAddress = ref<string>(endpointToAddress(props.endpointData));
const newEndpointGalaxy = ref<string>((props.endpointData.UniverseAddress.RealityIndex + 1).toString());
const newEndpointType = ref<TeleporterTypes>(props.endpointData.TeleporterType);

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
  newEndpointName.value = props.endpointData.Name;
  newEndpointAddress.value = endpointToAddress(props.endpointData);
  newEndpointGalaxy.value = (props.endpointData.UniverseAddress.RealityIndex + 1).toString();
  newEndpointType.value = props.endpointData.TeleporterType;
}

function addEndpoint() {
  const minGalaxy = 1;
  const maxGalaxy = 256;
  const coordinateData = addressToXYZ(newEndpointAddress.value);
  const galaxyNumber = parseInt(newEndpointGalaxy.value);
  if (!coordinateData || isNaN(galaxyNumber) || galaxyNumber < minGalaxy || galaxyNumber > maxGalaxy) return;
  const { VoxelX, VoxelY, VoxelZ, SolarSystemIndex, PlanetIndex } = coordinateData;

  const endpoint = createEndpoint(
    newEndpointName.value,
    newEndpointType.value,
    VoxelX,
    VoxelY,
    VoxelZ,
    galaxyNumber - 1,
    SolarSystemIndex,
    PlanetIndex
  );

  if (props.endpointData.Name) {
    const locationData = addressToXYZ(newEndpointAddress.value);
    if (!locationData) return;
    const { VoxelX, VoxelY, VoxelZ, SolarSystemIndex, PlanetIndex } = locationData;
    const GalacticAddressData = props.endpointData.UniverseAddress.GalacticAddress;
    props.endpointData.Name = newEndpointName.value;
    GalacticAddressData.PlanetIndex = PlanetIndex;
    GalacticAddressData.SolarSystemIndex = SolarSystemIndex;
    GalacticAddressData.VoxelX = VoxelX;
    GalacticAddressData.VoxelY = VoxelY;
    GalacticAddressData.VoxelZ = VoxelZ;
    props.endpointData.UniverseAddress.RealityIndex = parseInt(newEndpointGalaxy.value) - 1;
    props.endpointData.TeleporterType = newEndpointType.value;
  } else {
    json.value.unshift(endpoint);
  }
  cancelEndpointAdd();
}

const uniqueIdAddition = Math.random() + Math.random();
const ids = {
  nameInput: 'nameInput' + uniqueIdAddition,
  addressInput: 'addressInput' + uniqueIdAddition,
  galaxyInput: 'galaxyInput' + uniqueIdAddition,
};

const editButtonText = computed(() => (props.endpointData.Name ? 'Save Changes' : 'Add Endpoint'));
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
        @submit.prevent="addEndpoint"
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
          {{ editButtonText }}
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
