<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Landmark, MapPin, Globe, Image as ImageIcon } from 'lucide-vue-next'
import { fakulteti } from '../data/katalog.js'
import Zaglavlje from '../components/Zaglavlje.vue'

const ruta = useRoute()
const fakultet = computed(() => fakulteti.find((f) => f.id === ruta.params.id))
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-10">
    <div v-if="!fakultet" class="bg-white border border-blue-200 rounded-lg p-8 text-center">
      <p class="font-medium text-blue-950">Taj fakultet ne postoji</p>
      <RouterLink to="/fakulteti" class="text-sm font-semibold text-blue-700">Povratak na listu fakulteta</RouterLink>
    </div>

    <div v-else>
      <Zaglavlje :naslov="fakultet.naziv" natrag="/fakulteti" natragTekst="Fakulteti" />

      <div class="bg-white border border-blue-200 rounded-lg flex overflow-hidden">
        <!-- TU IĐE LOGOTIP FAKULTETA
             Kad u katalog.js dodam polje slika, ovdje dolazi:
             <img :src="fakultet.slika" :alt="fakultet.naziv" class="w-full" /> -->
        <div class="w-44 shrink-0 bg-blue-900 grid place-items-center p-6">
          <ImageIcon class="size-10 text-blue-700" />
        </div>

        <div class="p-6">
          <p class="flex items-center gap-2 border-b border-blue-100 pb-3"><Landmark class="size-4" />{{ fakultet.sveuciliste }}</p>
          <p class="flex items-center gap-2 mt-3"><MapPin class="size-4" />{{ fakultet.adresa }}</p>
          <a :href="fakultet.web" target="_blank" class="flex items-center gap-2 font-semibold text-blue-700 mt-3"> <Globe class="size-4" />{{ fakultet.web.replace('https://', '') }} </a>
        </div>
      </div>
    </div>
  </div>
</template>
