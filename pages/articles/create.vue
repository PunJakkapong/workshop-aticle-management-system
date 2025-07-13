<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ isEditing ? 'Edit Article' : 'Create New Article' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          {{ isEditing ? 'Update your article details' : 'Write and publish your article' }}
        </p>
      </div>
      
      <div class="flex space-x-2">
        <UButton
          @click="saveDraft"
          variant="outline"
          :loading="saving"
          :disabled="!form.title || !form.content"
        >
          Save Draft
        </UButton>
        <UButton
          @click="publishArticle"
          :loading="publishing"
          :disabled="!form.title || !form.content"
        >
          {{ isEditing ? 'Update' : 'Publish' }}
        </UButton>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold">Article Content</h2>
          </template>

          <div class="space-y-4">
            <UFormGroup label="Title" required>
              <UInput
                v-model="form.title"
                placeholder="Enter article title..."
                size="lg"
                :disabled="saving || publishing"
              />
            </UFormGroup>

            <UFormGroup label="Featured Image">
              <ImageUpload
                v-model="form.featuredImage"
                @upload="handleImageUpload"
              />
            </UFormGroup>

            <UFormGroup label="Excerpt" description="Brief description of the article">
              <UTextarea
                v-model="form.excerpt"
                placeholder="Write a brief excerpt..."
                rows="3"
                :disabled="saving || publishing"
              />
            </UFormGroup>

            <UFormGroup label="Content" required>
              <RichTextEditor
                v-model="form.content"
                placeholder="Start writing your article..."
                character-count
                :editable="!saving && !publishing"
              />
            </UFormGroup>
          </div>
        </UCard>

        <!-- SEO Settings -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold flex items-center space-x-2">
              <UIcon name="i-heroicons-magnifying-glass" />
              SEO Settings
            </h2>
          </template>

          <div class="space-y-4">
            <UFormGroup label="Meta Title" description="Optimized title for search engines">
              <UInput
                v-model="form.metaTitle"
                :placeholder="form.title || 'Enter meta title...'"
                :disabled="saving || publishing"
              />
            </UFormGroup>

            <UFormGroup label="Meta Description" description="Brief description for search results">
              <UTextarea
                v-model="form.metaDescription"
                :placeholder="form.excerpt || 'Enter meta description...'"
                rows="3"
                :disabled="saving || publishing"
              />
            </UFormGroup>

            <UFormGroup label="Meta Keywords" description="Comma-separated keywords">
              <UInput
                v-model="form.metaKeywords"
                placeholder="keyword1, keyword2, keyword3..."
                :disabled="saving || publishing"
              />
            </UFormGroup>
          </div>
        </UCard>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Publishing Settings -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold flex items-center space-x-2">
              <UIcon name="i-heroicons-cog-6-tooth" />
              Settings
            </h2>
          </template>

          <div class="space-y-4">
            <UFormGroup label="Status">
              <USelect
                v-model="form.status"
                :options="statusOptions"
                :disabled="saving || publishing"
              />
            </UFormGroup>

            <UFormGroup label="Author">
              <USelect
                v-model="form.authorId"
                :options="authorOptions"
                :loading="loadingAuthors"
                :disabled="saving || publishing"
              />
            </UFormGroup>

            <UFormGroup label="Article Series" description="Group related articles">
              <USelect
                v-model="form.seriesId"
                :options="seriesOptions"
                :loading="loadingSeries"
                :disabled="saving || publishing"
                placeholder="Select a series..."
              />
            </UFormGroup>

            <UFormGroup>
              <UCheckbox
                v-model="form.isFeatured"
                label="Featured Article"
                :disabled="saving || publishing"
              />
            </UFormGroup>

            <UFormGroup label="Publish Date" v-if="form.status === 'published'">
              <UInput
                v-model="publishDate"
                type="datetime-local"
                :disabled="saving || publishing"
              />
            </UFormGroup>

            <UFormGroup label="Schedule Date" v-if="form.status === 'scheduled'">
              <UInput
                v-model="scheduleDate"
                type="datetime-local"
                :disabled="saving || publishing"
              />
            </UFormGroup>
          </div>
        </UCard>

        <!-- Categories -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold flex items-center space-x-2">
              <UIcon name="i-heroicons-folder" />
              Categories
            </h2>
          </template>

          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div
              v-for="category in categories"
              :key="category.id"
              class="flex items-center space-x-2"
            >
              <UCheckbox
                :model-value="form.categories.includes(category.id)"
                @update:model-value="toggleCategory(category.id)"
                :disabled="saving || publishing"
              />
              <span class="text-sm flex items-center space-x-1">
                <span
                  v-if="category.color"
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: category.color }"
                />
                {{ category.name }}
              </span>
            </div>
          </div>
        </UCard>

        <!-- Tags -->
        <UCard>
          <template #header>
            <h2 class="text-lg font-semibold flex items-center space-x-2">
              <UIcon name="i-heroicons-tag" />
              Tags
            </h2>
          </template>

          <div class="space-y-3">
            <UInput
              v-model="newTag"
              placeholder="Add new tag..."
              @keyup.enter="addTag"
              :disabled="saving || publishing"
            >
              <template #trailing>
                <UButton
                  @click="addTag"
                  size="2xs"
                  variant="ghost"
                  icon="i-heroicons-plus"
                  :disabled="!newTag.trim()"
                />
              </template>
            </UInput>

            <div class="flex flex-wrap space-x-2">
              <UBadge
                v-for="tagId in form.tags"
                :key="tagId"
                variant="soft"
                size="sm"
                class="cursor-pointer"
                @click="removeTag(tagId)"
              >
                {{ tags.find(t => t.id === tagId)?.name }}
                <UIcon name="i-heroicons-x-mark" class="ml-1 w-3 h-3" />
              </UBadge>
            </div>

            <div class="space-y-1 max-h-32 overflow-y-auto">
              <div
                v-for="tag in availableTags"
                :key="tag.id"
                class="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer"
                @click="toggleTag(tag.id)"
              >
                <span class="text-sm">{{ tag.name }}</span>
                <UIcon
                  v-if="form.tags.includes(tag.id)"
                  name="i-heroicons-check"
                  class="w-4 h-4 text-green-500"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Auto-save indicator -->
    <div
      v-if="autoSaving"
      class="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
    >
      <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
      Auto-saving...
    </div>
  </div>
</template>

<script setup lang="ts">
import slug from 'slug'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEditing = computed(() => !!route.query.id)
const articleId = computed(() => route.query.id as string)

const form = reactive({
  title: '',
  content: '',
  excerpt: '',
  featuredImage: '',
  status: 'draft',
  authorId: 1,
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  categories: [] as number[],
  tags: [] as number[],
  seriesId: null as number | null,
  isFeatured: false
})

const saving = ref(false)
const publishing = ref(false)
const autoSaving = ref(false)
const loadingAuthors = ref(false)
const loadingSeries = ref(false)

const publishDate = ref('')
const scheduleDate = ref('')
const newTag = ref('')

const categories = ref([])
const tags = ref([])
const authors = ref([])
const series = ref([])

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' }
]

const authorOptions = computed(() =>
  authors.value.map((author: any) => ({
    label: author.username,
    value: author.id
  }))
)

const seriesOptions = computed(() => [
  { label: 'None', value: null },
  ...series.value.map((s: any) => ({
    label: s.title,
    value: s.id
  }))
])

const availableTags = computed(() =>
  tags.value.filter((tag: any) => !form.tags.includes(tag.id))
)

const toggleCategory = (categoryId: number) => {
  const index = form.categories.indexOf(categoryId)
  if (index > -1) {
    form.categories.splice(index, 1)
  } else {
    form.categories.push(categoryId)
  }
}

const toggleTag = (tagId: number) => {
  const index = form.tags.indexOf(tagId)
  if (index > -1) {
    form.tags.splice(index, 1)
  } else {
    form.tags.push(tagId)
  }
}

const addTag = async () => {
  if (!newTag.value.trim()) return

  try {
    const tagsStore = useTagsStore()
    const slug = require('slug')
    
    const tagData = {
      name: newTag.value.trim(),
      slug: slug(newTag.value.trim(), { lower: true })
    }
    
    const savedTag = await tagsStore.saveTag(tagData)

    tags.value.push(savedTag)
    form.tags.push(savedTag.id)
    newTag.value = ''
    
    toast.add({
      title: 'Tag created',
      description: 'New tag has been created and added to your article'
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to create tag',
      color: 'red'
    })
  }
}

const removeTag = (tagId: number) => {
  const index = form.tags.indexOf(tagId)
  if (index > -1) {
    form.tags.splice(index, 1)
  }
}

const handleImageUpload = (data: any) => {
  form.featuredImage = data.url
}

const saveDraft = async () => {
  form.status = 'draft'
  await saveArticle()
}

const publishArticle = async () => {
  form.status = 'published'
  await saveArticle()
}

const saveArticle = async () => {
  if (!form.title || !form.content) {
    toast.add({
      title: 'Validation Error',
      description: 'Title and content are required',
      color: 'red'
    })
    return
  }

  const isPublishing = form.status === 'published'
  if (isPublishing) {
    publishing.value = true
  } else {
    saving.value = true
  }

  try {
    const articlesStore = useArticlesStore()
    
    // Generate slug from title
    const slug = require('slug')
    const articleSlug = slug(form.title, { lower: true })
    
    // Calculate reading time
    const readingTime = require('reading-time')
    const stats = readingTime(form.content)
    
    const payload = {
      ...form,
      slug: articleSlug,
      readingTime: Math.ceil(stats.minutes),
      publishedAt: publishDate.value || (form.status === 'published' ? new Date().toISOString() : undefined),
      scheduledAt: scheduleDate.value || undefined
    }

    let savedArticle
    if (isEditing.value) {
      // Get the article ID for editing
      const existingArticle = await articlesStore.fetchArticleBySlug(articleId.value)
      if (existingArticle) {
        payload.id = existingArticle.id
      }
    }
    
    savedArticle = await articlesStore.saveArticle(payload)

    toast.add({
      title: 'Success',
      description: isEditing.value ? 'Article updated successfully' : 'Article created successfully'
    })

    if (!isEditing.value) {
      router.push(`/articles/${savedArticle.slug}/edit`)
    }
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.message || 'Failed to save article',
      color: 'red'
    })
  } finally {
    saving.value = false
    publishing.value = false
  }
}

const loadData = async () => {
  try {
    const categoriesStore = useCategoriesStore()
    const tagsStore = useTagsStore()
    const articlesStore = useArticlesStore()
    
    const [categoriesData, tagsData] = await Promise.all([
      categoriesStore.fetchCategories(),
      tagsStore.fetchTags()
    ])

    categories.value = categoriesData
    tags.value = tagsData

    if (isEditing.value) {
      const article = await articlesStore.fetchArticleBySlug(articleId.value)
      
      if (article) {
        Object.assign(form, {
          title: article.title,
          content: article.content,
          excerpt: article.excerpt,
          featuredImage: article.featuredImage,
          status: article.status,
          authorId: article.authorId,
          metaTitle: article.metaTitle,
          metaDescription: article.metaDescription,
          metaKeywords: article.metaKeywords,
          categories: article.categories || [],
          tags: article.tags || [],
          seriesId: article.seriesId,
          isFeatured: article.isFeatured
        })

        if (article.publishedAt) {
          publishDate.value = new Date(article.publishedAt).toISOString().slice(0, 16)
        }
        if (article.scheduledAt) {
          scheduleDate.value = new Date(article.scheduledAt).toISOString().slice(0, 16)
        }
      }
    }
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to load data',
      color: 'red'
    })
  }
}

// Auto-save functionality
let autoSaveTimeout: NodeJS.Timeout
const autoSave = async () => {
  if (!form.title || !form.content || saving.value || publishing.value) return

  autoSaving.value = true
  clearTimeout(autoSaveTimeout)

  autoSaveTimeout = setTimeout(async () => {
    try {
      await saveDraft()
    } catch (error) {
      // Silent auto-save errors
    } finally {
      autoSaving.value = false
    }
  }, 2000)
}

watch([() => form.title, () => form.content], autoSave, { deep: true })

onMounted(() => {
  loadData()
})

onBeforeUnmount(() => {
  clearTimeout(autoSaveTimeout)
})
</script>

<style scoped>
.prose {
  max-width: none;
}
</style>