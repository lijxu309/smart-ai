<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useChatStore } from '../stores/chat'
import { useUserStore } from '../stores/user'
import ChatSidebar from '../components/chat/ChatSidebar.vue'
import ChatMessage from '../components/chat/ChatMessage.vue'
import ChatInput from '../components/chat/ChatInput.vue'
import ModelSelector from '../components/chat/ModelSelector.vue'

const chatStore = useChatStore()
const userStore = useUserStore()

const messagesContainer = ref<HTMLElement | null>(null)
const isSidebarOpen = ref(true)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleSendMessage = async (content: string) => {
  if (!content.trim()) return

  // Add user message
  chatStore.addMessage('user', content)
  await scrollToBottom()

  // Simulate AI response (in real app, this would call the API)
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

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
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
    />

    <!-- Main Chat Area -->
    <div class="flex-1 flex flex-col">
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
          <ModelSelector />
        </div>
        
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-400">{{ userStore.userName }}</span>
          <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
            {{ userStore.userName.charAt(0).toUpperCase() }}
          </div>
        </div>
      </header>

      <!-- Messages -->
      <div 
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-4 space-y-4"
      >
        <template v-if="chatStore.currentMessages.length === 0">
          <div class="h-full flex flex-col items-center justify-center text-center">
            <div class="text-6xl mb-4">🤖</div>
            <h2 class="text-2xl font-bold text-white mb-2">Welcome to Smart AI</h2>
            <p class="text-gray-400 max-w-md">
              Start a conversation with AI. Ask questions, get help with tasks, or just chat!
            </p>
            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <button 
                @click="handleSendMessage('Explain quantum computing in simple terms')"
                class="p-4 bg-dark-300 hover:bg-dark-200 border border-dark-100 rounded-xl text-left transition"
              >
                <div class="text-white font-medium mb-1">Explain quantum computing</div>
                <div class="text-sm text-gray-400">in simple terms</div>
              </button>
              <button 
                @click="handleSendMessage('Write a creative story about a robot learning to paint')"
                class="p-4 bg-dark-300 hover:bg-dark-200 border border-dark-100 rounded-xl text-left transition"
              >
                <div class="text-white font-medium mb-1">Write a creative story</div>
                <div class="text-sm text-gray-400">about a robot learning to paint</div>
              </button>
              <button 
                @click="handleSendMessage('Help me brainstorm ideas for a mobile app')"
                class="p-4 bg-dark-300 hover:bg-dark-200 border border-dark-100 rounded-xl text-left transition"
              >
                <div class="text-white font-medium mb-1">Brainstorm ideas</div>
                <div class="text-sm text-gray-400">for a mobile app</div>
              </button>
              <button 
                @click="handleSendMessage('What are the best practices for learning a new programming language?')"
                class="p-4 bg-dark-300 hover:bg-dark-200 border border-dark-100 rounded-xl text-left transition"
              >
                <div class="text-white font-medium mb-1">Best practices</div>
                <div class="text-sm text-gray-400">for learning programming</div>
              </button>
            </div>
          </div>
        </template>
        
        <template v-else>
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
        </template>
      </div>

      <!-- Input -->
      <ChatInput @send="handleSendMessage" :disabled="chatStore.isLoading" />
    </div>
  </div>
</template>
