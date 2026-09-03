import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'
import Home from '../views/Home.vue'
import Fakulteti from '../views/Fakulteti.vue'
import StudijskiProgrami from '../views/StudijskiProgrami.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import MojPortal from '../views/MojPortal.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'login', component: Login, meta: { samoGost: true } },
    { path: '/register', name: 'register', component: Register, meta: { samoGost: true } },
    { path: '/fakulteti', name: 'fakulteti', component: Fakulteti },
    { path: '/studijski-programi', name: 'studijski-programi', component: StudijskiProgrami },
    { path: '/mojportal', name: 'mojportal', component: MojPortal, meta: { requiresAuth: true } },
    { path: '/admin', name: 'admin', component: AdminDashboard, meta: { requiresAdmin: true } },
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
    return '/mojportal'
  }
})


export default router
