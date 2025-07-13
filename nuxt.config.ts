// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/ui", "@vueuse/nuxt", "@pinia/nuxt", "@nuxtjs/tailwindcss"],
  css: ["~/assets/css/main.css"],
  
  // Dev server configuration
  devServer: {
    port: 3001
  },
  
  // Color Mode Configuration
  colorMode: {
    preference: 'system',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },
  
  // App Configuration
  app: {
    head: {
      title: 'Article Management System',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A comprehensive article management system with rich text editing, SEO optimization, and powerful content organization.' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  
  // Server-side rendering
  ssr: true,
  
  // Runtime config
  runtimeConfig: {
    // Private keys (only available on server-side)
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    
    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.API_BASE_URL || '/api'
    }
  }
});
