import type { TeleportEndpoint } from '@/types/teleportEndpoint';
import { defineStore } from 'pinia';

interface State {
  jsonInputString: string;
  json: TeleportEndpoint[];
  filter: string;
}

export const useEndpointDataStore = defineStore('endpointData', {
  state: (): State => ({
    jsonInputString: '',
    json: [],
    filter: '',
  }),

  actions: {
    parseJson() {
      this.json = JSON.parse(this.jsonInputString || '[]');
    },
  },
});
