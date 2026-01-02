import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  model?: string
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  model: string
  createdAt: Date
  updatedAt: Date
}

export const useChatStore = defineStore('chat', () => {
  const conversations = ref<Conversation[]>([])
  const currentConversationId = ref<string | null>(null)
  const isLoading = ref(false)
  const selectedModel = ref('gpt-4')

  const currentConversation = computed(() => {
    return conversations.value.find(c => c.id === currentConversationId.value) || null
  })

  const currentMessages = computed(() => {
    return currentConversation.value?.messages || []
  })

  // Available AI models
  const availableModels = [
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
  ]

  // Create new conversation
  const createConversation = () => {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      model: selectedModel.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    conversations.value.unshift(newConversation)
    currentConversationId.value = newConversation.id
    saveToLocalStorage()
    return newConversation
  }

  // Add message to current conversation
  const addMessage = (role: 'user' | 'assistant' | 'system', content: string) => {
    if (!currentConversation.value) {
      createConversation()
    }
    
    const message: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
      model: role === 'assistant' ? selectedModel.value : undefined,
    }

    const conv = conversations.value.find(c => c.id === currentConversationId.value)
    if (conv) {
      conv.messages.push(message)
      conv.updatedAt = new Date()
      
      // Update title based on first user message
      if (conv.messages.filter(m => m.role === 'user').length === 1 && role === 'user') {
        conv.title = content.slice(0, 50) + (content.length > 50 ? '...' : '')
      }
    }
    
    saveToLocalStorage()
    return message
  }

  // Delete conversation
  const deleteConversation = (id: string) => {
    const index = conversations.value.findIndex(c => c.id === id)
    if (index !== -1) {
      conversations.value.splice(index, 1)
      if (currentConversationId.value === id) {
        currentConversationId.value = conversations.value[0]?.id || null
      }
      saveToLocalStorage()
    }
  }

  // Select conversation
  const selectConversation = (id: string) => {
    currentConversationId.value = id
  }

  // Change model
  const setModel = (modelId: string) => {
    selectedModel.value = modelId
    if (currentConversation.value) {
      currentConversation.value.model = modelId
      saveToLocalStorage()
    }
  }

  // Save to localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('smart-ai-conversations', JSON.stringify(conversations.value))
    localStorage.setItem('smart-ai-current-conversation', currentConversationId.value || '')
  }

  // Load from localStorage
  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('smart-ai-conversations')
    if (saved) {
      conversations.value = JSON.parse(saved)
    }
    const currentId = localStorage.getItem('smart-ai-current-conversation')
    if (currentId) {
      currentConversationId.value = currentId
    }
  }

  // Clear all conversations
  const clearAllConversations = () => {
    conversations.value = []
    currentConversationId.value = null
    localStorage.removeItem('smart-ai-conversations')
    localStorage.removeItem('smart-ai-current-conversation')
  }

  return {
    conversations,
    currentConversationId,
    currentConversation,
    currentMessages,
    isLoading,
    selectedModel,
    availableModels,
    createConversation,
    addMessage,
    deleteConversation,
    selectConversation,
    setModel,
    loadFromLocalStorage,
    clearAllConversations,
  }
})
