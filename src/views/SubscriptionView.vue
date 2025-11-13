<template>
  <div class="plan-facturacion-view">
    <!-- =================================== -->
    <!--      Encabezado de la Vista         -->
    <!-- =================================== -->
    <div class="view-header">
      <div>
        <h1>Plan y Facturación</h1>
        <p class="view-subtitle">Administra tu suscripción y consulta tu historial de pagos.</p>
        <p v-if="userEmail" class="user-email">Usuario: {{ userEmail }}</p>
      </div>
    </div>

    <!-- =================================== -->
    <!--      Sección del Plan Actual        -->
    <!-- =================================== -->
    <h3>Tu Plan Actual</h3>
    <div class="current-plan-display">
      <StatCard
        class="stagger-child" style="--child-index: 0"
        :title="currentPlan.name"
        :value="currentPlan.price === 0 ? '$0 COP' : `$${currentPlan.price.toLocaleString('es-CO')} COP/mes`"
        :subtitle="currentPlan.dbsPerEngineText"
      >
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v18l7-5 7 5V3z"/>
          </svg>
        </template>
      </StatCard>

      <StatCard 
        class="stagger-child" style="--child-index: 1"
        title="Próximo Cobro" value="N/A" subtitle="Sin fecha">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="6" width="18" height="13" rx="2" stroke-width="1.5"/>
            <path d="M3 10h18" stroke-width="1.5"/>
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- =================================== -->
    <!--      Sección para Cambiar de Plan   -->
    <!-- =================================== -->
    <h3>Cambiar Plan</h3>
    <div class="plans-grid">
      <div
        v-for="(plan, index) in availablePlans"
        :key="plan.id"
        :class="['plan-card', { 'plan-card-selected': currentPlan.id === plan.id }]"
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-8.8"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            {{ plan.dbsPerEngineText }}
          </li>
          <li>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-8.8"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Soporte Básico
          </li>
        </ul>

        <button v-if="currentPlan.id === plan.id" class="btn-secondary" disabled>
          Plan Actual
        </button>
        <button v-else class="btn-primary" @click.prevent="initiateCheckout(plan)" :disabled="isProcessing">
          <span v-if="isProcessing && selectedPlanId === plan.id">Redirigiendo...</span>
          <span v-else>Seleccionar Plan</span>
        </button>
      </div>
    </div>

    <!-- =================================== -->
    <!--      Historial de Facturación       -->
    <!-- =================================== -->
    <!--<h3>Historial de Facturación</h3>-->
    <div class="db-table-container reveal-on-scroll">
      
     <!-- <table class="db-table">
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
            <td colspan="4" class="table-state-cell">PCargando historial...</td>
          </tr>
          <tr v-else-if="subscriptionHistory.length === 0">
            <td colspan="4" class="table-state-cell">No hay historial de suscripciones</td>
          </tr>
          <tr v-else v-for="sub in subscriptionHistory" :key="sub.id">
            <td>{{ formatDate(sub.startDate || sub.createdAt) }}</td>
            <td>{{ getPlanName(sub.planId) }}</td>
            <td>{{ formatAmount(sub.amount) }}</td>
            <td>
              <span class="status-dot" :class="getStatusClass(sub.status)"></span>
              <span class="badge" :class="getBadgeClass(sub.status)">
                {{ getStatusText(sub.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>-->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StatCard from '@/components/StatCard.vue';
import { showAlert } from '@/utils/notify';
import { getUserPlan, setUserPlan } from '@/services/subscriptionService';
import { getAllPlans, getPlanConfig } from '@/config/plans';
import { getCurrentUser } from '@/services/authService';
import { getSubscriptionHistory, initiateCheckoutPro } from '@/services/paymentService';

// --- ESTADO REACTIVO ---
const isProcessing = ref(false);
const selectedPlanId = ref(null);
const subscriptionHistory = ref([]);
const loadingHistory = ref(false);
const userEmail = ref('');

// --- PLANES ---
const userPlanId = ref(getUserPlan());
const currentPlanConfig = getPlanConfig(userPlanId.value);

const currentPlan = ref({
  id: currentPlanConfig.id,
  name: currentPlanConfig.displayName,
  price: currentPlanConfig.price,
  priceText: currentPlanConfig.price === 0 
    ? 'Gratuito' 
    : `$${currentPlanConfig.price.toLocaleString('es-CO')} COP/mes`,
  dbsPerEngine: currentPlanConfig.databaseLimit,
  dbsPerEngineText: `Hasta ${currentPlanConfig.databaseLimit} DBs por motor`,
});

const availablePlans = ref(
  getAllPlans().map(plan => ({
    id: plan.id,
    name: plan.displayName,
    price: plan.price,
    priceText: plan.price === 0 
      ? 'Gratuito' 
      : `${plan.price.toLocaleString('es-CO')} COP`,
    dbsPerEngine: plan.databaseLimit,
    dbsPerEngineText: `Hasta ${plan.databaseLimit} bases de datos por motor`,
    available: true,
    features: plan.features,
  }))
);

// --- MÉTODOS ---

// 🧾 Iniciar proceso de pago (Checkout Pro)
const initiateCheckout = async (plan) => {
  if (isProcessing.value) return;
  isProcessing.value = true;
  selectedPlanId.value = plan.id;

  try {
    const currentUser = getCurrentUser();

    if (!currentUser || !currentUser.UserId) {
      throw new Error('Usuario no autenticado. Por favor, inicia sesión nuevamente.');
    }

    const userId = currentUser.UserId;
    const email = currentUser.Email;
    userEmail.value = email;

    console.log('📝 Iniciando Checkout Pro →', { userId, email, planId: plan.id });

    // Llamada al backend para generar la preferencia de pago
    await initiateCheckoutPro({ planId: plan.id, userId, email });
  } catch (error) {
    console.error('❌ Error al iniciar Checkout Pro:', error);
    showAlert({
      icon: 'error',
      title: 'Error en el pago',
      text: error.message || 'No se pudo iniciar el proceso de pago.',
    });
    isProcessing.value = false;
    selectedPlanId.value = null;
  }
};

// 📜 Cargar historial de suscripciones
/*const loadSubscriptionHistory = async () => {
  loadingHistory.value = true;

  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.UserId) {
      throw new Error('No se encontró el usuario en sesión.');
    }

    console.log('📦 Cargando historial de suscripciones para:', currentUser.UserId);

    const history = await getSubscriptionHistory(currentUser.UserId);
    subscriptionHistory.value = Array.isArray(history) ? history : [];
  } catch (error) {
    console.error('❌ Error al cargar historial:', error);
  } finally {
    loadingHistory.value = false;
  }
};*/

// --- CICLO DE VIDA ---
onMounted(async () => {
  const currentUser = getCurrentUser();

  if (currentUser && currentUser.Email) {
    userEmail.value = currentUser.Email;
  }

  await loadSubscriptionHistory();
});
</script>


<style scoped>
.user-email {
  color: #a0aec0;
  font-size: 0.9rem;
  margin-top: 8px;
  font-family: 'Roboto Mono', monospace;
}
.plan-facturacion-view {
  padding: 20px;
  min-height: 100vh;
}
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 20px 0;
}
.plan-facturacion-view h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #fff 0%, #e2e8f0 100%);
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
  color: #94a3b8;
  margin-top: 6px;
  font-size: .95rem;
}
.current-plan-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp .6s ease forwards;
}
@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =================================== */
/*      Tarjetas de Planes (Plan Cards)  */
/* =================================== */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}
.plan-card {
  background: rgba(17, 17, 17, .6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, .15);
  border-radius: 16px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transition: all .4s cubic-bezier(.4, 0, .2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, .3), 0 0 0 1px rgba(255, 255, 255, .05), inset 0 1px 0 rgba(255, 255, 255, .1);
}
.plan-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .3), transparent);
}
.plan-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, .3);
  box-shadow: 0 12px 48px rgba(0, 0, 0, .4), 0 0 0 1px rgba(255, 255, 255, .1), 0 0 60px rgba(255, 255, 255, .15), inset 0 1px 0 rgba(255, 255, 255, .15);
}
.plan-card-selected {
  border-color: rgba(255, 255, 255, .4);
  background: rgba(17, 17, 17, .8);
  box-shadow: 0 12px 48px rgba(0, 0, 0, .4), 0 0 0 1px rgba(255, 255, 255, .15), 0 0 80px rgba(255, 255, 255, .2), inset 0 1px 0 rgba(255, 255, 255, .2);
}
.plan-card-selected::after {
  content: '✓ Activo';
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(34, 197, 94, .15);
  border: 1px solid rgba(34, 197, 94, .3);
  color: #22c55e;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: .75rem;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(34, 197, 94, .5);
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
  background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(255, 255, 255, .3);
}
.plan-price {
  font-size: 2.2rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -.5px;
  text-shadow: 0 0 20px rgba(255, 255, 255, .4), 0 0 40px rgba(255, 255, 255, .2);
}
.plan-price small {
  font-size: 1rem;
  color: #94a3b8;
  font-weight: 500;
}
.plan-description {
  color: #cbd5e1;
  font-size: .95rem;
  margin-bottom: 25px;
  flex-grow: 1;
  line-height: 1.6;
}
.plan-features {
  list-style: none;
  padding: 16px;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, .02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, .05);
}
.plan-features li {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #cbd5e1;
  margin-bottom: 12px;
  font-size: .9rem;
}
.plan-features li:last-child {
  margin-bottom: 0;
}
.plan-features li svg {
  width: 20px;
  height: 20px;
  color: #22c55e;
  filter: drop-shadow(0 0 8px rgba(34, 197, 94, .4));
  flex-shrink: 0;
}

/* =================================== */
/*      Botones                      */
/* =================================== */
.btn-primary {
  background: rgba(255, 255, 255, .95);
  color: #111;
  border: 1px solid rgba(255, 255, 255, .3);
  padding: 14px 28px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  font-family: 'Roboto Mono', monospace;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: .5px;
  transition: all .3s cubic-bezier(.4, 0, .2, 1);
  box-shadow: 0 4px 16px rgba(255, 255, 255, .2), 0 0 0 1px rgba(255, 255, 255, .1), inset 0 1px 0 rgba(255, 255, 255, .5);
}
.btn-primary:hover {
  transform: translateY(-2px);
  background: #fff;
  box-shadow: 0 8px 24px rgba(255, 255, 255, .3), 0 0 0 1px rgba(255, 255, 255, .2), 0 0 40px rgba(255, 255, 255, .2), inset 0 1px 0 rgba(255, 255, 255, .6);
}
.btn-primary:active {
  transform: translateY(0);
}
.btn-primary:disabled {
  background: rgba(255, 255, 255, .1);
  color: rgba(255, 255, 255, .3);
  cursor: not-allowed;
  opacity: .5;
  box-shadow: none;
}
.btn-secondary {
  background: rgba(255, 255, 255, .05);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, .15);
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Roboto Mono', monospace;
  width: 100%;
  cursor: default;
  text-transform: uppercase;
  letter-spacing: .5px;
  backdrop-filter: blur(10px);
}

/* =================================== */
/*      Tabla de Datos de Historial      */
/* =================================== */
.db-table-container {
  background: rgba(17, 17, 17, .6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, .15);
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, .3), 0 0 0 1px rgba(255, 255, 255, .05), inset 0 1px 0 rgba(255, 255, 255, .1);
}
.db-table {
  width: 100%;
  border-collapse: collapse;
}
.db-table td,
.db-table th {
  padding: 16px 18px;
  text-align: left;
}
.db-table thead th {
  background: rgba(255, 255, 255, .05);
  font-size: .9rem;
  color: #cbd5e1;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .5px;
  border-bottom: 1px solid rgba(255, 255, 255, .1);
}
.db-table tbody tr {
  border-top: 1px solid rgba(255, 255, 255, .06);
  transition: all .2s ease;
}
.db-table tbody tr:hover {
  background: rgba(255, 255, 255, .05);
}
.table-state-cell {
  text-align: center; 
  padding: 40px;
  color: #94a3b8;
}

/* =================================== */
/*      Badges e Indicadores de Estado */
/* =================================== */
.badge {
  background: rgba(255, 255, 255, .06);
  color: #ddd;
  border: 1px solid rgba(255, 255, 255, .12);
  padding: 3px 8px;
  border-radius: 999px;
  font-size: .8rem;
}
.badge-coming-soon {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 12px;
  background: rgba(255, 152, 0, .15);
  border: 1px solid rgba(255, 152, 0, .3);
  color: #ff9800;
  font-size: .7rem;
  font-weight: 600;
  font-family: 'Roboto Mono', monospace;
  white-space: nowrap;
  text-shadow: 0 0 10px rgba(255, 152, 0, .5);
}
.badge-success {
  color: #22c55e;
  border-color: rgba(34, 197, 94, .35);
  background: rgba(34, 197, 94, .08);
}
.badge-warning {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, .35);
  background: rgba(245, 158, 11, .08);
}
.badge-error {
  color: #ef4444;
  border-color: rgba(239, 68, 68, .35);
  background: rgba(239, 68, 68, .08);
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
  box-shadow: 0 0 10px rgba(34, 197, 94, .5);
}
.status-dot.status-pending {
  background: #f59e0b;
  box-shadow: 0 0 10px rgba(245, 158, 11, .5);
}
.status-dot.status-cancelled {
  background: #ef4444;
  box-shadow: 0 0 10px rgba(239, 68, 68, .5);
}

/* =================================== */
/*      Media Queries (Responsividad)  */
/* =================================== */
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
  .plan-facturacion-view h1 {
    font-size: 1.8rem;
  }
  .plan-facturacion-view p {
    font-size: .9rem;
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
  .plan-facturacion-view h1 {
    font-size: 1.5rem;
  }
  .plan-facturacion-view p {
    font-size: .85rem;
  }
  .plan-card {
    padding: 20px 16px;
  }
  .plan-card h4 {
    font-size: 1.3rem;
  }
  .plan-price {
    font-size: 2rem;
  }
  .plan-price small {
    font-size: .9rem;
  }
  .btn-primary, .btn-secondary {
    font-size: .9rem;
    padding: 10px 20px;
  }
}
</style>