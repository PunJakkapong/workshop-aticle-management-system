<template>
  <div v-if="!pending && article">
    <!-- Article Header -->
    <div class="bg-gray-50 dark:bg-gray-900/50 py-16">
      <div class="max-w-4xl mx-auto px-6">
        <!-- Breadcrumbs -->
        <nav class="mb-8">
          <ol class="flex items-center space-x-2 text-sm">
            <li>
              <NuxtLink to="/" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Home
              </NuxtLink>
            </li>
            <li class="text-gray-500">/</li>
            <li>
              <NuxtLink to="/blog" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Blog
              </NuxtLink>
            </li>
            <li class="text-gray-500">/</li>
            <li class="text-gray-900 dark:text-white font-medium truncate">{{ article.title }}</li>
          </ol>
        </nav>

        <!-- Categories -->
        <div v-if="article.categories?.length" class="flex flex-wrap space-x-2 mb-4">
          <UBadge
            v-for="category in article.categories"
            :key="category.id"
            variant="soft"
            :style="category.color ? { backgroundColor: category.color + '20', color: category.color } : {}"
          >
            <UIcon v-if="category.icon" :name="category.icon" class="w-3 h-3 mr-1" />
            {{ category.name }}
          </UBadge>
        </div>

        <!-- Title -->
        <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {{ article.title }}
        </h1>

        <!-- Excerpt -->
        <p v-if="article.excerpt" class="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {{ article.excerpt }}
        </p>

        <!-- Meta Information -->
        <div class="flex flex-wrap items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
          <!-- Author -->
          <div class="flex items-center space-x-3">
            <UAvatar
              :alt="article.author?.username"
              size="md"
              :src="article.author?.avatar"
            />
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ article.author?.username }}</p>
              <p class="text-sm">{{ formatDate(article.publishedAt || article.createdAt) }}</p>
            </div>
          </div>

          <!-- Reading Stats -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-1">
              <UIcon name="i-heroicons-clock" class="w-4 h-4" />
              <span>{{ article.readingTime || 5 }} min read</span>
            </div>
            <div class="flex items-center space-x-1">
              <UIcon name="i-heroicons-eye" class="w-4 h-4" />
              <span>{{ formatNumber(article.viewCount || 0) }} views</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Article Content -->
        <div class="lg:col-span-3">
          <!-- Featured Image -->
          <div v-if="article.featuredImage" class="mb-8">
            <img
              :src="article.featuredImage"
              :alt="article.title"
              class="w-full rounded-lg shadow-lg"
            />
          </div>

          <!-- Article Body -->
          <div
            v-html="article.content"
            class="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-20"
          />

          <!-- Tags -->
          <div v-if="article.tags?.length" class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
            <div class="flex flex-wrap space-x-2">
              <UBadge
                v-for="tag in article.tags"
                :key="tag.id"
                variant="outline"
                size="sm"
                class="cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-950"
                @click="navigateToTag(tag.slug)"
              >
                #{{ tag.name }}
              </UBadge>
            </div>
          </div>

          <!-- Article Series -->
          <div v-if="article.series" class="mt-8 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center space-x-2">
              <UIcon name="i-heroicons-book-open" class="w-5 h-5" />
              Part of "{{ article.series.title }}" Series
            </h3>
            <p v-if="article.series.description" class="text-blue-700 dark:text-blue-300 text-sm">
              {{ article.series.description }}
            </p>
            <UButton
              variant="outline"
              color="blue"
              size="sm"
              class="mt-3"
              @click="navigateToSeries(article.series.slug)"
            >
              View Series
            </UButton>
          </div>

          <!-- Social Share -->
          <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Share this article</h3>
            <SocialShare :article="article" />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <!-- Table of Contents (sticky) -->
          <div class="sticky top-6 space-y-6">
            <!-- Article Actions -->
            <UCard>
              <div class="space-y-3">
                <UButton
                  @click="toggleLike"
                  :variant="isLiked ? 'solid' : 'outline'"
                  :color="isLiked ? 'red' : 'gray'"
                  size="sm"
                  block
                  :loading="likingArticle"
                >
                  <UIcon :name="isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" class="w-4 h-4 mr-2" />
                  {{ article.likeCount || 0 }} Likes
                </UButton>

                <UButton
                  @click="toggleBookmark"
                  :variant="isBookmarked ? 'solid' : 'outline'"
                  :color="isBookmarked ? 'blue' : 'gray'"
                  size="sm"
                  block
                  :loading="bookmarkingArticle"
                >
                  <UIcon :name="isBookmarked ? 'i-heroicons-bookmark-solid' : 'i-heroicons-bookmark'" class="w-4 h-4 mr-2" />
                  {{ isBookmarked ? 'Saved' : 'Save' }}
                </UButton>

                <UButton
                  @click="printArticle"
                  variant="outline"
                  size="sm"
                  block
                >
                  <UIcon name="i-heroicons-printer" class="w-4 h-4 mr-2" />
                  Print
                </UButton>
              </div>
            </UCard>

            <!-- Author Info -->
            <UCard>
              <template #header>
                <h3 class="text-lg font-semibold">About the Author</h3>
              </template>
              
              <div class="space-y-3">
                <div class="flex items-center space-x-3">
                  <UAvatar
                    :alt="article.author?.username"
                    size="lg"
                    :src="article.author?.avatar"
                  />
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ article.author?.username }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Content Creator</p>
                  </div>
                </div>
                
                <p v-if="article.author?.bio" class="text-sm text-gray-600 dark:text-gray-400">
                  {{ article.author.bio }}
                </p>
                
                <UButton
                  variant="outline"
                  size="sm"
                  block
                  @click="navigateToAuthor(article.author?.username)"
                >
                  View Profile
                </UButton>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Articles -->
    <div v-if="relatedArticles?.length" class="bg-gray-50 dark:bg-gray-900/50 py-16">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Related Articles</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleCard
            v-for="relatedArticle in relatedArticles"
            :key="relatedArticle.id"
            :article="relatedArticle"
          />
        </div>
      </div>
    </div>

    <!-- Comments Section -->
    <div class="max-w-4xl mx-auto px-6 py-12">
      <CommentsSection :article-id="article.id" />
    </div>
  </div>

  <!-- Loading State -->
  <div v-else-if="pending" class="max-w-4xl mx-auto px-6 py-16">
    <div class="animate-pulse space-y-6">
      <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
      <div class="space-y-2">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else class="max-w-4xl mx-auto px-6 py-16 text-center">
    <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article Not Found</h1>
    <p class="text-gray-600 dark:text-gray-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
    <UButton to="/blog">Back to Blog</UButton>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const toast = useToast()

const slug = route.params.slug as string

// Fetch article data
const articlesStore = useArticlesStore()
const { data: articleData, pending, error } = await useAsyncData(`article-${slug}`, async () => {
  const article = await articlesStore.fetchArticleBySlug(slug)
  if (!article) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Article not found'
    })
  }
  
  const related = await articlesStore.getRelatedArticles(article.id, 3)
  return { article, relatedArticles: related }
})

const article = computed(() => articleData.value?.article)
const relatedArticles = computed(() => articleData.value?.relatedArticles || [])

// User interactions
const isLiked = ref(false)
const isBookmarked = ref(false)
const likingArticle = ref(false)
const bookmarkingArticle = ref(false)

// SEO Meta
useSeoMeta({
  title: () => article.value?.metaTitle || article.value?.title || 'Article',
  description: () => article.value?.metaDescription || article.value?.excerpt || '',
  ogTitle: () => article.value?.title || 'Article',
  ogDescription: () => article.value?.excerpt || '',
  ogImage: () => article.value?.featuredImage || '',
  ogType: 'article',
  articleAuthor: () => article.value?.author?.username || '',
  articlePublishedTime: () => article.value?.publishedAt || '',
  articleModifiedTime: () => article.value?.updatedAt || '',
  articleTag: () => article.value?.tags?.map((tag: any) => tag.name) || []
})

// Structured Data for SEO
useJsonld({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: () => article.value?.title || '',
  description: () => article.value?.excerpt || '',
  image: () => article.value?.featuredImage || '',
  datePublished: () => article.value?.publishedAt || '',
  dateModified: () => article.value?.updatedAt || '',
  author: {
    '@type': 'Person',
    name: () => article.value?.author?.username || ''
  },
  publisher: {
    '@type': 'Organization',
    name: 'Blog'
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': () => `${window.location.origin}/blog/${slug}`
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const toggleLike = async () => {
  if (!article.value) return
  
  likingArticle.value = true
  
  try {
    const response = await $fetch(`/api/v1/articles/${article.value.id}/like`, {
      method: 'POST'
    })
    
    isLiked.value = !isLiked.value
    article.value.likeCount = response.likeCount
    
    toast.add({
      title: isLiked.value ? 'Article liked!' : 'Like removed',
      description: isLiked.value ? 'Added to your liked articles' : 'Removed from liked articles'
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to like article',
      color: 'red'
    })
  } finally {
    likingArticle.value = false
  }
}

const toggleBookmark = async () => {
  if (!article.value) return
  
  bookmarkingArticle.value = true
  
  try {
    const response = await $fetch(`/api/v1/articles/${article.value.id}/bookmark`, {
      method: 'POST'
    })
    
    isBookmarked.value = !isBookmarked.value
    
    toast.add({
      title: isBookmarked.value ? 'Article saved!' : 'Bookmark removed',
      description: isBookmarked.value ? 'Added to your reading list' : 'Removed from reading list'
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to bookmark article',
      color: 'red'
    })
  } finally {
    bookmarkingArticle.value = false
  }
}

const printArticle = () => {
  window.print()
}

const navigateToTag = (tagSlug: string) => {
  router.push(`/blog?tag=${tagSlug}`)
}

const navigateToSeries = (seriesSlug: string) => {
  router.push(`/series/${seriesSlug}`)
}

const navigateToAuthor = (username: string) => {
  router.push(`/authors/${username}`)
}

// Handle 404
if (error.value?.statusCode === 404) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Article not found'
  })
}
</script>

<style>
/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .prose {
    font-size: 12pt;
    line-height: 1.5;
  }
  
  .prose h1, .prose h2, .prose h3 {
    break-after: avoid;
  }
  
  .prose img {
    max-width: 100% !important;
    height: auto !important;
  }
}

/* Prose styles for article content */
.prose {
  color: rgb(55 65 81);
}

.dark .prose {
  color: rgb(209 213 219);
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  color: rgb(17 24 39);
}

.dark .prose h1, .dark .prose h2, .dark .prose h3, .dark .prose h4, .dark .prose h5, .dark .prose h6 {
  color: rgb(249 250 251);
}

.prose a {
  color: rgb(59 130 246);
  text-decoration: underline;
}

.prose a:hover {
  color: rgb(37 99 235);
}

.dark .prose a {
  color: rgb(96 165 250);
}

.dark .prose a:hover {
  color: rgb(147 197 253);
}

.prose blockquote {
  border-left: 4px solid rgb(229 231 235);
  padding-left: 1rem;
  font-style: italic;
  color: rgb(107 114 128);
}

.dark .prose blockquote {
  border-left-color: rgb(75 85 99);
  color: rgb(156 163 175);
}

.prose code {
  background-color: rgb(243 244 246);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.dark .prose code {
  background-color: rgb(55 65 81);
}

.prose pre {
  background-color: rgb(17 24 39);
  color: rgb(229 231 235);
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
}
</style>