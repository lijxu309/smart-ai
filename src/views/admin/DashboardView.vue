<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'

// Mock data - in production, fetch from API
const stats = ref({
  totalUsers: 12458,
  activeUsers: 3842,
  totalRevenue: 89420,
  totalMessages: 1245890,
  newUsersToday: 156,
  messagestoday: 45230,
  imageGenerations: 8920,
  subscriptionRate: 12.5,
})

const recentUsers = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', plan: 'Pro', joinedAt: '2026-01-03' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', plan: 'Free', joinedAt: '2026-01-03' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', plan: 'Enterprise', joinedAt: '2026-01-02' },
  { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', plan: 'Pro', joinedAt: '2026-01-02' },
  { id: 5, name: 'Tom Brown', email: 'tom@example.com', plan: 'Free', joinedAt: '2026-01-01' },
])

const recentTransactions = ref([
  { id: 1, user: 'John Doe', amount: 19, plan: 'Pro Monthly', date: '2026-01-03', status: 'completed' },
  { id: 2, user: 'Mike Johnson', amount: 490, plan: 'Enterprise Annual', date: '2026-01-02', status: 'completed' },
  { id: 3, user: 'Sarah Wilson', amount: 19, plan: 'Pro Monthly', date: '2026-01-02', status: 'completed' },
  { id: 4, user: 'Alex Chen', amount: 190, plan: 'Pro Annual', date: '2026-01-01', status: 'pending' },
  { id: 5, user: 'Emily Davis', amount: 19, plan: 'Pro Monthly', date: '2026-01-01', status: 'failed' },
])

const usageData = ref({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  messages: [45000, 52000, 48000, 61000, 55000, 42000, 38000],
  images: [1200, 1500, 1300, 1800, 1600, 1100, 900],
})

const modelUsage = ref([
  { model: 'GPT-4', percentage: 45, count: 560000 },
  { model: 'GPT-3.5', percentage: 30, count: 373000 },
  { model: 'Claude 3', percentage: 15, count: 186000 },
  { model: 'Gemini', percentage: 10, count: 124000 },
])

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

const formatCurrency = (num: number) => {
  return '$' + num.toLocaleString()
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-green-400 bg-green-400/10'
    case 'pending': return 'text-yellow-400 bg-yellow-400/10'
    case 'failed': return 'text-red-400 bg-red-400/10'
    default: return 'text-gray-400 bg-gray-400/10'
  }
}

const getPlanColor = (plan: string) => {
  switch (plan) {
    case 'Pro': return 'text-primary-400 bg-primary-400/10'
    case 'Enterprise': return 'text-purple-400 bg-purple-400/10'
    default: return 'text-gray-400 bg-gray-400/10'
  }
}
</script>

<template>
  <AdminLayout>
    <template #title>Dashboard</template>

    <div class="space-y-6">
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Users -->
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400">Total Users</p>
              <p class="text-2xl font-bold text-white mt-1">{{ formatNumber(stats.totalUsers) }}</p>
              <p class="text-xs text-green-400 mt-1">
                <span class="inline-flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +{{ stats.newUsersToday }} today
                </span>
              </p>
            </div>
            <div class="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Active Users -->
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400">Active Users</p>
              <p class="text-2xl font-bold text-white mt-1">{{ formatNumber(stats.activeUsers) }}</p>
              <p class="text-xs text-gray-400 mt-1">Last 24 hours</p>
            </div>
            <div class="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Revenue -->
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400">Total Revenue</p>
              <p class="text-2xl font-bold text-white mt-1">{{ formatCurrency(stats.totalRevenue) }}</p>
              <p class="text-xs text-green-400 mt-1">
                <span class="inline-flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +{{ stats.subscriptionRate }}% this month
                </span>
              </p>
            </div>
            <div class="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Messages -->
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400">Total Messages</p>
              <p class="text-2xl font-bold text-white mt-1">{{ formatNumber(stats.totalMessages) }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatNumber(stats.messagestoday) }} today</p>
            </div>
            <div class="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Usage Chart -->
        <div class="lg:col-span-2 bg-dark-300 rounded-xl p-5 border border-dark-100">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-white">Usage Overview</h2>
            <select class="bg-dark-400 border border-dark-100 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          
          <!-- Simple Bar Chart -->
          <div class="h-64 flex items-end justify-between space-x-2">
            <div 
              v-for="(value, index) in usageData.messages" 
              :key="index"
              class="flex-1 flex flex-col items-center"
            >
              <div 
                class="w-full bg-primary-600 rounded-t-lg transition-all duration-300 hover:bg-primary-500"
                :style="{ height: (value / 70000 * 100) + '%' }"
              ></div>
              <span class="text-xs text-gray-500 mt-2">{{ usageData.labels[index] }}</span>
            </div>
          </div>
          
          <div class="flex items-center justify-center space-x-6 mt-4">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-primary-600 rounded"></div>
              <span class="text-sm text-gray-400">Messages</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-purple-600 rounded"></div>
              <span class="text-sm text-gray-400">Images</span>
            </div>
          </div>
        </div>

        <!-- Model Usage -->
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <h2 class="text-lg font-semibold text-white mb-6">Model Usage</h2>
          
          <div class="space-y-4">
            <div v-for="model in modelUsage" :key="model.model">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-gray-300">{{ model.model }}</span>
                <span class="text-sm text-gray-400">{{ model.percentage }}%</span>
              </div>
              <div class="h-2 bg-dark-400 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary-600 rounded-full transition-all duration-500"
                  :style="{ width: model.percentage + '%' }"
                ></div>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ formatNumber(model.count) }} requests</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tables Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Users -->
        <div class="bg-dark-300 rounded-xl border border-dark-100 overflow-hidden">
          <div class="flex items-center justify-between p-5 border-b border-dark-100">
            <h2 class="text-lg font-semibold text-white">Recent Users</h2>
            <router-link to="/admin/users" class="text-sm text-primary-400 hover:text-primary-300">
              View all
            </router-link>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-dark-400">
                <tr>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">User</th>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Plan</th>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-dark-100">
                <tr v-for="user in recentUsers" :key="user.id" class="hover:bg-dark-200 transition">
                  <td class="px-5 py-3">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
                        {{ user.name.charAt(0) }}
                      </div>
                      <div>
                        <p class="text-sm font-medium text-white">{{ user.name }}</p>
                        <p class="text-xs text-gray-500">{{ user.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-3">
                    <span :class="['text-xs px-2 py-1 rounded-full', getPlanColor(user.plan)]">
                      {{ user.plan }}
                    </span>
                  </td>
                  <td class="px-5 py-3 text-sm text-gray-400">{{ user.joinedAt }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="bg-dark-300 rounded-xl border border-dark-100 overflow-hidden">
          <div class="flex items-center justify-between p-5 border-b border-dark-100">
            <h2 class="text-lg font-semibold text-white">Recent Transactions</h2>
            <router-link to="/admin/subscriptions" class="text-sm text-primary-400 hover:text-primary-300">
              View all
            </router-link>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-dark-400">
                <tr>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">User</th>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Amount</th>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-dark-100">
                <tr v-for="tx in recentTransactions" :key="tx.id" class="hover:bg-dark-200 transition">
                  <td class="px-5 py-3">
                    <div>
                      <p class="text-sm font-medium text-white">{{ tx.user }}</p>
                      <p class="text-xs text-gray-500">{{ tx.plan }}</p>
                    </div>
                  </td>
                  <td class="px-5 py-3 text-sm text-white font-medium">${{ tx.amount }}</td>
                  <td class="px-5 py-3">
                    <span :class="['text-xs px-2 py-1 rounded-full capitalize', getStatusColor(tx.status)]">
                      {{ tx.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
