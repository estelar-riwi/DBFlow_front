import axios from 'axios';

// URL base - En desarrollo usa el proxy de Vite, en producción usa la variable de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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
  // Primero intentar obtener desde user_id directo
  const userIdDirect = localStorage.getItem('user_id');
  
  if (userIdDirect) {
    console.log('✅ userId encontrado en localStorage (directo):', userIdDirect);
    return parseInt(userIdDirect);
  }
  
  // Si no está, buscar en el objeto user
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.error('❌ No se encontró el objeto user en localStorage');
    throw new Error('No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.');
  }
  
  const user = JSON.parse(userStr);
  const userId = user.UserId || 
                 user.userId || 
                 user.id ||
                 user.ID;
  
  if (!userId) {
    console.error('❌ Objeto user existe pero no tiene userId');
    console.error('📋 Contenido del user:', user);
    throw new Error('No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.');
  }
  
  console.log('✅ userId encontrado en objeto user:', userId);
  return parseInt(userId);
}

/**
 * Crea una nueva base de datos MySQL
 * @param {Object} databaseData - Datos de la base de datos
 * @param {string} databaseData.databaseName - Nombre de la base de datos
 * @returns {Promise<Object>} Respuesta con id, host, port, username, password, databaseName
 */
export async function createDatabase(databaseData) {
  console.log('� ========== CREANDO BASE DE DATOS MYSQL ==========');
  console.log('📝 Datos recibidos:', databaseData);
  
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
    console.log('✅ RESPUESTA DEL BACKEND:', response.data);
    console.log('🔍 Engine en la respuesta:', response.data.engine);
    console.log('🔍 Tipo de engine:', typeof response.data.engine);
    console.log('🐬 ========== FIN CREACIÓN MYSQL ==========');
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
  
  console.log('📋 ========== OBTENIENDO TODAS LAS BASES DE DATOS ==========');
  console.log('👤 UserId:', userId);
  console.log('🌐 URL:', `${API_BASE_URL}/api/Users/${userId}/Databases`);
  
  const response = await axios.get(`${API_BASE_URL}/api/Users/${userId}/Databases`);
  
  console.log('✅ RESPUESTA COMPLETA DEL BACKEND:');
  console.log('📦 response.data:', response.data);
  console.log('📦 response.data (JSON):', JSON.stringify(response.data, null, 2));
  console.log('📊 Total de bases de datos:', response.data?.length || 0);
  
  // Mostrar cada base de datos con TODOS sus campos
  if (response.data && Array.isArray(response.data)) {
    response.data.forEach((db, index) => {
      console.log(`\n  📌 BD #${index + 1}:`);
      console.log(`     Nombre: ${db.databaseName || db.name}`);
      console.log(`     Engine: "${db.engine}" (tipo: ${typeof db.engine})`);
      console.log(`     Status: ${db.status}`);
      console.log(`     Todas las propiedades:`, Object.keys(db));
      console.log(`     Objeto completo:`, db);
    });
  }
  
  console.log('\n📋 ========== FIN OBTENCIÓN BASES DE DATOS ==========');

  // Mapear la respuesta para que coincida con lo que el frontend espera
  const mappedDatabases = response.data.map(db => ({
    ...db,
    id: db.id, // Asegurarse de que el id esté presente
    name: db.databaseName, // Mapear databaseName a name
    engine: db.engineName, // Mapear engineName a engine
    status: 'Activo' // Siempre mostrar como Activo ya que las BD creadas están activas
  }));

  return mappedDatabases;
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

/* ========================================================================= */
/* =================== FUNCIONES POSTGRESQL ================================ */
/* ========================================================================= */

/**
 * Crea una nueva base de datos PostgreSQL
 * @param {Object} databaseData - Datos de la base de datos
 * @param {string} databaseData.databaseName - Nombre de la base de datos
 * @returns {Promise<Object>} Respuesta con id, host, port, username, password, databaseName
 */
export async function createPostgreSQLDatabase(databaseData) {
  console.log('� ========== CREANDO BASE DE DATOS POSTGRESQL ==========');
  console.log('📝 Datos recibidos:', databaseData);
  
  const userId = getUserId();
  const token = getAuthToken();
  
  console.log('🔑 Token disponible:', token ? 'SÍ (' + token.substring(0, 20) + '...)' : '❌ NO');
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
  }
  
  // El backend espera: databaseName, engine y userId
  const payload = {
    databaseName: databaseData.databaseName || databaseData.database_name,
    engine: databaseData.engine || 'PostgreSQL',
    userId: userId
  };
  
  console.log('📤 Enviando petición POST /api/Databases/PostgreSQL');
  console.log('📦 Payload JSON:', JSON.stringify(payload, null, 2));
  console.log('👤 UserId:', userId);
  console.log('🌐 URL completa:', `${API_BASE_URL}/api/Databases/PostgreSQL`);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/Databases/PostgreSQL`, payload);
    console.log('✅ RESPUESTA DEL BACKEND:', response.data);
    console.log('🔍 Engine en la respuesta:', response.data.engine);
    console.log('🔍 Tipo de engine:', typeof response.data.engine);
    console.log('🐘 ========== FIN CREACIÓN POSTGRESQL ==========');
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear base de datos PostgreSQL:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Error data:', error.response?.data);
    console.error('Payload enviado:', payload);
    throw error;
  }
}

/**
 * Obtiene las credenciales de una base de datos PostgreSQL específica
 * @param {number} databaseId - ID de la base de datos
 * @returns {Promise<Object>} Credenciales: { id, host, port, username, password, databaseName }
 */
export async function getPostgreSQLCredentials(databaseId) {
  console.log('🔐 Obteniendo credenciales de PostgreSQL para base de datos ID:', databaseId);
  console.log('🌐 URL:', `${API_BASE_URL}/api/Databases/PostgreSQL/${databaseId}/Credentials`);
  
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
  }
  
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/Databases/PostgreSQL/${databaseId}/Credentials`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Credenciales PostgreSQL obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener credenciales PostgreSQL:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Database ID:', databaseId);
    throw error;
  }
}

/**
 * Rota las credenciales de una base de datos PostgreSQL (genera nueva contraseña)
 * @param {number} databaseId - ID de la base de datos
 * @returns {Promise<Object>} Nuevas credenciales: { id, host, port, username, password, databaseName }
 */
export async function rotatePostgreSQLCredentials(databaseId) {
  console.log('🔄 Rotando credenciales PostgreSQL para base de datos:', databaseId);
  console.log('🌐 URL:', `${API_BASE_URL}/api/Databases/PostgreSQL/${databaseId}/RotateCredentials`);
  
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
  }
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/Databases/PostgreSQL/${databaseId}/RotateCredentials`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Credenciales PostgreSQL rotadas exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al rotar credenciales PostgreSQL:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Database ID:', databaseId);
    throw error;
  }
}

/**
 * Elimina una base de datos PostgreSQL
 * @param {number} databaseId - ID de la base de datos
 * @returns {Promise<void>}
 */
export async function deletePostgreSQLDatabase(databaseId) {
  console.log('🗑️ Eliminando base de datos PostgreSQL:', databaseId);
  console.log('🌐 URL:', `${API_BASE_URL}/api/Databases/PostgreSQL/${databaseId}`);
  
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
  }
  
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/Databases/PostgreSQL/${databaseId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Base de datos PostgreSQL eliminada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar base de datos PostgreSQL:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Database ID:', databaseId);
    throw error;
  }
}

/* ========================================================================= */
/* =================== FUNCIONES SQL SERVER ================================ */
/* ========================================================================= */

/**
 * Crea una nueva base de datos SQL Server
 * @param {Object} databaseData - Datos de la base de datos
 * @param {string} databaseData.databaseName - Nombre de la base de datos
 * @returns {Promise<Object>} Respuesta con id, host, port, username, password, databaseName
 */
export async function createSQLServerDatabase(databaseData) {
  console.log('🗄️ ========== CREANDO BASE DE DATOS SQL SERVER ==========');
  console.log('📝 Datos recibidos:', databaseData);
  
  const userId = getUserId();
  const token = getAuthToken();
  
  console.log('🔑 Token disponible:', token ? 'SÍ (' + token.substring(0, 20) + '...)' : '❌ NO');
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
  }
  
  // NOTA IMPORTANTE: El backend valida el campo 'engine' y rechaza ciertos valores
  // Basándome en la tabla de la BD que mostraste, el engine guardado es "SQL Server"
  // Pero el backend podría estar validando contra un enum diferente
  // Intentamos con todas las variaciones posibles:
  
  const engineVariations = [
    "SqlServer",      // CamelCase sin espacio
    "sqlserver",      // todo minúsculas
    "SQLSERVER",      // todo mayúsculas  
    "SQL Server",     // Con espacio (como aparece en la BD)
    "SQLServer",      // Sin espacio mayúsculas
    "Sql Server"      // Primera letra capital
  ];
  
  // Por ahora usamos la primera (SqlServer)
  const payload = {
    userId: userId,
    databaseName: databaseData.databaseName || databaseData.database_name,
    engine: "SQL Server"  // Con espacio - como indicó el usuario
  };
  
  console.log('📤 Enviando petición POST /api/Databases/SQLServer');
  console.log('📦 Payload JSON:', JSON.stringify(payload, null, 2));
  console.log('👤 UserId:', userId);
  console.log('🌐 URL completa:', `${API_BASE_URL}/api/Databases/SQLServer`);
  console.log('💡 Variaciones probadas: SQLServer ❌, SQL Server ❌, SqlServer ❌, probando: sqlserver');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/Databases/SQLServer`, payload);
    console.log('✅ RESPUESTA DEL BACKEND:', response.data);
    console.log('🔍 Engine en la respuesta:', response.data.engine);
    console.log('🔍 Tipo de engine:', typeof response.data.engine);
    console.log('🗄️ ========== FIN CREACIÓN SQL SERVER ==========');
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear base de datos SQL Server:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Error data:', error.response?.data);
    console.error('Payload enviado:', payload);
    console.error('');
    console.error('🔍 DIAGNÓSTICO:');
    console.error('Si ves "Engine inválido", el backend no acepta este valor.');
    console.error('Valores probados hasta ahora:');
    console.error('  ❌ "SQLServer"');
    console.error('  ❌ "SQL Server"');
    console.error('  ❌ "SqlServer"');
    console.error('  🔄 "sqlserver" (minúsculas)');
    console.error('');
    console.error('NECESITAS CONTACTAR AL EQUIPO DEL BACKEND para saber:');
    console.error('1. ¿Qué valor exacto acepta el campo "engine"?');
    console.error('2. ¿Hay un enum definido? Si sí, ¿cuáles son los valores válidos?');
    console.error('3. ¿O el campo debe omitirse completamente?');
    throw error;
  }
}

/**
 * Obtiene las credenciales de una base de datos SQL Server específica
 * @param {number} databaseId - ID de la base de datos
 * @returns {Promise<Object>} Credenciales: { id, host, port, username, password, databaseName }
 */
export async function getSQLServerCredentials(databaseId) {
  console.log('🔐 Obteniendo credenciales de SQL Server para base de datos ID:', databaseId);
  console.log('🌐 URL:', `${API_BASE_URL}/api/Databases/SQLServer/${databaseId}/Credentials`);
  
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
  }
  
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/Databases/SQLServer/${databaseId}/Credentials`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Credenciales SQL Server obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener credenciales SQL Server:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Database ID:', databaseId);
    throw error;
  }
}

/**
 * Rota las credenciales de una base de datos SQL Server (genera nueva contraseña)
 * @param {number} databaseId - ID de la base de datos
 * @returns {Promise<Object>} Nuevas credenciales: { id, host, port, username, password, databaseName }
 */
export async function rotateSQLServerCredentials(databaseId) {
  console.log('🔄 Rotando credenciales SQL Server para base de datos:', databaseId);
  console.log('🌐 URL:', `${API_BASE_URL}/api/Databases/SQLServer/${databaseId}/RotateCredentials`);
  
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
  }
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/Databases/SQLServer/${databaseId}/RotateCredentials`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Credenciales SQL Server rotadas exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al rotar credenciales SQL Server:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Database ID:', databaseId);
    throw error;
  }
}

/**
 * Elimina una base de datos SQL Server
 * @param {number} databaseId - ID de la base de datos
 * @returns {Promise<void>}
 */
export async function deleteSQLServerDatabase(databaseId) {
  console.log('🗑️ Eliminando base de datos SQL Server:', databaseId);
  console.log('🌐 URL:', `${API_BASE_URL}/api/Databases/SQLServer/${databaseId}`);
  
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
  }
  
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/Databases/SQLServer/${databaseId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Base de datos SQL Server eliminada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar base de datos SQL Server:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Database ID:', databaseId);
    throw error;
  }
}

/* ========================================================================= */
/* =================== FUNCIONES MONGODB =================================== */
/* ========================================================================= */

/**
 * Crea una nueva base de datos MongoDB
 * @param {Object} databaseData - Datos de la base de datos
 * @param {string} databaseData.databaseName - Nombre de la base de datos
 * @returns {Promise<Object>} Respuesta con id, host, port, username, password, databaseName
 */
export async function createMongoDBDatabase(databaseData) {
  console.log('🍃 ========== CREANDO BASE DE DATOS MONGODB ==========');
  console.log('📝 Datos recibidos:', databaseData);
  
  const userId = getUserId();
  const token = getAuthToken();
  
  console.log('🔑 Token disponible:', token ? 'SÍ (' + token.substring(0, 20) + '...)' : '❌ NO');
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
  }
  
  const payload = {
    userId: userId,
    databaseName: databaseData.databaseName || databaseData.database_name,
    engine: databaseData.engine || 'MongoDB'
  };
  
  console.log('📤 Enviando petición POST /api/Databases/MongoDB');
  console.log('📦 Payload JSON:', JSON.stringify(payload, null, 2));
  console.log('👤 UserId:', userId);
  console.log('🌐 URL completa:', `${API_BASE_URL}/api/Databases/MongoDB`);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/Databases/MongoDB`, payload);
    console.log('✅ RESPUESTA DEL BACKEND:', response.data);
    console.log('🔍 Engine en la respuesta:', response.data.engine);
    console.log('🔍 Tipo de engine:', typeof response.data.engine);
    console.log('🍃 ========== FIN CREACIÓN MONGODB ==========');
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear base de datos MongoDB:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Error data:', error.response?.data);
    console.error('Payload enviado:', payload);
    throw error;
  }
}

/**
 * Obtiene las credenciales de una base de datos MongoDB específica
 * @param {number} databaseId - ID de la base de datos
 * @returns {Promise<Object>} Credenciales: { id, host, port, username, password, databaseName }
 */
export async function getMongoDBCredentials(databaseId) {
  console.log('🔐 Obteniendo credenciales de MongoDB para base de datos ID:', databaseId);
  console.log('🌐 URL:', `${API_BASE_URL}/api/Databases/MongoDB/${databaseId}/Credentials`);
  
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
  }
  
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/Databases/MongoDB/${databaseId}/Credentials`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Credenciales MongoDB obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener credenciales MongoDB:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Database ID:', databaseId);
    throw error;
  }
}

/**
 * Rota las credenciales de una base de datos MongoDB (genera nueva contraseña)
 * @param {number} databaseId - ID de la base de datos
 * @returns {Promise<Object>} Nuevas credenciales: { id, host, port, username, password, databaseName }
 */
export async function rotateMongoDBCredentials(databaseId) {
  console.log('🔄 Rotando credenciales MongoDB para base de datos:', databaseId);
  console.log('🌐 URL:', `${API_BASE_URL}/api/Databases/MongoDB/${databaseId}/RotateCredentials`);
  
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
  }
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/Databases/MongoDB/${databaseId}/RotateCredentials`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Credenciales MongoDB rotadas exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al rotar credenciales MongoDB:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Database ID:', databaseId);
    throw error;
  }
}

/**
 * Elimina una base de datos MongoDB
 * @param {number} databaseId - ID de la base de datos
 * @returns {Promise<void>}
 */
export async function deleteMongoDBDatabase(databaseId) {
  console.log('🗑️ Eliminando base de datos MongoDB:', databaseId);
  console.log('🌐 URL:', `${API_BASE_URL}/api/Databases/MongoDB/${databaseId}`);
  
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
  }
  
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/Databases/MongoDB/${databaseId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log('✅ Base de datos MongoDB eliminada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al eliminar base de datos MongoDB:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Database ID:', databaseId);
    throw error;
  }
}
