<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useChatStore } from '../../stores/chat'
import { useUserStore } from '../../stores/user'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  toggle: []
  newChat: []
  showUpgrade: []
}>()

const router = useRouter()
const route = useRoute()
const chatStore = useChatStore()
const userStore = useUserStore()

const showModelsDropdown = ref(false)
const showToolsDropdown = ref(false)

const aiModels = [
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', icon: '✨' },
  { id: 'claude-4.5', name: 'Claude 4.5', icon: '🌸' },
  { id: 'gpt-5.2', name: 'GPT-5.2', icon: '🤖' },
  { id: 'perplexity', name: 'Perplexity', icon: '🔍' },
]

const aiTools = [
  { id: 'image-generator', name: 'AI Image Generator', icon: '🎨', path: '/image-generator' },
  { id: 'search-engine', name: 'AI Search Engine', icon: '🔎', path: '/search' },
  { id: 'assistants', name: 'AI Assistants', icon: '🤖', path: '/assistants' },
]

const handleLogout = async () => {
  await userStore.logout()
  router.push('/')
}

const formatDate = (date: Date) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return d.toLocaleDateString()
}

const isActive = (path: string) => route.path === path

const selectModel = (modelId: string) => {
  chatStore.setCurrentModel(modelId)
  showModelsDropdown.value = false
  router.push('/chat')
}
</script>

<template>
  <aside 
    :class="[
      'w-64 bg-dark-300 border-r border-dark-100 flex flex-col transition-all duration-300',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-0'
    ]"
  >
    <!-- Header -->
    <div class="h-14 flex items-center justify-between px-4 border-b border-dark-100">
      <router-link to="/" class="flex items-center space-x-2">
        <span class="text-xl">🤖</span>
        <span class="font-bold text-white">Smart AI</span>
      </router-link>
      <button 
        @click="emit('toggle')"
        class="p-1 hover:bg-dark-200 rounded transition"
      >
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
      </button>
    </div>

    <!-- New Chat Button -->
    <div class="p-3">
      <button 
        @click="emit('newChat')"
        class="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 rounded-lg text-white font-medium flex items-center justify-center space-x-2 transition"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>New Chat</span>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="px-3 space-y-1 overflow-y-auto flex-1">
      <!-- Explore AI Models -->
      <div>
        <button 
          @click="showModelsDropdown = !showModelsDropdown"
          class="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-dark-200 rounded-lg transition"
        >
          <div class="flex items-center space-x-3">
            <span class="text-lg">🧠</span>
            <span>Explore AI Models</span>
          </div>
          <svg 
            class="w-4 h-4 transition-transform" 
            :class="{ 'rotate-180': showModelsDropdown }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="showModelsDropdown" class="ml-6 mt-1 space-y-1">
          <button 
            v-for="model in aiModels" 
            :key="model.id"
            @click="selectModel(model.id)"
            class="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-dark-200 hover:text-white transition text-sm"
          >
            <span>{{ model.icon }}</span>
            <span>{{ model.name }}</span>
          </button>
        </div>
      </div>

      <!-- Explore AI Tools -->
      <div>
        <button 
          @click="showToolsDropdown = !showToolsDropdown"
          class="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-dark-200 rounded-lg transition"
        >
          <div class="flex items-center space-x-3">
            <span class="text-lg">🛠️</span>
            <span>Explore AI Tools</span>
          </div>
          <svg 
            class="w-4 h-4 transition-transform" 
            :class="{ 'rotate-180': showToolsDropdown }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="showToolsDropdown" class="ml-6 mt-1 space-y-1">
          <router-link 
            v-for="tool in aiTools" 
            :key="tool.id"
            :to="tool.path"
            :class="[
              'flex items-center space-x-3 px-3 py-2 rounded-lg transition text-sm',
              isActive(tool.path) ? 'bg-dark-200 text-white' : 'text-gray-400 hover:bg-dark-200 hover:text-white'
            ]"
          >
            <span>{{ tool.icon }}</span>
            <span>{{ tool.name }}</span>
          </router-link>
        </div>
      </div>

      <!-- Image Library -->
      <router-link 
        to="/image-library"
        :class="[
          'flex items-center space-x-3 px-3 py-2 rounded-lg transition',
          isActive('/image-library') ? 'bg-dark-200 text-white' : 'text-gray-300 hover:bg-dark-200 hover:text-white'
        ]"
      >
        <span class="text-lg">🖼️</span>
        <span>Image Library</span>
      </router-link>

      <!-- New Project -->
      <router-link 
        to="/projects"
        :class="[
          'flex items-center space-x-3 px-3 py-2 rounded-lg transition',
          isActive('/projects') ? 'bg-dark-200 text-white' : 'text-gray-300 hover:bg-dark-200 hover:text-white'
        ]"
      >
        <span class="text-lg">📁</span>
        <span>New Project</span>
      </router-link>

      <!-- Chat History -->
      <router-link 
        to="/chat-history"
        :class="[
          'flex items-center space-x-3 px-3 py-2 rounded-lg transition',
          isActive('/chat-history') ? 'bg-dark-200 text-white' : 'text-gray-300 hover:bg-dark-200 hover:text-white'
        ]"
      >
        <span class="text-lg">💬</span>
        <span>Chat History</span>
      </router-link>

      <!-- Divider -->
      <div class="border-t border-dark-100 my-3"></div>

      <!-- Recent Chats -->
      <div v-if="chatStore.conversations.length > 0">
        <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Recent Chats
        </h3>
        <div class="space-y-1">
          <button
            v-for="conversation in chatStore.conversations.slice(0, 5)"
            :key="conversation.id"
            @click="chatStore.selectConversation(conversation.id)"
            :class="[
              'w-full text-left px-3 py-2 rounded-lg transition group',
              chatStore.currentConversationId === conversation.id
                ? 'bg-dark-200 text-white'
                : 'text-gray-400 hover:bg-dark-200 hover:text-white'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="truncate text-sm">{{ conversation.title }}</span>
              <button
                @click.stop="chatStore.deleteConversation(conversation.id)"
                class="opacity-0 group-hover:opacity-100 p-1 hover:bg-dark-100 rounded transition"
              >
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <span class="text-xs text-gray-500">{{ formatDate(conversation.updatedAt) }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Footer -->
    <div class="p-3 border-t border-dark-100 space-y-2">
      <!-- Upgrade to Pro -->
      <button 
        @click="emit('showUpgrade')"
        class="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium transition"
      >
        <span>👑</span>
        <span>Upgrade to Pro</span>
      </button>

      <!-- Settings -->
      <router-link 
        to="/settings"
        :class="[
          'flex items-center space-x-3 px-3 py-2 rounded-lg transition',
          isActive('/settings') ? 'bg-dark-200 text-white' : 'text-gray-300 hover:bg-dark-200 hover:text-white'
        ]"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Settings</span>
      </router-link>
      
      <!-- Logout -->
      <button 
        @click="handleLogout"
        class="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-dark-200 rounded-lg transition"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>
