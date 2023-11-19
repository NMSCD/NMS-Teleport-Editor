import type { TeleportEndpoint, TeleporterTypes } from '@/types/teleportEndpoint';
import { defineStore } from 'pinia';

interface State {
  jsonInputString: string;
  json: TeleportEndpoint[];
  filter: string;
  filterType: TeleporterTypes | '';
}

export const useEndpointDataStore = defineStore('endpointData', {
  state: (): State => ({
    jsonInputString: '',
    json: [],
    filter: '',
    filterType: '',
  }),

  actions: {
    parseJson() {
      this.json = JSON.parse(this.jsonInputString || '[]');
    },
  },
});
