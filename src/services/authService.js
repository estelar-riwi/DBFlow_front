import axios from 'axios';
import { showLoading, hideLoading } from '@/store/loading';

// Función para decodificar el JWT y extraer el payload
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    return null;
  }
}

// URL base - En desarrollo usa el proxy de Vite, en producción usa la variable de entorno
const API_BASE_URL = import.meta.env.PROD ? (import.meta.env.VITE_API_URL || 'https://service.estelar.andrescortes.dev') : '';
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
    
    console.log('Respuesta completa del login:', response.data);
    
    // Guardar el token si viene en la respuesta
    if (response.data?.token) {
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      
      // Decodificar el JWT para extraer información del usuario
      const decodedToken = parseJwt(token);
      console.log('Token decodificado:', decodedToken);
      
      // Construir objeto de usuario con los datos del token y la respuesta
      const userData = response.data.user || {};
      
      // Extraer información del token decodificado
      if (decodedToken) {
        // Buscar el nombre en diferentes campos del JWT
        userData.UserName = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
                           decodedToken.name ||
                           decodedToken.unique_name ||
                           decodedToken.userName ||
                           decodedToken.UserName;
        
        // Buscar el email
        userData.Email = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
                        decodedToken.email ||
                        decodedToken.Email ||
                        credentials.email;
        
        // Guardar el user_id si está disponible
        const userId = decodedToken.sub || 
                      decodedToken.nameid || 
                      decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
                      decodedToken.userId ||
                      decodedToken.UserId;
        
        if (userId) {
          localStorage.setItem('user_id', userId.toString());
        }
      }
      
      // Asegurar que siempre tenga el email (del login si no viene en el token)
      if (!userData.Email) {
        userData.Email = credentials.email;
      }
      
      console.log('Guardando usuario:', userData);
      localStorage.setItem('user', JSON.stringify(userData));
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

// Función para actualizar el perfil del usuario
export async function updateProfile(profileData) {
  try {
    // Nota: Ajusta el endpoint según tu backend
    // Asumiendo que hay un endpoint PUT /api/Access/UpdateProfile
    const response = await axios.put(`${API_URL}/UpdateProfile`, {
      userName: profileData.userName,
      email: profileData.email
    });

    // Actualizar localStorage con los nuevos datos
    const currentUser = getCurrentUser() || {};
    currentUser.UserName = profileData.userName;
    currentUser.Email = profileData.email;
    localStorage.setItem('user', JSON.stringify(currentUser));

    return {
      success: true,
      data: response.data,
      message: 'Perfil actualizado exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al actualizar el perfil',
      errors: error.response?.data?.errors || null
    };
  }
}

// Función para cambiar la contraseña del usuario
export async function changePassword(passwordData) {
  try {
    // PUT /api/Access/ChangePassword
    // El endpoint no requiere confirmPassword, solo currentPassword y newPassword
    const response = await axios.put(`${API_URL}/ChangePassword`, {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });

    return {
      success: true,
      data: response.data,
      message: 'Contraseña actualizada exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error al cambiar la contraseña. Verifica tu contraseña actual.',
      errors: error.response?.data?.errors || null
    };
  }
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
