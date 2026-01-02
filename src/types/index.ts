// User types
export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  plan: 'free' | 'pro' | 'enterprise'
  credits: number
  createdAt: Date
}

// Chat types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  model?: string
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  type: 'image' | 'file'
  url: string
  name: string
  size: number
}

export interface ChatConversation {
  id: string
  title: string
  messages: ChatMessage[]
  model: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

// AI Model types
export interface AIModel {
  id: string
  name: string
  provider: string
  description?: string
  maxTokens: number
  isPremium: boolean
}

// AI Assistant types
export interface AIAssistant {
  id: string
  name: string
  description: string
  avatar: string
  systemPrompt: string
  category: string
  isPopular?: boolean
}

// Image generation types
export interface ImageGenerationRequest {
  prompt: string
  negativePrompt?: string
  style?: string
  size: '256x256' | '512x512' | '1024x1024'
  count: number
}

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  style?: string
  createdAt: Date
}

// Pricing types
export interface PricingPlan {
  id: string
  name: string
  price: number
  period: 'month' | 'year'
  features: string[]
  credits: number
  isPopular?: boolean
}

// Settings types
export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  notifications: boolean
  defaultModel: string
  speechVoice?: string
  speechRate?: number
}
