<script setup lang="ts">
import { addressToXYZ, createEndpoint, endpointToGlyphs } from '@/common';
import { useId } from '@/helpers/id';
import { useEndpointDataStore } from '@/store/endpointData';
import type { DialogProps } from '@/types/props';
import { teleporterTypes, type TeleporterTypes } from '@/types/teleportEndpoint';
import { maxStations } from '@/variables/limits';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<DialogProps>(), {
  endpointData: () => createEndpoint(),
});

const endpointData = useEndpointDataStore();
const { addedEndpoints, typeCounter } = storeToRefs(endpointData);

const newEndpointName = ref<string>(props.endpointData.Name);
const newEndpointAddress = ref<string>(endpointToGlyphs(props.endpointData));
const newEndpointGalaxy = ref<string>((props.endpointData.UniverseAddress.RealityIndex + 1).toString());
const newEndpointType = ref<TeleporterTypes>(props.endpointData.TeleporterType);

const stationEndpoints = teleporterTypes.filter((item) => item.startsWith('Spacestation'));

const isNewEndpoint = computed(() => !props.endpointData.Name);
const editButtonText = computed(() => (isNewEndpoint.value ? 'Add Endpoint' : 'Save Changes'));

function resetEndpointInputs() {
  newEndpointName.value = props.endpointData.Name;
  newEndpointAddress.value = endpointToGlyphs(props.endpointData);
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

  const endpoint = createEndpoint({
    name: newEndpointName.value,
    teleporterType: newEndpointType.value,
    x: VoxelX,
    y: VoxelY,
    z: VoxelZ,
    galaxy: galaxyNumber - 1,
    systemIndex: SolarSystemIndex,
    planet: PlanetIndex,
  });

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
    // start of the array: oldest (bottom of list in game)
    // end of the array: newest (top of list in game)
    addedEndpoints.value.unshift(endpoint);
  }

  // reset to initial state
  resetEndpointInputs();
}

const uniqueId = useId();
const ids = {
  nameInput: 'nameInput' + uniqueId,
  addressInput: 'addressInput' + uniqueId,
  galaxyInput: 'galaxyInput' + uniqueId,
};

const isOutOfSafeRange = computed(() => {
  const systemIndex = newEndpointAddress.value.substring(1, 4);
  const systemNumber = parseInt(systemIndex, 16);
  const lastSafeIndex = 122;
  const aboveSafeRange = systemNumber > lastSafeIndex;
  return aboveSafeRange && endpointToGlyphs(props.endpointData) !== newEndpointAddress.value;
});

const isOverLimit = computed(() => {
  const amountOfTypeEndpoints = typeCounter.value[newEndpointType.value] ?? 0;
  // case 1: editing existing endpoint, but not changing type (total must be > max)
  // case 2: editing existing endpoint, but changing type (total + 1 must be > max)
  // case 3: adding new endpoint (total + 1 must be > max)
  return (
    (!isNewEndpoint.value && amountOfTypeEndpoints > maxStations) ||
    ((isNewEndpoint.value || props.endpointData.TeleporterType !== newEndpointType.value) &&
      amountOfTypeEndpoints + 1 > maxStations)
  );
});

const amountOverLimit = computed(() => Math.max((typeCounter.value[newEndpointType.value] ?? 0) - maxStations, 1));
</script>

<template>
  <div class="p-4">
    <form
      class="mb-4 endpoint-add-form"
      @submit.prevent="addEndpoint"
    >
      <label :for="ids.nameInput">Name:</label>
      <input
        v-model="newEndpointName"
        :id="ids.nameInput"
        class="input"
        type="text"
        autofocus
      />
      <label :for="ids.addressInput">Address (Glyphs or Coordinates):</label>
      <div>
        <input
          v-model="newEndpointAddress"
          :id="ids.addressInput"
          class="input"
          type="text"
          maxlength="19"
        />
        <p
          v-if="isOutOfSafeRange"
          class="warning mt-1 p-1"
        >
          Warning: This system may not have a space station.
        </p>
      </div>
      <label :for="ids.galaxyInput">Galaxy (1-256):</label>
      <input
        v-model="newEndpointGalaxy"
        :id="ids.galaxyInput"
        class="input"
        maxlength="3"
        type="text"
      />
      <label>Type:</label>
      <div>
        <div class="select">
          <select v-model="newEndpointType">
            <option
              v-for="endpointType in isNewEndpoint ? stationEndpoints : teleporterTypes"
              :value="endpointType"
            >
              {{ endpointType }}
            </option>
          </select>
        </div>
        <p
          v-if="isOverLimit"
          class="warning mt-1 p-1"
        >
          Warning: Too many {{ newEndpointType }} endpoints. {{ amountOverLimit }} will be removed.
        </p>
      </div>
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
        @click="resetEndpointInputs"
      >
        Cancel
      </button>
    </form>
  </div>
</template>

<style scoped>
.warning {
  background-color: orange;
  color: black;
  border-radius: 4px;
  text-wrap: balance;
}

.submit-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.endpoint-add-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 1rem;
}
</style>
