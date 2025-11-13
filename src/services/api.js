import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5030/api', // ⚠️ Cambia al puerto de tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
