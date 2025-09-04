<template>
  <div class="app">
    <header class="app-header">
      <h1 class="title">Simple Notes</h1>
    </header>

    <main class="app-main">
      <NotesView />
    </main>

    <button
      class="fab"
      aria-label="Add note"
      title="Add note"
      @click="onAddNote"
    >
      +
    </button>

    <NuxtRouteAnnouncer />
  </div>
</template>

<script setup lang="ts">
/**
 * Root app shell: header, main content, and global FAB to add a new note.
 * Integrates with the useNotes composable for creating notes.
 */
import NotesView from '@/components/NotesView.vue'
import { useNotes } from '@/composables/useNotes'

const { createNote } = useNotes()

async function onAddNote() {
  try {
    await createNote()
  } catch (err) {
    console.error('Failed to create note', err)
    // In a real app, show a toast/snackbar here
  }
}
</script>

<style>
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --color-accent: #f59e42;

  --color-bg: #f9fafb;
  --color-surface: #ffffff;
  --color-text: #0f172a;
  --color-muted: #475569;

  --radius-md: 12px;
  --radius-sm: 8px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
}

* { box-sizing: border-box; }
html, body, #__nuxt { height: 100%; }
body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, Helvetica Neue, Arial, Apple Color Emoji, Segoe UI Emoji;
  color: var(--color-text);
  background: linear-gradient(180deg, #ffffff, var(--color-bg) 60%);
}

.app {
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
}

.app-header {
  backdrop-filter: saturate(180%) blur(6px);
  background: rgba(255,255,255,0.8);
  border-bottom: 1px solid rgba(100,116,139,0.15);
  position: sticky;
  top: 0;
  z-index: 10;
}

.title {
  margin: 0;
  padding: 14px 20px;
  font-size: 18px;
  letter-spacing: 0.2px;
  color: var(--color-primary);
}

.app-main {
  padding: 16px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.fab {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  color: #fff;
  font-size: 28px;
  line-height: 1;
  background: var(--color-primary);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: transform .08s ease, box-shadow .2s ease, background .2s ease;
}
.fab:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(59,130,246,0.35);
}
.fab:active {
  transform: translateY(0);
}
.fab:focus-visible {
  outline: 3px solid rgba(59,130,246,0.4);
  outline-offset: 2px;
}
</style>
