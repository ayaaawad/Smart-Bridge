<template>
  <div class="min-h-screen bg-gradient-to-b from-sky-100 via-sky-200 to-cyan-100 flex items-center justify-center p-4">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-24 left-20 h-64 w-64 rounded-full bg-rose-300/20 blur-3xl animate-pulse"></div>
      <div class="absolute bottom-16 right-16 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="relative w-full max-w-md">
      <div class="rounded-2xl border border-sky-200 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">
        <div class="mb-8 text-center">
          <h1 class="mb-2 bg-gradient-to-r from-rose-600 to-red-500 bg-clip-text text-4xl font-bold text-transparent">
            🛡️ Admin Login
          </h1>
          <p class="text-slate-600">Email and password are required to open Admin Dashboard</p>
        </div>

        <form @submit.prevent="handleAdminLogin" class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Admin Email</label>
            <input
              v-model="email"
              type="email"
              autocomplete="username"
              placeholder="admin@smartbridge.com"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300/40"
              required
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Admin Password</label>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300/40"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="mt-2 text-xs font-semibold text-rose-600 hover:text-rose-700"
            >
              {{ showPassword ? 'Hide Password' : 'Show Password' }}
            </button>
          </div>

          <div v-if="error" class="rounded-lg border border-red-300 bg-red-50 p-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-red-500 px-4 py-3 font-bold text-white transition-all duration-300 hover:from-rose-500 hover:to-red-400 disabled:from-slate-400 disabled:to-slate-500"
          >
            <span v-if="loading" class="animate-spin">⏳</span>
            <span v-else>Open Admin Dashboard</span>
          </button>
        </form>

        <div class="mt-6 rounded-lg border border-sky-200 bg-sky-50 p-4 text-center">
          <button
            type="button"
            @click="router.push({ name: 'dashboard' })"
            class="text-sm font-semibold text-sky-700 hover:text-sky-800"
          >
            Back to User Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

const handleAdminLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    await authStore.login(email.value.trim(), password.value)

    if (!authStore.isAdmin) {
      authStore.logout()
      error.value = 'Admin credentials are required for Admin Dashboard access.'
      return
    }

    const redirectPath = typeof route.query.redirect === 'string' ? route.query.redirect : null
    if (redirectPath) {
      router.push(redirectPath)
    } else {
      router.push({ name: 'admin' })
    }
  } catch (err) {
    error.value = 'Invalid admin email or password.'
    console.error('Admin login failed:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.35;
  }
}

.animate-pulse {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-1000 {
  animation-delay: 1s;
}
</style>
