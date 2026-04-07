<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header with Add Button -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-4xl font-bold text-slate-900 mb-2">📦 Your Inventory</h2>
        <p class="text-slate-600">{{ inventoryStore.ingredients.length }} items stored</p>
      </div>
      <button
        @click="$refs.addIngredientModal.open()"
        class="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
      >
        ➕ Add Ingredient
      </button>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <StatCard 
        title="Total Items"
        :value="inventoryStore.ingredients.length"
        icon="📊"
        color="blue"
      />
      <StatCard 
        title="Near Expiry"
        :value="inventoryStore.nearExpiryItems.length"
        icon="⏰"
        color="yellow"
      />
      <StatCard 
        title="Expired"
        :value="inventoryStore.expiredItems.length"
        icon="🛑"
        color="red"
      />
      <StatCard 
        title="Categories"
        :value="Object.keys(inventoryStore.ingredientsByCategory).length"
        icon="📁"
        color="sky"
      />
      <StatCard 
        title="Recipes Ready"
        :value="recipesStore.matchableRecipes.length"
        icon="👨‍🍳"
        color="green"
      />
    </div>

    <!-- Expiring Items Alert -->
    <div v-if="inventoryStore.expiredItems.length > 0 || inventoryStore.nearExpiryItems.length > 0" class="mb-8">
      <ExpirationWarning
        :expired-items="inventoryStore.expiredItems"
        :near-expiry-items="inventoryStore.nearExpiryItems"
      />
    </div>

    <!-- Recipe Suggester Section -->
    <div class="mb-8">
      <RecipeSuggester />
    </div>

    <!-- Inventory by Category -->
    <div class="mb-8">
      <h3 class="text-2xl font-bold text-slate-900 mb-4">📋 By Category</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CategoryCard 
          v-for="(items, category) in inventoryStore.ingredientsByCategory"
          :key="category"
          :category="category"
          :items="items"
        />
      </div>
    </div>

    <!-- Quick Add Ingredient Modal -->
    <QuickAddIngredient ref="addIngredientModal" />
  </div>
</template>

<script setup>
import { useInventoryStore } from '../stores/inventory'
import { useRecipesStore } from '../stores/recipes'
import StatCard from './StatCard.vue'
import ExpirationWarning from './ExpirationWarning.vue'
import CategoryCard from './CategoryCard.vue'
import RecipeSuggester from './RecipeSuggester.vue'
import QuickAddIngredient from './QuickAddIngredient.vue'

const inventoryStore = useInventoryStore()
const recipesStore = useRecipesStore()
</script>
