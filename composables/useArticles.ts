export const useArticles = () => {
  // Use the articles store for state management
  const articlesStore = useArticlesStore()
  const storage = useStorage()

  const fetchArticles = async (params = {}) => {
    return await articlesStore.fetchArticles({
      status: 'published',
      ...params
    })
  }

  const fetchArticle = async (slugOrId: string | number) => {
    if (typeof slugOrId === 'string') {
      return await articlesStore.fetchArticleBySlug(slugOrId)
    } else {
      return await storage.getArticleById(slugOrId)
    }
  }

  const createArticle = async (articleData: any) => {
    return await articlesStore.saveArticle(articleData)
  }

  const updateArticle = async (id: number, articleData: any) => {
    return await articlesStore.saveArticle({ ...articleData, id })
  }

  const deleteArticle = async (id: number) => {
    return await articlesStore.removeArticle(id)
  }

  const searchArticles = async (query: string, filters = {}) => {
    return await articlesStore.fetchArticles({
      search: query,
      status: 'published',
      ...filters
    })
  }

  const getArticlesByCategory = async (categorySlug: string) => {
    const categoriesStore = useCategoriesStore()
    const category = await categoriesStore.fetchCategoryBySlug(categorySlug)
    
    if (category) {
      return await articlesStore.fetchArticles({
        category: category.id,
        status: 'published'
      })
    }
    
    return { articles: [], total: 0 }
  }

  const getArticlesByTag = async (tagSlug: string) => {
    const tagsStore = useTagsStore()
    const tag = await tagsStore.fetchTagBySlug(tagSlug)
    
    if (tag) {
      return await articlesStore.fetchArticles({
        tag: tag.id,
        status: 'published'
      })
    }
    
    return { articles: [], total: 0 }
  }

  const getFeaturedArticles = async (limit = 4) => {
    return await articlesStore.getFeaturedArticles(limit)
  }

  const getRelatedArticles = async (articleId: number, limit = 3) => {
    return await articlesStore.getRelatedArticles(articleId, limit)
  }

  return {
    // Access store state
    articles: articlesStore.articles,
    loading: articlesStore.loading,
    error: articlesStore.error,
    
    // Actions
    fetchArticles,
    fetchArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    searchArticles,
    getArticlesByCategory,
    getArticlesByTag,
    getFeaturedArticles,
    getRelatedArticles
  }
}