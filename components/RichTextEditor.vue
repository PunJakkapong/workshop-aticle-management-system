<template>
  <div class="rich-text-editor">
    <div v-if="editor" class="menu-bar">
      <UButtonGroup size="sm" orientation="horizontal">
        <UButton
          @click="editor.chain().focus().toggleBold().run()"
          :variant="editor.isActive('bold') ? 'solid' : 'outline'"
          icon="i-heroicons-bold"
          size="sm"
        />
        <UButton
          @click="editor.chain().focus().toggleItalic().run()"
          :variant="editor.isActive('italic') ? 'solid' : 'outline'"
          icon="i-heroicons-italic"
          size="sm"
        />
        <UButton
          @click="editor.chain().focus().toggleStrike().run()"
          :variant="editor.isActive('strike') ? 'solid' : 'outline'"
          icon="i-heroicons-strikethrough"
          size="sm"
        />
        <UButton
          @click="editor.chain().focus().toggleCode().run()"
          :variant="editor.isActive('code') ? 'solid' : 'outline'"
          icon="i-heroicons-code-bracket"
          size="sm"
        />
      </UButtonGroup>

      <UButtonGroup size="sm" orientation="horizontal" class="ml-2">
        <UButton
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :variant="editor.isActive('heading', { level: 1 }) ? 'solid' : 'outline'"
          size="sm"
        >
          H1
        </UButton>
        <UButton
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :variant="editor.isActive('heading', { level: 2 }) ? 'solid' : 'outline'"
          size="sm"
        >
          H2
        </UButton>
        <UButton
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :variant="editor.isActive('heading', { level: 3 }) ? 'solid' : 'outline'"
          size="sm"
        >
          H3
        </UButton>
        <UButton
          @click="editor.chain().focus().setParagraph().run()"
          :variant="editor.isActive('paragraph') ? 'solid' : 'outline'"
          size="sm"
        >
          P
        </UButton>
      </UButtonGroup>

      <UButtonGroup size="sm" orientation="horizontal" class="ml-2">
        <UButton
          @click="editor.chain().focus().toggleBulletList().run()"
          :variant="editor.isActive('bulletList') ? 'solid' : 'outline'"
          icon="i-heroicons-list-bullet"
          size="sm"
        />
        <UButton
          @click="editor.chain().focus().toggleOrderedList().run()"
          :variant="editor.isActive('orderedList') ? 'solid' : 'outline'"
          icon="i-heroicons-numbered-list"
          size="sm"
        />
        <UButton
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :variant="editor.isActive('codeBlock') ? 'solid' : 'outline'"
          icon="i-heroicons-code-bracket-square"
          size="sm"
        />
        <UButton
          @click="editor.chain().focus().toggleBlockquote().run()"
          :variant="editor.isActive('blockquote') ? 'solid' : 'outline'"
          icon="i-heroicons-chat-bubble-left-ellipsis"
          size="sm"
        />
      </UButtonGroup>

      <UButtonGroup size="sm" orientation="horizontal" class="ml-2">
        <UButton
          @click="editor.chain().focus().setHorizontalRule().run()"
          icon="i-heroicons-minus"
          size="sm"
          variant="outline"
        />
        <UButton
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().chain().focus().undo().run()"
          icon="i-heroicons-arrow-uturn-left"
          size="sm"
          variant="outline"
        />
        <UButton
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().chain().focus().redo().run()"
          icon="i-heroicons-arrow-uturn-right"
          size="sm"
          variant="outline"
        />
      </UButtonGroup>
    </div>

    <div
      ref="editorRef"
      class="editor-content"
      :class="[
        'min-h-[400px] p-4 border border-gray-200 dark:border-gray-700 rounded-lg',
        'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto',
        'dark:prose-invert max-w-none focus-within:ring-2 focus-within:ring-primary-500'
      ]"
    />

    <div v-if="characterCount && editor" class="text-xs text-gray-500 mt-2 text-right">
      {{ getCharacterCount() }} characters
    </div>
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  characterCount?: boolean
  editable?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Start writing...',
  characterCount: false,
  editable: true
})

const emit = defineEmits<Emits>()

const editorRef = ref<HTMLElement>()
const editor = ref<Editor>()

// Get character count from editor text content
const getCharacterCount = () => {
  if (!editor.value) return 0
  const text = editor.value.getText()
  return text.length
}

onMounted(() => {
  editor.value = new Editor({
    element: editorRef.value,
    extensions: [
      StarterKit,
    ],
    content: props.modelValue,
    editable: props.editable,
    onUpdate: ({ editor }) => {
      emit('update:modelValue', editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none dark:prose-invert max-w-none',
      },
    },
  })
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})

watch(() => props.modelValue, (value) => {
  if (editor.value && editor.value.getHTML() !== value) {
    editor.value.commands.setContent(value)
  }
})

watch(() => props.editable, (value) => {
  if (editor.value) {
    editor.value.setEditable(value)
  }
})
</script>

<style scoped>
.rich-text-editor {
  @apply w-full;
}

.menu-bar {
  @apply flex flex-wrap items-center p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg;
  gap: 0.5rem;
}

.editor-content {
  @apply rounded-t-none;
}

:deep(.ProseMirror) {
  @apply outline-none;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  @apply float-left h-0 text-gray-400 pointer-events-none;
}

:deep(.ProseMirror .selectedCell) {
  @apply bg-blue-100 dark:bg-blue-900;
}

:deep(.ProseMirror blockquote) {
  @apply border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic;
}

:deep(.ProseMirror pre) {
  @apply bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto;
}

:deep(.ProseMirror code) {
  @apply bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-sm;
}

:deep(.ProseMirror hr) {
  @apply border-gray-300 dark:border-gray-600 my-6;
}
</style>