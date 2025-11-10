import axios from 'axios';

// URL base - En desarrollo usa el proxy de Vite, en producción usa la variable de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5030';

console.log('🌐 API_BASE_URL configurada:', API_BASE_URL);
console.log('🏭 Modo:', import.meta.env.MODE);
console.log('🔧 VITE_API_URL:', import.meta.env.VITE_API_URL);

/**
 * Obtiene el token de autenticación del localStorage
 * @returns {string|null} Token de autenticación
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}

/**
 * Obtiene el userId del localStorage
 * @returns {number} userId
 * @throws {Error} Si no se encuentra el userId
 */
function getUserId() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = localStorage.getItem('user_id') || 
                 user.UserId || 
                 user.userId || 
                 user.id ||
                 user.ID;
  
  if (!userId) {
    throw new Error('No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.');
  }
  
  return parseInt(userId);
}

/**
 * Crea una nueva base de datos MySQL
 * @param {Object} databaseData - Datos de la base de datos
 * @param {string} databaseData.databaseName - Nombre de la base de datos
 * @returns {Promise<Object>} Respuesta con id, host, port, username, password, databaseName
 */
export async function createDatabase(databaseData) {
  console.log('📝 Creando base de datos MySQL con:', databaseData);
  
  const userId = getUserId();
  const token = getAuthToken();
  
  console.log('🔑 Token disponible:', token ? 'SÍ (' + token.substring(0, 20) + '...)' : '❌ NO');
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
  }
  
  // El backend espera: databaseName, engine y userId
  const payload = {
    databaseName: databaseData.databaseName || databaseData.database_name,
    engine: databaseData.engine || 'MySQL', // Agregar engine
    userId: userId // Agregar userId
  };
  
  console.log('📤 Enviando petición POST /api/Databases/MySQL');
  console.log('📦 Payload JSON:', JSON.stringify(payload, null, 2));
  console.log('👤 UserId:', userId);
  console.log('🌐 URL completa:', `${API_BASE_URL}/api/Databases/MySQL`);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/Databases/MySQL`, payload);
    console.log('✅ Base de datos MySQL creada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear base de datos:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Error data:', error.response?.data);
    console.error('Payload enviado:', payload);
    throw error;
  }
}

/**
 * Obtiene las credenciales de una base de datos MySQL específica
 * NOTA: El backend no tiene un endpoint GET para credenciales existentes.
 * Las credenciales solo se devuelven al crear o rotar.
 * Esta función usa RotateCredentials para obtener/actualizar las credenciales.
 * @param {number} databaseId - ID de la base de datos
 * @returns {Promise<Object>} Credenciales: { id, host, port, username, password, databaseName }
 */
export async function getDatabaseCredentials(databaseId) {
  console.log('🔐 Obteniendo credenciales para base de datos ID:', databaseId);
  console.log('⚠️ Usando RotateCredentials ya que no existe endpoint GET /Credentials');
  console.log('🌐 URL:', `${API_BASE_URL}/api/Databases/MySQL/${databaseId}/RotateCredentials`);
  
  try {
    // El backend solo permite obtener credenciales rotándolas
    const response = await axios.post(`${API_BASE_URL}/api/Databases/MySQL/${databaseId}/RotateCredentials`, {});
    console.log('✅ Credenciales obtenidas (rotadas):', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener credenciales:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Database ID:', databaseId);
    throw error;
  }
}

/**
 * Rota las credenciales de una base de datos MySQL (genera nueva contraseña)
 * @param {number} databaseId - ID de la base de datos
 * @returns {Promise<Object>} Nuevas credenciales: { id, host, port, username, password, databaseName }
 */
export async function rotateCredentials(databaseId) {
  console.log('Rotando credenciales para base de datos:', databaseId);
  
  const response = await axios.post(`${API_BASE_URL}/api/Databases/MySQL/${databaseId}/RotateCredentials`, {});
  
  console.log('Credenciales rotadas exitosamente:', response.data);
  return response.data;
}

/**
 * Elimina una base de datos MySQL
 * @param {number} databaseId - ID de la base de datos
 * @returns {Promise<void>}
 */
export async function deleteDatabase(databaseId) {
  console.log('Eliminando base de datos:', databaseId);
  
  const response = await axios.delete(`${API_BASE_URL}/api/Databases/MySQL/${databaseId}`);
  
  console.log('Base de datos eliminada exitosamente:', response.data);
  return response.data;
}

/**
 * Obtiene todas las bases de datos del usuario
 * @returns {Promise<Array>} Lista de bases de datos
 */
export async function getAllDatabases() {
  const userId = getUserId();
  
  console.log('Obteniendo todas las bases de datos para usuario:', userId);
  
  const response = await axios.get(`${API_BASE_URL}/api/Users/${userId}/Databases`);
  
  console.log('Bases de datos obtenidas:', response.data);
  return response.data;
}

/**
 * Obtiene el conteo de bases de datos por tipo de gestor para un usuario
 * @returns {Promise<Object>} Objeto con el conteo por gestor: { mysql: number, postgresql: number, ... }
 */
export async function getDatabasesCount() {
  const userId = getUserId();
  const token = getAuthToken();
  
  console.log('🔢 Obteniendo conteo de bases de datos para usuario:', userId);
  console.log('🔑 Token disponible:', token ? 'SÍ' : '❌ NO');
  
  const response = await axios.get(`${API_BASE_URL}/api/Users/${userId}/Databases/Count`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  console.log('✅ Conteo de bases de datos obtenido:', response.data);
  return response.data;
}
