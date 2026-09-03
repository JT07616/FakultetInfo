<script setup>
import { ref } from 'vue'
import showPass from '../components/showPass.vue'

const lozinka = ref('')
const potvrdaLozinke = ref('')
</script>

<template>
  <div class="max-w-md mx-auto px-6 py-16">
    <h1 class="text-3xl text-blue-950 text-center font-bold mb-5">Registracija</h1>

    <form @submit.prevent class="flex flex-col gap-4 border border-gray-300 shadow-md p-6 rounded-xl">
      <div class="flex flex-col gap-1">
        <label class="font-semibold">E-mail</label>
        <input type="email" class="border border-gray-300 rounded-lg  px-3 py-2" placeholder="ime.prezime@gmail.com" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-semibold">Korisničko ime:</label>
        <input type="text" class="border border-gray-300 rounded-lg px-3 py-2" placeholder="Korisničko ime" />
      </div>

      <div class="flex flex-col gap-1">
        <label class="font-semibold">Lozinka:</label>
        <showPass v-model="lozinka" placeholder="Upiši lozniku" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-semibold">Potvrdi lozinku:</label>
        <showPass v-model="potvrdaLozinke" placeholder="Potvrdi lozniku" />
      </div>
      <button class="bg-blue-950 text-white font-semibold rounded px-4 py-2 mt-2 hover:bg-blue-700">Registriraj se</button>
      <p class="text-sm text-center">Već imaš račun?<RouterLink to="/login" class="text-blue-950 font-semibold"> Prijavi se</RouterLink></p>
    </form>
  </div>
</template>
