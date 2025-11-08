<template>
  <div class="plan-facturacion-view">
    <div class="view-header">
      <div>
        <h1>Plan y Facturación</h1>
        <p class="view-subtitle">Administra tu suscripción y consulta tu historial de pagos.</p>
      </div>
      <!-- Podríamos tener un botón aquí para "Gestionar Suscripción" si el usuario ya tiene una pagada,
           o simplemente confiar en las tarjetas de plan. Por ahora, lo quitamos para enfocarnos en los planes. -->
    </div>

    <h3>Tu Plan Actual</h3>
    <!-- Simulación del plan actual del usuario (esto vendría de una API real en el futuro) -->
    <div class="current-plan-display">
      <StatCard
        :title="currentPlan.name"
        :value="currentPlan.price === 0 ? '$0 COP' : `$${currentPlan.price.toLocaleString('es-CO')} COP/mes`"
        :subtitle="currentPlan.dbsPerEngineText"
      >
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v18l7-5 7 5V3z"/></svg>
        </template>
      </StatCard>
      <StatCard title="Próximo Cobro" value="N/A" subtitle="Sin fecha">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="6" width="18" height="13" rx="2" stroke-width="1.5"/><path d="M3 10h18" stroke-width="1.5"/></svg>
        </template>
      </StatCard>
    </div>

    <h3>Cambiar Plan</h3>
    <div class="plans-grid">
      <div
        v-for="plan in availablePlans"
        :key="plan.id"
        :class="['plan-card', { 
          'plan-card-selected': currentPlan.id === plan.id,
          'plan-card-disabled': !plan.available && currentPlan.id !== plan.id
        }]"
      >
        <div class="plan-header">
          <div class="plan-title-wrapper">
            <h4>{{ plan.name }}</h4>
            <span v-if="!plan.available && currentPlan.id !== plan.id" class="badge-coming-soon">Próximamente</span>
          </div>
          <span class="plan-price" v-if="plan.price === 0">{{ plan.priceText }}</span>
          <span class="plan-price" v-else>
            {{ plan.price.toLocaleString('es-CO') }} COP<small>/mes</small>
          </span>
        </div>
        <p class="plan-description">{{ plan.dbsPerEngineText }}</p>
        <ul class="plan-features">
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-8.8"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            {{ plan.dbsPerEngineText }}
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-8.8"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Soporte Básico
          </li>
        </ul>

        <button
          v-if="currentPlan.id === plan.id"
          class="btn-secondary"
          disabled
        >
          Plan Actual
        </button>
        <button
          v-else-if="!plan.available"
          class="btn-disabled"
          disabled
        >
          No Disponible
        </button>
        <button
          v-else
          class="btn-primary"
          @click="subscribeToPlan(plan.id)"
        >
          Seleccionar Plan
        </button>
      </div>
    </div>

    <h3>Historial de Facturación</h3>
    <div class="db-table-container reveal-on-scroll">
      <table class="db-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Plan</th>
            <th>Monto</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loadingHistory">
            <td colspan="4" style="text-align: center; padding: 40px;">
              <div style="color: #94a3b8;">Cargando historial...</div>
            </td>
          </tr>
          <tr v-else-if="subscriptionHistory.length === 0">
            <td colspan="4" style="text-align: center; padding: 40px;">
              <div style="color: #94a3b8;">No hay historial de suscripciones</div>
            </td>
          </tr>
          <tr v-else v-for="sub in subscriptionHistory" :key="sub.id">
            <td>{{ formatDate(sub.startDate || sub.createdAt) }}</td>
            <td>{{ getPlanName(sub.planId) }}</td>
            <td>{{ formatAmount(sub.amount) }}</td>
            <td>
              <span class="status-dot" :class="getStatusClass(sub.status)"></span> 
              <span class="badge" :class="getBadgeClass(sub.status)">{{ getStatusText(sub.status) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import StatCard from '@/components/StatCard.vue'
import { ref, onMounted } from 'vue'
import { showAlert } from '@/utils/notify'
import { createSubscription, getSubscriptionHistory } from '@/services/paymentService'
import { getUserPlan, setUserPlan } from '@/services/subscriptionService'
import { getAllPlans, getPlanConfig } from '@/config/plans'

// --- DATOS DE PLANES Y ESTADO DEL USUARIO ---

// ✅ IDs de Mercado Pago para cada plan
const MERCADO_PAGO_PLAN_IDS = {
  INTERMEDIO: '13165c6cd72d46569fbf1660c1bd9f8e', 
  AVANZADO: 'b13a7ed8966f49ecb28668db916d18c1', 
};

// Historial de suscripciones
const subscriptionHistory = ref([])
const loadingHistory = ref(false)

// Obtener el plan actual del usuario
const userPlanId = ref(getUserPlan())
const currentPlanConfig = getPlanConfig(userPlanId.value)

const currentPlan = ref({
  id: currentPlanConfig.id,
  name: currentPlanConfig.displayName,
  price: currentPlanConfig.price,
  priceText: currentPlanConfig.price === 0 ? 'Gratuito' : `$${currentPlanConfig.price.toLocaleString('es-CO')} COP/mes`,
  dbsPerEngine: currentPlanConfig.databaseLimit,
  dbsPerEngineText: `Hasta ${currentPlanConfig.databaseLimit} DBs por motor`,
});

// Mapear los planes del config a la estructura de la vista
const allPlansConfig = getAllPlans()
const availablePlans = ref(allPlansConfig.map(plan => ({
  id: plan.id,
  name: plan.displayName,
  price: plan.price,
  priceText: plan.price === 0 ? 'Gratuito' : `${plan.price.toLocaleString('es-CO')} COP`,
  dbsPerEngine: plan.databaseLimit,
  dbsPerEngineText: `Hasta ${plan.databaseLimit} bases de datos por motor`,
  mpPlanId: plan.id === 'intermediate' ? MERCADO_PAGO_PLAN_IDS.INTERMEDIO :
            plan.id === 'advanced' ? MERCADO_PAGO_PLAN_IDS.AVANZADO : null,
  available: plan.id === 'free' || plan.id === 'intermediate', // Solo gratuito e intermedio por ahora
  features: plan.features
})));

// --- LÓGICA DE SUSCRIPCIÓN ---
const subscribeToPlan = async (planId) => {
  const selectedPlan = availablePlans.value.find(p => p.id === planId);

  if (!selectedPlan) {
    await showAlert({ icon: 'error', title: 'Error', text: 'Plan no válido.' });
    return;
  }

  // Verificar si el plan está disponible
  if (!selectedPlan.available) {
    await showAlert({ 
      icon: 'info', 
      title: 'Próximamente', 
      text: `El ${selectedPlan.name} estará disponible próximamente.`,
      confirmText: 'Entendido'
    });
    return;
  }

  // Si es el plan gratuito, solo actualizar el localStorage
  if (planId === 'free') {
    setUserPlan('free')
    currentPlan.value = {
      id: 'free',
      name: 'Plan Gratuito',
      price: 0,
      priceText: 'Gratuito',
      dbsPerEngine: 2,
      dbsPerEngineText: 'Hasta 2 DBs por motor',
    }
    userPlanId.value = 'free'
    
    await showAlert({ 
      icon: 'success', 
      title: 'Plan actualizado', 
      text: 'Has cambiado al Plan Gratuito.',
      confirmText: 'Entendido'
    });
    return;
  }

  if (!selectedPlan.mpPlanId) {
    await showAlert({ icon: 'error', title: 'Error', text: 'Plan sin ID de Mercado Pago configurado.' });
    return;
  }

  // Obtener email del usuario desde localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userEmail = user.email || user.Email || prompt(`Ingresa tu correo electrónico para suscribirte al ${selectedPlan.name}:`);

  if (!userEmail) {
    await showAlert({ icon: 'info', title: 'Cancelado', text: 'Suscripción cancelada por el usuario.' });
    return;
  }

  try {
    // Pasar el planId (free, intermediate, advanced) en lugar del mpPlanId
    const result = await createSubscription(planId, userEmail);
    if (result?.init_point) {
      // Guardar el plan seleccionado temporalmente para cuando regrese del pago
      localStorage.setItem('pending_plan', planId)
      
      // Redirige al usuario al checkout de Mercado Pago
      window.location.href = result.init_point;
    } else {
      await showAlert({ icon: 'error', title: 'Error', text: 'No se pudo iniciar la suscripción. Inténtalo de nuevo.' });
    }
  } catch (error) {
    console.error('❌ Error creando suscripción:', error);
    await showAlert({ icon: 'error', title: 'Error', text: 'Hubo un problema al conectar con el servidor de pagos.' });
  }
};

// --- FUNCIONES AUXILIARES PARA HISTORIAL ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CO', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}

const formatAmount = (amount) => {
  if (amount === 0 || amount === null || amount === undefined) return '$0 COP'
  return `$${amount.toLocaleString('es-CO')} COP`
}

const getPlanName = (planId) => {
  const plan = getPlanConfig(planId)
  return plan ? plan.displayName : planId || 'Desconocido'
}

const getStatusText = (status) => {
  const statusMap = {
    'active': 'Activo',
    'cancelled': 'Cancelado',
    'expired': 'Expirado',
    'pending': 'Pendiente',
    'approved': 'Aprobado',
    'completed': 'Completado'
  }
  return statusMap[status?.toLowerCase()] || status || 'Desconocido'
}

const getStatusClass = (status) => {
  const statusLower = status?.toLowerCase()
  if (statusLower === 'active' || statusLower === 'approved' || statusLower === 'completed') {
    return 'status-active'
  }
  if (statusLower === 'pending') return 'status-pending'
  if (statusLower === 'cancelled' || statusLower === 'expired') return 'status-cancelled'
  return ''
}

const getBadgeClass = (status) => {
  const statusLower = status?.toLowerCase()
  if (statusLower === 'active' || statusLower === 'approved' || statusLower === 'completed') {
    return 'badge-success'
  }
  if (statusLower === 'pending') return 'badge-warning'
  if (statusLower === 'cancelled' || statusLower === 'expired') return 'badge-error'
  return ''
}

// Cargar historial de suscripciones
const loadSubscriptionHistory = async () => {
  loadingHistory.value = true
  try {
    const history = await getSubscriptionHistory()
    subscriptionHistory.value = Array.isArray(history) ? history : []
    console.log('📋 Historial cargado:', subscriptionHistory.value)
  } catch (error) {
    console.error('❌ Error al cargar historial:', error)
    subscriptionHistory.value = []
  } finally {
    loadingHistory.value = false
  }
}

// --- LÓGICA DE REVELACIÓN EN SCROLL ---
onMounted(async () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.1 }
  )
  const reveals = document.querySelectorAll('.reveal-on-scroll')
  reveals.forEach((el) => observer.observe(el))

  // Cargar historial de suscripciones
  await loadSubscriptionHistory()

  // Si hay un pago exitoso (volviendo de Mercado Pago), actualizar el plan
  const urlParams = new URLSearchParams(window.location.search)
  const paymentStatus = urlParams.get('status')
  const pendingPlan = localStorage.getItem('pending_plan')
  
  if (paymentStatus === 'approved' && pendingPlan) {
    setUserPlan(pendingPlan)
    localStorage.removeItem('pending_plan')
    
    const planConfig = getPlanConfig(pendingPlan)
    currentPlan.value = {
      id: planConfig.id,
      name: planConfig.displayName,
      price: planConfig.price,
      priceText: planConfig.price === 0 ? 'Gratuito' : `$${planConfig.price.toLocaleString('es-CO')} COP/mes`,
      dbsPerEngine: planConfig.databaseLimit,
      dbsPerEngineText: `Hasta ${planConfig.databaseLimit} DBs por motor`,
    }
    userPlanId.value = pendingPlan
    
    showAlert({ 
      icon: 'success', 
      title: '¡Pago exitoso!', 
      text: `Tu plan ha sido actualizado a ${planConfig.displayName}`,
      confirmText: 'Genial'
    })
    
    // Recargar historial después del pago exitoso
    await loadSubscriptionHistory()
  }
});
</script>

<style scoped>
/* ============================= GLASSMORPHISM THEME ======================= */
.plan-facturacion-view {
  padding: 20px;
  min-height: 100vh;
}

.plan-facturacion-view h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.plan-facturacion-view h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 40px 0 20px 0;
  color: #e2e8f0;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

.view-subtitle { 
  color:#94a3b8; 
  margin-top:6px; 
  font-size:.95rem; 
}

.badge { 
  background: rgba(255,255,255,0.06); 
  color:#ddd; 
  border:1px solid rgba(255,255,255,0.12); 
  padding:3px 8px; 
  border-radius:999px; 
  font-size:.8rem; 
}

.badge-success { 
  color:#22c55e; 
  border-color: rgba(34,197,94,0.35); 
  background: rgba(34,197,94,0.08); 
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 20px 0;
}

/* Estilo para el plan actual - Glassmorphism */
.current-plan-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Grid de planes disponibles - Glassmorphism mejorado */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}

.plan-card {
  background: rgba(17, 17, 17, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.plan-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.3), 
    transparent);
}

.plan-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 12px 48px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    0 0 60px rgba(255, 255, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.plan-card-selected {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(17, 17, 17, 0.8);
  box-shadow: 
    0 12px 48px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.15),
    0 0 80px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.plan-card-selected::after {
  content: '✓ Activo';
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

/* Tarjetas deshabilitadas - Glassmorphism */
.plan-card-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(0.5);
}

.plan-card-disabled:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.plan-header {
  margin-bottom: 20px;
}

.plan-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.plan-header h4 {
  font-size: 1.6rem;
  margin: 0;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.badge-coming-soon {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 12px;
  background: rgba(255, 152, 0, 0.15);
  border: 1px solid rgba(255, 152, 0, 0.3);
  color: #ff9800;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: 'Roboto Mono', monospace;
  white-space: nowrap;
  text-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
}

.plan-price {
  font-size: 2.2rem;
  font-weight: 700;
  color: white;
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.4),
    0 0 40px rgba(255, 255, 255, 0.2);
  letter-spacing: -0.5px;
}

.plan-price small {
  font-size: 1rem;
  color: #94a3b8;
  font-weight: 500;
}

.plan-description {
  color: #cbd5e1;
  font-size: 0.95rem;
  margin-bottom: 25px;
  flex-grow: 1;
  line-height: 1.6;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #cbd5e1;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.plan-features li:last-child {
  margin-bottom: 0;
}

.plan-features li svg {
  width: 20px;
  height: 20px;
  color: #22c55e;
  filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.4));
  flex-shrink: 0;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.95);
  color: #111;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 14px 28px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  font-family: 'Roboto Mono', monospace;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  box-shadow: 
    0 4px 16px rgba(255, 255, 255, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 1);
  box-shadow: 
    0 8px 24px rgba(255, 255, 255, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    0 0 40px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
  opacity: 0.5;
  box-shadow: none;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Roboto Mono', monospace;
  width: 100%;
  cursor: default;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.btn-disabled {
  background: rgba(255, 152, 0, 0.08);
  color: #ff9800;
  border: 1px solid rgba(255, 152, 0, 0.25);
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Roboto Mono', monospace;
  width: 100%;
  cursor: not-allowed;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Tabla estilo glassmorphism unificado */
.db-table-container {
  background: rgba(17, 17, 17, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  margin-bottom: 40px;
}

.db-table { 
  width: 100%; 
  border-collapse: collapse; 
}

.db-table th, .db-table td { 
  padding: 16px 18px; 
  text-align: left; 
}

.db-table thead th { 
  background: rgba(255,255,255,0.05); 
  font-size: .9rem; 
  color: #cbd5e1; 
  font-weight: 700; 
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.db-table tbody tr { 
  border-top: 1px solid rgba(255,255,255,0.06); 
  transition: all 0.2s ease;
}

.db-table tbody tr:hover { 
  background: rgba(255,255,255,0.05); 
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-dot.status-active {
  background: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
}

.status-dot.status-pending {
  background: #f59e0b;
  box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
}

.status-dot.status-cancelled {
  background: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
}

.badge-warning {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.35);
  background: rgba(245, 158, 11, 0.08);
}

.badge-error {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.08);
}

/* ========================================================================= */
/* ============================= RESPONSIVE SUBSCRIPTION =================== */
/* ========================================================================= */

@media (max-width: 1024px) {
  .plans-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .plan-card {
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .subscription-header h1 {
    font-size: 1.8rem;
  }
  
  .subscription-header p {
    font-size: 0.9rem;
  }
  
  .plan-card {
    padding: 24px 20px;
  }
  
  .db-table-container {
    overflow-x: auto;
  }
  
  .db-table {
    min-width: 500px;
  }
}

@media (max-width: 480px) {
  .subscription-header h1 {
    font-size: 1.5rem;
  }
  
  .subscription-header p {
    font-size: 0.85rem;
  }
  
  .plan-card {
    padding: 20px 16px;
  }
  
  .plan-card h3 {
    font-size: 1.3rem;
  }
  
  .plan-price {
    font-size: 2rem;
  }
  
  .plan-price span {
    font-size: 0.9rem;
  }
  
  .btn-primary,
  .btn-secondary,
  .btn-disabled {
    font-size: 0.9rem;
    padding: 10px 20px;
  }
}

@media (max-width: 360px) {
  .subscription-header h1 {
    font-size: 1.3rem;
  }
  
  .plan-card {
    padding: 18px 14px;
  }
  
  .plan-price {
    font-size: 1.8rem;
  }
}

</style>