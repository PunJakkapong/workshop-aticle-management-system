import { getDB, generateId, type Article, type Category, type Tag, type ArticleSeries, type Comment, type User } from '~/utils/db'

export const useStorage = () => {
  // Articles
  const getArticles = async (filters: {
    status?: string
    category?: number
    tag?: number
    author?: number
    search?: string
    featured?: boolean
    limit?: number
    offset?: number
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
  } = {}) => {
    const db = await getDB()
    let articles = await db.getAll('articles')

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      articles = articles.filter(article => article.status === filters.status)
    }

    if (filters.category) {
      articles = articles.filter(article => article.categories.includes(filters.category!))
    }

    if (filters.tag) {
      articles = articles.filter(article => article.tags.includes(filters.tag!))
    }

    if (filters.author) {
      articles = articles.filter(article => article.authorId === filters.author)
    }

    if (filters.featured !== undefined) {
      articles = articles.filter(article => article.isFeatured === filters.featured)
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      articles = articles.filter(article => 
        article.title.toLowerCase().includes(searchTerm) ||
        article.content.toLowerCase().includes(searchTerm) ||
        article.excerpt?.toLowerCase().includes(searchTerm) ||
        article.metaKeywords?.toLowerCase().includes(searchTerm)
      )
    }

    // Sort articles
    const sortBy = filters.sortBy || 'publishedAt'
    const sortOrder = filters.sortOrder || 'DESC'
    
    articles.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Article]
      let bValue: any = b[sortBy as keyof Article]
      
      if (sortBy === 'publishedAt' || sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue || 0).getTime()
        bValue = new Date(bValue || 0).getTime()
      }
      
      if (sortOrder === 'ASC') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Apply pagination
    const total = articles.length
    if (filters.offset !== undefined) {
      articles = articles.slice(filters.offset)
    }
    if (filters.limit) {
      articles = articles.slice(0, filters.limit)
    }

    return { articles, total }
  }

  const getArticleBySlug = async (slug: string) => {
    const db = await getDB()
    const articles = await db.getAllFromIndex('articles', 'by-slug', slug)
    return articles[0] || null
  }

  const getArticleById = async (id: number) => {
    const db = await getDB()
    return await db.get('articles', id)
  }

  const createArticle = async (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => {
    const db = await getDB()
    const now = new Date().toISOString()
    
    const article: Article = {
      ...articleData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      viewCount: articleData.viewCount || 0,
      likeCount: articleData.likeCount || 0,
      commentCount: articleData.commentCount || 0,
      isFeatured: articleData.isFeatured || false
    }

    await db.add('articles', article)
    return article
  }

  const updateArticle = async (id: number, articleData: Partial<Article>) => {
    const db = await getDB()
    const existing = await db.get('articles', id)
    
    if (!existing) {
      throw new Error('Article not found')
    }

    const updated: Article = {
      ...existing,
      ...articleData,
      id,
      updatedAt: new Date().toISOString()
    }

    await db.put('articles', updated)
    return updated
  }

  const deleteArticle = async (id: number, soft = true) => {
    const db = await getDB()
    
    if (soft) {
      const existing = await db.get('articles', id)
      if (existing) {
        await updateArticle(id, { 
          deletedAt: new Date().toISOString(),
          status: 'archived'
        })
      }
    } else {
      await db.delete('articles', id)
    }
  }

  const incrementViewCount = async (id: number) => {
    const article = await getArticleById(id)
    if (article) {
      await updateArticle(id, { viewCount: article.viewCount + 1 })
    }
  }

  const toggleLike = async (id: number) => {
    const article = await getArticleById(id)
    if (article) {
      await updateArticle(id, { likeCount: article.likeCount + 1 })
    }
  }

  // Categories
  const getCategories = async (activeOnly = true) => {
    const db = await getDB()
    let categories = await db.getAll('categories')
    
    if (activeOnly) {
      categories = categories.filter(cat => cat.isActive)
    }
    
    return categories.sort((a, b) => a.name.localeCompare(b.name))
  }

  const getCategoryBySlug = async (slug: string) => {
    const db = await getDB()
    const categories = await db.getAllFromIndex('categories', 'by-slug', slug)
    return categories[0] || null
  }

  const createCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const db = await getDB()
    const now = new Date().toISOString()
    
    const category: Category = {
      ...categoryData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      isActive: categoryData.isActive !== false,
      articleCount: 0
    }

    await db.add('categories', category)
    return category
  }

  // Tags
  const getTags = async (activeOnly = true) => {
    const db = await getDB()
    let tags = await db.getAll('tags')
    
    if (activeOnly) {
      tags = tags.filter(tag => tag.isActive)
    }
    
    return tags.sort((a, b) => a.name.localeCompare(b.name))
  }

  const getTagBySlug = async (slug: string) => {
    const db = await getDB()
    const tags = await db.getAllFromIndex('tags', 'by-slug', slug)
    return tags[0] || null
  }

  const createTag = async (tagData: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>) => {
    const db = await getDB()
    const now = new Date().toISOString()
    
    const tag: Tag = {
      ...tagData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      isActive: tagData.isActive !== false,
      articleCount: 0
    }

    await db.add('tags', tag)
    return tag
  }

  // Users
  const getUsers = async () => {
    const db = await getDB()
    return await db.getAll('users')
  }

  const getUserById = async (id: number) => {
    const db = await getDB()
    return await db.get('users', id)
  }

  const getUserByEmail = async (email: string) => {
    const db = await getDB()
    const users = await db.getAllFromIndex('users', 'by-email', email)
    return users[0] || null
  }

  // Comments
  const getCommentsByArticle = async (articleId: number) => {
    const db = await getDB()
    const comments = await db.getAllFromIndex('comments', 'by-article', articleId)
    return comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const createComment = async (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const db = await getDB()
    const now = new Date().toISOString()
    
    const comment: Comment = {
      ...commentData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      likeCount: 0
    }

    await db.add('comments', comment)
    
    // Update article comment count
    const article = await getArticleById(commentData.articleId)
    if (article) {
      await updateArticle(commentData.articleId, { 
        commentCount: article.commentCount + 1 
      })
    }
    
    return comment
  }

  // Search functionality
  const searchContent = async (query: string, type = 'articles') => {
    const searchTerm = query.toLowerCase()
    
    if (type === 'articles') {
      const { articles } = await getArticles({ 
        search: searchTerm, 
        status: 'published' 
      })
      
      return articles.map(article => ({
        ...article,
        highlightedTitle: highlightText(article.title, query),
        highlightedExcerpt: highlightText(article.excerpt || '', query)
      }))
    }
    
    return []
  }

  const getSuggestions = async (query: string) => {
    const searchTerm = query.toLowerCase()
    const suggestions: any[] = []

    // Get article suggestions
    const { articles } = await getArticles({ 
      status: 'published',
      limit: 5 
    })
    
    const matchingArticles = articles.filter(article => 
      article.title.toLowerCase().includes(searchTerm)
    )
    
    suggestions.push(...matchingArticles.map(article => ({
      type: 'article',
      text: article.title,
      slug: article.slug,
      icon: 'i-heroicons-document-text'
    })))

    // Get category suggestions
    const categories = await getCategories()
    const matchingCategories = categories.filter(cat => 
      cat.name.toLowerCase().includes(searchTerm)
    )
    
    suggestions.push(...matchingCategories.slice(0, 3).map(category => ({
      type: 'category',
      text: category.name,
      slug: category.slug,
      icon: 'i-heroicons-folder'
    })))

    // Get tag suggestions
    const tags = await getTags()
    const matchingTags = tags.filter(tag => 
      tag.name.toLowerCase().includes(searchTerm)
    )
    
    suggestions.push(...matchingTags.slice(0, 3).map(tag => ({
      type: 'tag',
      text: tag.name,
      slug: tag.slug,
      icon: 'i-heroicons-tag'
    })))

    return { suggestions, query }
  }

  return {
    // Articles
    getArticles,
    getArticleBySlug,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    incrementViewCount,
    toggleLike,
    
    // Categories
    getCategories,
    getCategoryBySlug,
    createCategory,
    
    // Tags
    getTags,
    getTagBySlug,
    createTag,
    
    // Users
    getUsers,
    getUserById,
    getUserByEmail,
    
    // Comments
    getCommentsByArticle,
    createComment,
    
    // Search
    searchContent,
    getSuggestions
  }
}

// Helper function for text highlighting
function highlightText(text: string, searchQuery: string): string {
  if (!text || !searchQuery) return text
  
  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>')
}