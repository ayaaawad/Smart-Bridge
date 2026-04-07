<template>
  <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
    <div class="bg-slate-800 border border-bridge-500/30 rounded-2xl w-full max-w-md p-6">
      <h3 class="text-2xl font-bold text-white mb-4">
        {{ ingredient.icon }} {{ ingredient.name }}
      </h3>

      <form @submit.prevent="handleConfirm" class="space-y-4">
        <!-- Quantity Input -->
        <div>
          <label class="block text-sm font-medium text-bridge-200 mb-2">Quantity</label>
          <div class="flex gap-2">
            <input
              v-model.number="quantity"
              type="number"
              step="0.1"
              min="0.1"
              placeholder="Enter quantity"
              class="flex-1 px-4 py-2 bg-slate-700/50 border border-bridge-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-bridge-400"
              required
            />
            <select
              v-model="unit"
              class="px-4 py-2 bg-slate-700/50 border border-bridge-500/30 rounded-lg text-white focus:outline-none focus:border-bridge-400"
            >
              <option>pieces</option>
              <option>grams</option>
              <option>kg</option>
              <option>lbs</option>
              <option>cups</option>
              <option>tbsp</option>
              <option>tsp</option>
              <option>ml</option>
              <option>liters</option>
              <option>bottle</option>
              <option>block</option>
            </select>
          </div>
        </div>

        <!-- Expiry Date Input (Optional) -->
        <div>
          <label class="block text-sm font-medium text-bridge-200 mb-2">Expires In</label>
          <div class="flex gap-2">
            <input
              v-model.number="expiryDays"
              type="number"
              min="1"
              max="365"
              placeholder="Days"
              class="px-4 py-2 bg-slate-700/50 border border-bridge-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-bridge-400"
            />
            <span class="px-4 py-2 bg-slate-700/50 border border-bridge-500/30 rounded-lg text-slate-400 flex items-center">
              days from now
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-2">📅 Will expire on {{ expiryDate }}</p>
        </div>

        <!-- Location Input (Optional) -->
        <div>
          <label class="block text-sm font-medium text-bridge-200 mb-2">Location</label>
          <input
            v-model="location"
            type="text"
            placeholder="e.g., Pantry, Fridge, Freezer"
            class="w-full px-4 py-2 bg-slate-700/50 border border-bridge-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-bridge-400"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 pt-4">
          <button
            type="button"
            @click="$emit('cancel')"
            class="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition"
          >
            ❌ Cancel
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-gradient-to-r from-bridge-600 to-bridge-500 text-white font-bold rounded-lg hover:from-bridge-500 hover:to-bridge-400 transition"
          >
            ✅ Add to Bridge
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  ingredient: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const quantity = ref(1)
const unit = ref('pieces')
const expiryDays = ref(7)
const location = ref('Pantry')

const expiryDate = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + expiryDays.value)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})

const handleConfirm = () => {
  emit('confirm', {
    name: props.ingredient.name,
    icon: props.ingredient.icon,
    category: props.ingredient.category,
    quantity: quantity.value,
    unit: unit.value,
    expiryDate: new Date(Date.now() + expiryDays.value * 24 * 60 * 60 * 1000),
    bridgeLocation: location.value,
  })
}
</script>
