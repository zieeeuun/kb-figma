import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Dashboard from '@/views/Dashboard.vue'
import Profile from '@/views/Profile.vue'
import Game from '@/views/Game.vue'
import { useAuthStore } from '@/stores/authStore.js'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', name: 'home', component: Home },
      { path: 'login', name: 'login', component: Login },
      { path: 'signup', name: 'signup', component: Signup },
      { path: 'dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
      { path: 'profile', name: 'profile', component: Profile, meta: { requiresAuth: true } },
      { path: 'game', name: 'game', component: Game, meta: { requiresAuth: true } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isLoggedIn) return '/login'
})

export default router
