import axios from 'axios';

const api = axios.create({
  baseURL: 'https://service.estelar.andrescortes.dev/', // URL del backend en producción
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
