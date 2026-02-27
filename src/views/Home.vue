<template>
  <div class="min-h-screen flex flex-col bg-[#27beff]">

    <div class="flex-1 flex items-center justify-center px-6">
      <div class="flex flex-col items-center gap-6 w-full max-w-xl">
        
        <img src="@/assets/logo.png" alt="FakultetInfo logo" class="w-72 md:w-96" />

        <div class="text-center space-y-2">
          <h1 class="text-white font-extrabold text-4xl tracking-wide">
            Dobrodošli,
          </h1>
          <p class="text-white text-xl">
            Pronađi smjer koji želiš upisati.
          </p>
        </div>

        <div class="bg-white shadow-xl rounded-2xl p-8 flex flex-col gap-4 w-full max-w-sm">
          
          <RouterLink
            to="/programs"
            class="bg-blue-600 text-white font-bold py-3 rounded-xl text-center
                   shadow-lg hover:bg-blue-700 hover:shadow-xl
                   hover:scale-105 active:scale-95
                   transition-all duration-300"
          >
            Pregledaj studijske programe
          </RouterLink>

          <RouterLink
            to="/login"
            class="border-2 border-blue-600 text-blue-600 font-bold py-3 rounded-xl text-center
                   hover:bg-blue-50 hover:scale-105 active:scale-95
                   transition-all duration-300"
          >
            Prijava
          </RouterLink>

          <RouterLink
            to="/register"
            class="bg-gray-200 text-gray-800 font-bold py-3 rounded-xl text-center
                   shadow-md hover:bg-gray-300 hover:shadow-lg
                   hover:scale-105 active:scale-95
                   transition-all duration-300"
          >
            Registracija
          </RouterLink>

        </div>
      </div>
    </div>

 
    <Footer />

  </div>
</template>