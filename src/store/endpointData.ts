import type { TeleportEndpoint, TeleporterTypes } from '@/types/teleportEndpoint';
import { defineStore } from 'pinia';
import { endpointSchema } from '@/variables/schema';

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
    allEndpoints: (state) => [...state.json, ...state.addedEndpoints],
    typeCounter() {
      const counter: Partial<Record<TeleporterTypes, number>> = {};
      for (const endpoint of this.allEndpoints) {
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
        this.addedEndpoints = [];
        const parsedJson: unknown = JSON.parse(this.jsonInputString || '[]');
        this.json = endpointSchema.array().parse(parsedJson);
        this.jsonError = false;
      } catch (error) {
        console.error(error);
        this.jsonError = true;
      }
    },
  },
});
