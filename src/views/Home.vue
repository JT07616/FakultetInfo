<template>
  <main class="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">
    <div>
      <h1 class="text-5xl font-extrabold leading-tight text-blue-950">
        Sve o upisima <br />
        na <span class="border-b-8 border-yellow-300">jednom mjestu</span>
      </h1>
      <p class="mt-6 text-lg leading-relaxed text-gray-500">Pregledaj fakultete i studijske programe, izračunaj bodove koje možeš ostvariti, složi favorite u svoju listu prioriteta te postavi pitanja i prati obavijesti fakulteta koji te zanimaju.</p>
      <div class="mt-12 grid grid-cols-2 gap-4">
        <RouterLink to="/login" class="group rounded-xl bg-blue-900 p-5 text-left transition hover:bg-blue-950">
          <span class="text-sm text-blue-200">Već imaš račun?</span>
          <div class="mt-2 flex items-center justify-between">
            <strong class="text-white">Prijavi se</strong>
            <span class="text-xl text-white transition-transform group-hover:translate-x-1">→</span>
          </div>
        </RouterLink>

        <RouterLink to="/register" class="group rounded-xl border border-stone-300 bg-white p-5 text-left transition hover:border-blue-300">
          <span class="text-sm text-gray-500">Prvi put si ovdje?</span>
          <div class="mt-2 flex items-center justify-between">
            <strong class="text-blue-900">Registriraj se</strong>
            <span class="text-xl text-blue-900 transition-transform group-hover:translate-x-1">→</span>
          </div>
        </RouterLink>
      </div>

      <RouterLink to="/register" class="group mt-4 flex items-center justify-between gap-4 rounded-xl border border-stone-300 border-l-4 border-l-yellow-300 bg-white px-5 py-4 transition hover:border-blue-300 hover:border-l-yellow-300">
        <span class="text-sm text-gray-700"><strong class="text-blue-950">Predstavnik si fakulteta?</strong> Registriraj se sa službenom e-mail adresom fakulteta.</span>
        <span class="text-xl text-blue-900 transition-transform group-hover:translate-x-1">→</span>
      </RouterLink>
    </div>

    <img src="../assets/slike/home_logo.svg" alt="FakultetInfo" class="hidden md:block w-full translate-x-10" />
  </main>
</template>
