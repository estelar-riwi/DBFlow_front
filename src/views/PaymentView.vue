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
              <!-- El formato se actualizará automáticamente por el evento 'change' -->
              {{ formattedCardNumber || '#### #### #### ####' }}
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
              <!-- El CVV no se muestra en el mockup, sino el número de caracteres -->
              <div class="cvv-value" :data-value="cardCvv">{{ '•'.repeat(cardCvv.length) || '•••' }}</div>
            </div>
            <div class="card-logo-back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
        </div>

        <!-- INICIO DE FORMULARIO -->
        <!-- INICIO DE FORMULARIO -->
<form @submit.prevent="processPayment" class="payment-form">
  <div class="form-group">
    <label for="cardNumber">Número de Tarjeta</label>
    <div id="cardNumber-container" class="mp-field-container">
      <input 
        type="text" 
        id="cardNumber"
        v-model="cardNumber"
        placeholder="#### #### #### ####"
        maxlength="19"
      />
    </div>
  </div>

  <div class="form-group">
    <label for="cardHolder">Nombre del Titular</label>
    <div id="cardHolder-container" class="mp-field-container">
      <input 
        type="text" 
        id="cardHolder"
        v-model="cardHolder"
        placeholder="Nombre Completo"
      />
    </div>
  </div>

  <div class="form-group">
    <label for="email">Email de Pago</label>
    <input 
      type="email" 
      id="email" 
      v-model="userEmail" 
      placeholder="Tu correo" 
      required 
    />
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="expiration">Expiración</label>
      <div id="expirationDate-container" class="mp-field-container">
        <input 
          type="text"
          id="expiration"
          v-model="cardExpiry"
          placeholder="MM/YY"
          maxlength="5"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="cvv">CVV</label>
      <div id="securityCode-container" class="mp-field-container">
        <input 
          type="password"
          id="cvv"
          v-model="cardCvv"
          placeholder="•••"
          maxlength="4"
          @focus="isFlipped = true" 
          @blur="isFlipped = false"
        />
      </div>
    </div>
  </div>

  <button type="submit" class="btn-submit-payment" :disabled="isProcessing">
    <span v-if="isProcessing">Procesando...</span>
    <span v-else>Pagar {{ planPrice }} COP</span>
  </button>
</form>
<!-- FIN DE FORMULARIO -->

        <!-- FIN DE FORMULARIO -->
      </div>
      <router-link to="/subscription" class="back-link">
        &larr; Volver a Planes
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// --------------------------------------------------------------------------------
// SIMULACIONES DE SERVICIOS
// --------------------------------------------------------------------------------

// Simulación de una utilidad de notificación
const showAlert = ({ title, text, icon }) => {
    console.log(`[ALERTA - ${icon.toUpperCase()}] ${title}: ${text}`);
    if (icon === 'error') {
      console.error(text);
    } else {
      alert(`${title}: ${text}`);
    }
};

// SIMULACIÓN de carga de configuración del plan
const getPlanConfig = (id) => {
    const plans = {
        'intermediate': { displayName: 'Plan Intermedio', price: 5000 },
        'advanced': { displayName: 'Plan Avanzado', price: 10000 },
    };
    return plans[id];
};

// SIMULACIÓN de funciones de usuario
const getUserEmail = () => 'marianartpo08@gmail.com'; 
const getUserId = () => 'user-test-12345'; 
const createSubscription = async (data) => {
    console.log("Simulando llamada a Backend con datos:", data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, message: "Subscription pending confirmation" };
};


// -----------------------------------------------------------------
// 🚨 CONFIGURACIÓN NECESARIA PARA PRUEBAS (REEMPLAZA ESTOS VALORES)
// -----------------------------------------------------------------

const MERCADO_PAGO_PLAN_IDS = {
  INTERMEDIO: '13165c6cd72d46569fbf1660c1bd9f8e', 
  AVANZADO: 'b13a7ed8966f49ecb28668db916d18c1',   
};

const VITE_MP_PUBLIC_KEY = 'TEST-c2e3323c-f22a-4eb3-a9a2-6f2310f4a331'; 

// -----------------------------------------------------------------

const route = useRoute();
const router = useRouter();

const planId = route.params.planId;
const planConfig = getPlanConfig(planId);

const planName = computed(() => planConfig?.displayName || 'Desconocido');
const planPrice = computed(() => planConfig?.price.toLocaleString('es-CO') || '0');

// Estado del formulario para el mockup visual
const cardNumber = ref('');
const cardHolder = ref('');
const cardExpirationMonth = ref(''); 
const cardExpirationYear = ref('');
const cardCvv = ref('');

// Función para formatear el número de tarjeta con espacios
const formattedCardNumber = computed(() => {
    if (!cardNumber.value) return '#### #### #### ####';
    return cardNumber.value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
});

const cardExpiry = computed(() => {
    const month = cardExpirationMonth.value.padEnd(2, 'M');
    const year = cardExpirationYear.value.padEnd(2, 'Y');
    return `${month}/${year}`;
});


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
        console.log("✅ MercadoPago SDK inicializado.");
        
        // 🔑 Doble protección para asegurar que los DIVs existan antes de montar
        nextTick(() => {
            setTimeout(mountCardFields, 0); // Permite un ciclo de evento completo
        });
        
      } catch (error) {
        console.error("Error al inicializar MercadoPago:", error);
        showAlert({ icon: 'error', title: 'Error MP', text: 'No se pudo cargar el SDK de pagos. Revisa la clave pública.' });
      }
    }
};

const mountCardFields = () => {
    // 1. Crear la instancia de fields
    cardField = mp.fields.create({
        cardholderName: { placeholder: 'Nombre Completo' },
        cardNumber: { placeholder: '#### #### #### ####' },
        securityCode: { placeholder: '123' },
        expirationDate: { placeholder: 'MM / YY', mode: 'short' },
    }, {
        style: {
             'font-size': '1rem', 
             'color': '#e2e8f0', 
             'background-color': 'transparent', 
        }
    });

    // 2. Montar los campos en los DIVs correspondientes
    try {
        cardField.mount('cardholderName', '#cardHolder-container');
        cardField.mount('cardNumber', '#cardNumber-container');
        cardField.mount('securityCode', '#securityCode-container');
        cardField.mount('expirationDate', '#expirationDate-container');
        console.log("✅ Campos de Mercado Pago montados exitosamente.");

        // 3. 🔑 USAR cardField.addEvent para mayor compatibilidad
        cardField.addEvent('focus', ({ field }) => {
            if (field === 'securityCode') {
                isFlipped.value = true;
            } else {
                isFlipped.value = false;
            }
        });
        
        cardField.addEvent('change', ({ field, fieldElement }) => {
             if (field === 'cardNumber') {
               // Limpiamos espacios para el mockup, si es necesario
               cardNumber.value = fieldElement.value.replace(/\s/g, ''); 
             }
             if (field === 'cardholderName') {
               cardHolder.value = fieldElement.value.toUpperCase(); 
             }
             if (field === 'securityCode') {
               cardCvv.value = fieldElement.value;
             }
             if (field === 'expirationDate') {
               const parts = fieldElement.value.split(' / ');
               cardExpirationMonth.value = parts[0] || '';
               cardExpirationYear.value = parts[1] ? parts[1].slice(-2) : ''; 
             }
        });

    } catch (e) {
        console.error("❌ Error CRÍTICO al montar los campos de Mercado Pago:", e);
    }
};

onMounted(() => {
  // Verificamos si la ruta tiene un planId válido antes de cargar MP
  if (!planId || !planConfig) {
      showAlert({ icon: 'error', title: 'Error', text: 'Plan de suscripción no válido.' });
      return router.push('/subscription'); // Redirigir si no hay plan
  }

  if (window.MercadoPago) {
    initMercadoPago();
  } else {
    // Carga el SDK si no está disponible
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = initMercadoPago;
    document.head.appendChild(script);
  }
});

onBeforeUnmount(() => {
    // Limpia los campos al salir del componente
    if (cardField) {
        // En el caso de fields, usamos unmount() en la instancia de fields
        cardField.unmount();
    }
});

// --- LÓGICA DE PAGO (TOKENIZACIÓN) ---
const processPayment = async () => {
  // 🔑 Aseguramos que 'mp.fields' exista antes de llamar a 'createCardToken'
  if (!mp || !mp.fields || isProcessing.value || !mpPlanId.value) {
     showAlert({ icon: 'warning', title: 'Advertencia', text: 'El SDK no está listo o el PlanId es inválido.' });
     return;
  }
  
  isProcessing.value = true;
  
  let cardTokenId = null;
  try {
    // 1. Validar campos y crear el CardToken con el SDK
    // ✅ LLAMADA CORRECTA: mp.fields.createCardToken()
    const cardToken = await mp.fields.createCardToken();

    if (cardToken.error) {
        let errorMessage = "Error desconocido al tokenizar. Intenta nuevamente.";
        if (cardToken.error.cause && cardToken.error.cause.length > 0) {
            errorMessage = cardToken.error.cause[0].description || cardToken.error.cause[0].code;
        } else if (cardToken.error.message) {
            errorMessage = cardToken.error.message;
        }

        throw new Error(`Validación de Tarjeta fallida: ${errorMessage}`);
    }

    cardTokenId = cardToken.id;
    console.log("Token de Tarjeta generado:", cardTokenId);

    // 2. Preparar la solicitud al Backend
    const userId = getUserId(); 

    if (!userId) {
      throw new Error("ID de usuario no disponible. Por favor, vuelve a iniciar sesión.");
    }
    
    const subscriptionRequest = {
      PlanId: mpPlanId.value, 
      Email: userEmail.value,
      CardTokenId: cardTokenId, 
      BackUrl: `${window.location.origin}/dashboard/subscription?status=approved&plan=${planId}`, 
      UserId: userId, 
    };
    
    // 3. Llamar al Endpoint del Backend (createSubscription)
    const result = await createSubscription(subscriptionRequest); 
    
    localStorage.setItem('pending_plan', planId); 
    
    showAlert({
      icon: 'success',
      title: 'Suscripción iniciada!',
      text: 'Tu pago está siendo procesado. Serás redirigido para verificar el estado.',
      confirmButtonText: 'Aceptar'
    });

    router.push('/dashboard/subscription'); 

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
</script>

<style scoped>
/* ============================= ESTILOS CSS ======================= */
/* Usando fuentes Google Fonts para mayor compatibilidad de maqueta */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Roboto+Mono:wght@400;700&display=swap');

.payment-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px;
  background: #0f172a;
  font-family: 'Inter', sans-serif; 
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
  /* 🚨 Para que solo se muestre en el mockup */
  /* -webkit-text-security: disc; 
  text-security: disc; */
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

/* ------------------------------------------------------------------ */
/* 🚨 ESTILOS CRÍTICOS PARA LA VISIBILIDAD Y FOCO */
/* ------------------------------------------------------------------ */

.mp-field-container {
    width: 100%;
    /* Estilos de apariencia del contenedor */
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px;
    
    /* 💥 Visibilidad: Fuerza la altura y padding para que el iframe sea visible */
    height: 48px; 
    padding: 12px 16px; 
    
    /* 💥 FOCO/CLICK: Aseguramos que nada lo tape */
    position: relative; 
    z-index: 10; 

    display: flex; 
    align-items: center;
    transition: all 0.2s ease;
}

.mp-field-container:focus-within {
    border-color: #38bdf8;
    box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.3);
}

/* Forzamos que el iframe inyectado use el espacio */
.mp-field-container iframe {
    width: 100% !important; 
    height: 100% !important;
    border: none !important;
    background-color: transparent !important; 
    z-index: 10; 
}


/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */


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