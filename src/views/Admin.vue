<script setup>
import { ref, onMounted } from 'vue'
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase/config.js'
import { fakulteti } from '../data/katalog.js'
import Korisnici from '../components/Korisnici.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const pitanja = ref([])
const pitanjeZaBrisanje = ref(null)
const greska = ref('')

async function ucitajPitanja() {
  greska.value = ''
  try {
    const snapshot = await getDocs(collection(db, 'pitanja'))
    const rezultat = []
    for (const dokument of snapshot.docs) {
      rezultat.push({
        id: dokument.id,
        tekst: dokument.data().tekst,
        username: dokument.data().username,
        fakultetId: dokument.data().fakultetId,
        datum: dokument.data().datum.toDate(),
      })
    }
    rezultat.sort((a, b) => b.datum - a.datum)
    pitanja.value = rezultat // najnovija prva, skrola se unutar kartice
  } catch (e) {
    console.error(e)
    greska.value = 'Učitavanje pitanja nije uspjelo.'
  }
}

async function obrisiPitanje(pitanje) {
  greska.value = ''
  try {
    // s pitanjem se brisu i svi odgovori na njega
    const upitOdgovora = query(collection(db, 'odgovori'), where('pitanjeId', '==', pitanje.id))
    const snapshotOdgovora = await getDocs(upitOdgovora)
    for (const dokument of snapshotOdgovora.docs) {
      await deleteDoc(doc(db, 'odgovori', dokument.id))
    }
    await deleteDoc(doc(db, 'pitanja', pitanje.id))
    await ucitajPitanja()
  } catch (e) {
    console.error(e)
    greska.value = 'Brisanje pitanja nije uspjelo.'
  }
}

const bezPredstavnika = ref([])
const brojKorisnika = ref(0)
const brojPredstavnika = ref(0)

async function ucitajBezPredstavnika() {
  try {
    const upit = query(collection(db, 'users'), where('role', '==', 'fakultet'))
    const snapshot = await getDocs(upit)
    brojPredstavnika.value = snapshot.size
    const pokriveni = []
    for (const dokument of snapshot.docs) {
      pokriveni.push(dokument.data().fakultetId)
    }
    bezPredstavnika.value = fakulteti.filter((f) => !pokriveni.includes(f.id))
  } catch (e) {
    console.error(e)
  }
}

async function ucitajBrojKorisnika() {
  try {
    const snapshot = await getDocs(collection(db, 'users'))
    brojKorisnika.value = snapshot.size
  } catch (e) {
    console.error(e)
  }
}

function kraticaFakulteta(fakultetId) {
  const fakultet = fakulteti.find((f) => f.id === fakultetId)
  return fakultet ? fakultet.kratica : fakultetId
}

function prikaziDatum(datum) {
  return datum.getDate() + '.' + (datum.getMonth() + 1) + '.' + datum.getFullYear() + '.'
}

onMounted(() => {
  ucitajPitanja()
  ucitajBezPredstavnika()
  ucitajBrojKorisnika()
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <h1 class="text-3xl font-extrabold text-blue-950">Admin</h1>

    <div class="grid grid-cols-3 gap-4 mt-6">
      <div class="bg-white border border-stone-300 rounded-xl p-4">
        <p class="text-3xl font-extrabold text-blue-950">{{ brojKorisnika }}</p>
        <p class="text-sm text-gray-500">korisnika</p>
      </div>
      <div class="bg-white border border-stone-300 rounded-xl p-4">
        <p class="text-3xl font-extrabold text-blue-950">{{ brojPredstavnika }}</p>
        <p class="text-sm text-gray-500">predstavnika fakulteta</p>
      </div>
      <div class="bg-white border border-stone-300 rounded-xl p-4">
        <p class="text-3xl font-extrabold text-blue-950">{{ bezPredstavnika.length }}</p>
        <p class="text-sm text-gray-500">fakulteta bez predstavnika</p>
      </div>
    </div>
    <h2 class="text-xl font-extrabold text-blue-950 mt-8">Korisnici</h2>
    <p class="text-sm text-gray-500 mt-1 mb-4">Predstavniku fakulteta dodijeli ulogu prema službenoj e-mail adresi.</p>
    <Korisnici />
    <div class="grid gap-10 lg:grid-cols-2 mt-10">
      <!-- lijevo: fakulteti koje treba aktivirati -->
      <div>
        <h2 class="text-xl font-extrabold text-blue-950">Fakulteti bez predstavnika</h2>
        <p v-if="!bezPredstavnika.length" class="text-sm text-gray-500">Svi fakulteti imaju predstavnika.</p>
        <!-- cijela lista je popis zadataka, skrola se unutar kartice -->
        <div v-else class="bg-white border border-stone-300 rounded-xl divide-y divide-stone-100 max-h-80 overflow-y-auto">
          <div v-for="fakultet in bezPredstavnika" :key="fakultet.id" class="px-5 py-3">
            <p class="text-sm font-semibold text-blue-950">{{ fakultet.kratica }} <span class="font-normal text-gray-500">· {{ fakultet.naziv }}, {{ fakultet.grad }}</span></p>
          </div>
        </div>
      </div>
      <!-- desno: moderacija foruma -->
      <div>
        <h2 class="text-xl font-extrabold text-blue-950">Pitanja fakultetima</h2>
        <p class="text-sm text-gray-500 mt-1 mb-4">Najnovija pitanja korisnika sa svih fakulteta.</p>

        <p v-if="greska" class="text-sm text-red-700 mb-3">{{ greska }}</p>

        <p v-if="!pitanja.length" class="text-sm text-gray-500">Još nema pitanja.</p>

        <div v-else class="bg-white border border-stone-300 rounded-xl divide-y divide-stone-100 max-h-80 overflow-y-auto">
          <div v-for="pitanje in pitanja" :key="pitanje.id" class="px-5 py-3 flex items-center gap-3">
            <div class="mr-auto">
              <p class="text-xs text-gray-500">{{ pitanje.username }} · {{ kraticaFakulteta(pitanje.fakultetId) }} · {{ prikaziDatum(pitanje.datum) }}</p>
              <p class="text-sm text-gray-700 mt-0.5">{{ pitanje.tekst }}</p>
            </div>
            <button @click="pitanjeZaBrisanje = pitanje" class="text-sm font-semibold text-red-700">Obriši</button>
          </div>
        </div>
      </div>
    </div>

    <ConfirmModal
      v-if="pitanjeZaBrisanje"
      tekst="Obrisati ovo pitanje?"
      @potvrdi="obrisiPitanje(pitanjeZaBrisanje); pitanjeZaBrisanje = null"
      @odustani="pitanjeZaBrisanje = null"
    />
  </div>
</template>
