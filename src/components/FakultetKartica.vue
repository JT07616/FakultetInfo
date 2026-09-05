<script setup>
import { MapPin } from 'lucide-vue-next'
import { programi } from '../data/programi.js'

const props = defineProps(['fakultet'])

// broj programa ovog fakulteta
let brojPrograma = 0
for (const program of programi) {
  if (program.fakultetId === props.fakultet.id) {
    brojPrograma++
  }
}

const brojProgramaTekst = brojPrograma === 1 ? '1 Studijski program' : brojPrograma + ' Studijska programa'
</script>

<template>
  <!-- redak: logo u plocici, naziv i sveuciliste, grad, broj programa -->
  <RouterLink :to="'/fakulteti/' + fakultet.id" class="bg-white border border-stone-300 rounded-xl px-5 py-4 shadow-sm grid sm:grid-cols-3 gap-3 sm:items-center hover:border-blue-300 hover:shadow-md">
    <div class="sm:col-span-2 flex items-center gap-4">
      <div class="size-14 shrink-0 flex items-center justify-center bg-stone-50 border border-stone-200 rounded-xl">
        <img v-if="fakultet.slika" :src="fakultet.slika" :alt="fakultet.naziv" class="size-10 object-contain" />
        <span v-else class="text-xs font-semibold text-blue-950">{{ fakultet.kratica }}</span>
      </div>
      <div>
        <p class="font-semibold text-blue-950">{{ fakultet.naziv }}</p>
        <p class="text-sm text-gray-500">{{ fakultet.sveuciliste || 'Samostalno veleučilište' }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between gap-3">
      <span class="flex items-center gap-1 text-sm text-gray-500"><MapPin class="size-4" />{{ fakultet.grad }}</span>
      <span class="text-sm"><b class="text-blue-950">{{ brojProgramaTekst }}</b> <span class="text-gray-400">›</span></span>
    </div>
  </RouterLink>
</template>
