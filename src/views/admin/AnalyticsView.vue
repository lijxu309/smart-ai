<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'

const dateRange = ref('7d')

const overviewStats = ref({
  totalMessages: 1245890,
  messageGrowth: 12.5,
  totalImages: 89420,
  imageGrowth: 8.3,
  avgSessionTime: '12m 34s',
  sessionGrowth: 5.2,
  conversionRate: 4.8,
  conversionGrowth: 0.5,
})

const dailyUsage = ref([
  { date: 'Dec 28', messages: 42000, images: 1200, users: 3200 },
  { date: 'Dec 29', messages: 45000, images: 1350, users: 3400 },
  { date: 'Dec 30', messages: 48000, images: 1400, users: 3500 },
  { date: 'Dec 31', messages: 38000, images: 1100, users: 2800 },
  { date: 'Jan 1', messages: 35000, images: 950, users: 2600 },
  { date: 'Jan 2', messages: 52000, images: 1500, users: 3800 },
  { date: 'Jan 3', messages: 55000, images: 1600, users: 4000 },
])

const modelStats = ref([
  { model: 'GPT-4', requests: 560000, percentage: 45, avgLatency: '2.3s', cost: 4500 },
  { model: 'GPT-3.5 Turbo', requests: 373000, percentage: 30, avgLatency: '0.8s', cost: 750 },
  { model: 'Claude 3', requests: 186000, percentage: 15, avgLatency: '1.5s', cost: 1200 },
  { model: 'Gemini Pro', requests: 124000, percentage: 10, avgLatency: '1.2s', cost: 600 },
])

const topAssistants = ref([
  { name: 'Code Assistant', usage: 45230, satisfaction: 4.8 },
  { name: 'Writing Assistant', usage: 38920, satisfaction: 4.7 },
  { name: 'Math Tutor', usage: 28450, satisfaction: 4.9 },
  { name: 'Language Translator', usage: 22100, satisfaction: 4.6 },
  { name: 'Business Analyst', usage: 15680, satisfaction: 4.5 },
])

const userRetention = ref({
  day1: 85,
  day7: 62,
  day30: 45,
  day90: 32,
})

const geographicData = ref([
  { country: 'United States', users: 4500, percentage: 36 },
  { country: 'United Kingdom', users: 1800, percentage: 14 },
  { country: 'Germany', users: 1200, percentage: 10 },
  { country: 'Canada', users: 950, percentage: 8 },
  { country: 'Australia', users: 800, percentage: 6 },
  { country: 'Others', users: 3250, percentage: 26 },
])

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

const maxMessages = Math.max(...dailyUsage.value.map(d => d.messages))
</script>

<template>
  <AdminLayout>
    <template #title>Analytics</template>

    <div class="space-y-6">
      <!-- Date Range Selector -->
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-white">Overview</h2>
        <select 
          v-model="dateRange"
          class="bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      <!-- Overview Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Total Messages</span>
            <span :class="['text-xs px-2 py-0.5 rounded-full', overviewStats.messageGrowth > 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10']">
              {{ overviewStats.messageGrowth > 0 ? '+' : '' }}{{ overviewStats.messageGrowth }}%
            </span>
          </div>
          <p class="text-2xl font-bold text-white">{{ formatNumber(overviewStats.totalMessages) }}</p>
        </div>

        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Images Generated</span>
            <span :class="['text-xs px-2 py-0.5 rounded-full', overviewStats.imageGrowth > 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10']">
              {{ overviewStats.imageGrowth > 0 ? '+' : '' }}{{ overviewStats.imageGrowth }}%
            </span>
          </div>
          <p class="text-2xl font-bold text-white">{{ formatNumber(overviewStats.totalImages) }}</p>
        </div>

        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Avg Session Time</span>
            <span :class="['text-xs px-2 py-0.5 rounded-full', overviewStats.sessionGrowth > 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10']">
              {{ overviewStats.sessionGrowth > 0 ? '+' : '' }}{{ overviewStats.sessionGrowth }}%
            </span>
          </div>
          <p class="text-2xl font-bold text-white">{{ overviewStats.avgSessionTime }}</p>
        </div>

        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Conversion Rate</span>
            <span :class="['text-xs px-2 py-0.5 rounded-full', overviewStats.conversionGrowth > 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10']">
              {{ overviewStats.conversionGrowth > 0 ? '+' : '' }}{{ overviewStats.conversionGrowth }}%
            </span>
          </div>
          <p class="text-2xl font-bold text-white">{{ overviewStats.conversionRate }}%</p>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Usage Chart -->
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <h3 class="text-lg font-semibold text-white mb-4">Daily Usage</h3>
          <div class="h-64 flex items-end justify-between space-x-2">
            <div 
              v-for="day in dailyUsage" 
              :key="day.date"
              class="flex-1 flex flex-col items-center"
            >
              <div class="w-full space-y-1">
                <div 
                  class="w-full bg-primary-600 rounded-t transition-all duration-300 hover:bg-primary-500"
                  :style="{ height: (day.messages / maxMessages * 180) + 'px' }"
                  :title="`${day.messages.toLocaleString()} messages`"
                ></div>
              </div>
              <span class="text-xs text-gray-500 mt-2">{{ day.date.split(' ')[1] }}</span>
            </div>
          </div>
        </div>

        <!-- Model Usage -->
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <h3 class="text-lg font-semibold text-white mb-4">Model Usage</h3>
          <div class="space-y-4">
            <div v-for="model in modelStats" :key="model.model" class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm text-white">{{ model.model }}</span>
                <div class="flex items-center space-x-4 text-xs text-gray-400">
                  <span>{{ formatNumber(model.requests) }} req</span>
                  <span>{{ model.avgLatency }}</span>
                  <span>${{ model.cost }}</span>
                </div>
              </div>
              <div class="h-2 bg-dark-400 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary-600 rounded-full transition-all duration-500"
                  :style="{ width: model.percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Second Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Top Assistants -->
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <h3 class="text-lg font-semibold text-white mb-4">Top Assistants</h3>
          <div class="space-y-3">
            <div 
              v-for="(assistant, index) in topAssistants" 
              :key="assistant.name"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <span class="w-6 h-6 rounded-full bg-dark-400 flex items-center justify-center text-xs text-gray-400">
                  {{ index + 1 }}
                </span>
                <span class="text-sm text-white">{{ assistant.name }}</span>
              </div>
              <div class="flex items-center space-x-3">
                <span class="text-xs text-gray-400">{{ formatNumber(assistant.usage) }}</span>
                <div class="flex items-center space-x-1">
                  <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="text-xs text-gray-400">{{ assistant.satisfaction }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Retention -->
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <h3 class="text-lg font-semibold text-white mb-4">User Retention</h3>
          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-gray-400">Day 1</span>
                <span class="text-sm text-white">{{ userRetention.day1 }}%</span>
              </div>
              <div class="h-2 bg-dark-400 rounded-full overflow-hidden">
                <div class="h-full bg-green-500 rounded-full" :style="{ width: userRetention.day1 + '%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-gray-400">Day 7</span>
                <span class="text-sm text-white">{{ userRetention.day7 }}%</span>
              </div>
              <div class="h-2 bg-dark-400 rounded-full overflow-hidden">
                <div class="h-full bg-primary-500 rounded-full" :style="{ width: userRetention.day7 + '%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-gray-400">Day 30</span>
                <span class="text-sm text-white">{{ userRetention.day30 }}%</span>
              </div>
              <div class="h-2 bg-dark-400 rounded-full overflow-hidden">
                <div class="h-full bg-yellow-500 rounded-full" :style="{ width: userRetention.day30 + '%' }"></div>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-gray-400">Day 90</span>
                <span class="text-sm text-white">{{ userRetention.day90 }}%</span>
              </div>
              <div class="h-2 bg-dark-400 rounded-full overflow-hidden">
                <div class="h-full bg-purple-500 rounded-full" :style="{ width: userRetention.day90 + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Geographic Distribution -->
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <h3 class="text-lg font-semibold text-white mb-4">Geographic Distribution</h3>
          <div class="space-y-3">
            <div 
              v-for="geo in geographicData" 
              :key="geo.country"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <span class="text-sm text-white">{{ geo.country }}</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-24 h-2 bg-dark-400 rounded-full overflow-hidden">
                  <div 
                    class="h-full bg-primary-600 rounded-full"
                    :style="{ width: geo.percentage + '%' }"
                  ></div>
                </div>
                <span class="text-xs text-gray-400 w-8">{{ geo.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- API Cost Analysis -->
      <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">API Cost Analysis</h3>
          <div class="text-right">
            <p class="text-2xl font-bold text-white">${{ modelStats.reduce((sum, m) => sum + m.cost, 0).toLocaleString() }}</p>
            <p class="text-xs text-gray-400">Total cost this period</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                <th class="pb-3">Model</th>
                <th class="pb-3">Requests</th>
                <th class="pb-3">Avg Latency</th>
                <th class="pb-3">Cost</th>
                <th class="pb-3">Cost per 1K</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-100">
              <tr v-for="model in modelStats" :key="model.model">
                <td class="py-3 text-sm text-white">{{ model.model }}</td>
                <td class="py-3 text-sm text-gray-400">{{ formatNumber(model.requests) }}</td>
                <td class="py-3 text-sm text-gray-400">{{ model.avgLatency }}</td>
                <td class="py-3 text-sm text-white">${{ model.cost.toLocaleString() }}</td>
                <td class="py-3 text-sm text-gray-400">${{ (model.cost / model.requests * 1000).toFixed(3) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
