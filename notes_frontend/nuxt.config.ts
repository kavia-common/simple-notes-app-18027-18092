export default defineNuxtConfig({
  // https://nuxt.com/docs/api/configuration/nuxt-config
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Simple Notes',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'description', content: 'Create, edit, and delete your notes with a clean, minimal interface.' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      // Provide the backend base URL via env var; default to same-origin '/api' path proxy
      // Request the environment variable NOTES_API_BASE_URL from the user/environment.
      apiBase: process.env.NOTES_API_BASE_URL || '/api',
    },
  },

  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    },
  },

  css: [
    // could include global css files later
  ],

  vite: {
    server: {
      host: '0.0.0.0',
      allowedHosts: true,
      port: 3000,
    },
  },
})
