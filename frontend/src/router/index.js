import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '../views/client/RegisterView.vue'
import LoginView from '../views/client/LoginView.vue'

// Vistas con el nombre exacto de tu proyecto
import HomeClient from '../views/client/homeClient.vue'
import AdminPanel from '../views/admin/adminPanel.vue'

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
  },
  {
    path: '/tienda',
    name: 'HomeClient',
    component: HomeClient,
    meta: { requiresAuth: true, roles: [1] } // Solo Cliente (idRol: 1)
  },
  {
    path: '/admin/dashboard',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true, roles: [2] } // Solo Admin (idRol: 2)
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guardia de navegación para proteger rutas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const usuarioRaw = localStorage.getItem('usuario')
  const usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null

  // 1. Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!token || !usuario) {
      return next({ name: 'Login' })
    }

    // Validar si el rol tiene permiso para entrar
    if (to.meta.roles && !to.meta.roles.includes(usuario.idRol)) {
      // Si intenta ingresar a un área no permitida, lo regresa a su panel correspondiente
      return usuario.idRol === 2 
        ? next({ name: 'AdminPanel' }) 
        : next({ name: 'HomeClient' })
    }
  }

  // 2. Si ya inició sesión e intenta ir a Login o Registro
  if ((to.name === 'Login' || to.name === 'Registro') && token && usuario) {
    return usuario.idRol === 2 
      ? next({ name: 'AdminPanel' }) 
      : next({ name: 'HomeClient' })
  }

  next()
})

export default router