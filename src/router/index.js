import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Fakulteti from '../views/Fakulteti.vue'
import StudijskiProgrami from '../views/StudijskiProgrami.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/fakulteti', name: 'fakulteti', component: Fakulteti },
    { path: '/studijski-programi', name: 'studijski-programi', component: StudijskiProgrami },
  ],
})

export default router
