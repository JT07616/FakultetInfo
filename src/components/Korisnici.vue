<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config.js'
import { fakulteti } from '../data/katalog.js'
import ConfirmModal from './ConfirmModal.vue'


const korisnici = ref([])
const pretraga = ref('')

async function ucitajKorisnike() {
  const snapshot = await getDocs(collection(db, 'users'))
  const rezultat = []
  for (const dokument of snapshot.docs) {
    rezultat.push({
      uid: dokument.id,
      username: dokument.data().username,
      email: dokument.data().email || '',
      role: dokument.data().role,
      fakultetId: dokument.data().fakultetId || '',
      odabrani: '',
    })
  }
  korisnici.value = rezultat
}

const filtrirani = computed(() => korisnici.value.filter((k) => k.email.toLowerCase().includes(pretraga.value.toLowerCase())))

async function dajUlogu(korisnik) {
  await updateDoc(doc(db, 'users', korisnik.uid), { role: 'fakultet', fakultetId: korisnik.odabrani })
  korisnik.role = 'fakultet'
  korisnik.fakultetId = korisnik.odabrani
}

async function makniUlogu(korisnik) {
  await updateDoc(doc(db, 'users', korisnik.uid), { role: 'user', fakultetId: '' })
  korisnik.role = 'user'
  korisnik.fakultetId = ''
}

const korisnikZaDodjelu = ref(null)
const korisnikZaMicanje = ref(null)

onMounted(ucitajKorisnike)
</script>

<template>
  <div>
    <input v-model="pretraga" type="text" placeholder="Pretraži po e-mail adresi" class="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-sm mb-4" />

    <div class="flex flex-col gap-3">
      <div v-for="korisnik in filtrirani" :key="korisnik.uid" class="bg-white border border-stone-300 rounded-xl px-5 py-4 flex flex-wrap items-center gap-3">
        <div class="mr-auto">
          <p class="font-semibold text-blue-950">{{ korisnik.username }}</p>
          <p class="text-sm text-gray-500">{{ korisnik.email }}</p>
        </div>

        <span v-if="korisnik.role === 'admin'" class="text-sm font-semibold text-gray-500">admin</span>

        <template v-else-if="korisnik.role === 'fakultet'">
          <span class="text-sm font-semibold text-blue-950">predstavnik: {{ korisnik.fakultetId.toUpperCase() }}</span>
          <button @click="korisnikZaMicanje = korisnik" class="bg-red-700 text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-red-800">Makni ulogu</button>
        </template>

        <template v-else>
          <select v-model="korisnik.odabrani" class="bg-white border border-stone-300 rounded-lg p-2 text-sm text-gray-500">
            <option value="" disabled>Odaberi fakultet</option>
            <option v-for="fakultet in fakulteti" :key="fakultet.id" :value="fakultet.id">{{ fakultet.kratica }} - {{ fakultet.naziv }}</option>
          </select>
          <button @click="korisnikZaDodjelu = korisnik" :disabled="!korisnik.odabrani" class="bg-blue-900 text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-blue-950 disabled:opacity-50">Daj ulogu</button>
        </template>
      </div>
    </div>

    <ConfirmModal
      v-if="korisnikZaDodjelu"
      :tekst="'Dodijeli korisniku ' + korisnikZaDodjelu.username + ' ulogu predstavnika fakulteta ' + korisnikZaDodjelu.odabrani.toUpperCase() + '?'"
      @potvrdi="dajUlogu(korisnikZaDodjelu); korisnikZaDodjelu = null"
      @odustani="korisnikZaDodjelu = null"
    />
    <ConfirmModal
      v-if="korisnikZaMicanje"
        :tekst="'Makni korisniku ' + korisnikZaMicanje.username + ' ulogu predstavnika fakulteta ' + korisnikZaMicanje.fakultetId.toUpperCase() + '?'"
       @potvrdi="makniUlogu(korisnikZaMicanje); korisnikZaMicanje = null"
      @odustani="korisnikZaMicanje = null"
    />
  </div>
</template>