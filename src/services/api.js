import axios from 'axios';

const api = axios.create({
  baseURL: 'https://service.estelar.andrescortes.dev/api', // ⚠️ Cambia al puerto de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
