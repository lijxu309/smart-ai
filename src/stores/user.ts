import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

// 用户角色类型
export type UserRole = 'user' | 'admin' | 'moderator'

// 用户配置文件类型
export interface UserProfile {
  uid: string
  email: string
  displayName: string
  role: UserRole
  plan: 'free' | 'basic' | 'pro' | 'enterprise'
  messageQuota: number
  messagesUsed: number
  imageQuota: number
  imagesGenerated: number
  createdAt: Date
  updatedAt?: Date
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const profile = ref<UserProfile | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => user.value !== null)
  const userEmail = computed(() => user.value?.email || '')
  const userName = computed(() => profile.value?.displayName || user.value?.displayName || user.value?.email?.split('@')[0] || 'User')
  const userRole = computed(() => profile.value?.role || 'user')
  const isAdmin = computed(() => profile.value?.role === 'admin')

  // 从 Firestore 获取用户配置文件
  const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDocRef = doc(db, 'users', uid)
      const userDoc = await getDoc(userDocRef)
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        return {
          uid,
          email: data.email || '',
          displayName: data.displayName || '',
          role: data.role || 'user',
          plan: data.plan || 'free',
          messageQuota: data.messageQuota || 100,
          messagesUsed: data.messagesUsed || 0,
          imageQuota: data.imageQuota || 10,
          imagesGenerated: data.imagesGenerated || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate(),
        }
      }
      return null
    } catch (e) {
      console.error('Error fetching user profile:', e)
      return null
    }
  }

  // 创建默认用户配置文件
  const createUserProfile = async (firebaseUser: User): Promise<UserProfile> => {
    const defaultProfile: Omit<UserProfile, 'createdAt' | 'updatedAt'> & { createdAt: any } = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      role: 'user',
      plan: 'free',
      messageQuota: 100,
      messagesUsed: 0,
      imageQuota: 10,
      imagesGenerated: 0,
      createdAt: serverTimestamp(),
    }

    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid)
      await setDoc(userDocRef, defaultProfile)
      
      return {
        ...defaultProfile,
        createdAt: new Date(),
      }
    } catch (e) {
      console.error('Error creating user profile:', e)
      // 返回默认配置，即使保存失败
      return {
        ...defaultProfile,
        createdAt: new Date(),
      }
    }
  }

  // Initialize auth state listener
  const initAuth = () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      user.value = firebaseUser
      
      if (firebaseUser) {
        // 获取或创建用户配置文件
        let userProfile = await fetchUserProfile(firebaseUser.uid)
        if (!userProfile) {
          userProfile = await createUserProfile(firebaseUser)
        }
        profile.value = userProfile
        
        // 保存到 localStorage 用于路由守卫快速检查
        localStorage.setItem('user', JSON.stringify({ 
          uid: firebaseUser.uid, 
          email: firebaseUser.email,
          role: userProfile.role 
        }))
      } else {
        profile.value = null
        localStorage.removeItem('user')
      }
      
      loading.value = false
    })
  }

  // Email/Password login
  const login = async (email: string, password: string) => {
    try {
      error.value = null
      loading.value = true
      const result = await signInWithEmailAndPassword(auth, email, password)
      user.value = result.user
      
      // 获取用户配置文件
      const userProfile = await fetchUserProfile(result.user.uid)
      if (userProfile) {
        profile.value = userProfile
      }
      
      return true
    } catch (e: any) {
      error.value = getErrorMessage(e.code)
      return false
    } finally {
      loading.value = false
    }
  }

  // Email/Password register
  const register = async (email: string, password: string, displayName?: string) => {
    try {
      error.value = null
      loading.value = true
      const result = await createUserWithEmailAndPassword(auth, email, password)
      user.value = result.user
      
      // 创建用户配置文件
      const userProfile = await createUserProfile(result.user)
      if (displayName) {
        userProfile.displayName = displayName
      }
      profile.value = userProfile
      
      return true
    } catch (e: any) {
      error.value = getErrorMessage(e.code)
      return false
    } finally {
      loading.value = false
    }
  }

  // Google login
  const loginWithGoogle = async () => {
    try {
      error.value = null
      loading.value = true
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      user.value = result.user
      
      // 获取或创建用户配置文件
      let userProfile = await fetchUserProfile(result.user.uid)
      if (!userProfile) {
        userProfile = await createUserProfile(result.user)
      }
      profile.value = userProfile
      
      return true
    } catch (e: any) {
      error.value = getErrorMessage(e.code)
      return false
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
      profile.value = null
      localStorage.removeItem('user')
    } catch (e: any) {
      error.value = e.message
    }
  }

  // 清除错误
  const clearError = () => {
    error.value = null
  }

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated,
    userEmail,
    userName,
    userRole,
    isAdmin,
    initAuth,
    login,
    register,
    loginWithGoogle,
    logout,
    clearError,
    fetchUserProfile,
  }
})

// 错误消息映射
function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/email-already-in-use': '该邮箱已被注册',
    'auth/invalid-email': '邮箱格式不正确',
    'auth/operation-not-allowed': '该操作不被允许',
    'auth/weak-password': '密码强度太弱，请使用至少6位字符',
    'auth/user-disabled': '该账户已被禁用',
    'auth/user-not-found': '用户不存在',
    'auth/wrong-password': '密码错误',
    'auth/invalid-credential': '登录凭证无效',
    'auth/too-many-requests': '请求次数过多，请稍后再试',
    'auth/network-request-failed': '网络连接失败，请检查网络',
    'auth/popup-closed-by-user': '登录窗口被关闭',
    'auth/cancelled-popup-request': '登录请求被取消',
  }
  return messages[code] || '操作失败，请重试'
}
