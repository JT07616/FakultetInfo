<script setup>
defineProps(['rezultat'])
</script>

<template>
  <div class="bg-white border border-stone-300 rounded-xl p-5">
    <h2 class="text-lg font-extrabold text-blue-950">Rezultat</h2>

    <table class="w-full mt-3">
      <tbody>
        <tr v-for="redak in rezultat.razrada" :key="redak.naziv" class="border-b border-stone-100">
          <td class="py-2 text-sm">{{ redak.naziv }}</td>
          <td class="py-2 text-right text-sm font-semibold text-blue-950">{{ redak.bodovi }} <span class="font-normal text-gray-500">/ {{ redak.maks }}</span></td>
        </tr>
        <tr>
          <td class="py-2 font-extrabold text-blue-950">Ukupno</td>
          <td class="py-2 text-right font-extrabold text-blue-950">{{ rezultat.ukupno }} <span class="font-normal text-sm text-gray-500">/ 1000</span></td>
        </tr>
      </tbody>
    </table>

    <p v-if="rezultat.nedostaju.length" class="text-sm text-red-700 mt-3">Za prijavu je obavezan ispit iz: {{ rezultat.nedostaju.join(', ') }}.</p>
    <p v-if="rezultat.kriveRazine.length" class="text-sm text-red-700 mt-2">Potrebna je viša (A) razina iz: {{ rezultat.kriveRazine.join(', ') }}.</p>
    <p v-if="rezultat.neispunjeniPragovi.length" class="text-sm text-red-700 mt-2">Nije dosegnut prag: {{ rezultat.neispunjeniPragovi.join(', ') }}.</p>
    <p v-if="!rezultat.polozenaMatura" class="text-sm text-red-700 mt-2">Obavezni ispiti moraju imati barem 50 %, a prosjek barem 2,00.</p>

    <p v-if="rezultat.uvjetiIspunjeni" class="text-sm font-semibold text-green-700 mt-3">Ispunjavaš uvjete upisa na ovaj studij.</p>

    <p v-for="napomena in rezultat.napomene" :key="napomena" class="text-sm text-gray-500 mt-2">{{ napomena }}</p>
  </div>
</template>
