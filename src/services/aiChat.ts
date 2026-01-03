/**
 * AI Chat Service - 核心聊天功能
 * 使用 DeepSeek API 实现 AI 对话
 * API 文档: https://api-docs.deepseek.com/zh-cn/
 */

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
// 前端显示名称映射到 DeepSeek 实际模型
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
    apiModel: 'deepseek-chat' // 映射到 DeepSeek
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

// AI 聊天服务类
export class AIChatService {
  private apiKey: string
  private baseUrl: string
  
  constructor() {
    // 使用 DeepSeek API 配置
    this.apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || ''
    this.baseUrl = import.meta.env.VITE_DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
  }

  // 发送聊天请求
  async sendMessage(
    messages: ChatMessage[],
    model: string = 'deepseek-chat',
    onStream?: (chunk: string) => void
  ): Promise<string> {
    // 获取实际的 API 模型名称
    const apiModel = getApiModel(model)
    
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))

    // 添加系统提示
    const systemMessage = {
      role: 'system',
      content: 'You are a helpful AI assistant called Smart AI. You are knowledgeable, friendly, and always try to provide accurate and helpful responses. You can help with various tasks including answering questions, writing content, coding, analysis, and more.'
    }

    const allMessages = [systemMessage, ...formattedMessages]

    try {
      // 如果提供了流式回调，使用流式响应
      if (onStream) {
        return await this.streamChat(allMessages, apiModel, onStream)
      }

      // 否则使用普通请求
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
      // 如果生成失败，使用消息的前20个字符作为标题
      return firstMessage.slice(0, 20) + (firstMessage.length > 20 ? '...' : '')
    }
  }
}

// 导出单例实例
export const aiChatService = new AIChatService()
