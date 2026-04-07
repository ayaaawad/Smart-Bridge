<template>
  <div class="min-h-screen bg-gradient-to-b from-sky-100 via-sky-200 to-cyan-100 flex items-center justify-center p-4">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 right-20 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 left-20 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl animate-pulse delay-1000"></div>
    </div>

    <!-- Login Card -->
    <div class="relative w-full max-w-md">
      <div class="rounded-2xl border border-sky-200 bg-white/85 p-8 shadow-2xl backdrop-blur-xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="mb-2 bg-gradient-to-r from-sky-700 to-cyan-600 bg-clip-text text-4xl font-bold text-transparent">
            🌉 SmartBridge
          </h1>
          <p class="text-slate-600">User Access</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email Input -->
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              v-model="username"
              type="text"
              placeholder="awadaya18@gmail.com"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300/40"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label class="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 placeholder-slate-400 transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300/40"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p class="text-red-300 text-sm">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-cyan-600 px-4 py-3 font-bold text-white transition-all duration-300 hover:from-sky-500 hover:to-cyan-500 disabled:from-slate-400 disabled:to-slate-500"
          >
            <span v-if="loading" class="animate-spin">⏳</span>
            <span v-else>🔑 User Login</span>
          </button>
        </form>

        <div class="mt-6 rounded-lg border border-sky-200 bg-sky-50 p-4">
          <p class="text-xs text-sky-700">
            Need admin access? Use the dedicated Admin Login page.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6">
        <p class="text-sm text-slate-600">Preparing your kitchen...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    await authStore.login(username.value.trim(), password.value)

    if (authStore.isAuthenticated) {
      const redirectPath = typeof route.query.redirect === 'string' ? route.query.redirect : null
      if (redirectPath) {
        router.push(redirectPath)
      } else {
        router.push({ name: 'dashboard' })
      }
    }
  } catch (err) {
    error.value = 'Invalid credentials'
    console.error('Login failed:', err)
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
    opacity: 0.4;
  }
}

.animate-pulse {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-1000 {
  animation-delay: 1s;
}
</style>
