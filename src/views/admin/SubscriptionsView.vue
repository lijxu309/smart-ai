<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'

interface Subscription {
  id: string
  userId: string
  userName: string
  userEmail: string
  plan: 'pro' | 'enterprise'
  billingCycle: 'monthly' | 'annual'
  amount: number
  status: 'active' | 'cancelled' | 'expired' | 'past_due'
  startDate: string
  nextBillingDate: string
  paymentMethod: string
}

interface Transaction {
  id: string
  subscriptionId: string
  userName: string
  amount: number
  type: 'payment' | 'refund'
  status: 'completed' | 'pending' | 'failed'
  date: string
  paymentMethod: string
}

const activeTab = ref<'subscriptions' | 'transactions' | 'plans'>('subscriptions')

const subscriptions = ref<Subscription[]>([
  { id: 'sub_1', userId: 'u1', userName: 'John Doe', userEmail: 'john@example.com', plan: 'pro', billingCycle: 'monthly', amount: 19, status: 'active', startDate: '2025-12-01', nextBillingDate: '2026-02-01', paymentMethod: 'Visa •••• 4242' },
  { id: 'sub_2', userId: 'u2', userName: 'Mike Johnson', userEmail: 'mike@example.com', plan: 'enterprise', billingCycle: 'annual', amount: 490, status: 'active', startDate: '2025-11-15', nextBillingDate: '2026-11-15', paymentMethod: 'Mastercard •••• 5555' },
  { id: 'sub_3', userId: 'u3', userName: 'Sarah Wilson', userEmail: 'sarah@example.com', plan: 'pro', billingCycle: 'monthly', amount: 19, status: 'past_due', startDate: '2025-10-01', nextBillingDate: '2026-01-01', paymentMethod: 'Visa •••• 1234' },
  { id: 'sub_4', userId: 'u4', userName: 'Emily Davis', userEmail: 'emily@example.com', plan: 'pro', billingCycle: 'annual', amount: 190, status: 'active', startDate: '2025-12-15', nextBillingDate: '2026-12-15', paymentMethod: 'PayPal' },
  { id: 'sub_5', userId: 'u5', userName: 'Alex Chen', userEmail: 'alex@example.com', plan: 'enterprise', billingCycle: 'monthly', amount: 49, status: 'cancelled', startDate: '2025-09-01', nextBillingDate: '2026-01-01', paymentMethod: 'Visa •••• 9876' },
])

const transactions = ref<Transaction[]>([
  { id: 'tx_1', subscriptionId: 'sub_1', userName: 'John Doe', amount: 19, type: 'payment', status: 'completed', date: '2026-01-01', paymentMethod: 'Visa •••• 4242' },
  { id: 'tx_2', subscriptionId: 'sub_2', userName: 'Mike Johnson', amount: 490, type: 'payment', status: 'completed', date: '2025-11-15', paymentMethod: 'Mastercard •••• 5555' },
  { id: 'tx_3', subscriptionId: 'sub_3', userName: 'Sarah Wilson', amount: 19, type: 'payment', status: 'failed', date: '2026-01-01', paymentMethod: 'Visa •••• 1234' },
  { id: 'tx_4', subscriptionId: 'sub_4', userName: 'Emily Davis', amount: 190, type: 'payment', status: 'completed', date: '2025-12-15', paymentMethod: 'PayPal' },
  { id: 'tx_5', subscriptionId: 'sub_1', userName: 'John Doe', amount: 19, type: 'payment', status: 'completed', date: '2025-12-01', paymentMethod: 'Visa •••• 4242' },
  { id: 'tx_6', subscriptionId: 'sub_5', userName: 'Alex Chen', amount: 49, type: 'refund', status: 'completed', date: '2025-12-20', paymentMethod: 'Visa •••• 9876' },
])

const plans = ref([
  { id: 'free', name: 'Free', price: { monthly: 0, annual: 0 }, messageQuota: 100, imageQuota: 10, features: ['GPT-3.5 access', 'Basic assistants', 'Standard support'] },
  { id: 'pro', name: 'Pro', price: { monthly: 19, annual: 190 }, messageQuota: 1000, imageQuota: 100, features: ['GPT-4 access', 'All assistants', 'Priority support', 'Voice chat'] },
  { id: 'enterprise', name: 'Enterprise', price: { monthly: 49, annual: 490 }, messageQuota: -1, imageQuota: -1, features: ['Unlimited usage', 'API access', 'Custom integrations', 'Dedicated support', 'SLA guarantee'] },
])

const searchQuery = ref('')
const selectedStatus = ref('all')

const stats = computed(() => ({
  totalRevenue: transactions.value.filter(t => t.type === 'payment' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
  activeSubscriptions: subscriptions.value.filter(s => s.status === 'active').length,
  mrr: subscriptions.value.filter(s => s.status === 'active').reduce((sum, s) => sum + (s.billingCycle === 'monthly' ? s.amount : s.amount / 12), 0),
  churnRate: (subscriptions.value.filter(s => s.status === 'cancelled').length / subscriptions.value.length * 100).toFixed(1),
}))

const filteredSubscriptions = computed(() => {
  return subscriptions.value.filter(sub => {
    const matchesSearch = sub.userName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          sub.userEmail.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'all' || sub.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-400 bg-green-400/10'
    case 'cancelled': return 'text-red-400 bg-red-400/10'
    case 'expired': return 'text-gray-400 bg-gray-400/10'
    case 'past_due': return 'text-yellow-400 bg-yellow-400/10'
    case 'completed': return 'text-green-400 bg-green-400/10'
    case 'pending': return 'text-yellow-400 bg-yellow-400/10'
    case 'failed': return 'text-red-400 bg-red-400/10'
    default: return 'text-gray-400 bg-gray-400/10'
  }
}

const getPlanColor = (plan: string) => {
  switch (plan) {
    case 'pro': return 'text-primary-400 bg-primary-400/10'
    case 'enterprise': return 'text-purple-400 bg-purple-400/10'
    default: return 'text-gray-400 bg-gray-400/10'
  }
}

const cancelSubscription = (subId: string) => {
  if (confirm('Are you sure you want to cancel this subscription?')) {
    const sub = subscriptions.value.find(s => s.id === subId)
    if (sub) sub.status = 'cancelled'
  }
}

const refundTransaction = (txId: string) => {
  if (confirm('Are you sure you want to refund this transaction?')) {
    const tx = transactions.value.find(t => t.id === txId)
    if (tx) {
      transactions.value.unshift({
        id: 'tx_' + Date.now(),
        subscriptionId: tx.subscriptionId,
        userName: tx.userName,
        amount: tx.amount,
        type: 'refund',
        status: 'completed',
        date: new Date().toISOString().split('T')[0] || '',
        paymentMethod: tx.paymentMethod,
      })
    }
  }
}

const showPlanModal = ref(false)
const editingPlan = ref<any>(null)

const openPlanModal = (plan: any) => {
  editingPlan.value = { ...plan, price: { ...plan.price }, features: [...plan.features] }
  showPlanModal.value = true
}

const closePlanModal = () => {
  showPlanModal.value = false
  editingPlan.value = null
}

const savePlan = () => {
  if (editingPlan.value) {
    const index = plans.value.findIndex(p => p.id === editingPlan.value.id)
    if (index > -1) {
      plans.value[index] = { ...editingPlan.value }
    }
  }
  closePlanModal()
}
</script>

<template>
  <AdminLayout>
    <template #title>Subscriptions & Payments</template>

    <div class="space-y-6">
      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <p class="text-sm text-gray-400">Total Revenue</p>
          <p class="text-2xl font-bold text-white mt-1">${{ stats.totalRevenue.toLocaleString() }}</p>
        </div>
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <p class="text-sm text-gray-400">Active Subscriptions</p>
          <p class="text-2xl font-bold text-white mt-1">{{ stats.activeSubscriptions }}</p>
        </div>
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <p class="text-sm text-gray-400">Monthly Recurring Revenue</p>
          <p class="text-2xl font-bold text-white mt-1">${{ stats.mrr.toFixed(0) }}</p>
        </div>
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <p class="text-sm text-gray-400">Churn Rate</p>
          <p class="text-2xl font-bold text-white mt-1">{{ stats.churnRate }}%</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex space-x-1 bg-dark-300 rounded-lg p-1 w-fit">
        <button 
          @click="activeTab = 'subscriptions'"
          :class="['px-4 py-2 rounded-lg text-sm font-medium transition', activeTab === 'subscriptions' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white']"
        >
          Subscriptions
        </button>
        <button 
          @click="activeTab = 'transactions'"
          :class="['px-4 py-2 rounded-lg text-sm font-medium transition', activeTab === 'transactions' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white']"
        >
          Transactions
        </button>
        <button 
          @click="activeTab = 'plans'"
          :class="['px-4 py-2 rounded-lg text-sm font-medium transition', activeTab === 'plans' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white']"
        >
          Plans
        </button>
      </div>

      <!-- Subscriptions Tab -->
      <div v-if="activeTab === 'subscriptions'" class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search subscriptions..."
              class="w-full bg-dark-300 border border-dark-100 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select 
            v-model="selectedStatus"
            class="bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
            <option value="past_due">Past Due</option>
          </select>
        </div>

        <div class="bg-dark-300 rounded-xl border border-dark-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-dark-400">
                <tr>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">User</th>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Plan</th>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Billing</th>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Next Billing</th>
                  <th class="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-dark-100">
                <tr v-for="sub in filteredSubscriptions" :key="sub.id" class="hover:bg-dark-200 transition">
                  <td class="px-4 py-3">
                    <div>
                      <p class="text-sm font-medium text-white">{{ sub.userName }}</p>
                      <p class="text-xs text-gray-500">{{ sub.userEmail }}</p>
                    </div>
                  </td>
                  <td class="px-4 py-3">
                    <span :class="['text-xs px-2 py-1 rounded-full capitalize', getPlanColor(sub.plan)]">
                      {{ sub.plan }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <p class="text-sm text-white">${{ sub.amount }}</p>
                    <p class="text-xs text-gray-500 capitalize">{{ sub.billingCycle }}</p>
                  </td>
                  <td class="px-4 py-3">
                    <span :class="['text-xs px-2 py-1 rounded-full capitalize', getStatusColor(sub.status)]">
                      {{ sub.status.replace('_', ' ') }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-400">{{ sub.nextBillingDate }}</td>
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-end space-x-2">
                      <button 
                        v-if="sub.status === 'active'"
                        @click="cancelSubscription(sub.id)"
                        class="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-xs transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Transactions Tab -->
      <div v-if="activeTab === 'transactions'" class="bg-dark-300 rounded-xl border border-dark-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-dark-400">
              <tr>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Transaction ID</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">User</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Amount</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Type</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Date</th>
                <th class="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-100">
              <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-dark-200 transition">
                <td class="px-4 py-3 text-sm text-gray-400 font-mono">{{ tx.id }}</td>
                <td class="px-4 py-3 text-sm text-white">{{ tx.userName }}</td>
                <td class="px-4 py-3">
                  <span :class="tx.type === 'refund' ? 'text-red-400' : 'text-green-400'">
                    {{ tx.type === 'refund' ? '-' : '+' }}${{ tx.amount }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span :class="['text-xs px-2 py-1 rounded-full capitalize', tx.type === 'refund' ? 'text-red-400 bg-red-400/10' : 'text-green-400 bg-green-400/10']">
                    {{ tx.type }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span :class="['text-xs px-2 py-1 rounded-full capitalize', getStatusColor(tx.status)]">
                    {{ tx.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-400">{{ tx.date }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end">
                    <button 
                      v-if="tx.type === 'payment' && tx.status === 'completed'"
                      @click="refundTransaction(tx.id)"
                      class="px-3 py-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg text-xs transition"
                    >
                      Refund
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Plans Tab -->
      <div v-if="activeTab === 'plans'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="plan in plans" 
          :key="plan.id"
          class="bg-dark-300 rounded-xl p-6 border border-dark-100"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">{{ plan.name }}</h3>
            <button 
              @click="openPlanModal(plan)"
              class="p-1.5 hover:bg-dark-200 rounded-lg transition"
            >
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
          
          <div class="mb-4">
            <p class="text-2xl font-bold text-white">${{ plan.price.monthly }}<span class="text-sm text-gray-400">/mo</span></p>
            <p class="text-sm text-gray-500">${{ plan.price.annual }}/year</p>
          </div>
          
          <div class="space-y-2 mb-4">
            <p class="text-sm text-gray-400">
              Messages: {{ plan.messageQuota === -1 ? 'Unlimited' : plan.messageQuota }}
            </p>
            <p class="text-sm text-gray-400">
              Images: {{ plan.imageQuota === -1 ? 'Unlimited' : plan.imageQuota }}
            </p>
          </div>
          
          <div class="border-t border-dark-100 pt-4">
            <p class="text-xs text-gray-500 uppercase tracking-wider mb-2">Features</p>
            <ul class="space-y-1">
              <li v-for="feature in plan.features" :key="feature" class="text-sm text-gray-400 flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Plan Modal -->
    <div v-if="showPlanModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closePlanModal"></div>
      <div class="relative bg-dark-300 rounded-2xl p-6 w-full max-w-md mx-4 border border-dark-100">
        <h3 class="text-lg font-semibold text-white mb-4">Edit Plan</h3>
        
        <div v-if="editingPlan" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Plan Name</label>
            <input 
              v-model="editingPlan.name"
              type="text"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Monthly Price</label>
              <input 
                v-model.number="editingPlan.price.monthly"
                type="number"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Annual Price</label>
              <input 
                v-model.number="editingPlan.price.annual"
                type="number"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Message Quota</label>
              <input 
                v-model.number="editingPlan.messageQuota"
                type="number"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Image Quota</label>
              <input 
                v-model.number="editingPlan.imageQuota"
                type="number"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button 
            @click="closePlanModal"
            class="px-4 py-2 bg-dark-400 hover:bg-dark-200 border border-dark-100 rounded-lg text-white transition"
          >
            Cancel
          </button>
          <button 
            @click="savePlan"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
