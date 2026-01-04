import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { aiChatService, AI_MODELS, generateId } from '../services/aiChat'
import type { ChatMessage, Conversation, AIModel } from '../services/aiChat'

export type { ChatMessage, Conversation, AIModel }

export const useChatStore = defineStore('chat', () => {
  // 状态
  const conversations = ref<Conversation[]>([])
  const currentConversationId = ref<string | null>(null)
  const isLoading = ref(false)
  const isStreaming = ref(false)
  const selectedModel = ref('deepseek-chat')
  const streamingContent = ref('')
  const error = ref<string | null>(null)

  // 计算属性
  const currentConversation = computed(() => {
    return conversations.value.find(c => c.id === currentConversationId.value) || null
  })

  const currentMessages = computed(() => {
    return currentConversation.value?.messages || []
  })

  const availableModels = computed(() => AI_MODELS)

  // 创建新对话
  const createConversation = (): Conversation => {
    const newConversation: Conversation = {
      id: generateId(),
      title: '新对话',
      messages: [],
      model: selectedModel.value,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    conversations.value.unshift(newConversation)
    currentConversationId.value = newConversation.id
    saveToLocalStorage()
    return newConversation
  }

  // 添加消息
  const addMessage = (role: 'user' | 'assistant' | 'system', content: string): ChatMessage => {
    if (!currentConversation.value) {
      createConversation()
    }
    
    const message: ChatMessage = {
      id: generateId(),
      role,
      content,
      timestamp: Date.now(),
      model: role === 'assistant' ? selectedModel.value : undefined,
    }

    const conv = conversations.value.find(c => c.id === currentConversationId.value)
    if (conv) {
      conv.messages.push(message)
      conv.updatedAt = Date.now()
    }
    
    saveToLocalStorage()
    return message
  }

  // 更新最后一条消息内容（用于流式响应）
  const updateLastMessage = (content: string) => {
    const conv = conversations.value.find(c => c.id === currentConversationId.value)
    if (conv && conv.messages.length > 0) {
      const lastMessage = conv.messages[conv.messages.length - 1]
      if (lastMessage && lastMessage.role === 'assistant') {
        lastMessage.content = content
      }
    }
  }

  // 发送消息并获取 AI 响应
  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim() || isLoading.value) return

    error.value = null
    
    // 如果没有当前对话，创建一个新的
    if (!currentConversation.value) {
      createConversation()
    }

    // 添加用户消息
    addMessage('user', content)

    // 更新对话标题（如果是第一条消息）
    const conv = conversations.value.find(c => c.id === currentConversationId.value)
    if (conv && conv.messages.filter(m => m.role === 'user').length === 1) {
      conv.title = content.slice(0, 30) + (content.length > 30 ? '...' : '')
    }

    isLoading.value = true
    isStreaming.value = true
    streamingContent.value = ''

    // 添加一个空的助手消息用于流式更新
    addMessage('assistant', '')

    try {
      // 准备消息历史
      const messages = currentMessages.value.slice(0, -1).map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp
      }))

      // 调用 AI 服务（流式响应）
      const response = await aiChatService.sendMessage(
        messages,
        selectedModel.value,
        (chunk) => {
          streamingContent.value += chunk
          updateLastMessage(streamingContent.value)
        }
      )

      // 确保最终内容正确
      updateLastMessage(response || streamingContent.value)
      saveToLocalStorage()

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '发送消息失败'
      error.value = errorMessage
      // 移除空的助手消息
      const convRef = conversations.value.find(c => c.id === currentConversationId.value)
      if (convRef && convRef.messages.length > 0) {
        const lastMsg = convRef.messages[convRef.messages.length - 1]
        if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content) {
          convRef.messages.pop()
        }
      }
      console.error('Send message error:', err)
    } finally {
      isLoading.value = false
      isStreaming.value = false
      streamingContent.value = ''
    }
  }

  // 删除对话
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

  // 选择对话
  const selectConversation = (id: string) => {
    currentConversationId.value = id
    const conv = conversations.value.find(c => c.id === id)
    if (conv) {
      selectedModel.value = conv.model
    }
  }

  // 切换模型
  const setModel = (modelId: string) => {
    selectedModel.value = modelId
    if (currentConversation.value) {
      currentConversation.value.model = modelId
      saveToLocalStorage()
    }
  }

  // 保存到 localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('smart-ai-conversations', JSON.stringify(conversations.value))
      localStorage.setItem('smart-ai-current-conversation', currentConversationId.value || '')
      localStorage.setItem('smart-ai-selected-model', selectedModel.value)
    } catch (e) {
      console.error('Failed to save to localStorage:', e)
    }
  }

  // 从 localStorage 加载
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('smart-ai-conversations')
      if (saved) {
        conversations.value = JSON.parse(saved)
      }
      const currentId = localStorage.getItem('smart-ai-current-conversation')
      if (currentId) {
        currentConversationId.value = currentId
      }
      const savedModel = localStorage.getItem('smart-ai-selected-model')
      if (savedModel) {
        selectedModel.value = savedModel
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e)
    }
  }

  // 清除所有对话
  const clearAllConversations = () => {
    conversations.value = []
    currentConversationId.value = null
    localStorage.removeItem('smart-ai-conversations')
    localStorage.removeItem('smart-ai-current-conversation')
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  // 重新生成最后一条回复
  const regenerateLastResponse = async () => {
    const conv = conversations.value.find(c => c.id === currentConversationId.value)
    if (!conv || conv.messages.length < 2) return

    // 找到最后一条用户消息
    let lastUserMessageIndex = -1
    for (let i = conv.messages.length - 1; i >= 0; i--) {
      const msg = conv.messages[i]
      if (msg && msg.role === 'user') {
        lastUserMessageIndex = i
        break
      }
    }

    if (lastUserMessageIndex === -1) return

    const lastUserMsg = conv.messages[lastUserMessageIndex]
    if (!lastUserMsg) return
    
    const lastUserMessage = lastUserMsg.content

    // 移除最后一条用户消息之后的所有消息
    conv.messages = conv.messages.slice(0, lastUserMessageIndex)
    saveToLocalStorage()

    // 重新发送
    await sendMessage(lastUserMessage)
  }

  return {
    // 状态
    conversations,
    currentConversationId,
    currentConversation,
    currentMessages,
    isLoading,
    isStreaming,
    selectedModel,
    streamingContent,
    error,
    availableModels,
    
    // 方法
    createConversation,
    addMessage,
    sendMessage,
    deleteConversation,
    selectConversation,
    setModel,
    loadFromLocalStorage,
    clearAllConversations,
    clearError,
    regenerateLastResponse,
  }
})
