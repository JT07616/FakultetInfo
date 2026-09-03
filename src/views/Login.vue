<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/authStore.js'
import { useRouter } from 'vue-router'
import showPass from '../components/showPass.vue'

const authStore = useAuthStore()
const router = useRouter()

const lozinka = ref('')
const email = ref('')
const greska = ref('')
const submitted = ref(false)

async function prijava() {
  greska.value = ''
  if (!email.value || !lozinka.value) {
    greska.value = 'Sva polja su obavezna!'
    return
  }
  submitted.value = true
  try {

    await authStore.prijava(email.value, lozinka.value)
    if(authStore.user.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/mojportal')
    }
    router.push('/studijski-programi')
  } catch (error) {
    greska.value = error.message
  } 

  submitted.value = false
}
</script>

<template>
  <div class="max-w-md mx-auto px-6 py-16">
    <h1 class="text-3xl font-bold text-center mb-5 text-blue-950">Prijava</h1>

    <form @submit.prevent="prijava" class="flex flex-col gap-4 border border-gray-300 shadow-md p-6 rounded-xl">
      <div class="flex flex-col gap-1">
        <label class="font-semibold">E-mail:</label>
        <input v-model="email"  type="email" class="border border-gray-300 px-3 py-2 rounded-lg" placeholder="ime.prezime@gmail.com">
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-semibold">Lozinka:</label>
        <showPass v-model="lozinka" placeholder="Upiši lozinku" />
      </div>

      <button :disabled="submitted" class="bg-blue-950 text-white font-semibold rounded px-4 py-2 mt-2 hover:bg-blue-700">Prijavi se</button>
      <p class="text-sm text-center">Nemaš račun?<RouterLink to="/register" class="text-blue-950 font-semibold"> Registriraj se</RouterLink></p>
      <p v-if="greska" class="text-red-500 text-sm">{{ greska }}</p>
    </form>
  </div>
</template>