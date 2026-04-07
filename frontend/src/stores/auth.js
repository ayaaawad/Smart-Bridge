import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('auth_token'))
  const user = ref(null)
  const loading = ref(false)
  const error = ref('')

  // Load user from localStorage if token exists
  if (token.value) {
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  }

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const username = computed(() => user.value?.email || user.value?.username || '')

  const login = async (email, password) => {
    loading.value = true
    error.value = ''

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: email,
        email,
        password,
      })

      if (response.data.access_token) {
        token.value = response.data.access_token
        user.value = response.data.user

        // Persist to localStorage
        localStorage.setItem('auth_token', token.value)
        localStorage.setItem('auth_user', JSON.stringify(user.value))

        // Set default axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

        return { success: true }
      }

      throw new Error('Invalid credentials')
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    error.value = ''

    // Clear localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')

    // Clear axios header
    delete axios.defaults.headers.common['Authorization']
  }

  const validateToken = async () => {
    if (!token.value) return false

    try {
      const response = await axios.post(`${API_URL}/auth/validate`, {
        token: token.value,
      })
      return response.data.valid
    } catch (err) {
      logout()
      return false
    }
  }

  // Set axios header on store creation if token exists
  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    username,
    login,
    logout,
    validateToken,
  }
})
