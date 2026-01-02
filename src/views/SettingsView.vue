<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import ChatSidebar from '../components/chat/ChatSidebar.vue'

const router = useRouter()
const userStore = useUserStore()

const isSidebarOpen = ref(true)
const activeTab = ref('general')

const tabs = [
  { id: 'general', name: 'General', icon: '⚙️' },
  { id: 'subscription', name: 'Subscription', icon: '💳' },
  { id: 'speech', name: 'Speech', icon: '🔊' },
  { id: 'integrations', name: 'Integrations', icon: '🔗' },
  { id: 'help', name: 'Help & Support', icon: '❓' },
]

// Settings state
const settings = ref({
  theme: 'dark',
  language: 'en',
  defaultModel: 'gpt-4',
  notifications: true,
  speechVoice: 'alloy',
  speechRate: 1.0,
})

const voices = [
  { id: 'alloy', name: 'Alloy' },
  { id: 'echo', name: 'Echo' },
  { id: 'fable', name: 'Fable' },
  { id: 'onyx', name: 'Onyx' },
  { id: 'nova', name: 'Nova' },
  { id: 'shimmer', name: 'Shimmer' },
]

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleLogout = async () => {
  await userStore.logout()
  router.push('/')
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
          <h1 class="text-lg font-semibold text-white">Settings</h1>
        </div>
      </header>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-4xl mx-auto p-6">
          <!-- Tabs -->
          <div class="flex flex-wrap gap-2 mb-8 border-b border-dark-100 pb-4">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex items-center space-x-2 px-4 py-2 rounded-lg transition',
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:bg-dark-300'
              ]"
            >
              <span>{{ tab.icon }}</span>
              <span>{{ tab.name }}</span>
            </button>
          </div>

          <!-- General Settings -->
          <div v-if="activeTab === 'general'" class="space-y-6">
            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h2 class="text-lg font-semibold text-white mb-4">Appearance</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Theme</label>
                  <select
                    v-model="settings.theme"
                    class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Language</label>
                  <select
                    v-model="settings.language"
                    class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h2 class="text-lg font-semibold text-white mb-4">Default Model</h2>
              
              <select
                v-model="settings.defaultModel"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                <option value="gemini-pro">Gemini Pro</option>
              </select>
            </div>

            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h2 class="text-lg font-semibold text-white mb-4">Notifications</h2>
              
              <label class="flex items-center justify-between cursor-pointer">
                <span class="text-gray-300">Enable notifications</span>
                <div class="relative">
                  <input type="checkbox" v-model="settings.notifications" class="sr-only" />
                  <div :class="['w-11 h-6 rounded-full transition', settings.notifications ? 'bg-primary-600' : 'bg-dark-100']"></div>
                  <div :class="['absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition', settings.notifications ? 'translate-x-5' : '']"></div>
                </div>
              </label>
            </div>
          </div>

          <!-- Subscription -->
          <div v-if="activeTab === 'subscription'" class="space-y-6">
            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h2 class="text-lg font-semibold text-white mb-4">Current Plan</h2>
              
              <div class="flex items-center justify-between p-4 bg-dark-400 rounded-xl">
                <div>
                  <div class="text-xl font-bold text-white">Free Plan</div>
                  <div class="text-sm text-gray-400">100 messages per month</div>
                </div>
                <router-link 
                  to="/pricing"
                  class="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white font-medium transition"
                >
                  Upgrade
                </router-link>
              </div>
            </div>

            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h2 class="text-lg font-semibold text-white mb-4">Usage</h2>
              
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-400">Messages</span>
                    <span class="text-white">45 / 100</span>
                  </div>
                  <div class="h-2 bg-dark-400 rounded-full overflow-hidden">
                    <div class="h-full bg-primary-600 rounded-full" style="width: 45%"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="text-gray-400">Image Generations</span>
                    <span class="text-white">8 / 10</span>
                  </div>
                  <div class="h-2 bg-dark-400 rounded-full overflow-hidden">
                    <div class="h-full bg-primary-600 rounded-full" style="width: 80%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Speech -->
          <div v-if="activeTab === 'speech'" class="space-y-6">
            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h2 class="text-lg font-semibold text-white mb-4">Voice Settings</h2>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Voice</label>
                  <select
                    v-model="settings.speechVoice"
                    class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                  >
                    <option v-for="voice in voices" :key="voice.id" :value="voice.id">
                      {{ voice.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">
                    Speech Rate: {{ settings.speechRate }}x
                  </label>
                  <input
                    type="range"
                    v-model="settings.speechRate"
                    min="0.5"
                    max="2"
                    step="0.1"
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Integrations -->
          <div v-if="activeTab === 'integrations'" class="space-y-6">
            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h2 class="text-lg font-semibold text-white mb-4">Connected Services</h2>
              
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-dark-400 rounded-xl">
                  <div class="flex items-center space-x-3">
                    <div class="text-2xl">📁</div>
                    <div>
                      <div class="font-medium text-white">Google Drive</div>
                      <div class="text-sm text-gray-400">Access your files</div>
                    </div>
                  </div>
                  <button class="px-4 py-2 border border-dark-100 hover:border-primary-500 rounded-lg text-white transition">
                    Connect
                  </button>
                </div>

                <div class="flex items-center justify-between p-4 bg-dark-400 rounded-xl">
                  <div class="flex items-center space-x-3">
                    <div class="text-2xl">📝</div>
                    <div>
                      <div class="font-medium text-white">Notion</div>
                      <div class="text-sm text-gray-400">Sync your notes</div>
                    </div>
                  </div>
                  <button class="px-4 py-2 border border-dark-100 hover:border-primary-500 rounded-lg text-white transition">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Help & Support -->
          <div v-if="activeTab === 'help'" class="space-y-6">
            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h2 class="text-lg font-semibold text-white mb-4">Help & Support</h2>
              
              <div class="space-y-3">
                <a href="#" class="flex items-center justify-between p-4 bg-dark-400 rounded-xl hover:bg-dark-200 transition">
                  <div class="flex items-center space-x-3">
                    <span class="text-xl">📚</span>
                    <span class="text-white">Documentation</span>
                  </div>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>

                <a href="#" class="flex items-center justify-between p-4 bg-dark-400 rounded-xl hover:bg-dark-200 transition">
                  <div class="flex items-center space-x-3">
                    <span class="text-xl">💬</span>
                    <span class="text-white">Contact Support</span>
                  </div>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>

                <a href="#" class="flex items-center justify-between p-4 bg-dark-400 rounded-xl hover:bg-dark-200 transition">
                  <div class="flex items-center space-x-3">
                    <span class="text-xl">💡</span>
                    <span class="text-white">Request a Feature</span>
                  </div>
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>

            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h2 class="text-lg font-semibold text-white mb-4">Account</h2>
              
              <button 
                @click="handleLogout"
                class="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
