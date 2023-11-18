import { defineStore } from 'pinia';

interface State {}

export const useRewardStore = defineStore('reward', {
  state: (): State => ({}),
});
