import axios from 'axios';
import { setUserPlan } from './subscriptionService';

// URL base del backend - configurada desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5030';
const API_URL = `${API_BASE_URL}/api/payments`;

/**
 * Crea una suscripción y actualiza el plan del usuario
 * @param {string} planId - ID del plan (free, intermediate, advanced)
 * @param {string} email - Email del usuario
 * @returns {Promise<Object>} Respuesta del backend
 */
export const createSubscription = async (planId, email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/Payments/subscription`, {
      planId: planId,
      email: email
    });
    
    // Si el pago fue exitoso, actualizar el plan del usuario en localStorage
    if (response.data && response.status === 200) {
      setUserPlan(planId);
      console.log('✅ Suscripción creada y plan actualizado:', planId);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error in createSubscription:', error);
    throw error;
  }
};

/**
 * Confirma el pago y activa la suscripción
 * @param {string} paymentId - ID del pago
 * @param {string} planId - ID del plan
 * @returns {Promise<Object>}
 */
export const confirmPayment = async (paymentId, planId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/Payments/confirm`, {
      paymentId: paymentId
    });
    
    // Si la confirmación fue exitosa, actualizar el plan
    if (response.data && response.status === 200) {
      setUserPlan(planId);
      console.log('✅ Pago confirmado y plan actualizado:', planId);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Error al confirmar pago:', error);
    throw error;
  }
};

/**
 * Obtiene el historial de suscripciones del usuario
 * @returns {Promise<Array>} Lista de suscripciones
 */
export const getSubscriptionHistory = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${API_BASE_URL}/api/Users/Subscriptions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Historial de suscripciones obtenido:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener historial de suscripciones:', error);
    throw error;
  }
};