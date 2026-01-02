<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-dark-400 flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary-600 mb-4">404</h1>
      <h2 class="text-3xl font-semibold text-white mb-4">Page Not Found</h2>
      <p class="text-gray-400 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="flex items-center justify-center space-x-4">
        <button 
          @click="goBack"
          class="px-6 py-3 bg-dark-300 hover:bg-dark-200 border border-dark-100 rounded-lg text-white transition"
        >
          Go Back
        </button>
        <button 
          @click="goHome"
          class="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition"
        >
          Go Home
        </button>
      </div>
    </div>
  </div>
</template>
