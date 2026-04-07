<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-slate-800 border border-bridge-500/30 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-slate-800/95 border-b border-bridge-500/30 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-white">🥕 Pick an Ingredient</h2>
          <button
            @click="close"
            class="text-slate-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <!-- Search Bar -->
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search ingredients... (e.g., 'Chicken', 'Vegetables')"
          class="w-full px-4 py-3 bg-slate-700/50 border border-bridge-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-bridge-400 focus:ring-2 focus:ring-bridge-400/20 transition"
        />
      </div>

      <!-- Category Tabs -->
      <div class="sticky top-16 bg-slate-800/95 border-b border-bridge-500/30 p-4 flex gap-2 overflow-x-auto">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="['px-4 py-2 rounded-lg transition whitespace-nowrap', selectedCategory === cat ? 'bg-bridge-600 text-white' : 'bg-slate-700/50 text-bridge-200 hover:bg-slate-700']"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Ingredients Grid -->
      <div class="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        <button
          v-for="ingredient in filteredIngredients"
          :key="ingredient.name"
          @click="selectIngredient(ingredient)"
          class="flex items-center gap-3 p-4 bg-slate-700/30 hover:bg-slate-700/60 border border-bridge-500/20 hover:border-bridge-500/50 rounded-lg transition group"
        >
          <span class="text-3xl">{{ ingredient.icon }}</span>
          <span class="text-left">
            <p class="font-semibold text-white">{{ ingredient.name }}</p>
            <p class="text-xs text-slate-400">{{ ingredient.category }}</p>
          </span>
        </button>
      </div>

      <!-- No Results -->
      <div v-if="filteredIngredients.length === 0" class="p-8 text-center">
        <p class="text-slate-400">No ingredients found matching "{{ searchQuery }}"</p>
      </div>

      <!-- Floating Add Button -->
      <div v-if="selectedIngredient" class="sticky bottom-0 bg-slate-800/95 border-t border-bridge-500/30 p-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl">{{ selectedIngredient.icon }}</span>
            <div>
              <p class="font-semibold text-white">{{ selectedIngredient.name }}</p>
              <p class="text-sm text-slate-400">Ready to add</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="selectedIngredient = null"
              class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
            >
              Change
            </button>
            <button
              @click="confirmSelection"
              class="px-6 py-2 bg-gradient-to-r from-bridge-600 to-bridge-500 text-white font-bold rounded-lg hover:from-bridge-500 hover:to-bridge-400 transition"
            >
              ✅ Add to Inventory
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quantity Modal (after ingredient selected) -->
    <QuantityModal
      v-if="showQuantityModal"
      :ingredient="selectedIngredient"
      @confirm="addIngredientToInventory"
      @cancel="showQuantityModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { commonIngredients, getCategories, searchIngredients } from '../data/commonIngredients'
import QuantityModal from './QuantityModal.vue'

const emit = defineEmits(['ingredient-added'])

const isOpen = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedIngredient = ref(null)
const showQuantityModal = ref(false)

const categories = computed(() => {
  const cats = getCategories()
  return ['All', ...cats]
})

const filteredIngredients = computed(() => {
  let results = searchIngredients(searchQuery.value)

  if (selectedCategory.value !== 'All') {
    results = results.filter((ing) => ing.category === selectedCategory.value)
  }

  return results
})

const open = () => {
  isOpen.value = true
  searchQuery.value = ''
  selectedCategory.value = 'All'
  selectedIngredient.value = null
}

const close = () => {
  isOpen.value = false
  selectedIngredient.value = null
  showQuantityModal.value = false
}

const selectIngredient = (ingredient) => {
  selectedIngredient.value = ingredient
}

const confirmSelection = () => {
  showQuantityModal.value = true
}

const addIngredientToInventory = async (ingredientData) => {
  showQuantityModal.value = false
  close()
  // Emit event to parent to add ingredient
  emit('ingredient-added', ingredientData)
}

defineExpose({ open, close })
</script>
