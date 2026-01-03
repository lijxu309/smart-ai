<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ChatSidebar from '../components/chat/ChatSidebar.vue'
import UpgradeModal from '../components/UpgradeModal.vue'

const router = useRouter()
const isSidebarOpen = ref(true)
const showUpgradeModal = ref(false)
const searchQuery = ref('')

const assistants = [
  { id: 'writer', name: 'Writer', description: 'Provides innovative writing ideas and drafts.', icon: '✍️', color: 'from-blue-500 to-blue-600' },
  { id: 'marketing', name: 'Marketing Assistant', description: 'Effective marketing strategies to elevate your brand.', icon: '📈', color: 'from-green-500 to-green-600' },
  { id: 'logo-designer', name: 'Logo Designer', description: 'Unique and memorable logos for your brand.', icon: '🎨', color: 'from-purple-500 to-purple-600' },
  { id: 'daily-planner', name: 'Daily Planner', description: 'Organizes daily schedules for maximum productivity.', icon: '📅', color: 'from-orange-500 to-orange-600' },
  { id: 'interviewer', name: 'Interviewer', description: 'Prepares you for interviews.', icon: '🎤', color: 'from-red-500 to-red-600' },
  { id: 'legal-assistant', name: 'Legal Assistant', description: 'Gives legal advice and document assistance.', icon: '⚖️', color: 'from-gray-500 to-gray-600' },
  { id: 'wellness-coach', name: 'Wellness & Therapy Coach', description: 'Guidance for your mental health and wellness.', icon: '🧘', color: 'from-teal-500 to-teal-600' },
  { id: 'business-planner', name: 'Business Planner', description: 'Strategic planning for your business growth.', icon: '💼', color: 'from-indigo-500 to-indigo-600' },
  { id: 'language-tutor', name: 'Language Tutor', description: 'Check, translate or practice for a new language.', icon: '🌍', color: 'from-cyan-500 to-cyan-600' },
  { id: 'travel-planner', name: 'Travel Planner', description: 'Plan your trips with me!', icon: '✈️', color: 'from-sky-500 to-sky-600' },
  { id: 'tattoo-artist', name: 'Tattoo Artist', description: 'Create some cool tattoo designs for you.', icon: '💉', color: 'from-pink-500 to-pink-600' },
  { id: 'homework-helper', name: 'Homework & Study Helper', description: 'Assists with academic tasks and questions.', icon: '📚', color: 'from-yellow-500 to-yellow-600' },
  { id: 'personal-trainer', name: 'Personal Trainer', description: 'Reach your fitness goals and stay healthy!', icon: '💪', color: 'from-rose-500 to-rose-600' },
  { id: 'news-reporter', name: 'News Reporter', description: 'Stay informed with the latest news and events.', icon: '📰', color: 'from-slate-500 to-slate-600' },
  { id: 'relationship-coach', name: 'Relationship Coach', description: 'Provides the best tips for your relationship!', icon: '❤️', color: 'from-red-400 to-pink-500' },
  { id: 'recipe-maker', name: 'Recipe Maker', description: 'Delicious recipe ideas and cooking tips.', icon: '👨‍🍳', color: 'from-amber-500 to-amber-600' },
  { id: 'financial-advisor', name: 'Financial Advisor', description: 'Manage your finances and plan for a future.', icon: '💰', color: 'from-emerald-500 to-emerald-600' },
  { id: 'research-assistant', name: 'Research Assistant', description: 'Assists with research projects and data analysis.', icon: '🔬', color: 'from-violet-500 to-violet-600' },
]

const filteredAssistants = computed(() => {
  if (!searchQuery.value.trim()) return assistants
  const query = searchQuery.value.toLowerCase()
  return assistants.filter(a => 
    a.name.toLowerCase().includes(query) || 
    a.description.toLowerCase().includes(query)
  )
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const selectAssistant = (assistantId: string) => {
  router.push({ path: '/chat', query: { assistant: assistantId } })
}
</script>

<template>
  <div class="h-screen flex bg-dark-400">
    <!-- Sidebar -->
    <ChatSidebar 
      :is-open="isSidebarOpen" 
      @toggle="toggleSidebar"
      @new-chat="router.push('/chat')"
      @show-upgrade="showUpgradeModal = true"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Header -->
      <header class="h-14 flex items-center justify-between px-4 border-b border-dark-100 bg-dark-300 shrink-0">
        <div class="flex items-center space-x-3">
          <button 
            v-if="!isSidebarOpen"
            @click="toggleSidebar"
            class="p-2 hover:bg-dark-200 rounded-lg transition"
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
          <!-- Title Section -->
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-white mb-2">AI Assistants</h2>
            <p class="text-gray-400">Choose a specialized AI assistant to help you with specific tasks.</p>
          </div>

          <!-- Search -->
          <div class="max-w-md mx-auto mb-8">
            <div class="relative">
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

          <!-- Assistants Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <button
              v-for="assistant in filteredAssistants"
              :key="assistant.id"
              @click="selectAssistant(assistant.id)"
              class="bg-dark-300 hover:bg-dark-200 border border-dark-100 rounded-2xl p-5 text-left transition group"
            >
              <!-- Icon -->
              <div 
                :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 bg-gradient-to-br',
                  assistant.color
                ]"
              >
                {{ assistant.icon }}
              </div>
              
              <!-- Name -->
              <h3 class="font-semibold text-white mb-2 group-hover:text-primary-400 transition">
                {{ assistant.name }}
              </h3>
              
              <!-- Description -->
              <p class="text-sm text-gray-400 line-clamp-2">
                {{ assistant.description }}
              </p>
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="filteredAssistants.length === 0" class="text-center py-12">
            <div class="text-4xl mb-4">🔍</div>
            <p class="text-gray-400">No assistants found matching "{{ searchQuery }}"</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <UpgradeModal v-if="showUpgradeModal" @close="showUpgradeModal = false" />
  </div>
</template>
