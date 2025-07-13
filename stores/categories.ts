import { defineStore } from 'pinia'
import type { Category } from '~/utils/db'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { getCategories, getCategoryBySlug, createCategory } = useStorage()

  const fetchCategories = async (activeOnly = true) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await getCategories(activeOnly)
      categories.value = result
      return result
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchCategoryBySlug = async (slug: string) => {
    try {
      return await getCategoryBySlug(slug)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const saveCategory = async (categoryData: any) => {
    loading.value = true
    error.value = null
    
    try {
      const savedCategory = await createCategory(categoryData)
      categories.value.push(savedCategory)
      return savedCategory
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getCategoryOptions = computed(() => 
    categories.value.map(cat => ({
      label: cat.name,
      value: cat.id,
      color: cat.color,
      icon: cat.icon
    }))
  )

  return {
    // State
    categories: readonly(categories),
    loading: readonly(loading),
    error: readonly(error),
    
    // Getters
    getCategoryOptions,
    
    // Actions
    fetchCategories,
    fetchCategoryBySlug,
    saveCategory
  }
})