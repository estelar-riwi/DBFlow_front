import { createRouter, createWebHistory } from 'vue-router'
// 1. Importa tus vistas
import Home from '@/views/Home.vue' 
import Dashboard from '@/views/Dashboard.vue' // Layout Principal
import DatabaseList from '@/views/DatabaseList.vue' // Vista Hija por defecto

const routes = [
  // 2. Crea las rutas (el mapa)
  {
    path: '/', 
    name: 'Home',
    component: Home 
  },
  {
    path: '/login', 
    name: 'Login',
    component: () => import('@/views/Login.vue') 
  },
  {
    path: '/register', 
    name: 'Register',
    component: () => import('@/views/Register.vue') 
  },
  {
    path: '/forgot-password', 
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPassword.vue') 
  },
  {
    path: '/reset-password', 
    name: 'ResetPassword',
    component: () => import('@/views/ResetPassword.vue'),
    // Soporta enlaces con mayúsculas provenientes de emails externos
    alias: ['/Reset-Password'] 
  },
  {
    path: '/verify-email', 
    name: 'VerifyEmail',
    component: () => import('@/views/VerifyEmail.vue'),
    // Soporta enlaces con mayúsculas provenientes de emails externos
    alias: ['/Verify-Email'] 
  },
  {
    path: '/confirm-email', 
    name: 'ConfirmEmail',
    component: () => import('@/views/ConfirmEmail.vue') 
  },
  {
    path: '/subscription', 
    name: 'Subscription',
    component: () => import('@/views/SubscriptionView.vue') 
  },
  
  // 🚨 RUTAS DEL DASHBOARD ANIDADAS (COMPLETAS)
  {
    path: '/dashboard', 
    name: 'Dashboard',
    component: Dashboard, // El layout principal
    children: [
      {
        path: '', // La ruta por defecto (/dashboard)
        name: 'DatabaseList',
        component: DatabaseList // Muestra la lista
      },
      {
        path: 'billing', // Ruta: /dashboard/billing
        name: 'Billing',
        component: () => import('@/views/Billing.vue') 
      },
      {
        path: 'webhooks', // Ruta: /dashboard/webhooks
        name: 'Webhooks',
        component: () => import('@/views/Webhooks.vue') 
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...routes,
    // Catch-all para rutas no definidas en SPA
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ], // 3. Usa las rutas que definiste
  
  // Comportamiento de scroll
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      // Siempre vuelve arriba al cambiar de vista completa
      return { top: 0, behavior: 'smooth' };
    }
  }
})

export default router