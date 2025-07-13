<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Our Blog
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Discover insights, tutorials, and stories from our community
      </p>
    </div>

    <!-- Search and Filters -->
    <div class="mb-8">
      <UCard>
        <div class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <!-- Search -->
          <div class="flex-1">
            <UInput
              v-model="searchQuery"
              placeholder="Search articles..."
              icon="i-heroicons-magnifying-glass"
              size="lg"
              :loading="searching"
              @keyup.enter="performSearch"
            >
              <template #trailing>
                <UButton
                  @click="performSearch"
                  size="2xs"
                  variant="ghost"
                  icon="i-heroicons-arrow-right"
                />
              </template>
            </UInput>
          </div>

          <!-- Filters -->
          <div class="flex flex-wrap space-x-2">
            <USelect
              v-model="selectedCategory"
              :options="categoryOptions"
              placeholder="Category"
              class="min-w-[150px]"
              @change="filterArticles"
            />
            
            <USelect
              v-model="selectedTag"
              :options="tagOptions"
              placeholder="Tag"
              class="min-w-[150px]"
              @change="filterArticles"
            />
            
            <USelect
              v-model="sortBy"
              :options="sortOptions"
              class="min-w-[150px]"
              @change="filterArticles"
            />

            <UButton
              @click="clearFilters"
              variant="ghost"
              icon="i-heroicons-x-mark"
              v-if="hasActiveFilters"
            >
              Clear
            </UButton>
          </div>
        </div>

        <!-- Active Filters -->
        <div v-if="hasActiveFilters" class="flex flex-wrap space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <UBadge
            v-if="selectedCategory"
            variant="soft"
            size="sm"
            @click="selectedCategory = null; filterArticles()"
            class="cursor-pointer"
          >
            Category: {{ categories.find(c => c.value === selectedCategory)?.label }}
            <UIcon name="i-heroicons-x-mark" class="ml-1 w-3 h-3" />
          </UBadge>
          
          <UBadge
            v-if="selectedTag"
            variant="soft"
            size="sm"
            @click="selectedTag = null; filterArticles()"
            class="cursor-pointer"
          >
            Tag: {{ tags.find(t => t.value === selectedTag)?.label }}
            <UIcon name="i-heroicons-x-mark" class="ml-1 w-3 h-3" />
          </UBadge>
          
          <UBadge
            v-if="searchQuery"
            variant="soft"
            size="sm"
            @click="searchQuery = ''; performSearch()"
            class="cursor-pointer"
          >
            Search: "{{ searchQuery }}"
            <UIcon name="i-heroicons-x-mark" class="ml-1 w-3 h-3" />
          </UBadge>
        </div>
      </UCard>
    </div>

    <!-- Featured Articles -->
    <div v-if="featuredArticles.length > 0 && !hasActiveFilters" class="mb-12">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Articles</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ArticleCard
          v-for="article in featuredArticles"
          :key="article.id"
          :article="article"
          featured
        />
      </div>
    </div>

    <!-- Articles Grid -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ hasActiveFilters ? 'Search Results' : 'Latest Articles' }}
        </h2>
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ pagination.totalItems }} articles found
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UCard v-for="i in 6" :key="i" class="animate-pulse">
          <div class="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </UCard>
      </div>

      <!-- Articles -->
      <div v-else-if="articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <UIcon name="i-heroicons-document-text" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No articles found
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ hasActiveFilters ? 'Try adjusting your search criteria' : 'Be the first to publish an article!' }}
        </p>
        <UButton
          v-if="hasActiveFilters"
          @click="clearFilters"
          variant="outline"
        >
          Clear filters
        </UButton>
        <UButton
          v-else
          to="/articles/create"
          icon="i-heroicons-plus"
        >
          Create Article
        </UButton>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="flex justify-center">
      <UPagination
        v-model="currentPage"
        :page-count="pagination.itemsPerPage"
        :total="pagination.totalItems"
        @update:model-value="changePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Blog - Articles & Insights',
  description: 'Discover the latest articles, tutorials, and insights from our community.',
  ogTitle: 'Blog - Articles & Insights',
  ogDescription: 'Discover the latest articles, tutorials, and insights from our community.',
  ogType: 'website'
})

const route = useRoute()
const router = useRouter()

const articles = ref([])
const featuredArticles = ref([])
const categories = ref([])
const tags = ref([])
const loading = ref(true)
const searching = ref(false)

const searchQuery = ref('')
const selectedCategory = ref(null)
const selectedTag = ref(null)
const sortBy = ref('publishedAt:desc')
const currentPage = ref(1)

const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 12
})

const sortOptions = [
  { label: 'Latest', value: 'publishedAt:desc' },
  { label: 'Oldest', value: 'publishedAt:asc' },
  { label: 'Most Popular', value: 'viewCount:desc' },
  { label: 'Most Liked', value: 'likeCount:desc' },
  { label: 'Reading Time (Short)', value: 'readingTime:asc' },
  { label: 'Reading Time (Long)', value: 'readingTime:desc' }
]

const categoryOptions = computed(() => [
  { label: 'All Categories', value: null },
  ...categories.value.map((cat: any) => ({
    label: cat.name,
    value: cat.slug
  }))
])

const tagOptions = computed(() => [
  { label: 'All Tags', value: null },
  ...tags.value.map((tag: any) => ({
    label: tag.name,
    value: tag.slug
  }))
])

const hasActiveFilters = computed(() => 
  searchQuery.value || selectedCategory.value || selectedTag.value || sortBy.value !== 'publishedAt:desc'
)

const loadArticles = async () => {
  loading.value = true
  
  try {
    const [sortField, sortOrder] = sortBy.value.split(':')
    
    const articlesStore = useArticlesStore()
    const categoriesStore = useCategoriesStore()
    const tagsStore = useTagsStore()
    
    // Convert category/tag slugs to IDs
    let categoryId = undefined
    let tagId = undefined
    
    if (selectedCategory.value) {
      const category = await categoriesStore.fetchCategoryBySlug(selectedCategory.value)
      categoryId = category?.id
    }
    
    if (selectedTag.value) {
      const tag = await tagsStore.fetchTagBySlug(selectedTag.value)
      tagId = tag?.id
    }
    
    const params = {
      search: searchQuery.value,
      category: categoryId,
      tag: tagId,
      sortBy: sortField,
      sortOrder: sortOrder.toUpperCase() as 'ASC' | 'DESC',
      status: 'published',
      limit: pagination.value.itemsPerPage,
      offset: (currentPage.value - 1) * pagination.value.itemsPerPage
    }

    const response = await articlesStore.fetchArticles(params)
    
    articles.value = response.articles
    pagination.value = {
      ...pagination.value,
      currentPage: currentPage.value,
      totalPages: Math.ceil(response.total / pagination.value.itemsPerPage),
      totalItems: response.total
    }
    
  } catch (error) {
    console.error('Failed to load articles:', error)
  } finally {
    loading.value = false
  }
}

const loadFeaturedArticles = async () => {
  try {
    const articlesStore = useArticlesStore()
    const featured = await articlesStore.getFeaturedArticles(4)
    featuredArticles.value = featured
  } catch (error) {
    console.error('Failed to load featured articles:', error)
  }
}

const loadFilters = async () => {
  try {
    const categoriesStore = useCategoriesStore()
    const tagsStore = useTagsStore()
    
    const [categoriesData, tagsData] = await Promise.all([
      categoriesStore.fetchCategories(),
      tagsStore.fetchTags()
    ])
    
    categories.value = categoriesData
    tags.value = tagsData
  } catch (error) {
    console.error('Failed to load filters:', error)
  }
}

const performSearch = () => {
  searching.value = true
  currentPage.value = 1
  
  updateUrlParams()
  loadArticles().finally(() => {
    searching.value = false
  })
}

const filterArticles = () => {
  currentPage.value = 1
  updateUrlParams()
  loadArticles()
}

const changePage = (page: number) => {
  currentPage.value = page
  updateUrlParams()
  loadArticles()
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = null
  selectedTag.value = null
  sortBy.value = 'publishedAt:desc'
  currentPage.value = 1
  
  updateUrlParams()
  loadArticles()
}

const updateUrlParams = () => {
  const query = {} as any
  
  if (searchQuery.value) query.search = searchQuery.value
  if (selectedCategory.value) query.category = selectedCategory.value
  if (selectedTag.value) query.tag = selectedTag.value
  if (sortBy.value !== 'publishedAt:desc') query.sort = sortBy.value
  if (currentPage.value > 1) query.page = currentPage.value
  
  router.replace({ query })
}

const initializeFromUrl = () => {
  const query = route.query
  
  if (query.search) searchQuery.value = query.search as string
  if (query.category) selectedCategory.value = query.category as string
  if (query.tag) selectedTag.value = query.tag as string
  if (query.sort) sortBy.value = query.sort as string
  if (query.page) currentPage.value = parseInt(query.page as string)
}

onMounted(async () => {
  initializeFromUrl()
  
  await Promise.all([
    loadFilters(),
    loadFeaturedArticles(),
    loadArticles()
  ])
})

// Watch for route changes (back/forward navigation)
watch(() => route.query, () => {
  initializeFromUrl()
  loadArticles()
}, { deep: true })
</script>