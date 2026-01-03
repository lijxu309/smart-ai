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

const showModelsDropdown = ref(true)
const showToolsDropdown = ref(true)
const historySearchQuery = ref('')

// AI Models - matching the screenshot
const aiModels = [
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', icon: '✦', color: 'text-blue-400' },
  { id: 'claude-4.5', name: 'Claude 4.5', icon: '✻', color: 'text-orange-400' },
  { id: 'gpt-5.2', name: 'GPT-5.2', icon: '◎', color: 'text-gray-300' },
  { id: 'perplexity', name: 'Perplexity', icon: '◉', color: 'text-teal-400' },
]

// AI Tools - matching the screenshot
const aiTools = [
  { id: 'image-generator', name: 'AI Image Generator', icon: '🎨', path: '/image-generator' },
  { id: 'search-engine', name: 'AI Search Engine', icon: '🔍', path: '/search-engine' },
  { id: 'assistants', name: 'AI Assistants', icon: '👤', path: '/assistants' },
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
  chatStore.setModel(modelId)
  router.push('/chat')
}
</script>

<template>
  <aside 
    :class="[
      'w-[260px] bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shrink-0',
      isOpen ? 'translate-x-0' : '-translate-x-full absolute lg:relative lg:translate-x-0 lg:w-0 lg:border-0 lg:overflow-hidden'
    ]"
    style="height: 100vh;"
  >
    <!-- Header with Logo -->
    <div class="h-14 flex items-center justify-between px-4 border-b border-gray-100">
      <router-link to="/" class="flex items-center space-x-2">
        <svg class="w-6 h-6 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        <span class="font-semibold text-gray-900">Chat & Ask AI</span>
      </router-link>
      <button 
        @click="emit('toggle')"
        class="p-1.5 hover:bg-gray-100 rounded-lg transition"
      >
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- New Chat -->
      <div class="px-3 pt-4">
        <button 
          @click="emit('newChat')"
          class="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition w-full"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span class="text-sm font-medium">New Chat</span>
        </button>
      </div>

      <!-- Explore AI Models -->
      <div class="px-3 pt-4">
        <button 
          @click="showModelsDropdown = !showModelsDropdown"
          class="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2"
        >
          <span>Explore AI Models</span>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
        <div v-if="showModelsDropdown" class="space-y-0.5 mt-1">
          <button 
            v-for="model in aiModels" 
            :key="model.id"
            @click="selectModel(model.id)"
            class="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm"
          >
            <span :class="model.color">{{ model.icon }}</span>
            <span>{{ model.name }}</span>
          </button>
        </div>
      </div>

      <!-- Explore AI Tools -->
      <div class="px-3 pt-4">
        <button 
          @click="showToolsDropdown = !showToolsDropdown"
          class="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2"
        >
          <span>Explore AI Tools</span>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
        <div v-if="showToolsDropdown" class="space-y-0.5 mt-1">
          <router-link 
            v-for="tool in aiTools" 
            :key="tool.id"
            :to="tool.path"
            :class="[
              'flex items-center space-x-3 px-3 py-2 rounded-lg transition text-sm',
              isActive(tool.path) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            <span>{{ tool.icon }}</span>
            <span>{{ tool.name }}</span>
          </router-link>
        </div>
      </div>

      <!-- Image Library -->
      <div class="px-3 pt-2">
        <router-link 
          to="/image-library"
          :class="[
            'flex items-center space-x-3 px-3 py-2 rounded-lg transition text-sm',
            isActive('/image-library') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          <span>🖼️</span>
          <span>Image Library</span>
        </router-link>
      </div>

      <!-- New Project -->
      <div class="px-3 pt-2">
        <button 
          class="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition text-sm"
        >
          <div class="flex items-center space-x-3">
            <span>📁</span>
            <span>New Project</span>
          </div>
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <!-- Chat History -->
      <div class="px-3 pt-4">
        <div class="flex items-center justify-between px-3 py-2">
          <div class="flex items-center space-x-2 text-gray-600 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Chat History</span>
          </div>
          <button class="p-1 hover:bg-gray-100 rounded transition">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="chatStore.conversations.length === 0" class="px-3 py-8 text-center">
          <div class="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p class="text-sm text-gray-400">You don't have any chat now</p>
        </div>

        <!-- Chat List -->
        <div v-else class="space-y-1 mt-2">
          <button
            v-for="conversation in chatStore.conversations.slice(0, 10)"
            :key="conversation.id"
            @click="chatStore.selectConversation(conversation.id)"
            :class="[
              'w-full text-left px-3 py-2 rounded-lg transition group text-sm',
              chatStore.currentConversationId === conversation.id
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="truncate">{{ conversation.title }}</span>
              <button
                @click.stop="chatStore.deleteConversation(conversation.id)"
                class="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition"
              >
                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer - Upgrade Button -->
    <div class="p-3 border-t border-gray-100">
      <button 
        @click="emit('showUpgrade')"
        class="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-full bg-gray-900 hover:bg-gray-800 text-white font-medium transition"
      >
        <span>Upgrade to Pro</span>
      </button>
    </div>
  </aside>
</template>
