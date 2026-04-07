<template>
  <div class="min-h-screen bg-gradient-to-b from-sky-100 via-sky-200 to-cyan-100">
    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-sky-200 bg-white/85 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-cyan-600">
          🌉 SmartBridge
        </div>
        <p class="text-sm font-semibold text-slate-600">User Ingredient Manager</p>
      </div>
    </header>

    <!-- Main content with padding for header -->
    <div class="pt-24 p-4">
      <BridgeDashboard />
    </div>
  </div>
</template>

<script setup>
import BridgeDashboard from './BridgeDashboard.vue'
</script>
