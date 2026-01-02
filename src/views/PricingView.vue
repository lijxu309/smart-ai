<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAnnual = ref(false)

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    description: 'Perfect for trying out Smart AI',
    features: [
      '100 messages per month',
      '10 image generations',
      'GPT-3.5 Turbo access',
      'Basic AI assistants',
      'Standard support',
    ],
    limitations: [
      'No GPT-4 access',
      'No Claude access',
      'No priority support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 19, annual: 190 },
    description: 'For professionals and power users',
    features: [
      'Unlimited messages',
      '100 image generations per month',
      'GPT-4 & GPT-4 Turbo access',
      'Claude 3 Sonnet access',
      'All AI assistants',
      'Priority support',
      'Voice chat',
      'Document analysis',
    ],
    limitations: [],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: 49, annual: 490 },
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Unlimited image generations',
      'Claude 3 Opus access',
      'Gemini Pro access',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
  },
]

const handleSelectPlan = (planId: string) => {
  if (planId === 'free') {
    router.push('/register')
  } else if (planId === 'enterprise') {
    // Contact sales
    window.open('mailto:sales@smartai.com', '_blank')
  } else {
    // Redirect to checkout
    router.push('/register')
  }
}
</script>

<template>
  <div class="min-h-screen bg-dark-400">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-dark-400/80 backdrop-blur-md border-b border-dark-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <router-link to="/" class="flex items-center space-x-2">
            <span class="text-2xl">🤖</span>
            <span class="text-xl font-bold text-white">Smart AI</span>
          </router-link>
          <div class="flex items-center space-x-4">
            <router-link to="/login" class="text-gray-300 hover:text-white transition">
              Login
            </router-link>
            <router-link to="/register" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition">
              Sign Up
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-24 pb-20 px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the plan that's right for you. Upgrade or downgrade at any time.
          </p>

          <!-- Billing Toggle -->
          <div class="flex items-center justify-center mt-8 space-x-4">
            <span :class="['text-sm', !isAnnual ? 'text-white' : 'text-gray-500']">Monthly</span>
            <button
              @click="isAnnual = !isAnnual"
              class="relative w-14 h-7 bg-dark-200 rounded-full transition"
            >
              <div 
                :class="[
                  'absolute top-1 w-5 h-5 bg-primary-600 rounded-full transition-all',
                  isAnnual ? 'left-8' : 'left-1'
                ]"
              ></div>
            </button>
            <span :class="['text-sm', isAnnual ? 'text-white' : 'text-gray-500']">
              Annual
              <span class="ml-1 px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                Save 17%
              </span>
            </span>
          </div>
        </div>

        <!-- Pricing Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="plan in plans"
            :key="plan.id"
            :class="[
              'relative rounded-2xl p-8 transition',
              plan.popular
                ? 'bg-gradient-to-b from-primary-900/50 to-dark-300 border-2 border-primary-500'
                : 'bg-dark-300 border border-dark-100'
            ]"
          >
            <!-- Popular Badge -->
            <div 
              v-if="plan.popular"
              class="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-sm font-medium rounded-full"
            >
              Most Popular
            </div>

            <!-- Plan Header -->
            <div class="text-center mb-6">
              <h3 class="text-xl font-bold text-white mb-2">{{ plan.name }}</h3>
              <p class="text-gray-400 text-sm">{{ plan.description }}</p>
            </div>

            <!-- Price -->
            <div class="text-center mb-6">
              <div class="flex items-baseline justify-center">
                <span class="text-4xl font-bold text-white">
                  ${{ isAnnual ? plan.price.annual : plan.price.monthly }}
                </span>
                <span class="text-gray-400 ml-2">
                  / {{ isAnnual ? 'year' : 'month' }}
                </span>
              </div>
              <div v-if="isAnnual && plan.price.monthly > 0" class="text-sm text-gray-500 mt-1">
                ${{ (plan.price.annual / 12).toFixed(2) }}/month billed annually
              </div>
            </div>

            <!-- CTA Button -->
            <button
              @click="handleSelectPlan(plan.id)"
              :class="[
                'w-full py-3 rounded-xl font-semibold transition mb-6',
                plan.popular
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-dark-400 hover:bg-dark-200 text-white border border-dark-100'
              ]"
            >
              {{ plan.cta }}
            </button>

            <!-- Features -->
            <div class="space-y-3">
              <div 
                v-for="feature in plan.features" 
                :key="feature"
                class="flex items-start space-x-3"
              >
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-300 text-sm">{{ feature }}</span>
              </div>
              
              <div 
                v-for="limitation in plan.limitations" 
                :key="limitation"
                class="flex items-start space-x-3"
              >
                <svg class="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="text-gray-500 text-sm">{{ limitation }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="mt-20">
          <h2 class="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div class="max-w-3xl mx-auto space-y-4">
            <div class="bg-dark-300 rounded-xl p-6 border border-dark-100">
              <h3 class="text-lg font-semibold text-white mb-2">Can I switch plans later?</h3>
              <p class="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            
            <div class="bg-dark-300 rounded-xl p-6 border border-dark-100">
              <h3 class="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h3>
              <p class="text-gray-400">We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
            </div>
            
            <div class="bg-dark-300 rounded-xl p-6 border border-dark-100">
              <h3 class="text-lg font-semibold text-white mb-2">Is there a free trial?</h3>
              <p class="text-gray-400">Our Free plan lets you try Smart AI with limited features. No credit card required to get started.</p>
            </div>
            
            <div class="bg-dark-300 rounded-xl p-6 border border-dark-100">
              <h3 class="text-lg font-semibold text-white mb-2">What happens if I exceed my limits?</h3>
              <p class="text-gray-400">You'll receive a notification when approaching your limits. You can upgrade your plan or wait for the next billing cycle.</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="py-8 px-4 border-t border-dark-100">
      <div class="max-w-6xl mx-auto text-center text-gray-500">
        © 2026 Smart AI. All rights reserved.
      </div>
    </footer>
  </div>
</template>
