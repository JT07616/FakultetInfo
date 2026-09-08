<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config.js'
import { ChevronUp, ChevronDown } from 'lucide-vue-next'
import { programi } from '../data/programi.js'
import { fakulteti } from '../data/katalog.js'
import { useAuthStore } from '../stores/authStore.js'
import ProgramKartica from '../components/ProgramKartica.vue'
import Obavijesti from '../components/Obavijesti.vue'

const authStore = useAuthStore()

const favoriti = computed(() => {
  const rezultat = []
  for (const id of authStore.profil.favoriti) {
    const program = programi.find((p) => p.id === id)
    if (program) {
      rezultat.push(program)
    }
  }
  return rezultat
})

const fakultetiFavorita = computed(() => {
  const rezultat = []
  for (const program of favoriti.value) {
    const fakultet = fakulteti.find((f) => f.id === program.fakultetId)
    if (fakultet && !rezultat.includes(fakultet)) {
      rezultat.push(fakultet)
    }
  }
  return rezultat
})

const rokovi = ref([])
const greska = ref('')

async function ucitajRokove() {
  if (!authStore.profil.favoriti.length) return // 'in' s praznom listom baca gresku
  greska.value = ''
  try {
    const upit = query(collection(db, 'upisi'), where('programId', 'in', authStore.profil.favoriti)) // jedan upit za sve, in podrzava do 10 - toliko i postanistudent dopusta prijava
    const snapshot = await getDocs(upit)
    const rezultat = snapshot.docs.map((dokument) => dokument.data())
    rezultat.sort((a, b) => (a.prijaveDo > b.prijaveDo ? 1 : -1)) // najblizi rok prvi
    rokovi.value = rezultat
  } catch (e) {
    console.error(e)
    greska.value = 'Učitavanje rokova nije uspjelo.'
  }
}

function rokoviPrograma(programId) {
  return rokovi.value.filter((upis) => upis.programId === programId)
}

// zeleni rub dok prijave jos traju, crveni kad "prijave do" prodje
function bojaRoka(upis) {
  if (!upis.prijaveDo) return 'border-stone-200'
  const d = new Date()
  const danas = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
  return upis.prijaveDo >= danas ? 'border-green-600' : 'border-red-600'
}

function prikaziDatum(datum) {
  if (!datum) return '—'
  const dijelovi = datum.split('-')
  return Number(dijelovi[2]) + '.' + Number(dijelovi[1]) + '.' + dijelovi[0] + '.'
}

async function pomakni(index, pomak) {
  const novi = authStore.profil.favoriti.slice()
  const spremljeno = novi[index]
  novi[index] = novi[index + pomak]
  novi[index + pomak] = spremljeno
  try {
    await authStore.spremiFavorite(novi)
  } catch (e) {
    console.error(e)
  }
}

onMounted(ucitajRokove)

const strelica = 'bg-white border border-stone-300 rounded-lg p-1 enabled:hover:border-blue-300 disabled:opacity-30'
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <h1 class="text-3xl font-extrabold text-blue-950">Moj portal</h1>

    <div class="grid gap-10 lg:grid-cols-2 mt-6">
      <div>
        <!-- lista prioriteta -->
        <h2 class="text-xl font-extrabold text-blue-950">Moja lista prioriteta</h2>
        <p class="text-sm text-gray-500 mt-1 mb-4">Poredaj studijske programe strelicama.</p>

        <p v-if="greska" class="text-sm text-red-700 mb-3">{{ greska }}</p>
        <p v-if="!favoriti.length" class="text-sm text-gray-500">Još nemaš favorita.</p>

        <div v-else class="flex flex-col gap-3">
          <div v-for="(program, index) in favoriti" :key="program.id" class="flex items-center gap-3">
            <span class="w-8 text-xl font-extrabold text-blue-950 text-center">{{ index + 1 }}.</span>
            <ProgramKartica :program="program" class="flex-1">
              <p v-for="upis in rokoviPrograma(program.id)" :key="upis.rok" class="bg-stone-50 border rounded-lg px-3 py-1.5 text-sm text-gray-600 mt-2" :class="bojaRoka(upis)">
                <span class="font-semibold text-blue-950">{{ upis.rok }} rok {{ upis.godina }}.</span> · prijave do {{ prikaziDatum(upis.prijaveDo) }} · upisi do {{ prikaziDatum(upis.upisiDo) }}
              </p>
            </ProgramKartica>
            <div class="flex flex-col gap-1">
              <button @click="pomakni(index, -1)" :disabled="index === 0" :class="strelica"><ChevronUp class="size-4" /></button>
              <button @click="pomakni(index, 1)" :disabled="index === favoriti.length - 1" :class="strelica"><ChevronDown class="size-4" /></button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <!-- obavijesti od favorita -->
        <h2 class="text-xl font-extrabold text-blue-950">Obavijesti</h2>
        <p class="text-sm text-gray-500 mt-1 mb-4">Novosti fakulteta s tvoje liste.</p>
        <p v-if="!fakultetiFavorita.length" class="text-sm text-gray-500">Dodaj programe u favorite pa će se ovdje pojaviti obavijesti njihovih fakulteta.</p>
        <Obavijesti v-for="fakultet in fakultetiFavorita" :key="fakultet.id" :fakultet-id="fakultet.id" :oznaka="fakultet.kratica + ' - ' + fakultet.naziv" :sakrij-prazno="true" class="mb-6" />
      </div>
    </div>
  </div>
</template>