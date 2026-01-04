import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

// 路由元数据类型
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresAdmin?: boolean
    title?: string
  }
}

const routes: RouteRecordRaw[] = [
  // Public routes - 公开页面
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Smart AI - 智能AI助手' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: '登录 - Smart AI' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { title: '注册 - Smart AI' },
  },
  {
    path: '/pricing',
    name: 'pricing',
    component: () => import('../views/PricingView.vue'),
    meta: { title: '价格方案 - Smart AI' },
  },
  
  // User routes - 需要登录
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/ChatView.vue'),
    meta: { requiresAuth: true, title: 'AI 对话 - Smart AI' },
  },
  {
    path: '/image-generator',
    name: 'image-generator',
    component: () => import('../views/ImageGeneratorView.vue'),
    meta: { requiresAuth: true, title: '图像生成 - Smart AI' },
  },
  {
    path: '/assistants',
    name: 'assistants',
    component: () => import('../views/AssistantsView.vue'),
    meta: { requiresAuth: true, title: 'AI 助手 - Smart AI' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { requiresAuth: true, title: '设置 - Smart AI' },
  },
  {
    path: '/image-library',
    name: 'image-library',
    component: () => import('../views/ImageLibraryView.vue'),
    meta: { requiresAuth: true, title: '图片库 - Smart AI' },
  },
  {
    path: '/search-engine',
    name: 'search-engine',
    component: () => import('../views/SearchEngineView.vue'),
    meta: { requiresAuth: true, title: 'AI 搜索 - Smart AI' },
  },
  
  // Admin routes - 需要管理员权限
  {
    path: '/admin',
    name: 'admin',
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('../views/admin/DashboardView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: '管理后台 - Smart AI' },
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('../views/admin/UsersView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: '用户管理 - Smart AI' },
  },
  {
    path: '/admin/subscriptions',
    name: 'admin-subscriptions',
    component: () => import('../views/admin/SubscriptionsView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: '订阅管理 - Smart AI' },
  },
  {
    path: '/admin/payments',
    name: 'admin-payments',
    component: () => import('../views/admin/PaymentsView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: '支付管理 - Smart AI' },
  },
  {
    path: '/admin/assistants',
    name: 'admin-assistants',
    component: () => import('../views/admin/AssistantsView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: '助手管理 - Smart AI' },
  },
  {
    path: '/admin/content',
    name: 'admin-content',
    component: () => import('../views/admin/ContentView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: '内容管理 - Smart AI' },
  },
  {
    path: '/admin/analytics',
    name: 'admin-analytics',
    component: () => import('../views/admin/AnalyticsView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: '数据分析 - Smart AI' },
  },
  {
    path: '/admin/logs',
    name: 'admin-logs',
    component: () => import('../views/admin/LogsView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: '系统日志 - Smart AI' },
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: () => import('../views/admin/AdminSettingsView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true, title: '系统设置 - Smart AI' },
  },
  
  // 404 catch-all
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: '页面未找到 - Smart AI' },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 等待 Firebase Auth 初始化完成
let authReady = false
const authReadyPromise = new Promise<void>((resolve) => {
  const unsubscribe = onAuthStateChanged(auth, () => {
    authReady = true
    unsubscribe()
    resolve()
  })
})

// 获取当前用户角色（从 localStorage 快速获取，用于路由守卫）
function getUserRole(): string | null {
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      return user.role || 'user'
    }
  } catch (e) {
    console.error('Error parsing user from localStorage:', e)
  }
  return null
}

// 检查用户是否已认证
function isAuthenticated(): boolean {
  return auth.currentUser !== null || localStorage.getItem('user') !== null
}

// 检查用户是否是管理员
function isAdmin(): boolean {
  const role = getUserRole()
  return role === 'admin'
}

// Navigation guard - 路由守卫
router.beforeEach(async (
  to: RouteLocationNormalized, 
  _from: RouteLocationNormalized, 
  next: NavigationGuardNext
) => {
  // 等待 Firebase Auth 初始化
  if (!authReady) {
    await authReadyPromise
  }

  // 更新页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!isAuthenticated()) {
      // 未登录，重定向到登录页
      next({ 
        name: 'login', 
        query: { redirect: to.fullPath } 
      })
      return
    }

    // 检查是否需要管理员权限
    if (to.meta.requiresAdmin) {
      if (!isAdmin()) {
        // 不是管理员，重定向到首页
        console.warn('Access denied: Admin role required')
        next({ name: 'home' })
        return
      }
    }
  }

  // 如果已登录用户访问登录/注册页，重定向到聊天页
  if ((to.name === 'login' || to.name === 'register') && isAuthenticated()) {
    next({ name: 'chat' })
    return
  }

  next()
})

// 路由错误处理
router.onError((error) => {
  console.error('Router error:', error)
  // 如果是动态导入失败，可能是网络问题，刷新页面
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.location.reload()
  }
})

export default router
