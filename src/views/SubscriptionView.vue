<template>
  <div class="plan-facturacion-view">
    <div class="view-header">
      <div>
        <h1>Plan y Facturación</h1>
        <p class="view-subtitle">Administra tu suscripción y consulta tu historial de pagos.</p>
        <small class="user-id-display">ID de Usuario actual (Para prueba de Backend): {{ userId }}</small>
      </div>
    </div>

    <h3>Tu Plan Actual</h3>
    <div class="current-plan-display">
      <StatCard
        :title="currentPlan.name"
        :value="currentPlan.price === 0 ? '$0 COP' : `$${currentPlan.price.toLocaleString('es-CO')} COP/mes`"
        :subtitle="currentPlan.dbsPerEngineText"
      />
    </div>

    <h3>Cambiar Plan</h3>
    <div class="plans-grid">
      <div
        v-for="plan in availablePlans"
        :key="plan.id"
        :class="['plan-card', { 'plan-card-selected': currentPlan.id === plan.id }]"
      >
        <div class="plan-header">
          <h4>{{ plan.name }}</h4>
          <span class="plan-price" v-if="plan.price === 0">{{ plan.priceText }}</span>
          <span class="plan-price" v-else>
            {{ plan.price.toLocaleString('es-CO') }} COP<small>/mes</small>
          </span>
        </div>
        <p class="plan-description">{{ plan.dbsPerEngineText }}</p>
        <button
          v-if="currentPlan.id === plan.id"
          class="btn-secondary"
          disabled
        >
          Plan Actual
        </button>
        <button
          v-else
          class="btn-primary"
          @click="openPaymentModal(plan)"
        >
          Seleccionar Plan
        </button>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Completa tu pago</h2>

        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p style="color: white; margin-top: 1rem;">Procesando tu pago, por favor espera...</p>
        </div>

        <!-- NOTA: El id "card-form" es usado por el SDK de MP -->
        <form v-else id="card-form" @submit.prevent="handleCardSubmit">
          <!-- Contenedores para los iframes de Mercado Pago -->
          <div class="form-container-mp">
            <div id="form-checkout__cardholderName"></div>
            <div id="form-checkout__cardholderEmail"></div>
            <div id="form-checkout__cardNumber"></div>
            <div id="form-checkout__expirationDate"></div>
            <div id="form-checkout__securityCode"></div>
          </div>
          
          <button type="submit" class="btn-primary" style="margin-top: 1.5rem;">
            Pagar Suscripción
          </button>
        </form>

        <button 
            class="btn-secondary" 
            style="margin-top: 0.75rem;"
            @click="closeModal" 
            :disabled="isLoading"
        >
            Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import StatCard from '../components/StatCard.vue'

// --- UTILIDADES ---
// Función de alerta (puedes reemplazarla con una librería como SweetAlert2)
const showAlert = async (options) => {
  alert(`${options.title}\n\n${options.text}`);
  return Promise.resolve();
}

// --- SERVICIO DE API ---
/**
 * Llama al endpoint del backend para crear la suscripción.
 * @param {object} payload - Los datos de la suscripción.
 * @returns {Promise<object>} La respuesta del backend.
 */
const createSubscription = async (payload) => {
  // Asegúrate de que el puerto (ej. 5030) coincida con el de tu API de C#
  const API_URL = 'http://localhost:5030/api/Payments/subscription';
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Si tu API requiere autenticación (JWT), añádela aquí
      // 'Authorization': `Bearer ${localStorage.getItem('user_token')}`
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Lanza un error para que sea capturado por el bloque catch en handleCardSubmit
    throw new Error(errorData.error || `Error del servidor: ${response.status}`);
  }
  
  return response.json();
};

// --- ESTADO DEL COMPONENTE ---
const MERCADO_PAGO_PUBLIC_KEY = 'TEST-3955245772307950-103017-943380025b29ec4be4f81f22d7d136d4';
const userId = ref(26); // Debería venir de un store (Pinia) o de las props

const currentPlan = ref({
  id: 'free',
  name: 'Plan Gratuito',
  price: 0,
  priceText: 'Gratuito',
  dbsPerEngineText: 'Hasta 2 DBs por motor',
});
const availablePlans = ref([
  { id: 'intermediate', name: 'Plan Intermedio', price: 5000, mpPlanId: '1451ffc029e74c71aec11f852cc9e735', dbsPerEngineText: 'Hasta 5 DBs por motor' },
  { id: 'advanced', name: 'Plan Avanzado', price: 10000, mpPlanId: 'b13a7ed8966f49ecb28668db916d18c1', dbsPerEngineText: 'Hasta 10 DBs por motor' },
]);

const selectedPlan = ref(null);
const showModal = ref(false);
const isLoading = ref(false);

let mp = null; // Variable para guardar la instancia del SDK de Mercado Pago
let cardForm = null; // Variable para guardar la instancia del formulario de tarjeta

// --- LÓGICA DE MERCADO PAGO ---
const openPaymentModal = async (plan) => {
  if (!mp) {
    console.error("La instancia de MercadoPago SDK no está disponible.");
    await showAlert({ title: 'Error', text: 'El servicio de pago no se inicializó correctamente. Por favor, recarga la página.' });
    return;
  }

  selectedPlan.value = plan;
  showModal.value = true;
  await nextTick(); // Espera a que el DOM del modal se renderice

  // Limpia cualquier instancia anterior del formulario para evitar errores
  if (cardForm) {
    try { cardForm.unmount(); } catch (e) { /* Ignorar si falla */ }
  }

  try {
    // Usa la instancia 'mp' para crear el CardForm
    cardForm = mp.cardForm({
      amount: plan.price.toString(),
      iframe: true,
      form: {
        id: 'card-form',
        cardholderName: { id: 'form-checkout__cardholderName' },
        cardholderEmail: { id: 'form-checkout__cardholderEmail' },
        cardNumber: { id: 'form-checkout__cardNumber' },
        expirationDate: { id: 'form-checkout__expirationDate' },
        securityCode: { id: 'form-checkout__securityCode' },
      },
      callbacks: {
        onFormMounted: (error) => { if (error) console.error("Error al montar el CardForm:", error); },
        onError: (error) => { console.error("Error en el formulario de MP:", error); }
      }
    });
  } catch (e) {
    console.error("Error fatal al instanciar CardForm:", e);
    await showAlert({ title: 'Error', text: 'No se pudo cargar el formulario de pago.' });
    closeModal();
  }
};

const closeModal = () => {
  showModal.value = false;
};

const handleCardSubmit = async () => {
  if (!cardForm) return;
  isLoading.value = true;
  try {
    const cardData = await cardForm.getCardFormData();
    
    const payload = {
      planId: selectedPlan.value.mpPlanId,
      email: cardData.cardholderEmail,
      cardTokenId: cardData.token, // El token generado por el SDK
      backUrl: 'https://tu-app.com/dashboard/success', // URL a la que volvería el usuario
      userId: userId.value
    };

    const response = await createSubscription(payload);

    // Asumimos que una respuesta exitosa del backend incluye un 'id' o 'status'
    if (response?.id || response?.status === 'authorized') {
      await showAlert({
        title: '¡Suscripción enviada!',
        text: `Tu solicitud ha sido procesada. El plan se actualizará en tu cuenta una vez Mercado Pago confirme el pago (vía webhook).`,
      });
    } else {
      // Caso en que el backend responde 200 pero indica un fallo
      throw new Error('La suscripción no pudo ser completada por el backend.');
    }
  } catch (error) {
    console.error("Error al procesar la suscripción:", error);
    await showAlert({
      title: 'Error de Suscripción',
      text: error.message || 'Ocurrió un problema al enviar la solicitud. Por favor, inténtalo de nuevo.',
    });
  } finally {
    isLoading.value = false;
    closeModal();
  }
};

// --- HOOKS DEL CICLO DE VIDA ---
onMounted(() => {
  if (typeof window.MercadoPago !== 'undefined') {
    try {
      // La forma más simple y robusta de inicializar el SDK
      mp = new window.MercadoPago(MERCADO_PAGO_PUBLIC_KEY);
      console.log("Instancia de MercadoPago creada y lista para usar.");
    } catch(e) {
      console.error("Error crítico al instanciar el SDK de MercadoPago:", e);
    }
  } else {
    console.error("El SDK de MercadoPago no se encontró. Asegúrate de que el script está en index.html y no es bloqueado por extensiones.");
  }
});
</script>

<style scoped>
/* Contenedor principal y tipografía */
.plan-facturacion-view {
    padding: 2rem;
    background-color: #111827;
    min-height: 100vh;
    color: white;
    font-family: 'Inter', sans-serif;
}
.view-header {
    margin-bottom: 2rem;
}
.view-subtitle {
    color: #9ca3af;
}
.user-id-display {
    color: #9ca3af;
    display: block;
    margin-top: 0.5rem;
    font-size: 0.8rem;
}
h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
h3 { font-size: 1.5rem; font-weight: 600; margin-top: 2rem; margin-bottom: 1rem;}

.current-plan-display {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    max-width: 24rem;
}

/* Grid de planes */
.plans-grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1.5rem;
    margin-top: 1rem;
}
@media (min-width: 768px) {
    .plans-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
@media (min-width: 1024px) {
    .plans-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

/* Tarjetas de Plan */
.plan-card {
    padding: 1.5rem;
    border: 1px solid #374151;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease-in-out;
    background-color: #1f2937;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.plan-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
}
.plan-card-selected {
    border-color: #3b82f6;
    border-width: 2px;
    background-color: #374151;
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); 
}
.plan-header {
    margin-bottom: 1rem;
}
.plan-header h4 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #60a5fa;
}
.plan-price {
    font-size: 2.25rem;
    font-weight: 800;
    margin-top: 0.25rem;
    display: block;
}
.plan-price small {
    font-size: 1.25rem;
    font-weight: 400;
    color: #9ca3af;
}
.plan-description {
    color: #d1d5db;
    margin-bottom: 1.5rem;
    flex-grow: 1;
}

/* Estilos de Botones */
.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background 0.3s;
}
.btn-primary:hover {
    background: #2563eb; 
}
.btn-secondary {
  background: #4b5563;
  color: #e5e7eb; 
  border: none;
  padding: 10px;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  transition: background 0.3s;
}
.btn-secondary:hover:not([disabled]) {
    background: #6b7280; 
}
.btn-secondary[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Estilos del Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.85); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #1c1c1c; 
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 450px;
  color: #fff;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0,0,0,0.7);
}

.form-container-mp {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 1.5rem;
}

/* Estilos para los contenedores de los Iframes de Mercado Pago */
#form-checkout__cardholderName,
#form-checkout__cardholderEmail,
#form-checkout__cardNumber,
#form-checkout__expirationDate,
#form-checkout__securityCode {
    border: 1px solid #4a5568;
    border-radius: 8px;
    background-color: #2d3748;
    min-height: 44px; 
    box-sizing: border-box;
    overflow: hidden; 
}

/* Estilos para el Spinner (Estado de carga) */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px 0;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #3b82f6; 
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>