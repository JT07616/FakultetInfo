import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config.js'
import { prevediGresku } from '../utils/greske.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null) // korisnik - uid i email
  const profil = ref(null) // username/role

  const isLoggedIn = computed(function () {
    return user.value !== null
  })

  const isAdmin = computed(function () {
    if(profil.value) {
      return profil.value.role === 'admin'
    }
    return false
  })

  const username = computed(function () {
    if (profil.value) {
      return profil.value.username
    }
    return ''
  })
  async function loadProfil() {
    if (!user.value) {
      profil.value = null
      return
    }

    const snapshot = await getDoc(doc(db, 'users', user.value.uid))
    if (snapshot.exists()) {
      profil.value = { username: snapshot.data().username, role: snapshot.data().role }
    } else {
      profil.value = null
    }
  }

  async function registracija(email, lozinka, korisnickoIme) {
    try {

      const odgovor = await createUserWithEmailAndPassword(auth, email, lozinka)
      // firebase auth ne zan za username ni role pa svoj dio drzim u firestoreu
      await setDoc(doc(db, 'users', odgovor.user.uid), {
        username: korisnickoIme,
        role: 'user',
      })
      user.value = odgovor.user
      profil.value = { username: korisnickoIme, role: 'user' }
    } catch (greska) {
      console.log(greska)
      throw new Error(prevediGresku(greska.code))
    }
  }

  async function prijava(email, lozinka) {
    try {
      const odgovor = await signInWithEmailAndPassword(auth, email, lozinka)
      user.value = odgovor.user
      await loadProfil()
    } catch (greska) {
      console.log(greska)
      throw new Error(prevediGresku(greska.code))
    }
  }

  async function odjava() {
    await signOut(auth)
    user.value = null
    profil.value = null
  }

  // firebase pri pokretanju sam provjeri ima li spremljenu prijavu, pa čekam taj prvi odgovor
  async function init() {
    return new Promise(function (resolve) {
      onAuthStateChanged(auth, async function (noviUser) {
        user.value = noviUser

        try {
          await loadProfil()
        } catch (greska) {
          console.error(greska)
          profil.value = null
        }

        resolve()
      })
    })
  }

  

 return { user, profil, isLoggedIn, isAdmin, username, init, registracija, prijava, odjava, loadProfil }
})
