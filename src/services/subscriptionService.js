/**
 * Servicio para gestionar suscripciones y planes de usuario
 */

import axios from 'axios'
import { updateUserInfo, getCurrentUser, getAuthToken } from './authService'

// URL base - En desarrollo usa el proxy de Vite, en producción usa la variable de entorno
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5030';

/**
 * Obtiene el plan actual del usuario desde localStorage
 * @returns {string} ID del plan (free, intermediate, advanced)
 */
export function getUserPlan() {
  const user = getCurrentUser()
  return user?.subscriptionType || localStorage.getItem('user_plan') || 'free'
}

/**
 * Guarda el plan del usuario en localStorage y backend
 * @param {string} planId - ID del plan
 */
export async function setUserPlan(planId) {
  try {
    const user = getCurrentUser()
    const normalizedPlanId = planId.toLowerCase()
    
    // Siempre actualizar localStorage primero
    localStorage.setItem('user_plan', normalizedPlanId)
    
    if (!user) {
      console.log('✅ Plan actualizado en localStorage:', normalizedPlanId)
      return
    }

    const token = getAuthToken()
    const userId = localStorage.getItem('user_id') || user.UserId

    if (!userId || !token) {
      console.log('✅ Plan actualizado en localStorage (sin backend):', normalizedPlanId)
      updateUserInfo({
        subscriptionType: normalizedPlanId,
        subscriptionStatus: 'active'
      })
      return
    }

    // Intentar actualizar en el backend (opcional)
    try {
      await axios.put(
        `${API_BASE_URL}/api/Users/${userId}/Subscription`,
        {
          subscriptionType: normalizedPlanId,
          subscriptionStatus: 'active'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      console.log('✅ Plan actualizado en backend y localStorage:', normalizedPlanId)
    } catch (backendError) {
      // Si el backend falla, no importa - ya tenemos el plan en localStorage
      console.log('⚠️ Backend no disponible, plan guardado solo en localStorage:', normalizedPlanId)
    }

    // Actualizar usuario en localStorage
    updateUserInfo({
      subscriptionType: normalizedPlanId,
      subscriptionStatus: 'active'
    })

    console.log('✅ Plan de usuario actualizado a:', normalizedPlanId)
  } catch (error) {
    console.error('❌ Error al actualizar plan:', error)
    // Como último recurso, al menos guardar en localStorage
    localStorage.setItem('user_plan', planId.toLowerCase())
  }
}

/**
 * Sincroniza el plan del usuario desde el backend
 */
export async function syncUserPlan() {
  try {
    const user = getCurrentUser()
    if (!user) {
      console.log('ℹ️ No hay usuario para sincronizar')
      return
    }

    const token = getAuthToken()
    const userId = localStorage.getItem('user_id') || user.UserId

    if (!userId || !token) {
      console.log('ℹ️ No hay userId o token para sincronizar')
      return
    }

    // Intentar sincronizar desde el backend
    const response = await axios.get(
      `${API_BASE_URL}/api/Users/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (response.data.subscriptionType) {
      localStorage.setItem('user_plan', response.data.subscriptionType)
      updateUserInfo({
        subscriptionType: response.data.subscriptionType,
        subscriptionStatus: response.data.subscriptionStatus || 'active'
      })
      console.log('✅ Plan sincronizado desde el backend:', response.data.subscriptionType)
    }

    return response.data
  } catch (error) {
    // Si el endpoint no existe (404) o hay error, usar el plan actual del localStorage
    console.log('ℹ️ No se pudo sincronizar plan desde backend (endpoint no disponible), usando plan actual')
    
    // Mantener el plan que ya está en localStorage
    const currentPlan = getUserPlan()
    console.log('📋 Plan actual del usuario:', currentPlan)
    
    return null
  }
}

/**
 * Verifica si el usuario tiene un plan activo (no gratuito)
 * @returns {boolean}
 */
export function hasActivePlan() {
  const plan = getUserPlan()
  return plan !== 'free' && plan !== 'gratuito'
}

/**
 * Obtiene la información de suscripción del usuario
 * @returns {Object} Información de la suscripción
 */
export function getSubscriptionInfo() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const plan = getUserPlan()
  
  return {
    plan: plan,
    isActive: hasActivePlan(),
    startDate: user.subscriptionStartDate || localStorage.getItem('subscription_start_date'),
    endDate: user.subscriptionEndDate || localStorage.getItem('subscription_end_date'),
    status: user.subscriptionStatus || localStorage.getItem('subscription_status') || 'active'
  }
}

/**
 * Limpia la información de suscripción (para logout)
 */
export function clearSubscriptionInfo() {
  localStorage.removeItem('user_plan')
  localStorage.removeItem('subscription_start_date')
  localStorage.removeItem('subscription_end_date')
  localStorage.removeItem('subscription_status')
  localStorage.removeItem('pending_plan')
}
