 /**
  * Minimal API utilities for future extension (auth headers, etc.).
  * Currently not used directly because $fetch in composables handles simple REST calls.
  * Kept to document the expected NOTES_API_BASE_URL environment variable.
  *
  * Required env:
  *  - NOTES_API_BASE_URL: Base URL of the backend (e.g., http://localhost:8000)
  *
  * Do not hardcode URLs; use runtimeConfig.public.apiBase (nuxt.config.ts) which reads this env var.
  */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export function joinUrl(base: string, path: string) {
  const a = base.replace(/\/+$/, '')
  const b = path.replace(/^\/+/, '')
  return `${a}/${b}`
}
```

Explanation: Add a .env.example to show required env var for backend URL.
````write file="simple-notes-app-18027-18092/notes_frontend/.env.example"
# Base URL for backend REST API (ensure CORS is configured on the backend as needed)
# Example: http://localhost:8000
NOTES_API_BASE_URL=http://localhost:8000
