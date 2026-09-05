<script setup>
import { useRoute } from 'vue-router'
import { GraduationCap, BookOpen, Users } from 'lucide-vue-next'
import { programi } from '../data/programi.js'
import FavoritGumb from '../components/FavoritGumb.vue'


const route = useRoute()
const program = programi.find((p) => p.id === route.params.id)

// prag je broj (npr. 55) ili tekst (npr. '50. centil')
function pragTekst(prag) {
  if (typeof prag === 'number') {
    return 'prag: najmanje ' + prag + ' %'
  }
  return 'prag: ' + prag
}

// redci kartice bodovanja: prosjek pa obavezni dio mature
const bodovanje = []

if (program) {
  const b = program.bodovanje
  bodovanje.push({ naziv: 'Prosjek ocjena', postotak: b.prosjek })
  bodovanje.push({ naziv: 'Hrvatski jezik', razina: b.hrvatski.razina, postotak: b.hrvatski.postotak, prag: b.hrvatski.prag })
  bodovanje.push({ naziv: 'Matematika', razina: b.matematika.razina, postotak: b.matematika.postotak, prag: b.matematika.prag })
  bodovanje.push({ naziv: b.straniJezik.predmet || 'Strani jezik', razina: b.straniJezik.razina, postotak: b.straniJezik.postotak, prag: b.straniJezik.prag })
}

// ponavljajuce klase
const kartica = 'bg-white border border-stone-300 rounded-xl'
const traka = 'h-2 bg-stone-100 rounded-full mt-3'
const znacka = 'flex items-center gap-2 text-sm text-gray-600 bg-white border border-stone-300 rounded-full px-3 py-1.5'
const naslov = 'text-xl font-extrabold text-blue-950 mt-10'
const opis = 'text-sm text-gray-500 mt-1 mb-4'
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <RouterLink to="/studijski-programi" class="text-sm font-semibold text-blue-900 hover:text-blue-950">← Studijski programi</RouterLink>

    <p v-if="!program" class="text-gray-500 mt-8">Studijski program nije pronađen.</p>

    <template v-else>
      <!-- zaglavlje programa -->
      <div class="mt-6 flex items-start gap-4">
        <div class="size-20 shrink-0 flex items-center justify-center bg-white border border-stone-300 rounded-xl">
          <img v-if="program.fakultetSlika" :src="program.fakultetSlika" :alt="program.fakultetKratica" class="size-14 object-contain" />
          <span v-else class="text-sm font-semibold text-blue-950">{{ program.fakultetKratica }}</span>
        </div>
        <div>
          <h1 class="text-3xl font-extrabold text-blue-950">{{ program.naziv }}</h1>
          <p class="text-gray-500 mt-1">{{ program.fakultetNaziv }} · {{ program.grad }}</p>
        </div>

        <FavoritGumb :program-id="program.id" class="ml-auto shrink-0" />
      </div>

      <div class="flex flex-wrap gap-2 mt-5">
        <span :class="znacka"><GraduationCap class="size-4" />{{ program.razina }}</span>
        <span :class="znacka"><BookOpen class="size-4" />{{ program.podrucje }}</span>
        <span :class="znacka"><Users class="size-4" />Upisna kvota: {{ program.kvota }}</span>
      </div>

      <!-- bodovanje: prosjek i obavezni dio mature -->
      <h2 :class="naslov">Bodovanje</h2>
      <p :class="opis">Koliko koji dio nosi u ukupnim bodovima za upis.</p>

      <div :class="kartica">
        <div v-for="stavka in bodovanje" :key="stavka.naziv" class="p-4">
          <div class="flex justify-between">
            <p class="font-medium text-blue-950">{{ stavka.naziv }}</p>
            <span v-if="stavka.postotak" class="font-semibold text-blue-950">{{ stavka.postotak }} %</span>
            <span v-else class="text-sm text-gray-500">ne boduje se</span>
          </div>
          <p v-if="stavka.razina" class="text-sm text-gray-500">razina {{ stavka.razina }}<span v-if="stavka.prag"> · {{ pragTekst(stavka.prag) }}</span></p>
          <div v-if="stavka.postotak" :class="traka"><div class="h-full bg-blue-900 rounded-full" :style="'width: ' + stavka.postotak + '%'"></div></div>
        </div>
      </div>

      <!-- izborni predmeti mature -->
      <h2 :class="naslov">Izborni predmeti</h2>
      <p :class="opis">Predmeti koje kandidat sam bira na maturi.</p>

      <p v-if="!program.izborni.length" class="text-sm text-gray-500">Ovaj studij ne boduje izborne predmete.</p>

      <div v-else :class="kartica">
        <!-- duzi popis - cipovi, kratki kao redak s trakom -->
        <div v-for="(izbor, redni) in program.izborni" :key="redni" class="p-4">
          <div v-if="izbor.predmeti.length > 2">
            <p class="font-medium text-blue-950">Jedan predmet s popisa</p>
            <p class="text-sm text-gray-500">{{ izbor.obavezan ? 'obavezan izbor' : 'po izboru' }} · ne donosi bodove</p>
            <div class="flex flex-wrap gap-2 mt-3">
              <span v-for="predmet in izbor.predmeti" :key="predmet" class="text-xs text-gray-600 border border-stone-200 rounded-full px-3 py-1">{{ predmet }}</span>
            </div>
          </div>

          <div v-else>
            <div class="flex justify-between">
              <p class="font-medium text-blue-950">{{ izbor.predmeti.join(' ili ') }}</p>
              <span v-if="izbor.postotak" class="font-semibold text-blue-950">{{ izbor.postotak }} %</span>
              <span v-else class="text-sm text-gray-500">uvjet, ne boduje se</span>
            </div>
            <p class="text-sm text-gray-500">{{ izbor.obavezan ? 'obavezan izbor' : 'po izboru' }}<span v-if="izbor.prag"> · {{ pragTekst(izbor.prag) }}</span></p>
            <div v-if="izbor.postotak" :class="traka"><div class="h-full bg-blue-900 rounded-full" :style="'width: ' + izbor.postotak + '%'"></div></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
