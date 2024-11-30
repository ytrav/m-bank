import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import AppHome from '@/views/AppHome.vue'
import AppLogin from '@/views/AppLogin.vue'
import AppDashboard from '@/views/AppDashboard.vue'

import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AppHome,
    },
    {
      path: '/login',
      name: 'login',
      component: AppLogin,
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.loggedIn) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: AppDashboard,
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore()
        if (userStore.loggedIn) {
          next()
        } else {
          next({ name: 'login' })
        }
      },
    },
  ],
})

export default router
