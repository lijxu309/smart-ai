<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useChatStore } from '../../stores/chat'
import { useUserStore } from '../../stores/user'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  toggle: []
  newChat: []
}>()

const router = useRouter()
const chatStore = useChatStore()
const userStore = useUserStore()

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
    <nav class="px-3 space-y-1">
      <router-link 
        to="/chat"
        class="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-dark-200 rounded-lg transition"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span>Chat</span>
      </router-link>
      
      <router-link 
        to="/image-generator"
        class="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-dark-200 rounded-lg transition"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Image Generator</span>
      </router-link>

      <router-link 
        to="/assistants"
        class="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-dark-200 rounded-lg transition"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span>AI Assistants</span>
      </router-link>
    </nav>

    <!-- Chat History -->
    <div class="flex-1 overflow-y-auto px-3 mt-4">
      <h3 class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Recent Chats
      </h3>
      <div class="space-y-1">
        <button
          v-for="conversation in chatStore.conversations"
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

    <!-- Footer -->
    <div class="p-3 border-t border-dark-100 space-y-1">
      <router-link 
        to="/settings"
        class="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-dark-200 rounded-lg transition"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Settings</span>
      </router-link>
      
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
