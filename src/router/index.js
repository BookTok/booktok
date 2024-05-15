import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '@/stores/store'
import RegisterView from '@/views/RegisterView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import BookDetails from '@/components/BookDetails.vue'
import ProfileView from '@/views/ProfileView.vue'
import BookList from '@/components/BookList.vue'
import UpdateRead from '@/views/UpdateRead.vue'
import BooksView from '@/views/BooksView.vue'
import FollowView from '@/views/FollowView.vue'
import FriendView from '@/views/FriendView.vue'
import PersonView from '@/views/PersonView.vue'

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
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/book-list/:status',
      name: 'book-list',
      component: BookList,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/update-read/book/:id',
      name: 'update-read',
      props: true,
      component: UpdateRead,
      meta: { requiresAuth: true }
    },
    {
      path: '/books-type/:tipo',
      name: 'books-type',
      props: true,
      component: BooksView,
      meta: { requiresAuth: true }
    },
    {
      path: '/follow',
      name: 'follow',
      component: FollowView,
      meta: { requiresAuth: true }
    },
    {
      path: '/friends',
      name: 'friends',
      component: FriendView,
      meta: { requiresAuth: true }
    },
    {
      path: '/user/:id',
      name: 'user',
      props: true,
      component: PersonView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const store = useStore()
  const isAuthenticated = store.user && Object.values(store.user).length !== 0

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
