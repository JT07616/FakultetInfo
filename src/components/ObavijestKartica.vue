<script setup>
import { CalendarDays } from 'lucide-vue-next'

defineProps(['obavijest', 'kratica'])
</script>

<template>
  <div class="bg-white border border-stone-300 rounded-xl px-5 py-4 flex gap-5">
    <div class="w-24 shrink-0 flex items-center gap-2">
      <CalendarDays class="size-8 text-gray-400" />
      <div>
        <p class="text-lg font-semibold text-blue-950 leading-tight">{{ obavijest.datum.getDate() + '.' + (obavijest.datum.getMonth() + 1) + '.' }}</p>
        <p class="text-xs text-gray-500 leading-tight">{{ obavijest.datum.getFullYear() }}.</p>
      </div>
    </div>

    <div class="flex-1">
      <p v-if="kratica" class="text-xs font-bold text-gray-400">{{ kratica }}</p>
      <p class="font-semibold text-blue-950">{{ obavijest.naslov }}</p>
      <p class="text-sm text-gray-600 mt-1">{{ obavijest.tekst }}</p>
      <slot></slot>
    </div>
  </div>
</template>
