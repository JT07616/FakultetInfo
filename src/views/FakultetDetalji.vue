<script setup>
import { useRoute } from 'vue-router'
import { MapPin, Globe } from 'lucide-vue-next'
import { fakulteti } from '../data/katalog.js'
import { programi } from '../data/programi.js'
import ProgramKartica from '../components/ProgramKartica.vue'
import Obavijesti from '../components/Obavijesti.vue'
import { useAuthStore } from '../stores/authStore.js'

const authStore = useAuthStore()
const route = useRoute()
const fakultet = fakulteti.find((f) => f.id === route.params.id)

// studijski programi ovog fakulteta
const njegoviProgrami = []

if (fakultet) {
  for (const program of programi) {
    if (program.fakultetId === fakultet.id) {
      njegoviProgrami.push(program)
    }
  }
}

const naslov = 'text-xl font-extrabold text-blue-950 mt-10'
const opis = 'text-sm text-gray-500 mt-1 mb-4'
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <!-- predstavniku fakulteta je ovo pocetna stranica pa povratak na listu ne treba -->
    <RouterLink v-if="!authStore.isFakultet" to="/fakulteti" class="text-sm font-semibold text-blue-900 hover:text-blue-950">← Fakulteti</RouterLink>

    <p v-if="!fakultet" class="text-gray-500 mt-8">Taj fakultet ne postoji.</p>

    <template v-else>
      <!-- zaglavlje fakulteta -->
      <div class="mt-6 flex items-start gap-4">
        <div class="size-20 shrink-0 flex items-center justify-center bg-white border border-stone-300 rounded-xl">
          <img v-if="fakultet.slika" :src="fakultet.slika" :alt="fakultet.naziv" class="size-14 object-contain" />
          <span v-else class="text-sm font-semibold text-blue-950">{{ fakultet.kratica }}</span>
        </div>
        <div>
          <h1 class="text-3xl font-extrabold text-blue-950">{{ fakultet.naziv }}</h1>
          <p class="text-gray-500 mt-1">{{ fakultet.sveuciliste || 'Samostalno veleučilište' }}</p>
        </div>
      </div>

      <div class="inline-flex flex-wrap gap-5 mt-5 text-sm text-gray-600 bg-white border border-stone-300 rounded-lg px-4 py-2.5">
        <span class="flex items-center gap-2 border-r border-stone-300 pr-5"><MapPin class="size-4" />{{ fakultet.adresa }}</span>
        <a :href="fakultet.web" target="_blank" class="flex items-center gap-2 font-semibold text-blue-900 hover:text-blue-950"><Globe class="size-4" />{{ fakultet.web.replace('https://', '') }}</a>
      </div>

      <!-- studijski programi fakulteta -->
      <h2 :class="naslov">Studijski programi</h2>
      <p :class="opis">Programi koje fakultet nudi u nacionalnom sustavu prijava.</p>

      <div class="grid sm:grid-cols-2 gap-3">
        <ProgramKartica v-for="program in njegoviProgrami" :key="program.id" :program="program" />
      </div>

      <!-- obavijesti dodaje predstavnik fakulteta -->
      <h2 :class="naslov">Obavijesti</h2>
      <p :class="opis">Najave i rokovi vezani uz upise na ovaj fakultet.</p>

      <Obavijesti :fakultet-id="fakultet.id" />
    </template>
  </div>
</template>
