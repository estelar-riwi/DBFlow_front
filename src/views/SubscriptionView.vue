<template>
  <div class="subscription-container">
    <h2>Suscripción Premium</h2>
    <p>Precio: $10.000 / mes</p>

    <input
      v-model="email"
      type="email"
      placeholder="Correo del comprador"
      class="input"
    />

    <button @click="subscribe" class="btn">
      Suscribirme con Mercado Pago
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { showAlert } from '@/utils/notify'
import { createSubscription } from '@/services/paymentService'

const email = ref('')

const subscribe = async () => {
  try {
    const result = await createSubscription(email.value)
    if (result?.init_point) {
      window.location.href = result.init_point // redirige al checkout de Mercado Pago
    } else {
  await showAlert({ icon: 'error', title: 'Error', text: 'No se pudo iniciar la suscripción' })
    }
  } catch (error) {
    console.error('Error creando suscripción:', error)
  await showAlert({ icon: 'error', title: 'Error', text: 'Error al conectar con el servidor' })
  }
}
</script>

<style scoped>
.subscription-container {
  text-align: center;
  margin-top: 50px;
}
.input {
  padding: 8px;
  width: 250px;
  margin: 10px 0;
}
.btn {
  background-color: #009ee3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
