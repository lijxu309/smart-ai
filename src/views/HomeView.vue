<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const features = [
  {
    icon: '💬',
    title: 'AI Chat',
    description: 'Chat with advanced AI models including GPT-4, Claude, and Gemini'
  },
  {
    icon: '🎨',
    title: 'Image Generation',
    description: 'Create stunning images with AI-powered image generation'
  },
  {
    icon: '🤖',
    title: 'AI Assistants',
    description: 'Access specialized AI assistants for various tasks'
  },
  {
    icon: '📝',
    title: 'Document Analysis',
    description: 'Upload and analyze documents with AI assistance'
  },
  {
    icon: '🔊',
    title: 'Voice Chat',
    description: 'Talk to AI using voice input and get spoken responses'
  },
  {
    icon: '🌐',
    title: 'Multi-language',
    description: 'Support for multiple languages and translation'
  }
]

const handleGetStarted = () => {
  if (userStore.isAuthenticated) {
    router.push('/chat')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-dark-400 to-dark-500">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-dark-400/80 backdrop-blur-md border-b border-dark-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-2">
            <span class="text-2xl">🤖</span>
            <span class="text-xl font-bold text-white">Smart AI</span>
          </div>
          <nav class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-gray-300 hover:text-white transition">Features</a>
            <router-link to="/pricing" class="text-gray-300 hover:text-white transition">Pricing</router-link>
          </nav>
          <div class="flex items-center space-x-4">
            <template v-if="userStore.isAuthenticated">
              <router-link to="/chat" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition">
                Open App
              </router-link>
            </template>
            <template v-else>
              <router-link to="/login" class="text-gray-300 hover:text-white transition">
                Login
              </router-link>
              <router-link to="/register" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition">
                Sign Up
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="pt-32 pb-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-white mb-6">
          Your Intelligent
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
            AI Assistant
          </span>
        </h1>
        <p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Experience the power of multiple AI models in one place. Chat, create images, 
          analyze documents, and more with Smart AI.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            @click="handleGetStarted"
            class="px-8 py-4 bg-primary-600 hover:bg-primary-700 rounded-xl text-white text-lg font-semibold transition transform hover:scale-105"
          >
            Get Started Free
          </button>
          <router-link 
            to="/pricing"
            class="px-8 py-4 border border-gray-600 hover:border-primary-500 rounded-xl text-white text-lg transition"
          >
            View Pricing
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Powerful Features
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="feature in features" 
            :key="feature.title"
            class="p-6 bg-dark-300 rounded-2xl border border-dark-100 hover:border-primary-500/50 transition"
          >
            <div class="text-4xl mb-4">{{ feature.icon }}</div>
            <h3 class="text-xl font-semibold text-white mb-2">{{ feature.title }}</h3>
            <p class="text-gray-400">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4">
      <div class="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary-900/50 to-primary-700/50 rounded-3xl p-12 border border-primary-500/30">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p class="text-xl text-gray-300 mb-8">
          Join thousands of users who are already using Smart AI to boost their productivity.
        </p>
        <button 
          @click="handleGetStarted"
          class="px-8 py-4 bg-white text-dark-400 rounded-xl text-lg font-semibold hover:bg-gray-100 transition"
        >
          Start for Free
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 px-4 border-t border-dark-100">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center space-x-2 mb-4 md:mb-0">
            <span class="text-2xl">🤖</span>
            <span class="text-xl font-bold text-white">Smart AI</span>
          </div>
          <div class="flex items-center space-x-6 text-gray-400">
            <a href="#" class="hover:text-white transition">Privacy Policy</a>
            <a href="#" class="hover:text-white transition">Terms of Service</a>
            <a href="#" class="hover:text-white transition">Contact</a>
          </div>
        </div>
        <div class="mt-8 text-center text-gray-500">
          © 2026 Smart AI. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>
