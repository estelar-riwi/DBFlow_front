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
            <th>Descripción</th>
            <th>Monto</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>6 Oct, 2025</td>
            <td>Suscripción Plan Gratuito</td>
            <td>$0 COP</td>
            <td><span class="status-dot"></span> <span class="badge badge-success">Completado</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import StatCard from '@/components/StatCard.vue'
import { ref, onMounted } from 'vue'
import { showAlert } from '@/utils/notify' // Asume que tienes un archivo de utilidades para alertas
import { createSubscription } from '@/services/paymentService' // Importamos el servicio de pago

// --- DATOS DE PLANES Y ESTADO DEL USUARIO ---
// En un escenario real, 'currentPlan' y 'availablePlans' vendrían de una API
// que consulta el estado del usuario y los planes disponibles en tu sistema.

// ✅ ESTE ES EL CÓDIGO CORREGIDO
const MERCADO_PAGO_PLAN_IDS = {
  // Pega aquí el ID real de tu Plan Intermedio
  INTERMEDIO: '13165c6cd72d46569fbf1660c1bd9f8e', 
  
  // Pega aquí el ID real de tu Plan Avanzado
  AVANZADO: 'b13a7ed8966f49ecb28668db916d18c1', 
};

const currentPlan = ref({
  id: 'free', // 'free', 'intermediate', 'advanced'
  name: 'Plan Gratuito',
  price: 0,
  priceText: 'Gratuito',
  dbsPerEngine: 2,
  dbsPerEngineText: 'Hasta 2 DBs por motor',
});

const availablePlans = ref([
  {
    id: 'free',
    name: 'Plan Gratuito',
    price: 0,
    priceText: 'Gratuito',
    dbsPerEngine: 2,
    dbsPerEngineText: 'Hasta 2 bases de datos por motor',
    mpPlanId: null, // No hay ID de MP para el plan gratuito
    available: true
  },
  {
    id: 'intermediate',
    name: 'Plan Intermedio',
    price: 5000,
    dbsPerEngine: 5,
    dbsPerEngineText: 'Hasta 5 bases de datos por motor',
    mpPlanId: MERCADO_PAGO_PLAN_IDS.INTERMEDIO, // ID de MP para este plan
    available: false
  },
  {
    id: 'advanced',
    name: 'Plan Avanzado',
    price: 10000,
    dbsPerEngine: 10,
    dbsPerEngineText: 'Hasta 10 bases de datos por motor',
    mpPlanId: MERCADO_PAGO_PLAN_IDS.AVANZADO, // ID de MP para este plan
    available: false // 👈 DESHABILITADO
  },
]);

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
      text: `El ${selectedPlan.name} estará disponible próximamente. Por ahora solo el Plan Intermedio está habilitado.`,
      confirmText: 'Entendido'
    });
    return;
  }

  if (!selectedPlan.mpPlanId) {
    await showAlert({ icon: 'error', title: 'Error', text: 'Plan sin ID de Mercado Pago configurado.' });
    return;
  }

  // En un entorno real, el email debería venir del estado de autenticación del usuario.
  // Por ahora, para pruebas, pedimos al usuario.
  const userEmail = prompt(`Ingresa tu correo electrónico para suscribirte al ${selectedPlan.name}:`);

  if (!userEmail) {
    await showAlert({ icon: 'info', title: 'Cancelado', text: 'Suscripción cancelada por el usuario.' });
    return;
  }

  try {
    const result = await createSubscription(selectedPlan.mpPlanId, userEmail);
    if (result?.init_point) {
      // Redirige al usuario al checkout de Mercado Pago
      window.location.href = result.init_point;
    } else {
      await showAlert({ icon: 'error', title: 'Error', text: 'No se pudo iniciar la suscripción. Inténtalo de nuevo.' });
    }
  } catch (error) {
    console.error('Error creando suscripción:', error);
    await showAlert({ icon: 'error', title: 'Error', text: 'Hubo un problema al conectar con el servidor de pagos.' });
  }
};

// --- LÓGICA DE REVELACIÓN EN SCROLL (ya la tenías) ---
onMounted(() => {
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

  // Simula la carga del plan actual (en un caso real, esto sería una llamada API)
  // currentPlan.value = { /* Cargar desde API */ };
});
</script>

<style scoped>
/* Estilos generales */
.view-subtitle { color:#94a3b8; margin-top:6px; font-size:.95rem; }
.badge { background: rgba(255,255,255,0.06); color:#ddd; border:1px solid rgba(255,255,255,0.12); padding:3px 8px; border-radius:999px; font-size:.8rem; }
.badge-success { color:#22c55e; border-color: rgba(34,197,94,0.35); background: rgba(34,197,94,0.08); }
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

/* Estilo para el plan actual */
.current-plan-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

/* Grid de planes disponibles */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

.plan-card {
  background: #111;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2), 
              0 0 40px rgba(255, 255, 255, 0.1);
}
.plan-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.4), 
              0 0 60px rgba(255, 255, 255, 0.2);
}
.plan-card-selected {
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 35px rgba(255, 255, 255, 0.5), 
              0 0 70px rgba(255, 255, 255, 0.3);
}

/* Tarjetas deshabilitadas */
.plan-card-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.plan-card-disabled:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.plan-header {
  margin-bottom: 15px;
}
.plan-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}
.plan-header h4 {
  font-size: 1.5rem;
  margin: 0;
  color: #e2e8f0;
}
.badge-coming-soon {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: 'Roboto Mono', monospace;
  white-space: nowrap;
}
.plan-price {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5),
               0 0 30px rgba(255, 255, 255, 0.3);
}
.plan-price small {
  font-size: 1rem;
  color: #94a3b8;
}
.plan-description {
  color: #cbd5e1;
  font-size: 0.95rem;
  margin-bottom: 20px;
  flex-grow: 1; /* Para que las tarjetas tengan la misma altura */
}

.plan-features {
  list-style: none;
  padding: 0;
  margin-bottom: 25px;
}
.plan-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #cbd5e1;
  margin-bottom: 10px;
}
.plan-features li svg {
  width: 20px;
  height: 20px;
  color: #22c55e; /* Color para los checks */
}

.btn-primary {
  background: white;
  color: black;
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Roboto Mono', monospace;
  transition: all 0.3s ease;
  width: 100%;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.4), 
              0 0 40px rgba(255, 255, 255, 0.3);
}
.btn-primary:hover {
  transform: scale(1.03);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.7), 
              0 0 60px rgba(255, 255, 255, 0.5),
              0 0 90px rgba(255, 255, 255, 0.3);
}
.btn-primary:disabled {
  background-color: #444;
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: none;
}
.btn-secondary {
  background-color: #333;
  color: #bbb;
  border: 1px solid #555;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  cursor: default;
}

.btn-disabled {
  background-color: rgba(255, 152, 0, 0.15);
  color: #ff9800;
  border: 1px solid rgba(255, 152, 0, 0.3);
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  cursor: not-allowed;
  opacity: 0.7;
}

/* Tabla estilo unificado (ya lo tenías) */
.db-table-container {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: none;
}
.db-table { width: 100%; border-collapse: collapse; }
.db-table th, .db-table td { padding: 12px 14px; text-align: left; }
.db-table thead th { background: rgba(255,255,255,0.03); font-size: .85rem; color: #cbd5e1; font-weight: 600; }
.db-table tbody tr { border-top: 1px solid rgba(255,255,255,0.06); }
.db-table tbody tr:hover { background: rgba(255,255,255,0.03); }
</style>