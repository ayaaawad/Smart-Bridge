import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export const useInventoryStore = defineStore('inventory', () => {
  const ingredients = ref([])
  const loading = ref(false)
  const error = ref(null)
  const ONE_DAY_MS = 24 * 60 * 60 * 1000

  const getDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) {
      return null
    }

    const today = new Date()
    const normalizedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const expiry = new Date(expiryDate)
    const normalizedExpiry = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate())

    return Math.floor((normalizedExpiry.getTime() - normalizedToday.getTime()) / ONE_DAY_MS)
  }

  const fetchIngredients = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`${API_URL}/ingredients`)
      ingredients.value = response.data
    } catch (err) {
      error.value = err.message
      console.error('Failed to fetch ingredients:', err)
      // Fallback to demo data if API fails
      loadDemoData()
    } finally {
      loading.value = false
    }
  }

  const addIngredient = async (ingredientData) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.post(`${API_URL}/ingredients`, ingredientData)
      ingredients.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Failed to add ingredient:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateIngredient = async (id, ingredientData) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.put(`${API_URL}/ingredients/${id}`, ingredientData)
      const index = ingredients.value.findIndex(i => i.id === id)
      if (index !== -1) {
        ingredients.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      console.error('Failed to update ingredient:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeIngredient = async (id) => {
    loading.value = true
    error.value = null
    try {
      await axios.delete(`${API_URL}/ingredients/${id}`)
      ingredients.value = ingredients.value.filter(item => item.id !== id)
    } catch (err) {
      error.value = err.message
      console.error('Failed to remove ingredient:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const expiringItems = computed(() => {
    return ingredients.value.filter(item => {
      const daysRemaining = getDaysUntilExpiry(item.expiryDate)
      return daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 7
    }).sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
  })

  const nearExpiryItems = computed(() => {
    return ingredients.value.filter(item => {
      const daysRemaining = getDaysUntilExpiry(item.expiryDate)
      return daysRemaining !== null && daysRemaining >= 0 && daysRemaining <= 3
    }).sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))
  })

  const expiredItems = computed(() => {
    return ingredients.value.filter(item => {
      const daysRemaining = getDaysUntilExpiry(item.expiryDate)
      return daysRemaining !== null && daysRemaining < 0
    })
  })

  const ingredientsByCategory = computed(() => {
    const grouped = {}
    ingredients.value.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })
    return grouped
  })

  const loadDemoData = () => {
    ingredients.value = [
      {
        id: '1',
        name: 'Tomato',
        quantity: 5,
        unit: 'pieces',
        category: 'Vegetables',
        expiryDate: new Date(2026, 3, 8),
        bridgeLocation: 'Shelf A',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Chicken Breast',
        quantity: 2,
        unit: 'lbs',
        category: 'Proteins',
        expiryDate: new Date(2026, 3, 10),
        bridgeLocation: 'Freezer',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Cheddar Cheese',
        quantity: 1,
        unit: 'block',
        category: 'Dairy',
        expiryDate: new Date(2026, 3, 6),
        bridgeLocation: 'Shelf B',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'Brown Rice',
        quantity: 3,
        unit: 'cups',
        category: 'Grains',
        expiryDate: new Date(2026, 5, 7),
        bridgeLocation: 'Pantry',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '5',
        name: 'Spinach',
        quantity: 200,
        unit: 'grams',
        category: 'Vegetables',
        expiryDate: new Date(2026, 3, 8),
        bridgeLocation: 'Drawer',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '6',
        name: 'Olive Oil',
        quantity: 1,
        unit: 'bottle',
        category: 'Condiments',
        expiryDate: new Date(2027, 3, 7),
        bridgeLocation: 'Pantry',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }

  return {
    ingredients,
    loading,
    error,
    expiringItems,
    nearExpiryItems,
    expiredItems,
    ingredientsByCategory,
    fetchIngredients,
    addIngredient,
    updateIngredient,
    removeIngredient,
    loadDemoData
  }
})
