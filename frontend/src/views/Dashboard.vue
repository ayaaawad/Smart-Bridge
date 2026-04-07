<template>
  <div class="min-h-screen bg-gradient-to-b from-sky-100 via-sky-200 to-cyan-100">
    <!-- Header with logout -->
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-sky-200 bg-white/85 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-cyan-600">
          🌉 SmartBridge
        </div>
        <div class="flex items-center gap-4">
          <span class="font-semibold text-slate-700">{{ authStore.username }}</span>
          <button
            v-if="authStore.isAdmin"
            @click="router.push({ name: 'admin' })"
            class="rounded-lg border border-sky-300 bg-sky-100 px-4 py-2 text-sky-700 transition hover:bg-sky-200"
          >
            ⚙️ Admin Panel
          </button>
          <button
            v-else
            @click="router.push({ name: 'admin-login' })"
            class="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-amber-700 transition hover:bg-amber-100"
          >
            🔐 Admin Login
          </button>
          <button
            @click="handleLogout"
            class="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-red-600 transition hover:bg-red-100"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main content with padding for header -->
    <div class="pt-24 p-4">
      <BridgeDashboard />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BridgeDashboard from './BridgeDashboard.vue'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>
