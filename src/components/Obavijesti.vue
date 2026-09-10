<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config.js'
import { useAuthStore } from '../stores/authStore.js'
import ConfirmModal from './ConfirmModal.vue'
import ObavijestKartica from './ObavijestKartica.vue'


const props = defineProps(['fakultetId'])
const authStore = useAuthStore()

const obavijesti = ref([])
const naslov = ref('')
const tekst = ref('')
const urediId = ref(null)
const obavijestZaBrisanje = ref(null)
const smijeUredjivati = computed(() => authStore.isFakultet && authStore.profil.fakultetId === props.fakultetId) 
const smijeBrisati = computed(() => smijeUredjivati.value || authStore.isAdmin) // admin ne pise obavijesti, ali ih smije obrisati (moderacija)
const greska = ref('')

async function ucitajObavijesti() {
  greska.value = ''
  try {
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
  } catch (e) {
    console.error(e)
    greska.value = 'Učitavanje obavijesti nije uspjelo.'
  }
}

function odustani() {
  urediId.value = null
  naslov.value = ''
  tekst.value = ''
}

async function spremiObavijest() {
  greska.value = ''
  try {
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
  } catch (e) {
    console.error(e)
    greska.value = 'Spremanje obavijesti nije uspjelo.'
  }
}

function popuniFormu(obavijest) {
  urediId.value = obavijest.id
  naslov.value = obavijest.naslov
  tekst.value = obavijest.tekst
}

async function obrisi(obavijest) {
  greska.value = ''
  try {
    await deleteDoc(doc(db, 'obavijesti', obavijest.id))
    await ucitajObavijesti()
  } catch (e) {
    console.error(e)
    greska.value = 'Greska pri brisanju obavijesti.'
  }
}

onMounted(ucitajObavijesti)
</script>

<template>
  <div>
    <p v-if="greska" class="text-sm text-red-700 mb-3">{{ greska }}</p>

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
      <ObavijestKartica v-for="obavijest in obavijesti" :key="obavijest.id" :obavijest="obavijest">
        <div v-if="smijeBrisati" class="border-t border-stone-100 mt-3 pt-2 flex gap-4">
          <button v-if="smijeUredjivati" @click="popuniFormu(obavijest)" class="text-sm font-semibold text-blue-900">Uredi</button>
          <button @click="obavijestZaBrisanje = obavijest" class="text-sm font-semibold text-red-700">Obriši</button>
        </div>
      </ObavijestKartica>
    </div>

    <ConfirmModal
      v-if="obavijestZaBrisanje"
      :tekst="'Obriši obavijest \'' + obavijestZaBrisanje.naslov + '\'?'"
      @potvrdi="obrisi(obavijestZaBrisanje); obavijestZaBrisanje = null"
      @odustani="obavijestZaBrisanje = null"
    />
  </div>
</template>
