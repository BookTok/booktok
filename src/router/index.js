import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '@/views/RegisterView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/user-add',
      name: '/user-add',
      component: RegisterView
    },
    {
      path: '/',
      name: '/home',
      component: HomeView
    },
    {
      path: '/log-in',
      name: '/log-in',
      component: LoginView
    },
  ]
})

export default router
