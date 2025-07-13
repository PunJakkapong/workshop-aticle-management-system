<template>
  <div class="image-upload">
    <div
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
      class="upload-area"
      :class="[
        'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
        isDragging ? 'border-primary-400 bg-primary-50 dark:bg-primary-950' : 'border-gray-300 dark:border-gray-600',
        'hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950'
      ]"
    >
      <div v-if="!imageUrl && !uploading">
        <UIcon name="i-heroicons-photo" class="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Drop an image here or click to select
        </p>
        <UButton
          @click="triggerFileInput"
          variant="outline"
          size="sm"
        >
          Choose Image
        </UButton>
        <p class="text-xs text-gray-500 mt-2">
          PNG, JPG, GIF, WebP up to 5MB
        </p>
      </div>

      <div v-else-if="uploading" class="flex flex-col items-center">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500 mb-2" />
        <p class="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
        <div v-if="uploadProgress > 0" class="w-full max-w-xs mt-2">
          <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              class="bg-primary-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${uploadProgress}%` }"
            />
          </div>
        </div>
      </div>

      <div v-else-if="imageUrl" class="relative">
        <img
          :src="imageUrl"
          :alt="fileName || 'Uploaded image'"
          class="max-w-full max-h-48 mx-auto rounded-lg shadow-sm"
        />
        <div class="flex justify-center space-x-2 mt-4">
          <UButton
            @click="removeImage"
            variant="outline"
            color="red"
            size="sm"
            icon="i-heroicons-trash"
          >
            Remove
          </UButton>
          <UButton
            @click="triggerFileInput"
            variant="outline"
            size="sm"
            icon="i-heroicons-arrow-path"
          >
            Replace
          </UButton>
        </div>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="handleFileSelect"
      class="hidden"
    />

    <div v-if="error" class="mt-2">
      <UAlert
        color="red"
        variant="soft"
        :title="error"
        @close="error = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  maxSize?: number
  accept?: string[]
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'upload', data: { url: string; filename: string; originalName: string; size: number }): void
}

const props = withDefaults(defineProps<Props>(), {
  maxSize: 5 * 1024 * 1024, // 5MB
  accept: () => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
})

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref<string | null>(null)
const fileName = ref<string>('')

const imageUrl = computed({
  get: () => props.modelValue || '',
  set: (value: string) => emit('update:modelValue', value)
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    uploadFile(files[0])
  }
}

const uploadFile = async (file: File) => {
  if (!validateFile(file)) {
    return
  }

  uploading.value = true
  uploadProgress.value = 0
  error.value = null
  fileName.value = file.name

  try {
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += Math.random() * 30
      }
    }, 200)

    // Convert file to base64 data URL for client-side storage
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    // Generate a unique filename
    const timestamp = Date.now()
    const uniqueFilename = `${timestamp}-${file.name}`

    setTimeout(() => {
      imageUrl.value = dataUrl
      emit('upload', {
        url: dataUrl,
        filename: uniqueFilename,
        originalName: file.name,
        size: file.size
      })
      uploading.value = false
      uploadProgress.value = 0
    }, 500)

  } catch (err: any) {
    uploading.value = false
    uploadProgress.value = 0
    error.value = 'Upload failed. Please try again.'
  }
}

const validateFile = (file: File): boolean => {
  if (!props.accept.includes(file.type)) {
    error.value = 'Invalid file type. Please select a valid image file.'
    return false
  }

  if (file.size > props.maxSize) {
    error.value = `File size too large. Maximum size is ${Math.round(props.maxSize / 1024 / 1024)}MB.`
    return false
  }

  return true
}

const removeImage = () => {
  imageUrl.value = ''
  fileName.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

onMounted(() => {
  document.addEventListener('dragenter', (e) => {
    if (e.dataTransfer?.types.includes('Files')) {
      isDragging.value = true
    }
  })

  document.addEventListener('dragleave', (e) => {
    if (!e.relatedTarget) {
      isDragging.value = false
    }
  })
})
</script>

<style scoped>
.upload-area {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>