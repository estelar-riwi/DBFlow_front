<template>
  <!-- 
    💥 CAMBIO 1: Añadimos la etiqueta ref="paymentContainerRef" aquí.
    Esta es la clave para que el script sepa cuándo este elemento está listo.
  -->
  <div class="payment-view" ref="paymentContainerRef">
    <div class="payment-container">
      <h1 class="payment-title">Completa tu Pago</h1>
      <p class="payment-subtitle">Estás a un paso de activar tu plan: <strong>{{ planName }}</strong></p>

      <div class="card-form-container">
        <!-- El mockup no cambia -->
        <div class="card-mockup" :class="{ 'is-flipped': isFlipped }">
          <div class="card-face card-front">
            <div class="card-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              <span>DBFlow</span>
            </div>
            <div class="card-number">{{ formattedCardNumber }}</div>
            <div class="card-details">
              <div class="card-holder"><span class="label">Card Holder</span><span>{{ cardHolder || 'NOMBRE COMPLETO' }}</span></div>
              <div class="card-expiry"><span class="label">Expires</span><span>{{ cardExpiry }}</span></div>
            </div>
          </div>
          <div class="card-face card-back">
            <div class="card-stripe"></div>
            <div class="card-cvv-box"><span class="label">CVV</span><div class="cvv-value">{{ '•'.repeat(cardCvv.length) || '•••' }}</div></div>
            <div class="card-logo-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg></div>
          </div>
        </div>

        <!-- El formulario no cambia -->
        <form @submit.prevent="processPayment" class="payment-form">
          <div class="form-group"><label>Número de Tarjeta</label><div id="cardNumber-container" class="mp-field-container"></div></div>
          <div class="form-group"><label for="cardHolder">Nombre del Titular</label><input type="text" id="cardHolder" v-model="cardHolder" placeholder="Nombre Completo" required /></div>
          <div class="form-group"><label for="email">Email de Pago</label><input type="email" id="email" v-model="userEmail" placeholder="Tu correo" required /></div>
          <div class="form-row">
            <div class="form-group"><label>Expiración</label><div id="expirationDate-container" class="mp-field-container"></div></div>
            <div class="form-group"><label>CVV</label><div id="securityCode-container" class="mp-field-container"></div></div>
          </div>
          <button type="submit" class="btn-submit-payment" :disabled="isProcessing">
            <span v-if="isProcessing">Procesando...</span>
            <span v-else>Pagar {{ planPrice }} COP</span>
          </button>
        </form>
      </div>
      <router-link to="/subscription" class="back-link">&larr; Volver a Planes</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// --- SIMULACIONES Y CONFIGURACIÓN ---
const showAlert = ({ title, text, icon }) => { console.log(`[ALERTA - ${icon.toUpperCase()}] ${title}: ${text}`); if (icon === 'error') console.error(text); else alert(`${title}: ${text}`); };
const getPlanConfig = (id) => ({ 'intermediate': { displayName: 'Plan Intermedio', price: 5000 }, 'advanced': { displayName: 'Plan Avanzado', price: 10000 } }[id]);
const getUserEmail = () => 'marianartpo08@gmail.com';
const getUserId = () => 'user-test-12345';
const createSubscription = async (data) => { console.log("Simulando llamada a Backend con datos:", data); await new Promise(resolve => setTimeout(resolve, 1500)); return { success: true, message: "Subscription pending confirmation" }; };
const MERCADO_PAGO_PLAN_IDS = { INTERMEDIO: '13165c6cd72d46569fbf1660c1bd9f8e', AVANZADO: 'b13a7ed8966f49ecb28668db916d18c1' };
const VITE_MP_PUBLIC_KEY = 'TEST-c2e3323c-f22a-4eb3-a9a2-6f2310f4a331';

// --- ESTADO DEL COMPONENTE ---
const route = useRoute();
const router = useRouter();
const planId = route.params.planId;
const planConfig = getPlanConfig(planId);
const planName = computed(() => planConfig?.displayName || 'Desconocido');
const planPrice = computed(() => planConfig?.price.toLocaleString('es-CO') || '0');
const cardNumber = ref('');
const cardHolder = ref('');
const cardExpirationMonth = ref('');
const cardExpirationYear = ref('');
const cardCvv = ref('');
const formattedCardNumber = computed(() => { const v = cardNumber.value.replace(/\D/g, ''); return v ? (v.match(/.{1,4}/g) || []).join(' ') : '#### #### #### ####'; });
const cardExpiry = computed(() => `${cardExpirationMonth.value.padEnd(2, 'M')}/${cardExpirationYear.value.padEnd(2, 'Y')}`);
const userEmail = ref(getUserEmail() || '');
const mpPlanId = computed(() => planId === 'intermediate' ? MERCADO_PAGO_PLAN_IDS.INTERMEDIO : planId === 'advanced' ? MERCADO_PAGO_PLAN_IDS.AVANZADO : null);
const isFlipped = ref(false);
const isProcessing = ref(false);

// --- VARIABLES DE MERCADO PAGO ---
let mp = null;
let cardNumberField, securityCodeField, expirationDateField;
let isMpInitialized = false; // Bandera para evitar doble inicialización

// 💥 CAMBIO 2: Creamos el ref que enlazaremos a la plantilla.
const paymentContainerRef = ref(null);

// ========================================================================
// 🔵 LÓGICA DE MERCADO PAGO CON TEMPLATE REFS
// ========================================================================

const mountCardFields = () => {
  // ... (Esta función no necesita cambios)
  if (!mp) return console.error("❌ No se puede montar: SDK de MP no inicializado.");
  
  // Pequeño delay para asegurar que los contenedores existen en el DOM
  setTimeout(() => {
    console.log("2. 🟢 Intentando montar los campos...");
    const fieldStyles = { 'font-size': '1rem', 'color': '#e2e8f0', 'background-color': 'transparent' };
    try {
      cardNumberField = mp.fields.create('cardNumber', { placeholder: '#### #### #### ####', style: fieldStyles });
      securityCodeField = mp.fields.create('securityCode', { placeholder: '•••', style: fieldStyles });
      expirationDateField = mp.fields.create('expirationDate', { placeholder: 'MM/YY', mode: 'short', style: fieldStyles });
      cardNumberField.mount('#cardNumber-container');
      securityCodeField.mount('#securityCode-container');
      expirationDateField.mount('#expirationDate-container');
      console.log("3. ✅ Campos de Mercado Pago montados exitosamente.");
      cardNumberField.on('change', data => { cardNumber.value = data.field.value || ''; });
      securityCodeField.on('change', data => { cardCvv.value = data.field.value || ''; });
      expirationDateField.on('change', data => { const [m, y] = (data.field.value || '').split('/'); cardExpirationMonth.value = (m || '').trim(); cardExpirationYear.value = (y || '').trim(); });
      securityCodeField.on('focus', () => isFlipped.value = true);
      securityCodeField.on('blur', () => isFlipped.value = false);
      cardNumberField.on('focus', () => isFlipped.value = false);
      expirationDateField.on('focus', () => isFlipped.value = false);
    } catch (e) {
      console.error("❌ Error CRÍTICO durante el montaje de los campos:", e);
      showAlert({ icon: 'error', title: 'Error de Montaje', text: 'No se pudieron crear los campos de pago.' });
    }
  }, 100);
};

const initializeMercadoPago = () => {
  // ... (Esta función no necesita cambios)
  console.log("1. 🟢 Iniciando el proceso de Mercado Pago...");
  const loadSDK = () => new Promise((resolve, reject) => {
    if (window.MercadoPago) return resolve();
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar el SDK."));
    document.head.appendChild(script);
  });
  loadSDK().then(() => {
    console.log("... SDK de MP cargado.");
    mp = new window.MercadoPago(VITE_MP_PUBLIC_KEY, { locale: 'es-CO' });
    mountCardFields();
  }).catch(error => {
    console.error("❌ Fallo en la inicialización:", error);
    showAlert({ icon: 'error', title: 'Error Crítico', text: error.message });
  });
};

// 💥 CAMBIO 3: Usamos `watch` en lugar de `onMounted`.
// Este código se ejecutará AUTOMÁTICAMENTE cuando `paymentContainerRef`
// deje de ser `null` y apunte a un elemento del DOM.
watch(paymentContainerRef, async (newValue) => {
  if (newValue && !isMpInitialized) {
    // Si el contenedor existe Y no hemos inicializado MP antes...
    // Esperamos al siguiente tick para asegurar que los elementos hijos
    // (los contenedores con id para MP) ya estén montados en el DOM.
    await nextTick();
    console.log("✅ Contenedor de pago está renderizado. Iniciando MP.");
    isMpInitialized = true; // Marcamos como inicializado
    initializeMercadoPago();
  }
});


onBeforeUnmount(() => {
  if (cardNumberField) cardNumberField.unmount();
  if (securityCodeField) securityCodeField.unmount();
  if (expirationDateField) expirationDateField.unmount();
  console.log("🧹 Campos de MP desmontados.");
});

// --- LÓGICA DE PAGO (Sin cambios) ---
const processPayment = async () => {
  if (!mp || !mp.fields || isProcessing.value || !mpPlanId.value) { showAlert({ icon: 'warning', title: 'Advertencia', text: 'El formulario de pago no está listo.' }); return; }
  isProcessing.value = true;
  try {
    const cardToken = await mp.fields.createCardToken({ cardholderName: cardHolder.value });
    if (cardToken.error) { const errorMessage = cardToken.error.cause?.[0]?.description || cardToken.error.message || "Revisa los datos de tu tarjeta."; throw new Error(errorMessage); }
    console.log("Token generado:", cardToken.id);
    const userId = getUserId();
    if (!userId) throw new Error("ID de usuario no disponible.");
    const subscriptionRequest = { PlanId: mpPlanId.value, Email: userEmail.value, CardTokenId: cardToken.id, BackUrl: `${window.location.origin}/dashboard/subscription?status=approved&plan=${planId}`, UserId: userId };
    await createSubscription(subscriptionRequest);
    localStorage.setItem('pending_plan', planId);
    showAlert({ icon: 'success', title: '¡Suscripción iniciada!', text: 'Tu pago está siendo procesado.' });
    router.push('/dashboard/subscription');
  } catch (error) {
    console.error('❌ Error al procesar el pago:', error);
    showAlert({ icon: 'error', title: 'Error de Pago', text: error.message });
  } finally {
    isProcessing.value = false;
  }
};
</script>


<style scoped>
/* ESTILOS (Sin cambios) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Roboto+Mono:wght@400;700&display=swap');
.payment-view{display:flex;justify-content:center;align-items:center;min-height:100vh;padding:40px 20px;background:#0f172a;font-family:'Inter',sans-serif}.payment-container{width:100%;max-width:500px;text-align:center}.payment-title{font-size:2.5rem;font-weight:700;color:#e2e8f0;margin-bottom:12px}.payment-subtitle{font-size:1.1rem;color:#94a3b8;margin-bottom:40px}.payment-subtitle strong{color:#f0f9ff;font-weight:600}.card-form-container{perspective:1000px;margin-bottom:30px}.card-mockup{width:100%;max-width:380px;height:240px;margin:0 auto 40px;position:relative;transform-style:preserve-3d;transition:transform .6s cubic-bezier(.4,0,.2,1)}.card-mockup.is-flipped{transform:rotateY(180deg)}.card-face{position:absolute;width:100%;height:100%;-webkit-backface-visibility:hidden;backface-visibility:hidden;border-radius:16px;background:linear-gradient(135deg,#1e293b,#334155);box-shadow:0 10px 30px rgba(0,0,0,.3);color:#f0f9ff;padding:25px;display:flex;flex-direction:column;justify-content:space-between}.card-back{transform:rotateY(180deg)}.card-logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:1.2rem}.card-logo svg{width:28px}.card-number{font-family:'Roboto Mono',monospace;font-size:1.5rem;letter-spacing:2px;text-align:center}.card-details{display:flex;justify-content:space-between;font-family:'Roboto Mono',monospace;text-transform:uppercase}.label{font-size:.7rem;color:#94a3b8;display:block;margin-bottom:4px}.card-stripe{background:#111;height:50px;margin:30px -25px}.card-cvv-box{text-align:right;margin-right:10px}.cvv-value{background:#fff;color:#333;height:30px;line-height:30px;width:60px;text-align:center;border-radius:4px;margin-left:auto;font-family:'Roboto Mono',monospace}.card-logo-back{margin-top:auto;opacity:.3}.card-logo-back svg{width:40px;margin:0 auto}.payment-form{background:rgba(17,24,39,.8);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:30px;text-align:left}.form-group{margin-bottom:20px}.form-row{display:flex;gap:20px}.form-row .form-group{flex:1}label{display:block;margin-bottom:8px;color:#94a3b8;font-size:.9rem}input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.15);border-radius:8px;padding:12px 16px;height:48px;color:#e2e8f0;font-size:1rem;transition:all .2s ease}input:focus{outline:none;border-color:#38bdf8;box-shadow:0 0 0 3px rgba(56,189,248,.3)}.mp-field-container{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.15);border-radius:8px;height:48px;padding:12px 16px;position:relative;z-index:10;display:flex;align-items:center;transition:all .2s ease}.mp-field-container:focus-within{border-color:#38bdf8;box-shadow:0 0 0 3px rgba(56,189,248,.3)}.btn-submit-payment{width:100%;background:#38bdf8;color:#0f172a;border:none;padding:16px;border-radius:8px;font-size:1.1rem;font-weight:700;cursor:pointer;transition:all .3s ease;margin-top:10px}.btn-submit-payment:hover:not(:disabled){background:#7dd3fc;transform:translateY(-2px);box-shadow:0 4px 15px rgba(56,189,248,.2)}.btn-submit-payment:disabled{background:#334155;color:#64748b;cursor:not-allowed}.back-link{display:inline-block;margin-top:30px;color:#94a3b8;text-decoration:none;transition:color .2s ease}.back-link:hover{color:#e2e8f0}
</style>