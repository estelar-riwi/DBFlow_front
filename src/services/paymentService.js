import axios from 'axios';

// URL base del backend - configurada desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5199';
const API_URL = `${API_BASE_URL}/api/payments`;

export async function createSubscription(email) {
  const response = await axios.post(`${API_URL}/create`, {
    payer_email: email,
    back_url: 'https://www.tu-sitio.com/return'
  });

  return response.data;
}
