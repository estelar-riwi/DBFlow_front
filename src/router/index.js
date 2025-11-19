import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/services/authService';
import { syncUserPlan } from '@/services/subscriptionService';
import { setDataReady } from '@/store/appState';
import { showLoading, hideLoading } from '@/store/loading';
// 1. Importa tus vistas
import Home from '@/views/Home.vue' 
import Dashboard from '@/views/Dashboard.vue' // Layout Principal
import DatabaseList from '@/views/DatabaseList.vue' // Vista Hija por defecto

const routes = [
  // 2. Crea las rutas (el mapa)
  {
    path: '/', 
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        // Redirigir directamente a la vista de la lista de bases de datos
        next({ name: 'DatabaseList' });
      } else {
        next();
      }
    }
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
    path: '/reset-password/:token?', 
    name: 'ResetPassword',
    component: () => import('@/views/ResetPassword.vue'),
    // Soporta enlaces con mayúsculas provenientes de emails externos
    alias: ['/Reset-Password', '/Reset-Password/:token?'] 
  },
  {
    path: '/verify-email/:token?', 
    name: 'VerifyEmail',
    component: () => import('@/views/VerifyEmail.vue'),
    // Soporta enlaces con mayúsculas provenientes de emails externos
    alias: ['/Verify-Email', '/Verify-Email/:token?'] 
  },
  {
    path: '/confirm-email', 
    name: 'ConfirmEmail',
    component: () => import('@/views/ConfirmEmail.vue') 
  },
  
  // PÁGINAS INFORMATIVAS
  {
    path: '/documentation',
    name: 'Documentation',
    component: () => import('@/views/Documentation.vue')
  },
  {
    path: '/terms-of-service',
    name: 'TermsOfService',
    component: () => import('@/views/TermsOfService.vue')
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: () => import('@/views/PrivacyPolicy.vue')
  },
  
  // RUTAS DEL DASHBOARD
  {
    path: '/dashboard', 
    name: 'Dashboard',
    component: Dashboard, // El layout principal
    meta: { requiresAuth: true },
    children: [
      {
        path: '', // La ruta por defecto (/dashboard)
        name: 'DatabaseList',
        component: DatabaseList // Muestra la lista
      },
      {
      path: 'subscription',
      name: 'Subscription',
      component: () => import('@/views/SubscriptionView.vue') 
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
  
  // Comportamiento de scroll: SIEMPRE arriba (en toda navegación)
  scrollBehavior() {
    return { left: 0, top: 0, behavior: 'auto' };
  }
})

// Guardia global: protege rutas con meta.requiresAuth
router.beforeEach(async (to, from, next) => {
  showLoading('Cargando...');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth) {
    if (isAuthenticated()) {
      setDataReady(false); // Indicar que los datos aún no están listos
      try {
        // Espera a que el plan del usuario se sincronice antes de continuar
        await syncUserPlan();
        setDataReady(true); // Indicar que los datos ya están listos
        next();
      } catch (error) {
        console.error('Error sincronizando el plan, redirigiendo a login:', error);
        setDataReady(false);
        next({ name: 'Login', query: { redirect: to.fullPath } });
      }
    } else {
      // Redirigir al login y preservar la ruta destino para volver luego
      next({ name: 'Login', query: { redirect: to.fullPath } });
    }
  } else {
    next();
  }
});

router.afterEach(() => {
  hideLoading();
});

export default router