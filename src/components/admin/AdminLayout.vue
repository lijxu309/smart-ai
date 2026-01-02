<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)

const menuItems = [
  { 
    id: 'dashboard', 
    name: 'Dashboard', 
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    path: '/admin'
  },
  { 
    id: 'users', 
    name: 'User Management', 
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    path: '/admin/users'
  },
  { 
    id: 'subscriptions', 
    name: 'Subscriptions', 
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    path: '/admin/subscriptions'
  },
  { 
    id: 'assistants', 
    name: 'AI Assistants', 
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    path: '/admin/assistants'
  },
  { 
    id: 'content', 
    name: 'Content Management', 
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
    path: '/admin/content'
  },
  { 
    id: 'analytics', 
    name: 'Analytics', 
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    path: '/admin/analytics'
  },
  { 
    id: 'logs', 
    name: 'System Logs', 
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    path: '/admin/logs'
  },
  { 
    id: 'settings', 
    name: 'Settings', 
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    path: '/admin/settings'
  },
]

const currentPath = computed(() => route.path)

const isActive = (path: string) => {
  if (path === '/admin') {
    return currentPath.value === '/admin'
  }
  return currentPath.value.startsWith(path)
}

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}

const navigateTo = (path: string) => {
  router.push(path)
  isMobileSidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-dark-400 flex">
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="isMobileSidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="toggleMobileSidebar"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed lg:static inset-y-0 left-0 z-50 bg-dark-300 border-r border-dark-100 flex flex-col transition-all duration-300',
        isSidebarCollapsed ? 'w-20' : 'w-64',
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center justify-between px-4 border-b border-dark-100">
        <router-link to="/admin" class="flex items-center space-x-2">
          <span class="text-2xl">🤖</span>
          <span v-if="!isSidebarCollapsed" class="font-bold text-white text-lg">Admin</span>
        </router-link>
        <button 
          @click="toggleSidebar"
          class="p-1.5 hover:bg-dark-200 rounded-lg transition hidden lg:block"
        >
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="isSidebarCollapsed" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto p-3 space-y-1">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="navigateTo(item.path)"
          :class="[
            'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition group',
            isActive(item.path)
              ? 'bg-primary-600 text-white'
              : 'text-gray-400 hover:bg-dark-200 hover:text-white'
          ]"
        >
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
          </svg>
          <span v-if="!isSidebarCollapsed" class="truncate">{{ item.name }}</span>
        </button>
      </nav>

      <!-- User Section -->
      <div class="p-3 border-t border-dark-100">
        <div :class="['flex items-center', isSidebarCollapsed ? 'justify-center' : 'space-x-3 px-3']">
          <div class="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
            A
          </div>
          <div v-if="!isSidebarCollapsed" class="flex-1 min-w-0">
            <p class="text-sm font-medium text-white truncate">Admin</p>
            <p class="text-xs text-gray-500 truncate">admin@smartai.com</p>
          </div>
          <button 
            v-if="!isSidebarCollapsed"
            @click="handleLogout"
            class="p-1.5 hover:bg-dark-200 rounded-lg transition"
            title="Logout"
          >
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Header -->
      <header class="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-dark-100 bg-dark-300">
        <div class="flex items-center space-x-4">
          <button 
            @click="toggleMobileSidebar"
            class="p-2 hover:bg-dark-200 rounded-lg transition lg:hidden"
          >
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold text-white">
            <slot name="title">Dashboard</slot>
          </h1>
        </div>

        <div class="flex items-center space-x-3">
          <!-- Search -->
          <div class="hidden md:flex items-center">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Search..."
                class="w-64 bg-dark-400 border border-dark-100 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Notifications -->
          <button class="relative p-2 hover:bg-dark-200 rounded-lg transition">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <!-- Back to App -->
          <router-link 
            to="/chat"
            class="hidden sm:flex items-center space-x-2 px-3 py-2 bg-dark-400 hover:bg-dark-200 border border-dark-100 rounded-lg transition"
          >
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span class="text-sm text-gray-400">Back to App</span>
          </router-link>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4 lg:p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>
