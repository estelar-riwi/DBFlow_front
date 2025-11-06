import axios from 'axios';
import { showLoading, hideLoading } from '@/store/loading';

// URL base del backend - configurada desde variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5030';
const API_URL = `${API_BASE_URL}/api/Access`;

/**
 * Servicio de Autenticación
 * Conecta con los endpoints de /api/Access del backend
 */

// POST /api/Access/Register
export async function register(userData) {
  try {
    const response = await axios.post(`${API_URL}/Register`, {
      userName: userData.name,
      email: userData.email,
      password: userData.password
    });
    return {
      success: true,
      data: response.data,
      message: 'Registro exitoso. Por favor verifica tu correo.'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al registrar usuario',
      errors: error.response?.data?.errors || null
    };
  }
}

// POST /api/Access/Login
export async function login(credentials) {
  try {
    const response = await axios.post(`${API_URL}/Login`, {
      email: credentials.email,
      password: credentials.password
    });
    
    // Guardar el token si viene en la respuesta
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user || {}));
    }
    
    return {
      success: true,
      data: response.data,
      message: 'Inicio de sesión exitoso'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Credenciales inválidas',
      errors: error.response?.data?.errors || null
    };
  }
}

// GET /api/Access/Verify-Email
export async function verifyEmail(token) {
  try {
    const response = await axios.get(`${API_URL}/Verify-Email`, {
      params: { token }
    });
    return {
      success: true,
      data: response.data,
      message: 'Email verificado exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al verificar el email',
      errors: error.response?.data?.errors || null
    };
  }
}

// POST /api/Access/Forgot-Password
export async function forgotPassword(email) {
  try {
    const response = await axios.post(`${API_URL}/Forgot-Password`, {
      email: email
    });
    return {
      success: true,
      data: response.data,
      message: 'Enlace de recuperación enviado a tu correo'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al enviar el enlace de recuperación',
      errors: error.response?.data?.errors || null
    };
  }
}

// POST /api/Access/Reset-Password
export async function resetPassword(resetData) {
  try {
    const response = await axios.post(`${API_URL}/Reset-Password`, {
      token: resetData.token,
      newPassword: resetData.newPassword,
      confirmPassword: resetData.confirmPassword
    });
    return {
      success: true,
      data: response.data,
      message: 'Contraseña restablecida exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al restablecer la contraseña',
      errors: error.response?.data?.errors || null
    };
  }
}

// Función auxiliar para cerrar sesión
export function logout() {
  // Eliminar credenciales locales
  try {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  } catch (e) {
    // No hacemos nada si localStorage no está disponible
  }

  // Eliminar header por si quedó seteado en axios
  try {
    if (axios.defaults && axios.defaults.headers && axios.defaults.headers.common) {
      delete axios.defaults.headers.common['Authorization'];
    }
  } catch (e) {}

  // Emitir evento para que otros componentes puedan reaccionar al logout
  try {
    window.dispatchEvent(new Event('user-logged-out'));
  } catch (e) {}
}

/**
 * Cerrar sesión y redirigir al login.
 * Acepta opcionalmente una instancia de `router` (vue-router) para hacer push.
 */
export async function logoutAndRedirect(router) {
  try {
    showLoading('Cerrando sesión...');
  } catch (e) {}

  // Delay para que se vea la pantalla de carga
  await new Promise(resolve => setTimeout(resolve, 800));

  // Limpiar credenciales locales
  logout();

  try {
    if (router && typeof router.push === 'function') {
      await router.push({ name: 'Login' }).catch(() => {});
    } else {
      // Fallback: navegar usando location (recarga completa)
      window.location.href = '/login';
    }
  } finally {
    try { hideLoading(); } catch (e) {}
  }
}

// Función para obtener el token actual
export function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Función para verificar si el usuario está autenticado
export function isAuthenticated() {
  return !!getAuthToken();
}

// Función para obtener el usuario actual
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

// Configurar interceptor para añadir token a todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
