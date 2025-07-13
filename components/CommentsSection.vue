<template>
  <div class="comments-section">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
        Comments ({{ totalComments }})
      </h3>
      <div class="flex items-center space-x-2">
        <USelect
          v-model="sortBy"
          :options="sortOptions"
          size="sm"
          @change="loadComments"
        />
      </div>
    </div>

    <!-- Comment Form -->
    <div class="mb-8">
      <UCard>
        <template #header>
          <h4 class="text-lg font-semibold">Leave a Comment</h4>
        </template>

        <form @submit.prevent="submitComment" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="!isAuthenticated">
            <UFormGroup label="Name" required>
              <UInput
                v-model="commentForm.name"
                placeholder="Your name"
                :disabled="submitting"
              />
            </UFormGroup>
            <UFormGroup label="Email" required>
              <UInput
                v-model="commentForm.email"
                type="email"
                placeholder="your@email.com"
                :disabled="submitting"
              />
            </UFormGroup>
          </div>

          <UFormGroup label="Comment" required>
            <UTextarea
              v-model="commentForm.content"
              placeholder="Share your thoughts..."
              rows="4"
              :disabled="submitting"
            />
          </UFormGroup>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <UCheckbox
                v-model="commentForm.notifyReplies"
                label="Notify me of replies"
                :disabled="submitting"
              />
            </div>
            <UButton
              type="submit"
              :loading="submitting"
              :disabled="!commentForm.content.trim() || (!isAuthenticated && (!commentForm.name.trim() || !commentForm.email.trim()))"
            >
              Post Comment
            </UButton>
          </div>
        </form>
      </UCard>
    </div>

    <!-- Comments List -->
    <div class="space-y-6">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="flex space-x-3">
            <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>

      <!-- Comments -->
      <div v-else-if="comments.length > 0">
        <CommentItem
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          :article-id="articleId"
          @reply="handleReply"
          @update="loadComments"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <UIcon name="i-heroicons-chat-bubble-left" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No comments yet</h4>
        <p class="text-gray-600 dark:text-gray-400">Be the first to share your thoughts!</p>
      </div>
    </div>

    <!-- Load More -->
    <div v-if="hasMore" class="text-center mt-8">
      <UButton
        @click="loadMoreComments"
        variant="outline"
        :loading="loadingMore"
      >
        Load More Comments
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  articleId: number
}

const props = defineProps<Props>()
const toast = useToast()

// Auth state (you might want to use a proper auth composable)
const isAuthenticated = ref(false) // Replace with actual auth state

const comments = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const submitting = ref(false)
const totalComments = ref(0)
const currentPage = ref(1)
const hasMore = ref(false)

const sortBy = ref('newest')
const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Most Liked', value: 'likes' }
]

const commentForm = reactive({
  name: '',
  email: '',
  content: '',
  notifyReplies: false,
  parentId: null as number | null
})

const loadComments = async () => {
  loading.value = true
  currentPage.value = 1
  
  try {
    const response = await $fetch(`/api/v1/articles/${props.articleId}/comments`, {
      query: {
        page: 1,
        limit: 10,
        sort: sortBy.value
      }
    })
    
    comments.value = response.comments
    totalComments.value = response.total
    hasMore.value = response.hasMore
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to load comments',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}

const loadMoreComments = async () => {
  loadingMore.value = true
  currentPage.value++
  
  try {
    const response = await $fetch(`/api/v1/articles/${props.articleId}/comments`, {
      query: {
        page: currentPage.value,
        limit: 10,
        sort: sortBy.value
      }
    })
    
    comments.value.push(...response.comments)
    hasMore.value = response.hasMore
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to load more comments',
      color: 'red'
    })
    currentPage.value--
  } finally {
    loadingMore.value = false
  }
}

const submitComment = async () => {
  if (!commentForm.content.trim()) return
  
  submitting.value = true
  
  try {
    const payload = {
      content: commentForm.content,
      parentId: commentForm.parentId,
      notifyReplies: commentForm.notifyReplies
    } as any
    
    if (!isAuthenticated.value) {
      payload.name = commentForm.name
      payload.email = commentForm.email
    }
    
    const response = await $fetch(`/api/v1/articles/${props.articleId}/comments`, {
      method: 'POST',
      body: payload
    })
    
    // Reset form
    commentForm.content = ''
    commentForm.parentId = null
    if (!isAuthenticated.value) {
      commentForm.name = ''
      commentForm.email = ''
    }
    
    toast.add({
      title: 'Comment posted!',
      description: 'Your comment has been added successfully'
    })
    
    // Reload comments
    await loadComments()
    
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to post comment',
      color: 'red'
    })
  } finally {
    submitting.value = false
  }
}

const handleReply = (comment: any) => {
  commentForm.parentId = comment.id
  
  // Scroll to comment form
  const commentForm = document.querySelector('.comments-section form')
  if (commentForm) {
    commentForm.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  
  toast.add({
    title: 'Replying to comment',
    description: `You are now replying to ${comment.author?.name || comment.name}`
  })
}

onMounted(() => {
  loadComments()
})
</script>