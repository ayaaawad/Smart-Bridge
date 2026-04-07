import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useInventoryStore } from './inventory'

const API_URL = 'http://localhost:3000'

export const useRecipesStore = defineStore('recipes', () => {
  const recipes = ref([])
  const matchableRecipes = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchRecipes = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_URL}/recipes`)
      recipes.value = response.data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch recipes:', err)
      loadDemoRecipes()
    } finally {
      loading.value = false
    }
  }

  /**
   * Smart recipe matching: Send current inventory to backend
   * Backend returns recipes where user has >= 80% of ingredients
   */
  const findMatchableRecipes = async () => {
    loading.value = true
    error.value = null
    try {
      const inventoryStore = useInventoryStore()
      
      // Call backend with current inventory
      const response = await axios.post(`${API_URL}/recipes/matchable`, {
        ingredients: inventoryStore.ingredients
      })
      
      matchableRecipes.value = response.data
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Failed to find matchable recipes:', err)
      // Fallback: calculate locally if backend fails
      calculateMatchableLocal()
      return matchableRecipes.value
    } finally {
      loading.value = false
    }
  }

  /**
   * Fallback calculation if backend fails
   */
  const calculateMatchableLocal = () => {
    const inventoryStore = useInventoryStore()
    
    matchableRecipes.value = recipes.value.filter(recipe => {
      if (!recipe.recipeIngredients || recipe.recipeIngredients.length === 0) {
        return true
      }

      const inventoryNames = inventoryStore.ingredients.map(i => i.name.toLowerCase())
      const requiredCount = recipe.recipeIngredients.length
      
      const matchedCount = recipe.recipeIngredients.filter(ri => 
        inventoryNames.includes(ri.ingredientName.toLowerCase())
      ).length

      const matchPercentage = (matchedCount / requiredCount) * 100
      return matchPercentage >= 80
    })
  }

  const loadDemoRecipes = () => {
    recipes.value = [
      {
        id: '1',
        title: 'Classic Tomato Basil Pasta',
        description: 'Comfort pasta with fresh tomato sauce, basil, and parmesan',
        imageURL: '🍝',
        timeToComplete: 25,
        instructions: 'Boil pasta, simmer tomato sauce, then toss with basil and parmesan',
        recipeIngredients: [
          { id: '1', ingredientName: 'Pasta', amountRequired: 200, unit: 'grams' },
          { id: '2', ingredientName: 'Tomato', amountRequired: 4, unit: 'pieces' },
          { id: '3', ingredientName: 'Basil', amountRequired: 10, unit: 'grams' },
          { id: '4', ingredientName: 'Parmesan', amountRequired: 60, unit: 'grams' }
        ]
      },
      {
        id: '2',
        title: 'Garden Veggie Pizza',
        description: 'Crispy pizza topped with sauce, mozzarella, and fresh vegetables',
        imageURL: '🍕',
        timeToComplete: 35,
        instructions: 'Build the pizza on dough and bake until the crust is golden',
        recipeIngredients: [
          { id: '1', ingredientName: 'Pizza Dough', amountRequired: 1, unit: 'piece' },
          { id: '2', ingredientName: 'Tomato Sauce', amountRequired: 120, unit: 'ml' },
          { id: '3', ingredientName: 'Mozzarella', amountRequired: 150, unit: 'grams' },
          { id: '4', ingredientName: 'Bell Pepper', amountRequired: 1, unit: 'piece' }
        ]
      },
      {
        id: '3',
        title: 'Mediterranean Salad Bowl',
        description: 'Fresh salad with cucumber, tomato, feta, and lemon dressing',
        imageURL: '🥗',
        timeToComplete: 15,
        instructions: 'Chop vegetables, add feta, and toss in lemon-olive dressing',
        recipeIngredients: [
          { id: '1', ingredientName: 'Lettuce', amountRequired: 1, unit: 'head' },
          { id: '2', ingredientName: 'Tomato', amountRequired: 2, unit: 'pieces' },
          { id: '3', ingredientName: 'Cucumber', amountRequired: 1, unit: 'piece' },
          { id: '4', ingredientName: 'Feta Cheese', amountRequired: 100, unit: 'grams' }
        ]
      },
      {
        id: '4',
        title: 'Chicken Fried Rice',
        description: 'Fast stir-fry rice with chicken, peas, and soy sauce',
        imageURL: '🍚',
        timeToComplete: 28,
        instructions: 'Stir-fry chicken and veggies, add rice and soy sauce, finish with egg',
        recipeIngredients: [
          { id: '1', ingredientName: 'Chicken Breast', amountRequired: 250, unit: 'grams' },
          { id: '2', ingredientName: 'Cooked Rice', amountRequired: 2, unit: 'cups' },
          { id: '3', ingredientName: 'Peas', amountRequired: 80, unit: 'grams' },
          { id: '4', ingredientName: 'Soy Sauce', amountRequired: 2, unit: 'tbsp' }
        ]
      },
      {
        id: '5',
        title: 'Creamy Mushroom Soup',
        description: 'Warm mushroom soup blended with garlic and cream',
        imageURL: '🍲',
        timeToComplete: 30,
        instructions: 'Saute mushrooms, simmer with broth, blend, then finish with cream',
        recipeIngredients: [
          { id: '1', ingredientName: 'Mushroom', amountRequired: 300, unit: 'grams' },
          { id: '2', ingredientName: 'Onion', amountRequired: 1, unit: 'piece' },
          { id: '3', ingredientName: 'Garlic', amountRequired: 2, unit: 'cloves' },
          { id: '4', ingredientName: 'Cream', amountRequired: 120, unit: 'ml' }
        ]
      },
      {
        id: '6',
        title: 'Classic Beef Burger',
        description: 'Juicy beef burger with lettuce, tomato, and cheddar',
        imageURL: '🍔',
        timeToComplete: 22,
        instructions: 'Grill patty, toast bun, and assemble burger with fresh toppings',
        recipeIngredients: [
          { id: '1', ingredientName: 'Burger Bun', amountRequired: 1, unit: 'piece' },
          { id: '2', ingredientName: 'Ground Beef', amountRequired: 180, unit: 'grams' },
          { id: '3', ingredientName: 'Cheddar Cheese', amountRequired: 1, unit: 'slice' },
          { id: '4', ingredientName: 'Lettuce', amountRequired: 2, unit: 'leaves' }
        ]
      },
      {
        id: '7',
        title: 'Club Sandwich',
        description: 'Triple-layer chicken sandwich with tomato and mayo',
        imageURL: '🥪',
        timeToComplete: 15,
        instructions: 'Toast bread, layer ingredients, and cut into triangles',
        recipeIngredients: [
          { id: '1', ingredientName: 'Bread', amountRequired: 3, unit: 'slices' },
          { id: '2', ingredientName: 'Chicken Breast', amountRequired: 120, unit: 'grams' },
          { id: '3', ingredientName: 'Tomato', amountRequired: 3, unit: 'slices' },
          { id: '4', ingredientName: 'Mayonnaise', amountRequired: 1, unit: 'tbsp' }
        ]
      },
      {
        id: '8',
        title: 'Vanilla Celebration Cake',
        description: 'Soft vanilla cake with creamy frosting',
        imageURL: '🎂',
        timeToComplete: 55,
        instructions: 'Bake cake batter, cool, then frost generously',
        recipeIngredients: [
          { id: '1', ingredientName: 'Flour', amountRequired: 250, unit: 'grams' },
          { id: '2', ingredientName: 'Sugar', amountRequired: 180, unit: 'grams' },
          { id: '3', ingredientName: 'Egg', amountRequired: 3, unit: 'pieces' },
          { id: '4', ingredientName: 'Butter', amountRequired: 120, unit: 'grams' }
        ]
      },
      {
        id: '9',
        title: 'Sweet Breakfast Crepes',
        description: 'Thin crepes with honey and fruit toppings',
        imageURL: '🥞',
        timeToComplete: 20,
        instructions: 'Mix batter, cook thin crepes, and serve with honey',
        recipeIngredients: [
          { id: '1', ingredientName: 'Flour', amountRequired: 140, unit: 'grams' },
          { id: '2', ingredientName: 'Milk', amountRequired: 220, unit: 'ml' },
          { id: '3', ingredientName: 'Egg', amountRequired: 2, unit: 'pieces' },
          { id: '4', ingredientName: 'Honey', amountRequired: 2, unit: 'tbsp' }
        ]
      },
      {
        id: '10',
        title: 'Berry Yogurt Parfait',
        description: 'Layered yogurt, berries, and granola cup',
        imageURL: '🍨',
        timeToComplete: 8,
        instructions: 'Layer yogurt, berries, and granola in a glass cup',
        recipeIngredients: [
          { id: '1', ingredientName: 'Yogurt', amountRequired: 200, unit: 'grams' },
          { id: '2', ingredientName: 'Strawberry', amountRequired: 80, unit: 'grams' },
          { id: '3', ingredientName: 'Blueberry', amountRequired: 60, unit: 'grams' },
          { id: '4', ingredientName: 'Granola', amountRequired: 50, unit: 'grams' }
        ]
      },
      {
        id: '11',
        title: 'Banana Oat Smoothie',
        description: 'Quick smoothie with banana, oats, milk, and honey',
        imageURL: '🥤',
        timeToComplete: 5,
        instructions: 'Blend all ingredients until smooth and serve cold',
        recipeIngredients: [
          { id: '1', ingredientName: 'Banana', amountRequired: 1, unit: 'piece' },
          { id: '2', ingredientName: 'Oats', amountRequired: 40, unit: 'grams' },
          { id: '3', ingredientName: 'Milk', amountRequired: 250, unit: 'ml' },
          { id: '4', ingredientName: 'Honey', amountRequired: 1, unit: 'tbsp' }
        ]
      }
    ]
  }

  const createRecipe = async (recipeData) => {
    try {
      const response = await axios.post(`${API_URL}/recipes`, recipeData)
      recipes.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Failed to create recipe:', err)
      throw err
    }
  }

  return {
    recipes,
    matchableRecipes,
    loading,
    error,
    fetchRecipes,
    findMatchableRecipes,
    loadDemoRecipes,
    createRecipe
  }
})
