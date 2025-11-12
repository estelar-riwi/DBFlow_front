// ✅ Asegúrate de que esta URL y puerto coincidan con tu backend .NET
// La URL debe ser la dirección donde corre tu API, no la del frontend.
const API_BASE_URL = 'http://localhost:5030'; // O la URL de tu API en producción

/**
 * Llama al backend para crear una preferencia de pago en Mercado Pago.
 * @param {object} preferenceData - Datos para la preferencia, como { planId, userId }.
 * @returns {Promise<object>} La preferencia de pago creada, que incluye el initPoint.
 */
export async function createPaymentPreference(preferenceData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/create-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferenceData),
    });

    // Si la respuesta no es OK (ej. 400, 500), lee el error y lánzalo
    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || `Error del servidor: ${response.status}`);
    }

    const preference = await response.json();
    return preference;

  } catch (error) {
    console.error('Error en el servicio createPaymentPreference:', error);
    // Relanzamos el error para que el componente que llama pueda manejarlo y mostrarlo.
    throw error;
  }
}

/**
 * Obtiene el historial de suscripciones del usuario.
 * (Esta es una función de ejemplo, adáptala a tu endpoint real).
 * @returns {Promise<Array>} Una lista del historial de suscripciones.
 */
export async function getSubscriptionHistory() {
  try {
    // SIMULACIÓN: Reemplaza esto con una llamada real a tu API
    // ej: const response = await fetch(`${API_BASE_URL}/api/subscriptions/history`);
    console.log("Obteniendo historial de suscripciones...");
    await new Promise(resolve => setTimeout(resolve, 800)); // Simula la latencia de red
    return [
        // Ejemplo de datos:
        // { id: 1, createdAt: '2023-10-27T10:00:00Z', planId: 'free', amount: 0, status: 'completed' },
        // { id: 2, createdAt: '2023-11-27T10:05:00Z', planId: 'intermediate', amount: 50000, status: 'active' }
    ];
  } catch (error) {
    console.error('Error al obtener el historial de suscripciones:', error);
    return []; // Devuelve un array vacío en caso de error para no romper la UI
  }
}