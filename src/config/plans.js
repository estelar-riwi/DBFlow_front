/**
 * Configuración de planes de suscripción
 * Define los límites de bases de datos por gestor para cada plan
 */

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Gratuito',
    displayName: 'Plan Gratuito',
    price: 0,
    databaseLimit: 2, // 2 bases de datos por gestor
    features: [
      '2 bases de datos por gestor',
      'Acceso básico',
      'Soporte comunitario'
    ]
  },
  INTERMEDIATE: {
    id: 'intermediate',
    name: 'Intermedio',
    displayName: 'Plan Intermedio',
    price: 5.000,
    databaseLimit: 5, // 5 bases de datos por gestor
    features: [
      '5 bases de datos por gestor',
      'Acceso prioritario',
      'Soporte por email',
      'Backups automáticos'
    ]
  },
  ADVANCED: {
    id: 'advanced',
    name: 'Avanzado',
    displayName: 'Plan Avanzado',
    price: 10.000,
    databaseLimit: 10, // 10 bases de datos por gestor
    features: [
      '10 bases de datos por gestor',
      'Acceso premium',
      'Soporte 24/7',
      'Backups automáticos',
      'Monitoreo avanzado',
      'Alta disponibilidad'
    ]
  }
}

/**
 * Mapeo de IDs de planes para normalización
 */
export const PLAN_IDS = {
  'free': 'FREE',
  'gratuito': 'FREE',
  'FREE': 'FREE',
  'intermediate': 'INTERMEDIATE',
  'intermedio': 'INTERMEDIATE',
  'INTERMEDIATE': 'INTERMEDIATE',
  'advanced': 'ADVANCED',
  'avanzado': 'ADVANCED',
  'ADVANCED': 'ADVANCED'
}

/**
 * Obtiene la configuración de un plan
 * @param {string} planId - ID del plan
 * @returns {Object} Configuración del plan
 */
export function getPlanConfig(planId) {
  if (!planId) return PLANS.FREE
  
  const normalizedId = PLAN_IDS[planId.toLowerCase()] || 'FREE'
  return PLANS[normalizedId] || PLANS.FREE
}

/**
 * Obtiene el límite de bases de datos para un plan específico
 * @param {string} planId - ID del plan
 * @returns {number} Límite de bases de datos por gestor
 */
export function getDatabaseLimit(planId) {
  const plan = getPlanConfig(planId)
  return plan.databaseLimit
}

/**
 * Verifica si un plan permite crear más bases de datos de un tipo específico
 * @param {string} planId - ID del plan
 * @param {number} currentCount - Cantidad actual de bases de datos del gestor
 * @returns {boolean} true si puede crear más, false si alcanzó el límite
 */
export function canCreateDatabase(planId, currentCount) {
  const limit = getDatabaseLimit(planId)
  return currentCount < limit
}

/**
 * Obtiene todos los planes disponibles
 * @returns {Array} Array con todos los planes
 */
export function getAllPlans() {
  return Object.values(PLANS)
}
