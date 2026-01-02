<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'

const activeTab = ref<'general' | 'api' | 'email' | 'security'>('general')

// General Settings
const generalSettings = ref({
  siteName: 'Smart AI',
  siteDescription: 'Advanced AI Chat Platform',
  supportEmail: 'support@smartai.com',
  maintenanceMode: false,
  allowRegistration: true,
  defaultLanguage: 'en',
  timezone: 'UTC',
})

// API Settings
const apiSettings = ref({
  openaiApiKey: 'sk-••••••••••••••••••••••••••••••••',
  openaiOrganization: 'org-••••••••••••••••',
  anthropicApiKey: '',
  googleApiKey: '',
  defaultModel: 'gpt-4',
  maxTokens: 4096,
  temperature: 0.7,
  rateLimitPerMinute: 60,
  rateLimitPerDay: 1000,
})

// Email Settings
const emailSettings = ref({
  provider: 'smtp',
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUser: 'noreply@smartai.com',
  smtpPassword: '••••••••••••',
  fromName: 'Smart AI',
  fromEmail: 'noreply@smartai.com',
  enableEmailVerification: true,
  enableWelcomeEmail: true,
})

// Security Settings
const securitySettings = ref({
  enableTwoFactor: false,
  sessionTimeout: 24,
  maxLoginAttempts: 5,
  lockoutDuration: 30,
  passwordMinLength: 8,
  requireSpecialChar: true,
  requireNumber: true,
  enableCaptcha: true,
  allowedDomains: '',
  blockedIPs: '',
})

const showApiKey = ref(false)
const isSaving = ref(false)

const saveSettings = async () => {
  isSaving.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  isSaving.value = false
  alert('Settings saved successfully!')
}

const testEmailConnection = async () => {
  alert('Email connection test successful!')
}

const models = ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet', 'gemini-pro']
const languages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
]
const timezones = ['UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai']
</script>

<template>
  <AdminLayout>
    <template #title>System Settings</template>

    <div class="space-y-6">
      <!-- Tabs -->
      <div class="flex space-x-1 bg-dark-300 rounded-lg p-1 w-fit">
        <button 
          @click="activeTab = 'general'"
          :class="['px-4 py-2 rounded-lg text-sm font-medium transition', activeTab === 'general' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white']"
        >
          General
        </button>
        <button 
          @click="activeTab = 'api'"
          :class="['px-4 py-2 rounded-lg text-sm font-medium transition', activeTab === 'api' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white']"
        >
          API Keys
        </button>
        <button 
          @click="activeTab = 'email'"
          :class="['px-4 py-2 rounded-lg text-sm font-medium transition', activeTab === 'email' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white']"
        >
          Email
        </button>
        <button 
          @click="activeTab = 'security'"
          :class="['px-4 py-2 rounded-lg text-sm font-medium transition', activeTab === 'security' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white']"
        >
          Security
        </button>
      </div>

      <!-- General Settings -->
      <div v-if="activeTab === 'general'" class="bg-dark-300 rounded-xl p-6 border border-dark-100 space-y-6">
        <h3 class="text-lg font-semibold text-white">General Settings</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Site Name</label>
            <input 
              v-model="generalSettings.siteName"
              type="text"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Support Email</label>
            <input 
              v-model="generalSettings.supportEmail"
              type="email"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-400 mb-1">Site Description</label>
            <textarea 
              v-model="generalSettings.siteDescription"
              rows="2"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 resize-none"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Default Language</label>
            <select 
              v-model="generalSettings.defaultLanguage"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            >
              <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                {{ lang.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Timezone</label>
            <select 
              v-model="generalSettings.timezone"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            >
              <option v-for="tz in timezones" :key="tz" :value="tz">{{ tz }}</option>
            </select>
          </div>
        </div>

        <div class="border-t border-dark-100 pt-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white font-medium">Maintenance Mode</p>
              <p class="text-sm text-gray-400">Temporarily disable the site for maintenance</p>
            </div>
            <button 
              @click="generalSettings.maintenanceMode = !generalSettings.maintenanceMode"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition',
                generalSettings.maintenanceMode ? 'bg-red-600' : 'bg-dark-100'
              ]"
            >
              <span 
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition',
                  generalSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-white font-medium">Allow Registration</p>
              <p class="text-sm text-gray-400">Allow new users to register</p>
            </div>
            <button 
              @click="generalSettings.allowRegistration = !generalSettings.allowRegistration"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition',
                generalSettings.allowRegistration ? 'bg-primary-600' : 'bg-dark-100'
              ]"
            >
              <span 
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition',
                  generalSettings.allowRegistration ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- API Settings -->
      <div v-if="activeTab === 'api'" class="bg-dark-300 rounded-xl p-6 border border-dark-100 space-y-6">
        <h3 class="text-lg font-semibold text-white">API Configuration</h3>
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">OpenAI API Key</label>
            <div class="relative">
              <input 
                v-model="apiSettings.openaiApiKey"
                :type="showApiKey ? 'text' : 'password'"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-primary-500 font-mono"
              />
              <button 
                @click="showApiKey = !showApiKey"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <svg v-if="showApiKey" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">OpenAI Organization ID</label>
            <input 
              v-model="apiSettings.openaiOrganization"
              type="text"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 font-mono"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Anthropic API Key</label>
              <input 
                v-model="apiSettings.anthropicApiKey"
                type="password"
                placeholder="sk-ant-..."
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 font-mono"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Google AI API Key</label>
              <input 
                v-model="apiSettings.googleApiKey"
                type="password"
                placeholder="AIza..."
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 font-mono"
              />
            </div>
          </div>

          <div class="border-t border-dark-100 pt-6">
            <h4 class="text-white font-medium mb-4">Default Model Settings</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Default Model</label>
                <select 
                  v-model="apiSettings.defaultModel"
                  class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                >
                  <option v-for="model in models" :key="model" :value="model">{{ model }}</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Max Tokens</label>
                <input 
                  v-model.number="apiSettings.maxTokens"
                  type="number"
                  class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Temperature</label>
                <input 
                  v-model.number="apiSettings.temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="2"
                  class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          <div class="border-t border-dark-100 pt-6">
            <h4 class="text-white font-medium mb-4">Rate Limiting</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Requests per Minute</label>
                <input 
                  v-model.number="apiSettings.rateLimitPerMinute"
                  type="number"
                  class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-400 mb-1">Requests per Day</label>
                <input 
                  v-model.number="apiSettings.rateLimitPerDay"
                  type="number"
                  class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Email Settings -->
      <div v-if="activeTab === 'email'" class="bg-dark-300 rounded-xl p-6 border border-dark-100 space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-white">Email Configuration</h3>
          <button 
            @click="testEmailConnection"
            class="px-4 py-2 bg-dark-400 hover:bg-dark-200 border border-dark-100 rounded-lg text-sm text-white transition"
          >
            Test Connection
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">SMTP Host</label>
            <input 
              v-model="emailSettings.smtpHost"
              type="text"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">SMTP Port</label>
            <input 
              v-model.number="emailSettings.smtpPort"
              type="number"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">SMTP Username</label>
            <input 
              v-model="emailSettings.smtpUser"
              type="text"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">SMTP Password</label>
            <input 
              v-model="emailSettings.smtpPassword"
              type="password"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">From Name</label>
            <input 
              v-model="emailSettings.fromName"
              type="text"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">From Email</label>
            <input 
              v-model="emailSettings.fromEmail"
              type="email"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <div class="border-t border-dark-100 pt-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white font-medium">Email Verification</p>
              <p class="text-sm text-gray-400">Require email verification for new users</p>
            </div>
            <button 
              @click="emailSettings.enableEmailVerification = !emailSettings.enableEmailVerification"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition',
                emailSettings.enableEmailVerification ? 'bg-primary-600' : 'bg-dark-100'
              ]"
            >
              <span 
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition',
                  emailSettings.enableEmailVerification ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-white font-medium">Welcome Email</p>
              <p class="text-sm text-gray-400">Send welcome email to new users</p>
            </div>
            <button 
              @click="emailSettings.enableWelcomeEmail = !emailSettings.enableWelcomeEmail"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition',
                emailSettings.enableWelcomeEmail ? 'bg-primary-600' : 'bg-dark-100'
              ]"
            >
              <span 
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition',
                  emailSettings.enableWelcomeEmail ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div v-if="activeTab === 'security'" class="bg-dark-300 rounded-xl p-6 border border-dark-100 space-y-6">
        <h3 class="text-lg font-semibold text-white">Security Settings</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-white font-medium">Two-Factor Authentication</p>
              <p class="text-sm text-gray-400">Require 2FA for admin accounts</p>
            </div>
            <button 
              @click="securitySettings.enableTwoFactor = !securitySettings.enableTwoFactor"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition',
                securitySettings.enableTwoFactor ? 'bg-primary-600' : 'bg-dark-100'
              ]"
            >
              <span 
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition',
                  securitySettings.enableTwoFactor ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-white font-medium">CAPTCHA</p>
              <p class="text-sm text-gray-400">Enable CAPTCHA for login and registration</p>
            </div>
            <button 
              @click="securitySettings.enableCaptcha = !securitySettings.enableCaptcha"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition',
                securitySettings.enableCaptcha ? 'bg-primary-600' : 'bg-dark-100'
              ]"
            >
              <span 
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition',
                  securitySettings.enableCaptcha ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
        </div>

        <div class="border-t border-dark-100 pt-6">
          <h4 class="text-white font-medium mb-4">Session & Login</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Session Timeout (hours)</label>
              <input 
                v-model.number="securitySettings.sessionTimeout"
                type="number"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Max Login Attempts</label>
              <input 
                v-model.number="securitySettings.maxLoginAttempts"
                type="number"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Lockout Duration (min)</label>
              <input 
                v-model.number="securitySettings.lockoutDuration"
                type="number"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div class="border-t border-dark-100 pt-6">
          <h4 class="text-white font-medium mb-4">Password Policy</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Minimum Length</label>
              <input 
                v-model.number="securitySettings.passwordMinLength"
                type="number"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <div class="flex items-center space-x-3">
              <input 
                type="checkbox" 
                v-model="securitySettings.requireSpecialChar"
                class="w-4 h-4 rounded border-dark-100 bg-dark-400 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-400">Require special character</span>
            </div>
            
            <div class="flex items-center space-x-3">
              <input 
                type="checkbox" 
                v-model="securitySettings.requireNumber"
                class="w-4 h-4 rounded border-dark-100 bg-dark-400 text-primary-600 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-400">Require number</span>
            </div>
          </div>
        </div>

        <div class="border-t border-dark-100 pt-6">
          <h4 class="text-white font-medium mb-4">IP & Domain Restrictions</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Allowed Domains (comma-separated)</label>
              <input 
                v-model="securitySettings.allowedDomains"
                type="text"
                placeholder="example.com, company.org"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Blocked IPs (comma-separated)</label>
              <input 
                v-model="securitySettings.blockedIPs"
                type="text"
                placeholder="192.168.1.1, 10.0.0.0/24"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end">
        <button 
          @click="saveSettings"
          :disabled="isSaving"
          class="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 rounded-lg text-white font-medium transition flex items-center space-x-2"
        >
          <svg v-if="isSaving" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>{{ isSaving ? 'Saving...' : 'Save Settings' }}</span>
        </button>
      </div>
    </div>
  </AdminLayout>
</template>
