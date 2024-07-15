<script setup lang="ts">
import type { DialogWrapperProps } from '@/types/props';
import EditEndpointDialogue from './EditEndpointDialogue.vue';
import { ref } from 'vue';

defineProps<DialogWrapperProps>();

const dialog = ref<HTMLDialogElement | null>(null);

const openModal = () => dialog.value?.showModal();
const closeModal = () => dialog.value?.close();
</script>

<template>
  <button
    class="button"
    @click="openModal"
  >
    {{ label }}
  </button>
  <dialog
    class="box m-auto p-0"
    ref="dialog"
    @click.self="closeModal"
  >
    <EditEndpointDialogue :endpoint-data />
  </dialog>
</template>

<style scoped>
dialog {
  border: 1px solid #80808080;
  display: none;
  max-width: 525px;

  &[open] {
    display: block;
  }
}
</style>
