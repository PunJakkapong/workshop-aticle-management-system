<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors">
    <!-- Navigation Header -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <nav class="max-w-7xl mx-auto px-6">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white">
            <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <span>ArticleMS</span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-8">
            <NuxtLink 
              to="/" 
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              :class="{ 'text-primary-600 dark:text-primary-400 font-medium': $route.path === '/' }"
            >
              Home
            </NuxtLink>
            <NuxtLink 
              to="/blog" 
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              :class="{ 'text-primary-600 dark:text-primary-400 font-medium': $route.path.startsWith('/blog') }"
            >
              Blog
            </NuxtLink>
            <NuxtLink 
              to="/articles/create" 
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              :class="{ 'text-primary-600 dark:text-primary-400 font-medium': $route.path.startsWith('/articles') }"
            >
              Write
            </NuxtLink>
            <NuxtLink 
              to="/admin" 
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              :class="{ 'text-primary-600 dark:text-primary-400 font-medium': $route.path.startsWith('/admin') }"
            >
              Dashboard
            </NuxtLink>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <!-- Search Button -->
            <UButton
              @click="openSearch"
              variant="ghost"
              size="sm"
              icon="i-heroicons-magnifying-glass"
              class="hidden sm:flex"
            />

            <!-- Dark Mode Toggle -->
            <UButton
              @click="toggleDarkMode"
              variant="ghost"
              size="sm"
              :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            />

            <!-- Mobile Menu Button -->
            <UButton
              @click="mobileMenuOpen = !mobileMenuOpen"
              variant="ghost"
              size="sm"
              icon="i-heroicons-bars-3"
              class="md:hidden"
            />
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div 
          v-if="mobileMenuOpen"
          class="md:hidden py-4 space-y-2 border-t border-gray-200 dark:border-gray-700"
        >
          <NuxtLink 
            to="/" 
            @click="mobileMenuOpen = false"
            class="block py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            :class="{ 'text-primary-600 dark:text-primary-400 font-medium': $route.path === '/' }"
          >
            Home
          </NuxtLink>
          <NuxtLink 
            to="/blog" 
            @click="mobileMenuOpen = false"
            class="block py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            :class="{ 'text-primary-600 dark:text-primary-400 font-medium': $route.path.startsWith('/blog') }"
          >
            Blog
          </NuxtLink>
          <NuxtLink 
            to="/articles/create" 
            @click="mobileMenuOpen = false"
            class="block py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            :class="{ 'text-primary-600 dark:text-primary-400 font-medium': $route.path.startsWith('/articles') }"
          >
            Write
          </NuxtLink>
          <NuxtLink 
            to="/admin" 
            @click="mobileMenuOpen = false"
            class="block py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            :class="{ 'text-primary-600 dark:text-primary-400 font-medium': $route.path.startsWith('/admin') }"
          >
            Dashboard
          </NuxtLink>
          
          <!-- Mobile Search -->
          <div class="pt-2">
            <UButton
              @click="openSearch"
              variant="outline"
              size="sm"
              icon="i-heroicons-magnifying-glass"
              block
            >
              Search
            </UButton>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
      <div class="max-w-7xl mx-auto px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Brand -->
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white mb-4">
              <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
              <span>ArticleMS</span>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              A comprehensive article management system built with Nuxt 3, featuring rich text editing, SEO optimization, and powerful content organization.
            </p>
            <div class="flex space-x-4">
              <UButton
                to="https://github.com"
                target="_blank"
                variant="ghost"
                size="sm"
                icon="i-simple-icons-github"
              />
              <UButton
                to="https://twitter.com"
                target="_blank"
                variant="ghost"
                size="sm"
                icon="i-simple-icons-x"
              />
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <div class="space-y-2">
              <NuxtLink to="/" class="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Home
              </NuxtLink>
              <NuxtLink to="/blog" class="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Blog
              </NuxtLink>
              <NuxtLink to="/articles/create" class="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Write Article
              </NuxtLink>
              <NuxtLink to="/admin" class="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Dashboard
              </NuxtLink>
            </div>
          </div>

          <!-- Resources -->
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
            <div class="space-y-2">
              <a href="#" class="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Documentation
              </a>
              <a href="#" class="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                API Reference
              </a>
              <a href="#" class="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Support
              </a>
              <a href="#" class="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; {{ new Date().getFullYear() }} ArticleMS. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- Search Modal -->
    <SearchModal v-model="searchModalOpen" />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const mobileMenuOpen = ref(false)
const searchModalOpen = ref(false)

const isDark = computed(() => colorMode.value === 'dark')

const toggleDarkMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const openSearch = () => {
  searchModalOpen.value = true
  mobileMenuOpen.value = false
}

// Close mobile menu when route changes
const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

// Close mobile menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const nav = document.querySelector('nav')
    if (nav && !nav.contains(event.target as Node)) {
      mobileMenuOpen.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<style scoped>
/* Custom styles for smooth transitions */
.router-link-exact-active {
  @apply text-primary-600 dark:text-primary-400 font-medium;
}

/* Mobile menu animation */
.md\:hidden {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>