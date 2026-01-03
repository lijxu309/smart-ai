<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '../stores/chat'
import { useUserStore } from '../stores/user'
import ChatSidebar from '../components/chat/ChatSidebar.vue'
import ChatMessage from '../components/chat/ChatMessage.vue'
import UpgradeModal from '../components/UpgradeModal.vue'

const router = useRouter()
const chatStore = useChatStore()
const userStore = useUserStore()

const messagesContainer = ref<HTMLElement | null>(null)
const isSidebarOpen = ref(true)
const messageInput = ref('')
const showUpgradeModal = ref(false)
const showAllModels = ref(false)

const quickModels = [
  { id: 'gpt-5-nano', name: 'GPT-5 Nano', icon: '🤖' },
  { id: 'gpt-5.2-instant', name: 'GPT-5.2 Instant', icon: '⚡' },
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', icon: '✨' },
  { id: 'claude-4.5', name: 'Claude 4.5', icon: '🌸' },
  { id: 'deepseek-v3.2', name: 'DeepSeek-v3.2', icon: '🔮' },
]

const allModels = [
  { id: 'grok-4.1', name: 'Grok 4.1', provider: 'xAI', desc: "xAI's most advanced reasoning model" },
  { id: 'grok-4', name: 'Grok 4', provider: 'xAI', desc: "xAI's powerful reasoning model" },
  { id: 'gpt-5.2', name: 'GPT-5.2', provider: 'OpenAI', desc: "OpenAI's newest flagship model" },
  { id: 'gpt-5', name: 'GPT-5', provider: 'OpenAI', desc: "OpenAI's high-performance model" },
  { id: 'openai-o3', name: 'OpenAI o3', provider: 'OpenAI', desc: "OpenAI's ultimate reasoning model" },
  { id: 'gemini-3-flash', name: 'Gemini 3 Flash', provider: 'Google', desc: "Google's fast and efficient model" },
  { id: 'perplexity', name: 'Perplexity', provider: 'Perplexity', desc: "Perplexity's cutting-edge AI model" },
  { id: 'llama-3', name: 'Llama 3', provider: 'Meta', desc: "Meta's latest language model" },
  { id: 'deepseek-v3.1', name: 'DeepSeek-v3.1', provider: 'DeepSeek', desc: "DeepSeek's powerful multimodal model" },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', desc: "OpenAI's advanced model" },
  { id: 'gpt-4o-mini', name: 'GPT-4o-mini', provider: 'OpenAI', desc: "OpenAI's efficient model" },
  { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI', desc: "OpenAI's most advanced 4.1 model" },
]

const characterCount = computed(() => messageInput.value.length)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleSendMessage = async () => {
  const content = messageInput.value.trim()
  if (!content || chatStore.isLoading) return

  messageInput.value = ''
  chatStore.addMessage('user', content)
  await scrollToBottom()

  chatStore.isLoading = true
  
  setTimeout(async () => {
    const responses = [
      "I'm Smart AI, your intelligent assistant. I can help you with various tasks including answering questions, writing content, analyzing data, and much more. How can I assist you today?",
      "That's a great question! Let me think about this...\n\nBased on my analysis, I would suggest considering multiple factors here. Would you like me to elaborate on any specific aspect?",
      "I understand what you're looking for. Here's my response:\n\n1. First, let's consider the main points\n2. Then, we can explore the details\n3. Finally, I'll provide my recommendations\n\nWould you like me to go deeper into any of these areas?",
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    chatStore.addMessage('assistant', randomResponse)
    chatStore.isLoading = false
    await scrollToBottom()
  }, 1500)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSendMessage()
  }
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const selectModel = (modelId: string) => {
  chatStore.setCurrentModel(modelId)
}

const goToImageGenerator = () => {
  router.push('/image-generator')
}

const startDeepResearch = () => {
  showUpgradeModal.value = true
}

onMounted(() => {
  chatStore.loadFromLocalStorage()
  if (chatStore.conversations.length === 0) {
    chatStore.createConversation()
  }
})
</script>

<template>
  <div class="h-screen flex bg-dark-400">
    <!-- Sidebar -->
    <ChatSidebar 
      :is-open="isSidebarOpen" 
      @toggle="toggleSidebar"
      @new-chat="chatStore.createConversation()"
      @show-upgrade="showUpgradeModal = true"
    />

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <header class="h-14 flex items-center justify-between px-4 border-b border-dark-100 bg-dark-300">
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
          <button 
            v-if="!isSidebarOpen"
            @click="chatStore.createConversation()"
            class="px-3 py-1.5 bg-dark-200 hover:bg-dark-100 rounded-lg text-sm text-gray-300 transition flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Chat</span>
          </button>
        </div>
        
        <div class="flex items-center space-x-3">
          <span class="px-2 py-1 bg-dark-200 rounded text-xs text-gray-400">Temporary</span>
          <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
            {{ userStore.userName?.charAt(0)?.toUpperCase() || 'U' }}
          </div>
        </div>
      </header>

      <!-- Messages -->
      <div 
        ref="messagesContainer"
        class="flex-1 overflow-y-auto"
      >
        <!-- Welcome Screen -->
        <template v-if="chatStore.currentMessages.length === 0">
          <div class="h-full flex flex-col items-center justify-center text-center px-4">
            <div class="text-6xl mb-4">🤖</div>
            <h2 class="text-2xl font-bold text-white mb-6">How can I help you today?</h2>
            
            <!-- Quick Model Selection -->
            <div class="flex flex-wrap items-center justify-center gap-2 mb-8">
              <button
                v-for="model in quickModels"
                :key="model.id"
                @click="selectModel(model.id)"
                :class="[
                  'px-3 py-2 rounded-full text-sm flex items-center space-x-2 transition',
                  chatStore.currentModel === model.id 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-dark-300 text-gray-300 hover:bg-dark-200'
                ]"
              >
                <span>{{ model.icon }}</span>
                <span>{{ model.name }}</span>
              </button>
              <button
                @click="showAllModels = true"
                class="px-3 py-2 rounded-full text-sm bg-dark-300 text-gray-300 hover:bg-dark-200 transition flex items-center space-x-1"
              >
                <span>See all</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </template>
        
        <!-- Messages List -->
        <template v-else>
          <div class="max-w-4xl mx-auto p-4 space-y-4">
            <ChatMessage 
              v-for="message in chatStore.currentMessages" 
              :key="message.id"
              :message="message"
            />
            
            <!-- Loading indicator -->
            <div v-if="chatStore.isLoading" class="flex items-start space-x-3">
              <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm">
                🤖
              </div>
              <div class="bg-dark-300 rounded-2xl px-4 py-3">
                <div class="flex space-x-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Input Area -->
      <div class="border-t border-dark-100 p-4 bg-dark-300">
        <div class="max-w-4xl mx-auto">
          <div class="bg-dark-200 rounded-2xl border border-dark-100">
            <!-- Text Input -->
            <textarea
              v-model="messageInput"
              @keydown="handleKeydown"
              placeholder="Write your message"
              rows="1"
              class="w-full bg-transparent text-white placeholder-gray-500 px-4 py-3 resize-none focus:outline-none"
              :style="{ minHeight: '48px', maxHeight: '200px' }"
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
                
                <!-- Create Image -->
                <button 
                  @click="goToImageGenerator"
                  class="px-3 py-1.5 bg-dark-100 hover:bg-dark-300 rounded-lg text-sm text-gray-300 hover:text-white transition flex items-center space-x-2"
                >
                  <span>🎨</span>
                  <span>Create Image</span>
                </button>
                
                <!-- Deep Research -->
                <button 
                  @click="startDeepResearch"
                  class="px-3 py-1.5 bg-dark-100 hover:bg-dark-300 rounded-lg text-sm text-gray-300 hover:text-white transition flex items-center space-x-2"
                >
                  <span>🔬</span>
                  <span>Deep Research</span>
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
                
                <!-- Send Button -->
                <button
                  @click="handleSendMessage"
                  :disabled="!messageInput.trim() || chatStore.isLoading"
                  :class="[
                    'p-2 rounded-full transition',
                    messageInput.trim() && !chatStore.isLoading
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

    <!-- All Models Modal -->
    <div v-if="showAllModels" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showAllModels = false">
      <div class="bg-dark-300 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden mx-4">
        <div class="p-4 border-b border-dark-100 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-white">Select AI Model</h2>
          <button @click="showAllModels = false" class="p-2 hover:bg-dark-200 rounded-lg transition">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4 overflow-y-auto max-h-[60vh]">
          <div class="grid gap-2">
            <button
              v-for="model in allModels"
              :key="model.id"
              @click="selectModel(model.id); showAllModels = false"
              :class="[
                'p-4 rounded-xl text-left transition',
                chatStore.currentModel === model.id 
                  ? 'bg-primary-600/20 border border-primary-600' 
                  : 'bg-dark-200 hover:bg-dark-100 border border-transparent'
              ]"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-white">{{ model.name }}</h3>
                  <p class="text-sm text-gray-400">{{ model.provider }}</p>
                </div>
                <span class="text-xs text-gray-500 max-w-[200px] text-right">{{ model.desc }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <UpgradeModal v-if="showUpgradeModal" @close="showUpgradeModal = false" />
  </div>
</template>
