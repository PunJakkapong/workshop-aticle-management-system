<template>
  <div>
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-950 dark:to-blue-950 py-20">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Article Management
          <span class="text-primary-600 dark:text-primary-400">System</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          Create, manage, and publish articles with our comprehensive content management system. 
          Features rich text editing, SEO optimization, and powerful search capabilities.
        </p>
        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <UButton to="/blog" size="lg" icon="i-heroicons-document-text">
            Browse Articles
          </UButton>
          <UButton to="/articles/create" variant="outline" size="lg" icon="i-heroicons-plus">
            Create Article
          </UButton>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-20 bg-white dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400">
            Everything you need to manage your content effectively
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Rich Text Editor -->
          <UCard class="text-center">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-pencil-square" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Rich Text Editor</h3>
            <p class="text-gray-600 dark:text-gray-400">
              TipTap-powered editor with formatting, links, images, and code blocks
            </p>
          </UCard>

          <!-- SEO Optimization -->
          <UCard class="text-center">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-magnifying-glass" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">SEO Optimization</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Meta tags, structured data, and search-friendly URLs
            </p>
          </UCard>

          <!-- Categories & Tags -->
          <UCard class="text-center">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-tag" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Categories & Tags</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Organize content with hierarchical categories and flexible tagging
            </p>
          </UCard>

          <!-- Image Management -->
          <UCard class="text-center">
            <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-photo" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Image Management</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Upload and manage featured images with drag-and-drop support
            </p>
          </UCard>

          <!-- Search & Filter -->
          <UCard class="text-center">
            <div class="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-funnel" class="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Search & Filter</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Full-text search with advanced filtering and sorting options
            </p>
          </UCard>

          <!-- Comments System -->
          <UCard class="text-center">
            <div class="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UIcon name="i-heroicons-chat-bubble-left" class="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Comments System</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Engage with readers through threaded comments and replies
            </p>
          </UCard>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="py-16 bg-gray-50 dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">50+</div>
            <div class="text-gray-600 dark:text-gray-400">Articles Published</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">1000+</div>
            <div class="text-gray-600 dark:text-gray-400">Total Views</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">15</div>
            <div class="text-gray-600 dark:text-gray-400">Categories</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">100+</div>
            <div class="text-gray-600 dark:text-gray-400">Comments</div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="py-20 bg-primary-600 dark:bg-primary-700">
      <div class="max-w-4xl mx-auto text-center px-6">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Start Writing?
        </h2>
        <p class="text-xl text-primary-100 mb-8">
          Join our platform and start creating amazing content today. Share your knowledge and connect with readers.
        </p>
        <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <UButton to="/articles/create" size="lg" color="white" variant="solid">
            Create Your First Article
          </UButton>
          <UButton to="/blog" size="lg" color="white" variant="outline">
            Explore Articles
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Article Management System - Create & Manage Content',
  description: 'A comprehensive article management system with rich text editing, SEO optimization, and powerful content organization features.',
  ogTitle: 'Article Management System',
  ogDescription: 'Create, manage, and publish articles with our comprehensive content management system.',
  ogType: 'website'
})
</script>