import axios from 'axios';

// URL base - En desarrollo usa el proxy de Vite, en producción usa la variable de entorno
const API_BASE_URL = import.meta.env.PROD ? (import.meta.env.VITE_API_URL || 'https://service.estelar.andrescortes.dev') : '';
const API_URL = `${API_BASE_URL}/api/Databases`;

/**
 * Crea una nueva base de datos
 * @param {Object} databaseData - Datos de la base de datos
 */
export async function createDatabase(databaseData) {
  console.log('Datos recibidos:', databaseData);
  
  // El backend espera nombres de campos específicos (según el error de validación)
  const payload = {
    UserId: parseInt(databaseData.user_id), // Convertir a número
    DatabaseName: databaseData.database_name,
    Engine: databaseData.database_engine
  };
  
  console.log('Enviando petición POST /api/Databases con:', payload);
  
  const response = await axios.post(API_URL, payload);
  
  console.log('Respuesta exitosa:', response.data);
  return response.data;
}

/**
 * Obtiene las credenciales de una base de datos específica
 * @param {number} databaseId - ID de la base de datos
 * @returns {Promise<Object>} Credenciales de conexión
 */
export async function getDatabaseCredentials(databaseId) {
  const response = await axios.get(`${API_URL}/${databaseId}/Credentials`);
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
