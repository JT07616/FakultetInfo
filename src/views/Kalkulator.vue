<script setup>
import { ref } from 'vue'
import KalkulatorForma from '../components/KalkulatorForma.vue'
import KalkulatorRezultat from '../components/KalkulatorRezultat.vue'
import { izracunajBodove } from '../utils/kalkulatorBodovi.js'
import { useRoute } from 'vue-router'
import { programi } from '../data/programi.js'


const route = useRoute()
const program = programi.find((p) => p.id === route.params.id)



const rezultat = ref(null)
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <RouterLink v-if="program" :to="'/studijski-programi/' + program.id" class="text-sm font-semibold text-blue-900 hover:text-blue-950">← {{ program.naziv }}</RouterLink>

    <p v-if="!program" class="text-gray-500 mt-8">Studijski program nije pronađen.</p>

    <template v-else>
      <h1 class="text-3xl font-extrabold text-blue-950 mt-6">Kalkulator bodova</h1>
      <p class="text-gray-500 mt-2">{{ program.naziv }} · {{ program.fakultetKratica }} · {{ program.grad }}</p>

      <div class="grid gap-6 lg:grid-cols-2 items-start mt-6">
  <KalkulatorForma :program="program" @izracunaj="rezultat = izracunajBodove(program, $event)" />

  <KalkulatorRezultat v-if="rezultat" :rezultat="rezultat" />
  <div v-else class="bg-white border border-stone-300 rounded-xl p-5">
    <h2 class="text-lg font-extrabold text-blue-950">Rezultat</h2>
    <p class="text-sm text-gray-500 mt-2">Ispuni podatke i rezultat će se prikazati ovdje.</p>
  </div>
      </div>
    </template>
  </div>
</template>