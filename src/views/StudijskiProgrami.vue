<script setup>
import { ref, computed } from 'vue'
import { programi } from '../data/programi.js'
import ProgramKartica from '../components/ProgramKartica.vue'

const trazi = ref('')
const podrucje = ref('')
const grad = ref('')
const podrucja = []
const gradovi = []

for (const program of programi) {
  if (!podrucja.includes(program.podrucje)) {
    podrucja.push(program.podrucje)
  }
  if (!gradovi.includes(program.grad)) {
    gradovi.push(program.grad)
  }
}

podrucja.sort()
gradovi.sort()

// abecedni popis se slozi jednom, filtri ga poslije samo suzavaju
const poAbecedi = programi.slice()
poAbecedi.sort((a, b) => a.naziv.localeCompare(b.naziv, 'hr'))

function odgovara(program) {
  if (podrucje.value && program.podrucje !== podrucje.value) {
    return false
  }
  if (grad.value && program.grad !== grad.value) {
    return false
  }
  const upit = trazi.value.toLowerCase()
  return program.naziv.toLowerCase().includes(upit) || program.fakultetNaziv.toLowerCase().includes(upit) || program.fakultetKratica.toLowerCase().includes(upit) || program.grad.toLowerCase().includes(upit)
}

const filtrirani = computed(() => {
  const rezultat = []
  for (const program of poAbecedi) {
    if (odgovara(program)) {
      rezultat.push(program)
    }
  }
  return rezultat
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <h1 class="text-3xl font-extrabold text-blue-950">Studijski programi</h1>
    <p class="text-gray-500 mt-2">Studijski programi i uvjeti upisa iz nacionalnog sustava prijava.</p>

    <!-- pretraga i filtri -->
    <div class="flex flex-col sm:flex-row gap-3 mt-6 mb-4">
      <input v-model="trazi" type="text" placeholder="Naziv studijskog programa, fakultet ili grad" class="flex-1 bg-white border border-stone-300 rounded-lg p-2.5 text-sm" />
      <select v-model="podrucje" class="bg-white border border-stone-300 rounded-lg p-2.5 text-sm text-gray-500">
        <option value="">Sva područja</option>
        <option v-for="p in podrucja" :key="p" :value="p">{{ p }}</option>
      </select>
      <select v-model="grad" class="bg-white border border-stone-300 rounded-lg p-2.5 text-sm text-gray-500">
        <option value="">Svi gradovi</option>
        <option v-for="g in gradovi" :key="g" :value="g">{{ g }}</option>
      </select>
    </div>

    <p v-if="filtrirani.length === 0" class="text-sm text-gray-500">Nema studijskih programa koji odgovaraju pretrazi.</p>

    <div v-else class="grid sm:grid-cols-2 gap-3">
      <ProgramKartica v-for="program in filtrirani" :key="program.id" :program="program" />
    </div>
  </div>
</template>
