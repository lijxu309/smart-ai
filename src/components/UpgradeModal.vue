<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  close: []
}>()

const selectedPlan = ref('month')

const plans = [
  { id: 'week', name: '1 Week', originalPrice: 24.99, price: 10.00, discount: 60, daily: 1.39 },
  { id: 'month', name: '1 Month', originalPrice: 74.99, price: 30.00, discount: 60, daily: 0.99, popular: true },
  { id: 'year', name: '12 Months', originalPrice: 249.99, price: 100.00, discount: 60, daily: 0.19 },
]

const features = [
  { name: 'GPT-5.2, Gemini 3, Claude 4.5, Perplexity', free: false, pro: true },
  { name: 'Chat with PDF, Docs, Excel and more', free: false, pro: true },
  { name: 'AI Search Engine & Link Analyzer', free: false, pro: true },
  { name: 'AI Image Generator', free: false, pro: true },
  { name: 'AI Assistants', free: false, pro: true },
]

const aiLogos = [
  { name: 'GPT-5.2', icon: '🤖' },
  { name: 'Gemini 3 Pro', icon: '✨' },
  { name: 'Claude Sonnet 4.5', icon: '🌸' },
  { name: 'Perplexity', icon: '🔍' },
]
</script>

<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="emit('close')">
    <div class="bg-dark-300 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-4 border-b border-dark-100 flex items-center justify-between sticky top-0 bg-dark-300 z-10">
        <h2 class="text-lg font-semibold text-white">Upgrade to Pro</h2>
        <button @click="emit('close')" class="p-2 hover:bg-dark-200 rounded-lg transition">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6">
        <!-- AI Models Showcase -->
        <div class="text-center mb-6">
          <p class="text-sm text-gray-400 mb-3">Developed On</p>
          <div class="flex items-center justify-center flex-wrap gap-3">
            <div 
              v-for="ai in aiLogos" 
              :key="ai.name"
              class="flex items-center space-x-1 px-3 py-1.5 bg-dark-200 rounded-full"
            >
              <span>{{ ai.icon }}</span>
              <span class="text-sm text-gray-300">{{ ai.name }}</span>
            </div>
          </div>
        </div>

        <!-- Features Comparison -->
        <div class="mb-6">
          <div class="grid grid-cols-3 gap-2 text-sm mb-2">
            <div></div>
            <div class="text-center text-gray-400">FREE</div>
            <div class="text-center text-primary-400 font-medium">PRO</div>
          </div>
          <div class="space-y-2">
            <div 
              v-for="feature in features" 
              :key="feature.name"
              class="grid grid-cols-3 gap-2 py-2 border-b border-dark-100"
            >
              <div class="text-sm text-gray-300">{{ feature.name }}</div>
              <div class="text-center">
                <span v-if="feature.free" class="text-green-500">✓</span>
                <span v-else class="text-gray-500">✗</span>
              </div>
              <div class="text-center">
                <span v-if="feature.pro" class="text-green-500">✓</span>
                <span v-else class="text-gray-500">✗</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing Plans -->
        <div class="space-y-3 mb-6">
          <button
            v-for="plan in plans"
            :key="plan.id"
            @click="selectedPlan = plan.id"
            :class="[
              'w-full p-4 rounded-xl border-2 transition text-left relative',
              selectedPlan === plan.id 
                ? 'border-primary-600 bg-primary-600/10' 
                : 'border-dark-100 bg-dark-200 hover:border-dark-50'
            ]"
          >
            <div v-if="plan.popular" class="absolute -top-2 right-4 px-2 py-0.5 bg-primary-600 rounded text-xs text-white font-medium">
              MOST POPULAR
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-white">{{ plan.name }}</div>
                <div class="text-sm text-gray-400">
                  <span class="line-through">${{ plan.originalPrice }}</span>
                  <span class="ml-2 text-green-500">SAVE {{ plan.discount }}%</span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-white">${{ plan.price.toFixed(2) }}</div>
                <div class="text-sm text-gray-400">${{ plan.daily.toFixed(2) }}/day</div>
              </div>
            </div>
          </button>
        </div>

        <!-- CTA Button -->
        <button class="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 rounded-xl text-white font-semibold transition">
          Upgrade Your Plan
        </button>

        <!-- Payment Methods -->
        <div class="mt-4 flex items-center justify-center space-x-3">
          <span class="text-xs text-gray-500">Pay with:</span>
          <div class="flex items-center space-x-2">
            <span class="text-gray-400 text-sm">PayPal</span>
            <span class="text-gray-400 text-sm">•</span>
            <span class="text-gray-400 text-sm">Apple Pay</span>
            <span class="text-gray-400 text-sm">•</span>
            <span class="text-gray-400 text-sm">Google Pay</span>
          </div>
        </div>

        <!-- Legal Links -->
        <div class="mt-4 text-center text-xs text-gray-500">
          <a href="/terms" class="hover:text-gray-400">Terms of Service</a>
          <span class="mx-2">•</span>
          <a href="/privacy" class="hover:text-gray-400">Privacy & Cookie Statement</a>
          <span class="mx-2">•</span>
          <a href="/refund" class="hover:text-gray-400">Refund & Cancellation Policy</a>
        </div>
      </div>
    </div>
  </div>
</template>
