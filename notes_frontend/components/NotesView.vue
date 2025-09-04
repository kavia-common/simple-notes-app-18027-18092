<template>
  <section class="notes-view">
    <div class="panel list-panel">
      <div class="panel-head">
        <div class="panel-title">
          Notes
        </div>
        <div class="panel-actions">
          <button class="btn ghost" @click="refresh" :disabled="isLoading">
            Refresh
          </button>
        </div>
      </div>

      <div class="panel-body list-body" :class="{ loading: isLoading }">
        <template v-if="error">
          <div class="empty">
            <p>{{ error }}</p>
            <button class="btn" @click="refresh">Try again</button>
          </div>
        </template>

        <template v-else-if="!notes.length && !isLoading">
          <div class="empty">
            <p>No notes yet</p>
            <small class="muted">Click the + button below to create your first note.</small>
          </div>
        </template>

        <ul v-else class="notes-list" role="list">
          <li
            v-for="n in notes"
            :key="n.id"
            :class="['note-item', { active: selectedNote?.id === n.id }]"
            @click="selectNote(n.id)"
          >
            <div class="note-title">{{ n.title || 'Untitled note' }}</div>
            <div class="note-snippet">{{ snippet(n.content) }}</div>
            <div class="note-meta">
              <span>{{ when(n.updatedAt || n.createdAt) }}</span>
              <button
                class="icon danger"
                aria-label="Delete note"
                title="Delete note"
                @click.stop="onDelete(n.id)"
              >
                🗑
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="panel editor-panel">
      <div class="panel-head">
        <div class="panel-title">Editor</div>
        <div class="panel-actions">
          <button class="btn primary" :disabled="!selectedNote" @click="onSave">Save</button>
        </div>
      </div>

      <div class="panel-body editor-body">
        <template v-if="selectedNote">
          <input
            v-model="selectedNote.title"
            class="input title-input"
            type="text"
            placeholder="Note title"
            @keyup.ctrl.s.prevent="onSave"
          />

          <textarea
            v-model="selectedNote.content"
            class="textarea content-input"
            placeholder="Start typing your note..."
            rows="12"
            @keyup.ctrl.s.prevent="onSave"
          />
        </template>
        <template v-else>
          <div class="empty">
            <p>Select a note from the list or create a new one.</p>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * NotesView: responsive two-pane layout with a list and an editor.
 * Uses the useNotes composable for state and CRUD.
 */
import { onMounted } from 'vue'
import { useNotes } from '@/composables/useNotes'

const {
  notes,
  selectedNote,
  isLoading,
  error,
  fetchNotes,
  selectNote,
  deleteNote,
  saveSelectedNote,
} = useNotes()

onMounted(fetchNotes)

function refresh() {
  fetchNotes()
}

function snippet(content: string, size = 80) {
  return (content || '').replace(/\s+/g, ' ').trim().slice(0, size) + ((content || '').length > size ? '…' : '')
}

function when(iso?: string) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    const now = Date.now()
    const diff = Math.floor((now - d.getTime()) / 1000)
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return d.toLocaleDateString()
  } catch {
    return ''
  }
}

async function onDelete(id: string) {
  if (!confirm('Delete this note? This cannot be undone.')) return
  try {
    await deleteNote(id)
  } catch (err) {
    console.error(err)
  }
}

async function onSave() {
  try {
    await saveSelectedNote()
  } catch (err) {
    console.error(err)
  }
}
</script>

<style scoped>
.notes-view {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 16px;
}

@media (max-width: 900px) {
  .notes-view {
    grid-template-columns: 1fr;
  }
}

.panel {
  background: var(--color-surface);
  border: 1px solid rgba(100,116,139,0.15);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid rgba(100,116,139,0.14);
}

.panel-title {
  font-weight: 600;
  color: var(--color-muted);
  letter-spacing: 0.2px;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.panel-body {
  padding: 12px;
}

.list-body.loading {
  opacity: 0.6;
  pointer-events: none;
}

.notes-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.note-item {
  padding: 10px 12px;
  border: 1px solid rgba(100,116,139,0.18);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background .12s ease, border-color .12s ease, transform .06s ease;
}
.note-item:hover {
  background: #f8fafc;
}
.note-item.active {
  border-color: var(--color-primary);
  background: #eef5ff;
}

.note-title {
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 6px;
}

.note-snippet {
  font-size: 12px;
  color: #475569;
  margin-bottom: 8px;
}

.note-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #64748b;
  font-size: 12px;
}

.icon {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
}
.icon:hover {
  background: rgba(239,68,68,0.08);
}
.icon.danger {
  color: #ef4444;
}

.editor-body {
  display: grid;
  gap: 10px;
}

.input, .textarea {
  width: 100%;
  border: 1px solid rgba(100,116,139,0.25);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  color: var(--color-text);
  outline: none;
  transition: border-color .12s ease, box-shadow .12s ease, background .12s ease;
  background: #fff;
}
.input::placeholder, .textarea::placeholder {
  color: #94a3b8;
}
.input:focus, .textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
}

.title-input {
  font-size: 16px;
  font-weight: 600;
}

.content-input {
  resize: vertical;
  min-height: 260px;
}

.btn {
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  background: var(--color-secondary);
  color: #fff;
  transition: transform .06s ease, box-shadow .2s ease, background .2s ease, opacity .2s ease;
  box-shadow: var(--shadow-sm);
}
.btn:hover {
  opacity: 0.95;
}
.btn.primary {
  background: var(--color-primary);
}
.btn.ghost {
  background: #fff;
  color: var(--color-muted);
  border: 1px solid rgba(100,116,139,0.2);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty {
  text-align: center;
  color: var(--color-muted);
}
.empty p {
  margin: 8px 0;
}
.muted {
  color: #94a3b8;
}
</style>
