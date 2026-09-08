<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore.js'

const authStore = useAuthStore()
const router = useRouter()

const veza = 'text-base font-extrabold text-white hover:text-yellow-150'
const aktivna = 'text-orange-200'

async function odjaviSe() {
  await authStore.odjava()
  router.push('/login')
}
</script>

<template>
  <div class="bg-[#faf9f5] flex flex-col min-h-screen">
    <nav class="bg-blue-950 select-none">
      <div class="max-w-6xl mx-auto px-6 py-3 flex items-center gap-6 text-sm text-white">
        <RouterLink to="/" class="text-lg font-bold">Fakultet<span class="text-yellow-300">Info</span></RouterLink>
        <!-- admin i predstavnik fakulteta u izborniku imaju samo svoje, ostali javne stranice -->
        <template v-if="!authStore.isAdmin && !authStore.isFakultet">
          <RouterLink to="/fakulteti" :class="veza" :active-class="aktivna">Fakulteti</RouterLink>

          <RouterLink to="/studijski-programi" :class="veza" :active-class="aktivna">Studijski programi</RouterLink>
        </template>

        <template v-if="authStore.isLoggedIn">
          <RouterLink v-if="!authStore.isAdmin && !authStore.isFakultet" to="/lista-prioriteta" :class="veza" :active-class="aktivna">Lista prioriteta</RouterLink>
          <RouterLink v-if="authStore.isFakultet" :to="'/fakulteti/' + authStore.profil.fakultetId" :class="veza" :active-class="aktivna">Portal fakulteta</RouterLink>
          <RouterLink v-if="authStore.isAdmin" to="/admin" :class="veza" :active-class="aktivna">Admin</RouterLink>

          <span class="ml-auto flex items-center gap-2 text-blue-200">{{ authStore.username }}<span v-if="authStore.isAdmin" class="border border-blue-800 text-xs rounded px-2 py-0.5">admin</span></span>
          <RouterLink to="/profil" :class="veza" :active-class="aktivna">Profil</RouterLink>
          <button @click="odjaviSe" class="bg-yellow-300 text-blue-950 font-bold rounded-lg px-4 py-2 hover:bg-yellow-400">Odjavi se</button>
        </template>

        <template v-else>
          <RouterLink to="/login" class="ml-auto" :class="veza" :active-class="aktivna">Prijava</RouterLink>
          <RouterLink to="/register" :class="veza" :active-class="aktivna">Registracija</RouterLink>
        </template>
      </div>
    </nav>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer class="bg-blue-950 px-6 py-2 text-sm text-white text-center">FakultetInfo, 2026.</footer>
  </div>
</template>
