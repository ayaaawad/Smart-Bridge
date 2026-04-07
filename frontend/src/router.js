import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/Login.vue'),
    meta: {
      requiresAuth: false,
      requiresAdmin: false,
    }
  },
  {
    path: '/owner-admin-login',
    name: 'owner-admin-login',
    component: () => import('./views/AdminLogin.vue'),
    meta: {
      requiresAuth: false,
      requiresAdmin: false,
      adminLoginOnly: true,
    }
  },
  {
    path: '/admin-login',
    redirect: { name: 'owner-admin-login' },
  },
  {
    path: '/',
    name: 'dashboard',
    component: () => import('./views/Dashboard.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('./views/AdminDashboard.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Validate token on each navigation
  if (authStore.isAuthenticated) {
    const isValid = await authStore.validateToken()
    if (!isValid) {
      authStore.logout()
    }
  }

  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin
  const adminLoginOnly = to.meta.adminLoginOnly

  if (adminLoginOnly && authStore.isAuthenticated && authStore.isAdmin) {
    return next({ name: 'admin' })
  }

  if (adminLoginOnly && authStore.isAuthenticated && !authStore.isAdmin) {
    return next({ name: 'dashboard' })
  }

  // Require explicit admin authentication for admin routes.
  if (requiresAdmin) {
    if (!authStore.isAuthenticated || !authStore.isAdmin) {
      return next({ name: 'owner-admin-login', query: { redirect: to.path } })
    }
  }

  // If route requires authentication
  if (requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next({ name: 'login', query: { redirect: to.path } })
    }
  }

  // If authenticated and trying to access login, redirect to dashboard
  if (to.name === 'login' && authStore.isAuthenticated) {
    return next({ name: authStore.isAdmin ? 'admin' : 'dashboard' })
  }

  next()
})

export default router
