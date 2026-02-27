<template>
  <div class="min-h-screen w-full px-6 bg-[#27beff] flex flex-col">

    
    <div class="pt-10 flex justify-center">
      <RouterLink to="/">
        <img src="@/assets/logo.png" class="w-64" alt="FakultetInfo logo" />
      </RouterLink>
    </div>

 
    <div class="flex-1 flex justify-center items-start mt-8 pb-10">
      <div class="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h1 class="text-3xl font-bold text-center mb-2">Registracija</h1>
        <p class="text-center text-gray-600 mb-6">
          Kreiraj korisnički račun
        </p>

        <form class="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Ime"
            class="border p-3 rounded-lg"
          />
          <input
            type="text"
            placeholder="Prezime"
            class="border p-3 rounded-lg"
          />
          <input
            type="email"
            placeholder="Email"
            class="border p-3 rounded-lg"
          />
          <input
            type="password"
            placeholder="Lozinka"
            class="border p-3 rounded-lg"
          />

          
          <button
            type="submit"
            class="bg-blue-600 text-white font-bold py-3 rounded-xl text-center
                   shadow-lg hover:bg-blue-700 hover:shadow-xl
                   hover:scale-105 active:scale-95
                   transition-all duration-300"
          >
            Registriraj se
          </button>
        </form>

      
        <p class="mt-6 text-center text-sm text-gray-600">
          Imaš račun?
          <RouterLink to="/login" class="text-blue-700 font-semibold hover:underline">
            Prijavi se
          </RouterLink>
        </p>

      </div>
    </div>

  </div>
</template>

