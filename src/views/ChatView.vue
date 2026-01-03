<script setup lang="ts">
import { ref, onMounted, nextTick, computed, watch } from 'vue'
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

// Models matching the screenshot exactly
const quickModels = [
  { id: 'gpt-4.1-nano', name: 'GPT-5 Nano', icon: '◎', color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  { id: 'gpt-4.1-mini', name: 'GPT-5.2 Instant', icon: '◎', color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
  { id: 'gemini-2.5-flash', name: 'Gemini 3 Pro', icon: '✦', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { id: 'claude-4.5', name: 'Claude 4.5', icon: '✻', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  { id: 'deepseek-v3.2', name: 'DeepSeek-v3.2', icon: '◉', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
]

const allModels = [
  { id: 'gpt-4.1-nano', name: 'GPT-5 Nano', provider: 'OpenAI', desc: "Fast and efficient for everyday tasks" },
  { id: 'gpt-4.1-mini', name: 'GPT-5.2 Instant', provider: 'OpenAI', desc: "Balanced speed and quality" },
  { id: 'gemini-2.5-flash', name: 'Gemini 3 Pro', provider: 'Google', desc: "Powerful multimodal capabilities" },
  { id: 'grok-4.1', name: 'Grok 4.1', provider: 'xAI', desc: "xAI's most advanced reasoning model" },
  { id: 'grok-4', name: 'Grok 4', provider: 'xAI', desc: "xAI's powerful reasoning model" },
  { id: 'openai-o3', name: 'OpenAI o3', provider: 'OpenAI', desc: "OpenAI's ultimate reasoning model" },
  { id: 'perplexity', name: 'Perplexity', provider: 'Perplexity', desc: "Perplexity's cutting-edge AI model" },
  { id: 'llama-3', name: 'Llama 3', provider: 'Meta', desc: "Meta's latest language model" },
]

const characterCount = computed(() => messageInput.value.length)
const maxCharacters = 10000

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 监听消息变化，自动滚动到底部
watch(() => chatStore.currentMessages.length, () => {
  scrollToBottom()
})

// 监听流式内容变化，自动滚动
watch(() => chatStore.streamingContent, () => {
  scrollToBottom()
})

const handleSendMessage = async () => {
  const content = messageInput.value.trim()
  if (!content || chatStore.isLoading) return

  messageInput.value = ''
  
  // 使用 store 的 sendMessage 方法，它会处理 AI 响应
  await chatStore.sendMessage(content)
  await scrollToBottom()
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
  chatStore.setModel(modelId)
}

const goToImageGenerator = () => {
  router.push('/image-generator')
}

const startDeepResearch = () => {
  showUpgradeModal.value = true
}

const regenerateResponse = () => {
  chatStore.regenerateLastResponse()
}

onMounted(() => {
  chatStore.loadFromLocalStorage()
  if (chatStore.conversations.length === 0) {
    chatStore.createConversation()
  }
})
</script>

<template>
  <div class="h-screen flex bg-white">
    <!-- Sidebar -->
    <ChatSidebar 
      :is-open="isSidebarOpen" 
      @toggle="toggleSidebar"
      @new-chat="chatStore.createConversation()"
      @show-upgrade="showUpgradeModal = true"
    />

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col min-w-0 bg-white">
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
        </div>
        
        <div class="flex items-center space-x-3">
          <button class="flex items-center space-x-2 px-3 py-1.5 border border-gray-200 rounded-full text-sm text-gray-500 hover:bg-gray-50 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Temporary</span>
          </button>
          <div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white text-sm font-medium">
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
            <!-- Logo -->
            <div class="mb-6">
              <svg class="w-16 h-16 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            
            <h2 class="text-2xl font-semibold text-gray-900 mb-8">How can I help you today?</h2>
            
            <!-- Quick Model Selection - matching screenshot -->
            <div class="flex flex-wrap items-center justify-center gap-2 mb-8">
              <button
                v-for="model in quickModels"
                :key="model.id"
                @click="selectModel(model.id)"
                :class="[
                  'px-4 py-2 rounded-full text-sm flex items-center space-x-2 transition border font-medium',
                  chatStore.selectedModel === model.id 
                    ? `${model.bgColor} ${model.borderColor} ${model.color}` 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                ]"
              >
                <span :class="chatStore.selectedModel === model.id ? model.color : 'text-gray-400'">{{ model.icon }}</span>
                <span>{{ model.name }}</span>
              </button>
              <button
                @click="showAllModels = true"
                class="p-2 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <!-- Input Area -->
            <div class="w-full max-w-3xl">
              <div class="border border-gray-200 rounded-2xl bg-white shadow-sm">
                <textarea
                  v-model="messageInput"
                  @keydown="handleKeydown"
                  placeholder="Write your message"
                  rows="3"
                  class="w-full px-4 py-4 bg-transparent resize-none focus:outline-none text-gray-900 placeholder-gray-400"
                ></textarea>
                
                <!-- Bottom toolbar -->
                <div class="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <div class="flex items-center space-x-2">
                    <!-- Attachment -->
                    <button class="p-2 hover:bg-gray-100 rounded-lg transition">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    
                    <!-- Create Image -->
                    <button 
                      @click="goToImageGenerator"
                      class="flex items-center space-x-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Create Image</span>
                    </button>
                    
                    <!-- Deep Research -->
                    <button 
                      @click="startDeepResearch"
                      class="flex items-center space-x-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>Deep Research</span>
                    </button>
                  </div>
                  
                  <div class="flex items-center space-x-3">
                    <!-- Character count -->
                    <span class="text-sm text-gray-400">{{ characterCount }}/{{ maxCharacters }}</span>
                    
                    <!-- Voice input -->
                    <button class="p-2 hover:bg-gray-100 rounded-lg transition">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                    
                    <!-- Send button -->
                    <button
                      @click="handleSendMessage"
                      :disabled="!messageInput.trim() || chatStore.isLoading"
                      :class="[
                        'p-2.5 rounded-full transition',
                        messageInput.trim() && !chatStore.isLoading
                          ? 'bg-gray-900 hover:bg-gray-800 text-white'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      ]"
                    >
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        
        <!-- Messages List -->
        <template v-else>
          <div class="max-w-3xl mx-auto p-4 space-y-4">
            <ChatMessage 
              v-for="message in chatStore.currentMessages" 
              :key="message.id"
              :message="message"
            />
            
            <!-- Error message -->
            <div v-if="chatStore.error" class="flex items-center justify-center">
              <div class="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ chatStore.error }}</span>
                <button @click="chatStore.clearError()" class="ml-2 text-red-400 hover:text-red-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Loading indicator with streaming content -->
            <div v-if="chatStore.isLoading" class="flex items-start space-x-3">
              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div class="bg-gray-100 rounded-2xl px-4 py-3 max-w-[80%]">
                <template v-if="chatStore.streamingContent">
                  <p class="text-gray-800 whitespace-pre-wrap">{{ chatStore.streamingContent }}</p>
                  <span class="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1"></span>
                </template>
                <template v-else>
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                  </div>
                </template>
              </div>
            </div>

            <!-- Regenerate button -->
            <div v-if="!chatStore.isLoading && chatStore.currentMessages.length > 1" class="flex justify-center">
              <button 
                @click="regenerateResponse"
                class="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Regenerate response</span>
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Input Area (when there are messages) -->
      <div v-if="chatStore.currentMessages.length > 0" class="border-t border-gray-100 p-4">
        <div class="max-w-3xl mx-auto">
          <div class="border border-gray-200 rounded-2xl bg-white">
            <textarea
              v-model="messageInput"
              @keydown="handleKeydown"
              placeholder="Write your message"
              rows="2"
              :disabled="chatStore.isLoading"
              class="w-full px-4 py-3 bg-transparent resize-none focus:outline-none text-gray-900 placeholder-gray-400 disabled:opacity-50"
            ></textarea>
            
            <div class="flex items-center justify-between px-4 py-2 border-t border-gray-100">
              <div class="flex items-center space-x-2">
                <button class="p-1.5 hover:bg-gray-100 rounded-lg transition">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <button 
                  @click="goToImageGenerator"
                  class="flex items-center space-x-1 px-2 py-1 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Create Image</span>
                </button>
                <button 
                  @click="startDeepResearch"
                  class="flex items-center space-x-1 px-2 py-1 border border-gray-200 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>Deep Research</span>
                </button>
              </div>
              
              <div class="flex items-center space-x-2">
                <span class="text-xs text-gray-400">{{ characterCount }}/{{ maxCharacters }}</span>
                <button class="p-1.5 hover:bg-gray-100 rounded-lg transition">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
                <button
                  @click="handleSendMessage"
                  :disabled="!messageInput.trim() || chatStore.isLoading"
                  :class="[
                    'p-2 rounded-full transition',
                    messageInput.trim() && !chatStore.isLoading
                      ? 'bg-gray-900 hover:bg-gray-800 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  ]"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
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
      <div class="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden mx-4 shadow-xl">
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">Select AI Model</h2>
          <button @click="showAllModels = false" class="p-2 hover:bg-gray-100 rounded-lg transition">
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
                'p-4 rounded-xl text-left transition border',
                chatStore.selectedModel === model.id 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-gray-50 hover:bg-gray-100 border-transparent'
              ]"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-gray-900">{{ model.name }}</h3>
                  <p class="text-sm text-gray-500">{{ model.provider }}</p>
                </div>
                <span class="text-xs text-gray-400 max-w-[200px] text-right">{{ model.desc }}</span>
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
