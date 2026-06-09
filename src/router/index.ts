import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: '数据看板' },
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/users/UsersView.vue'),
        meta: { title: '用户管理' },
      },
      {
        path: 'families',
        name: 'Families',
        component: () => import('@/views/families/FamiliesView.vue'),
        meta: { title: '家庭管理' },
      },
      {
        path: 'gazettes',
        name: 'Gazettes',
        component: () => import('@/views/gazettes/GazettesView.vue'),
        meta: { title: '报纸管理' },
      },
      {
        path: 'payments',
        name: 'Payments',
        component: () => import('@/views/payments/PaymentsView.vue'),
        meta: { title: '支付管理' },
      },
      {
        path: 'referrals',
        name: 'Referrals',
        component: () => import('@/views/referrals/ReferralsView.vue'),
        meta: { title: '推荐管理' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth !== false && !userStore.token) {
    next('/login')
  } else if (to.path === '/login' && userStore.token) {
    next('/')
  } else if (to.meta.requiresAuth !== false && userStore.token) {
    // Fetch user info if not loaded yet
    if (!userStore.userInfo) {
      await userStore.fetchUserInfo()
    }
    // Check admin role
    if (!userStore.isAdmin) {
      userStore.logout()
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
