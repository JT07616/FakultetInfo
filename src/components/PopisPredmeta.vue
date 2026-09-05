<script setup>
defineProps(['predmeti'])
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <span v-for="predmet in predmeti" :key="predmet" class="text-xs text-gray-600 border border-stone-200 rounded-full px-3 py-1">{{ predmet }}</span>
  </div>
</template>