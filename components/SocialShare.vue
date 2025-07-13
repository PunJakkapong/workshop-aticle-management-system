<template>
  <div class="flex flex-wrap space-x-3">
    <!-- Twitter/X -->
    <UButton
      @click="shareOnTwitter"
      variant="outline"
      size="sm"
      class="hover:bg-blue-50 hover:border-blue-500 dark:hover:bg-blue-950"
    >
      <UIcon name="i-simple-icons-x" class="w-4 h-4 mr-2" />
      Twitter
    </UButton>

    <!-- Facebook -->
    <UButton
      @click="shareOnFacebook"
      variant="outline"
      size="sm"
      class="hover:bg-blue-50 hover:border-blue-500 dark:hover:bg-blue-950"
    >
      <UIcon name="i-simple-icons-facebook" class="w-4 h-4 mr-2" />
      Facebook
    </UButton>

    <!-- LinkedIn -->
    <UButton
      @click="shareOnLinkedIn"
      variant="outline"
      size="sm"
      class="hover:bg-blue-50 hover:border-blue-500 dark:hover:bg-blue-950"
    >
      <UIcon name="i-simple-icons-linkedin" class="w-4 h-4 mr-2" />
      LinkedIn
    </UButton>

    <!-- Reddit -->
    <UButton
      @click="shareOnReddit"
      variant="outline"
      size="sm"
      class="hover:bg-orange-50 hover:border-orange-500 dark:hover:bg-orange-950"
    >
      <UIcon name="i-simple-icons-reddit" class="w-4 h-4 mr-2" />
      Reddit
    </UButton>

    <!-- Copy Link -->
    <UButton
      @click="copyLink"
      variant="outline"
      size="sm"
      :color="copied ? 'green' : 'gray'"
      class="transition-colors"
    >
      <UIcon :name="copied ? 'i-heroicons-check' : 'i-heroicons-link'" class="w-4 h-4 mr-2" />
      {{ copied ? 'Copied!' : 'Copy Link' }}
    </UButton>

    <!-- Email -->
    <UButton
      @click="shareViaEmail"
      variant="outline"
      size="sm"
      class="hover:bg-gray-50 hover:border-gray-500 dark:hover:bg-gray-950"
    >
      <UIcon name="i-heroicons-envelope" class="w-4 h-4 mr-2" />
      Email
    </UButton>
  </div>
</template>

<script setup lang="ts">
interface Props {
  article: {
    title: string
    slug: string
    excerpt?: string
  }
}

const props = defineProps<Props>()
const toast = useToast()

const copied = ref(false)

const articleUrl = computed(() => {
  if (process.client) {
    return `${window.location.origin}/blog/${props.article.slug}`
  }
  return ''
})

const shareText = computed(() => {
  return `${props.article.title} ${props.article.excerpt ? '- ' + props.article.excerpt.substring(0, 100) + '...' : ''}`
})

const shareOnTwitter = () => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText.value)}&url=${encodeURIComponent(articleUrl.value)}`
  window.open(url, '_blank', 'width=550,height=420')
}

const shareOnFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl.value)}`
  window.open(url, '_blank', 'width=550,height=420')
}

const shareOnLinkedIn = () => {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl.value)}`
  window.open(url, '_blank', 'width=550,height=420')
}

const shareOnReddit = () => {
  const url = `https://reddit.com/submit?url=${encodeURIComponent(articleUrl.value)}&title=${encodeURIComponent(props.article.title)}`
  window.open(url, '_blank', 'width=550,height=420')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(articleUrl.value)
    copied.value = true
    
    toast.add({
      title: 'Link copied!',
      description: 'Article link has been copied to your clipboard'
    })
    
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to copy link to clipboard',
      color: 'red'
    })
  }
}

const shareViaEmail = () => {
  const subject = encodeURIComponent(`Check out this article: ${props.article.title}`)
  const body = encodeURIComponent(`I thought you might be interested in this article:\n\n${props.article.title}\n\n${props.article.excerpt || ''}\n\nRead more: ${articleUrl.value}`)
  
  window.location.href = `mailto:?subject=${subject}&body=${body}`
}

// Native Web Share API (for mobile devices)
const shareNatively = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.article.title,
        text: props.article.excerpt,
        url: articleUrl.value
      })
    } catch (error) {
      // User cancelled or error occurred
    }
  }
}

// Check if native sharing is available
const canShareNatively = computed(() => {
  return process.client && navigator.share
})

onMounted(() => {
  // Show native share button on mobile if available
  if (canShareNatively.value) {
    // Could add a native share button here
  }
})
</script>