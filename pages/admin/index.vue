<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p class="text-gray-600 dark:text-gray-400">Welcome back! Here's your content overview.</p>
          </div>
          <div class="flex items-center space-x-3">
            <UButton to="/articles/create" icon="i-heroicons-plus">
              New Article
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Articles</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalArticles }}</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div class="mt-2 flex items-center text-sm">
            <span class="text-green-600 dark:text-green-400">+{{ stats.newArticlesThisMonth }}</span>
            <span class="text-gray-600 dark:text-gray-400 ml-1">this month</span>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.publishedArticles }}</p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div class="mt-2 flex items-center text-sm">
            <span class="text-gray-600 dark:text-gray-400">{{ Math.round((stats.publishedArticles / stats.totalArticles) * 100) }}% of total</span>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatNumber(stats.totalViews) }}</p>
            </div>
            <div class="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <UIcon name="i-heroicons-eye" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div class="mt-2 flex items-center text-sm">
            <span class="text-green-600 dark:text-green-400">+{{ formatNumber(stats.viewsThisMonth) }}</span>
            <span class="text-gray-600 dark:text-gray-400 ml-1">this month</span>
          </div>
        </UCard>

        <UCard>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Comments</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalComments }}</p>
            </div>
            <div class="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <UIcon name="i-heroicons-chat-bubble-left" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div class="mt-2 flex items-center text-sm">
            <span class="text-green-600 dark:text-green-400">+{{ stats.commentsThisMonth }}</span>
            <span class="text-gray-600 dark:text-gray-400 ml-1">this month</span>
          </div>
        </UCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Recent Articles -->
        <div class="lg:col-span-2">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Recent Articles</h2>
                <UButton to="/admin/articles" variant="ghost" size="sm">
                  View All
                </UButton>
              </div>
            </template>

            <div class="space-y-4">
              <div
                v-for="article in recentArticles"
                :key="article.id"
                class="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <img
                  v-if="article.featuredImage"
                  :src="article.featuredImage"
                  :alt="article.title"
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <div
                  v-else
                  class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                >
                  <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-gray-400" />
                </div>
                
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-gray-900 dark:text-white truncate">
                    {{ article.title }}
                  </h3>
                  <div class="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <span>{{ formatDate(article.createdAt) }}</span>
                    <UBadge
                      :color="getStatusColor(article.status)"
                      variant="soft"
                      size="sm"
                    >
                      {{ article.status }}
                    </UBadge>
                    <span>{{ article.viewCount || 0 }} views</span>
                  </div>
                </div>
                
                <div class="flex items-center space-x-2">
                  <UButton
                    :to="`/articles/${article.slug}/edit`"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-pencil"
                  />
                  <UButton
                    :to="`/blog/${article.slug}`"
                    variant="ghost"
                    size="sm"
                    icon="i-heroicons-eye"
                  />
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Quick Actions & Analytics -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <UCard>
            <template #header>
              <h2 class="text-lg font-semibold">Quick Actions</h2>
            </template>
            
            <div class="space-y-3">
              <UButton to="/articles/create" block variant="outline" icon="i-heroicons-plus">
                Create Article
              </UButton>
              <UButton to="/admin/categories" block variant="outline" icon="i-heroicons-folder">
                Manage Categories
              </UButton>
              <UButton to="/admin/tags" block variant="outline" icon="i-heroicons-tag">
                Manage Tags
              </UButton>
              <UButton to="/admin/comments" block variant="outline" icon="i-heroicons-chat-bubble-left">
                Review Comments
              </UButton>
            </div>
          </UCard>

          <!-- Popular Articles -->
          <UCard>
            <template #header>
              <h2 class="text-lg font-semibold">Popular This Week</h2>
            </template>
            
            <div class="space-y-3">
              <div
                v-for="(article, index) in popularArticles"
                :key="article.id"
                class="flex items-center space-x-3"
              >
                <div class="flex-shrink-0 w-6 h-6 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-sm font-medium">
                  {{ index + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ article.title }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatNumber(article.viewCount || 0) }} views
                  </p>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Recent Activity -->
          <UCard>
            <template #header>
              <h2 class="text-lg font-semibold">Recent Activity</h2>
            </template>
            
            <div class="space-y-3">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-start space-x-3"
              >
                <div class="flex-shrink-0">
                  <UIcon :name="activity.icon" class="w-4 h-4 text-gray-400 mt-1" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-gray-900 dark:text-white">
                    {{ activity.description }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatTimeAgo(activity.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

useSeoMeta({
  title: 'Dashboard - Article Management',
  description: 'Manage your articles, categories, and content'
})

// Load data from storage
const stats = ref({
  totalArticles: 0,
  publishedArticles: 0,
  newArticlesThisMonth: 0,
  totalViews: 0,
  viewsThisMonth: 0,
  totalComments: 0,
  commentsThisMonth: 0
})

const recentArticles = ref([])
const popularArticles = ref([])

// Load dashboard data
const loadDashboardData = async () => {
  try {
    const articlesStore = useArticlesStore()
    
    // Load all articles to calculate stats
    const allArticlesResult = await articlesStore.fetchArticles({ 
      status: 'all',
      limit: 1000 
    })
    const allArticles = allArticlesResult.articles
    
    // Calculate stats
    const publishedArticles = allArticles.filter(a => a.status === 'published')
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const thisMonthArticles = allArticles.filter(a => {
      const articleDate = new Date(a.createdAt)
      return articleDate.getMonth() === currentMonth && articleDate.getFullYear() === currentYear
    })
    
    stats.value = {
      totalArticles: allArticles.length,
      publishedArticles: publishedArticles.length,
      newArticlesThisMonth: thisMonthArticles.length,
      totalViews: allArticles.reduce((sum, a) => sum + (a.viewCount || 0), 0),
      viewsThisMonth: thisMonthArticles.reduce((sum, a) => sum + (a.viewCount || 0), 0),
      totalComments: allArticles.reduce((sum, a) => sum + (a.commentCount || 0), 0),
      commentsThisMonth: thisMonthArticles.reduce((sum, a) => sum + (a.commentCount || 0), 0)
    }
    
    // Load recent articles
    const recentResult = await articlesStore.getRecentArticles(5)
    recentArticles.value = recentResult
    
    // Load popular articles
    const popularResult = await articlesStore.getPopularArticles(5)
    popularArticles.value = popularResult
    
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
}

onMounted(() => {
  loadDashboardData()
})

const recentActivity = ref([
  {
    id: 1,
    description: 'New comment on "Vue 3 Composition API"',
    icon: 'i-heroicons-chat-bubble-left',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 2,
    description: 'Article "TypeScript Guide" was published',
    icon: 'i-heroicons-document-text',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 3,
    description: 'New user registered',
    icon: 'i-heroicons-user-plus',
    createdAt: new Date(Date.now() - 10800000).toISOString()
  }
])

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTimeAgo = (date: string) => {
  const now = new Date()
  const then = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published': return 'green'
    case 'draft': return 'yellow'
    case 'archived': return 'gray'
    default: return 'gray'
  }
}
</script>