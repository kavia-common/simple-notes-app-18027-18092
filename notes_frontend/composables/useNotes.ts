import { ref, computed } from 'vue'

/**
 * Notes composable: manages fetching, creating, updating, deleting notes with a reactive store.
 * PUBLIC INTERFACES:
 *  - fetchNotes
 *  - createNote
 *  - updateNote
 *  - deleteNote
 *  - selectNote
 *  - selectedNote
 *  - notes
 *  - isLoading
 *  - error
 *  - saveSelectedNote
 */

export type Note = {
  id: string
  title: string
  content: string
  createdAt?: string
  updatedAt?: string
}

const _notes = ref<Note[]>([])
const _selectedId = ref<string | null>(null)
const _loading = ref(false)
const _error = ref<string | null>(null)

function useApiBase() {
  const config = useRuntimeConfig()
  // Ensure no trailing slashes duplication
  let base = (config.public?.apiBase || '/api') as string
  if (base.endsWith('/')) base = base.slice(0, -1)
  return base
}

function sortNotesByUpdated(a: Note, b: Note) {
  const au = a.updatedAt || a.createdAt || ''
  const bu = b.updatedAt || b.createdAt || ''
  return bu.localeCompare(au)
}

// PUBLIC_INTERFACE
export function useNotes() {
  /** This is a public function returning CRUD methods and reactive state for notes. */
  const apiBase = useApiBase()

  const notes = computed(() => _notes.value.slice().sort(sortNotesByUpdated))
  const selectedNote = computed<Note | null>(() => {
    return _notes.value.find(n => n.id === _selectedId.value) || null
  })
  const isLoading = computed(() => _loading.value)
  const error = computed(() => _error.value)

  // PUBLIC_INTERFACE
  async function fetchNotes() {
    /** Fetch all notes from backend and update local state. */
    _loading.value = true
    _error.value = null
    try {
      const data = await $fetch<Note[]>(`${apiBase}/notes`, { method: 'GET' })
      _notes.value = Array.isArray(data) ? data : []
      if (_notes.value.length && !_selectedId.value) {
        _selectedId.value = _notes.value[0].id
      }
    } catch (err: any) {
      console.error(err)
      _error.value = 'Failed to load notes.'
    } finally {
      _loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  function selectNote(id: string | null) {
    /** Select a note by id for editing. Pass null to deselect. */
    _selectedId.value = id
  }

  // PUBLIC_INTERFACE
  async function createNote() {
    /**
     * Create a new empty note and select it.
     * Backend should return the created note with id.
     */
    _loading.value = true
    _error.value = null
    try {
      const payload = { title: 'Untitled note', content: '' }
      const created = await $fetch<Note>(`${apiBase}/notes`, {
        method: 'POST',
        body: payload,
      })
      _notes.value.unshift(created)
      _selectedId.value = created.id
      return created
    } catch (err: any) {
      console.error(err)
      _error.value = 'Failed to create note.'
      throw err
    } finally {
      _loading.value = false
    }
  }

  // PUBLIC_INTERFACE
  async function updateNote(id: string, updates: Partial<Pick<Note, 'title' | 'content'>>) {
    /** Update an existing note fields and sync local state. */
    _error.value = null
    try {
      const updated = await $fetch<Note>(`${apiBase}/notes/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: updates,
      })
      const idx = _notes.value.findIndex(n => n.id === id)
      if (idx !== -1) {
        _notes.value[idx] = { ..._notes.value[idx], ...updated }
      }
      return updated
    } catch (err: any) {
      console.error(err)
      _error.value = 'Failed to update note.'
      throw err
    }
  }

  // PUBLIC_INTERFACE
  async function deleteNote(id: string) {
    /** Delete a note by id and update local state and selection. */
    _error.value = null
    try {
      await $fetch(`${apiBase}/notes/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      const idx = _notes.value.findIndex(n => n.id === id)
      if (idx !== -1) _notes.value.splice(idx, 1)
      if (_selectedId.value === id) {
        _selectedId.value = _notes.value.length ? _notes.value[0].id : null
      }
    } catch (err: any) {
      console.error(err)
      _error.value = 'Failed to delete note.'
      throw err
    }
  }

  // PUBLIC_INTERFACE
  async function saveSelectedNote() {
    /** Convenience helper to save the currently selected note (title/content). */
    const note = selectedNote.value
    if (!note) return
    return updateNote(note.id, { title: note.title, content: note.content })
  }

  return {
    notes,
    selectedNote,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    saveSelectedNote,
  }
}
