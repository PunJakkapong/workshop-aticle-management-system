export const useSearch = () => {
  const searchQuery = ref('')
  const searchResults = ref([])
  const loading = ref(false)
  const suggestions = ref([])
  const searchHistory = ref([])

  // Debounced search function
  const debouncedSearch = useDebounceFn(async (query: string) => {
    if (!query.trim()) {
      searchResults.value = []
      return
    }

    loading.value = true

    try {
      const storage = useStorage()
      const results = await storage.searchContent(query, 'articles')
      searchResults.value = results
      
      // Add to search history (client-side only)
      if (process.client) {
        addToSearchHistory(query)
      }
    } catch (error) {
      console.error('Search failed:', error)
      searchResults.value = []
    } finally {
      loading.value = false
    }
  }, 300)

  // Get search suggestions
  const getSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      suggestions.value = []
      return
    }

    try {
      const storage = useStorage()
      const response = await storage.getSuggestions(query)
      suggestions.value = response.suggestions
    } catch (error) {
      console.error('Failed to get suggestions:', error)
      suggestions.value = []
    }
  }

  // Advanced search with filters
  const advancedSearch = async (params: {
    query?: string
    category?: string
    tag?: string
    author?: string
    dateFrom?: string
    dateTo?: string
    sortBy?: string
    sortOrder?: string
  }) => {
    loading.value = true

    try {
      const storage = useStorage()
      const articlesStore = useArticlesStore()
      
      // Convert category/tag slugs to IDs if needed
      let categoryId = undefined
      let tagId = undefined
      
      if (params.category) {
        const categoriesStore = useCategoriesStore()
        const category = await categoriesStore.fetchCategoryBySlug(params.category)
        categoryId = category?.id
      }
      
      if (params.tag) {
        const tagsStore = useTagsStore()
        const tag = await tagsStore.fetchTagBySlug(params.tag)
        tagId = tag?.id
      }
      
      const searchParams = {
        search: params.query,
        category: categoryId,
        tag: tagId,
        author: params.author ? parseInt(params.author) : undefined,
        sortBy: params.sortBy || 'publishedAt',
        sortOrder: (params.sortOrder?.toUpperCase() as 'ASC' | 'DESC') || 'DESC',
        status: 'published'
      }
      
      const response = await articlesStore.fetchArticles(searchParams)
      searchResults.value = response.articles
      return response
    } catch (error) {
      console.error('Advanced search failed:', error)
      searchResults.value = []
      throw error
    } finally {
      loading.value = false
    }
  }

  // Full-text search with highlighting
  const fullTextSearch = async (query: string, options = {}) => {
    loading.value = true

    try {
      const response = await $fetch('/api/v1/search/fulltext', {
        query: {
          q: query,
          highlight: true,
          ...options
        }
      })
      searchResults.value = response.results
      return response
    } catch (error) {
      console.error('Full-text search failed:', error)
      searchResults.value = []
      throw error
    } finally {
      loading.value = false
    }
  }

  // Search within content
  const searchInContent = async (articleId: number, query: string) => {
    try {
      const response = await $fetch(`/api/v1/articles/${articleId}/search`, {
        query: { q: query }
      })
      return response.matches
    } catch (error) {
      console.error('Content search failed:', error)
      return []
    }
  }

  // Get popular searches
  const getPopularSearches = async () => {
    try {
      const response = await $fetch('/api/v1/search/popular')
      return response.searches
    } catch (error) {
      console.error('Failed to get popular searches:', error)
      return []
    }
  }

  // Search history management (client-side)
  const addToSearchHistory = (query: string) => {
    if (!process.client) return

    const history = getSearchHistory()
    const filtered = history.filter(item => item.query !== query)
    const newHistory = [
      { query, timestamp: new Date().toISOString() },
      ...filtered
    ].slice(0, 10) // Keep only last 10 searches

    localStorage.setItem('searchHistory', JSON.stringify(newHistory))
    searchHistory.value = newHistory
  }

  const getSearchHistory = () => {
    if (!process.client) return []

    try {
      const history = localStorage.getItem('searchHistory')
      return history ? JSON.parse(history) : []
    } catch (error) {
      return []
    }
  }

  const clearSearchHistory = () => {
    if (!process.client) return

    localStorage.removeItem('searchHistory')
    searchHistory.value = []
  }

  // Search filters
  const createSearchFilters = () => {
    const filters = reactive({
      category: null,
      tag: null,
      author: null,
      dateRange: null,
      readingTime: null,
      sortBy: 'relevance'
    })

    const applyFilters = () => {
      const params = {
        query: searchQuery.value,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== null && value !== '')
        )
      }
      return advancedSearch(params)
    }

    const clearFilters = () => {
      Object.keys(filters).forEach(key => {
        filters[key] = key === 'sortBy' ? 'relevance' : null
      })
    }

    return {
      filters,
      applyFilters,
      clearFilters
    }
  }

  // Search analytics
  const trackSearch = async (query: string, resultsCount: number) => {
    try {
      await $fetch('/api/v1/search/analytics', {
        method: 'POST',
        body: {
          query,
          resultsCount,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      // Silent fail for analytics
    }
  }

  // Initialize search history on mount
  onMounted(() => {
    if (process.client) {
      searchHistory.value = getSearchHistory()
    }
  })

  // Watch for search query changes
  watch(searchQuery, (newQuery) => {
    if (newQuery.trim()) {
      debouncedSearch(newQuery)
      getSuggestions(newQuery)
    } else {
      searchResults.value = []
      suggestions.value = []
    }
  })

  return {
    searchQuery,
    searchResults: readonly(searchResults),
    loading: readonly(loading),
    suggestions: readonly(suggestions),
    searchHistory: readonly(searchHistory),
    debouncedSearch,
    getSuggestions,
    advancedSearch,
    fullTextSearch,
    searchInContent,
    getPopularSearches,
    addToSearchHistory,
    getSearchHistory,
    clearSearchHistory,
    createSearchFilters,
    trackSearch
  }
}