<script setup>
import { MapPin, GraduationCap, BookOpen } from 'lucide-vue-next'

defineProps(['program'])
</script>

<template>
  <!-- kartica: logo u plocici, naziv i fakultet, u podnozju razina i podrucje -->
  <RouterLink :to="'/studijski-programi/' + program.id" class="bg-white border border-stone-300 rounded-xl p-5 shadow-sm flex flex-col hover:border-blue-300 hover:shadow-md">
    <div class="flex-1 flex items-start gap-3.5">
      <span class="size-13 shrink-0 flex items-center justify-center bg-stone-50 border border-stone-200 rounded-xl">
        <img v-if="program.fakultetSlika" :src="program.fakultetSlika" :alt="program.fakultetKratica" class="max-w-9 max-h-9 object-contain" />
        <span v-else class="text-xs font-semibold text-blue-950">{{ program.fakultetKratica }}</span>
      </span>
      <span>
        <span class="font-semibold text-blue-950 leading-snug">{{ program.naziv }}</span>
        <span class="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
          {{ program.fakultetKratica }}
          <span class="text-stone-300"> · </span>
          <MapPin class="size-3.5" />{{ program.grad }}
        </span>
      </span>
    </div>

    <div class="border-t border-stone-100 mt-4 pt-3 flex items-center justify-between gap-3 text-sm text-gray-500">
      <span class="flex items-center gap-1.5"><GraduationCap class="size-4" />{{ program.razina }}</span>
      <span class="flex items-center gap-1.5"><BookOpen class="size-4" />{{ program.podrucje }}</span>
    </div>
  </RouterLink>
</template>
