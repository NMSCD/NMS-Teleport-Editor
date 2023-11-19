import type { TeleportEndpoint, TeleporterTypes } from '@/types/teleportEndpoint';
import { defineStore } from 'pinia';

interface State {
  jsonInputString: string;
  json: TeleportEndpoint[];
  filter: string;
  filterType: TeleporterTypes | '';
  jsonError: boolean;
}

export const useEndpointDataStore = defineStore('endpointData', {
  state: (): State => ({
    jsonInputString: '',
    json: [],
    filter: '',
    filterType: '',
    jsonError: false,
  }),

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
