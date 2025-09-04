# Simple Notes Frontend (Nuxt 3)

A minimalistic, responsive, light-themed notes app built with Nuxt 3. Users can list, create, edit, and delete notes. The UI follows a clean two-pane layout with a header and a floating action button.

Colors:
- Primary: #3b82f6
- Secondary: #64748b
- Accent: #f59e42

## Features
- List all notes (sorted by last updated)
- Create a new note (global + floating action button)
- Edit title and content
- Save with Ctrl+S in editor
- Delete note
- Responsive layout: two panes on desktop, stacked on mobile
- Minimal, light theme

## Backend API
The app communicates with a backend REST API via HTTP:
- GET    {API_BASE}/notes
- POST   {API_BASE}/notes
- PUT    {API_BASE}/notes/{id}
- DELETE {API_BASE}/notes/{id}

Set API base via environment variable:
- NOTES_API_BASE_URL (e.g., http://localhost:8000)

Nuxt runtime config maps this to `runtimeConfig.public.apiBase`. Default is `/api` if not provided.

## Setup

Install dependencies:
```bash
npm install
# or: pnpm install | yarn install | bun install
```

Create a `.env` file (optional if you use same-origin proxy):
```bash
cp .env.example .env
# Edit NOTES_API_BASE_URL as needed, e.g. http://localhost:8000
```

Run the dev server:
```bash
npm run dev
```
App will be available at http://localhost:3000

## Build
```bash
npm run build
npm run preview
```

## Notes
- Ensure the backend has CORS enabled or use a same-origin proxy at `/api`.
- Selection and edits are kept in memory until you click Save or press Ctrl+S in the editor.

## Development
- Main state logic: `composables/useNotes.ts`
- UI layout: `components/NotesView.vue`
- Entry shell with header + FAB: `app.vue`

Check [Nuxt docs](https://nuxt.com/docs/getting-started/introduction) for further customization.
