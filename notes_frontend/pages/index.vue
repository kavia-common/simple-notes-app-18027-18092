<template>
  <div class="page">
    <NotesView />
  </div>
</template>

<script setup lang="ts">
/**
 * Home page that renders the NotesView component.
 */
import NotesView from '@/components/NotesView.vue'
</script>

<style scoped>
.page {
  display: contents;
}
</style>
