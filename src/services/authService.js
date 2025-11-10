import axios from 'axios';
import { showLoading, hideLoading } from '@/store/loading';
import { clearSubscriptionInfo } from './subscriptionService';

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
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://service.estelar.andrescortes.dev';

console.log('🌐 AuthService API_BASE_URL:', API_BASE_URL);
console.log('🏭 Modo:', import.meta.env.MODE);
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
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return {
      success: true,
      data: response.data,
      message: 'Registro exitoso. Por favor verifica tu correo.'
    };
  } catch (error) {
    console.error('❌ Error en registro:', error.response?.status, error.response?.data);
    
    // Manejar error 409 (Conflict) - email ya registrado
    if (error.response?.status === 409) {
      return {
        success: false,
        message: 'Este correo electrónico ya está registrado. Por favor inicia sesión o usa otro correo.',
        errors: error.response?.data?.errors || null
      };
    }
    
    // Manejar otros errores
    return {
      success: false,
      message: error.response?.data?.message || error.response?.data?.title || 'Error al registrar usuario',
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
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
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
      
      // IMPORTANTE: Buscar el userId en TODAS las posibles ubicaciones
      let userId = 
        // Primero en la respuesta directa del backend
        response.data.userId ||
        response.data.UserId ||
        response.data.id ||
        response.data.user?.userId ||
        response.data.user?.UserId ||
        response.data.user?.id;
      
      // Si no está en la respuesta, buscar en el token decodificado
      if (!userId && decodedToken) {
        userId = 
          decodedToken.sub || 
          decodedToken.nameid || 
          decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
          decodedToken.userId ||
          decodedToken.UserId ||
          decodedToken.id;
      }
      
      // Guardar el userId si lo encontramos
      if (userId) {
        console.log('✅ userId encontrado:', userId);
        localStorage.setItem('user_id', userId.toString());
        userData.UserId = parseInt(userId);
      } else {
        console.error('❌ NO SE ENCONTRÓ userId en la respuesta del backend');
        console.error('📋 Datos completos de la respuesta:', JSON.stringify(response.data, null, 2));
        console.error('🔑 Token decodificado:', JSON.stringify(decodedToken, null, 2));
      }
      
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
      }
      
      // Asegurar que siempre tenga el email (del login si no viene en el token)
      if (!userData.Email) {
        userData.Email = credentials.email;
      }
      
      // Extraer el plan de suscripción del backend
      const subscriptionType = response.data.subscriptionType || 
                               response.data.user?.subscriptionType || 
                               decodedToken?.subscriptionType ||
                               'free';
      
      const subscriptionStatus = response.data.subscriptionStatus || 
                                 response.data.user?.subscriptionStatus || 
                                 'active';
      
      userData.subscriptionType = subscriptionType;
      userData.subscriptionStatus = subscriptionStatus;
      
      // Guardar el plan de suscripción en localStorage
      localStorage.setItem('user_plan', subscriptionType);
      
      console.log('Guardando usuario:', userData);
      console.log('📋 Plan de suscripción:', subscriptionType);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Verificar que se guardó correctamente
      const tokenGuardado = localStorage.getItem('authToken');
      console.log('✅ Token guardado en localStorage:', tokenGuardado ? 'SÍ (' + tokenGuardado.substring(0, 30) + '...)' : 'NO');
    }
    
    return {
      success: true,
      data: response.data,
      message: 'Inicio de sesión exitoso'
    };
  } catch (error) {
    console.error('❌ Error en login:', error.response?.status, error.response?.data);
    
    // Obtener el mensaje de error del backend
    const errorData = error.response?.data;
    const errorMessage = errorData?.message || errorData?.title || errorData || '';
    
    // Verificar si el error es específicamente por email no verificado
    // Debe contener palabras clave específicas de verificación Y no ser un 404
    const isEmailNotVerified = 
      error.response?.status !== 404 && // No es usuario no encontrado
      (
        errorMessage.toLowerCase().includes('email no verificado') ||
        errorMessage.toLowerCase().includes('email not verified') ||
        errorMessage.toLowerCase().includes('please verify your email') ||
        errorMessage.toLowerCase().includes('verify your email address')
      );
    
    // Manejar error 401 específicamente
    if (error.response?.status === 401) {
      return {
        success: false,
        emailNotVerified: isEmailNotVerified,
        email: credentials.email,
        message: isEmailNotVerified 
          ? 'Por favor verifica tu correo electrónico antes de iniciar sesión.' 
          : 'Credenciales incorrectas. Verifica tu email y contraseña.',
        errors: error.response?.data?.errors || null
      };
    }
    
    // Manejar error 404 (usuario no encontrado)
    if (error.response?.status === 404) {
      return {
        success: false,
        emailNotVerified: false,
        email: credentials.email,
        message: 'No existe una cuenta con este correo electrónico. Por favor regístrate primero.',
        errors: error.response?.data?.errors || null
      };
    }
    
    return {
      success: false,
      emailNotVerified: isEmailNotVerified,
      email: credentials.email,
      message: errorMessage || 'Error al iniciar sesión',
      errors: error.response?.data?.errors || null
    };
  }
}

// GET /api/Access/Verify-Email
export async function verifyEmail(token) {
  try {
    console.log('🔑 verifyEmail llamado');
    console.log('📝 Token recibido:', token);
    console.log('📏 Longitud del token:', token?.length);
    console.log('� Tipo de token:', typeof token);
    console.log('�📡 URL del API:', API_URL);
    console.log('📡 URL completa que se enviará:', `${API_URL}/Verify-Email?token=${token}`);
    
    // Asegurarnos de que el token existe y es una cadena
    if (!token || typeof token !== 'string' || token.trim() === '') {
      console.error('❌ Token inválido o vacío');
      return {
        success: false,
        message: 'Token de verificación no válido. Por favor solicita un nuevo enlace.',
        errors: null
      };
    }
    
    const response = await axios.get(`${API_URL}/Verify-Email`, {
      params: { token: token.trim() }
    });
    
    console.log('✅ Respuesta exitosa del backend:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: response.data?.message || 'Email verificado exitosamente'
    };
  } catch (error) {
    console.error('❌ Error completo:', error);
    console.error('❌ Error en verifyEmail:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        params: error.config?.params
      },
      message: error.message
    });
    
    // Extraer el mensaje de error del backend
    let errorMessage = 'Enlace de verificación inválido o expirado. Por favor solicita un nuevo enlace.';
    
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.title) {
        errorMessage = error.response.data.title;
      }
    }
    
    return {
      success: false,
      message: errorMessage,
      errors: error.response?.data?.errors || null
    };
  }
}

// POST /api/Access/Resend-Verification
export async function resendVerificationEmail(email) {
  try {
    const response = await axios.post(`${API_URL}/Resend-Verification`, {
      email: email
    });
    return {
      success: true,
      data: response.data,
      message: 'Enlace de verificación reenviado a tu correo'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.response?.data || 'Error al reenviar el enlace de verificación',
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
    localStorage.removeItem('user_id');
    // Limpiar información de suscripción
    clearSubscriptionInfo();
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
  console.log('🚪 Iniciando cierre de sesión...');
  
  try {
    showLoading('Cerrando sesión...');
  } catch (e) {
    console.warn('⚠️ No se pudo mostrar loading:', e);
  }

  // Delay para que se vea la pantalla de carga
  await new Promise(resolve => setTimeout(resolve, 800));

  // Limpiar credenciales locales
  console.log('🧹 Limpiando credenciales...');
  logout();

  console.log('🔄 Redirigiendo a login...');
  
  try {
    if (router && typeof router.push === 'function') {
      console.log('✅ Usando Vue Router para redirigir');
      await router.push({ name: 'Login' }).catch((err) => {
        console.error('Error al hacer push con router:', err);
      });
    } else {
      // Fallback: navegar usando location (recarga completa)
      console.log('✅ Usando window.location para redirigir');
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('❌ Error al redirigir:', error);
    // Último recurso: forzar recarga completa
    window.location.href = '/login';
  } finally {
    try { 
      hideLoading(); 
      console.log('✅ Cierre de sesión completado');
    } catch (e) {
      console.warn('⚠️ No se pudo ocultar loading:', e);
    }
  }
}

// Función para obtener el token actual
export function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Función para verificar si el token está expirado
export function isTokenExpired() {
  const token = getAuthToken();
  if (!token) return true;
  
  try {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) {
      // Si no tiene exp, asumimos que es válido (algunos backends no usan exp)
      return false;
    }
    
    const now = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    const isExpired = now >= payload.exp;
    
    if (isExpired) {
      console.warn('⚠️ Token expirado');
      console.warn('Expiró:', new Date(payload.exp * 1000).toLocaleString());
      console.warn('Ahora:', new Date(now * 1000).toLocaleString());
    } else {
      const timeLeft = payload.exp - now;
      const minutesLeft = Math.floor(timeLeft / 60);
      console.log(`✅ Token válido por ${minutesLeft} minutos más`);
    }
    
    return isExpired;
  } catch (e) {
    console.error('Error al verificar expiración del token:', e);
    return false; // Si hay error, asumimos que es válido para no bloquear
  }
}

// Función para verificar si el usuario está autenticado
export function isAuthenticated() {
  const hasToken = !!getAuthToken();
  
  // Por ahora, solo verificamos que exista el token
  // La verificación de expiración se hará en las peticiones individuales
  return hasToken;
}

// Función para obtener el usuario actual
export function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Actualiza la información del usuario en localStorage
 */
export function updateUserInfo(userData) {
  const currentUser = getCurrentUser()
  if (!currentUser) return
  
  const updatedUser = {
    ...currentUser,
    ...userData
  }
  
  localStorage.setItem('user', JSON.stringify(updatedUser))
  
  // Si se actualiza el tipo de suscripción, también actualizar user_plan
  if (userData.subscriptionType) {
    localStorage.setItem('user_plan', userData.subscriptionType)
  }
  
  console.log('✅ Usuario actualizado:', updatedUser)
}

/**
 * Obtiene el plan de suscripción actual del usuario
 */
export function getUserSubscriptionType() {
  const user = getCurrentUser()
  return user?.subscriptionType || localStorage.getItem('user_plan') || 'free'
}

// Función para actualizar el perfil del usuario
export async function updateProfile(profileData) {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    // Usar el endpoint correcto: PUT /api/Users/Profile
    const response = await axios.put(`${API_BASE_URL}/api/Users/Profile`, {
      userName: profileData.userName,
      email: profileData.email
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Actualizar localStorage con los nuevos datos
    const currentUser = getCurrentUser() || {};
    currentUser.UserName = profileData.userName;
    currentUser.Email = profileData.email;
    localStorage.setItem('user', JSON.stringify(currentUser));

    console.log('✅ Perfil actualizado correctamente');

    return {
      success: true,
      data: response.data,
      message: 'Perfil actualizado exitosamente'
    };
  } catch (error) {
    console.error('Error en updateProfile:', error);
    // Lanzar el error para que sea capturado en el componente
    throw error;
  }
}

// Función para cambiar la contraseña del usuario
export async function changePassword(passwordData) {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    // Usar el endpoint correcto: PUT /api/Users/Change-Password
    const response = await axios.put(`${API_BASE_URL}/api/Users/Change-Password`, {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Contraseña cambiada correctamente');

    return {
      success: true,
      data: response.data,
      message: 'Contraseña actualizada exitosamente'
    };
  } catch (error) {
    console.error('Error en changePassword:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al cambiar la contraseña. Verifica tu contraseña actual.',
      errors: error.response?.data?.errors || null
    };
  }
}

/**
 * Verificar el estado de verificación del email del usuario
 * GET /api/Users/Profile para obtener información actualizada del usuario
 */
export async function checkEmailVerificationStatus() {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return { verified: false };
    }
    
    const response = await axios.get(`${API_BASE_URL}/api/Users/Profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Verificar si el email está verificado en la respuesta
    const isVerified = response.data?.emailVerified || response.data?.isEmailVerified || false;
    
    return {
      verified: isVerified,
      email: response.data?.email || response.data?.Email
    };
  } catch (error) {
    console.error('Error al verificar estado del email:', error);
    return { verified: false };
  }
}

// Configurar interceptor para añadir token a todas las peticiones
axios.interceptors.request.use(
  (config) => {
    // No añadir token a las rutas de autenticación
    const authRoutes = ['/Login', '/Register', '/Verify-Email', '/Resend-Verification', '/Forgot-Password', '/Reset-Password'];
    const isAuthRoute = authRoutes.some(route => config.url?.includes(route));
    
    if (isAuthRoute) {
      console.log('ℹ️ Interceptor: Ruta de autenticación, no se añade token', config.url);
      return config;
    }
    
    const token = getAuthToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Interceptor: Token añadido a la petición', config.url);
    } else {
      console.warn('⚠️ Interceptor: NO hay token para la petición', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores 401
// Interceptor de respuesta para manejar errores 401
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Error 401 - Token inválido o expirado');
      console.warn('URL:', error.config?.url);
      console.warn('Headers enviados:', error.config?.headers);
      console.warn('Token en localStorage:', localStorage.getItem('authToken') ? 'SÍ' : 'NO');
    }
    return Promise.reject(error);
  }
);
