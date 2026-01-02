<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'

interface Payment {
  id: string
  userId: string
  userEmail: string
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed' | 'refunded'
  method: string
  description: string
  createdAt: string
  invoiceId?: string
}

const payments = ref<Payment[]>([
  { id: 'pay_1', userId: 'user_1', userEmail: 'john@example.com', amount: 19.99, currency: 'USD', status: 'succeeded', method: 'Visa •••• 4242', description: 'Pro Plan - Monthly', createdAt: '2026-01-03 12:30:00', invoiceId: 'INV-001' },
  { id: 'pay_2', userId: 'user_2', userEmail: 'jane@example.com', amount: 49.99, currency: 'USD', status: 'succeeded', method: 'Mastercard •••• 5555', description: 'Business Plan - Monthly', createdAt: '2026-01-03 11:15:00', invoiceId: 'INV-002' },
  { id: 'pay_3', userId: 'user_3', userEmail: 'bob@example.com', amount: 19.99, currency: 'USD', status: 'pending', method: 'PayPal', description: 'Pro Plan - Monthly', createdAt: '2026-01-03 10:45:00' },
  { id: 'pay_4', userId: 'user_4', userEmail: 'alice@example.com', amount: 199.99, currency: 'USD', status: 'succeeded', method: 'Visa •••• 1234', description: 'Pro Plan - Yearly', createdAt: '2026-01-02 16:20:00', invoiceId: 'INV-003' },
  { id: 'pay_5', userId: 'user_5', userEmail: 'charlie@example.com', amount: 49.99, currency: 'USD', status: 'failed', method: 'Visa •••• 9876', description: 'Business Plan - Monthly', createdAt: '2026-01-02 14:30:00' },
  { id: 'pay_6', userId: 'user_6', userEmail: 'david@example.com', amount: 19.99, currency: 'USD', status: 'refunded', method: 'Mastercard •••• 4444', description: 'Pro Plan - Monthly', createdAt: '2026-01-01 09:00:00', invoiceId: 'INV-004' },
])

const revenueStats = ref({
  totalRevenue: 125890,
  monthlyRevenue: 28450,
  avgOrderValue: 32.50,
  refundRate: 2.3,
})

const searchQuery = ref('')
const selectedStatus = ref('all')
const dateRange = ref('30d')

const statuses = ['all', 'succeeded', 'pending', 'failed', 'refunded']

const filteredPayments = computed(() => {
  return payments.value.filter(payment => {
    const matchesSearch = payment.userEmail.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          payment.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'all' || payment.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'succeeded': return 'text-green-400 bg-green-400/10'
    case 'pending': return 'text-yellow-400 bg-yellow-400/10'
    case 'failed': return 'text-red-400 bg-red-400/10'
    case 'refunded': return 'text-purple-400 bg-purple-400/10'
    default: return 'text-gray-400 bg-gray-400/10'
  }
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

const showRefundModal = ref(false)
const selectedPayment = ref<Payment | null>(null)
const refundReason = ref('')

const openRefundModal = (payment: Payment) => {
  selectedPayment.value = payment
  refundReason.value = ''
  showRefundModal.value = true
}

const closeRefundModal = () => {
  showRefundModal.value = false
  selectedPayment.value = null
}

const processRefund = () => {
  if (selectedPayment.value) {
    selectedPayment.value.status = 'refunded'
    closeRefundModal()
    alert('Refund processed successfully!')
  }
}

const retryPayment = (payment: Payment) => {
  if (confirm('Retry this payment?')) {
    payment.status = 'pending'
    // Simulate retry
    setTimeout(() => {
      payment.status = 'succeeded'
    }, 2000)
  }
}

const exportPayments = () => {
  const csv = [
    ['ID', 'Email', 'Amount', 'Status', 'Method', 'Description', 'Date'].join(','),
    ...filteredPayments.value.map(p => 
      [p.id, p.userEmail, p.amount, p.status, p.method, p.description, p.createdAt].join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <AdminLayout>
    <template #title>Payments</template>

    <div class="space-y-6">
      <!-- Revenue Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Total Revenue</span>
            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-2xl font-bold text-white">${{ revenueStats.totalRevenue.toLocaleString() }}</p>
          <p class="text-xs text-gray-500 mt-1">All time</p>
        </div>

        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Monthly Revenue</span>
            <span class="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">+12.5%</span>
          </div>
          <p class="text-2xl font-bold text-white">${{ revenueStats.monthlyRevenue.toLocaleString() }}</p>
          <p class="text-xs text-gray-500 mt-1">This month</p>
        </div>

        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Avg Order Value</span>
            <span class="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">+3.2%</span>
          </div>
          <p class="text-2xl font-bold text-white">${{ revenueStats.avgOrderValue.toFixed(2) }}</p>
          <p class="text-xs text-gray-500 mt-1">Per transaction</p>
        </div>

        <div class="bg-dark-300 rounded-xl p-5 border border-dark-100">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-400">Refund Rate</span>
            <span class="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">-0.5%</span>
          </div>
          <p class="text-2xl font-bold text-white">{{ revenueStats.refundRate }}%</p>
          <p class="text-xs text-gray-500 mt-1">This month</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search by email or ID..."
              class="w-full sm:w-64 bg-dark-300 border border-dark-100 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select 
            v-model="selectedStatus"
            class="bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
          >
            <option v-for="status in statuses" :key="status" :value="status" class="capitalize">
              {{ status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1) }}
            </option>
          </select>

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

        <button 
          @click="exportPayments"
          class="px-4 py-2 bg-dark-300 hover:bg-dark-200 border border-dark-100 rounded-lg text-sm text-white transition flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>Export CSV</span>
        </button>
      </div>

      <!-- Payments Table -->
      <div class="bg-dark-300 rounded-xl border border-dark-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-dark-400">
              <tr>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Transaction</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Customer</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Amount</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Method</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Date</th>
                <th class="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-100">
              <tr v-for="payment in filteredPayments" :key="payment.id" class="hover:bg-dark-200 transition">
                <td class="px-4 py-3">
                  <div>
                    <p class="text-sm font-medium text-white font-mono">{{ payment.id }}</p>
                    <p class="text-xs text-gray-500">{{ payment.description }}</p>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <p class="text-sm text-white">{{ payment.userEmail }}</p>
                </td>
                <td class="px-4 py-3">
                  <p class="text-sm font-medium text-white">{{ formatCurrency(payment.amount, payment.currency) }}</p>
                </td>
                <td class="px-4 py-3">
                  <span :class="['text-xs px-2 py-1 rounded-full capitalize', getStatusColor(payment.status)]">
                    {{ payment.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-400">{{ payment.method }}</td>
                <td class="px-4 py-3 text-sm text-gray-400">{{ payment.createdAt }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end space-x-2">
                    <button 
                      v-if="payment.invoiceId"
                      class="p-1.5 hover:bg-dark-100 rounded-lg transition"
                      title="Download Invoice"
                    >
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button 
                      v-if="payment.status === 'failed'"
                      @click="retryPayment(payment)"
                      class="px-2 py-1 bg-primary-600/20 hover:bg-primary-600/30 text-primary-400 rounded text-xs transition"
                    >
                      Retry
                    </button>
                    <button 
                      v-if="payment.status === 'succeeded'"
                      @click="openRefundModal(payment)"
                      class="px-2 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs transition"
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
    </div>

    <!-- Refund Modal -->
    <div v-if="showRefundModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeRefundModal"></div>
      <div class="relative bg-dark-300 rounded-2xl p-6 w-full max-w-md mx-4 border border-dark-100">
        <h3 class="text-lg font-semibold text-white mb-4">Process Refund</h3>
        
        <div v-if="selectedPayment" class="space-y-4">
          <div class="bg-dark-400 rounded-lg p-4">
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-400">Transaction ID</span>
              <span class="text-sm text-white font-mono">{{ selectedPayment.id }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-400">Customer</span>
              <span class="text-sm text-white">{{ selectedPayment.userEmail }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-400">Amount</span>
              <span class="text-sm text-white font-medium">{{ formatCurrency(selectedPayment.amount, selectedPayment.currency) }}</span>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Refund Reason</label>
            <textarea 
              v-model="refundReason"
              rows="3"
              placeholder="Enter reason for refund..."
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 resize-none"
            ></textarea>
          </div>

          <div class="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
            <p class="text-sm text-yellow-400">
              <strong>Warning:</strong> This action cannot be undone. The customer will be refunded the full amount.
            </p>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button 
            @click="closeRefundModal"
            class="px-4 py-2 bg-dark-400 hover:bg-dark-200 border border-dark-100 rounded-lg text-white transition"
          >
            Cancel
          </button>
          <button 
            @click="processRefund"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition"
          >
            Process Refund
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
