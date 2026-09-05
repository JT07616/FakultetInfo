<script setup>
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

defineProps(['modelValue', 'placeholder'])

const emit = defineEmits(['update:modelValue'])

const vidljiva = ref(false)
</script>

<template>
  <div class="relative">
    <input :value="modelValue" :placeholder="placeholder" @input="emit('update:modelValue', $event.target.value)" :type="vidljiva ? 'text' : 'password'" class="w-full bg-white border border-gray-300 px-3 py-2 pr-10 rounded-lg" />
    <button type="button" @click="vidljiva = !vidljiva" class="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black">
      <EyeOff v-if="vidljiva" :size="18" />
      <Eye v-else :size="18" />
    </button>
  </div>
</template>
