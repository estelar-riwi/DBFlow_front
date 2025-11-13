import api from './api'; // 👈 IMPORTANTE

// ✅ Iniciar el Checkout Pro
export const initiateCheckoutPro = async ({ planId, userId, email }) => {
  // 🔴 IMPORTANTE: Para pruebas en Sandbox, Mercado Pago requiere un email de prueba.
  const testUserEmail = 'test_user_12345678@testuser.com';
  const finalEmail = import.meta.env.DEV ? testUserEmail : email;
  try {
        const response = await api.post('/payments/checkout-pro', { planId, userId, email: finalEmail });

    if (response.data?.initPoint || response.data?.InitPoint) {
      const redirectUrl = response.data.initPoint || response.data.InitPoint;
      console.log('🔗 Redirigiendo a Mercado Pago:', redirectUrl);
      window.location.href = redirectUrl;
    } else {
      console.error('⚠️ No se recibió un initPoint válido:', response.data);
      throw new Error('No se recibió un enlace de pago válido.');
    }
  } catch (error) {
    console.error('❌ Error iniciando Checkout Pro:', error);
    throw error;
  }
};

// (Opcional)
export const getSubscriptionHistory = async () => {
  try {
    const response = await api.get('/payments/history');
    return response.data || [];
  } catch (error) {
    console.error('❌ Error obteniendo historial de suscripción:', error);
    return [];
  }
};
