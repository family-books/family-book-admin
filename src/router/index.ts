import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: () => import('@/views/home/HomeView.vue'), meta: { requiresAuth: false, title: '家书｜记录一家人的故事' } },
  { path: '/home', name: 'Landing', component: () => import('@/views/landing/LandingView.vue'), meta: { requiresAuth: false, title: '家书｜记录一家人的故事' } },
  {
    path: '/admin/login',
    name: 'Login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { requiresAuth: false, title: '登录｜家书管理后台' },
  },
  {
    path: '/admin',
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
        path: 'enterprises',
        name: 'Enterprises',
        component: () => import('@/views/enterprises/EnterprisesView.vue'),
        meta: { title: '企业内购' },
      },
      {
        path: 'redemption',
        name: 'Redemption',
        component: () => import('@/views/redemption/RedemptionView.vue'),
        meta: { title: '兑换码管理' },
      },
      {
        path: 'gazettes',
        name: 'Gazettes',
        component: () => import('@/views/gazettes/GazettesView.vue'),
        meta: { title: '家书管理' },
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
    next('/admin/login')
  } else if (to.path === '/admin/login' && userStore.token) {
    next('/admin')
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

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title?.includes('家书') ? title : `${title || '管理后台'}｜家书`
})

export default router
