import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'
import Home from '../views/Home.vue'
import Fakulteti from '../views/Fakulteti.vue'
import StudijskiProgrami from '../views/StudijskiProgrami.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ListaPrioriteta from '../views/ListaPrioriteta.vue'
import FakultetDetalji from '../views/FakultetDetalji.vue'
import ProgramDetalji from '../views/ProgramDetalji.vue'
import Kalkulator from '../views/Kalkulator.vue'
import Admin from '../views/Admin.vue'
import Profil from '../views/Profil.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'login', component: Login, meta: { samoGost: true } },
    { path: '/register', name: 'register', component: Register, meta: { samoGost: true } },
    { path: '/admin', name: 'admin', component: Admin , meta: { requiresAdmin: true}},
    { path: '/fakulteti', name: 'fakulteti', component: Fakulteti },
    { path: '/studijski-programi', name: 'studijski-programi', component: StudijskiProgrami },
    { path: '/lista-prioriteta', name: 'lista-prioriteta', component: ListaPrioriteta, meta: { requiresAuth: true } },
    { path: '/profil', name: 'profil', component: Profil, meta: { requiresAuth: true } },
    { path: '/fakulteti/:id', name: 'fakultet-detalji', component: FakultetDetalji },
    { path: '/studijski-programi/:id', name: 'program-detalji', component: ProgramDetalji },
    { path: '/kalkulator/:id', name: 'kalkulator', component: Kalkulator },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return '/login'
  }
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return '/'
  }
  if (to.meta.samoGost && authStore.isLoggedIn) {
    if (authStore.isAdmin) {
      return '/admin'
    }
    if (authStore.isFakultet) {
      return '/fakulteti/' + authStore.profil.fakultetId
    }
    return '/lista-prioriteta'
  }
})


export default router
