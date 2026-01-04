<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  status: 'draft' | 'published' | 'archived'
  publishedAt: string | null
  createdAt: string
  views: number
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
}

const activeTab = ref<'blog' | 'faq' | 'pages'>('blog')

const blogPosts = ref<BlogPost[]>([
  { id: '1', title: 'Getting Started with Smart AI', slug: 'getting-started', excerpt: 'Learn how to make the most of Smart AI...', content: '', author: 'Admin', category: 'Tutorial', status: 'published', publishedAt: '2025-12-15', createdAt: '2025-12-10', views: 2450 },
  { id: '2', title: 'Top 10 AI Prompts for Productivity', slug: 'top-10-prompts', excerpt: 'Discover the best prompts to boost your productivity...', content: '', author: 'Admin', category: 'Tips', status: 'published', publishedAt: '2025-12-20', createdAt: '2025-12-18', views: 1890 },
  { id: '3', title: 'Understanding GPT-4 vs GPT-3.5', slug: 'gpt4-vs-gpt35', excerpt: 'A comprehensive comparison of AI models...', content: '', author: 'Admin', category: 'Education', status: 'draft', publishedAt: null, createdAt: '2026-01-01', views: 0 },
  { id: '4', title: 'AI Image Generation Best Practices', slug: 'image-generation-tips', excerpt: 'Tips for creating stunning AI images...', content: '', author: 'Admin', category: 'Tutorial', status: 'published', publishedAt: '2025-12-28', createdAt: '2025-12-25', views: 1250 },
])

const faqs = ref<FAQ[]>([
  { id: '1', question: 'What is Smart AI?', answer: 'Smart AI is an advanced AI chat platform...', category: 'General', order: 1, isActive: true },
  { id: '2', question: 'How do I upgrade my plan?', answer: 'You can upgrade your plan by going to Settings...', category: 'Billing', order: 1, isActive: true },
  { id: '3', question: 'What AI models are available?', answer: 'We support GPT-4, GPT-3.5, Claude, and Gemini...', category: 'Features', order: 1, isActive: true },
  { id: '4', question: 'Is my data secure?', answer: 'Yes, we use industry-standard encryption...', category: 'Security', order: 1, isActive: true },
  { id: '5', question: 'How do I cancel my subscription?', answer: 'You can cancel anytime from your account settings...', category: 'Billing', order: 2, isActive: true },
])

const pages = ref([
  { id: '1', name: 'Privacy Policy', slug: 'privacy-policy', lastUpdated: '2025-12-01' },
  { id: '2', name: 'Terms of Service', slug: 'terms-of-service', lastUpdated: '2025-12-01' },
  { id: '3', name: 'About Us', slug: 'about', lastUpdated: '2025-11-15' },
  { id: '4', name: 'Contact', slug: 'contact', lastUpdated: '2025-11-15' },
])

const searchQuery = ref('')
const showBlogModal = ref(false)
const showFAQModal = ref(false)
const isEditing = ref(false)
const editingPost = ref<BlogPost | null>(null)
const editingFAQ = ref<FAQ | null>(null)

const filteredPosts = computed(() => {
  return blogPosts.value.filter(post => 
    post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published': return 'text-green-400 bg-green-400/10'
    case 'draft': return 'text-yellow-400 bg-yellow-400/10'
    case 'archived': return 'text-gray-400 bg-gray-400/10'
    default: return 'text-gray-400 bg-gray-400/10'
  }
}

// Blog functions
const openCreatePostModal = () => {
  isEditing.value = false
  editingPost.value = {
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Admin',
    category: 'Tutorial',
    status: 'draft',
    publishedAt: null,
    createdAt: new Date().toISOString().split('T')[0] || '',
    views: 0,
  }
  showBlogModal.value = true
}

const openEditPostModal = (post: BlogPost) => {
  isEditing.value = true
  editingPost.value = { ...post }
  showBlogModal.value = true
}

const closeBlogModal = () => {
  showBlogModal.value = false
  editingPost.value = null
}

const savePost = () => {
  if (!editingPost.value) return
  
  // Auto-generate slug from title
  if (!editingPost.value.slug) {
    editingPost.value.slug = editingPost.value.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  
  if (isEditing.value) {
    const index = blogPosts.value.findIndex(p => p.id === editingPost.value!.id)
    if (index > -1) {
      blogPosts.value[index] = { ...editingPost.value }
    }
  } else {
    editingPost.value.id = Date.now().toString()
    blogPosts.value.unshift({ ...editingPost.value })
  }
  closeBlogModal()
}

const deletePost = (id: string) => {
  if (confirm('Are you sure you want to delete this post?')) {
    blogPosts.value = blogPosts.value.filter(p => p.id !== id)
  }
}

const publishPost = (post: BlogPost) => {
  post.status = 'published'
  post.publishedAt = new Date().toISOString().split('T')[0] || null
}

// FAQ functions
const openCreateFAQModal = () => {
  isEditing.value = false
  editingFAQ.value = {
    id: '',
    question: '',
    answer: '',
    category: 'General',
    order: 1,
    isActive: true,
  }
  showFAQModal.value = true
}

const openEditFAQModal = (faq: FAQ) => {
  isEditing.value = true
  editingFAQ.value = { ...faq }
  showFAQModal.value = true
}

const closeFAQModal = () => {
  showFAQModal.value = false
  editingFAQ.value = null
}

const saveFAQ = () => {
  if (!editingFAQ.value) return
  
  if (isEditing.value) {
    const index = faqs.value.findIndex(f => f.id === editingFAQ.value!.id)
    if (index > -1) {
      faqs.value[index] = { ...editingFAQ.value }
    }
  } else {
    editingFAQ.value.id = Date.now().toString()
    faqs.value.push({ ...editingFAQ.value })
  }
  closeFAQModal()
}

const deleteFAQ = (id: string) => {
  if (confirm('Are you sure you want to delete this FAQ?')) {
    faqs.value = faqs.value.filter(f => f.id !== id)
  }
}

const toggleFAQActive = (faq: FAQ) => {
  faq.isActive = !faq.isActive
}

const faqCategories = ['General', 'Billing', 'Features', 'Security', 'Technical']
const blogCategories = ['Tutorial', 'Tips', 'Education', 'News', 'Updates']
</script>

<template>
  <AdminLayout>
    <template #title>Content Management</template>

    <div class="space-y-6">
      <!-- Tabs -->
      <div class="flex space-x-1 bg-dark-300 rounded-lg p-1 w-fit">
        <button 
          @click="activeTab = 'blog'"
          :class="['px-4 py-2 rounded-lg text-sm font-medium transition', activeTab === 'blog' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white']"
        >
          Blog Posts
        </button>
        <button 
          @click="activeTab = 'faq'"
          :class="['px-4 py-2 rounded-lg text-sm font-medium transition', activeTab === 'faq' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white']"
        >
          FAQs
        </button>
        <button 
          @click="activeTab = 'pages'"
          :class="['px-4 py-2 rounded-lg text-sm font-medium transition', activeTab === 'pages' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white']"
        >
          Static Pages
        </button>
      </div>

      <!-- Blog Posts Tab -->
      <div v-if="activeTab === 'blog'" class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search posts..."
              class="w-full sm:w-64 bg-dark-300 border border-dark-100 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <button 
            @click="openCreatePostModal"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white text-sm font-medium transition flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Post</span>
          </button>
        </div>

        <div class="bg-dark-300 rounded-xl border border-dark-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-dark-400">
                <tr>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Title</th>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Category</th>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Status</th>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Views</th>
                  <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Date</th>
                  <th class="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-dark-100">
                <tr v-for="post in filteredPosts" :key="post.id" class="hover:bg-dark-200 transition">
                  <td class="px-4 py-3">
                    <div>
                      <p class="text-sm font-medium text-white">{{ post.title }}</p>
                      <p class="text-xs text-gray-500">/blog/{{ post.slug }}</p>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-400">{{ post.category }}</td>
                  <td class="px-4 py-3">
                    <span :class="['text-xs px-2 py-1 rounded-full capitalize', getStatusColor(post.status)]">
                      {{ post.status }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-400">{{ post.views.toLocaleString() }}</td>
                  <td class="px-4 py-3 text-sm text-gray-400">{{ post.publishedAt || post.createdAt }}</td>
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-end space-x-2">
                      <button 
                        v-if="post.status === 'draft'"
                        @click="publishPost(post)"
                        class="px-2 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded text-xs transition"
                      >
                        Publish
                      </button>
                      <button 
                        @click="openEditPostModal(post)"
                        class="p-1.5 hover:bg-dark-100 rounded-lg transition"
                      >
                        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        @click="deletePost(post.id)"
                        class="p-1.5 hover:bg-dark-100 rounded-lg transition"
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
        </div>
      </div>

      <!-- FAQs Tab -->
      <div v-if="activeTab === 'faq'" class="space-y-4">
        <div class="flex justify-end">
          <button 
            @click="openCreateFAQModal"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white text-sm font-medium transition flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add FAQ</span>
          </button>
        </div>

        <div class="space-y-3">
          <div 
            v-for="faq in faqs" 
            :key="faq.id"
            class="bg-dark-300 rounded-xl p-4 border border-dark-100"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-xs px-2 py-0.5 rounded bg-dark-400 text-gray-400">{{ faq.category }}</span>
                  <span :class="['text-xs px-2 py-0.5 rounded', faq.isActive ? 'bg-green-400/10 text-green-400' : 'bg-gray-400/10 text-gray-400']">
                    {{ faq.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <h4 class="text-white font-medium mb-1">{{ faq.question }}</h4>
                <p class="text-sm text-gray-400">{{ faq.answer }}</p>
              </div>
              <div class="flex items-center space-x-2 ml-4">
                <button 
                  @click="toggleFAQActive(faq)"
                  :class="[
                    'relative inline-flex h-5 w-9 items-center rounded-full transition',
                    faq.isActive ? 'bg-primary-600' : 'bg-dark-100'
                  ]"
                >
                  <span 
                    :class="[
                      'inline-block h-3 w-3 transform rounded-full bg-white transition',
                      faq.isActive ? 'translate-x-5' : 'translate-x-1'
                    ]"
                  />
                </button>
                <button 
                  @click="openEditFAQModal(faq)"
                  class="p-1.5 hover:bg-dark-200 rounded-lg transition"
                >
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  @click="deleteFAQ(faq.id)"
                  class="p-1.5 hover:bg-dark-200 rounded-lg transition"
                >
                  <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Static Pages Tab -->
      <div v-if="activeTab === 'pages'" class="bg-dark-300 rounded-xl border border-dark-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-dark-400">
              <tr>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Page Name</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">URL</th>
                <th class="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Last Updated</th>
                <th class="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-dark-100">
              <tr v-for="page in pages" :key="page.id" class="hover:bg-dark-200 transition">
                <td class="px-4 py-3 text-sm font-medium text-white">{{ page.name }}</td>
                <td class="px-4 py-3 text-sm text-gray-400">/{{ page.slug }}</td>
                <td class="px-4 py-3 text-sm text-gray-400">{{ page.lastUpdated }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end">
                    <button class="p-1.5 hover:bg-dark-100 rounded-lg transition">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Blog Post Modal -->
    <div v-if="showBlogModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeBlogModal"></div>
      <div class="relative bg-dark-300 rounded-2xl p-6 w-full max-w-2xl mx-4 border border-dark-100 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-white mb-4">
          {{ isEditing ? 'Edit Post' : 'Create Post' }}
        </h3>
        
        <div v-if="editingPost" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Title</label>
            <input 
              v-model="editingPost.title"
              type="text"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Slug</label>
            <input 
              v-model="editingPost.slug"
              type="text"
              placeholder="auto-generated-from-title"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Category</label>
              <select 
                v-model="editingPost.category"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              >
                <option v-for="cat in blogCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <select 
                v-model="editingPost.status"
                class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Excerpt</label>
            <textarea 
              v-model="editingPost.excerpt"
              rows="2"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 resize-none"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Content</label>
            <textarea 
              v-model="editingPost.content"
              rows="8"
              placeholder="Write your post content in Markdown..."
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 resize-none font-mono text-sm"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button 
            @click="closeBlogModal"
            class="px-4 py-2 bg-dark-400 hover:bg-dark-200 border border-dark-100 rounded-lg text-white transition"
          >
            Cancel
          </button>
          <button 
            @click="savePost"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition"
          >
            {{ isEditing ? 'Save Changes' : 'Create Post' }}
          </button>
        </div>
      </div>
    </div>

    <!-- FAQ Modal -->
    <div v-if="showFAQModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closeFAQModal"></div>
      <div class="relative bg-dark-300 rounded-2xl p-6 w-full max-w-md mx-4 border border-dark-100">
        <h3 class="text-lg font-semibold text-white mb-4">
          {{ isEditing ? 'Edit FAQ' : 'Add FAQ' }}
        </h3>
        
        <div v-if="editingFAQ" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Category</label>
            <select 
              v-model="editingFAQ.category"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            >
              <option v-for="cat in faqCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Question</label>
            <input 
              v-model="editingFAQ.question"
              type="text"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-1">Answer</label>
            <textarea 
              v-model="editingFAQ.answer"
              rows="4"
              class="w-full bg-dark-400 border border-dark-100 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 resize-none"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button 
            @click="closeFAQModal"
            class="px-4 py-2 bg-dark-400 hover:bg-dark-200 border border-dark-100 rounded-lg text-white transition"
          >
            Cancel
          </button>
          <button 
            @click="saveFAQ"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition"
          >
            {{ isEditing ? 'Save Changes' : 'Add FAQ' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
