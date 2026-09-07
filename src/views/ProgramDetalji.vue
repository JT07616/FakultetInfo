<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { collection, query, where, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config.js'
import { GraduationCap, BookOpen, Users, Calculator } from 'lucide-vue-next'
import { programi } from '../data/programi.js'
import { useAuthStore } from '../stores/authStore.js'
import FavoritGumb from '../components/FavoritGumb.vue'
import PopisPredmeta from '../components/PopisPredmeta.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const authStore = useAuthStore()

const route = useRoute()
const program = programi.find((p) => p.id === route.params.id)
const bodovanje = []

if (program) {
  const b = program.bodovanje
  bodovanje.push({ naziv: 'Prosjek ocjena', postotak: b.prosjek })
  bodovanje.push({ naziv: 'Hrvatski jezik', razina: b.hrvatski.razina, postotak: b.hrvatski.postotak, prag: b.hrvatski.prag })
  bodovanje.push({ naziv: 'Matematika', razina: b.matematika.razina, postotak: b.matematika.postotak, prag: b.matematika.prag })
  bodovanje.push({ naziv: b.straniJezik.predmet || 'Strani jezik', razina: b.straniJezik.razina, postotak: b.straniJezik.postotak, prag: b.straniJezik.prag })
}

function pragTekst(prag) {
  if (typeof prag === 'number') {
    return 'prag: najmanje ' + prag + ' %'
  }
  return 'prag: ' + prag
}

// gumbi za unos vide se samo predstavniku fakulteta kojem program pripada
const jePredstavnik = computed(() => program && authStore.isFakultet && authStore.profil.fakultetId === program.fakultetId)

const tekucaGodina = new Date().getFullYear()
const upisi = ref([])
const greska = ref('')
const prikaziFormu = ref(false)
const godina = ref(tekucaGodina)
const rok = ref('ljetni')
const kvota = ref('')
const prijaveDo = ref('')
const upisiDo = ref('')
const upisZaBrisanje = ref(null)

async function ucitajUpisne() {
  greska.value = ''
  try {
    const upit = query(collection(db, 'upisi'), where('programId', '==', program.id))
    const snapshot = await getDocs(upit)
    const rezultat = snapshot.docs.map((dokument) => dokument.data())
    rezultat.sort((a, b) => a.godina - b.godina || (a.rok === 'ljetni' ? -1 : 1)) // ljetni rok prije jesenskog
    upisi.value = rezultat
  } catch (e) {
    console.error(e)
    greska.value = 'Učitavanje upisnih podataka nije uspjelo.'
  }
}

async function spremiUpisne() {
  greska.value = ''
  if (prijaveDo.value && upisiDo.value && prijaveDo.value > upisiDo.value) {
    greska.value = 'Prijave moraju završiti prije upisa.'
    return
  }
  try {
    await setDoc(doc(db, 'upisi', program.id + '_' + rok.value), { // ne moze duplo isti rok, setDoc ga prepise
      programId: program.id,
      fakultetId: program.fakultetId,
      godina: Number(godina.value),
      rok: rok.value,
      kvota: kvota.value === '' ? null : Number(kvota.value),  // prazna kvota se sprema kao null, ne kao 0
      prijaveDo: prijaveDo.value,
      upisiDo: upisiDo.value,
    })
    odustani()
    await ucitajUpisne()
  } catch (e) {
    console.error(e)
    greska.value = 'Spremanje upisnih podataka nije uspjelo.'
  }
}

function odustani() {
  prikaziFormu.value = false
  godina.value = tekucaGodina
  rok.value = 'ljetni'
  kvota.value = ''
  prijaveDo.value = ''
  upisiDo.value = ''
}

function popuniFormu(upis) {
  prikaziFormu.value = true
  godina.value = upis.godina
  rok.value = upis.rok
  kvota.value = upis.kvota ?? ''
  prijaveDo.value = upis.prijaveDo
  upisiDo.value = upis.upisiDo
}

async function obrisiUpisne(upis) {
  greska.value = ''
  try {
    await deleteDoc(doc(db, 'upisi', program.id + '_' + upis.rok))
    await ucitajUpisne()
  } catch (e) {
    console.error(e)
    greska.value = 'Brisanje upisnih podataka nije uspjelo.'
  }
}

function prikaziDatum(datum) {
  if (!datum) return '—'
  const dijelovi = datum.split('-')
  return Number(dijelovi[2]) + '.' + Number(dijelovi[1]) + '.' + dijelovi[0] + '.'
}

// zeleno dok upisi jos traju, crveno kad je "upisi do" prosao, nista ako datuma nema
function bojaRetka(upis) {
  if (!upis.upisiDo) return ''
  const d = new Date()
  const danas = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
  return upis.upisiDo >= danas ? 'border-l-4 border-l-green-600' : 'border-l-4 border-l-red-600'
}

onMounted(() => {
  if (program) {
    ucitajUpisne()
  }
})

const kartica = 'bg-white border border-stone-300 rounded-xl'
const traka = 'h-1.5 bg-stone-100 rounded-full mt-2'
const naslov = 'text-xl font-extrabold text-blue-950 mt-10 mb-4'
const polje = 'block border border-stone-300 rounded-lg p-2 mt-1'
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <!-- predstavnik-fakultet, ostali-lista studijskih programa -->
    <RouterLink v-if="jePredstavnik" :to="'/fakulteti/' + program.fakultetId" class="text-sm font-semibold text-blue-900 hover:text-blue-950">← Natrag na moj portal</RouterLink>
    <RouterLink v-else to="/studijski-programi" class="text-sm font-semibold text-blue-900 hover:text-blue-950">← Studijski programi</RouterLink>

    <p v-if="!program" class="text-gray-500 mt-8">Studijski program nije pronađen.</p>

    <template v-else>
     
      <div class="mt-6 flex items-start gap-4">
        <div class="size-20 shrink-0 flex items-center justify-center bg-white border border-stone-300 rounded-xl">
          <img v-if="program.fakultetSlika" :src="program.fakultetSlika" :alt="program.fakultetKratica" class="size-14 object-contain" />
          <span v-else class="text-sm font-semibold text-blue-950">{{ program.fakultetKratica }}</span>
        </div>
        <div>
          <h1 class="text-3xl font-extrabold text-blue-950">{{ program.naziv }}</h1>
          <p class="text-gray-500 mt-1">{{ program.fakultetNaziv }} · {{ program.grad }}</p>
        </div>

        <div class="ml-auto shrink-0 flex gap-2">
          <RouterLink v-if="!jePredstavnik" :to="'/kalkulator/' + program.id" class="flex items-center gap-2 text-sm font-semibold text-white bg-blue-900 rounded-full px-4 py-2 hover:bg-blue-950"> <Calculator class="size-4" />Izračunaj bodove </RouterLink>
          <button v-else @click="prikaziFormu = !prikaziFormu" class="text-sm font-semibold text-white bg-blue-900 rounded-full px-4 py-2 hover:bg-blue-950">+ Dodaj upisne podatke</button>
          <FavoritGumb :program-id="program.id" />
        </div>
      </div>

      <div class="inline-flex flex-wrap gap-5 mt-5 text-sm text-gray-600 bg-white border border-stone-300 rounded-lg px-4 py-2.5">
        <span class="flex items-center gap-2 border-r border-stone-300 pr-5"><GraduationCap class="size-4" />{{ program.razina }}</span>
        <span class="flex items-center gap-2 border-r border-stone-300 pr-5"><BookOpen class="size-4" />{{ program.podrucje }}</span>
        <span class="flex items-center gap-2"><Users class="size-4" />Upisna kvota: {{ program.kvota }}</span>
      </div>

      <h2 class="text-xl font-extrabold text-blue-950 mt-10">Upisni podaci</h2>
      <p class="text-sm text-gray-500 mt-1 mb-4">Rokovi prijava i upisa te upisne kvote za ljetni i jesenski rok.</p>

      <p v-if="greska" class="text-sm text-red-700 mb-3">{{ greska }}</p>

      <form v-if="prikaziFormu" @submit.prevent="spremiUpisne" :class="kartica" class="p-4 mb-4">
        <div class="flex flex-wrap gap-4">
          <label class="text-sm text-gray-600">Godina<input v-model="godina" type="number" :min="tekucaGodina" :max="tekucaGodina + 1" required :class="polje" class="w-28" /></label>
          <label class="text-sm text-gray-600">Rok
            <select v-model="rok" :class="polje">
              <option value="ljetni">ljetni</option>
              <option value="jesenski">jesenski</option>
            </select>
          </label>
          <label class="text-sm text-gray-600">Kvota<input v-model="kvota" type="number" min="0" :class="polje" class="w-28" /></label>
          <label class="text-sm text-gray-600">Prijave do<input v-model="prijaveDo" type="date" :min="godina + '-01-01'" :max="godina + '-12-31'" :class="polje" /></label>
          <label class="text-sm text-gray-600">Upisi do<input v-model="upisiDo" type="date" :min="godina + '-01-01'" :max="godina + '-12-31'" :class="polje" /></label>
        </div>
        <div class="flex gap-2 mt-4">
          <button type="submit" class="text-sm font-semibold text-white bg-blue-900 rounded-lg px-4 py-2 hover:bg-blue-950">Spremi</button>
          <button type="button" @click="odustani" class="text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg px-4 py-2 hover:bg-gray-100">Odustani</button>
        </div>
      </form>

      <div v-if="upisi.length" :class="kartica" class="divide-y divide-stone-100">
        <div v-for="upis in upisi" :key="upis.godina + '-' + upis.rok" class="p-4 sm:flex sm:items-center sm:gap-6" :class="bojaRetka(upis)">
          <div class="sm:w-28 shrink-0">
            <p class="text-lg font-bold text-blue-950">{{ upis.godina }}.</p>
            <p class="text-xs text-gray-500">{{ upis.rok }} rok</p>
          </div>
          <div class="flex-1 grid grid-cols-3 gap-3 mt-2 sm:mt-0 text-xs text-gray-500">
            <p>Upisna kvota<span class="block text-base font-semibold text-blue-950">{{ upis.kvota ?? '—' }}</span></p>
            <p>Prijave do<span class="block text-base font-semibold text-blue-950">{{ prikaziDatum(upis.prijaveDo) }}</span></p>
            <p>Upisi do<span class="block text-base font-semibold text-blue-950">{{ prikaziDatum(upis.upisiDo) }}</span></p>
          </div>

          <div v-if="jePredstavnik" class="shrink-0 flex gap-2 mt-3 sm:mt-0">
            <button @click="popuniFormu(upis)" class="text-sm font-semibold text-white bg-blue-900 rounded-lg px-4 py-2 hover:bg-blue-950">Uredi</button>
            <button @click="upisZaBrisanje = upis" class="bg-red-700 text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-red-800">Obriši</button>
          </div>
        </div>
      </div>

      <ConfirmModal
        v-if="upisZaBrisanje"
        :tekst="'Obrisati upisne podatke za ' + upisZaBrisanje.godina + '. — ' + upisZaBrisanje.rok + ' rok?'"
        @potvrdi="obrisiUpisne(upisZaBrisanje); upisZaBrisanje = null"
        @odustani="upisZaBrisanje = null"
      />

      <h2 :class="naslov">Bodovanje</h2>
      <div :class="kartica">
        <div v-for="stavka in bodovanje" :key="stavka.naziv" class="p-3">
          <div class="flex justify-between">
            <p class="font-medium text-blue-950">{{ stavka.naziv }}</p>
            <span v-if="stavka.postotak" class="font-semibold text-blue-950">{{ stavka.postotak }} %</span>
            <span v-else class="text-sm text-gray-500">ne boduje se</span>
          </div>
          <p v-if="stavka.razina" class="text-sm text-gray-500">razina {{ stavka.razina }}<span v-if="stavka.prag"> · {{ pragTekst(stavka.prag) }}</span></p>
          <div v-if="stavka.postotak" :class="traka"><div class="h-full bg-blue-900 rounded-full" :style="'width: ' + stavka.postotak + '%'"></div></div>
        </div>
      </div>
    
      <h2 :class="naslov">Izborni predmeti</h2>
      <p v-if="!program.izborni.length" class="text-sm text-gray-500">Ovaj studij ne boduje izborne predmete.</p>
      <div v-else :class="kartica">
        <div v-for="(izbor, redni) in program.izborni" :key="redni" class="p-3">
          <div v-if="izbor.predmeti.length > 2">
            <p class="font-medium text-blue-950">Jedan predmet s popisa</p>
            <p class="text-sm text-gray-500">{{ izbor.obavezan ? 'obavezan izbor' : 'po izboru' }} · ne donosi bodove</p>
            <PopisPredmeta :predmeti="izbor.predmeti" class="mt-3" />
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
