<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  if (!email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const success = await userStore.register(email.value, password.value)
  
  if (success) {
    router.push('/chat')
  } else {
    errorMessage.value = userStore.error || 'Registration failed. Please try again.'
  }
  
  isLoading.value = false
}

const handleGoogleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''

  const success = await userStore.loginWithGoogle()
  
  if (success) {
    router.push('/chat')
  } else {
    errorMessage.value = userStore.error || 'Google login failed. Please try again.'
  }
  
  isLoading.value = false
}
</script>

<template>
  <div class="min-h-screen bg-dark-400 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center space-x-2">
          <span class="text-4xl">🤖</span>
          <span class="text-2xl font-bold text-white">Smart AI</span>
        </router-link>
      </div>

      <!-- Register Card -->
      <div class="bg-dark-300 rounded-2xl p-8 border border-dark-100">
        <h1 class="text-2xl font-bold text-white text-center mb-6">Create Account</h1>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {{ errorMessage }}
        </div>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="w-full px-4 py-3 bg-dark-400 border border-dark-100 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="Create a password"
              class="w-full px-4 py-3 bg-dark-400 border border-dark-100 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              class="w-full px-4 py-3 bg-dark-400 border border-dark-100 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition"
            />
          </div>

          <div class="flex items-start">
            <input type="checkbox" class="w-4 h-4 mt-1 rounded border-dark-100 bg-dark-400 text-primary-600 focus:ring-primary-500" />
            <span class="ml-2 text-sm text-gray-400">
              I agree to the <a href="#" class="text-primary-500 hover:text-primary-400">Terms of Service</a> and <a href="#" class="text-primary-500 hover:text-primary-400">Privacy Policy</a>
            </span>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-800 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition"
          >
            <span v-if="isLoading">Creating account...</span>
            <span v-else>Create Account</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center my-6">
          <div class="flex-1 border-t border-dark-100"></div>
          <span class="px-4 text-sm text-gray-500">or continue with</span>
          <div class="flex-1 border-t border-dark-100"></div>
        </div>

        <!-- Social Login -->
        <div class="space-y-3">
          <button
            @click="handleGoogleLogin"
            :disabled="isLoading"
            class="w-full py-3 bg-white hover:bg-gray-100 disabled:bg-gray-200 rounded-lg text-dark-400 font-semibold flex items-center justify-center space-x-2 transition"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <!-- Sign In Link -->
        <p class="mt-6 text-center text-gray-400">
          Already have an account?
          <router-link to="/login" class="text-primary-500 hover:text-primary-400 font-semibold">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
