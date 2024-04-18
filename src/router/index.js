import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '@/views/RegisterView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import BookDetails from '@/components/BookDetails.vue'

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
    {
      path: '/show-details/book/:id',
      name: 'show-details',
      props: true,
      component: BookDetails,
    },
  ]
})

export default router
