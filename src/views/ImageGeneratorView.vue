<script setup lang="ts">
import { ref } from 'vue'
import ChatSidebar from '../components/chat/ChatSidebar.vue'

const isSidebarOpen = ref(true)
const prompt = ref('')
const negativePrompt = ref('')
const selectedStyle = ref('realistic')
const selectedSize = ref('1024x1024')
const imageCount = ref(1)
const isGenerating = ref(false)
const generatedImages = ref<string[]>([])

const styles = [
  { id: 'realistic', name: 'Realistic', icon: '📷' },
  { id: 'anime', name: 'Anime', icon: '🎨' },
  { id: 'digital-art', name: 'Digital Art', icon: '🖼️' },
  { id: '3d-render', name: '3D Render', icon: '🎮' },
  { id: 'oil-painting', name: 'Oil Painting', icon: '🖌️' },
  { id: 'watercolor', name: 'Watercolor', icon: '💧' },
]

const sizes = [
  { id: '512x512', name: '512 × 512' },
  { id: '1024x1024', name: '1024 × 1024' },
  { id: '1024x1792', name: '1024 × 1792' },
  { id: '1792x1024', name: '1792 × 1024' },
]

const handleGenerate = async () => {
  if (!prompt.value.trim()) return

  isGenerating.value = true
  
  // Simulate image generation
  setTimeout(() => {
    // Add placeholder images
    generatedImages.value = [
      'https://picsum.photos/512/512?random=1',
      'https://picsum.photos/512/512?random=2',
      'https://picsum.photos/512/512?random=3',
      'https://picsum.photos/512/512?random=4',
    ].slice(0, imageCount.value)
    isGenerating.value = false
  }, 2000)
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="h-screen flex bg-dark-400">
    <!-- Sidebar -->
    <ChatSidebar 
      :is-open="isSidebarOpen" 
      @toggle="toggleSidebar"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="h-14 flex items-center justify-between px-4 border-b border-dark-100 bg-dark-300">
        <div class="flex items-center space-x-4">
          <button 
            @click="toggleSidebar"
            class="p-2 hover:bg-dark-200 rounded-lg transition lg:hidden"
          >
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold text-white">AI Image Generator</h1>
        </div>
      </header>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="max-w-4xl mx-auto">
          <!-- Prompt Input -->
          <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100 mb-6">
            <label class="block text-sm font-medium text-gray-400 mb-2">Prompt</label>
            <textarea
              v-model="prompt"
              placeholder="Describe the image you want to generate..."
              rows="3"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none"
            ></textarea>

            <label class="block text-sm font-medium text-gray-400 mb-2 mt-4">Negative Prompt (optional)</label>
            <textarea
              v-model="negativePrompt"
              placeholder="What you don't want in the image..."
              rows="2"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none"
            ></textarea>
          </div>

          <!-- Style Selection -->
          <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100 mb-6">
            <label class="block text-sm font-medium text-gray-400 mb-4">Style</label>
            <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
              <button
                v-for="style in styles"
                :key="style.id"
                @click="selectedStyle = style.id"
                :class="[
                  'p-3 rounded-xl border text-center transition',
                  selectedStyle === style.id
                    ? 'border-primary-500 bg-primary-500/20'
                    : 'border-dark-100 hover:border-gray-600'
                ]"
              >
                <div class="text-2xl mb-1">{{ style.icon }}</div>
                <div class="text-xs text-gray-400">{{ style.name }}</div>
              </button>
            </div>
          </div>

          <!-- Settings -->
          <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Size -->
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Size</label>
                <select
                  v-model="selectedSize"
                  class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                >
                  <option v-for="size in sizes" :key="size.id" :value="size.id">
                    {{ size.name }}
                  </option>
                </select>
              </div>

              <!-- Count -->
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-2">Number of Images</label>
                <select
                  v-model="imageCount"
                  class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                >
                  <option :value="1">1 Image</option>
                  <option :value="2">2 Images</option>
                  <option :value="4">4 Images</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Generate Button -->
          <button
            @click="handleGenerate"
            :disabled="isGenerating || !prompt.trim()"
            class="w-full py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition flex items-center justify-center space-x-2"
          >
            <svg v-if="isGenerating" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isGenerating ? 'Generating...' : 'Generate Images' }}</span>
          </button>

          <!-- Generated Images -->
          <div v-if="generatedImages.length > 0" class="mt-8">
            <h2 class="text-lg font-semibold text-white mb-4">Generated Images</h2>
            <div class="grid grid-cols-2 gap-4">
              <div 
                v-for="(image, index) in generatedImages" 
                :key="index"
                class="relative group"
              >
                <img 
                  :src="image" 
                  :alt="`Generated image ${index + 1}`"
                  class="w-full aspect-square object-cover rounded-xl"
                />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2 rounded-xl">
                  <button class="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button class="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
