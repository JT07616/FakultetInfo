<script setup>
import { ref, computed } from 'vue'
import { sveucilista } from '../data/katalog.js'

const trazi = ref('')
const grad = ref('')
const gradovi = [] // iz kataloga

for (const sveuciliste of sveucilista) {
  for (const fakultet of sveuciliste.fakulteti) {
    if (!gradovi.includes(fakultet.grad)) {
      gradovi.push(fakultet.grad)
    }
  }
}

gradovi.sort()

function odgovaraGradu(fakultet) {
  if (!grad.value) {
    return true
  }
  return fakultet.grad === grad.value
}

function pretraga(fakultet, sveuciliste) {
  const upit = trazi.value.toLowerCase()
  return fakultet.naziv.toLowerCase().includes(upit) || fakultet.kratica.toLowerCase().includes(upit) || fakultet.grad.toLowerCase().includes(upit) || sveuciliste.naziv.toLowerCase().includes(upit)
}

const grupirani = computed(() => {
  const rezultat = []
  for (const sveuciliste of sveucilista) {
    const pronadeni = []
  
    for (const fakultet of sveuciliste.fakulteti) {
      if (odgovaraGradu(fakultet) && pretraga(fakultet, sveuciliste)) {
        pronadeni.push(fakultet)
      }
    }
    pronadeni.sort((a, b) => a.naziv.localeCompare(b.naziv, 'hr'))
    if (pronadeni.length > 0) {
      rezultat.push({ naziv: sveuciliste.naziv, fakulteti: pronadeni })
    }
  }
  return rezultat
})

function brojFakulteta(broj) {
  if (broj === 1) {
    return '1 fakultet'
  }
  return broj + ' fakulteta'
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-10">
    <div class="flex items-center gap-3 mb-8">
      <label class="font-semibold text-blue-950">Pretraži:</label>
      <input v-model="trazi" type="text" class="flex-1 bg-white border border-blue-200 rounded-lg px-4 py-2" placeholder="Naziv fakulteta, sveučilište ili grad" />
      <select v-model="grad" class="bg-white border border-blue-200 rounded-lg px-4 py-2">
        <option value="">Svi gradovi</option>
        <option v-for="g in gradovi" :key="g" :value="g">{{ g }}</option>
      </select>
    </div>

    <div v-if="grupirani.length === 0" class="bg-white border border-blue-200 rounded-lg p-8 text-center shadow-sm">
      <p class="font-semibold text-blue-950">Nema fakulteta koji odgovaraju pretrazi.</p>
      <p class="text-sm text-black/50 mt-1">Provjeri upit ili vrati filter na sve gradove.</p>
    </div>

    <div v-for="sveuciliste in grupirani" :key="sveuciliste.naziv" class="mb-10">
      <div class="flex items-center gap-3 border-b-2 border-blue-400 pb-3 mb-5">
        <h2 class="text-2xl font-bold text-blue-950">{{ sveuciliste.naziv }}</h2>
        <span class="bg-blue-950 text-white text-xs font-semibold rounded-full px-3 py-1">{{ brojFakulteta(sveuciliste.fakulteti.length) }}</span>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div v-for="fakultet in sveuciliste.fakulteti" :key="fakultet.id" class="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
          <h3 class="font-semibold text-blue-950">{{ fakultet.naziv }}</h3>
          <p class="text-sm mt-1 text-black/60">{{ fakultet.kratica }}, {{ fakultet.grad }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
