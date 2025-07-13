import { defineStore } from 'pinia'
import type { Tag } from '~/utils/db'

export const useTagsStore = defineStore('tags', () => {
  const tags = ref<Tag[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { getTags, getTagBySlug, createTag } = useStorage()

  const fetchTags = async (activeOnly = true) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await getTags(activeOnly)
      tags.value = result
      return result
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchTagBySlug = async (slug: string) => {
    try {
      return await getTagBySlug(slug)
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const saveTag = async (tagData: any) => {
    loading.value = true
    error.value = null
    
    try {
      const savedTag = await createTag(tagData)
      tags.value.push(savedTag)
      return savedTag
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTagOptions = computed(() => 
    tags.value.map(tag => ({
      label: tag.name,
      value: tag.id,
      color: tag.color
    }))
  )

  return {
    // State
    tags: readonly(tags),
    loading: readonly(loading),
    error: readonly(error),
    
    // Getters
    getTagOptions,
    
    // Actions
    fetchTags,
    fetchTagBySlug,
    saveTag
  }
})