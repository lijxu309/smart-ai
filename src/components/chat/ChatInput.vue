<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  send: [content: string]
}>()

const message = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const handleSubmit = () => {
  if (message.value.trim()) {
    emit('send', message.value)
    message.value = ''
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
}

const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 200) + 'px'
  }
}
</script>

<template>
  <div class="p-4 border-t border-dark-100 bg-dark-300">
    <div class="max-w-4xl mx-auto">
      <div class="relative flex items-end bg-dark-400 rounded-2xl border border-dark-100 focus-within:border-primary-500 transition">
        <!-- Attachment Button -->
        <button 
          class="p-3 text-gray-400 hover:text-white transition"
          title="Attach file"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <!-- Text Input -->
        <textarea
          ref="textareaRef"
          v-model="message"
          @keydown="handleKeydown"
          @input="autoResize"
          :disabled="disabled"
          placeholder="Type your message..."
          rows="1"
          class="flex-1 bg-transparent text-white placeholder-gray-500 py-3 px-2 resize-none focus:outline-none max-h-48 disabled:opacity-50"
        ></textarea>

        <!-- Voice Button -->
        <button 
          class="p-3 text-gray-400 hover:text-white transition"
          title="Voice input"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        <!-- Send Button -->
        <button 
          @click="handleSubmit"
          :disabled="disabled || !message.trim()"
          class="p-3 text-primary-500 hover:text-primary-400 disabled:text-gray-600 disabled:cursor-not-allowed transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      <p class="text-xs text-gray-500 text-center mt-2">
        Smart AI can make mistakes. Consider checking important information.
      </p>
    </div>
  </div>
</template>
