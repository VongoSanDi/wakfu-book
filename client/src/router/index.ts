import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StuffView from '../views/StuffView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/stuff',
      name: 'stuff',
      // route level code-splitting
      // this generates a separate chunk (Stuff.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: StuffView
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (Login.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/encyclopedia',
      name: 'encyclopedia',
      // route level code-splitting
      // this generates a separate chunk (Encyclopedia.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/EncyclopediaView.vue'),
    },
  ],
})

export default router
