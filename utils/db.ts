import { openDB, type DBSchema, type IDBPDatabase } from 'idb'

export interface Article {
  id: number
  title: string
  slug: string
  content: string
  excerpt?: string
  featuredImage?: string
  status: 'draft' | 'published' | 'archived'
  publishedAt?: string
  scheduledAt?: string
  authorId: number
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  readingTime?: number
  viewCount: number
  likeCount: number
  commentCount: number
  isFeatured: boolean
  seriesId?: number
  categories: number[]
  tags: number[]
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  color?: string
  icon?: string
  parentId?: number
  isActive: boolean
  articleCount: number
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: number
  name: string
  slug: string
  description?: string
  color?: string
  isActive: boolean
  articleCount: number
  createdAt: string
  updatedAt: string
}

export interface ArticleSeries {
  id: number
  title: string
  slug: string
  description?: string
  featuredImage?: string
  authorId: number
  isActive: boolean
  articleCount: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: number
  username: string
  email: string
  password?: string
  bio?: string
  avatar?: string
  role: 'admin' | 'author' | 'user'
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: number
  articleId: number
  content: string
  name: string
  email: string
  parentId?: number
  likeCount: number
  createdAt: string
  updatedAt: string
}

interface ArticleDB extends DBSchema {
  articles: {
    key: number
    value: Article
    indexes: {
      'by-status': string
      'by-slug': string
      'by-author': number
      'by-featured': boolean
      'by-published': string
    }
  }
  categories: {
    key: number
    value: Category
    indexes: {
      'by-slug': string
      'by-active': boolean
    }
  }
  tags: {
    key: number
    value: Tag
    indexes: {
      'by-slug': string
      'by-active': boolean
    }
  }
  series: {
    key: number
    value: ArticleSeries
    indexes: {
      'by-slug': string
      'by-author': number
    }
  }
  users: {
    key: number
    value: User
    indexes: {
      'by-email': string
      'by-username': string
    }
  }
  comments: {
    key: number
    value: Comment
    indexes: {
      'by-article': number
      'by-parent': number
    }
  }
}

let dbInstance: IDBPDatabase<ArticleDB> | null = null

export async function getDB(): Promise<IDBPDatabase<ArticleDB>> {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await openDB<ArticleDB>('ArticleManagementDB', 1, {
    upgrade(db) {
      // Articles store
      const articlesStore = db.createObjectStore('articles', { keyPath: 'id' })
      articlesStore.createIndex('by-status', 'status')
      articlesStore.createIndex('by-slug', 'slug', { unique: true })
      articlesStore.createIndex('by-author', 'authorId')
      articlesStore.createIndex('by-featured', 'isFeatured')
      articlesStore.createIndex('by-published', 'publishedAt')

      // Categories store
      const categoriesStore = db.createObjectStore('categories', { keyPath: 'id' })
      categoriesStore.createIndex('by-slug', 'slug', { unique: true })
      categoriesStore.createIndex('by-active', 'isActive')

      // Tags store
      const tagsStore = db.createObjectStore('tags', { keyPath: 'id' })
      tagsStore.createIndex('by-slug', 'slug', { unique: true })
      tagsStore.createIndex('by-active', 'isActive')

      // Series store
      const seriesStore = db.createObjectStore('series', { keyPath: 'id' })
      seriesStore.createIndex('by-slug', 'slug', { unique: true })
      seriesStore.createIndex('by-author', 'authorId')

      // Users store
      const usersStore = db.createObjectStore('users', { keyPath: 'id' })
      usersStore.createIndex('by-email', 'email', { unique: true })
      usersStore.createIndex('by-username', 'username', { unique: true })

      // Comments store
      const commentsStore = db.createObjectStore('comments', { keyPath: 'id' })
      commentsStore.createIndex('by-article', 'articleId')
      commentsStore.createIndex('by-parent', 'parentId')
    },
  })

  return dbInstance
}

// Utility functions for ID generation
export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000)
}

// Sample data initialization
export async function initializeSampleData() {
  const db = await getDB()
  
  // Check if data already exists
  const existingArticles = await db.count('articles')
  if (existingArticles > 0) {
    return // Data already exists
  }

  // Create sample user
  const sampleUser: User = {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    bio: 'Administrator and content creator',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  await db.add('users', sampleUser)

  // Create sample categories
  const sampleCategories: Category[] = [
    {
      id: 1,
      name: 'Web Development',
      slug: 'web-development',
      description: 'Articles about web development',
      color: '#3b82f6',
      icon: 'i-heroicons-globe-alt',
      isActive: true,
      articleCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'JavaScript',
      slug: 'javascript',
      description: 'JavaScript tutorials and tips',
      color: '#f59e0b',
      icon: 'i-simple-icons-javascript',
      isActive: true,
      articleCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Vue.js',
      slug: 'vuejs',
      description: 'Vue.js framework articles',
      color: '#10b981',
      icon: 'i-simple-icons-vuedotjs',
      isActive: true,
      articleCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  for (const category of sampleCategories) {
    await db.add('categories', category)
  }

  // Create sample tags
  const sampleTags: Tag[] = [
    {
      id: 1,
      name: 'Tutorial',
      slug: 'tutorial',
      description: 'Tutorial articles',
      color: '#8b5cf6',
      isActive: true,
      articleCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Beginner',
      slug: 'beginner',
      description: 'Beginner-friendly content',
      color: '#06b6d4',
      isActive: true,
      articleCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Advanced',
      slug: 'advanced',
      description: 'Advanced topics',
      color: '#ef4444',
      isActive: true,
      articleCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  for (const tag of sampleTags) {
    await db.add('tags', tag)
  }

  // Create sample articles
  const sampleArticles: Article[] = [
    {
      id: 1,
      title: 'Getting Started with Vue 3 Composition API',
      slug: 'getting-started-vue-3-composition-api',
      content: '<h2>Introduction</h2><p>The Vue 3 Composition API is a powerful new way to organize your Vue.js components...</p><h2>Basic Usage</h2><p>Here\'s how you can start using the Composition API in your Vue 3 applications...</p>',
      excerpt: 'Learn how to use the Vue 3 Composition API to build better Vue.js applications with improved code organization and reusability.',
      status: 'published',
      publishedAt: new Date().toISOString(),
      authorId: 1,
      metaTitle: 'Getting Started with Vue 3 Composition API - Complete Guide',
      metaDescription: 'Learn how to use the Vue 3 Composition API to build better Vue.js applications with improved code organization and reusability.',
      metaKeywords: 'Vue 3, Composition API, JavaScript, Frontend',
      readingTime: 8,
      viewCount: 1250,
      likeCount: 45,
      commentCount: 12,
      isFeatured: true,
      categories: [1, 3],
      tags: [1, 2],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Advanced TypeScript Patterns for Better Code',
      slug: 'advanced-typescript-patterns-better-code',
      content: '<h2>Type Guards</h2><p>Type guards are a way to narrow down the type of a variable...</p><h2>Utility Types</h2><p>TypeScript provides several utility types that help with common type transformations...</p>',
      excerpt: 'Explore advanced TypeScript patterns and techniques to write more maintainable and type-safe code.',
      status: 'published',
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      authorId: 1,
      metaTitle: 'Advanced TypeScript Patterns for Better Code',
      metaDescription: 'Explore advanced TypeScript patterns and techniques to write more maintainable and type-safe code.',
      metaKeywords: 'TypeScript, Advanced, Patterns, Type Safety',
      readingTime: 12,
      viewCount: 890,
      likeCount: 32,
      commentCount: 8,
      isFeatured: false,
      categories: [1, 2],
      tags: [1, 3],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 3,
      title: 'Building Responsive Layouts with CSS Grid',
      slug: 'building-responsive-layouts-css-grid',
      content: '<h2>CSS Grid Basics</h2><p>CSS Grid is a powerful layout system that allows you to create complex layouts...</p><h2>Responsive Design</h2><p>Making your grid layouts responsive is crucial for modern web development...</p>',
      excerpt: 'Master CSS Grid to create flexible and responsive web layouts that work across all devices.',
      status: 'draft',
      authorId: 1,
      metaTitle: 'Building Responsive Layouts with CSS Grid',
      metaDescription: 'Master CSS Grid to create flexible and responsive web layouts that work across all devices.',
      metaKeywords: 'CSS Grid, Responsive Design, Layout, CSS',
      readingTime: 10,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      isFeatured: false,
      categories: [1],
      tags: [1, 2],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  for (const article of sampleArticles) {
    await db.add('articles', article)
  }
}