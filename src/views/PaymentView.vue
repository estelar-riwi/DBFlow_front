<template>
  <div class="payment-view">
    <div class="payment-container">
      <h1 class="payment-title">Completa tu Pago</h1>
      <p class="payment-subtitle">Estás a un paso de activar tu plan: <strong>{{ planName }}</strong></p>

      <div class="card-form-container">
        <div class="card-mockup" :class="{ 'is-flipped': isFlipped }">
          <div class="card-face card-front">
            <div class="card-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>DBFlow</span>
            </div>
            <div class="card-number">
              {{ cardNumber || '#### #### #### ####' }}
            </div>
            <div class="card-details">
              <div class="card-holder">
                <span class="label">Card Holder</span>
                <span>{{ cardHolder || 'NOMBRE COMPLETO' }}</span>
              </div>
              <div class="card-expiry">
                <span class="label">Expires</span>
                <span>{{ cardExpiry || 'MM/YY' }}</span>
              </div>
            </div>
          </div>
          <div class="card-face card-back">
            <div class="card-stripe"></div>
            <div class="card-cvv-box">
              <span class="label">CVV</span>
              <div class="cvv-value">{{ cardCvv }}</div>
            </div>
            <div class="card-logo-back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Formulario de Pago (Campos de MP) -->
        <form @submit.prevent="processPayment" class="payment-form">
          <div class="form-group">
            <label for="cardNumber-container">Número de Tarjeta</label>
            <!-- 🚨 CONTENEDOR DE MP -->
            <div id="cardNumber-container" class="mp-field-container"></div>
          </div>
          <div class="form-group">
            <label for="cardHolder-container">Nombre del Titular</label>
            <!-- 🚨 CONTENEDOR DE MP -->
            <div id="cardHolder-container" class="mp-field-container"></div>
          </div>
          <div class="form-group">
            <label for="email">Email de Pago</label>
            <!-- Este sigue siendo tu input normal para el email del pagador -->
            <input type="email" id="email" v-model="userEmail" @focus="isFlipped = false" 
                   placeholder="Tu correo" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="expirationDate-container">Expiración</label>
              <!-- 🚨 CONTENEDOR DE MP -->
              <div id="expirationDate-container" class="mp-field-container"></div>
            </div>
            <div class="form-group">
              <label for="securityCode-container">CVV</label>
              <!-- 🚨 CONTENEDOR DE MP -->
              <div id="securityCode-container" class="mp-field-container"></div>
            </div>
          </div>
          <button type="submit" class="btn-submit-payment" :disabled="isProcessing">
            <span v-if="isProcessing">Procesando...</span>
            <span v-else>Pagar {{ planPrice }} COP</span>
          </button>
        </form>
      </div>
      <router-link to="/subscription" class="back-link">
        &larr; Volver a Planes
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPlanConfig } from '@/config/plans';
import { showAlert } from '@/utils/notify';
import { getUserId, getUserEmail } from '@/services/subscriptionService'; 
import { createSubscription } from '@/services/paymentService'; 

// ... (Tu configuración y variables reactivas como PlanId, PlanPrice, etc. van aquí)

// 🚨 CONFIGURACIÓN: Reemplaza con tus IDs reales de Mercado Pago
const MERCADO_PAGO_PLAN_IDS = {
  INTERMEDIO: '9037b9deb5ef45e485d0fc4029e4c759', // ID real que creaste en MP
  AVANZADO: 'TU_MP_PLAN_ID_AVANZADO',   // ID real que creaste en MP
};

// 🚨 CONFIGURACIÓN: Reemplaza con tu clave pública
const VITE_MP_PUBLIC_KEY = 'TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'; 

const route = useRoute();
const router = useRouter();

const planId = route.params.planId;
const planConfig = getPlanConfig(planId);

const planName = computed(() => planConfig?.displayName || 'Desconocido');
const planPrice = computed(() => planConfig?.price.toLocaleString('es-CO') || '0');

// Estado del formulario (SOLO para el mockup visual, no para el tokenizador de MP)
const cardNumber = ref('');
const cardHolder = ref('');
const cardExpirationMonth = ref(''); 
const cardExpirationYear = ref('');
const cardCvv = ref('');

const cardExpiry = computed(() => {
    const month = cardExpirationMonth.value.padEnd(2, 'M');
    const year = cardExpirationYear.value.padEnd(2, 'Y');
    return `${month}/${year}`;
});

// Datos del usuario
const userEmail = ref(getUserEmail() || ''); 
const mpPlanId = computed(() => 
  planId === 'intermediate' ? MERCADO_PAGO_PLAN_IDS.INTERMEDIO :
  planId === 'advanced' ? MERCADO_PAGO_PLAN_IDS.AVANZADO : null
);

const isFlipped = ref(false);
const isProcessing = ref(false);
let mp = null; // Instancia de Mercado Pago SDK
let cardField = null; // Campos inyectados de MP

// --- LÓGICA DE INICIALIZACIÓN Y MONTAJE DE CAMPOS (Fields Method) ---

const initMercadoPago = () => {
    if (window.MercadoPago && !mp) {
      try {
        mp = new window.MercadoPago(VITE_MP_PUBLIC_KEY, {
          locale: 'es-CO'
        });
        console.log("MercadoPago SDK inicializado.");
        mountCardFields();
      } catch (error) {
        console.error("Error al inicializar MercadoPago:", error);
        showAlert({ icon: 'error', title: 'Error MP', text: 'No se pudo cargar el SDK de pagos. Revisa la clave pública.' });
      }
    }
};

const mountCardFields = () => {
    // 1. Crear la instancia de fields
    cardField = mp.fields.create({
        cardholderName: { 
            placeholder: 'Nombre Completo', 
            style: { 
                'font-size': '1rem', 
                'color': '#e2e8f0', 
                'padding': '12px 16px',
                'background': 'rgba(255,255,255,0.05)',
                'border-radius': '8px',
                'border': '1px solid rgba(255,255,255,0.15)',
            }
        },
        cardNumber: {
            placeholder: '#### #### #### ####',
            style: { 
                'font-size': '1rem', 
                'color': '#e2e8f0', 
                'padding': '12px 16px',
                'background': 'rgba(255,255,255,0.05)',
                'border-radius': '8px',
                'border': '1px solid rgba(255,255,255,0.15)',
            }
        },
        securityCode: { 
            placeholder: '123',
            style: { 
                'font-size': '1rem', 
                'color': '#e2e8f0', 
                'padding': '12px 16px',
                'background': 'rgba(255,255,255,0.05)',
                'border-radius': '8px',
                'border': '1px solid rgba(255,255,255,0.15)',
            }
        },
        expirationDate: { 
            placeholder: 'MM / YY',
            mode: 'short',
            style: { 
                'font-size': '1rem', 
                'color': '#e2e8f0', 
                'padding': '12px 16px',
                'background': 'rgba(255,255,255,0.05)',
                'border-radius': '8px',
                'border': '1px solid rgba(255,255,255,0.15)',
            }
        },
    });

    // 2. Montar los campos en los DIVs correspondientes
    try {
        cardField.mount('cardholderName', '#cardHolder-container');
        cardField.mount('cardNumber', '#cardNumber-container');
        cardField.mount('securityCode', '#securityCode-container');
        cardField.mount('expirationDate', '#expirationDate-container');

        // Escucha eventos para actualizar el mockup
        cardField.on('focus', ({ field, fieldElement }) => {
            if (field === 'securityCode') {
                isFlipped.value = true;
            } else {
                isFlipped.value = false;
            }
        });
        
        cardField.on('change', ({ field, fieldElement }) => {
             if (field === 'cardNumber') {
                // Actualiza el mockup visual (removiendo espacios solo para el mockup)
                cardNumber.value = fieldElement.value.replace(/ /g, '');
             }
             if (field === 'cardholderName') {
                cardHolder.value = fieldElement.value;
             }
             if (field === 'securityCode') {
                cardCvv.value = fieldElement.value;
             }
             if (field === 'expirationDate') {
                const parts = fieldElement.value.split(' / ');
                cardExpirationMonth.value = parts[0] || '';
                cardExpirationYear.value = parts[1] || '';
             }
        });

    } catch (e) {
        console.error("Error al montar los campos de Mercado Pago:", e);
    }
};

onMounted(() => {
  if (window.MercadoPago) {
    initMercadoPago();
  } else {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = initMercadoPago;
    document.head.appendChild(script);
  }
});

onBeforeUnmount(() => {
    // Limpia los campos al salir del componente
    if (cardField) {
        cardField.unmount();
    }
});

// --- LÓGICA DE PAGO (TOKENIZACIÓN AHORA ES AUTOMÁTICA) ---
const processPayment = async () => {
  if (!mp || isProcessing.value) return;
  
  isProcessing.value = true;
  
  let cardTokenId = null;
  try {
    // 1. Validar campos con el SDK
    const cardToken = await cardField.createCardToken();

    if (cardToken.error) {
        throw new Error(cardToken.error.message || "Error al tokenizar la tarjeta. Datos inválidos o faltantes.");
    }

    cardTokenId = cardToken.id;

    // 2. Preparar la solicitud al Backend
    const userId = getUserId(); 

    if (!userId) {
      throw new Error("ID de usuario no disponible. Por favor, vuelve a iniciar sesión.");
    }
    
    const subscriptionRequest = {
      PlanId: mpPlanId.value, 
      Email: userEmail.value,
      CardTokenId: cardTokenId, 
      BackUrl: `${window.location.origin}/subscription?status=approved&plan=${planId}`, 
      UserId: userId, 
    };
    
    // 3. Llamar al Endpoint del Backend
    const result = await createSubscription(subscriptionRequest); 
    
    localStorage.setItem('pending_plan', planId); 
    
    showAlert({
      icon: 'success',
      title: 'Suscripción en proceso!',
      text: 'Tu pago está siendo procesado. Serás redirigido para la confirmación.',
      confirmButtonText: 'Aceptar'
    });

    router.push('/dashboard/subscription'); // Redirigir a la vista de suscripción

  } catch (error) {
    console.error('❌ Error al procesar el pago o generar el token:', error);
    showAlert({
      icon: 'error',
      title: 'Error de Pago',
      text: error.message,
      confirmButtonText: 'Aceptar'
    });
  } finally {
    isProcessing.value = false;
  }
};
// Las funciones de formato ya no son necesarias porque MP maneja el formato del input
</script>

<style scoped>
/* ============================= ESTILOS ORIGINALES ======================= */
/* NOTA: Se ajustó el estilo para los inputs de expiración en el form-row */
/* ------------------------------------------------------------------------ */

.payment-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px;
  background: #0f172a;
}

.payment-container {
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.payment-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 12px;
}

.payment-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  margin-bottom: 40px;
}

.payment-subtitle strong {
  color: #f0f9ff;
  font-weight: 600;
}

.card-form-container {
  perspective: 1000px;
  margin-bottom: 30px;
}

.card-mockup {
  width: 100%;
  max-width: 380px;
  height: 240px;
  margin: 0 auto 40px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-mockup.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  background: linear-gradient(135deg, #1e293b, #334155);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  color: #f0f9ff;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-back {
  transform: rotateY(180deg);
}

.card-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1.2rem;
}
.card-logo svg { width: 28px; }

.card-number {
  font-family: 'Roboto Mono', monospace;
  font-size: 1.5rem;
  letter-spacing: 2px;
  text-align: center;
}

.card-details {
  display: flex;
  justify-content: space-between;
  font-family: 'Roboto Mono', monospace;
  text-transform: uppercase;
}
.label {
  font-size: 0.7rem;
  color: #94a3b8;
  display: block;
  margin-bottom: 4px;
}

.card-stripe {
  background: #111;
  height: 50px;
  margin: 30px -25px;
}

.card-cvv-box {
  text-align: right;
  margin-right: 10px;
}
.cvv-value {
  background: #fff;
  color: #333;
  height: 30px;
  line-height: 30px;
  width: 60px;
  text-align: center;
  border-radius: 4px;
  margin-left: auto;
  font-family: 'Roboto Mono', monospace;
}
.card-logo-back {
  margin-top: auto;
  opacity: 0.3;
}
.card-logo-back svg { width: 40px; margin: 0 auto; }

.payment-form {
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  text-align: left;
}

.form-group { margin-bottom: 20px; }
.form-row { display: flex; gap: 20px; }
.form-row .form-group { flex: 1; }
/* Ajuste para los dos campos de expiración dentro del mismo form-group */
.flex-expiry-input {
  display: flex;
  justify-content: space-between;
  gap: 8px; /* Pequeña separación entre MM y YY */
}


label {
  display: block;
  margin-bottom: 8px;
  color: #94a3b8;
  font-size: 0.9rem;
}

input {
  width: 100%;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 12px 16px;
  color: #e2e8f0;
  font-size: 1rem;
  transition: all 0.2s ease;
}
input:focus {
  outline: none;
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.3);
}

.btn-submit-payment {
  width: 100%;
  background: #38bdf8;
  color: #0f172a;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-submit-payment:hover:not(:disabled) {
  background: #7dd3fc;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(56, 189, 248, 0.2);
}
.btn-submit-payment:disabled {
  background: #334155;
  color: #64748b;
  cursor: not-allowed;
}

.back-link {
  display: inline-block;
  margin-top: 30px;
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease;
}
.back-link:hover {
  color: #e2e8f0;
}
</style>