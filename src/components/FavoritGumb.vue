<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Star } from 'lucide-vue-next'
import { useAuthStore } from '../stores/authStore.js'

// kod kartice studijskih programa je mala zvjezdica
const props = defineProps(['programId', 'mala'])
const authStore = useAuthStore()
const router = useRouter()

const jeFavorit = computed(() => authStore.isLoggedIn && authStore.profil.favoriti.includes(props.programId))

function klik() {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  authStore.toggleFavorit(props.programId)
}
</script>

<template>
  <!-- mala varijanta je gola zvjezdica s tooltipom, velika je pilula s tekstom -->
  <button v-if="!authStore.isAdmin && !authStore.isFakultet" @click.prevent.stop="klik" :title="jeFavorit ? 'Makni iz favorita' : 'Dodaj u favorite'" :class="mala ? '' : 'flex items-center gap-2 text-sm font-semibold text-blue-950 bg-white border border-stone-300 rounded-full px-4 py-2 hover:border-blue-300'">
    <Star :class="(mala ? 'size-6 ' : 'size-4 ') + (jeFavorit ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400 hover:text-yellow-400')" />
    <template v-if="!mala">{{ jeFavorit ? 'U favoritima' : 'Dodaj u favorite' }}</template>
  </button>
</template>