import { defineStore } from 'pinia'
import type { Article } from '~/utils/db'

export const useArticlesStore = defineStore('articles', () => {
  const articles = ref<Article[]>([])
  const currentArticle = ref<Article | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { 
    getArticles,
    getArticleBySlug,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    incrementViewCount,
    toggleLike
  } = useStorage()

  const fetchArticles = async (filters = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const result = await getArticles(filters)
      articles.value = result.articles
      return result
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchArticleBySlug = async (slug: string) => {
    loading.value = true
    error.value = null
    
    try {
      const article = await getArticleBySlug(slug)
      currentArticle.value = article
      
      if (article) {
        // Increment view count
        await incrementViewCount(article.id)
        if (currentArticle.value) {
          currentArticle.value.viewCount += 1
        }
      }
      
      return article
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const saveArticle = async (articleData: any) => {
    loading.value = true
    error.value = null
    
    try {
      let savedArticle
      
      if (articleData.id) {
        savedArticle = await updateArticle(articleData.id, articleData)
        // Update in local state
        const index = articles.value.findIndex(a => a.id === articleData.id)
        if (index !== -1) {
          articles.value[index] = savedArticle
        }
      } else {
        savedArticle = await createArticle(articleData)
        articles.value.unshift(savedArticle)
      }
      
      currentArticle.value = savedArticle
      return savedArticle
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeArticle = async (id: number, soft = true) => {
    loading.value = true
    error.value = null
    
    try {
      await deleteArticle(id, soft)
      
      if (soft) {
        // Update local state for soft delete
        const index = articles.value.findIndex(a => a.id === id)
        if (index !== -1) {
          articles.value[index].status = 'archived'
          articles.value[index].deletedAt = new Date().toISOString()
        }
      } else {
        // Remove from local state for hard delete
        articles.value = articles.value.filter(a => a.id !== id)
      }
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const likeArticle = async (id: number) => {
    try {
      await toggleLike(id)
      
      // Update local state
      const article = articles.value.find(a => a.id === id)
      if (article) {
        article.likeCount += 1
      }
      
      if (currentArticle.value && currentArticle.value.id === id) {
        currentArticle.value.likeCount += 1
      }
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const getRelatedArticles = async (articleId: number, limit = 3) => {
    try {
      const article = await getArticleById(articleId)
      if (!article) return []
      
      const { articles: allArticles } = await getArticles({ 
        status: 'published' 
      })
      
      // Find articles with similar categories or tags
      const related = allArticles
        .filter(a => 
          a.id !== articleId &&
          (a.categories.some(cat => article.categories.includes(cat)) ||
           a.tags.some(tag => article.tags.includes(tag)))
        )
        .slice(0, limit)
      
      return related
    } catch (err: any) {
      error.value = err.message
      return []
    }
  }

  const getFeaturedArticles = async (limit = 4) => {
    try {
      const result = await getArticles({ 
        featured: true, 
        status: 'published',
        limit 
      })
      return result.articles
    } catch (err: any) {
      error.value = err.message
      return []
    }
  }

  const getPopularArticles = async (limit = 5) => {
    try {
      const result = await getArticles({ 
        status: 'published',
        sortBy: 'viewCount',
        sortOrder: 'DESC',
        limit 
      })
      return result.articles
    } catch (err: any) {
      error.value = err.message
      return []
    }
  }

  const getRecentArticles = async (limit = 5) => {
    try {
      const result = await getArticles({ 
        status: 'published',
        sortBy: 'publishedAt',
        sortOrder: 'DESC',
        limit 
      })
      return result.articles
    } catch (err: any) {
      error.value = err.message
      return []
    }
  }

  return {
    // State
    articles: readonly(articles),
    currentArticle: readonly(currentArticle),
    loading: readonly(loading),
    error: readonly(error),
    
    // Actions
    fetchArticles,
    fetchArticleBySlug,
    saveArticle,
    removeArticle,
    likeArticle,
    getRelatedArticles,
    getFeaturedArticles,
    getPopularArticles,
    getRecentArticles
  }
})