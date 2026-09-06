<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config.js'
import { CalendarDays } from 'lucide-vue-next'
import { useAuthStore } from '../stores/authStore.js'
import ConfirmModal from './ConfirmModal.vue'


const props = defineProps(['fakultetId', 'oznaka', 'sakrijPrazno'])
const authStore = useAuthStore()

const obavijesti = ref([])
const naslov = ref('')
const tekst = ref('')
const urediId = ref(null)
const obavijestZaBrisanje = ref(null)
const smijeUredjivati = computed(() => authStore.isFakultet && authStore.profil.fakultetId === props.fakultetId) 
const smijeBrisati = computed(() => smijeUredjivati.value || authStore.isAdmin) // admin ne pise obavijesti, ali ih smije obrisati (moderacija)

async function ucitajObavijesti() {
  const upit = query(collection(db, 'obavijesti'), where('fakultetId', '==', props.fakultetId))
  const snapshot = await getDocs(upit)

  const rezultat = []
  for (const dokument of snapshot.docs) {
    rezultat.push({
      id: dokument.id,
      naslov: dokument.data().naslov,
      tekst: dokument.data().tekst,
      datum: dokument.data().datum.toDate(),
    })
  }
  rezultat.sort((a, b) => b.datum - a.datum) 
  obavijesti.value = rezultat
}

async function spremiObavijest() {
  if (urediId.value) {
    await updateDoc(doc(db, 'obavijesti', urediId.value), { naslov: naslov.value, tekst: tekst.value })
  } else {
    await addDoc(collection(db, 'obavijesti'), {
      fakultetId: props.fakultetId,
      naslov: naslov.value,
      tekst: tekst.value,
      datum: new Date(),
    })
  }
  odustani()
  await ucitajObavijesti()
}

function popuniFormu(obavijest) {
  urediId.value = obavijest.id
  naslov.value = obavijest.naslov
  tekst.value = obavijest.tekst
}

function odustani() {
  urediId.value = null
  naslov.value = ''
  tekst.value = ''
}

async function obrisi(obavijest) {
  await deleteDoc(doc(db, 'obavijesti', obavijest.id))
  await ucitajObavijesti()
}

function danMjesec(datum) {
  return datum.getDate() + '.' + (datum.getMonth() + 1) + '.'
}

onMounted(ucitajObavijesti)
</script>

<template>
  <div v-if="!sakrijPrazno || obavijesti.length">
    <p v-if="oznaka" class="text-sm font-semibold text-gray-500 mb-2">{{ oznaka }}</p>

    <!-- predstavnik fakulteta -->
    <form v-if="smijeUredjivati" @submit.prevent="spremiObavijest" class="bg-white border border-stone-300 rounded-xl p-4 mb-4 flex flex-col gap-2">
      <p class="font-semibold text-blue-950">{{ urediId ? 'Uredi obavijest' : 'Nova obavijest' }}</p>
      <input v-model="naslov" type="text" placeholder="Naslov obavijesti" required class="bg-white border border-stone-300 rounded-lg p-2.5 text-sm" />
      <textarea v-model="tekst" rows="3" placeholder="Tekst obavijesti" required class="bg-white border border-stone-300 rounded-lg p-2.5 text-sm"></textarea>
      <div class="flex gap-2">
        <button class="bg-blue-900 text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-blue-950">{{ urediId ? 'Spremi izmjene' : 'Objavi' }}</button>
        <button v-if="urediId" type="button" @click="odustani" class="bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg px-4 py-2 hover:bg-gray-100">Odustani</button>
      </div>
    </form>

    <p v-if="!obavijesti.length" class="text-sm text-gray-500">Još nema obavijesti za ovaj fakultet.</p>

    <div v-else class="flex flex-col gap-3">
      <div v-for="obavijest in obavijesti" :key="obavijest.id" class="bg-white border border-stone-300 rounded-xl px-5 py-4 flex gap-5">
        <!-- kalendar i datum -->
        <div class="w-24 shrink-0 flex items-center gap-2">
          <CalendarDays class="size-8 text-gray-400" />
          <div>
            <p class="text-lg font-semibold text-blue-950 leading-tight">{{ danMjesec(obavijest.datum) }}</p>
            <p class="text-xs text-gray-500 leading-tight">{{ obavijest.datum.getFullYear() }}.</p>
          </div>
        </div>

        <div class="flex-1">
          <p class="font-semibold text-blue-950">{{ obavijest.naslov }}</p>
          <p class="text-sm text-gray-600 mt-1">{{ obavijest.tekst }}</p>

          <div v-if="smijeBrisati" class="border-t border-stone-100 mt-3 pt-2 flex gap-4">
            <button v-if="smijeUredjivati" @click="popuniFormu(obavijest)" class="text-sm font-semibold text-blue-900">Uredi</button>
            <button @click="obavijestZaBrisanje = obavijest" class="text-sm font-semibold text-red-700">Obriši</button>
          </div>
        </div>
      </div>
    </div>

    <ConfirmModal
      v-if="obavijestZaBrisanje"
      :tekst="'Obriši obavijest \'' + obavijestZaBrisanje.naslov + '\'?'"
      @potvrdi="obrisi(obavijestZaBrisanje); obavijestZaBrisanje = null"
      @odustani="obavijestZaBrisanje = null"
    />
  </div>
</template>
