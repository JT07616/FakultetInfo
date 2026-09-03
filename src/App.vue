<script setup>
const veza = 'hover:text-yellow-300 font-semibold'
const aktivna = 'text-yellow-300'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <nav class="bg-blue-950 px-6 py-3 flex items-center gap-6 text-white">
      <RouterLink to="/" class="text-lg font-semibold text-white">Fakultet<span class="text-yellow-300">Info</span></RouterLink>

      <RouterLink to="/fakulteti" :class="veza" :active-class="aktivna">Fakulteti</RouterLink>
      <RouterLink to="/studijski-programi" :class="veza" :active-class="aktivna">Studijski programi</RouterLink>
    </nav>

    <main class="flex-1">
      <RouterView />
    </main>

    <footer class="bg-blue-950 px-6 py-2 text-sm text-white text-center">FakultetInfo, 2026.</footer>
  </div>
</template>
