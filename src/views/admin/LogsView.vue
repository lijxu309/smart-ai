<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'

interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'debug'
  service: string
  message: string
  details?: string
  userId?: string
}

const logs = ref<LogEntry[]>([
  { id: '1', timestamp: '2026-01-03 14:32:15', level: 'info', service: 'auth', message: 'User login successful', details: 'IP: 192.168.1.100', userId: 'user_123' },
  { id: '2', timestamp: '2026-01-03 14:31:42', level: 'error', service: 'api', message: 'OpenAI API rate limit exceeded', details: 'Error code: 429, Retry after: 60s' },
  { id: '3', timestamp: '2026-01-03 14:30:28', level: 'warning', service: 'payment', message: 'Payment retry scheduled', details: 'Subscription: sub_456, Attempt: 2/3', userId: 'user_789' },
  { id: '4', timestamp: '2026-01-03 14:29:55', level: 'info', service: 'chat', message: 'Chat completion successful', details: 'Model: gpt-4, Tokens: 1250', userId: 'user_123' },
  { id: '5', timestamp: '2026-01-03 14:28:10', level: 'debug', service: 'storage', message: 'Image uploaded to storage', details: 'Size: 2.4MB, Path: /users/user_456/images/', userId: 'user_456' },
  { id: '6', timestamp: '2026-01-03 14:27:33', level: 'error', service: 'image', message: 'Image generation failed', details: 'Content policy violation detected', userId: 'user_321' },
  { id: '7', timestamp: '2026-01-03 14:26:18', level: 'info', service: 'subscription', message: 'Subscription upgraded', details: 'From: free, To: pro', userId: 'user_654' },
  { id: '8', timestamp: '2026-01-03 14:25:45', level: 'warning', service: 'auth', message: 'Multiple failed login attempts', details: 'IP: 10.0.0.50, Attempts: 5', userId: 'user_987' },
  { id: '9', timestamp: '2026-01-03 14:24:22', level: 'info', service: 'api', message: 'API health check passed', details: 'All services operational' },
  { id: '10', timestamp: '2026-01-03 14:23:11', level: 'debug', service: 'cache', message: 'Cache invalidated', details: 'Keys: user_settings_*' },
])

const selectedLevel = ref('all')
const selectedService = ref('all')
const searchQuery = ref('')
const autoRefresh = ref(false)

const services = ['all', 'auth', 'api', 'chat', 'image', 'payment', 'subscription', 'storage', 'cache']
const levels = ['all', 'debug', 'info', 'warning', 'error']

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchesLevel = selectedLevel.value === 'all' || log.level === selectedLevel.value
    const matchesService = selectedService.value === 'all' || log.service === selectedService.value
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          (log.details?.toLowerCase().includes(searchQuery.value.toLowerCase()) ?? false)
    return matchesLevel && matchesService && matchesSearch
  })
})

const getLevelColor = (level: string) => {
  switch (level) {
    case 'error': return 'text-red-400 bg-red-400/10'
    case 'warning': return 'text-yellow-400 bg-yellow-400/10'
    case 'info': return 'text-blue-400 bg-blue-400/10'
    case 'debug': return 'text-gray-400 bg-gray-400/10'
    default: return 'text-gray-400 bg-gray-400/10'
  }
}

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'error': return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    case 'warning': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    case 'info': return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    case 'debug': return 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
    default: return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
}

const expandedLogs = ref<Set<string>>(new Set())

const toggleExpand = (logId: string) => {
  if (expandedLogs.value.has(logId)) {
    expandedLogs.value.delete(logId)
  } else {
    expandedLogs.value.add(logId)
  }
}

const clearLogs = () => {
  if (confirm('Are you sure you want to clear all logs?')) {
    logs.value = []
  }
}

const exportLogs = () => {
  const data = JSON.stringify(filteredLogs.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `logs-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const logStats = computed(() => ({
  total: logs.value.length,
  errors: logs.value.filter(l => l.level === 'error').length,
  warnings: logs.value.filter(l => l.level === 'warning').length,
  info: logs.value.filter(l => l.level === 'info').length,
}))
</script>

<template>
  <AdminLayout>
    <template #title>System Logs</template>

    <div class="space-y-6">
      <!-- Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-dark-300 rounded-xl p-4 border border-dark-100">
          <p class="text-sm text-gray-400">Total Logs</p>
          <p class="text-xl font-bold text-white">{{ logStats.total }}</p>
        </div>
        <div class="bg-dark-300 rounded-xl p-4 border border-dark-100">
          <p class="text-sm text-gray-400">Errors</p>
          <p class="text-xl font-bold text-red-400">{{ logStats.errors }}</p>
        </div>
        <div class="bg-dark-300 rounded-xl p-4 border border-dark-100">
          <p class="text-sm text-gray-400">Warnings</p>
          <p class="text-xl font-bold text-yellow-400">{{ logStats.warnings }}</p>
        </div>
        <div class="bg-dark-300 rounded-xl p-4 border border-dark-100">
          <p class="text-sm text-gray-400">Info</p>
          <p class="text-xl font-bold text-blue-400">{{ logStats.info }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search logs..."
              class="w-full sm:w-64 bg-dark-300 border border-dark-100 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select 
            v-model="selectedLevel"
            class="bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
          >
            <option v-for="level in levels" :key="level" :value="level" class="capitalize">
              {{ level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1) }}
            </option>
          </select>

          <select 
            v-model="selectedService"
            class="bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
          >
            <option v-for="service in services" :key="service" :value="service" class="capitalize">
              {{ service === 'all' ? 'All Services' : service.charAt(0).toUpperCase() + service.slice(1) }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-3">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              v-model="autoRefresh"
              class="w-4 h-4 rounded border-dark-100 bg-dark-400 text-primary-600 focus:ring-primary-500"
            />
            <span class="text-sm text-gray-400">Auto-refresh</span>
          </label>

          <button 
            @click="exportLogs"
            class="px-3 py-2 bg-dark-300 hover:bg-dark-200 border border-dark-100 rounded-lg text-sm text-white transition flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Export</span>
          </button>

          <button 
            @click="clearLogs"
            class="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm transition flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear</span>
          </button>
        </div>
      </div>

      <!-- Logs List -->
      <div class="bg-dark-300 rounded-xl border border-dark-100 overflow-hidden">
        <div class="divide-y divide-dark-100">
          <div 
            v-for="log in filteredLogs" 
            :key="log.id"
            class="hover:bg-dark-200 transition"
          >
            <div 
              class="flex items-start p-4 cursor-pointer"
              @click="toggleExpand(log.id)"
            >
              <div class="flex-shrink-0 mr-3">
                <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', getLevelColor(log.level)]">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getLevelIcon(log.level)" />
                  </svg>
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-2 mb-1">
                  <span :class="['text-xs px-2 py-0.5 rounded uppercase font-medium', getLevelColor(log.level)]">
                    {{ log.level }}
                  </span>
                  <span class="text-xs px-2 py-0.5 rounded bg-dark-400 text-gray-400">
                    {{ log.service }}
                  </span>
                  <span class="text-xs text-gray-500">{{ log.timestamp }}</span>
                </div>
                <p class="text-sm text-white">{{ log.message }}</p>
              </div>

              <div class="flex-shrink-0 ml-3">
                <svg 
                  :class="['w-5 h-5 text-gray-400 transition-transform', expandedLogs.has(log.id) ? 'rotate-180' : '']" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <!-- Expanded Details -->
            <div 
              v-if="expandedLogs.has(log.id)"
              class="px-4 pb-4 ml-11"
            >
              <div class="bg-dark-400 rounded-lg p-3 space-y-2">
                <div v-if="log.details" class="flex">
                  <span class="text-xs text-gray-500 w-20">Details:</span>
                  <span class="text-xs text-gray-300 font-mono">{{ log.details }}</span>
                </div>
                <div v-if="log.userId" class="flex">
                  <span class="text-xs text-gray-500 w-20">User ID:</span>
                  <span class="text-xs text-gray-300 font-mono">{{ log.userId }}</span>
                </div>
                <div class="flex">
                  <span class="text-xs text-gray-500 w-20">Log ID:</span>
                  <span class="text-xs text-gray-300 font-mono">{{ log.id }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="filteredLogs.length === 0" class="p-8 text-center">
            <svg class="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="text-gray-400">No logs found</p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
