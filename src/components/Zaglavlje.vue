<script setup>
defineProps(['naslov', 'podnaslov', 'natrag', 'natragTekst'])
</script>

<template>
  <div class="mb-6">
    <RouterLink :to="natrag" class="text-sm font-semibold text-blue-950 hover:underline">← {{ natragTekst }}</RouterLink>
    <h1 class="text-3xl font-bold text-blue-950 mt-2">{{ naslov }}</h1>
    <p v-if="podnaslov" class="text-black/60 mt-1">{{ podnaslov }}</p>
  </div>
</template>