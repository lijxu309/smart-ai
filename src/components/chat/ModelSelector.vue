<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '../../stores/chat'

const chatStore = useChatStore()
const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectModel = (modelId: string) => {
  chatStore.setModel(modelId)
  isOpen.value = false
}

const currentModel = () => {
  return chatStore.availableModels.find(m => m.id === chatStore.selectedModel)
}
</script>

<template>
  <div class="relative">
    <button 
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-3 py-1.5 bg-dark-400 hover:bg-dark-200 border border-dark-100 rounded-lg transition"
    >
      <span class="text-sm text-white">{{ currentModel()?.name || 'Select Model' }}</span>
      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown -->
    <div 
      v-if="isOpen"
      class="absolute top-full left-0 mt-2 w-64 bg-dark-300 border border-dark-100 rounded-xl shadow-xl z-50 overflow-hidden"
    >
      <div class="p-2">
        <div 
          v-for="model in chatStore.availableModels" 
          :key="model.id"
          @click="selectModel(model.id)"
          :class="[
            'flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition',
            chatStore.selectedModel === model.id 
              ? 'bg-primary-600/20 text-primary-400' 
              : 'hover:bg-dark-200 text-white'
          ]"
        >
          <div>
            <div class="font-medium">{{ model.name }}</div>
            <div class="text-xs text-gray-500">{{ model.provider }}</div>
          </div>
          <svg 
            v-if="chatStore.selectedModel === model.id"
            class="w-5 h-5 text-primary-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div 
      v-if="isOpen"
      @click="isOpen = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>
