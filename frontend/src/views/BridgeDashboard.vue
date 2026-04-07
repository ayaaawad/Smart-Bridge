<template>
  <div class="min-h-screen bg-gradient-to-b from-sky-100 via-sky-200 to-cyan-100 px-4 py-8">
    <div class="mx-auto w-full max-w-6xl">
      <div class="rounded-3xl border border-sky-200 bg-white/75 p-6 shadow-2xl backdrop-blur-sm">
        <div class="scene">
          <div class="sky-orb"></div>
          <div class="water-layer"></div>
          <div class="river-shimmer"></div>

          <div class="bridge-tower left"></div>
          <div class="bridge-tower right"></div>

          <div class="bridge-road-base"></div>

          <div class="bridge-leaf left" :class="{ open: isBridgeOpen }">
            <span class="lane-mark"></span>
          </div>
          <div class="bridge-leaf right" :class="{ open: isBridgeOpen }">
            <span class="lane-mark"></span>
          </div>

          <div class="bridge-label">SMARTBRIDGE</div>
        </div>

        <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            @click="toggleBridge"
            class="rounded-full px-8 py-3 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
            :class="isBridgeOpen
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400'
              : 'bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500'"
          >
            {{ isBridgeOpen ? 'Close Bridge' : 'Open Bridge' }}
          </button>

          <span
            class="rounded-full px-4 py-2 text-sm font-bold"
            :class="isBridgeOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'"
          >
            {{ isBridgeOpen ? 'Bridge Status: OPEN' : 'Bridge Status: CLOSED' }}
          </span>
        </div>
      </div>

      <transition name="fade-scale">
        <div v-if="isBridgeOpen" class="mt-10 w-full rounded-3xl border border-sky-200 bg-white/85 p-8 shadow-xl backdrop-blur-sm">
          <div class="animate-fade-in">
            <div class="mb-8 flex items-center justify-between">
              <h2 class="text-3xl font-bold text-slate-900">Bridge Inventory Control</h2>
              <button
                @click="openIngredientPicker"
                class="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-6 py-3 font-bold text-white shadow-lg transition hover:from-sky-500 hover:to-cyan-500"
              >
                ➕ Add Ingredient
              </button>
            </div>

            <InventoryDashboard />
          </div>
        </div>
      </transition>
    </div>

    <IngredientPicker ref="ingredientPicker" @ingredient-added="handleIngredientAdded" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useInventoryStore } from '../stores/inventory'
import { useRecipesStore } from '../stores/recipes'
import InventoryDashboard from '../components/InventoryDashboard.vue'
import IngredientPicker from '../components/IngredientPicker.vue'

const inventoryStore = useInventoryStore()
const recipesStore = useRecipesStore()

const isBridgeOpen = ref(false)
const ingredientPicker = ref(null)

const toggleBridge = () => {
  isBridgeOpen.value = !isBridgeOpen.value
  
  if (isBridgeOpen.value) {
    // Load inventory and recipes when bridge opens
    inventoryStore.fetchIngredients()
    recipesStore.fetchRecipes()
    recipesStore.findMatchableRecipes()
  }
}

const openIngredientPicker = () => {
  ingredientPicker.value?.open()
}

const handleIngredientAdded = async (ingredientData) => {
  try {
    await inventoryStore.addIngredient(ingredientData)
    // Refresh matched recipes after adding ingredient
    await recipesStore.findMatchableRecipes()
  } catch (error) {
    console.error('Failed to add ingredient:', error)
  }
}

onMounted(() => {
  inventoryStore.fetchIngredients()
  recipesStore.fetchRecipes()
})
</script>

<style scoped>
.scene {
  position: relative;
  height: 360px;
  overflow: hidden;
  border-radius: 1.5rem;
  border: 2px solid rgba(125, 211, 252, 0.7);
  background: linear-gradient(180deg, #d9f4ff 0%, #bde8ff 58%, #93c5fd 100%);
  perspective: 1300px;
}

.sky-orb {
  position: absolute;
  top: 16px;
  left: 40px;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(186, 230, 253, 0.5) 45%, rgba(186, 230, 253, 0) 75%);
}

.water-layer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 42%;
  background: linear-gradient(180deg, rgba(14, 165, 233, 0.25), rgba(2, 132, 199, 0.6));
}

.river-shimmer {
  position: absolute;
  bottom: 4%;
  left: -20%;
  width: 140%;
  height: 20px;
  background: linear-gradient(90deg, rgba(186, 230, 253, 0), rgba(186, 230, 253, 0.85), rgba(186, 230, 253, 0));
  animation: river-move 3s linear infinite;
}

.bridge-tower {
  position: absolute;
  bottom: 34%;
  width: 48px;
  height: 140px;
  border-radius: 0.6rem;
  background: linear-gradient(180deg, #334155, #0f172a);
  box-shadow: inset -8px 0 12px rgba(0, 0, 0, 0.3);
}

.bridge-tower.left {
  left: 13%;
}

.bridge-tower.right {
  right: 13%;
}

.bridge-road-base {
  position: absolute;
  left: 6%;
  right: 6%;
  bottom: 30%;
  height: 30px;
  border-radius: 0.75rem;
  background: linear-gradient(180deg, #475569, #1e293b);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.35);
}

.bridge-leaf {
  position: absolute;
  bottom: 30%;
  width: 43%;
  height: 30px;
  border-radius: 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.4);
  background: linear-gradient(180deg, #64748b, #334155);
  transform-style: preserve-3d;
  transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 14px 20px rgba(15, 23, 42, 0.35);
}

.bridge-leaf::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: repeating-linear-gradient(
    90deg,
    rgba(241, 245, 249, 0.24),
    rgba(241, 245, 249, 0.24) 10px,
    rgba(100, 116, 139, 0.2) 10px,
    rgba(100, 116, 139, 0.2) 20px
  );
  transform: translateZ(1px);
}

.bridge-leaf.left {
  left: 6%;
  transform-origin: right center;
  transform: rotateY(0deg) rotateX(3deg);
}

.bridge-leaf.right {
  right: 6%;
  transform-origin: left center;
  transform: rotateY(0deg) rotateX(3deg);
}

.bridge-leaf.left.open {
  transform: rotateY(-72deg) rotateX(16deg);
}

.bridge-leaf.right.open {
  transform: rotateY(72deg) rotateX(16deg);
}

.lane-mark {
  position: absolute;
  top: 12px;
  left: 7%;
  right: 7%;
  border-top: 2px dashed rgba(248, 250, 252, 0.95);
  z-index: 2;
}

.bridge-label {
  position: absolute;
  top: 18px;
  right: 20px;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: #0f172a;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  font-weight: 800;
}

@keyframes river-move {
  from {
    transform: translateX(-15%);
  }
  to {
    transform: translateX(15%);
  }
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.6s ease-in-out, transform 0.6s ease-in-out;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-in-out;
}
</style>
