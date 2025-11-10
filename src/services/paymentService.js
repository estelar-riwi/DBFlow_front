/**
 * Servicio para manejar la comunicación con el controlador de pagos (PaymentsController.cs)
 */

import axios from 'axios';
import { getAuthToken } from './authService'; // Asumiendo que esta función existe y funciona

// URL base - Asegúrate de que esta configuración coincida con tu entorno
const API_BASE_URL = import.meta.env.PROD ? (import.meta.env.VITE_API_URL || 'http://localhost:5030') : '';

/**
 * Llama al endpoint del backend para crear una suscripción en Mercado Pago.
 *
 * @param {object} subscriptionData - Datos que incluyen PlanId, Email, CardTokenId, BackUrl, UserId
 * @returns {Promise<object>} Respuesta del backend (generalmente el objeto de suscripción de MP)
 */
export async function createSubscription(subscriptionData) {
    // Obtenemos el token para asegurar que la API sepa qué usuario está pagando (si lo necesitas)
    const token = getAuthToken();

    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/Payments/subscription`,
            subscriptionData,
            {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('❌ Error en createSubscription:', error);
        
        // Manejo de errores basado en la estructura de Axios
        const errorMessage = error.response?.data?.error || error.message || 'Error desconocido al crear la suscripción.';
        throw new Error(errorMessage);
    }
}

export async function getSubscriptionHistory() {
    const token = getAuthToken();
    if (!token) {
        throw new Error('No autenticado');
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/api/Payments/history`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('❌ Error en getSubscriptionHistory:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Error desconocido al obtener el historial de suscripciones.';
        throw new Error(errorMessage);
    }
}