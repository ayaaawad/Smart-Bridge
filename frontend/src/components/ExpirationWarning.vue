<template>
  <div class="rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-blue-100 p-6 text-slate-800 shadow-lg">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h4 class="text-lg font-bold text-slate-900">Smart Expiry Alerts</h4>
        <p class="text-sm text-slate-600">Distinct LEDs and sounds for expired and near-expiry ingredients</p>
      </div>
      <button
        type="button"
        @click="soundEnabled = !soundEnabled"
        class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        🔊 Sound {{ soundEnabled ? 'ON' : 'OFF' }}
      </button>
    </div>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <section class="rounded-xl border border-red-200 bg-red-50 p-4">
        <div class="mb-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span
              class="h-3.5 w-3.5 rounded-full transition-all"
              :class="isExpiredLedOn ? 'bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.85)] animate-pulse' : 'bg-red-200'"
            ></span>
            <h5 class="font-bold text-red-700">Expired Alert (Red LED)</h5>
          </div>
          <span class="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
            {{ isExpiredLedOn ? 'ON' : 'OFF' }}
          </span>
        </div>

        <p v-if="!expiredItems.length" class="text-sm text-red-500">No expired ingredients right now.</p>

        <div v-else class="space-y-2">
          <div
            v-for="item in expiredItems"
            :key="item.id"
            class="flex items-center justify-between rounded-lg border border-red-200 bg-white px-3 py-2 text-sm"
          >
            <span class="font-semibold text-slate-700">{{ item.name }}</span>
            <span class="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
              {{ formatExpiryLabel(item.expiryDate) }}
            </span>
          </div>
        </div>
      </section>

      <section class="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div class="mb-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span
              class="h-3.5 w-3.5 rounded-full transition-all"
              :class="isNearExpiryLedOn ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.85)] animate-pulse' : 'bg-amber-200'"
            ></span>
            <h5 class="font-bold text-amber-700">Near Expiry Alert (Yellow LED)</h5>
          </div>
          <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
            {{ isNearExpiryLedOn ? 'ON' : 'OFF' }}
          </span>
        </div>

        <p v-if="!nearExpiryItems.length" class="text-sm text-amber-600">Nothing close to expiry in the next 3 days.</p>

        <div v-else class="space-y-2">
          <div
            v-for="item in nearExpiryItems"
            :key="item.id"
            class="flex items-center justify-between rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm"
          >
            <span class="font-semibold text-slate-700">{{ item.name }}</span>
            <span class="rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
              {{ formatExpiryLabel(item.expiryDate) }}
            </span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  expiredItems: {
    type: Array,
    default: () => []
  },
  nearExpiryItems: {
    type: Array,
    default: () => []
  }
})

const soundEnabled = ref(true)
const audioContext = ref(null)
let unlockHandler = null

const isExpiredLedOn = computed(() => props.expiredItems.length > 0)
const isNearExpiryLedOn = computed(() => props.nearExpiryItems.length > 0)

const ONE_DAY_MS = 24 * 60 * 60 * 1000

const daysUntilExpiry = (expiryDate) => {
  if (!expiryDate) {
    return null
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const expiry = new Date(expiryDate)
  const normalizedExpiry = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate())

  return Math.floor((normalizedExpiry.getTime() - today.getTime()) / ONE_DAY_MS)
}

const formatExpiryLabel = (expiryDate) => {
  const daysRemaining = daysUntilExpiry(expiryDate)

  if (daysRemaining === null) {
    return 'No date'
  }

  if (daysRemaining < 0) {
    const daysAgo = Math.abs(daysRemaining)
    return `Expired ${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`
  }

  if (daysRemaining === 0) {
    return 'Expires today'
  }

  return `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left`
}

const unlockAudio = async () => {
  if (audioContext.value) {
    if (audioContext.value.state === 'suspended') {
      await audioContext.value.resume()
    }
    return
  }

  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) {
    return
  }

  audioContext.value = new Ctx()
  if (audioContext.value.state === 'suspended') {
    await audioContext.value.resume()
  }
}

const playPattern = async (pattern) => {
  if (!soundEnabled.value) {
    return
  }

  try {
    await unlockAudio()
  } catch (error) {
    return
  }

  if (!audioContext.value) {
    return
  }

  const ctx = audioContext.value
  let cursor = ctx.currentTime

  pattern.forEach(({ frequency, duration, gain }) => {
    const oscillator = ctx.createOscillator()
    const amp = ctx.createGain()

    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(frequency, cursor)

    amp.gain.setValueAtTime(0.0001, cursor)
    amp.gain.exponentialRampToValueAtTime(gain, cursor + 0.02)
    amp.gain.exponentialRampToValueAtTime(0.0001, cursor + duration)

    oscillator.connect(amp)
    amp.connect(ctx.destination)

    oscillator.start(cursor)
    oscillator.stop(cursor + duration + 0.02)

    cursor += duration + 0.07
  })
}

const playExpiredSound = () => {
  playPattern([
    { frequency: 880, duration: 0.15, gain: 0.08 },
    { frequency: 740, duration: 0.15, gain: 0.08 },
    { frequency: 980, duration: 0.18, gain: 0.1 }
  ])
}

const playNearExpirySound = () => {
  playPattern([
    { frequency: 560, duration: 0.14, gain: 0.06 },
    { frequency: 660, duration: 0.14, gain: 0.06 }
  ])
}

watch(
  () => props.expiredItems.length,
  (currentCount, previousCount) => {
    if (currentCount > 0 && (previousCount ?? 0) === 0) {
      playExpiredSound()
    }
  }
)

watch(
  () => props.nearExpiryItems.length,
  (currentCount, previousCount) => {
    if (currentCount > 0 && (previousCount ?? 0) === 0) {
      playNearExpirySound()
    }
  }
)

onMounted(() => {
  unlockHandler = () => {
    unlockAudio()
  }

  window.addEventListener('pointerdown', unlockHandler, { once: true })
})

onBeforeUnmount(() => {
  if (unlockHandler) {
    window.removeEventListener('pointerdown', unlockHandler)
  }

  if (audioContext.value) {
    audioContext.value.close()
  }
})
</script>
