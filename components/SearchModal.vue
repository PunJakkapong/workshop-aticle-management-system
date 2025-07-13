<template>
  <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-2xl' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Search Articles</h3>
          <UButton
            @click="isOpen = false"
            variant="ghost"
            size="sm"
            icon="i-heroicons-x-mark"
          />
        </div>
      </template>

      <div class="space-y-4">
        <!-- Search Input -->
        <UInput
          v-model="searchQuery"
          placeholder="Search for articles, topics, or authors..."
          size="lg"
          icon="i-heroicons-magnifying-glass"
          :loading="searching"
          @keyup.enter="performSearch"
          autofocus
        >
          <template #trailing>
            <div class="flex items-center space-x-1">
              <UKbd>⌘</UKbd>
              <UKbd>K</UKbd>
            </div>
          </template>
        </UInput>

        <!-- Quick Filters -->
        <div class="flex flex-wrap space-x-2">
          <UButton
            v-for="filter in quickFilters"
            :key="filter.value"
            @click="applyQuickFilter(filter)"
            variant="outline"
            size="xs"
            :color="selectedFilter === filter.value ? 'primary' : 'gray'"
          >
            <UIcon :name="filter.icon" class="w-3 h-3 mr-1" />
            {{ filter.label }}
          </UButton>
        </div>

        <!-- Search Results -->
        <div v-if="searchQuery.length > 0" class="max-h-96 overflow-y-auto">
          <!-- Loading State -->
          <div v-if="searching" class="space-y-3">
            <div v-for="i in 3" :key="i" class="animate-pulse">
              <div class="flex space-x-3">
                <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            </div>
          </div>

          <!-- Results -->
          <div v-else-if="searchResults.length > 0" class="space-y-1">
            <div
              v-for="(result, index) in searchResults"
              :key="result.id"
              @click="selectResult(result)"
              @mouseenter="highlightedIndex = index"
              class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors"
              :class="{
                'bg-primary-50 dark:bg-primary-950': highlightedIndex === index,
                'hover:bg-gray-50 dark:hover:bg-gray-800': highlightedIndex !== index
              }"
            >
              <!-- Article Icon -->
              <div class="flex-shrink-0">
                <div v-if="result.featuredImage" class="w-12 h-12 rounded overflow-hidden">
                  <img :src="result.featuredImage" :alt="result.title" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                  <UIcon name="i-heroicons-document-text" class="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900 dark:text-white truncate" v-html="result.highlightedTitle || result.title" />
                <p class="text-sm text-gray-600 dark:text-gray-400 truncate" v-html="result.highlightedExcerpt || result.excerpt" />
                <div class="flex items-center space-x-2 mt-1">
                  <span class="text-xs text-gray-500">{{ formatDate(result.publishedAt || result.createdAt) }}</span>
                  <span v-if="result.readingTime" class="text-xs text-gray-500">{{ result.readingTime }} min read</span>
                </div>
              </div>

              <!-- Arrow -->
              <div class="flex-shrink-0">
                <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div v-else class="text-center py-8">
            <UIcon name="i-heroicons-magnifying-glass" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h4>
            <p class="text-gray-600 dark:text-gray-400">Try adjusting your search terms or browse our categories</p>
          </div>
        </div>

        <!-- Suggestions (when no query) -->
        <div v-else class="space-y-4">
          <!-- Recent Searches -->
          <div v-if="recentSearches.length > 0">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Recent Searches</h4>
            <div class="space-y-1">
              <div
                v-for="search in recentSearches"
                :key="search"
                @click="searchQuery = search; performSearch()"
                class="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                <UIcon name="i-heroicons-clock" class="w-4 h-4 text-gray-400" />
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ search }}</span>
              </div>
            </div>
          </div>

          <!-- Popular Searches -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Popular Searches</h4>
            <div class="flex flex-wrap space-x-2">
              <UButton
                v-for="term in popularSearches"
                :key="term"
                @click="searchQuery = term; performSearch()"
                variant="outline"
                size="xs"
              >
                {{ term }}
              </UButton>
            </div>
          </div>

          <!-- Browse Categories -->
          <div>
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">Browse Categories</h4>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="category in topCategories"
                :key="category.slug"
                @click="navigateToCategory(category.slug)"
                class="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: category.color || '#6366f1' }"
                />
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ category.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-1">
              <UKbd>↑</UKbd>
              <UKbd>↓</UKbd>
              <span>Navigate</span>
            </div>
            <div class="flex items-center space-x-1">
              <UKbd>↵</UKbd>
              <span>Select</span>
            </div>
            <div class="flex items-center space-x-1">
              <UKbd>esc</UKbd>
              <span>Close</span>
            </div>
          </div>
          <div v-if="searchResults.length > 0">
            {{ searchResults.length }} results
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const router = useRouter()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const searchQuery = ref('')
const searching = ref(false)
const searchResults = ref([])
const highlightedIndex = ref(0)
const selectedFilter = ref('')

const { debouncedSearch } = useSearch()

const quickFilters = [
  { label: 'All', value: '', icon: 'i-heroicons-document-text' },
  { label: 'Recent', value: 'recent', icon: 'i-heroicons-clock' },
  { label: 'Popular', value: 'popular', icon: 'i-heroicons-fire' },
  { label: 'Tutorial', value: 'tutorial', icon: 'i-heroicons-academic-cap' }
]

const recentSearches = ref([
  'Vue 3 composition API',
  'TypeScript best practices',
  'CSS Grid tutorial'
])

const popularSearches = [
  'JavaScript', 'Vue.js', 'TypeScript', 'CSS', 'React', 'Node.js'
]

const topCategories = ref([
  { name: 'Web Development', slug: 'web-development', color: '#3b82f6' },
  { name: 'JavaScript', slug: 'javascript', color: '#f59e0b' },
  { name: 'CSS', slug: 'css', color: '#10b981' },
  { name: 'Vue.js', slug: 'vuejs', color: '#8b5cf6' }
])

const performSearch = async () => {
  if (!searchQuery.value.trim()) return

  searching.value = true
  try {
    const response = await $fetch('/api/v1/search', {
      query: {
        q: searchQuery.value,
        limit: 10
      }
    })
    
    searchResults.value = response.results
    highlightedIndex.value = 0
    
    // Add to recent searches
    addToRecentSearches(searchQuery.value)
  } catch (error) {
    console.error('Search failed:', error)
    searchResults.value = []
  } finally {
    searching.value = false
  }
}

const applyQuickFilter = (filter: any) => {
  selectedFilter.value = filter.value
  // Apply filter logic here
  if (searchQuery.value) {
    performSearch()
  }
}

const selectResult = (result: any) => {
  router.push(`/blog/${result.slug}`)
  isOpen.value = false
  searchQuery.value = ''
  searchResults.value = []
}

const navigateToCategory = (categorySlug: string) => {
  router.push(`/blog?category=${categorySlug}`)
  isOpen.value = false
}

const addToRecentSearches = (query: string) => {
  if (!recentSearches.value.includes(query)) {
    recentSearches.value.unshift(query)
    recentSearches.value = recentSearches.value.slice(0, 5)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Keyboard navigation
onMounted(() => {
  const handleKeydown = (event: KeyboardEvent) => {
    if (!isOpen.value) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        highlightedIndex.value = Math.min(highlightedIndex.value + 1, searchResults.value.length - 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
        break
      case 'Enter':
        event.preventDefault()
        if (searchResults.value[highlightedIndex.value]) {
          selectResult(searchResults.value[highlightedIndex.value])
        } else if (searchQuery.value) {
          performSearch()
        }
        break
      case 'Escape':
        event.preventDefault()
        isOpen.value = false
        break
    }
  }

  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})

// Global keyboard shortcut (Cmd/Ctrl + K)
onMounted(() => {
  const handleGlobalKeydown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault()
      isOpen.value = true
    }
  }

  document.addEventListener('keydown', handleGlobalKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleGlobalKeydown)
  })
})

// Watch for search query changes
watch(searchQuery, (newQuery) => {
  if (newQuery.length > 2) {
    debouncedSearch(newQuery)
  } else {
    searchResults.value = []
  }
})

// Reset state when modal closes
watch(isOpen, (newValue) => {
  if (!newValue) {
    searchQuery.value = ''
    searchResults.value = []
    highlightedIndex.value = 0
    selectedFilter.value = ''
  }
})
</script>