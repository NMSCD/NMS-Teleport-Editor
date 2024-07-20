import type { TeleportEndpoint, TeleporterTypes } from '@/types/teleportEndpoint';
import { defineStore } from 'pinia';

interface State {
  jsonInputString: string;
  json: TeleportEndpoint[];
  addedEndpoints: TeleportEndpoint[];
  filter: string;
  filterType: TeleporterTypes | '';
  jsonError: boolean;
}

export const useEndpointDataStore = defineStore('endpointData', {
  state: (): State => ({
    jsonInputString: '',
    json: [],
    addedEndpoints: [],
    filter: '',
    filterType: '',
    jsonError: false,
  }),

  getters: {
    typeCounter: (state) => {
      const counter: Partial<Record<TeleporterTypes, number>> = {};
      const allEndpoints = [...state.addedEndpoints, ...state.json]
      for (const endpoint of allEndpoints) {
        const type = endpoint.TeleporterType;
        counter[type] ??= 0;
        counter[type]++;
      }
      return counter;
    },
  },

  actions: {
    parseJson() {
      try {
        this.json = JSON.parse(this.jsonInputString || '[]');
        this.jsonError = false;
      } catch (error) {
        console.error(error);
        this.jsonError = true;
      }
    },
  },
});
