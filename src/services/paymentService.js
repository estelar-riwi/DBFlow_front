// En: /src/services/paymentService.js

// --- CONFIGURACIÓN DE LA API ---
const API_BASE_URL = 'http://localhost:5030'; // O tu URL de producción

/**
 * Crea una preferencia de pago y redirige a Checkout Pro de Mercado Pago.
 * Es la función principal que usa el componente de suscripción.
 * @param {object} checkoutData - Datos del checkout { planId, userId, email }
 */
export async function initiateCheckoutPro(checkoutData) {
  try {
    console.log('📤 Enviando datos al backend para Checkout Pro:', checkoutData);
    
    // Asume que el backend espera un endpoint como '/api/payments/checkout-pro'
    const response = await fetch(`${API_BASE_URL}/api/payments/checkout-pro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.initPoint) {
      throw new Error('No se recibió la URL de pago del servidor.');
    }

    console.log('✅ Checkout Pro iniciado, redirigiendo a:', data.initPoint);
    
    // Guardar el plan pendiente antes de redirigir
    localStorage.setItem('pending_plan', checkoutData.planId);
    
    // Redirigir al usuario a la página de pago de Mercado Pago
    window.location.href = data.initPoint;
    
  } catch (error) {
    console.error('❌ Error en initiateCheckoutPro:', error);
    // Relanzamos el error para que el componente que llama pueda manejarlo.
    throw error;
  }
}

/**
 * Obtiene el historial de suscripciones del usuario.
 * @returns {Promise<Array>} Una lista del historial de suscripciones.
 */
export async function getSubscriptionHistory() {
  try {
    console.log("Obteniendo historial de suscripciones...");
    
    // --- SIMULACIÓN ---
    // En un futuro, aquí harás una llamada real a tu API:
    // const response = await fetch(`${API_BASE_URL}/api/subscriptions/history`, {
    //   headers: {
    //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    //   }
    // });
    // if (!response.ok) throw new Error('No se pudo cargar el historial.');
    // return await response.json();
    
    // Por ahora, usamos datos de ejemplo simulando una espera.
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
        // { id: 1, createdAt: '2023-10-27T10:00:00Z', planId: 'free', amount: 0, status: 'completed' },
        // { id: 2, createdAt: '2023-11-27T10:05:00Z', planId: 'intermediate', amount: 50000, status: 'active' }
    ];
  } catch (error) {
    console.error('❌ Error al obtener el historial de suscripciones:', error);
    return []; // Devuelve un array vacío en caso de error para no romper la UI.
  }
}

// NOTA: La función 'createPaymentPreference' ha sido eliminada
// porque 'initiateCheckoutPro' es la que se está utilizando y
// tener ambas causaba el error de declaración duplicada.