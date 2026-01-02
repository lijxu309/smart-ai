<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ChatSidebar from '../components/chat/ChatSidebar.vue'

const router = useRouter()
const isSidebarOpen = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('all')

const categories = [
  { id: 'all', name: 'All' },
  { id: 'writing', name: 'Writing' },
  { id: 'coding', name: 'Coding' },
  { id: 'business', name: 'Business' },
  { id: 'education', name: 'Education' },
  { id: 'creative', name: 'Creative' },
  { id: 'lifestyle', name: 'Lifestyle' },
]

const assistants = [
  {
    id: '1',
    name: 'Content Writer',
    description: 'Expert at creating engaging blog posts, articles, and marketing copy',
    avatar: '✍️',
    category: 'writing',
    isPopular: true,
  },
  {
    id: '2',
    name: 'Code Assistant',
    description: 'Helps with coding, debugging, and explaining programming concepts',
    avatar: '💻',
    category: 'coding',
    isPopular: true,
  },
  {
    id: '3',
    name: 'Business Analyst',
    description: 'Provides insights on business strategy, market analysis, and planning',
    avatar: '📊',
    category: 'business',
    isPopular: true,
  },
  {
    id: '4',
    name: 'Language Tutor',
    description: 'Helps you learn and practice new languages with conversations',
    avatar: '🌍',
    category: 'education',
    isPopular: false,
  },
  {
    id: '5',
    name: 'Creative Writer',
    description: 'Assists with fiction writing, storytelling, and creative projects',
    avatar: '📚',
    category: 'creative',
    isPopular: false,
  },
  {
    id: '6',
    name: 'Math Tutor',
    description: 'Explains mathematical concepts and helps solve problems step by step',
    avatar: '🔢',
    category: 'education',
    isPopular: false,
  },
  {
    id: '7',
    name: 'Recipe Chef',
    description: 'Suggests recipes, meal plans, and cooking tips based on your preferences',
    avatar: '👨‍🍳',
    category: 'lifestyle',
    isPopular: false,
  },
  {
    id: '8',
    name: 'Fitness Coach',
    description: 'Creates workout plans and provides fitness advice tailored to your goals',
    avatar: '💪',
    category: 'lifestyle',
    isPopular: false,
  },
  {
    id: '9',
    name: 'SEO Expert',
    description: 'Helps optimize content for search engines and improve rankings',
    avatar: '🔍',
    category: 'business',
    isPopular: false,
  },
  {
    id: '10',
    name: 'UI/UX Designer',
    description: 'Provides design feedback and suggestions for better user experiences',
    avatar: '🎨',
    category: 'creative',
    isPopular: false,
  },
  {
    id: '11',
    name: 'Data Scientist',
    description: 'Helps with data analysis, visualization, and machine learning concepts',
    avatar: '📈',
    category: 'coding',
    isPopular: false,
  },
  {
    id: '12',
    name: 'Legal Advisor',
    description: 'Provides general legal information and helps understand legal documents',
    avatar: '⚖️',
    category: 'business',
    isPopular: false,
  },
]

const filteredAssistants = () => {
  return assistants.filter(assistant => {
    const matchesCategory = selectedCategory.value === 'all' || assistant.category === selectedCategory.value
    const matchesSearch = assistant.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         assistant.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
}

const startChat = (assistantId: string) => {
  // In a real app, this would set the assistant context before navigating
  router.push('/chat')
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="h-screen flex bg-dark-400">
    <!-- Sidebar -->
    <ChatSidebar 
      :is-open="isSidebarOpen" 
      @toggle="toggleSidebar"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
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
          <h1 class="text-lg font-semibold text-white">AI Assistants</h1>
        </div>
      </header>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="max-w-6xl mx-auto">
          <!-- Search and Filter -->
          <div class="flex flex-col md:flex-row gap-4 mb-8">
            <div class="flex-1 relative">
              <svg class="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search assistants..."
                class="w-full pl-10 pr-4 py-3 bg-dark-300 border border-dark-100 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <!-- Categories -->
          <div class="flex flex-wrap gap-2 mb-8">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="selectedCategory = category.id"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition',
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-300 text-gray-400 hover:bg-dark-200'
              ]"
            >
              {{ category.name }}
            </button>
          </div>

          <!-- Popular Assistants -->
          <div v-if="selectedCategory === 'all'" class="mb-8">
            <h2 class="text-lg font-semibold text-white mb-4">Popular Assistants</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="assistant in assistants.filter(a => a.isPopular)"
                :key="assistant.id"
                @click="startChat(assistant.id)"
                class="p-4 bg-gradient-to-br from-primary-900/50 to-primary-700/30 border border-primary-500/30 rounded-2xl cursor-pointer hover:border-primary-500/50 transition"
              >
                <div class="text-4xl mb-3">{{ assistant.avatar }}</div>
                <h3 class="text-lg font-semibold text-white mb-1">{{ assistant.name }}</h3>
                <p class="text-sm text-gray-400">{{ assistant.description }}</p>
              </div>
            </div>
          </div>

          <!-- All Assistants -->
          <div>
            <h2 class="text-lg font-semibold text-white mb-4">
              {{ selectedCategory === 'all' ? 'All Assistants' : categories.find(c => c.id === selectedCategory)?.name }}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="assistant in filteredAssistants()"
                :key="assistant.id"
                @click="startChat(assistant.id)"
                class="p-4 bg-dark-300 border border-dark-100 rounded-2xl cursor-pointer hover:border-gray-600 transition group"
              >
                <div class="flex items-start space-x-3">
                  <div class="text-3xl">{{ assistant.avatar }}</div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-white group-hover:text-primary-400 transition">{{ assistant.name }}</h3>
                    <p class="text-sm text-gray-400 mt-1">{{ assistant.description }}</p>
                  </div>
                </div>
                <div class="mt-3 flex items-center justify-between">
                  <span class="text-xs text-gray-500 capitalize">{{ assistant.category }}</span>
                  <button class="text-primary-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                    Start Chat →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
