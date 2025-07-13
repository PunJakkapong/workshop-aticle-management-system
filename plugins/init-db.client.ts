import { initializeSampleData } from '~/utils/db'

export default defineNuxtPlugin(async () => {
  // Initialize IndexedDB with sample data on client side
  if (process.client) {
    try {
      await initializeSampleData()
      console.log('Database initialized with sample data')
    } catch (error) {
      console.error('Failed to initialize database:', error)
    }
  }
})