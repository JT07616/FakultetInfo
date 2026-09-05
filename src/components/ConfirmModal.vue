<script setup>
defineProps(['tekst'])
defineEmits(['potvrdi', 'odustani'])
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" @click.self="$emit('odustani')">
    <div class="bg-white rounded-xl p-6 max-w-sm w-full">
      <p class="font-medium text-black">{{ tekst }}</p>
      <div class="flex justify-end gap-2 mt-5">
        <button @click="$emit('odustani')" class="bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg px-4 py-2 hover:bg-gray-100">Odustani</button>
        <button @click="$emit('potvrdi')" class="bg-blue-900 text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-blue-950">Potvrdi</button>
      </div>
    </div>
  </div>
</template>
