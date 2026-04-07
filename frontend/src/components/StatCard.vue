<template>
  <div :class="[
    'rounded-lg p-6 text-white transform transition-all duration-300 hover:scale-105',
    colorClasses[color]
  ]">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium opacity-80">{{ title }}</p>
        <p class="text-3xl font-bold mt-2">{{ value }}</p>
      </div>
      <div class="text-4xl">{{ icon }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [Number, String],
  icon: String,
  color: {
    type: String,
    default: 'blue'
  }
})

const colorClasses = {
  blue: 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg',
  yellow: 'bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg',
  purple: 'bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg',
  green: 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg',
  red: 'bg-gradient-to-br from-rose-500 to-red-700 shadow-lg',
  sky: 'bg-gradient-to-br from-sky-500 to-cyan-700 shadow-lg'
}
</script>
