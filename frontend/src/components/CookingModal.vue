<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-slate-800 border border-bridge-500/30 rounded-2xl w-full max-w-md p-8">
      <!-- Recipe Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-white mb-2">👨‍🍳 {{ recipe?.title }}</h2>
        <p class="text-bridge-200">{{ recipe?.description }}</p>
      </div>

      <!-- Time Display -->
      <div class="bg-slate-700/30 rounded-lg p-6 mb-6 text-center">
        <p class="text-bridge-200 text-sm mb-2">⏱️ Time Remaining</p>
        <p class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-bridge-400 to-cyan-300">
          {{ formattedTime }}
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="mb-6">
        <div class="w-full bg-slate-700/30 rounded-full h-4 overflow-hidden">
          <div
            :style="{ width: `${progress}%` }"
            class="h-full bg-gradient-to-r from-bridge-600 to-cyan-500 transition-all duration-1000"
          ></div>
        </div>
        <p class="text-xs text-slate-400 text-right mt-2">{{ progress }}% Complete</p>
      </div>

      <!-- Instructions -->
      <div v-if="recipe?.instructions" class="bg-slate-700/30 rounded-lg p-4 mb-6">
        <h3 class="font-bold text-bridge-300 mb-2">📝 Instructions</h3>
        <p class="text-slate-300 text-sm">{{ recipe.instructions }}</p>
      </div>

      <!-- Countdown Animation -->
      <div v-if="isActive" class="relative h-20 mb-6 flex items-center justify-center">
        <div class="absolute inset-0 bg-gradient-to-r from-bridge-500/20 to-cyan-500/20 rounded-lg animate-pulse"></div>
        <p class="text-white text-sm font-mono relative">Cooking in progress... 🔥</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button
          v-if="!isFinished && isActive"
          @click="pauseTimer"
          class="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition"
        >
          ⏸️ Pause
        </button>
        <button
          v-if="!isActive && !isFinished"
          @click="resumeTimer"
          class="flex-1 px-4 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition"
        >
          ▶️ Resume
        </button>
        <button
          @click="finishCooking"
          :class="[
            'flex-1 px-4 py-3 font-bold rounded-lg transition',
            isFinished
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-slate-600 hover:bg-slate-500 text-white'
          ]"
        >
          {{ isFinished ? '✅ Done!' : '⏭️ Skip' }}
        </button>
      </div>

      <!-- Close Button -->
      <button
        @click="close"
        class="mt-4 w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { useInventoryStore } from '../stores/inventory'

const props = defineProps({
  recipe: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['cooking-finished', 'close'])

const inventoryStore = useInventoryStore()

const isOpen = ref(false)
const remainingTime = ref(0)
const isActive = ref(false)
const isFinished = ref(false)
const timerInterval = ref(null)

const progress = computed(() => {
  if (!props.recipe) return 0
  const total = props.recipe.timeToComplete * 60 // convert to seconds
  return Math.max(0, Math.min(100, ((total - remainingTime.value) / total) * 100))
})

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingTime.value / 60)
  const seconds = remainingTime.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const open = (recipe) => {
  isOpen.value = true
  isActive.value = true
  isFinished.value = false
  remainingTime.value = recipe.timeToComplete * 60 // convert to seconds
  startTimer()
}

const close = () => {
  isOpen.value = false
  stopTimer()
  isActive.value = false
  isFinished.value = false
}

const startTimer = () => {
  if (timerInterval.value) clearInterval(timerInterval.value)
  
  isActive.value = true
  timerInterval.value = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      finishCooking()
    }
  }, 1000)
}

const pauseTimer = () => {
  isActive.value = false
  stopTimer()
}

const resumeTimer = () => {
  startTimer()
}

const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

const finishCooking = async () => {
  isFinished.value = true
  stopTimer()
  isActive.value = false

  try {
    // Subtract used ingredients from inventory
    if (props.recipe?.recipeIngredients) {
      for (const recipeIngredient of props.recipe.recipeIngredients) {
        // Find matching ingredient in inventory
        const inventoryItem = inventoryStore.ingredients.find(
          (ing) => ing.name.toLowerCase() === recipeIngredient.ingredientName.toLowerCase()
        )

        if (inventoryItem) {
          const newQuantity = Math.max(0, inventoryItem.quantity - recipeIngredient.amountRequired)
          if (newQuantity > 0) {
            await inventoryStore.updateIngredient(inventoryItem.id, {
              quantity: newQuantity,
            })
          } else {
            // Remove ingredient if quantity becomes 0
            await inventoryStore.removeIngredient(inventoryItem.id)
          }
        }
      }
    }

    // Emit finished event
    emit('cooking-finished', props.recipe)

    // Show finished state for 2 seconds then close
    setTimeout(() => {
      close()
    }, 2000)
  } catch (error) {
    console.error('Failed to update inventory:', error)
  }
}

onUnmounted(() => {
  stopTimer()
})

defineExpose({ open, close })
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
