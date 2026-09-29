import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/client/RegisterView.vue'
import LoginView from '../views/client/LoginView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/registro',
    name: 'Registro',
    component: RegisterView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router