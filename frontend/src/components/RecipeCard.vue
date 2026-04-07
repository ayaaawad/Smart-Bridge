<template>
  <div class="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 border border-emerald-400/30">
    <!-- Recipe Header -->
    <div class="mb-4">
      <div class="text-5xl mb-3">{{ recipe.imageURL }}</div>
      <h3 class="text-xl font-bold">{{ recipe.title }}</h3>
      <p class="text-emerald-100 text-sm mt-2">{{ recipe.description }}</p>
    </div>

    <!-- Ingredients Check -->
    <div class="mb-4 pt-4 border-t border-emerald-400/30">
      <p class="text-xs font-bold text-emerald-200 mb-3">INGREDIENTS NEEDED:</p>
      <div class="space-y-2">
        <div 
          v-for="ingredient in recipe.recipeIngredients"
          :key="ingredient.id"
          class="flex items-center gap-2 text-sm"
        >
          <span class="text-lg">
            {{ hasIngredient(ingredient.ingredientName) ? '✅' : '❌' }}
          </span>
          <span :class="hasIngredient(ingredient.ingredientName) ? 'text-emerald-100' : 'text-red-200'">
            {{ ingredient.amountRequired }} {{ ingredient.unit }} {{ ingredient.ingredientName }}
          </span>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <button class="w-full bg-white text-emerald-700 font-bold py-2 rounded-lg hover:bg-emerald-50 transition-colors">
      👨‍🍳 Cook It!
    </button>
  </div>
</template>

<script setup>
import { useInventoryStore } from '../stores/inventory'

defineProps({
  recipe: Object
})

const inventoryStore = useInventoryStore()

const hasIngredient = (ingredientName) => {
  return inventoryStore.ingredients.some(
    item => item.name.toLowerCase() === ingredientName.toLowerCase()
  )
}
</script>
