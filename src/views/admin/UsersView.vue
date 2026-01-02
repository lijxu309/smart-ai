<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'inactive' | 'suspended'
  messagesUsed: number
  messageQuota: number
  imagesGenerated: number
  imageQuota: number
  createdAt: string
  lastActive: string
}

// Mock data
const users = ref<User[]>([
  { id: '1', name: 'John Doe', email: 'john@example.com', plan: 'pro', status: 'active', messagesUsed: 450, messageQuota: 1000, imagesGenerated: 25, imageQuota: 100, createdAt: '2025-12-01', lastActive: '2026-01-03' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', plan: 'free', status: 'active', messagesUsed: 85, messageQuota: 100, imagesGenerated: 8, imageQuota: 10, createdAt: '2025-12-15', lastActive: '2026-01-03' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', plan: 'enterprise', status: 'active', messagesUsed: 2500, messageQuota: -1, imagesGenerated: 150, imageQuota: -1, createdAt: '2025-11-20', lastActive: '2026-01-02' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', plan: 'pro', status: 'inactive', messagesUsed: 200, messageQuota: 1000, imagesGenerated: 10, imageQuota: 100, createdAt: '2025-12-10', lastActive: '2025-12-28' },
  { id: '5', name: 'Tom Brown', email: 'tom@example.com', plan: 'free', status: 'suspended', messagesUsed: 100, messageQuota: 100, imagesGenerated: 10, imageQuota: 10, createdAt: '2025-11-01', lastActive: '2025-12-15' },
  { id: '6', name: 'Emily Davis', email: 'emily@example.com', plan: 'pro', status: 'active', messagesUsed: 780, messageQuota: 1000, imagesGenerated: 45, imageQuota: 100, createdAt: '2025-12-05', lastActive: '2026-01-03' },
  { id: '7', name: 'Alex Chen', email: 'alex@example.com', plan: 'free', status: 'active', messagesUsed: 50, messageQuota: 100, imagesGenerated: 5, imageQuota: 10, createdAt: '2026-01-01', lastActive: '2026-01-03' },
  { id: '8', name: 'Lisa Wang', email: 'lisa@example.com', plan: 'enterprise', status: 'active', messagesUsed: 5000, messageQuota: -1, imagesGenerated: 300, imageQuota: -1, createdAt: '2025-10-15', lastActive: '2026-01-03' },
])

const searchQuery = ref('')
const selectedPlan = ref('all')
const selectedStatus = ref('all')
const selectedUsers = ref<string[]>([])
const showUserModal = ref(false)
const editingUser = ref<User | null>(null)

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesPlan = selectedPlan.value === 'all' || user.plan === selectedPlan.value
    const matchesStatus = selectedStatus.value === 'all' || user.status === selectedStatus.value
    return matchesSearch && matchesPlan && matchesStatus
  })
})

const toggleSelectAll = () => {
  if (selectedUsers.value.length === filteredUsers.value.length) {
    selectedUsers.value = []
  } else {
    selectedUsers.value = filteredUsers.value.map(u => u.id)
  }
}

const toggleSelectUser = (userId: string) => {
  const index = selectedUsers.value.indexOf(userId)
  if (index > -1) {
    selectedUsers.value.splice(index, 1)
  } else {
    selectedUsers.value.push(userId)
  }
}

const getPlanColor = (plan: string) => {
  switch (plan) {
    case 'pro': return 'text-primary-400 bg-primary-400/10'
    case 'enterprise': return 'text-purple-400 bg-purple-400/10'
    default: return 'text-gray-400 bg-gray-400/10'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'text-green-400 bg-green-400/10'
    case 'inactive': return 'text-yellow-400 bg-yellow-400/10'
    case 'suspended': return 'text-red-400 bg-red-400/10'
    default: return 'text-gray-400 bg-gray-400/10'
  }
}

const formatQuota = (used: number, quota: number) => {
  if (quota === -1) return `${used} / Unlimited`
  return `${used} / ${quota}`
}

const openEditModal = (user: User) => {
  editingUser.value = { ...user }
  showUserModal.value = true
}

const closeModal = () => {
  showUserModal.value = false
  editingUser.value = null
}

const saveUser = () => {
  if (editingUser.value) {
    const index = users.value.findIndex(u => u.id === editingUser.value!.id)
    if (index > -1) {
      users.value[index] = { ...editingUser.value }
    }
  }
  closeModal()
}

const suspendUser = (userId: string) => {
  const user = users.value.find(u => u.id === userId)
  if (user) {
    user.status = user.status === 'suspended' ? 'active' : 'suspended'
  }
}

const deleteUser = (userId: string) => {
  if (confirm('Are you sure you want to delete this user?')) {
    users.value = users.value.filter(u => u.id !== userId)
  }
}

const bulkAction = (action: string) => {
  if (selectedUsers.value.length === 0) return
  
  switch (action) {
    case 'suspend':
      users.value.forEach(u => {
        if (selectedUsers.value.includes(u.id)) {
          u.status = 'suspended'
        }
      })
      break
    case 'activate':
      users.value.forEach(u => {
        if (selectedUsers.value.includes(u.id)) {
          u.status = 'active'
        }
      })
      break
    case 'delete':
      if (confirm(`Are you sure you want to delete ${selectedUsers.value.length} users?`)) {
        users.value = users.value.filter(u => !selectedUsers.value.includes(u.id))
      }
      break
  }
  selectedUsers.value = []
}
</script>

<template>
  <AdminLayout>
    <template #title>User Management</template>

    <div class="space-y-6">
      <!-- Header Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Search -->
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search users..."
              class="w-full sm:w-64 bg-dark-300 border border-dark-100 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Filters -->
          <select 
            v-model="selectedPlan"
            class="bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="enterprise">Enterprise</option>
          </select>

          <select 
            v-model="selectedStatus"
            class="bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div class="flex gap-3">
          <!-- Bulk Actions -->
          <div v-if="selectedUsers.length > 0" class="flex items-center gap-2">
            <span class="text-sm text-gray-400">{{ selectedUsers.length }} selected</span>
            <button 
              @click="bulkAction('activate')"
              class="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm text-white transition"
            >
              Activate
            </button>
            <button 
              @click="bulkAction('suspend')"
              class="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm text-white transition"
            >
              Suspend
            </button>
            <button 
              @click="bulkAction('delete')"
              class="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm text-white transition"
            >
              Delete
            </button>
          </div>

          <!-- Export -->
          <button class="px-4 py-2 bg-dark-300 hover:bg-dark-200 border border-dark-100 rounded-lg text-sm text-white transition flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Export</span>
          </button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="bg-dark-300 rounded-xl border border-dark-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-dark-400">
              <tr>
                <th class="w-12 px-4 py-3">
                  <input 
                    type="checkbox"
                    :checked="selectedUsers.length === filteredUsers.length && filteredUsers.length > 0"
                    @change="toggleSelectAll"
                    class="w-4 h-4 rounded border-dark-100 bg-dark-400 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">User</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Plan</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Messages</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Images</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Last Active</th>
                <th class="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-100">
              <tr 
                v-for="user in filteredUsers" 
                :key="user.id" 
                class="hover:bg-dark-200 transition"
              >
                <td class="px-4 py-3">
                  <input 
                    type="checkbox"
                    :checked="selectedUsers.includes(user.id)"
                    @change="toggleSelectUser(user.id)"
                    class="w-4 h-4 rounded border-dark-100 bg-dark-400 text-primary-600 focus:ring-primary-500"
                  />
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                      {{ user.name.charAt(0) }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-white">{{ user.name }}</p>
                      <p class="text-xs text-gray-500">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span :class="['text-xs px-2 py-1 rounded-full capitalize', getPlanColor(user.plan)]">
                    {{ user.plan }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span :class="['text-xs px-2 py-1 rounded-full capitalize', getStatusColor(user.status)]">
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-400">
                  {{ formatQuota(user.messagesUsed, user.messageQuota) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-400">
                  {{ formatQuota(user.imagesGenerated, user.imageQuota) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-400">{{ user.lastActive }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end space-x-2">
                    <button 
                      @click="openEditModal(user)"
                      class="p-1.5 hover:bg-dark-100 rounded-lg transition"
                      title="Edit"
                    >
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      @click="suspendUser(user.id)"
                      class="p-1.5 hover:bg-dark-100 rounded-lg transition"
                      :title="user.status === 'suspended' ? 'Activate' : 'Suspend'"
                    >
                      <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </button>
                    <button 
                      @click="deleteUser(user.id)"
                      class="p-1.5 hover:bg-dark-100 rounded-lg transition"
                      title="Delete"
                    >
                      <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-4 py-3 border-t border-dark-100">
          <p class="text-sm text-gray-400">
            Showing {{ filteredUsers.length }} of {{ users.length }} users
          </p>
          <div class="flex items-center space-x-2">
            <button class="px-3 py-1.5 bg-dark-400 hover:bg-dark-200 border border-dark-100 rounded-lg text-sm text-white transition disabled:opacity-50" disabled>
              Previous
            </button>
            <button class="px-3 py-1.5 bg-primary-600 rounded-lg text-sm text-white">1</button>
            <button class="px-3 py-1.5 bg-dark-400 hover:bg-dark-200 border border-dark-100 rounded-lg text-sm text-white transition">2</button>
            <button class="px-3 py-1.5 bg-dark-400 hover:bg-dark-200 border border-dark-100 rounded-lg text-sm text-white transition">3</button>
            <button class="px-3 py-1.5 bg-dark-400 hover:bg-dark-200 border border-dark-100 rounded-lg text-sm text-white transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showUserModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>
      <div class="relative bg-dark-300 rounded-2xl p-6 w-full max-w-md mx-4 border border-dark-100">
        <h3 class="text-lg font-semibold text-white mb-4">Edit User</h3>
        
        <div v-if="editingUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Name</label>
            <input 
              v-model="editingUser.name"
              type="text"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input 
              v-model="editingUser.email"
              type="email"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Plan</label>
            <select 
              v-model="editingUser.plan"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Status</label>
            <select 
              v-model="editingUser.status"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Message Quota</label>
              <input 
                v-model.number="editingUser.messageQuota"
                type="number"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Image Quota</label>
              <input 
                v-model.number="editingUser.imageQuota"
                type="number"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button 
            @click="closeModal"
            class="px-4 py-2 bg-dark-400 hover:bg-dark-200 border border-dark-100 rounded-lg text-white transition"
          >
            Cancel
          </button>
          <button 
            @click="saveUser"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
