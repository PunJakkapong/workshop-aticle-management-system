<template>
  <div class="comment-item">
    <div class="flex space-x-3">
      <!-- Avatar -->
      <UAvatar
        :alt="comment.author?.name || comment.name"
        size="md"
        :src="comment.author?.avatar"
      />

      <div class="flex-1">
        <!-- Comment Header -->
        <div class="flex items-center space-x-2 mb-2">
          <h4 class="font-medium text-gray-900 dark:text-white">
            {{ comment.author?.name || comment.name }}
          </h4>
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(comment.createdAt) }}
          </span>
          <UBadge
            v-if="comment.author?.role === 'admin'"
            variant="solid"
            color="blue"
            size="sm"
          >
            Author
          </UBadge>
        </div>

        <!-- Comment Content -->
        <div
          v-html="formatContent(comment.content)"
          class="prose prose-sm max-w-none dark:prose-invert mb-3"
        />

        <!-- Comment Actions -->
        <div class="flex items-center space-x-4 text-sm">
          <button
            @click="toggleLike"
            class="flex items-center space-x-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            :class="{ 'text-red-500 dark:text-red-400': isLiked }"
            :disabled="likingComment"
          >
            <UIcon :name="isLiked ? 'i-heroicons-heart-solid' : 'i-heroicons-heart'" class="w-4 h-4" />
            <span>{{ comment.likeCount || 0 }}</span>
          </button>

          <button
            @click="$emit('reply', comment)"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Reply
          </button>

          <button
            v-if="canEdit"
            @click="startEdit"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Edit
          </button>

          <button
            v-if="canDelete"
            @click="deleteComment"
            class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            :disabled="deleting"
          >
            Delete
          </button>

          <button
            @click="reportComment"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Report
          </button>
        </div>

        <!-- Edit Form -->
        <div v-if="editing" class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <UTextarea
            v-model="editContent"
            rows="3"
            placeholder="Edit your comment..."
            class="mb-3"
          />
          <div class="flex items-center space-x-2">
            <UButton
              @click="saveEdit"
              size="sm"
              :loading="saving"
              :disabled="!editContent.trim()"
            >
              Save
            </UButton>
            <UButton
              @click="cancelEdit"
              variant="outline"
              size="sm"
              :disabled="saving"
            >
              Cancel
            </UButton>
          </div>
        </div>

        <!-- Replies -->
        <div v-if="comment.replies?.length" class="mt-4 space-y-4">
          <CommentItem
            v-for="reply in comment.replies"
            :key="reply.id"
            :comment="reply"
            :article-id="articleId"
            :is-reply="true"
            @reply="$emit('reply', $event)"
            @update="$emit('update')"
          />
        </div>

        <!-- Load More Replies -->
        <div v-if="comment.hasMoreReplies" class="mt-4">
          <UButton
            @click="loadMoreReplies"
            variant="ghost"
            size="sm"
            :loading="loadingReplies"
          >
            Load {{ comment.totalReplies - (comment.replies?.length || 0) }} more replies
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  comment: any
  articleId: number
  isReply?: boolean
}

interface Emits {
  (e: 'reply', comment: any): void
  (e: 'update'): void
}

const props = withDefaults(defineProps<Props>(), {
  isReply: false
})

const emit = defineEmits<Emits>()
const toast = useToast()

// State
const isLiked = ref(false)
const likingComment = ref(false)
const editing = ref(false)
const editContent = ref('')
const saving = ref(false)
const deleting = ref(false)
const loadingReplies = ref(false)

// Permissions (you might want to implement proper permission checking)
const canEdit = computed(() => {
  // Check if user owns the comment or is admin
  return false // Replace with actual logic
})

const canDelete = computed(() => {
  // Check if user owns the comment or is admin/moderator
  return false // Replace with actual logic
})

const formatDate = (date: string) => {
  const commentDate = new Date(date)
  const now = new Date()
  const diffInHours = (now.getTime() - commentDate.getTime()) / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    return commentDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } else if (diffInHours < 24 * 7) {
    return commentDate.toLocaleDateString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  } else {
    return commentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: commentDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }
}

const formatContent = (content: string) => {
  // Basic formatting - you might want to use a proper markdown parser
  return content
    .replace(/\n/g, '<br>')
    .replace(/@(\w+)/g, '<span class="text-blue-500">@$1</span>')
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">$1</a>')
}

const toggleLike = async () => {
  likingComment.value = true
  
  try {
    const response = await $fetch(`/api/v1/comments/${props.comment.id}/like`, {
      method: 'POST'
    })
    
    isLiked.value = !isLiked.value
    props.comment.likeCount = response.likeCount
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to like comment',
      color: 'red'
    })
  } finally {
    likingComment.value = false
  }
}

const startEdit = () => {
  editing.value = true
  editContent.value = props.comment.content
}

const cancelEdit = () => {
  editing.value = false
  editContent.value = ''
}

const saveEdit = async () => {
  if (!editContent.value.trim()) return
  
  saving.value = true
  
  try {
    const response = await $fetch(`/api/v1/comments/${props.comment.id}`, {
      method: 'PUT',
      body: {
        content: editContent.value
      }
    })
    
    props.comment.content = response.content
    props.comment.updatedAt = response.updatedAt
    
    editing.value = false
    editContent.value = ''
    
    toast.add({
      title: 'Comment updated',
      description: 'Your comment has been updated successfully'
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to update comment',
      color: 'red'
    })
  } finally {
    saving.value = false
  }
}

const deleteComment = async () => {
  if (!confirm('Are you sure you want to delete this comment?')) return
  
  deleting.value = true
  
  try {
    await $fetch(`/api/v1/comments/${props.comment.id}`, {
      method: 'DELETE'
    })
    
    toast.add({
      title: 'Comment deleted',
      description: 'The comment has been deleted successfully'
    })
    
    emit('update')
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to delete comment',
      color: 'red'
    })
  } finally {
    deleting.value = false
  }
}

const reportComment = async () => {
  try {
    await $fetch(`/api/v1/comments/${props.comment.id}/report`, {
      method: 'POST'
    })
    
    toast.add({
      title: 'Comment reported',
      description: 'Thank you for reporting. We will review this comment.'
    })
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to report comment',
      color: 'red'
    })
  }
}

const loadMoreReplies = async () => {
  loadingReplies.value = true
  
  try {
    const response = await $fetch(`/api/v1/comments/${props.comment.id}/replies`, {
      query: {
        page: Math.ceil((props.comment.replies?.length || 0) / 5) + 1,
        limit: 5
      }
    })
    
    props.comment.replies = [...(props.comment.replies || []), ...response.replies]
    props.comment.hasMoreReplies = response.hasMore
  } catch (error: any) {
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to load replies',
      color: 'red'
    })
  } finally {
    loadingReplies.value = false
  }
}
</script>

<style scoped>
.comment-item {
  @apply relative;
}

.comment-item:not(:last-child)::after {
  content: '';
  @apply absolute left-6 top-16 bottom-0 w-px bg-gray-200 dark:bg-gray-700;
}

.prose a {
  @apply break-words;
}
</style>