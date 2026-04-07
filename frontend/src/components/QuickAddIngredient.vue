<template>
  <transition name="modal">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="close"
    >
      <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-bridge-600/50">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-white">Add Ingredient</h3>
          <button
            @click="close"
            class="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Ingredient Name *</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="e.g., Tomato"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bridge-500"
              required
            />
          </div>

          <!-- Quantity -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Quantity *</label>
            <input
              v-model.number="form.quantity"
              type="number"
              step="0.1"
              placeholder="5"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bridge-500"
              required
            />
          </div>

          <!-- Unit -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Unit *</label>
            <select
              v-model="form.unit"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-bridge-500"
              required
            >
              <option value="">Select unit</option>
              <option value="pieces">Pieces</option>
              <option value="grams">Grams</option>
              <option value="kg">Kg</option>
              <option value="lbs">Lbs</option>
              <option value="cups">Cups</option>
              <option value="tbsp">Tbsp</option>
              <option value="tsp">Tsp</option>
              <option value="ml">Ml</option>
              <option value="liters">Liters</option>
              <option value="bottle">Bottle</option>
              <option value="block">Block</option>
            </select>
          </div>

          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Category *</label>
            <select
              v-model="form.category"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-bridge-500"
              required
            >
              <option value="">Select category</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Proteins">Proteins</option>
              <option value="Dairy">Dairy</option>
              <option value="Fruits">Fruits</option>
              <option value="Grains">Grains</option>
              <option value="Condiments">Condiments</option>
              <option value="Beverages">Beverages</option>
              <option value="Pantry">Pantry</option>
            </select>
          </div>

          <!-- Expiry Date -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Expiry Date</label>
            <input
              v-model="form.expiryDate"
              type="date"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-bridge-500"
            />
          </div>

          <!-- Bridge Location -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Storage Location</label>
            <input
              v-model="form.bridgeLocation"
              type="text"
              placeholder="e.g., Shelf A, Freezer"
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-bridge-500"
            />
          </div>

          <!-- Error message -->
          <div v-if="error" class="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
            {{ error }}
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="close"
              class="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 px-4 py-2 bg-bridge-600 hover:bg-bridge-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors"
            >
              {{ loading ? 'Adding...' : 'Add Ingredient' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useInventoryStore } from '../stores/inventory'

const inventoryStore = useInventoryStore()

const isOpen = ref(false)
const loading = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  quantity: 1,
  unit: 'pieces',
  category: 'Vegetables',
  expiryDate: '',
  bridgeLocation: ''
})

const open = () => {
  isOpen.value = true
  error.value = ''
  resetForm()
}

const close = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  form.name = ''
  form.quantity = 1
  form.unit = 'pieces'
  form.category = 'Vegetables'
  form.expiryDate = ''
  form.bridgeLocation = ''
}

const submitForm = async () => {
  error.value = ''

  if (!form.name.trim()) {
    error.value = 'Ingredient name is required'
    return
  }

  if (form.quantity <= 0) {
    error.value = 'Quantity must be greater than 0'
    return
  }

  loading.value = true

  try {
    const ingredientData = {
      name: form.name.trim(),
      quantity: form.quantity,
      unit: form.unit || 'pieces',
      category: form.category,
      expiryDate: form.expiryDate ? new Date(form.expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      bridgeLocation: form.bridgeLocation || 'Pantry'
    }

    await inventoryStore.addIngredient(ingredientData)
    close()
  } catch (err) {
    error.value = err.message || 'Failed to add ingredient'
  } finally {
    loading.value = false
  }
}

defineExpose({
  open,
  close
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
