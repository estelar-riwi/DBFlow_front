import axios from 'axios';

// URL base - En desarrollo usa el proxy de Vite, en producción usa la variable de entorno
const API_BASE_URL = import.meta.env.PROD ? (import.meta.env.VITE_API_URL || 'https://service.estelar.andrescortes.dev') : '';
const API_URL = `${API_BASE_URL}/api/Databases`;

/**
 * Crea una nueva base de datos
 * @param {Object} databaseData - Datos de la base de datos
 * @param {string} databaseData.databaseName - Nombre de la base de datos
 * @param {string} databaseData.engine - Motor de la base de datos (MySQL, PostgreSQL, MongoDB, Redis, SQLServer)
 * @returns {Promise<Object>} Respuesta con id, message, host, port, username, databaseName
 */
export async function createDatabase(databaseData) {
  console.log('Datos recibidos:', databaseData);
  
  // Obtener el userId del localStorage (puede estar en varios lugares)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = localStorage.getItem('user_id') || 
                 user.UserId || 
                 user.userId || 
                 user.id ||
                 user.ID;
  
  console.log('User data:', user);
  console.log('UserId encontrado:', userId);
  
  if (!userId) {
    throw new Error('No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.');
  }
  
  // El backend espera: UserId, engine y databaseName
  const payload = {
    UserId: parseInt(userId),
    engine: databaseData.engine || databaseData.database_engine,
    databaseName: databaseData.databaseName || databaseData.database_name
  };
  
  console.log('Enviando petición POST /api/Databases con:', payload);
  
  const response = await axios.post(API_URL, payload);
  
  console.log('Respuesta exitosa:', response.data);
  return response.data;
}

/**
 * Obtiene las credenciales de una base de datos específica
 * @param {number} databaseId - ID de la base de datos
 * @returns {Promise<Object>} Credenciales: { id, host, port, username, password, databaseName }
 */
export async function getDatabaseCredentials(databaseId) {
  const response = await axios.get(`${API_URL}/${databaseId}/Credentials`);
  return response.data;
}

/**
 * Rota las credenciales de una base de datos (genera nueva contraseña)
 * @param {number} databaseId - ID de la base de datos
 * @param {number|string} isInteger - Parámetro requerido por la API
 * @returns {Promise<Object>} Nuevas credenciales: { id, host, port, username, password, databaseName }
 */
export async function rotateCredentials(databaseId, isInteger = 0) {
  const response = await axios.post(`${API_URL}/${databaseId}/RotateCredentials`, null, {
    params: { isInteger }
  });
  return response.data;
}

/**
 * Elimina una base de datos
 * @param {number} databaseId - ID de la base de datos
 * @param {string} engine - Motor de la base de datos
 * @returns {Promise<void>}
 */
export async function deleteDatabase(databaseId, engine) {
  const response = await axios.delete(`${API_URL}/${databaseId}`, {
    params: { engine }
  });
  return response.data;
}

/**
 * Obtiene todas las bases de datos del usuario
 * @returns {Promise<Array>} Lista de bases de datos
 */
export async function getAllDatabases() {
  const response = await axios.get(API_URL);
  return response.data;
}
