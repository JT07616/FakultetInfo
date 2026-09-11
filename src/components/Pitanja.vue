<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config.js'
import { useAuthStore } from '../stores/authStore.js'
import { fakulteti } from '../data/katalog.js'
import ConfirmModal from './ConfirmModal.vue'

const props = defineProps(['fakultetId'])
const authStore = useAuthStore()

// sluzbeni odgovori se prikazuju s imenom fakulteta, ne s usernameom predstavnika
const fakultet = fakulteti.find((f) => f.id === props.fakultetId)
const nazivFakulteta = fakultet ? fakultet.naziv : ''

const pitanja = ref([])
const novoPitanje = ref('')
const odgovorNa = ref(null) // id pitanja na koje se trenutno odgovara
const noviOdgovor = ref('')
const pitanjeZaBrisanje = ref(null)
const odgovorZaBrisanje = ref(null)
const jePredstavnik = computed(() => authStore.isFakultet && authStore.profil.fakultetId === props.fakultetId)
const greska = ref('')

async function loadPitanja() {
  greska.value = ''
  try {
    const snapshot = await getDocs(query(collection(db, 'pitanja'), where('fakultetId', '==', props.fakultetId)))
    const rezultat = []
    for (const dokument of snapshot.docs) {
      rezultat.push({
        id: dokument.id,
        tekst: dokument.data().tekst,
        username: dokument.data().username,
        uid: dokument.data().uid,
        datum: dokument.data().datum.toDate(),
        odgovori: [],
      })
    }
    rezultat.sort((a, b) => b.datum - a.datum)
    const snapshotOdgovora = await getDocs(query(collection(db, 'odgovori'), where('fakultetId', '==', props.fakultetId))) // sve odgovore vucem odjednom a ne po svakom pitanju posebno

    for (const dokument of snapshotOdgovora.docs) {
      const pitanje = rezultat.find((p) => p.id === dokument.data().pitanjeId)
      if (pitanje) {
        pitanje.odgovori.push({
          id: dokument.id,
          tekst: dokument.data().tekst,
          username: dokument.data().username,
          uid: dokument.data().uid,
          sluzbeni: dokument.data().sluzbeni,
          datum: dokument.data().datum.toDate(),
        })
      }
    }
    for (const pitanje of rezultat) {
      pitanje.odgovori.sort((a, b) => a.datum - b.datum)
    }
    pitanja.value = rezultat
  } catch (e) {
    console.error(e)
    greska.value = 'Učitavanje pitanja nije uspjelo.'
  }
}

async function posaljiPitanje() {
  greska.value = ''
  try {
    await addDoc(collection(db, 'pitanja'), {
      fakultetId: props.fakultetId,
      tekst: novoPitanje.value,
      username: authStore.profil.username,
      uid: authStore.user.uid,
      datum: new Date(),
    })
    novoPitanje.value = ''
    await loadPitanja()
  } catch (e) {
    console.error(e)
    greska.value = 'Slanje pitanja nije uspjelo.'
  }
}

async function posaljiOdgovor(pitanje) {
  greska.value = ''
  try {
    await addDoc(collection(db, 'odgovori'), {
      pitanjeId: pitanje.id,
      pitanjeUid: pitanje.uid,
      fakultetId: props.fakultetId,
      tekst: noviOdgovor.value,
      username: authStore.profil.username,
      uid: authStore.user.uid,
      sluzbeni: jePredstavnik.value,
      datum: new Date(),
    })
    odgovorNa.value = null
    noviOdgovor.value = ''
    await loadPitanja()
  } catch (e) {
    console.error(e)
    greska.value = 'Slanje odgovora nije uspjelo.'
  }
}

async function obrisiPitanje(pitanje) {
  greska.value = ''
  try {
    // s pitanjem se brisu i svi odgovori na njega
    const snapshotOdgovora = await getDocs(query(collection(db, 'odgovori'), where('pitanjeId', '==', pitanje.id)))
    for (const dokument of snapshotOdgovora.docs) {
      await deleteDoc(doc(db, 'odgovori', dokument.id))
    }
    await deleteDoc(doc(db, 'pitanja', pitanje.id))
    await loadPitanja()
  } catch (e) {
    console.error(e)
    greska.value = 'Brisanje pitanja nije uspjelo.'
  }
}

async function obrisiOdgovor(odgovor) {
  greska.value = ''
  try {
    await deleteDoc(doc(db, 'odgovori', odgovor.id))
    await loadPitanja()
  } catch (e) {
    console.error(e)
    greska.value = 'Brisanje odgovora nije uspjelo.'
  }
}

function inicijal(username) {
  return username[0].toUpperCase()
}

function prikaziDatum(datum) {
  return datum.getDate() + '.' + (datum.getMonth() + 1) + '.' + datum.getFullYear() + '.'
}

function prikaziBrojOdgovora(pitanje) {
  if (!pitanje.odgovori.length) return 'Još nema odgovora'
  if (pitanje.odgovori.length === 1) return '1 odgovor'
  return pitanje.odgovori.length + ' odgovora'
}

onMounted(loadPitanja)
</script>

<template>
  <div>
    <p v-if="greska" class="text-sm text-red-700 mb-3">{{ greska }}</p>

    <!-- pitanje -->
    <form v-if="authStore.user" @submit.prevent="posaljiPitanje" class="bg-white border border-stone-300 rounded-xl p-4 mb-4 flex flex-col gap-2">
      <p class="font-semibold text-blue-950">Postavi pitanje</p>
      <textarea v-model="novoPitanje" rows="2" placeholder="Što te zanima o ovom fakultetu?" required class="bg-white border border-stone-300 rounded-lg p-2.5 text-sm"></textarea>
      <button class="self-start bg-blue-900 text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-blue-950">Pošalji</button>
    </form>
    <p v-else class="text-sm text-gray-500 mb-4">
      <RouterLink to="/login" class="font-semibold text-blue-900">Prijavi se</RouterLink> za postavljanje pitanja.
    </p>

    <p v-if="!pitanja.length" class="text-sm text-gray-500">Još nema pitanja za ovaj fakultet.</p>

    <div v-else class="flex flex-col gap-3">
      <div v-for="pitanje in pitanja" :key="pitanje.id" class="bg-white border border-stone-300 rounded-xl px-5 py-4">
        <div class="flex items-center gap-3">
          <div class="size-9 shrink-0 flex items-center justify-center bg-blue-100 text-blue-900 font-bold text-sm rounded-full">{{ inicijal(pitanje.username) }}</div>
          <div>
            <p class="text-sm font-semibold text-blue-950">{{ pitanje.username }}</p>
            <p class="text-xs text-gray-500">{{ prikaziDatum(pitanje.datum) }}</p>
          </div>
        </div>
        <p class="text-gray-700 mt-3">{{ pitanje.tekst }}</p>

        <!-- odgovori  -->
        <div v-for="odgovor in pitanje.odgovori" :key="odgovor.id" class="bg-stone-50 border border-stone-200 rounded-lg p-3 mt-3 ml-6">
          <div class="flex items-center gap-2">
            <div class="size-7 shrink-0 flex items-center justify-center font-bold text-xs rounded-full" :class="odgovor.sluzbeni ? 'bg-blue-950 text-yellow-300' : 'bg-blue-100 text-blue-900'">{{ inicijal(odgovor.sluzbeni ? nazivFakulteta : odgovor.username) }}</div>
            <p class="text-sm font-semibold text-blue-950">{{ odgovor.sluzbeni ? nazivFakulteta : odgovor.username }}</p>
            <span v-if="odgovor.sluzbeni" class="bg-yellow-300 text-blue-950 text-xs font-bold rounded px-1.5 py-0.5">FAKULTET</span>
            <p class="text-xs text-gray-500 ml-auto">{{ prikaziDatum(odgovor.datum) }}</p>
            <button v-if="authStore.user && (authStore.user.uid === odgovor.uid || jePredstavnik || authStore.isAdmin)" @click="odgovorZaBrisanje = odgovor" class="text-xs font-semibold hover:underline text-red-700">Obriši</button>
          </div>
          <p class="text-sm text-gray-700 mt-2">{{ odgovor.tekst }}</p>
        </div>

        <div v-if="authStore.user" class="border-t border-stone-100 mt-3 pt-2">
          <form v-if="odgovorNa === pitanje.id" @submit.prevent="posaljiOdgovor(pitanje)" class="flex gap-2 ml-6">
            <input v-model="noviOdgovor" type="text" placeholder="Tvoj odgovor" required class="flex-1 bg-white border border-stone-300 rounded-lg p-2 text-sm" />
            <button class="bg-blue-900 text-white text-sm font-semibold rounded-lg px-4 hover:bg-blue-950">Odgovori</button>
            <button type="button" @click="odgovorNa = null" class="bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg px-4 hover:bg-gray-100">Odustani</button>
          </form>
          <div v-else class="flex items-center gap-4">
            <button @click="odgovorNa = pitanje.id; noviOdgovor = ''" class="text-sm font-semibold hover:underline text-blue-900">Odgovori</button>
            <button v-if="authStore.user.uid === pitanje.uid || jePredstavnik || authStore.isAdmin" @click="pitanjeZaBrisanje = pitanje" class="text-sm hover:underline font-semibold text-red-700">Obriši</button>
            <p class="text-xs text-gray-400 ml-auto">{{ prikaziBrojOdgovora(pitanje) }}</p>
          </div>
        </div>
      </div>
    </div>

    <ConfirmModal
      v-if="pitanjeZaBrisanje"
      tekst="Obrisati ovo pitanje i sve odgovore na njega?"
      @potvrdi="obrisiPitanje(pitanjeZaBrisanje); pitanjeZaBrisanje = null"
      @odustani="pitanjeZaBrisanje = null"
    />
    <ConfirmModal
      v-if="odgovorZaBrisanje"
      tekst="Obrisati ovaj odgovor?"
      @potvrdi="obrisiOdgovor(odgovorZaBrisanje); odgovorZaBrisanje = null"
      @odustani="odgovorZaBrisanje = null"
    />
  </div>
</template>
