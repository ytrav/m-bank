import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from 'vue-router'
import Home from '@/views/AppHome.vue'
import Login from '@/views/AppLogin.vue'
import Register from '@/views/AppRegister.vue'
import Dashboard from '@/views/AppDashboard.vue'

// children routes
import Transfer from '@/views/nested/DashboardTransfer.vue'
import TransactionView from '@/views/nested/DashboardTransactionView.vue'
import IssueCard from '@/views/nested/DashboardIssueCard.vue'
import Welcome from '@/views/nested/DashboardWelcome.vue'

import { useUserStore } from '@/stores/userStore'

declare module 'vue-router' {
  interface RouteMeta {
    isBack: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) => {
      const userStore = useUserStore()
      if (userStore.loggedIn) {
        next({ name: 'dashboard' })
      } else {
        next()
      }
    },
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) => {
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
    component: Dashboard,
    children: [
      {
        path: '/dashboard/transfer',
        name: 'transfer',
        component: Transfer,
      },
      {
        path: '/dashboard/transaction/:id',
        name: 'transaction',
        component: TransactionView,
      },
      {
        path: '/dashboard/issue-card',
        name: 'issue-card',
        component: IssueCard,
      },
      {
        path: '/dashboard/welcome',
        name: 'welcome',
        component: Welcome,
      },
    ],
    // beforeEnter: (
    //   to: RouteLocationNormalized,
    //   from: RouteLocationNormalized,
    //   next: NavigationGuardNext,
    // ) => {
    //   const userStore = useUserStore()
    //   if (userStore.loggedIn || sessionStorage.getItem('token')) {
    //     next()
    //   } else {
    //     next({ name: 'login' })
    //   }
    // },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (to.path !== '/' && to.path.endsWith('/')) {
      next({ path: to.path.replace(/\/+$/, ''), query: to.query, replace: true })
    } else {
      next()
    }
  },
)

// const historyStack: string[] = []

// router.beforeEach(
//   (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
//     const fromIndex = historyStack.indexOf(from.fullPath)
//     const toIndex = historyStack.indexOf(to.fullPath)

//     if (toIndex !== -1) {
//       to.meta.isBack = true
//       historyStack.splice(toIndex + 1)
//     } else {
//       to.meta.isBack = false
//       historyStack.push(to.fullPath)
//     }

//     next()
//   },
// )

export default router
