<script setup>
import { ref, computed } from 'vue'
import { fakulteti } from '../data/katalog.js'
import FakultetKartica from '../components/FakultetKartica.vue'

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
      <FakultetKartica v-for="fakultet in prikazani" :key="fakultet.id" :fakultet="fakultet" />
    </div>
  </div>
</template>
