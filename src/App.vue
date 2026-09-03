<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/authStore.js'

const authStore = useAuthStore()
const router = useRouter()

const veza = 'hover:text-yellow-300 font-semibold'
const aktivna = 'text-yellow-300'

async function odjaviSe() {
  await authStore.odjava()
  router.push('/login')
}
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <nav class="bg-blue-950 px-6 py-3 flex items-center gap-6 text-white select-none">
      <RouterLink to="/" class="text-lg font-semibold text-white">Fakultet<span class="text-yellow-300">Info</span></RouterLink>
      <RouterLink to="/fakulteti" :class="veza" :active-class="aktivna">Fakulteti</RouterLink>
      <RouterLink to="/studijski-programi" :class="veza" :active-class="aktivna">Studijski programi</RouterLink>

      <template v-if="authStore.isLoggedIn">
        <RouterLink to="/mojportal" :class="veza" :active-class="aktivna">Moj portal</RouterLink>
        <RouterLink v-if="authStore.isAdmin" to="/admin" :class="veza" :active-class="aktivna">Admin</RouterLink>

        <span class="ml-auto flex items-center gap-2">
          {{ authStore.username }}
          <span v-if="authStore.isAdmin" class="border border-yellow-300 text-yellow-300 text-xs rounded px-2 py-0.5">admin</span>
        </span>
        <button @click="odjaviSe" class="bg-yellow-300 text-blue-950 font-semibold rounded px-4 py-2 hover:bg-yellow-400">Odjavi se</button>

      </template>

      <template v-else>

        <RouterLink to="/login" class="ml-auto" :class="veza" :active-class="aktivna">Prijava</RouterLink>
        <RouterLink to="/register" :class="veza" :active-class="aktivna">Registracija</RouterLink>
      </template>
    </nav>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer class="bg-blue-950 px-6 py-2 text-sm text-white text-center">FakultetInfo, 2026.</footer>
  </div>
</template>
