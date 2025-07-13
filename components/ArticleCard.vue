<template>
  <UCard
    class="group hover:shadow-lg transition-all duration-300 cursor-pointer"
    :class="{ 'lg:col-span-1': featured }"
    @click="navigateToArticle"
  >
    <!-- Featured Image -->
    <div class="relative overflow-hidden rounded-lg mb-4">
      <img
        v-if="article.featuredImage"
        :src="article.featuredImage"
        :alt="article.title"
        class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        :class="{ 'lg:h-64': featured }"
      />
      <div
        v-else
        class="w-full h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center"
        :class="{ 'lg:h-64': featured }"
      >
        <UIcon name="i-heroicons-document-text" class="w-16 h-16 text-white opacity-50" />
      </div>
      
      <!-- Featured Badge -->
      <div v-if="featured || article.isFeatured" class="absolute top-2 left-2">
        <UBadge color="yellow" variant="solid" size="sm">
          <UIcon name="i-heroicons-star" class="w-3 h-3 mr-1" />
          Featured
        </UBadge>
      </div>
      
      <!-- Reading Time -->
      <div class="absolute top-2 right-2">
        <UBadge color="gray" variant="solid" size="sm" class="bg-black/50 text-white">
          {{ article.readingTime || 5 }} min read
        </UBadge>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-3">
      <!-- Categories -->
      <div v-if="article.categories?.length" class="flex flex-wrap space-x-1">
        <UBadge
          v-for="category in article.categories"
          :key="category.id"
          variant="soft"
          size="sm"
          :style="category.color ? { backgroundColor: category.color + '20', color: category.color } : {}"
        >
          {{ category.name }}
        </UBadge>
      </div>

      <!-- Title -->
      <h3 
        class="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
        :class="{ 'text-xl lg:text-2xl': featured, 'text-lg': !featured }"
      >
        {{ article.title }}
      </h3>

      <!-- Excerpt -->
      <p 
        class="text-gray-600 dark:text-gray-400 line-clamp-3"
        :class="{ 'text-base': featured, 'text-sm': !featured }"
      >
        {{ article.excerpt }}
      </p>

      <!-- Tags -->
      <div v-if="article.tags?.length" class="flex flex-wrap space-x-1">
        <UBadge
          v-for="tag in article.tags.slice(0, 3)"
          :key="tag.id"
          variant="outline"
          size="sm"
          class="text-xs"
        >
          #{{ tag.name }}
        </UBadge>
        <UBadge
          v-if="article.tags.length > 3"
          variant="outline"
          size="sm"
          class="text-xs"
        >
          +{{ article.tags.length - 3 }}
        </UBadge>
      </div>

      <!-- Author and Date -->
      <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-2">
          <UAvatar
            :alt="article.author?.username"
            size="sm"
            :src="article.author?.avatar"
          />
          <div class="text-sm">
            <p class="font-medium text-gray-900 dark:text-white">
              {{ article.author?.username }}
            </p>
            <p class="text-gray-500 dark:text-gray-400 text-xs">
              {{ formatDate(article.publishedAt || article.createdAt) }}
            </p>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
          <div class="flex items-center space-x-1">
            <UIcon name="i-heroicons-eye" class="w-4 h-4" />
            <span>{{ formatNumber(article.viewCount || 0) }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <UIcon name="i-heroicons-heart" class="w-4 h-4" />
            <span>{{ formatNumber(article.likeCount || 0) }}</span>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  article: any
  featured?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  featured: false
})

const router = useRouter()

const navigateToArticle = () => {
  router.push(`/blog/${props.article.slug}`)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
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
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>