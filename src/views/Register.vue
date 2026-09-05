<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore.js'
import showPass from '../components/showPass.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const korisnickoIme = ref('')
const email = ref('')
const lozinka = ref('')
const potvrdaLozinke = ref('')
const greska = ref('')
const uspjeh = ref('')
const salje = ref(false)

function provjeriUnos() {
  if (!korisnickoIme.value || !email.value || !lozinka.value || !potvrdaLozinke.value) {
   return 'Sva polja su obavezna!'
   
  }
  if (lozinka.value.length < 6) {
    return 'Lozinka mora imati barem 6 znakova.'
  }
  if (!/[0-9]/.test(lozinka.value)) {
    return 'Lozinka mora imati barem jedan broj.'
  }
  if (!/[A-ZČĆŠŽĐ]/.test(lozinka.value)) {
    return 'Lozinka mora imati barem jedno veliko slovo.'
  }
  if (lozinka.value !== potvrdaLozinke.value) {
    return 'Lozinke nisu iste.'
  }
  return ''
}

async function registracija(){
  greska.value = provjeriUnos()
  if (greska.value) {
    return
  }
  salje.value = true
  try {
    await authStore.registracija(email.value, lozinka.value, korisnickoIme.value)

    uspjeh.value = 'Registracija uspješna. Preusmjeravam...'

    setTimeout(function () {
      router.push('/mojportal')
    }, 1500)

    return
  } catch (error) {
    greska.value = error.message
  }
  salje.value = false
}
</script>

<template>
  <div class="max-w-md mx-auto px-6 py-16">
    <h1 class="text-3xl text-blue-950 text-center font-bold mb-5">Registracija</h1>

    <form @submit.prevent="registracija" class="flex flex-col gap-4 border bg-white border-gray-300 shadow-md p-6 rounded-xl">
      <div class="flex flex-col gap-1">
        <label class="font-semibold">E-mail</label>
        <input v-model="email" type="email" class="bg-white border border-gray-300 rounded-lg px-3 py-2" placeholder="ime.prezime@gmail.com" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-semibold">Korisničko ime:</label>
        <input v-model="korisnickoIme" type="text" class="bg-white border border-gray-300 rounded-lg px-3 py-2" placeholder="Korisničko ime" />
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-semibold">Lozinka:</label>
        <showPass v-model="lozinka" placeholder="Upiši lozinku" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-semibold">Potvrdi lozinku:</label>
        <showPass v-model="potvrdaLozinke" placeholder="Potvrdi lozinku" />
      </div>
      <button :disabled="salje" class="bg-blue-950 text-white font-semibold rounded px-4 py-2 mt-2 hover:bg-blue-700">Registriraj se</button>
      <p class="text-sm text-center">Već imaš račun?<RouterLink to="/login" class="text-blue-950 font-semibold"> Prijavi se</RouterLink></p>
      <p v-if="uspjeh" class="text-green-700 text-sm">{{ uspjeh }}</p>
      <p v-if="greska" class="text-red-500 text-sm">{{ greska }}</p>
    </form>
  </div>
</template>
