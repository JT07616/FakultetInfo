<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { auth } from '../firebase/config.js'
import { useAuthStore } from '../stores/authStore.js'
import { prevediGresku } from '../utils/greske.js'
import showPass from '../components/showPass.vue'

const authStore = useAuthStore()
const router = useRouter()

const staraLozinka = ref('')
const novaLozinka = ref('')
const potvrdaLozinke = ref('')
const greska = ref('')

function uloga() {
  if (authStore.isAdmin) return 'administrator'
  if (authStore.isFakultet) return 'predstavnik fakulteta ' + authStore.profil.fakultetId.toUpperCase()
  return 'korisnik'
}

function provjeriUnos() {
  if (!staraLozinka.value || !novaLozinka.value || !potvrdaLozinke.value) {
    return 'Sva polja su obavezna!'
  }
  if (novaLozinka.value.length < 6) {
    return 'Lozinka mora imati barem 6 znakova.'
  }
  if (!/[0-9]/.test(novaLozinka.value)) {
    return 'Lozinka mora imati barem jedan broj.'
  }
  if (!/[A-ZČĆŠŽĐ]/.test(novaLozinka.value)) {
    return 'Lozinka mora imati barem jedno veliko slovo.'
  }
  if (novaLozinka.value !== potvrdaLozinke.value) {
    return 'Lozinke nisu iste.'
  }
  return ''
}

async function promijeniLozinku() {
  greska.value = provjeriUnos()
  if (greska.value) {
    return
  }
  try {
    const credential = EmailAuthProvider.credential(authStore.user.email, staraLozinka.value)
    await reauthenticateWithCredential(auth.currentUser, credential)
    await updatePassword(auth.currentUser, novaLozinka.value)
    await authStore.odjava()
    router.push('/login')
  } catch (error) {
    console.error(error)
    if (error.code === 'auth/invalid-credential') {
      greska.value = 'Stara lozinka nije točna.'
    } else {
      greska.value = prevediGresku(error.code)
    }
  }
}
</script>

<template>
  <div class="max-w-md mx-auto px-6 py-16">
    <h1 class="text-3xl text-blue-950 text-center font-bold mb-5">Profil</h1>

    <div class="bg-white border border-gray-300 shadow-md rounded-xl divide-y divide-stone-100 mb-6">
      <div class="px-5 py-3">
        <p class="text-xs text-gray-500">Korisničko ime</p>
        <p class="font-semibold text-blue-950">{{ authStore.username }}</p>
      </div>
      <div class="px-5 py-3">
        <p class="text-xs text-gray-500">E-mail</p>
        <p class="font-semibold text-blue-950">{{ authStore.user.email }}</p>
      </div>
      <div class="px-5 py-3">
        <p class="text-xs text-gray-500">Uloga</p>
        <p class="font-semibold text-blue-950">{{ uloga() }}</p>
      </div>
    </div>

    <form @submit.prevent="promijeniLozinku" class="flex flex-col gap-4 border bg-white border-gray-300 shadow-md p-6 rounded-xl">
      <h2 class="font-bold text-blue-950">Promjena lozinke</h2>

      <div class="flex flex-col gap-1">
        <label class="font-semibold">Stara lozinka:</label>
        <showPass v-model="staraLozinka" placeholder="Upiši staru lozinku" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-semibold">Nova lozinka:</label>
        <showPass v-model="novaLozinka" placeholder="Upiši novu lozinku" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-semibold">Potvrdi novu lozinku:</label>
        <showPass v-model="potvrdaLozinke" placeholder="Potvrdi novu lozinku" />
      </div>

      <button class="bg-blue-950 text-white font-semibold rounded px-4 py-2 mt-2 hover:bg-blue-700">Promijeni lozinku</button>
      <p v-if="greska" class="text-red-500 text-sm">{{ greska }}</p>
    </form>
  </div>
</template>
