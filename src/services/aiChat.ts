/**
 * AI Chat Service - 核心聊天功能
 * 
 * 支持两种模式:
 * 1. 生产模式: 通过 Firebase Cloud Functions 调用 API (安全)
 * 2. 开发模式: 直接调用 DeepSeek API (仅用于开发测试)
 * 
 * API 文档: https://api-docs.deepseek.com/zh-cn/
 */

import { getFunctions, httpsCallable } from 'firebase/functions'
import { getAuth } from 'firebase/auth'

// 获取 Firebase Functions 实例
const functions = getFunctions()

// AI 模型配置
export interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  maxTokens: number
  icon: string
  apiModel: string // 实际调用 API 时使用的模型名称
}

// 消息类型
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  model?: string
}

// 对话类型
export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  model: string
  createdAt: number
  updatedAt: number
}

// 支持的 AI 模型列表
export const AI_MODELS: AIModel[] = [
  {
    id: 'deepseek-chat',
    name: 'DeepSeek-V3',
    provider: 'DeepSeek',
    description: 'DeepSeek 最新对话模型，性能强大',
    maxTokens: 8192,
    icon: '◉',
    apiModel: 'deepseek-chat'
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek-R1',
    provider: 'DeepSeek',
    description: 'DeepSeek 推理模型，擅长复杂推理',
    maxTokens: 8192,
    icon: '◎',
    apiModel: 'deepseek-reasoner'
  },
  {
    id: 'gpt-5-nano',
    name: 'GPT-5 Nano',
    provider: 'OpenAI',
    description: '快速响应，适合日常对话',
    maxTokens: 4096,
    icon: '◎',
    apiModel: 'deepseek-chat'
  },
  {
    id: 'gpt-5.2-instant',
    name: 'GPT-5.2 Instant',
    provider: 'OpenAI',
    description: '平衡速度与质量',
    maxTokens: 8192,
    icon: '◎',
    apiModel: 'deepseek-chat'
  },
  {
    id: 'gemini-3-pro',
    name: 'Gemini 3 Pro',
    provider: 'Google',
    description: '强大的多模态能力',
    maxTokens: 8192,
    icon: '✦',
    apiModel: 'deepseek-chat'
  },
  {
    id: 'claude-4.5',
    name: 'Claude 4.5',
    provider: 'Anthropic',
    description: '擅长长文本和代码',
    maxTokens: 8192,
    icon: '✻',
    apiModel: 'deepseek-chat'
  }
]

// 生成唯一 ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 获取模型的实际 API 模型名称
export function getApiModel(modelId: string): string {
  const model = AI_MODELS.find(m => m.id === modelId)
  return model?.apiModel || 'deepseek-chat'
}

// 检查是否使用后端模式
function useBackendMode(): boolean {
  // 如果配置了 FUNCTIONS_URL 或者没有配置前端 API Key，则使用后端模式
  const functionsUrl = import.meta.env.VITE_FUNCTIONS_URL
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  return !!functionsUrl || !apiKey
}

// AI 聊天服务类
export class AIChatService {
  private apiKey: string
  private baseUrl: string
  
  constructor() {
    this.apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || ''
    this.baseUrl = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
  }

  // 发送聊天请求
  async sendMessage(
    messages: ChatMessage[],
    model: string = 'deepseek-chat',
    onStream?: (chunk: string) => void
  ): Promise<string> {
    // 优先使用后端云函数（安全模式）
    if (useBackendMode() && !onStream) {
      return await this.sendMessageViaBackend(messages, model)
    }
    
    // 开发模式：直接调用 API
    return await this.sendMessageDirect(messages, model, onStream)
  }

  // 通过后端云函数发送消息（安全）
  private async sendMessageViaBackend(
    messages: ChatMessage[],
    model: string
  ): Promise<string> {
    try {
      const chatCompletion = httpsCallable<
        { messages: Array<{role: string, content: string}>, model: string },
        { success: boolean, message: string }
      >(functions, 'chatCompletion')

      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const result = await chatCompletion({
        messages: formattedMessages,
        model
      })

      if (result.data.success) {
        return result.data.message
      } else {
        throw new Error('Failed to get response from AI')
      }
    } catch (error: any) {
      console.error('Backend chat error:', error)
      // 如果后端调用失败，尝试直接调用（开发模式回退）
      if (this.apiKey) {
        console.log('Falling back to direct API call')
        return await this.sendMessageDirect(messages, model)
      }
      throw error
    }
  }

  // 直接调用 API（开发模式）
  private async sendMessageDirect(
    messages: ChatMessage[],
    model: string = 'deepseek-chat',
    onStream?: (chunk: string) => void
  ): Promise<string> {
    const apiModel = getApiModel(model)
    
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    const systemMessage = {
      role: 'system',
      content: 'You are a helpful AI assistant called Smart AI. You are knowledgeable, friendly, and always try to provide accurate and helpful responses. You can help with various tasks including answering questions, writing content, coding, analysis, and more.'
    }

    const allMessages = [systemMessage, ...formattedMessages]

    try {
      if (onStream) {
        return await this.streamChat(allMessages, apiModel, onStream)
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: apiModel,
          messages: allMessages,
          temperature: 0.7,
          max_tokens: 2048
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || `API 请求失败: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('AI Chat Error:', error)
      throw error
    }
  }

  // 流式聊天
  private async streamChat(
    messages: Array<{role: string, content: string}>,
    model: string,
    onStream: (chunk: string) => void
  ): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
        stream: true
      })
    })

    if (!response.ok) {
      let errorMessage = `API 请求失败: ${response.status}`
      try {
        const error = await response.json()
        errorMessage = error.error?.message || errorMessage
      } catch {
        // 忽略 JSON 解析错误
      }
      throw new Error(errorMessage)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let fullContent = ''

    if (!reader) {
      throw new Error('无法读取响应流')
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.trim() !== '')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices[0]?.delta?.content || ''
            if (content) {
              fullContent += content
              onStream(content)
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }

    return fullContent
  }

  // 生成对话标题
  async generateTitle(firstMessage: string): Promise<string> {
    try {
      const response = await this.sendMessage([
        {
          id: generateId(),
          role: 'user',
          content: `请根据以下用户消息，生成一个简短的对话标题（不超过20个字符，只返回标题，不要任何其他内容）：\n\n${firstMessage}`,
          timestamp: Date.now()
        }
      ], 'deepseek-chat')
      
      return response.slice(0, 30) || '新对话'
    } catch {
      return firstMessage.slice(0, 20) + (firstMessage.length > 20 ? '...' : '')
    }
  }
}

// ============ 语音功能 ============

/**
 * 文字转语音 (Text-to-Speech)
 * 使用 Firebase Cloud Function 调用 OpenAI TTS API
 */
export async function textToSpeech(
  text: string,
  options: {
    voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
    speed?: number
  } = {}
): Promise<{ success: boolean; audio?: string; format?: string; error?: string }> {
  try {
    const auth = getAuth()
    if (!auth.currentUser) {
      return { success: false, error: 'User not authenticated' }
    }

    const ttsFn = httpsCallable<
      { text: string; voice?: string; speed?: number },
      { success: boolean; audio: string; format: string }
    >(functions, 'textToSpeech')

    const result = await ttsFn({
      text,
      voice: options.voice || 'alloy',
      speed: options.speed || 1.0,
    })

    return result.data
  } catch (error: any) {
    console.error('TTS error:', error)
    return { success: false, error: error.message || 'Failed to generate speech' }
  }
}

/**
 * 语音转文字 (Speech-to-Text)
 * 使用 Firebase Cloud Function 调用 OpenAI Whisper API
 */
export async function speechToText(
  audioBase64: string,
  options: {
    language?: string
    format?: string
  } = {}
): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    const auth = getAuth()
    if (!auth.currentUser) {
      return { success: false, error: 'User not authenticated' }
    }

    const sttFn = httpsCallable<
      { audioBase64: string; language?: string; format?: string },
      { success: boolean; text: string }
    >(functions, 'speechToText')

    const result = await sttFn({
      audioBase64,
      language: options.language || 'en',
      format: options.format || 'webm',
    })

    return result.data
  } catch (error: any) {
    console.error('STT error:', error)
    return { success: false, error: error.message || 'Failed to transcribe audio' }
  }
}

/**
 * 图像生成
 * 使用 Firebase Cloud Function 调用 OpenAI DALL-E API
 */
export async function generateImage(
  prompt: string,
  options: {
    size?: '1024x1024' | '1792x1024' | '1024x1792'
    quality?: 'standard' | 'hd'
    style?: 'vivid' | 'natural'
  } = {}
): Promise<{ success: boolean; imageUrl?: string; revisedPrompt?: string; error?: string }> {
  try {
    const auth = getAuth()
    if (!auth.currentUser) {
      return { success: false, error: 'User not authenticated' }
    }

    const generateImageFn = httpsCallable<
      { prompt: string; size?: string; quality?: string; style?: string },
      { success: boolean; imageUrl: string; revisedPrompt?: string }
    >(functions, 'generateImage')

    const result = await generateImageFn({
      prompt,
      size: options.size || '1024x1024',
      quality: options.quality || 'standard',
      style: options.style || 'vivid',
    })

    return result.data
  } catch (error: any) {
    console.error('Image generation error:', error)
    return { success: false, error: error.message || 'Failed to generate image' }
  }
}

/**
 * 创建新对话
 */
export async function createConversation(
  title: string = 'New Chat'
): Promise<{ success: boolean; conversationId?: string; error?: string }> {
  try {
    const auth = getAuth()
    if (!auth.currentUser) {
      return { success: false, error: 'User not authenticated' }
    }

    const createConvFn = httpsCallable<
      { title: string },
      { success: boolean; conversationId: string }
    >(functions, 'createConversation')

    const result = await createConvFn({ title })
    return result.data
  } catch (error: any) {
    console.error('Create conversation error:', error)
    return { success: false, error: error.message || 'Failed to create conversation' }
  }
}

/**
 * 获取对话历史
 */
export async function getConversations(
  limit: number = 50
): Promise<{ success: boolean; conversations?: any[]; error?: string }> {
  try {
    const auth = getAuth()
    if (!auth.currentUser) {
      return { success: false, error: 'User not authenticated' }
    }

    const getConvFn = httpsCallable<
      { limit: number },
      { success: boolean; conversations: any[] }
    >(functions, 'getConversations')

    const result = await getConvFn({ limit })
    return result.data
  } catch (error: any) {
    console.error('Get conversations error:', error)
    return { success: false, error: error.message || 'Failed to get conversations' }
  }
}

/**
 * 删除对话
 */
export async function deleteConversation(
  conversationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = getAuth()
    if (!auth.currentUser) {
      return { success: false, error: 'User not authenticated' }
    }

    const deleteConvFn = httpsCallable<
      { conversationId: string },
      { success: boolean }
    >(functions, 'deleteConversation')

    const result = await deleteConvFn({ conversationId })
    return result.data
  } catch (error: any) {
    console.error('Delete conversation error:', error)
    return { success: false, error: error.message || 'Failed to delete conversation' }
  }
}

// 导出单例实例
export const aiChatService = new AIChatService()
