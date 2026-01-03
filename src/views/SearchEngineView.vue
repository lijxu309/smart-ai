<script setup lang="ts">
import { ref } from 'vue'
import ChatSidebar from '../components/chat/ChatSidebar.vue'
import UpgradeModal from '../components/UpgradeModal.vue'

const isSidebarOpen = ref(true)
const showUpgradeModal = ref(false)
const searchQuery = ref('')
const isSearching = ref(false)
const searchResults = ref<Array<{title: string, url: string, snippet: string}>>([])

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  isSearching.value = true
  
  // Simulate search
  setTimeout(() => {
    searchResults.value = [
      {
        title: 'Example Result 1 - ' + searchQuery.value,
        url: 'https://example.com/result1',
        snippet: 'This is a sample search result snippet that provides relevant information about your query...'
      },
      {
        title: 'Example Result 2 - Related Topic',
        url: 'https://example.com/result2',
        snippet: 'Another relevant result that matches your search criteria with detailed information...'
      },
      {
        title: 'Example Result 3 - More Information',
        url: 'https://example.com/result3',
        snippet: 'Additional resources and information related to your search query...'
      }
    ]
    isSearching.value = false
  }, 1500)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <div class="h-screen flex bg-white">
    <!-- Sidebar -->
    <ChatSidebar 
      :is-open="isSidebarOpen" 
      @toggle="toggleSidebar"
      @new-chat="$router.push('/chat')"
      @show-upgrade="showUpgradeModal = true"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <header class="h-14 flex items-center justify-between px-4 border-b border-gray-100">
        <div class="flex items-center space-x-3">
          <button 
            v-if="!isSidebarOpen"
            @click="toggleSidebar"
            class="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold text-gray-900">AI Search Engine</h1>
        </div>
      </header>

      <!-- Search Area -->
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-3xl mx-auto px-4 py-12">
          <!-- Search Header -->
          <div class="text-center mb-8">
            <div class="text-4xl mb-4">🔍</div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">AI-Powered Search</h2>
            <p class="text-gray-600">Search the web with AI-enhanced results and summaries</p>
          </div>

          <!-- Search Input -->
          <div class="relative mb-8">
            <input
              v-model="searchQuery"
              @keydown="handleKeydown"
              type="text"
              placeholder="Search anything..."
              class="w-full px-6 py-4 pr-14 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 text-lg"
            />
            <button 
              @click="handleSearch"
              :disabled="isSearching"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-gray-900 hover:bg-gray-800 rounded-xl transition"
            >
              <svg v-if="!isSearching" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <svg v-else class="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </button>
          </div>

          <!-- Search Results -->
          <div v-if="searchResults.length > 0" class="space-y-4">
            <div 
              v-for="(result, index) in searchResults" 
              :key="index"
              class="p-4 border border-gray-200 rounded-xl hover:shadow-md transition"
            >
              <a :href="result.url" target="_blank" class="text-blue-600 hover:underline font-medium">
                {{ result.title }}
              </a>
              <p class="text-sm text-green-700 mt-1">{{ result.url }}</p>
              <p class="text-gray-600 mt-2">{{ result.snippet }}</p>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!isSearching" class="text-center text-gray-500 py-12">
            <p>Enter a search query to get AI-powered results</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <UpgradeModal v-if="showUpgradeModal" @close="showUpgradeModal = false" />
  </div>
</template>
