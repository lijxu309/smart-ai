<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ChatSidebar from '../components/chat/ChatSidebar.vue'
import UpgradeModal from '../components/UpgradeModal.vue'

const router = useRouter()

const isSidebarOpen = ref(true)
const showUpgradeModal = ref(false)

// Mock generated images
const images = ref([
  { id: '1', url: 'https://picsum.photos/512/512?random=1', prompt: 'A beautiful sunset over mountains', createdAt: '2024-01-02' },
  { id: '2', url: 'https://picsum.photos/512/512?random=2', prompt: 'Futuristic city with neon lights', createdAt: '2024-01-02' },
  { id: '3', url: 'https://picsum.photos/512/512?random=3', prompt: 'Magical forest with glowing mushrooms', createdAt: '2024-01-01' },
  { id: '4', url: 'https://picsum.photos/512/512?random=4', prompt: 'Astronaut floating in space', createdAt: '2024-01-01' },
])

const selectedImage = ref<typeof images.value[0] | null>(null)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const openImage = (image: typeof images.value[0]) => {
  selectedImage.value = image
}

const closeImage = () => {
  selectedImage.value = null
}

const downloadImage = (url: string) => {
  window.open(url, '_blank')
}

const deleteImage = (id: string) => {
  images.value = images.value.filter(img => img.id !== id)
  selectedImage.value = null
}
</script>

<template>
  <div class="h-screen flex bg-dark-400">
    <!-- Sidebar -->
    <ChatSidebar 
      :is-open="isSidebarOpen" 
      @toggle="toggleSidebar"
      @new-chat="router.push('/chat')"
      @show-upgrade="showUpgradeModal = true"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Header -->
      <header class="h-14 flex items-center justify-between px-4 border-b border-dark-100 bg-dark-300 shrink-0">
        <div class="flex items-center space-x-3">
          <button 
            v-if="!isSidebarOpen"
            @click="toggleSidebar"
            class="p-2 hover:bg-dark-200 rounded-lg transition"
          >
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold text-white">Image Library</h1>
        </div>
      </header>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="max-w-6xl mx-auto">
          <!-- Title Section -->
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-white mb-2">Image Library</h2>
            <p class="text-gray-400">View and manage your AI-generated images.</p>
          </div>

          <!-- Empty State -->
          <div v-if="images.length === 0" class="text-center py-16">
            <div class="text-6xl mb-4">🖼️</div>
            <h3 class="text-xl font-semibold text-white mb-2">No images yet</h3>
            <p class="text-gray-400 mb-6">Start generating images to see them here.</p>
            <button 
              @click="router.push('/image-generator')"
              class="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl text-white font-semibold transition"
            >
              Generate Images
            </button>
          </div>

          <!-- Images Grid -->
          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="image in images"
              :key="image.id"
              @click="openImage(image)"
              class="aspect-square rounded-xl overflow-hidden bg-dark-300 cursor-pointer group relative"
            >
              <img :src="image.url" :alt="image.prompt" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span class="text-white text-sm">View</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div 
      v-if="selectedImage" 
      class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      @click.self="closeImage"
    >
      <div class="bg-dark-300 rounded-2xl max-w-2xl w-full overflow-hidden">
        <div class="p-4 border-b border-dark-100 flex items-center justify-between">
          <h3 class="font-semibold text-white">Image Details</h3>
          <button @click="closeImage" class="p-2 hover:bg-dark-200 rounded-lg transition">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4">
          <img :src="selectedImage.url" :alt="selectedImage.prompt" class="w-full rounded-xl mb-4" />
          <p class="text-gray-300 mb-2"><strong class="text-white">Prompt:</strong> {{ selectedImage.prompt }}</p>
          <p class="text-gray-400 text-sm mb-4">Created: {{ selectedImage.createdAt }}</p>
          <div class="flex space-x-3">
            <button 
              @click="downloadImage(selectedImage.url)"
              class="flex-1 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white font-medium transition"
            >
              Download
            </button>
            <button 
              @click="deleteImage(selectedImage.id)"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <UpgradeModal v-if="showUpgradeModal" @close="showUpgradeModal = false" />
  </div>
</template>
