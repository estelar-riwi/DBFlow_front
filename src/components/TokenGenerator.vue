<!-- src/components/TokenGenerator.vue -->
<template>
  <div class="generator-container">
    <h1>Herramienta para Generar Token de Tarjeta</h1>
    <p>
      Esta es una herramienta de desarrollo aislada. Rellena los campos con una
      <a href="https://www.mercadopago.com.co/developers/es/docs/checkout-api/additional-content/test-cards" target="_blank">
        tarjeta de prueba
      </a>
      para generar un token válido.
    </p>

    <!-- Contenedores donde Mercado Pago montará su Iframe -->
    <div class="form-fields">
      <div id="form-checkout__cardNumber" class="mp-field"></div>
      <div id="form-checkout__expirationDate" class="mp-field"></div>
      <div id="form-checkout__securityCode" class="mp-field"></div>
    </div>

    <!-- El botón que activará la creación del token -->
    <button id="form-checkout__submit" class="submit-button">
      Generar Token
    </button>

    <!-- Área para mostrar el resultado -->
    <div v-if="generatedToken" class="token-result">
      <h3>✅ Token Generado con Éxito:</h3>
      <pre>{{ generatedToken }}</pre>
      <small>Este token es de un solo uso y expira pronto. Úsalo de inmediato en Postman/Swagger.</small>
    </div>

    <div v-if="error" class="error-result">
      <h3>❌ Error:</h3>
      <pre>{{ error }}</pre>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const generatedToken = ref(null);
const error = ref(null);

onMounted(() => {
  try {
    // 1. Usa TU Public Key de PRUEBA
    const mp = new MercadoPago('TEST-3955245772307950-103017-943380025b29ec4be4f81f22d7d136d4');

    // 2. Inicializa el CardForm (el formulario de tarjeta)
    const cardForm = mp.cardForm({
      amount: "1.0", // El monto es obligatorio, pero puede ser cualquiera para generar el token
      iframe: true,
      form: {
        id: "form-checkout", // Un ID virtual para el formulario
        cardNumber: { id: "form-checkout__cardNumber" },
        expirationDate: { id: "form-checkout__expirationDate" },
        securityCode: { id: "form-checkout__securityCode" }
      },
      callbacks: {
        onFormMounted: err => {
          if (err) return console.warn("Error al montar el formulario: ", err);
        },
        onSubmit: event => {
          event.preventDefault();
          generatedToken.value = null;
          error.value = null;
          
          // 3. Al hacer submit, se llama a createCardToken
          cardForm.createCardToken()
            .then(token => {
              // 4. Si tiene éxito, guardamos el token en nuestra variable reactiva
              console.log("TOKEN CREADO:", token.id);
              generatedToken.value = token.id;
            })
            .catch(err => {
              console.error("Error al crear el token:", err);
              error.value = err.message || 'Ocurrió un error desconocido.';
            });
        },
      },
    });
  } catch(e) {
    console.error('Error fatal inicializando el SDK de Mercado Pago:', e);
    error.value = 'No se pudo cargar el SDK de Mercado Pago. Revisa la consola y asegúrate de que el script esté en index.html.';
  }
});
</script>

<style scoped>
.generator-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 2rem;
  background-color: #2d3748; /* bg-gray-800 */
  color: white;
  border-radius: 8px;
  border: 1px solid #4a5568; /* border-gray-600 */
}
h1 { margin-bottom: 1rem; }
p { margin-bottom: 1.5rem; color: #a0aec0; /* text-gray-400 */ }
a { color: #63b3ed; /* text-blue-400 */ }
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 1rem;
}
.mp-field {
  background-color: #1a202c; /* bg-gray-900 */
  border: 1px solid #4a5568; /* border-gray-600 */
  border-radius: 4px;
  height: 45px;
  padding: 10px;
}
.submit-button {
  background-color: #3182ce; /* bg-blue-600 */
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.submit-button:hover {
  background-color: #2b6cb0; /* bg-blue-700 */
}
.token-result, .error-result {
  margin-top: 20px;
  padding: 15px;
  border-radius: 4px;
  word-wrap: break-word;
}
.token-result {
  background-color: #1c4532; /* bg-green-900 */
  border: 1px solid #38a169; /* border-green-500 */
}
.error-result {
    background-color: #4a1d1d; /* bg-red-900 */
    border: 1px solid #e53e3e; /* border-red-500 */
}
pre {
    white-space: pre-wrap;
    word-break: break-all;
    background-color: #1a202c;
    padding: 10px;
    border-radius: 4px;
}
</style>