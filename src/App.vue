<script setup lang="ts">
import JsonInput from './components/JsonInput.vue';
</script>

<template>
  <header class="mb-5">
    <nav class="my-4">
      <a
        href=".."
        title="Other pages"
        >&larr; View other pages</a
      >
    </nav>
    <h1 class="title has-text-centered">NMS-Teleport-Editor</h1>
  </header>

  <main>
    <JsonInput />
  </main>
</template>

<style scoped lang="scss">
nav {
  display: flex;
  flex-wrap: wrap;
  font-size: large;
}
</style>
