<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import ChatSidebar from '../components/chat/ChatSidebar.vue'
import UpgradeModal from '../components/UpgradeModal.vue'

const router = useRouter()
const userStore = useUserStore()

const isSidebarOpen = ref(true)
const showUpgradeModal = ref(false)
const activeTab = ref('general')

// General Settings
const selectedModel = ref('gpt-5-nano')
const selectedLanguage = ref('en')
const selectedTheme = ref('dark')

// Speech Settings
const selectedVoice = ref('alloy')
const speechSpeed = ref(1.0)
const autoPlay = ref(false)

// Feature Request
const featureTitle = ref('')
const featureDescription = ref('')

const tabs = [
  { id: 'general', name: 'General Settings', icon: '⚙️' },
  { id: 'subscription', name: 'Subscription', icon: '💎' },
  { id: 'integrations', name: 'Integrations', icon: '🔗' },
  { id: 'speech', name: 'Speech', icon: '🔊' },
  { id: 'help', name: 'Help & Support', icon: '❓' },
  { id: 'feature', name: 'Request a Feature', icon: '💡' },
]

const models = [
  { id: 'gpt-5-nano', name: 'GPT-5 Nano', desc: 'Fast and efficient', pro: false },
  { id: 'gpt-5.2-instant', name: 'GPT-5.2 Instant', desc: 'Balanced performance', pro: false },
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', desc: "Google's advanced model", pro: false },
  { id: 'claude-4.5', name: 'Claude 4.5', desc: "Anthropic's latest", pro: false },
  { id: 'deepseek-v3.2', name: 'DeepSeek-v3.2', desc: 'Powerful reasoning', pro: false },
  { id: 'grok-4.1', name: 'Grok 4.1', desc: "xAI's flagship", pro: true },
  { id: 'gpt-5.2', name: 'GPT-5.2', desc: "OpenAI's newest", pro: true },
  { id: 'openai-o3', name: 'OpenAI o3', desc: 'Ultimate reasoning', pro: true },
]

const languages = [
  { id: 'en', name: 'English' },
  { id: 'zh', name: '中文' },
  { id: 'es', name: 'Español' },
  { id: 'fr', name: 'Français' },
  { id: 'de', name: 'Deutsch' },
  { id: 'ja', name: '日本語' },
  { id: 'ko', name: '한국어' },
  { id: 'pt', name: 'Português' },
  { id: 'ru', name: 'Русский' },
  { id: 'ar', name: 'العربية' },
]

const voices = [
  { id: 'alloy', name: 'Alloy', desc: 'Neutral and balanced' },
  { id: 'echo', name: 'Echo', desc: 'Warm and friendly' },
  { id: 'fable', name: 'Fable', desc: 'Expressive storyteller' },
  { id: 'onyx', name: 'Onyx', desc: 'Deep and authoritative' },
  { id: 'nova', name: 'Nova', desc: 'Energetic and bright' },
  { id: 'shimmer', name: 'Shimmer', desc: 'Soft and gentle' },
]

const integrations = ref([
  { id: 'google-drive', name: 'Google Drive', icon: '📁', connected: false, desc: 'Access your Google Drive files' },
  { id: 'dropbox', name: 'Dropbox', icon: '📦', connected: false, desc: 'Connect your Dropbox storage' },
  { id: 'notion', name: 'Notion', icon: '📝', connected: false, desc: 'Sync with your Notion workspace' },
  { id: 'slack', name: 'Slack', icon: '💬', connected: false, desc: 'Integrate with Slack channels' },
])

const helpItems = [
  { title: 'Getting Started Guide', desc: 'Learn the basics of using Smart AI', icon: '📖' },
  { title: 'FAQ', desc: 'Frequently asked questions', icon: '❓' },
  { title: 'Contact Support', desc: 'Get help from our team', icon: '📧' },
  { title: 'Report a Bug', desc: 'Help us improve by reporting issues', icon: '🐛' },
  { title: 'Community Forum', desc: 'Connect with other users', icon: '👥' },
  { title: 'Video Tutorials', desc: 'Watch step-by-step guides', icon: '🎬' },
]

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const selectModel = (modelId: string, isPro: boolean) => {
  if (isPro) {
    showUpgradeModal.value = true
  } else {
    selectedModel.value = modelId
  }
}

const handleLogout = async () => {
  await userStore.logout()
  router.push('/')
}

const submitFeatureRequest = () => {
  if (!featureTitle.value.trim() || !featureDescription.value.trim()) return
  alert('Feature request submitted! Thank you for your feedback.')
  featureTitle.value = ''
  featureDescription.value = ''
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
          <h1 class="text-lg font-semibold text-white">Settings</h1>
        </div>
      </header>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto">
        <div class="max-w-4xl mx-auto p-6">
          <!-- Tabs -->
          <div class="flex flex-wrap gap-2 mb-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-2',
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-300 text-gray-400 hover:bg-dark-200'
              ]"
            >
              <span>{{ tab.icon }}</span>
              <span>{{ tab.name }}</span>
            </button>
          </div>

          <!-- General Settings -->
          <div v-if="activeTab === 'general'" class="space-y-6">
            <!-- Default Model -->
            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h3 class="text-lg font-semibold text-white mb-4">Default AI Model</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  v-for="model in models"
                  :key="model.id"
                  @click="selectModel(model.id, model.pro)"
                  :class="[
                    'p-4 rounded-xl border text-left transition relative',
                    selectedModel === model.id
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-dark-100 hover:border-gray-600'
                  ]"
                >
                  <div v-if="model.pro" class="absolute top-2 right-2 px-2 py-0.5 bg-primary-600 rounded text-xs text-white">
                    PRO
                  </div>
                  <div class="font-medium text-white">{{ model.name }}</div>
                  <div class="text-sm text-gray-400">{{ model.desc }}</div>
                </button>
              </div>
            </div>

            <!-- Language -->
            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h3 class="text-lg font-semibold text-white mb-4">Language</h3>
              <select
                v-model="selectedLanguage"
                class="w-full md:w-64 bg-dark-400 border border-dark-100 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
              >
                <option v-for="lang in languages" :key="lang.id" :value="lang.id">
                  {{ lang.name }}
                </option>
              </select>
            </div>

            <!-- Theme -->
            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h3 class="text-lg font-semibold text-white mb-4">Theme</h3>
              <div class="flex gap-3">
                <button
                  @click="selectedTheme = 'dark'"
                  :class="[
                    'px-6 py-3 rounded-xl border transition',
                    selectedTheme === 'dark'
                      ? 'border-primary-500 bg-primary-500/20 text-white'
                      : 'border-dark-100 text-gray-400 hover:border-gray-600'
                  ]"
                >
                  🌙 Dark
                </button>
                <button
                  @click="selectedTheme = 'light'"
                  :class="[
                    'px-6 py-3 rounded-xl border transition',
                    selectedTheme === 'light'
                      ? 'border-primary-500 bg-primary-500/20 text-white'
                      : 'border-dark-100 text-gray-400 hover:border-gray-600'
                  ]"
                >
                  ☀️ Light
                </button>
                <button
                  @click="selectedTheme = 'system'"
                  :class="[
                    'px-6 py-3 rounded-xl border transition',
                    selectedTheme === 'system'
                      ? 'border-primary-500 bg-primary-500/20 text-white'
                      : 'border-dark-100 text-gray-400 hover:border-gray-600'
                  ]"
                >
                  💻 System
                </button>
              </div>
            </div>

            <!-- Sign Out -->
            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h3 class="text-lg font-semibold text-white mb-4">Account</h3>
              <button 
                @click="handleLogout"
                class="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-medium transition"
              >
                Sign Out
              </button>
            </div>
          </div>

          <!-- Subscription -->
          <div v-if="activeTab === 'subscription'" class="space-y-6">
            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h3 class="text-lg font-semibold text-white">Current Plan</h3>
                  <p class="text-gray-400">Free Plan</p>
                </div>
                <span class="px-3 py-1 bg-gray-600 rounded-full text-sm text-white">Free</span>
              </div>
              
              <div class="space-y-3 mb-6">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-400">Messages Used</span>
                  <span class="text-white">15 / 50</span>
                </div>
                <div class="w-full bg-dark-400 rounded-full h-2">
                  <div class="bg-primary-600 h-2 rounded-full" style="width: 30%"></div>
                </div>
              </div>

              <button 
                @click="showUpgradeModal = true"
                class="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 rounded-xl text-white font-semibold transition"
              >
                Upgrade to Pro
              </button>
            </div>

            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h3 class="text-lg font-semibold text-white mb-4">Pro Features</h3>
              <ul class="space-y-3">
                <li class="flex items-center space-x-3 text-gray-300">
                  <span class="text-green-500">✓</span>
                  <span>Unlimited messages</span>
                </li>
                <li class="flex items-center space-x-3 text-gray-300">
                  <span class="text-green-500">✓</span>
                  <span>Access to GPT-5.2, Gemini 3, Claude 4.5</span>
                </li>
                <li class="flex items-center space-x-3 text-gray-300">
                  <span class="text-green-500">✓</span>
                  <span>AI Image Generator</span>
                </li>
                <li class="flex items-center space-x-3 text-gray-300">
                  <span class="text-green-500">✓</span>
                  <span>Chat with PDF, Docs, Excel</span>
                </li>
                <li class="flex items-center space-x-3 text-gray-300">
                  <span class="text-green-500">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Integrations -->
          <div v-if="activeTab === 'integrations'" class="space-y-6">
            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h3 class="text-lg font-semibold text-white mb-4">Connected Services</h3>
              <div class="space-y-4">
                <div
                  v-for="integration in integrations"
                  :key="integration.id"
                  class="flex items-center justify-between p-4 bg-dark-400 rounded-xl"
                >
                  <div class="flex items-center space-x-4">
                    <span class="text-2xl">{{ integration.icon }}</span>
                    <div>
                      <div class="font-medium text-white">{{ integration.name }}</div>
                      <div class="text-sm text-gray-400">{{ integration.desc }}</div>
                    </div>
                  </div>
                  <button
                    :class="[
                      'px-4 py-2 rounded-lg text-sm font-medium transition',
                      integration.connected
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    ]"
                  >
                    {{ integration.connected ? 'Disconnect' : 'Connect' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Speech -->
          <div v-if="activeTab === 'speech'" class="space-y-6">
            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h3 class="text-lg font-semibold text-white mb-4">Voice Selection</h3>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  v-for="voice in voices"
                  :key="voice.id"
                  @click="selectedVoice = voice.id"
                  :class="[
                    'p-4 rounded-xl border text-left transition',
                    selectedVoice === voice.id
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-dark-100 hover:border-gray-600'
                  ]"
                >
                  <div class="font-medium text-white">{{ voice.name }}</div>
                  <div class="text-sm text-gray-400">{{ voice.desc }}</div>
                </button>
              </div>
            </div>

            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h3 class="text-lg font-semibold text-white mb-4">Speech Speed</h3>
              <div class="flex items-center space-x-4">
                <span class="text-gray-400">0.5x</span>
                <input
                  type="range"
                  v-model="speechSpeed"
                  min="0.5"
                  max="2"
                  step="0.1"
                  class="flex-1 h-2 bg-dark-400 rounded-lg appearance-none cursor-pointer"
                />
                <span class="text-gray-400">2x</span>
                <span class="text-white font-medium w-12 text-right">{{ speechSpeed }}x</span>
              </div>
            </div>

            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-white">Auto-play Responses</h3>
                  <p class="text-sm text-gray-400">Automatically read AI responses aloud</p>
                </div>
                <button
                  @click="autoPlay = !autoPlay"
                  :class="[
                    'w-12 h-6 rounded-full transition relative',
                    autoPlay ? 'bg-primary-600' : 'bg-dark-400'
                  ]"
                >
                  <span
                    :class="[
                      'absolute top-1 w-4 h-4 bg-white rounded-full transition',
                      autoPlay ? 'right-1' : 'left-1'
                    ]"
                  ></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Help & Support -->
          <div v-if="activeTab === 'help'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                v-for="item in helpItems"
                :key="item.title"
                class="bg-dark-300 rounded-2xl p-6 border border-dark-100 text-left hover:bg-dark-200 transition"
              >
                <span class="text-3xl mb-3 block">{{ item.icon }}</span>
                <h3 class="font-semibold text-white mb-1">{{ item.title }}</h3>
                <p class="text-sm text-gray-400">{{ item.desc }}</p>
              </button>
            </div>
          </div>

          <!-- Request a Feature -->
          <div v-if="activeTab === 'feature'" class="space-y-6">
            <div class="bg-dark-300 rounded-2xl p-6 border border-dark-100">
              <h3 class="text-lg font-semibold text-white mb-4">Submit a Feature Request</h3>
              <p class="text-gray-400 mb-6">Have an idea to improve Smart AI? We'd love to hear it!</p>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Feature Title</label>
                  <input
                    v-model="featureTitle"
                    type="text"
                    placeholder="Brief title for your feature idea"
                    class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    v-model="featureDescription"
                    rows="4"
                    placeholder="Describe your feature idea in detail..."
                    class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 resize-none"
                  ></textarea>
                </div>
                
                <button
                  @click="submitFeatureRequest"
                  :disabled="!featureTitle.trim() || !featureDescription.trim()"
                  class="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upgrade Modal -->
    <UpgradeModal v-if="showUpgradeModal" @close="showUpgradeModal = false" />
  </div>
</template>
