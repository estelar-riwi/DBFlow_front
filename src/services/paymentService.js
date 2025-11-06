import axios from 'axios';

// Asegúrate de que esta URL sea la URL base real de tu backend
const API_BASE_URL = 'http  ://localhost:5030'; // O 'http://localhost:5000'

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