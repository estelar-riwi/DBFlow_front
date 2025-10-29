import { createRouter, createWebHistory } from 'vue-router'
// 1. Importa tus vistas
import Home from '@/views/Home.vue' // Importa Home directamente

const routes = [
  // 2. Crea las rutas (el mapa)
  {
    path: '/', // Cuando la URL es la raíz
    name: 'Home',
    component: Home // Muestra el componente Home.vue
  },
  {
    path: '/login', // Cuando la URL es /login
    name: 'Login',
    // 🔑 Importación corregida y verificada con tu estructura:
    component: () => import('@/views/Login.vue') 
  },
  {
    path: '/register', // Cuando la URL es /register
    name: 'Register',
    // 🔑 Importación corregida y verificada con tu estructura:
    component: () => import('@/views/Register.vue') 
  },
  {
    path: '/dashboard', // Cuando la URL es /dashboard
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes, // 3. Usa las rutas que definiste
  
  // 🚨 Comportamiento de scroll para que la navegación entre Home y Login/Register sea suave
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      // Siempre vuelve arriba al cambiar de vista completa (Home -> Login)
      return { top: 0, behavior: 'smooth' };
    }
  }
})

export default router