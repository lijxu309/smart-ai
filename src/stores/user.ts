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
import { auth } from '../firebase'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => user.value !== null)
  const userEmail = computed(() => user.value?.email || '')
  const userName = computed(() => user.value?.displayName || user.value?.email?.split('@')[0] || 'User')

  // Initialize auth state listener
  const initAuth = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
      if (firebaseUser) {
        localStorage.setItem('user', JSON.stringify({ uid: firebaseUser.uid, email: firebaseUser.email }))
      } else {
        localStorage.removeItem('user')
      }
    })
  }

  // Email/Password login
  const login = async (email: string, password: string) => {
    try {
      error.value = null
      loading.value = true
      const result = await signInWithEmailAndPassword(auth, email, password)
      user.value = result.user
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Email/Password register
  const register = async (email: string, password: string) => {
    try {
      error.value = null
      loading.value = true
      const result = await createUserWithEmailAndPassword(auth, email, password)
      user.value = result.user
      return true
    } catch (e: any) {
      error.value = e.message
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
      return true
    } catch (e: any) {
      error.value = e.message
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
      localStorage.removeItem('user')
    } catch (e: any) {
      error.value = e.message
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    userEmail,
    userName,
    initAuth,
    login,
    register,
    loginWithGoogle,
    logout,
  }
})
