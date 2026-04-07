<template>
  <div class="rounded-xl border border-sky-200 bg-gradient-to-br from-white to-sky-50 p-6 transition-all duration-300 hover:border-sky-400">
    <!-- Category Header -->
    <div class="flex items-center gap-3 mb-4">
      <div class="text-3xl">{{ categoryEmojis[category] || '📦' }}</div>
      <h4 class="text-xl font-bold text-slate-900">{{ category }}</h4>
      <span class="ml-auto rounded-full bg-sky-600 px-3 py-1 text-xs font-bold text-white">
        {{ items.length }}
      </span>
    </div>

    <!-- Items List -->
    <div class="space-y-3">
      <div 
        v-for="item in items"
        :key="item.id"
        class="rounded-lg border border-sky-100 bg-white p-3 transition-colors hover:bg-sky-50"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <p class="font-medium text-slate-800">{{ item.name }}</p>
            <p class="text-xs text-slate-500">{{ item.quantity }} {{ item.unit }}</p>
            <p class="mt-1 text-xs text-sky-700">📍 {{ item.bridgeLocation }}</p>
          </div>
          <div class="text-right">
            <p :class="[
              'text-xs font-bold px-2 py-1 rounded mb-2 inline-block',
              isExpiringSoon(item.expiryDate) 
                ? 'bg-red-100 text-red-700'
                : 'bg-emerald-100 text-emerald-700'
            ]">
              {{ formatDate(item.expiryDate) }}
            </p>
            <button
              type="button"
              :disabled="removingId === item.id"
              @click="removeIngredient(item)"
              class="block ml-auto rounded border border-red-300 bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
            >
              {{ removingId === item.id ? 'Removing...' : 'Remove' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useInventoryStore } from '../stores/inventory'

defineProps({
  category: String,
  items: Array
})

const inventoryStore = useInventoryStore()
const removingId = ref(null)

const categoryEmojis = {
  'Vegetables': '🥬',
  'Proteins': '🥩',
  'Dairy': '🧀',
  'Grains': '🌾',
  'Fruits': '🍎',
  'Condiments': '🍯',
  'Beverages': '🥤',
  'Pantry': '📦'
}

const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const isExpiringSoon = (date) => {
  const today = new Date()
  const expiry = new Date(date)
  const daysLeft = Math.floor((expiry - today) / (1000 * 60 * 60 * 24))
  return daysLeft <= 3
}

const removeIngredient = async (item) => {
  const confirmed = window.confirm(`Remove ${item.name}?`)
  if (!confirmed) {
    return
  }

  removingId.value = item.id
  try {
    await inventoryStore.removeIngredient(item.id)
  } catch (error) {
    console.error('Failed to remove ingredient:', error)
  } finally {
    removingId.value = null
  }
}
</script>
