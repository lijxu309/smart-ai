<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ChatSidebar from '../components/chat/ChatSidebar.vue'
import UpgradeModal from '../components/UpgradeModal.vue'

const router = useRouter()

const isSidebarOpen = ref(true)
const showUpgradeModal = ref(false)
const prompt = ref('')
const selectedStyle = ref('')
const isGenerating = ref(false)
const generatedImages = ref<string[]>([])

const imageStyles = [
  { id: '', name: 'No Style', icon: '⚪' },
  { id: 'ghibli', name: 'Ghibli', icon: '🏯' },
  { id: 'toon', name: 'Toon', icon: '🎨' },
  { id: 'hyperrealistic', name: 'Hyperrealistic', icon: '📷' },
  { id: 'photo', name: 'Photo', icon: '📸' },
  { id: 'pen-ink', name: 'Pen&Ink', icon: '✒️' },
  { id: 'pop-art', name: 'Pop Art', icon: '🎭' },
  { id: 'studio-lighting', name: 'Studio Lighting', icon: '💡' },
  { id: 'magazine-cover', name: 'Magazine Cover', icon: '📰' },
  { id: 'comic-book', name: 'Comic Book', icon: '💥' },
  { id: 'van-gogh', name: 'Van Gogh', icon: '🌻' },
  { id: 'anime', name: 'Anime', icon: '🎌' },
  { id: 'origami', name: 'Origami', icon: '🦢' },
  { id: 'cgi', name: 'CGI', icon: '🖥️' },
  { id: 'car-toon', name: 'Car Toon', icon: '🚗' },
  { id: 'graffiti', name: 'Graffiti', icon: '🎨' },
  { id: 'logo', name: 'Logo', icon: '🏷️' },
  { id: 'valentines', name: "Valentine's Day", icon: '💕' },
  { id: 'mystical', name: 'Mystical', icon: '🔮' },
  { id: 'tattoo', name: 'Tattoo', icon: '💉' },
  { id: 'steampunk', name: 'Steampunk', icon: '⚙️' },
  { id: 'fictional', name: 'Fictional Character', icon: '🦸' },
  { id: 'vice', name: 'Vice', icon: '🎰' },
  { id: 'bokeh', name: 'Bokeh', icon: '✨' },
  { id: 'watercolor', name: 'Watercolor Painting', icon: '🎨' },
  { id: 'polaroid', name: 'Polaroid', icon: '📷' },
  { id: 'cinematic', name: 'Cinematic', icon: '🎬' },
  { id: 'abstract', name: 'Abstract Curves', icon: '🌀' },
  { id: 'color-painting', name: 'Color Painting', icon: '🖌️' },
  { id: 'oil-painting', name: 'Oil Painting', icon: '🖼️' },
  { id: '3d-game', name: '3D Game', icon: '🎮' },
  { id: 'animation', name: 'Animation', icon: '🎞️' },
  { id: 'authentic', name: 'Authentic', icon: '✅' },
  { id: 'digital-art', name: 'Digital Art', icon: '💻' },
  { id: 'halloween', name: 'Halloween', icon: '🎃' },
  { id: 'princess', name: 'Princess', icon: '👸' },
  { id: 'novelistic', name: 'Novelistic', icon: '📚' },
  { id: 'mythological', name: 'Mythological', icon: '🏛️' },
  { id: 'epic', name: 'Epic', icon: '⚔️' },
  { id: 'striking', name: 'Striking', icon: '⚡' },
  { id: 'colored-tattoo', name: 'Colored Tattoo', icon: '🌈' },
  { id: 'portrait', name: 'Portrait', icon: '🖼️' },
  { id: 'neo', name: 'Neo', icon: '🌃' },
  { id: 'past-life', name: 'Past Life', icon: '⏳' },
  { id: 'luminous', name: 'Luminous', icon: '💫' },
  { id: 'signature', name: 'Signature', icon: '✍️' },
  { id: '3d-render', name: '3D Render', icon: '🎲' },
  { id: 'text-art', name: 'Text Art', icon: '🔤' },
  { id: 'funko-pop', name: 'Funko Pop', icon: '🎁' },
]

const characterCount = computed(() => prompt.value.length)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const generateInspiration = () => {
  const inspirations = [
    "A duck swimming in a pond, in a forest, serene and peaceful, natural colors, reflections on the water, soft lighting through the trees.",
    "A futuristic cityscape at sunset, neon lights reflecting on wet streets, flying cars in the distance, cyberpunk atmosphere.",
    "A magical forest with glowing mushrooms, fairy lights floating in the air, mystical creatures hiding in the shadows.",
    "An astronaut floating in space, Earth visible in the background, stars and galaxies surrounding, peaceful and vast.",
    "A cozy coffee shop interior, warm lighting, books on shelves, rain outside the window, vintage aesthetic.",
  ]
  prompt.value = inspirations[Math.floor(Math.random() * inspirations.length)]
}

const generateImage = async () => {
  if (!prompt.value.trim()) return
  
  isGenerating.value = true
  
  // Simulate image generation
  setTimeout(() => {
    generatedImages.value.unshift(`https://picsum.photos/512/512?random=${Date.now()}`)
    isGenerating.value = false
  }, 2000)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    generateImage()
  }
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
          <h1 class="text-lg font-semibold text-white">AI Image Generator</h1>
        </div>
      </header>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="max-w-4xl mx-auto">
          <!-- Title Section -->
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-white mb-2">AI Image Generator</h2>
            <p class="text-gray-400">Generate high-quality, AI-crafted images in seconds.</p>
          </div>

          <!-- Style Selection -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-400 mb-3">Select Style (Optional)</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="style in imageStyles"
                :key="style.id"
                @click="selectedStyle = style.id"
                :class="[
                  'px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition',
                  selectedStyle === style.id 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-dark-300 text-gray-300 hover:bg-dark-200'
                ]"
              >
                <span>{{ style.icon }}</span>
                <span>{{ style.name }}</span>
              </button>
            </div>
          </div>

          <!-- Generated Images -->
          <div v-if="generatedImages.length > 0 || isGenerating" class="mb-6">
            <h3 class="text-sm font-medium text-gray-400 mb-3">Generated Images</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div 
                v-if="isGenerating"
                class="aspect-square rounded-xl bg-dark-300 flex items-center justify-center"
              >
                <div class="flex space-x-1">
                  <div class="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                  <div class="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                  <div class="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                </div>
              </div>
              <div 
                v-for="(image, index) in generatedImages" 
                :key="index"
                class="aspect-square rounded-xl overflow-hidden bg-dark-300 relative group"
              >
                <img :src="image" alt="Generated image" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-2">
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

      <!-- Input Area -->
      <div class="border-t border-dark-100 p-4 bg-dark-300 shrink-0">
        <div class="max-w-4xl mx-auto">
          <div class="bg-dark-200 rounded-2xl border border-dark-100">
            <!-- Text Input -->
            <textarea
              v-model="prompt"
              @keydown="handleKeydown"
              placeholder="A duck swimming in a pond, in a forest, serene and peaceful, natural colors, reflections on the water, soft lighting through the trees."
              rows="2"
              class="w-full bg-transparent text-white placeholder-gray-500 px-4 py-3 resize-none focus:outline-none"
            ></textarea>
            
            <!-- Action Buttons -->
            <div class="flex items-center justify-between px-3 py-2 border-t border-dark-100">
              <div class="flex items-center space-x-2">
                <!-- Attachment -->
                <button class="p-2 hover:bg-dark-100 rounded-lg transition text-gray-400 hover:text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                
                <!-- Inspire Me -->
                <button 
                  @click="generateInspiration"
                  class="px-3 py-1.5 bg-dark-100 hover:bg-dark-300 rounded-lg text-sm text-gray-300 hover:text-white transition flex items-center space-x-2"
                >
                  <span>✨</span>
                  <span>Inspire Me</span>
                </button>
              </div>
              
              <div class="flex items-center space-x-3">
                <!-- Character Count -->
                <span class="text-xs text-gray-500">{{ characterCount }}/10000</span>
                
                <!-- Voice Input -->
                <button class="p-2 hover:bg-dark-100 rounded-lg transition text-gray-400 hover:text-white">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                
                <!-- Generate Button -->
                <button
                  @click="generateImage"
                  :disabled="!prompt.trim() || isGenerating"
                  :class="[
                    'p-2 rounded-full transition',
                    prompt.trim() && !isGenerating
                      ? 'bg-primary-600 hover:bg-primary-700 text-white'
                      : 'bg-dark-100 text-gray-500 cursor-not-allowed'
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <UpgradeModal v-if="showUpgradeModal" @close="showUpgradeModal = false" />
  </div>
</template>
