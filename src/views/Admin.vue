<script setup>
import Korisnici from '../components/Korisnici.vue'
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-10">
    <h1 class="text-3xl font-extrabold text-blue-950">Admin</h1>
    <h2 class="text-xl font-extrabold text-blue-950 mt-8">Korisnici</h2>
    <p class="text-sm text-gray-500 mt-1 mb-4">Predstavniku fakulteta dodijeli ulogu prema službenoj e-mail adresi.</p>
    <Korisnici />
  </div>
</template>