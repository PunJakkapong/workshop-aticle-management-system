// User interface for IndexedDB/localStorage client-side storage
// This replaces the previous Sequelize model

export interface User {
  id: number
  username: string
  password: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  bio?: string
  role: 'admin' | 'editor' | 'author' | 'reader'
  isActive: boolean
  lastLogin?: Date
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    notifications: {
      email: boolean
      push: boolean
      comments: boolean
      mentions: boolean
    }
  }
  social?: {
    website?: string
    twitter?: string
    github?: string
    linkedin?: string
  }
  createdAt: Date
  updatedAt: Date
}

// Default user data structure
export const createDefaultUser = (userData: Partial<User>): User => ({
  id: userData.id || Date.now(),
  username: userData.username || '',
  password: userData.password || '',
  email: userData.email || '',
  firstName: userData.firstName,
  lastName: userData.lastName,
  avatar: userData.avatar,
  bio: userData.bio,
  role: userData.role || 'reader',
  isActive: userData.isActive ?? true,
  lastLogin: userData.lastLogin,
  preferences: {
    theme: 'system',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      comments: true,
      mentions: true
    },
    ...userData.preferences
  },
  social: userData.social,
  createdAt: userData.createdAt || new Date(),
  updatedAt: userData.updatedAt || new Date()
})

// User validation helpers
export const validateUser = (user: Partial<User>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!user.username?.trim()) {
    errors.push('Username is required')
  }
  
  if (!user.email?.trim()) {
    errors.push('Email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.push('Invalid email format')
  }
  
  if (!user.password || user.password.length < 6) {
    errors.push('Password must be at least 6 characters')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
