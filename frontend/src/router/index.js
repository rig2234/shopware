import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/client/RegisterView.vue'
import LoginView from '../views/client/LoginView.vue'
import HomeClient from '../views/client/homeClient.vue'
import AdminPanel from '../views/admin/adminPanel.vue'

const routes = [
  {
    path: '/',
    redirect: '/tienda'
  },
  {
    path: '/registro',
    name: 'Registro',
    component: RegisterView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { redirectIfAuth: true }
  },
  {
    path: '/tienda',
    name: 'HomeClient',
    component: HomeClient
  },
  {
    path: '/admin/dashboard',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true, roles: [2] }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/tienda'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const usuarioRaw = localStorage.getItem('usuario')
  const usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null

  if (to.meta.requiresAuth) {
    if (!token || !usuario) {
      sessionStorage.setItem('redirectAfterLogin', to.fullPath)
      return next({ name: 'Login' })
    }

    if (to.meta.roles && !to.meta.roles.includes(usuario.idRol)) {
      return usuario.idRol === 2
        ? next({ name: 'AdminPanel' })
        : next({ name: 'HomeClient' })
    }
  }

  if ((to.name === 'Login' || to.name === 'Registro') && token && usuario) {
    return usuario.idRol === 2
      ? next({ name: 'AdminPanel' })
      : next({ name: 'HomeClient' })
  }

  next()
})

export default router

