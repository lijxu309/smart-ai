<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

// Feature quick tags
const quickTags = [
  { name: 'AI Search Engine', icon: '🔍' },
  { name: 'AI Image Generator', icon: '🎨' },
  { name: 'AI Link Analyzer', icon: '🔗' },
  { name: 'AI Chat PDF', icon: '📄' },
  { name: 'AI Youtube Video Summarizer', icon: '📺' },
]

// AI Models supported
const aiModels = [
  { name: 'GPT 4.5', logo: '◎' },
  { name: 'Gemini', logo: '✦' },
  { name: 'Grok', logo: '⚡' },
  { name: 'GPT-4o', logo: '◎' },
  { name: 'GPT-5', logo: '◎' },
  { name: 'DeepSeek', logo: '◉' },
  { name: 'Stable Diffusion XL', logo: '🎨' },
  { name: 'Claude 3.7 Sonnet', logo: '✻' },
  { name: 'GPT-o3 Mini', logo: '◎' },
  { name: 'Llama 3', logo: '🦙' },
]

// Features list
const features = [
  { title: 'AI Youtube Video Summarizer', desc: 'Summarize any YouTube video instantly', icon: '📺' },
  { title: 'Prompt Library', desc: 'Access thousands of pre-built prompts', icon: '📚' },
  { title: 'AI Image Generator', desc: 'Create stunning images with AI', icon: '🎨' },
  { title: 'Summarize Article', desc: 'Get key points from any article', icon: '📝' },
  { title: 'AI Link Analyzer', desc: 'Analyze any web link content', icon: '🔗' },
  { title: 'AI Chat PDF', desc: 'Chat with your PDF documents', icon: '📄' },
  { title: 'AI Search Engine', desc: 'Search with AI-powered results', icon: '🔍' },
  { title: 'WhatsApp Integration', desc: 'Use AI directly in WhatsApp', icon: '💬' },
]

// Use case categories
const categories = [
  'Health & Fitness', 'Tech Support', 'SEO', 'Language Learning', 'Recipe',
  'Finance', 'Content Management', 'Travel', 'Home', 'Product Management', 'Education'
]

// Pricing plans
const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: ['10 messages per day', 'Basic AI models', 'Standard response time'],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Premium',
    price: '$19.99',
    period: '/month',
    features: ['Unlimited messages', 'All AI models', 'Priority response', 'Image generation', 'Voice chat'],
    cta: 'Upgrade Now',
    popular: true
  }
]

// FAQs
const faqs = [
  { q: 'What AI models are supported?', a: 'We support GPT-5, Claude, Gemini, DeepSeek, Llama, and many more.' },
  { q: 'Is there a free trial?', a: 'Yes, you can start with our free plan which includes 10 messages per day.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely! You can cancel your subscription at any time with no hidden fees.' },
  { q: 'How does image generation work?', a: 'Our AI Image Generator uses Stable Diffusion XL to create stunning images from text descriptions.' },
]

const expandedFaq = ref<number | null>(null)

const toggleFaq = (index: number) => {
  expandedFaq.value = expandedFaq.value === index ? null : index
}

const handleGetStarted = () => {
  if (userStore.isAuthenticated) {
    router.push('/chat')
  } else {
    router.push('/login')
  }
}

const goToChat = () => {
  router.push('/chat')
}

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}

const goToPricing = () => {
  router.push('/pricing')
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <router-link to="/" class="flex items-center space-x-2">
            <svg class="w-8 h-8 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span class="text-xl font-bold text-gray-900">CHAT & ASK AI</span>
          </router-link>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-gray-600 hover:text-gray-900 transition">Features</a>
            <a href="#" class="text-gray-600 hover:text-gray-900 transition">Language</a>
            <router-link to="/pricing" class="text-gray-600 hover:text-gray-900 transition">Plans</router-link>
          </nav>

          <!-- Auth Buttons -->
          <div class="flex items-center space-x-4">
            <template v-if="userStore.isAuthenticated">
              <router-link to="/chat" class="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition font-medium">
                Open App
              </router-link>
            </template>
            <template v-else>
              <button @click="goToLogin" class="text-gray-600 hover:text-gray-900 transition font-medium">
                Log In
              </button>
              <button 
                @click="goToRegister"
                class="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition font-medium"
              >
                Join Now for Free
              </button>
            </template>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="pt-32 pb-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Powered by Multi-Model AI Technologies
        </h1>
        <p class="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Experience the power of GPT-5.2, DeepSeek, Gemini, Claude Sonnet, Perplexity, Grok, Llama, Stable Diffusion XL and more - all in one platform.
        </p>
        
        <button 
          @click="goToChat"
          class="px-8 py-4 bg-gray-900 text-white rounded-full text-lg font-medium hover:bg-gray-800 transition mb-12"
        >
          Explore Now
        </button>

        <!-- Quick Tags -->
        <div class="flex flex-wrap justify-center gap-3">
          <button 
            v-for="tag in quickTags" 
            :key="tag.name"
            class="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition"
          >
            <span>{{ tag.icon }}</span>
            <span>{{ tag.name }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Chat Demo Section -->
    <section class="py-16 px-4 bg-gray-50">
      <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div class="flex">
            <!-- Sidebar Preview -->
            <div class="w-64 bg-white border-r border-gray-100 p-4 hidden md:block">
              <div class="space-y-2">
                <div class="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                  <span>✏️</span>
                  <span class="text-sm text-gray-700">New chat</span>
                </div>
                <div class="pt-4">
                  <p class="text-xs font-semibold text-gray-400 uppercase px-3 mb-2">Elite Tools</p>
                  <div class="space-y-1">
                    <div class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600">
                      <span>🔍</span><span>Search Engine</span>
                    </div>
                    <div class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600">
                      <span>🎨</span><span>Image Generator</span>
                    </div>
                    <div class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600">
                      <span>🔗</span><span>Link Analyzer</span>
                    </div>
                    <div class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600">
                      <span>📄</span><span>Chat PDF</span>
                    </div>
                    <div class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600">
                      <span>📺</span><span>YouTube Summarizer</span>
                    </div>
                  </div>
                </div>
                <div class="pt-4">
                  <p class="text-xs font-semibold text-gray-400 uppercase px-3 mb-2">History</p>
                </div>
              </div>
            </div>
            
            <!-- Chat Preview -->
            <div class="flex-1 p-6">
              <div class="space-y-4">
                <div class="flex justify-end">
                  <div class="bg-gray-900 text-white px-4 py-3 rounded-2xl max-w-md">
                    What are the benefits of using AI for content creation?
                  </div>
                </div>
                <div class="flex justify-start">
                  <div class="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl max-w-lg">
                    <p class="mb-2">AI offers several key benefits for content creation:</p>
                    <ul class="list-disc list-inside space-y-1 text-sm">
                      <li>Increased productivity and faster content generation</li>
                      <li>Consistent quality across all content pieces</li>
                      <li>Cost-effective scaling of content operations</li>
                      <li>24/7 availability for content needs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Powerful AI Features</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="feature in features" 
            :key="feature.title"
            class="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition"
          >
            <div class="text-3xl mb-4">{{ feature.icon }}</div>
            <h3 class="font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
            <p class="text-sm text-gray-600">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Use Cases Section -->
    <section class="py-16 px-4 bg-gray-50">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-8">Use Cases</h2>
        <div class="flex flex-wrap justify-center gap-3">
          <button 
            v-for="category in categories" 
            :key="category"
            class="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </section>

    <!-- AI Models Section -->
    <section class="py-20 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-4">Powered by Leading AI Models</h2>
        <p class="text-center text-gray-600 mb-12">Access the most advanced AI models in one platform</p>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div 
            v-for="model in aiModels" 
            :key="model.name"
            class="p-4 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition"
          >
            <div class="text-2xl mb-2">{{ model.logo }}</div>
            <p class="text-sm font-medium text-gray-700">{{ model.name }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-20 px-4 bg-gray-50">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-4">Simple, Transparent Pricing</h2>
        <p class="text-center text-gray-600 mb-12">Choose the plan that works for you</p>
        <div class="grid md:grid-cols-2 gap-8">
          <div 
            v-for="plan in plans" 
            :key="plan.name"
            :class="[
              'p-8 rounded-2xl',
              plan.popular ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200'
            ]"
          >
            <h3 :class="['text-xl font-semibold mb-2', plan.popular ? 'text-white' : 'text-gray-900']">
              {{ plan.name }}
            </h3>
            <div class="mb-6">
              <span :class="['text-4xl font-bold', plan.popular ? 'text-white' : 'text-gray-900']">{{ plan.price }}</span>
              <span :class="plan.popular ? 'text-gray-300' : 'text-gray-500'">{{ plan.period }}</span>
            </div>
            <ul class="space-y-3 mb-8">
              <li 
                v-for="feature in plan.features" 
                :key="feature"
                :class="['flex items-center space-x-2', plan.popular ? 'text-gray-200' : 'text-gray-600']"
              >
                <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
            <button 
              @click="plan.popular ? goToRegister() : goToChat()"
              :class="[
                'w-full py-3 rounded-full font-medium transition',
                plan.popular 
                  ? 'bg-white text-gray-900 hover:bg-gray-100' 
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              ]"
            >
              {{ plan.cta }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 px-4">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
        <div class="space-y-4">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="border border-gray-200 rounded-xl overflow-hidden"
          >
            <button 
              @click="toggleFaq(index)"
              class="w-full px-6 py-4 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition"
            >
              <span class="font-medium text-gray-900">{{ faq.q }}</span>
              <svg 
                :class="['w-5 h-5 text-gray-500 transition-transform', expandedFaq === index ? 'rotate-180' : '']"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-if="expandedFaq === index" class="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <p class="text-gray-600">{{ faq.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-4 gap-8 mb-12">
          <!-- Technologies -->
          <div>
            <h4 class="font-semibold mb-4">Technologies</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li>Claude</li>
              <li>DeepSeek</li>
              <li>Gemini</li>
              <li>Grok</li>
              <li>Llama</li>
              <li>OpenAI</li>
              <li>Perplexity</li>
              <li>Stable Diffusion</li>
            </ul>
          </div>
          
          <!-- AI Assistants -->
          <div>
            <h4 class="font-semibold mb-4">AI Assistants</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li>AI Writer</li>
              <li>AI Logo Designer</li>
              <li>AI Marketing Assistant</li>
            </ul>
          </div>
          
          <!-- AI Checkers -->
          <div>
            <h4 class="font-semibold mb-4">AI Checkers</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li>AI Detector</li>
              <li>AI Plagiarism</li>
            </ul>
          </div>
          
          <!-- Company -->
          <div>
            <h4 class="font-semibold mb-4">Company</h4>
            <ul class="space-y-2 text-gray-400 text-sm">
              <li><a href="#" class="hover:text-white transition">Terms of Use</a></li>
              <li><a href="#" class="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-white transition">Refund Policy</a></li>
              <li><a href="#" class="hover:text-white transition">Contact Us</a></li>
              <li><a href="#" class="hover:text-white transition">FAQ</a></li>
              <li><a href="#" class="hover:text-white transition">Blog</a></li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Chat & Ask AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
