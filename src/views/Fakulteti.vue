<script setup>
import { ref, computed } from 'vue'
import { MapPin } from 'lucide-vue-next'
import { fakulteti } from '../data/katalog.js'
import { programi } from '../data/programi.js'

const pretraga = ref('')
const smjer = ref('az')

function odgovaraPretrazi(fakultet) {
  const tekst = pretraga.value.trim().toLowerCase()
  return fakultet.naziv.toLowerCase().includes(tekst) || fakultet.kratica.toLowerCase().includes(tekst) || fakultet.sveuciliste.toLowerCase().includes(tekst) || fakultet.grad.toLowerCase().includes(tekst)
}

const prikazani = computed(() => {
  const rezultat = []
  for (const fakultet of fakulteti) {
    if (odgovaraPretrazi(fakultet)) {
      rezultat.push(fakultet)
    }
  }
  rezultat.sort((a, b) => {
    if (smjer.value === 'az') {
      return a.naziv.localeCompare(b.naziv, 'hr')
    }
    return b.naziv.localeCompare(a.naziv, 'hr')
  })

  return rezultat
})

// broj studijskih programa fakulteta, kao tekst na kartici
function brojProgramaTekst(fakultet) {
  let brojPrograma = 0
  for (const program of programi) {
    if (program.fakultetId === fakultet.id) {
      brojPrograma++
    }
  }
  return brojPrograma === 1 ? '1 Studijski program' : brojPrograma + ' Studijska programa'
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <h1 class="text-3xl font-extrabold text-blue-950">Fakulteti</h1>
    <p class="text-gray-500 mt-2">Visoka učilišta i njihovi studijski programi.</p>
    <!-- pretraga i redoslijed -->
    <div class="flex flex-col sm:flex-row gap-3 mt-6 mb-4">
      <input v-model="pretraga" type="text" placeholder="Naziv fakulteta, sveučilište ili grad" class="flex-1 bg-white border border-stone-300 rounded-lg p-2.5 text-sm" />
      <select v-model="smjer" class="bg-white border border-stone-300 rounded-lg p-2.5 text-sm text-gray-500">
        <option value="az">Naziv A-Ž</option>
        <option value="za">Naziv Ž-A</option>
      </select>
    </div>
    <p v-if="!prikazani.length" class="text-sm text-gray-500 mt-6">Nema fakulteta koji odgovaraju pretrazi.</p>
    <div v-else class="flex flex-col gap-3">
      <RouterLink v-for="fakultet in prikazani" :key="fakultet.id" :to="'/fakulteti/' + fakultet.id" class="bg-white border border-stone-300 rounded-xl px-5 py-4 shadow-sm grid sm:grid-cols-3 gap-3 sm:items-center hover:border-blue-300 hover:shadow-md">
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
          <span class="text-sm"><b class="text-blue-950">{{ brojProgramaTekst(fakultet) }}</b> <span class="text-gray-400">›</span></span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
