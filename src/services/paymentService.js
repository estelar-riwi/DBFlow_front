import axios from 'axios';

// URL base del backend - configurada desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5030';
const API_URL = `${API_BASE_URL}/api/payments`;

export const createSubscription = async (planId, email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/Payments/subscription`, {
      planId: planId, // Ahora pasamos el planId dinámicamente
      email: email
    });
    return response.data;
  } catch (error) {
    console.error('Error in createSubscription:', error);
    throw error;
  }
};