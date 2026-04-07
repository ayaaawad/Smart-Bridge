<template>
  <div class="min-h-screen bg-gradient-to-b from-sky-100 via-sky-200 to-cyan-100">
    <!-- Header with navigation -->
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-sky-200 bg-white/85 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-700 to-cyan-600">
          🌉 SmartBridge Admin
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="currentTab = 'dashboard'"
            :class="['px-4 py-2 rounded-lg transition', currentTab === 'dashboard' ? 'bg-sky-600 text-white' : 'text-sky-700 hover:bg-sky-100']"
          >
            📦 Dashboard
          </button>
          <button
            @click="currentTab = 'ingredients'"
            :class="['px-4 py-2 rounded-lg transition', currentTab === 'ingredients' ? 'bg-sky-600 text-white' : 'text-sky-700 hover:bg-sky-100']"
          >
            🥕 Ingredients
          </button>
          <button
            @click="currentTab = 'recipes'"
            :class="['px-4 py-2 rounded-lg transition', currentTab === 'recipes' ? 'bg-sky-600 text-white' : 'text-sky-700 hover:bg-sky-100']"
          >
            👨‍🍳 Recipes
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

    <!-- Content -->
    <div class="pt-24 p-4 max-w-7xl mx-auto">
      <!-- Dashboard Tab -->
      <div v-if="currentTab === 'dashboard'" class="space-y-6">
        <h1 class="mb-8 text-4xl font-bold text-slate-900">👨‍💼 Admin Dashboard</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="rounded-lg border border-sky-200 bg-white/80 p-6 shadow-sm">
            <p class="text-sm text-slate-600">Total Ingredients</p>
            <p class="text-4xl font-bold text-sky-700">{{ inventoryStore.ingredients.length }}</p>
          </div>
          <div class="rounded-lg border border-sky-200 bg-white/80 p-6 shadow-sm">
            <p class="text-sm text-slate-600">Total Recipes</p>
            <p class="text-4xl font-bold text-sky-700">{{ recipesStore.recipes.length }}</p>
          </div>
          <div class="rounded-lg border border-sky-200 bg-white/80 p-6 shadow-sm">
            <p class="text-sm text-slate-600">Admin User</p>
            <p class="text-4xl font-bold text-sky-700">{{ authStore.username }}</p>
          </div>
        </div>

        <div class="mt-8">
          <h2 class="mb-4 text-2xl font-bold text-slate-900">🔐 System Status</h2>
          <div class="space-y-2 rounded-lg border border-sky-200 bg-white/80 p-6 shadow-sm">
            <p class="text-slate-700"><span class="text-green-500">✅</span> Authentication System: Active</p>
            <p class="text-slate-700"><span class="text-green-500">✅</span> Database Connection: Active</p>
            <p class="text-slate-700"><span class="text-green-500">✅</span> Admin Role: Confirmed</p>
            <p class="text-slate-700"><span class="text-green-500">✅</span> 3D Bridge Rendering: Ready</p>
          </div>
        </div>
      </div>

      <!-- Ingredients Tab -->
      <div v-if="currentTab === 'ingredients'" class="space-y-6">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-4xl font-bold text-slate-900">🥕 Manage Ingredients</h1>
          <button
            @click="showIngredientForm = !showIngredientForm"
            class="rounded-lg bg-gradient-to-r from-sky-600 to-cyan-600 px-6 py-3 font-bold text-white transition hover:from-sky-500 hover:to-cyan-500"
          >
            ➕ Add Ingredient
          </button>
        </div>

        <!-- Add Ingredient Form -->
        <div v-if="showIngredientForm" class="mb-6 rounded-lg border border-sky-200 bg-white/85 p-6 shadow-sm">
          <h2 class="mb-4 text-xl font-bold text-slate-900">New Ingredient</h2>
          <form @submit.prevent="addIngredient" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input v-model="newIngredient.name" type="text" placeholder="Name" class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800" required />
              <input v-model.number="newIngredient.quantity" type="number" placeholder="Quantity" class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800" required />
              <select v-model="newIngredient.unit" class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800">
                <option>pieces</option>
                <option>grams</option>
                <option>kg</option>
                <option>cups</option>
              </select>
              <select v-model="newIngredient.category" class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800">
                <option>Vegetables</option>
                <option>Proteins</option>
                <option>Fruits</option>
              </select>
            </div>
            <div class="flex gap-2">
              <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition">✅ Add</button>
              <button type="button" @click="showIngredientForm = false" class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition">❌ Cancel</button>
            </div>
          </form>
        </div>

        <!-- Ingredients List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="ingredient in inventoryStore.ingredients" :key="ingredient.id" class="rounded-lg border border-sky-200 bg-white/85 p-4 shadow-sm">
            <h3 class="text-lg font-bold text-sky-700">{{ ingredient.name }}</h3>
            <p class="text-sm text-slate-700">{{ ingredient.quantity }} {{ ingredient.unit }}</p>
            <p class="text-xs text-slate-500">Category: {{ ingredient.category }}</p>
          </div>
        </div>
      </div>

      <!-- Recipes Tab -->
      <div v-if="currentTab === 'recipes'" class="space-y-6">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-4xl font-bold text-slate-900">👨‍🍳 Manage Recipes</h1>
          <button
            @click="showRecipeForm = !showRecipeForm"
            class="rounded-lg bg-gradient-to-r from-sky-600 to-cyan-600 px-6 py-3 font-bold text-white transition hover:from-sky-500 hover:to-cyan-500"
          >
            ➕ Add Recipe
          </button>
        </div>

        <!-- Add Recipe Form -->
        <div v-if="showRecipeForm" class="mb-6 rounded-lg border border-sky-200 bg-white/85 p-6 shadow-sm">
          <h2 class="mb-4 text-xl font-bold text-slate-900">New Recipe</h2>
          <form @submit.prevent="addRecipe" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input v-model="newRecipe.title" type="text" placeholder="Recipe Title" class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800" required />
              <input v-model.number="newRecipe.timeToComplete" type="number" placeholder="Time (minutes)" class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800" required />
            </div>
            <textarea v-model="newRecipe.description" placeholder="Description" class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800" required></textarea>
            <textarea v-model="newRecipe.instructions" placeholder="Instructions" class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800"></textarea>
            <div class="flex gap-2">
              <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition">✅ Add</button>
              <button type="button" @click="showRecipeForm = false" class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition">❌ Cancel</button>
            </div>
          </form>
        </div>

        <!-- Recipes List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="recipe in recipesStore.recipes" :key="recipe.id" class="rounded-lg border border-sky-200 bg-white/85 p-4 shadow-sm">
            <h3 class="text-lg font-bold text-sky-700">{{ recipe.title }}</h3>
            <p class="text-sm text-slate-700">⏱️ {{ recipe.timeToComplete }} minutes</p>
            <p class="mt-2 text-xs text-slate-500">{{ recipe.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useInventoryStore } from '../stores/inventory'
import { useRecipesStore } from '../stores/recipes'

const router = useRouter()
const authStore = useAuthStore()
const inventoryStore = useInventoryStore()
const recipesStore = useRecipesStore()

const currentTab = ref('dashboard')
const showIngredientForm = ref(false)
const showRecipeForm = ref(false)

const newIngredient = ref({
  name: '',
  quantity: 1,
  unit: 'pieces',
  category: 'Vegetables',
})

const newRecipe = ref({
  title: '',
  description: '',
  instructions: '',
  timeToComplete: 30,
})

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}

const addIngredient = async () => {
  try {
    await inventoryStore.addIngredient(newIngredient.value)
    newIngredient.value = {
      name: '',
      quantity: 1,
      unit: 'pieces',
      category: 'Vegetables',
    }
    showIngredientForm.value = false
  } catch (error) {
    console.error('Failed to add ingredient:', error)
  }
}

const addRecipe = async () => {
  try {
    await recipesStore.createRecipe(newRecipe.value)
    newRecipe.value = {
      title: '',
      description: '',
      instructions: '',
      timeToComplete: 30,
    }
    showRecipeForm.value = false
  } catch (error) {
    console.error('Failed to add recipe:', error)
  }
}
</script>
