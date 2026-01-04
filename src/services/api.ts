import { getFunctions, httpsCallable } from 'firebase/functions'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { firebaseApp } from '../firebase'

const functions = getFunctions(firebaseApp)
const storage = getStorage(firebaseApp)

// Chat API
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatCompletionResponse {
  success: boolean
  message: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export const chatCompletion = async (
  messages: ChatMessage[],
  model: string = 'gpt-4',
  conversationId?: string
): Promise<ChatCompletionResponse> => {
  const callable = httpsCallable<
    { messages: ChatMessage[]; model: string; conversationId?: string },
    ChatCompletionResponse
  >(functions, 'chatCompletion')

  const result = await callable({ messages, model, conversationId })
  return result.data
}

// Conversation API
export interface CreateConversationResponse {
  success: boolean
  conversationId: string
}

export const createConversation = async (
  title: string = 'New Chat'
): Promise<CreateConversationResponse> => {
  const callable = httpsCallable<
    { title: string },
    CreateConversationResponse
  >(functions, 'createConversation')

  const result = await callable({ title })
  return result.data
}

// Image Generation API
export interface GenerateImageResponse {
  success: boolean
  imageUrl: string
  revisedPrompt?: string
}

export const generateImage = async (
  prompt: string,
  options: {
    size?: '1024x1024' | '1792x1024' | '1024x1792'
    quality?: 'standard' | 'hd'
    style?: 'vivid' | 'natural'
  } = {}
): Promise<GenerateImageResponse> => {
  const callable = httpsCallable<
    { prompt: string; size?: string; quality?: string; style?: string },
    GenerateImageResponse
  >(functions, 'generateImage')

  const result = await callable({
    prompt,
    size: options.size || '1024x1024',
    quality: options.quality || 'standard',
    style: options.style || 'vivid',
  })
  return result.data
}

// User Profile API
export interface UserProfile {
  email: string
  displayName: string
  plan: 'free' | 'pro' | 'enterprise'
  messageQuota: number
  messagesUsed: number
  imageQuota: number
  imagesGenerated: number
  settings?: UserSettings
  createdAt: Date
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system'
  language: string
  defaultModel: string
  notifications: boolean
  speechVoice: string
  speechRate: number
}

export interface GetUserProfileResponse {
  success: boolean
  profile: UserProfile
}

export const getUserProfile = async (): Promise<GetUserProfileResponse> => {
  const callable = httpsCallable<void, GetUserProfileResponse>(
    functions,
    'getUserProfile'
  )

  const result = await callable()
  return result.data
}

export const updateUserSettings = async (
  settings: Partial<UserSettings>
): Promise<{ success: boolean }> => {
  const callable = httpsCallable<
    { settings: Partial<UserSettings> },
    { success: boolean }
  >(functions, 'updateUserSettings')

  const result = await callable({ settings })
  return result.data
}

// Text-to-Speech API
export interface TextToSpeechResponse {
  success: boolean
  audio: string // base64 encoded
  format: string
}

export const textToSpeech = async (
  text: string,
  options: {
    voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
    speed?: number
  } = {}
): Promise<TextToSpeechResponse> => {
  const callable = httpsCallable<
    { text: string; voice?: string; speed?: number },
    TextToSpeechResponse
  >(functions, 'textToSpeech')

  const result = await callable({
    text,
    voice: options.voice || 'alloy',
    speed: options.speed || 1.0,
  })
  return result.data
}

// Speech-to-Text API
export interface SpeechToTextResponse {
  success: boolean
  text: string
}

export const speechToText = async (
  audioBase64: string,
  language: string = 'en'
): Promise<SpeechToTextResponse> => {
  const callable = httpsCallable<
    { audioBase64: string; language: string },
    SpeechToTextResponse
  >(functions, 'speechToText')

  const result = await callable({ audioBase64, language })
  return result.data
}

// File Upload API
export const uploadFile = async (
  file: File,
  userId: string,
  path: string = 'uploads'
): Promise<string> => {
  const storageRef = ref(storage, `users/${userId}/${path}/${file.name}`)
  await uploadBytes(storageRef, file)
  const downloadUrl = await getDownloadURL(storageRef)
  return downloadUrl
}

// Helper function to play audio from base64
export const playAudioFromBase64 = (base64Audio: string): void => {
  const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`)
  audio.play()
}

// Helper function to record audio
export const recordAudio = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream)
        const audioChunks: Blob[] = []

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
          const reader = new FileReader()
          reader.onloadend = () => {
            const result = reader.result as string
            const base64 = result.split(',')[1] || ''
            resolve(base64)
          }
          reader.readAsDataURL(audioBlob)
          stream.getTracks().forEach((track) => track.stop())
        }

        // Record for 5 seconds max
        mediaRecorder.start()
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop()
          }
        }, 5000)
      })
      .catch(reject)
  })
}
