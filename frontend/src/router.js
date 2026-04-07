import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('./views/Dashboard.vue'),
  },
  {
    path: '/login',
    redirect: { name: 'dashboard' },
  },
  {
    path: '/admin-login',
    redirect: { name: 'dashboard' },
  },
  {
    path: '/admin',
    redirect: { name: 'dashboard' },
  },
  {
    path: '/owner-admin-login',
    redirect: { name: 'dashboard' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'dashboard' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
