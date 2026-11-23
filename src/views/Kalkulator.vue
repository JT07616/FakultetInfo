<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import PopisPredmeta from '../components/PopisPredmeta.vue'
import { programi } from '../data/programi.js'

const route = useRoute()
const program = programi.find((p) => p.id === route.params.id)

let obvezni = []
let bodovaniIzborni = []
let popis = null

if (program) {
  const b = program.bodovanje
  obvezni = [
    { kljuc: 'hrvatski', naziv: 'Hrvatski jezik', trazena: b.hrvatski.razina },
    { kljuc: 'matematika', naziv: 'Matematika', trazena: b.matematika.razina },
    { kljuc: 'straniJezik', naziv: b.straniJezik.predmet || 'Strani jezik', trazena: b.straniJezik.razina },
  ]

  // bodovani izborni imaju polje za unos, obavezni popis bez bodova ima kvacicu
  bodovaniIzborni = program.izborni.filter((izbor) => izbor.postotak > 0)
  popis = program.izborni.find((izbor) => izbor.postotak === 0 && izbor.obavezan)
}

const prosjek = ref('')
const matura = ref({ hrvatski: '', matematika: '', straniJezik: '' })
const razine = ref({ hrvatski: 'A', matematika: 'A', straniJezik: 'A' })
const izborni = ref({})
const polozenIzborni = ref(false)
const rezultat = ref(null)

// A razina vrijedi 1.6x kad studijski program trazi samo B
function preracunajRazinu(postotak, razina, trazena) {
  if (trazena === 'B' && razina === 'A') {
    return Math.min(postotak * 1.6, 100)
  }
  return postotak
}

// cita unose iz refova i na kraju upise rezultat
function izracunajBodove() {
  const b = program.bodovanje

  const razrada = []
  const nedostaju = []
  const kriveRazine = []
  const neispunjeniPragovi = []
  const napomene = []
  let sviPolozeni = true

  // prosjek srednje skole
  razrada.push({ naziv: 'Prosjek ocjena', maks: b.prosjek, bodovi: (prosjek.value / 5) * b.prosjek })

  // obvezni dio mature
  for (const predmet of obvezni) {
    const trazi = b[predmet.kljuc]
    const naziv = predmet.naziv
    const postotak = matura.value[predmet.kljuc]
    const razina = razine.value[predmet.kljuc]

    if (postotak < 50) {
      sviPolozeni = false
    }
    if (trazi.razina === 'A' && razina === 'B') {
      kriveRazine.push(naziv)
    }

    // sluzbeni prag programa: broj se provjerava, centil se iz postotka ne moze
    if (typeof trazi.prag === 'number' && postotak < trazi.prag) {
      neispunjeniPragovi.push(naziv + ' (najmanje ' + trazi.prag + ' %)')
    }
    if (typeof trazi.prag === 'string') {
      napomene.push(naziv + ': prag je ' + trazi.prag + ' i ovisi o rezultatima svih kandidata')
    }

    // predmeti koji se ne boduju (postotak 0) ulaze samo u uvjete, ne u razradu
    if (trazi.postotak > 0) {
      const zaBodove = preracunajRazinu(postotak, razina, trazi.razina)
      razrada.push({ naziv: naziv + ' (' + razina + ')', maks: trazi.postotak, bodovi: (zaBodove / 100) * trazi.postotak })
    }
  }
  // izborni
  for (const izbor of program.izborni) {
    if (izbor.postotak > 0) {
      // bodovani izborni je u nasim podacima uvijek tocno jedan predmet
      const naziv = izbor.predmeti[0]
      const postotak = izborni.value[naziv]
      const pisan = postotak !== '' && postotak != null

      if (izbor.obavezan && !pisan) {
        nedostaju.push(naziv)
      }
      // pao neobavezan izborni ne sprjecava upis, samo ne donosi bodove
      if (izbor.obavezan && pisan && postotak < 50) {
        sviPolozeni = false
      }
      if (typeof izbor.prag === 'number' && pisan && postotak < izbor.prag) {
        neispunjeniPragovi.push(naziv + ' (najmanje ' + izbor.prag + ' %)')
      }
      if (typeof izbor.prag === 'string') {
        napomene.push(naziv + ': prag je ' + izbor.prag + ' i ovisi o rezultatima svih kandidata')
      }

      const bodovi = pisan && postotak >= 50 ? (postotak / 100) * izbor.postotak : 0
      razrada.push({ naziv: naziv + ' (izborni)', maks: izbor.postotak, bodovi: bodovi })
    } else if (izbor.obavezan && !polozenIzborni.value) {
      // "jedan predmet s popisa": ne nosi bodove, u formi je kvacica
      nedostaju.push('jedan izborni predmet s popisa')
    }
  }

  // postoci su sluzbeni udjeli od ukupnih 1000 bodova pa se samo mnoze s 10
  let zbrojTezina = 0
  let zbrojBodova = 0
  const skalirano = []
  for (const redak of razrada) {
    zbrojTezina += redak.maks
    zbrojBodova += redak.bodovi
    skalirano.push({ naziv: redak.naziv, maks: Math.round(redak.maks * 10), bodovi: Math.round(redak.bodovi * 10) })
  }

  // dio programa ostatak bodova daje za natjecanja i slicno, to ne racunamo
  if (zbrojTezina < 99.9) {
    napomene.push('studijski program dodatno boduje posebna postignuća (npr. natjecanja) koja kalkulator ne obuhvaća — ' + Math.round(100 - zbrojTezina) + ' % ukupnih bodova')
  }

  const polozenaMatura = prosjek.value >= 2 && sviPolozeni

  rezultat.value = {
    ukupno: Math.round(zbrojBodova * 10),
    razrada: skalirano,
    nedostaju: nedostaju,
    kriveRazine: kriveRazine,
    neispunjeniPragovi: neispunjeniPragovi,
    napomene: napomene,
    polozenaMatura: polozenaMatura,
    uvjetiIspunjeni: polozenaMatura && !nedostaju.length && !kriveRazine.length && !neispunjeniPragovi.length,
  }
}

const red = 'flex items-center justify-between gap-4 py-2'
const polje = 'w-full bg-white border border-stone-300 rounded-lg p-2.5 text-sm'

</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-10">
    <RouterLink v-if="program" :to="'/studijski-programi/' + program.id" class="text-sm font-semibold text-blue-900 hover:text-blue-950">← {{ program.naziv }}</RouterLink>

    <p v-if="!program" class="text-gray-500 mt-8">Studijski program nije pronađen.</p>

    <template v-else>
      <h1 class="text-3xl font-extrabold text-blue-950 mt-6">Kalkulator bodova</h1>
      <p class="text-gray-500 mt-2">{{ program.naziv }} · {{ program.fakultetKratica }} · {{ program.grad }}</p>

      <div class="grid gap-6 lg:grid-cols-2 items-start mt-6">
        <!-- unos -->
        <form @submit.prevent="izracunajBodove" class="bg-white border border-stone-300 rounded-xl p-5">
          <h2 class="text-lg font-extrabold text-blue-950">Prosjek srednje škole</h2>
          <div :class="red">
            <label for="prosjek" class="text-sm">Prosjek svih razreda <span class="text-gray-500">2,00 – 5,00</span></label>
            <div class="w-48 shrink-0">
              <input id="prosjek" v-model="prosjek" type="number" min="2" max="5" step="0.01" required placeholder="npr. 4.35" :class="polje" />
            </div>
          </div>

          <h2 class="text-lg font-extrabold text-blue-950 border-t border-stone-100 mt-4 pt-4">Državna matura</h2>
          <div v-for="predmet in obvezni" :key="predmet.kljuc" :class="red">
            <label :for="predmet.kljuc" class="text-sm">{{ predmet.naziv }} <span class="text-gray-500">traži se {{ predmet.trazena }} razina</span></label>
            <div class="flex gap-2 w-48 shrink-0">
              <div class="w-20">
                <select v-model="razine[predmet.kljuc]" :class="polje">
                  <option>A</option>
                  <option>B</option>
                </select>
              </div>
              <div class="flex-1">
                <input :id="predmet.kljuc" v-model="matura[predmet.kljuc]" type="number" min="0" max="100" step="0.01" required placeholder="%" :class="polje" />
              </div>
            </div>
          </div>

          <template v-if="bodovaniIzborni.length">
            <h2 class="text-lg font-extrabold text-blue-950 border-t border-stone-100 mt-4 pt-4">Izborni predmeti</h2>
            <div v-for="izbor in bodovaniIzborni" :key="izbor.predmeti[0]" :class="red">
              <label :for="izbor.predmeti[0]" class="text-sm">{{ izbor.predmeti[0] }} <span class="text-gray-500">{{ izbor.obavezan ? 'obavezan' : 'po izboru' }}</span></label>
              <div class="w-48 shrink-0">
                <input :id="izbor.predmeti[0]" v-model="izborni[izbor.predmeti[0]]" type="number" min="0" max="100" step="0.01" placeholder="%" :class="polje" />
              </div>
            </div>
          </template>

          <div v-if="popis" class="border-t border-stone-100 mt-4 pt-4">
            <h2 class="text-lg font-extrabold text-blue-950">Izborni predmeti</h2>
            <p class="text-sm text-gray-500 mt-1">Za prijavu je obavezan jedan od navedenih (ne donosi bodove):</p>
            <PopisPredmeta :predmeti="popis.predmeti" class="mt-2" />
            <label class="flex items-center gap-2 text-sm mt-3">
              <input v-model="polozenIzborni" type="checkbox" />
              Položen mi je jedan od navedenih predmeta
            </label>
          </div>

          <button class="bg-blue-900 text-white font-semibold rounded-lg px-5 py-2 hover:bg-blue-950 mt-5">Izračunaj bodove</button>
        </form>

        <!-- rezultat -->
        <div v-if="rezultat" class="bg-white border border-stone-300 rounded-xl p-5">
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
        <div v-else class="bg-white border border-stone-300 rounded-xl p-5">
          <h2 class="text-lg font-extrabold text-blue-950">Rezultat</h2>
          <p class="text-sm text-gray-500 mt-2">Ispuni podatke i rezultat će se prikazati ovdje.</p>
        </div>
      </div>
    </template>
  </div>
</template>
