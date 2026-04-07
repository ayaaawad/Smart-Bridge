<template>
  <div class="w-full rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-100 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <span class="text-4xl">👨‍🍳</span>
        <div>
          <h3 class="text-2xl font-bold text-slate-900">What Can the Bridge Cook?</h3>
          <p class="text-sm text-emerald-700">Smart recipe matching based on your inventory</p>
        </div>
      </div>
      <button
        @click="handleSuggestRecipes"
        :disabled="recipesStore.loading"
        class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
      >
        <span v-if="!recipesStore.loading">🔍 Find Recipes</span>
        <span v-else>⏳ Searching...</span>
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="recipesStore.error" class="mb-4 rounded border border-red-300 bg-red-100 p-3 text-red-700">
      ⚠️ {{ recipesStore.error }}
    </div>

    <!-- Recipes Grid -->
    <div v-if="recipesStore.matchableRecipes.length > 0" class="space-y-4">
      <p class="mb-4 font-semibold text-emerald-700">
        ✨ You can make {{ recipesStore.matchableRecipes.length }} recipe{{ recipesStore.matchableRecipes.length !== 1 ? 's' : '' }}!
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="recipe in recipesStore.matchableRecipes"
          :key="recipe.id"
          class="rounded-lg border border-emerald-300 bg-gradient-to-br from-emerald-100 to-emerald-200 p-5 transition-all duration-300 hover:border-emerald-500"
        >
          <!-- Recipe Icon & Title -->
          <div class="flex items-start gap-3 mb-3">
            <span class="text-3xl">{{ recipe.imageURL }}</span>
            <div class="flex-1">
              <h4 class="text-lg font-bold text-slate-900">{{ recipe.title }}</h4>
              <p class="mt-1 text-xs text-slate-600">{{ recipe.description }}</p>
            </div>
          </div>

          <!-- Ingredients Checklist -->
          <div class="mb-4 border-t border-emerald-300 pt-3">
            <p class="mb-2 text-xs font-bold text-emerald-700">INGREDIENTS:</p>
            <div class="space-y-1">
              <div
                v-for="ingredient in recipe.recipeIngredients"
                :key="ingredient.id"
                class="flex items-center gap-2 text-sm"
              >
                <span class="text-lg">
                  {{ hasIngredient(ingredient.ingredientName) ? '✅' : '❌' }}
                </span>
                <span :class="hasIngredient(ingredient.ingredientName) ? 'text-slate-700' : 'text-red-600'">
                  {{ ingredient.amountRequired }} {{ ingredient.unit }} {{ ingredient.ingredientName }}
                </span>
              </div>
            </div>
          </div>

          <!-- Match Percentage -->
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs text-emerald-700">Match Rate</span>
              <span class="text-sm font-bold text-emerald-700">{{ getMatchPercentage(recipe) }}%</span>
            </div>
            <div class="h-2 w-full overflow-hidden rounded-full bg-emerald-300/60">
              <div
                class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"
                :style="{ width: getMatchPercentage(recipe) + '%' }"
              ></div>
            </div>
          </div>

          <!-- Action Button -->
          <button
            @click="startCooking(recipe)"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-sky-600 to-cyan-600 py-2 font-bold text-white transition-colors hover:from-sky-500 hover:to-cyan-500"
          >
            🍳 Start Cooking
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <p class="mb-3 text-lg text-emerald-700">
        {{ suggestionsRequested ? 'No recipes match your inventory yet.' : 'Click "Find Recipes" to discover what you can cook!' }}
      </p>
      <p class="text-sm text-emerald-600">Add more ingredients to unlock more recipes</p>
    </div>
  </div>

  <!-- Cooking Modal -->
  <CookingModal
    ref="cookingModal"
    :recipe="selectedRecipe"
    @cooking-finished="handleCookingFinished"
    @close="selectedRecipe = null"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInventoryStore } from '../stores/inventory'
import { useRecipesStore } from '../stores/recipes'
import CookingModal from './CookingModal.vue'

const inventoryStore = useInventoryStore()
const recipesStore = useRecipesStore()
const suggestionsRequested = ref(false)
const cookingModal = ref(null)
const selectedRecipe = ref(null)

const hasIngredient = (ingredientName) => {
  return inventoryStore.ingredients.some(
    item => item.name.toLowerCase() === ingredientName.toLowerCase()
  )
}

const getMatchPercentage = (recipe) => {
  if (!recipe.recipeIngredients || recipe.recipeIngredients.length === 0) {
    return 100
  }

  const requiredCount = recipe.recipeIngredients.length
  const matchedCount = recipe.recipeIngredients.filter(ri =>
    hasIngredient(ri.ingredientName)
  ).length

  return Math.round((matchedCount / requiredCount) * 100)
}

const handleSuggestRecipes = async () => {
  suggestionsRequested.value = true
  await recipesStore.findMatchableRecipes()
}

const startCooking = (recipe) => {
  selectedRecipe.value = recipe
  cookingModal.value?.open(recipe)
}

const handleCookingFinished = async (recipe) => {
  // Refresh inventory after cooking
  await inventoryStore.fetchIngredients()
  await recipesStore.findMatchableRecipes()
}
</script>
