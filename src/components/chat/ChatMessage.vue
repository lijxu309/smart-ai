<script setup lang="ts">
import { computed } from 'vue'
import type { ChatMessage as MessageType } from '../../stores/chat'

const props = defineProps<{
  message: MessageType
}>()

const isUser = computed(() => props.message.role === 'user')

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div :class="['flex', isUser ? 'justify-end' : 'justify-start']">
    <div :class="['flex items-start space-x-3 max-w-3xl', isUser ? 'flex-row-reverse space-x-reverse' : '']">
      <!-- Avatar -->
      <div 
        :class="[
          'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0',
          isUser ? 'bg-primary-600' : 'bg-gradient-to-br from-purple-500 to-pink-500'
        ]"
      >
        <span v-if="isUser">👤</span>
        <span v-else>🤖</span>
      </div>

      <!-- Message Content -->
      <div 
        :class="[
          'rounded-2xl px-4 py-3',
          isUser 
            ? 'bg-primary-600 text-white' 
            : 'bg-dark-300 text-gray-100'
        ]"
      >
        <div class="whitespace-pre-wrap break-words">{{ message.content }}</div>
        <div 
          :class="[
            'text-xs mt-1',
            isUser ? 'text-primary-200' : 'text-gray-500'
          ]"
        >
          {{ formatTime(message.timestamp) }}
          <span v-if="message.model" class="ml-2">• {{ message.model }}</span>
        </div>
      </div>

      <!-- Actions (for assistant messages) -->
      <div v-if="!isUser" class="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition">
        <button class="p-1 hover:bg-dark-200 rounded transition" title="Copy">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        <button class="p-1 hover:bg-dark-200 rounded transition" title="Regenerate">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
