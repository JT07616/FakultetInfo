<script setup>
import { ref } from 'vue'
import PopisPredmeta from '../components/PopisPredmeta.vue'

const props = defineProps(['program'])
const emit = defineEmits(['izracunaj'])

const b = props.program.bodovanje

// obvezni dio mature kao lista redaka za formu
const obvezni = [
  { kljuc: 'hrvatski', naziv: 'Hrvatski jezik', trazena: b.hrvatski.razina },
  { kljuc: 'matematika', naziv: 'Matematika', trazena: b.matematika.razina },
  { kljuc: 'straniJezik', naziv: b.straniJezik.predmet || 'Strani jezik', trazena: b.straniJezik.razina },
]

// bodovani izborni imaju polje za unos, obavezni popis bez bodova ima kvacicu
const bodovaniIzborni = props.program.izborni.filter((izbor) => izbor.postotak > 0)
const popis = props.program.izborni.find((izbor) => izbor.postotak === 0 && izbor.obavezan)

const prosjek = ref('')
const matura = ref({ hrvatski: '', matematika: '', straniJezik: '' })
const razine = ref({ hrvatski: 'A', matematika: 'A', straniJezik: 'A' })
const izborni = ref({})
const polozenIzborni = ref(false)

const red = 'flex items-center justify-between gap-4 py-2'
const polje = 'w-full bg-white border border-stone-300 rounded-lg p-2.5 text-sm'

function posalji() {
  emit('izracunaj', {
    prosjek: prosjek.value,
    matura: matura.value,
    razine: razine.value,
    izborni: izborni.value,
    polozenIzborni: polozenIzborni.value,
  })
}
</script>

<template>
  <form @submit.prevent="posalji" class="bg-white border border-stone-300 rounded-xl p-5">
    <h2 class="text-lg font-extrabold text-blue-950">Prosjek srednje škole</h2>
    <div :class="red">
      <label for="prosjek" class="text-sm">Prosjek svih razreda <span class="text-gray-500">2,00 – 5,00</span></label>
      <div class="w-48 shrink-0">
        <input id="prosjek" v-model="prosjek" type="number" min="2" max="5" step="0.01" required placeholder="npr. 4.35" :class="polje" />
      </div>
    </div>

    <h2 class="text-lg font-extrabold text-blue-950 border-t border-stone-100 mt-4 pt-4">Državna matura</h2>
    <div v-for="predmet in obvezni" :key="predmet.kljuc" :class="red">
      <label :for="predmet.kljuc" class="text-sm">{{ predmet.naziv }} <span class="text-gray-500">traži se {{ predmet.trazena }} razina</span></label>
      <div class="flex gap-2 w-48 shrink-0">
        <div class="w-20">
          <select v-model="razine[predmet.kljuc]" :class="polje">
            <option>A</option>
            <option>B</option>
          </select>
        </div>
        <div class="flex-1">
          <input :id="predmet.kljuc" v-model="matura[predmet.kljuc]" type="number" min="0" max="100" required placeholder="%" :class="polje" />
        </div>
      </div>
    </div>

    <template v-if="bodovaniIzborni.length">
      <h2 class="text-lg font-extrabold text-blue-950 border-t border-stone-100 mt-4 pt-4">Izborni predmeti</h2>
      <div v-for="izbor in bodovaniIzborni" :key="izbor.predmeti[0]" :class="red">
        <label :for="izbor.predmeti[0]" class="text-sm">{{ izbor.predmeti[0] }} <span class="text-gray-500">{{ izbor.obavezan ? 'obavezan' : 'po izboru' }}</span></label>
        <div class="w-48 shrink-0">
          <input :id="izbor.predmeti[0]" v-model="izborni[izbor.predmeti[0]]" type="number" min="0" max="100" placeholder="%" :class="polje" />
        </div>
      </div>
    </template>

    <div v-if="popis" class="border-t border-stone-100 mt-4 pt-4">
      <h2 class="text-lg font-extrabold text-blue-950">Izborni predmeti</h2>
      <p class="text-sm text-gray-500 mt-1">Za prijavu je obavezan jedan od navedenih (ne donosi bodove):</p>
      <PopisPredmeta :predmeti="popis.predmeti" class="mt-2" />
      <label class="flex items-center gap-2 text-sm mt-3">
        <input v-model="polozenIzborni" type="checkbox" />
        Položen mi je jedan od navedenih predmeta
      </label>
    </div>

    <button class="bg-blue-900 text-white font-semibold rounded-lg px-5 py-2 hover:bg-blue-950 mt-5">Izračunaj bodove</button>
  </form>
</template>
