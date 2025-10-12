import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/pages/HomeView.vue'),
    },
    {
      path: '/classes',
      name: 'classes',
      component: () => import('../views/pages/ClassesView.vue'),
    },
    {
      path: '/machines',
      name: 'machines',
      component: () => import('../views/pages/MachinesView.vue'),
    },
    {
      path: '/coaches',
      name: 'coaches',
      component: () => import('../views/pages/CoachesView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
    },
    {
      path: '/404',
      name: 'not-found',
      component: () => import('../views/404/NotFoundView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/pages/ContactView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/pages/AboutView.vue'),
    },
    // Catch all routes that don't exist and redirect to 404
    {
      path: '/:pathMatch(.*)*',
      name: 'catch-all',
      redirect: '/404',
    },
  ],
})

export default router
