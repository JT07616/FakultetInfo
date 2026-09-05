<script setup>
import { computed } from 'vue'
import { ChevronUp, ChevronDown } from 'lucide-vue-next'
import { programi } from '../data/programi.js'
import { useAuthStore } from '../stores/authStore.js'
import ProgramKartica from '../components/ProgramKartica.vue'

const authStore = useAuthStore()

// favoriti redom kako ih je korisnik poredao (redoslijed iz baze)
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

// zamijeni favorit s onim iznad (pomak -1) ili ispod (pomak 1)
function pomakni(index, pomak) {
  const novi = authStore.profil.favoriti.slice()
  const spremljeno = novi[index]
  novi[index] = novi[index + pomak]
  novi[index + pomak] = spremljeno
  authStore.spremiFavorite(novi)
}

const strelica = 'bg-white border border-stone-300 rounded-lg p-1 hover:border-blue-300 disabled:opacity-30 disabled:hover:border-stone-300'
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <h1 class="text-3xl font-extrabold text-blue-950">Moj portal</h1>

    <!-- lijevo lista prioriteta, desno obavijesti favorita -->
    <div class="grid gap-10 lg:grid-cols-2 mt-6">
      <div>
        <h2 class="text-xl font-extrabold text-blue-950">Moja lista prioriteta</h2>
        <p class="text-sm text-gray-500 mt-1 mb-4">Poredaj studijskeprograme strelicama.</p>

        <p v-if="!favoriti.length" class="text-sm text-gray-500">Još nemaš favorita, otvori studijski program i klikni "Dodaj u favorite".</p>

        <div v-else class="flex flex-col gap-3">
          <div v-for="(program, index) in favoriti" :key="program.id" class="flex items-center gap-3">
            <span class="w-8 text-xl font-extrabold text-blue-950 text-center">{{ index + 1 }}.</span>

            <ProgramKartica :program="program" class="flex-1" />
            <div class="flex flex-col gap-1">
              <button @click="pomakni(index, -1)" :disabled="index === 0" :class="strelica"><ChevronUp class="size-4" /></button>
              <button @click="pomakni(index, 1)" :disabled="index === favoriti.length - 1" :class="strelica"><ChevronDown class="size-4" /></button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-xl font-extrabold text-blue-950">Obavijesti</h2>
        <p class="text-sm text-gray-500 mt-1 mb-4">Novosti fakulteta i programa s tvoje liste.</p>

        <p class="text-sm text-gray-500">Ovdje će stizati obavijesti za tvoje favorite.</p>
      </div>
    </div>
  </div>
</template>
