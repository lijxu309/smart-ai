<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'

interface Assistant {
  id: string
  name: string
  description: string
  category: string
  icon: string
  systemPrompt: string
  model: string
  isActive: boolean
  usageCount: number
  createdAt: string
}

const assistants = ref<Assistant[]>([
  { id: '1', name: 'Code Assistant', description: 'Expert programming helper for all languages', category: 'Development', icon: '💻', systemPrompt: 'You are an expert programmer...', model: 'gpt-4', isActive: true, usageCount: 45230, createdAt: '2025-10-01' },
  { id: '2', name: 'Writing Assistant', description: 'Professional content writer and editor', category: 'Writing', icon: '✍️', systemPrompt: 'You are a professional writer...', model: 'gpt-4', isActive: true, usageCount: 38920, createdAt: '2025-10-01' },
  { id: '3', name: 'Math Tutor', description: 'Step-by-step math problem solver', category: 'Education', icon: '🔢', systemPrompt: 'You are a patient math tutor...', model: 'gpt-4', isActive: true, usageCount: 28450, createdAt: '2025-10-15' },
  { id: '4', name: 'Language Translator', description: 'Accurate translations between languages', category: 'Language', icon: '🌍', systemPrompt: 'You are an expert translator...', model: 'gpt-3.5-turbo', isActive: true, usageCount: 22100, createdAt: '2025-11-01' },
  { id: '5', name: 'Business Analyst', description: 'Strategic business insights and analysis', category: 'Business', icon: '📊', systemPrompt: 'You are a business analyst...', model: 'gpt-4', isActive: true, usageCount: 15680, createdAt: '2025-11-15' },
  { id: '6', name: 'Creative Writer', description: 'Fiction and creative storytelling', category: 'Writing', icon: '📚', systemPrompt: 'You are a creative writer...', model: 'gpt-4', isActive: false, usageCount: 8920, createdAt: '2025-12-01' },
])

const categories = ['All', 'Development', 'Writing', 'Education', 'Language', 'Business', 'Lifestyle']
const models = ['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus', 'gemini-pro']

const selectedCategory = ref('All')
const searchQuery = ref('')
const showModal = ref(false)
const isEditing = ref(false)
const editingAssistant = ref<Assistant | null>(null)

const filteredAssistants = computed(() => {
  return assistants.value.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          a.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'All' || a.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

import { computed } from 'vue'

const openCreateModal = () => {
  isEditing.value = false
  editingAssistant.value = {
    id: '',
    name: '',
    description: '',
    category: 'Development',
    icon: '🤖',
    systemPrompt: '',
    model: 'gpt-4',
    isActive: true,
    usageCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
  }
  showModal.value = true
}

const openEditModal = (assistant: Assistant) => {
  isEditing.value = true
  editingAssistant.value = { ...assistant }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingAssistant.value = null
}

const saveAssistant = () => {
  if (!editingAssistant.value) return
  
  if (isEditing.value) {
    const index = assistants.value.findIndex(a => a.id === editingAssistant.value!.id)
    if (index > -1) {
      assistants.value[index] = { ...editingAssistant.value }
    }
  } else {
    editingAssistant.value.id = Date.now().toString()
    assistants.value.push({ ...editingAssistant.value })
  }
  closeModal()
}

const toggleActive = (assistant: Assistant) => {
  assistant.isActive = !assistant.isActive
}

const deleteAssistant = (id: string) => {
  if (confirm('Are you sure you want to delete this assistant?')) {
    assistants.value = assistants.value.filter(a => a.id !== id)
  }
}

const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

const emojiList = ['🤖', '💻', '✍️', '🔢', '🌍', '📊', '📚', '🎨', '🎵', '🏋️', '🍳', '🎮', '📱', '🔬', '⚖️', '💼']
</script>

<template>
  <AdminLayout>
    <template #title>AI Assistants</template>

    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search assistants..."
              class="w-full sm:w-64 bg-dark-300 border border-dark-100 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <button 
          @click="openCreateModal"
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white text-sm font-medium transition flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Create Assistant</span>
        </button>
      </div>

      <!-- Category Tabs -->
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="category in categories" 
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition',
            selectedCategory === category 
              ? 'bg-primary-600 text-white' 
              : 'bg-dark-300 text-gray-400 hover:text-white hover:bg-dark-200'
          ]"
        >
          {{ category }}
        </button>
      </div>

      <!-- Assistants Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="assistant in filteredAssistants" 
          :key="assistant.id"
          class="bg-dark-300 rounded-xl p-5 border border-dark-100 hover:border-dark-50 transition"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
              <span class="text-3xl">{{ assistant.icon }}</span>
              <div>
                <h3 class="font-semibold text-white">{{ assistant.name }}</h3>
                <span class="text-xs text-gray-500">{{ assistant.category }}</span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button 
                @click="toggleActive(assistant)"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition',
                  assistant.isActive ? 'bg-primary-600' : 'bg-dark-100'
                ]"
              >
                <span 
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition',
                    assistant.isActive ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>
          </div>

          <p class="text-sm text-gray-400 mb-4 line-clamp-2">{{ assistant.description }}</p>

          <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>Model: {{ assistant.model }}</span>
            <span>{{ formatNumber(assistant.usageCount) }} uses</span>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-dark-100">
            <span :class="['text-xs px-2 py-1 rounded-full', assistant.isActive ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-400/10']">
              {{ assistant.isActive ? 'Active' : 'Inactive' }}
            </span>
            <div class="flex items-center space-x-2">
              <button 
                @click="openEditModal(assistant)"
                class="p-1.5 hover:bg-dark-200 rounded-lg transition"
                title="Edit"
              >
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                @click="deleteAssistant(assistant.id)"
                class="p-1.5 hover:bg-dark-200 rounded-lg transition"
                title="Delete"
              >
                <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>
      <div class="relative bg-dark-300 rounded-2xl p-6 w-full max-w-lg mx-4 border border-dark-100 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-white mb-4">
          {{ isEditing ? 'Edit Assistant' : 'Create Assistant' }}
        </h3>
        
        <div v-if="editingAssistant" class="space-y-4">
          <!-- Icon Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Icon</label>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="emoji in emojiList" 
                :key="emoji"
                @click="editingAssistant.icon = emoji"
                :class="[
                  'w-10 h-10 rounded-lg text-xl flex items-center justify-center transition',
                  editingAssistant.icon === emoji ? 'bg-primary-600' : 'bg-dark-400 hover:bg-dark-200'
                ]"
              >
                {{ emoji }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <input 
              v-model="editingAssistant.name"
              type="text"
              placeholder="e.g., Code Assistant"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <input 
              v-model="editingAssistant.description"
              type="text"
              placeholder="Brief description of the assistant"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Category</label>
              <select 
                v-model="editingAssistant.category"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              >
                <option v-for="cat in categories.filter(c => c !== 'All')" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Model</label>
              <select 
                v-model="editingAssistant.model"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              >
                <option v-for="model in models" :key="model" :value="model">
                  {{ model }}
                </option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">System Prompt</label>
            <textarea 
              v-model="editingAssistant.systemPrompt"
              rows="5"
              placeholder="Enter the system prompt that defines the assistant's behavior..."
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 resize-none"
            ></textarea>
          </div>

          <div class="flex items-center space-x-3">
            <button 
              @click="editingAssistant.isActive = !editingAssistant.isActive"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition',
                editingAssistant.isActive ? 'bg-primary-600' : 'bg-dark-100'
              ]"
            >
              <span 
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition',
                  editingAssistant.isActive ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
            <span class="text-sm text-gray-400">Active</span>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button 
            @click="closeModal"
            class="px-4 py-2 bg-dark-400 hover:bg-dark-200 border border-dark-100 rounded-lg text-white transition"
          >
            Cancel
          </button>
          <button 
            @click="saveAssistant"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition"
          >
            {{ isEditing ? 'Save Changes' : 'Create Assistant' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
