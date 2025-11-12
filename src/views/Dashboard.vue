<template>
  <div class="dashboard-layout">
    
    <div class="canvas-container-bg" ref="container">
      <canvas ref="canvas" class="w-full h-full"></canvas>
    </div>
    
    <aside class="sidebar">
      <div class="sidebar-logo">
          <img src="/logos/logo.ico" alt="DBFlow Logo" class="logo-image">
          <strong>DBFlow</strong>
      </div>
      
      <nav class="sidebar-nav">
          <router-link to="/dashboard" exact-active-class="active">
            <span>Mis Bases de Datos</span>
          </router-link>
          <router-link to="/dashboard/subscription" exact-active-class="active">
            <span>Planes</span>
          </router-link>
      </nav>
      
      <div class="sidebar-footer">
        
        <div class="sidebar-profile-area" @click="openProfileModal">
          <div class="profile-avatar">
            <span>{{ userInitial }}</span> 
          </div>
          <div class="profile-info">
            <strong>{{ firstName }}</strong>
            <span class="profile-plan" :class="`plan-${currentPlan}`">
              <i class="fas fa-crown" v-if="currentPlan !== 'free'"></i>
              {{ planDisplay }}
            </span>
          </div>
        </div>
        
        <button class="btn-logout" @click="onLogoutClick" title="Cerrar sesión">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <!-- Banner de verificación de email -->
    <transition name="banner-slide">
      <div v-if="showEmailVerificationBanner" class="email-verification-banner">
        <div class="banner-content">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="banner-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          <div class="banner-text">
            <strong>Verifica tu correo electrónico</strong>
            <span>Se ha enviado un enlace de verificación a <strong>{{ pendingEmail }}</strong>. Por favor, revisa tu bandeja de entrada.</span>
          </div>
          <button class="banner-resend" @click="resendVerification" title="Reenviar correo">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Reenviar
          </button>
          <button class="banner-close" @click="dismissEmailBanner" title="Cerrar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <main class="main-content">
      <transition name="page-fade" mode="out-in">
        <router-view v-slot="{ Component }">
          <component :is="Component" :key="$route.fullPath" />
        </router-view>
      </transition>
    </main>

    <transition name="modal-fade">
      <div class="modal-overlay" v-if="isModalOpen" @click="closeProfileModal">
        <transition name="modal-scale">
          <div class="modal-card" v-if="isModalOpen" @click.stop>
            <button class="modal-close-btn" @click="closeProfileModal">×</button>
            <h2>Editar Perfil</h2>
        
        <!-- Formulario de Información Personal -->
        <div class="modal-form">
          
          <!-- Información de la Cuenta -->
          <div class="form-section">
            <h3 class="modal-subtitle">Información de la Cuenta</h3>
            
            <div class="form-group">
              <label for="profile-name">Nombre de Usuario</label>
              <input 
                type="text" 
                id="profile-name" 
                v-model="profileName"
                autocomplete="off"
                required
              >
            </div>
            
            <div class="form-group">
              <label for="profile-email">Correo Electrónico</label>
              <input 
                type="email" 
                id="profile-email" 
                v-model="profileEmail"
                autocomplete="off"
                required
              >
            </div>

            <!-- Botón para guardar información personal -->
            <div class="modal-actions">
              <button type="button" class="btn-primary" @click="handleProfileUpdate">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px;">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Guardar Información
              </button>
            </div>
          </div>

          <!-- Cambiar Contraseña -->
          <div class="form-section">
            <h3 class="modal-subtitle">Cambiar Contraseña</h3>
            
            <div class="form-group">
              <label for="current-password">Contraseña Actual</label>
              <div class="password-wrapper">
                <input 
                  :type="showCurrentPassword ? 'text' : 'password'" 
                  id="current-password" 
                  v-model="currentPassword" 
                  placeholder="••••••••"
                  autocomplete="new-password"
                >
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="showCurrentPassword = !showCurrentPassword" 
                  :aria-label="showCurrentPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  tabindex="-1"
                >
                  <svg v-if="showCurrentPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c1.83 0 3.543-.417 5.057-1.157M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.5a10.522 10.522 0 01-4.293 5.362M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.01 9.964 7.178.07.207.07.437 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label for="new-password">Nueva Contraseña</label>
              <div class="password-wrapper">
                <input 
                  :type="showNewPassword ? 'text' : 'password'" 
                  id="new-password" 
                  v-model="newPassword" 
                  placeholder="••••••••"
                  autocomplete="new-password"
                >
                <button 
                  type="button" 
                  class="toggle-password" 
                  @click="showNewPassword = !showNewPassword" 
                  :aria-label="showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  tabindex="-1"
                >
                  <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c1.83 0 3.543-.417 5.057-1.157M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.5a10.522 10.522 0 01-4.293 5.362M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.01 9.964 7.178.07.207.07.437 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <small class="password-requirements">Mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número</small>
            </div>

            <!-- Botón para cambiar contraseña -->
            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="handlePasswordChange">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 20px; height: 20px;">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Cambiar Contraseña
              </button>
            </div>
          </div>

          <!-- Botón de Cerrar -->
          <div class="modal-actions">
            <button type="button" class="btn-outline" @click="closeProfileModal">Cerrar</button>
          </div>
        </div>

          </div>
        </transition>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router'; 
import { showAlert } from '@/utils/notify';
import { logoutAndRedirect, getCurrentUser, updateProfile, changePassword, checkEmailVerificationStatus, resendVerificationEmail } from '@/services/authService';
import { showLoading, hideLoading } from '@/store/loading';
import { getUserPlan, syncUserPlan } from '@/services/subscriptionService';
import { getPlanConfig } from '@/config/plans';

// --- Lógica del Modal y Perfil ---
const isModalOpen = ref(false);

// Banner de verificación de email
const showEmailVerificationBanner = ref(false);
const pendingEmail = ref('');

// Obtener datos del usuario actual desde localStorage
const user = getCurrentUser();

console.log('Usuario cargado:', user); // Para debug

// Datos del perfil - intentar obtener de diferentes ubicaciones
let userName = 'Usuario';
let userEmail = 'email@example.com';

if (user) {
  // Intentar obtener el email (backend .NET usa PascalCase)
  userEmail = user.Email || user.email || 
              user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || 
              'email@example.com';
  
  // Intentar obtener el nombre (backend .NET usa PascalCase)
  userName = user.UserName || user.userName || user.username || user.Name || user.name || 
             user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 
             user.given_name;
  
  // Si no hay nombre o el nombre es igual al email, extraer prefijo del email
  if (!userName || userName === userEmail || userName.includes('@')) {
    // Extraer la parte antes del @ del email y capitalizarla
    const emailPrefix = userEmail.split('@')[0];
    userName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  }
}

const profileName = ref(userName);
const profileEmail = ref(userEmail);
const currentPassword = ref('');
const newPassword = ref('');
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);

// Obtener el plan del usuario de forma dinámica
const currentPlan = ref(getUserPlan());
const planConfig = computed(() => getPlanConfig(currentPlan.value));

const userSubscription = ref(currentPlan.value);

// Computed para mostrar solo el primer nombre en el sidebar
const firstName = computed(() => {
  return profileName.value ? profileName.value.split(' ')[0] : 'Usuario';
});

// Computed para la inicial del avatar
const userInitial = computed(() => {
  return profileName.value ? profileName.value.charAt(0).toUpperCase() : 'U';
});

// Computed para formatear el nombre del plan
const planDisplay = computed(() => {
  return planConfig.value?.displayName || 'Plan Gratuito';
});

const openProfileModal = () => {
  // Resetea los campos de contraseña al abrir
  currentPassword.value = '';
  newPassword.value = '';
  isModalOpen.value = true;
};

const closeProfileModal = () => {
  isModalOpen.value = false;
};

const router = useRouter();

// Función para cerrar el banner de verificación
const dismissEmailBanner = () => {
  showEmailVerificationBanner.value = false;
  localStorage.removeItem('pendingEmailVerification');
};

// Función para reenviar el email de verificación
const resendVerification = async () => {
  const emailToSend = pendingEmail.value || profileEmail.value || userEmail;
  
  if (!emailToSend) {
    await showAlert({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo obtener el correo electrónico.'
    });
    return;
  }

  try {
    showLoading('Reenviando correo de verificación...');
    
    const result = await resendVerificationEmail(emailToSend);
    
    hideLoading();

    if (result.success) {
      await showAlert({
        icon: 'success',
        title: '¡Correo Reenviado!',
        text: `Se ha enviado un nuevo enlace de verificación a ${emailToSend}. Por favor, revisa tu bandeja de entrada y spam.`,
        confirmText: 'Entendido',
        autoClose: 5000
      });
    } else {
      await showAlert({
        icon: 'error',
        title: 'Error',
        text: result.message || 'No se pudo reenviar el correo de verificación.'
      });
    }
  } catch (error) {
    hideLoading();
    await showAlert({
      icon: 'error',
      title: 'Error',
      text: 'Ocurrió un error al reenviar el correo. Inténtalo de nuevo.'
    });
  }
};

// Función para verificar el estado del email periódicamente
let emailCheckInterval = null;

const checkEmailVerification = async () => {
  if (!showEmailVerificationBanner.value) {
    return;
  }
  
  try {
    const status = await checkEmailVerificationStatus();
    
    if (status.verified) {
      console.log('✅ Email verificado correctamente');
      // Ocultar el banner
      showEmailVerificationBanner.value = false;
      localStorage.removeItem('pendingEmailVerification');
      
      // Mostrar mensaje de éxito
      await showAlert({
        icon: 'success',
        title: '¡Email Verificado!',
        text: 'Tu correo electrónico ha sido verificado exitosamente.',
        autoClose: 3000
      });
      
      // Detener el intervalo
      if (emailCheckInterval) {
        clearInterval(emailCheckInterval);
        emailCheckInterval = null;
      }
    }
  } catch (error) {
    console.error('Error al verificar email:', error);
  }
};

// Verificar si hay un email pendiente de verificación al cargar
onMounted(() => {
  const pendingEmailStored = localStorage.getItem('pendingEmailVerification');
  if (pendingEmailStored) {
    pendingEmail.value = pendingEmailStored;
    showEmailVerificationBanner.value = true;
    
    // Iniciar verificación periódica cada 10 segundos
    emailCheckInterval = setInterval(checkEmailVerification, 10000);
    
    // Verificar inmediatamente al cargar
    checkEmailVerification();
  }
  
  // Sincronizar plan del usuario
  syncUserPlan();
});

// Limpiar el intervalo cuando el componente se desmonte
onBeforeUnmount(() => {
  if (emailCheckInterval) {
    clearInterval(emailCheckInterval);
    emailCheckInterval = null;
  }
});

async function onLogoutClick() {
  // Confirmar acción
  const result = await showAlert({ 
    icon: 'info', 
    title: 'Cerrar sesión', 
    text: '¿Deseas cerrar tu sesión actualmente?', 
    confirmText: 'Cerrar sesión', 
    showCancel: true 
  });
  
  if (result && result.isConfirmed) {
    // Agregar clase de animación de salida
    const dashboard = document.querySelector('.dashboard-layout');
    if (dashboard) {
      dashboard.classList.add('dashboard-exit');
    }
    
    // Esperar a que termine la animación (600ms)
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Limpia credenciales y redirige al login
    await logoutAndRedirect(router);
  }
}

const handleProfileUpdate = async () => {
  // Validar que el nombre no esté vacío
  if (!profileName.value || profileName.value.trim() === '') {
    await showAlert({ 
      icon: 'error', 
      title: 'Error', 
      text: 'El nombre de usuario no puede estar vacío.' 
    });
    return;
  }

  // Validar que el email no esté vacío
  if (!profileEmail.value || profileEmail.value.trim() === '') {
    await showAlert({ 
      icon: 'error', 
      title: 'Error', 
      text: 'El correo electrónico no puede estar vacío.' 
    });
    return;
  }
  
  // Detectar si el email cambió
  const currentUser = getCurrentUser();
  const emailChanged = currentUser?.Email && 
                       profileEmail.value.trim().toLowerCase() !== currentUser.Email.toLowerCase();
  
  // Actualizar solo el perfil (nombre y email)
  try {
    showLoading('Actualizando perfil...');
    
    const profileResult = await updateProfile({
      userName: profileName.value.trim(),
      email: profileEmail.value.trim()
    });

    hideLoading();

    if (!profileResult.success) {
      await showAlert({ 
        icon: 'error', 
        title: 'Error', 
        text: profileResult.message || 'No se pudo actualizar el perfil.'
      });
      return;
    }

    // Si el email cambió, mostrar mensaje de verificación
    if (emailChanged) {
      // Guardar el email pendiente de verificación
      pendingEmail.value = profileEmail.value.trim();
      localStorage.setItem('pendingEmailVerification', pendingEmail.value);
      showEmailVerificationBanner.value = true;
      
      await showAlert({ 
        icon: 'info', 
        title: '¡Perfil Actualizado!', 
        text: 'Tu información ha sido actualizada. Se ha enviado un enlace de verificación a tu nuevo correo electrónico. Por favor, verifica tu correo para completar el cambio.',
        confirmText: 'Entendido'
      });
    } else {
      // Solo se actualizó el nombre
      await showAlert({ 
        icon: 'success', 
        title: '¡Éxito!', 
        text: 'Tu información de perfil ha sido actualizada correctamente.',
        autoClose: 2000
      });
    }

    // Cerrar el modal
    closeProfileModal();
    
  } catch (error) {
    hideLoading();
    console.error('Error al actualizar perfil:', error);
    await showAlert({ 
      icon: 'error', 
      title: 'Error', 
      text: 'Ocurrió un error al actualizar el perfil. Inténtalo de nuevo.'
    });
  }
};

const handlePasswordChange = async () => {
  // Validar que ambos campos de contraseña estén llenos
  if (!currentPassword.value) {
    await showAlert({ 
      icon: 'error', 
      title: 'Error', 
      text: 'Debes ingresar tu contraseña actual.' 
    });
    return;
  }

  if (!newPassword.value) {
    await showAlert({ 
      icon: 'error', 
      title: 'Error', 
      text: 'Debes ingresar una nueva contraseña.' 
    });
    return;
  }
  
  // Validar requisitos de contraseña
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(newPassword.value)) {
    await showAlert({ 
      icon: 'error', 
      title: 'Contraseña inválida', 
      text: 'La contraseña debe tener:\n• Mínimo 8 caracteres\n• Al menos una mayúscula (A-Z)\n• Al menos una minúscula (a-z)\n• Al menos un número (0-9)', 
      confirmText: 'Aceptar' 
    });
    return;
  }
  
  // Intentar cambiar la contraseña
  try {
    showLoading('Cambiando contraseña...');
    
    const passwordResult = await changePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    });

    hideLoading();

    if (!passwordResult.success) {
      const errorMsg = passwordResult.message || 'No se pudo cambiar la contraseña';
      await showAlert({ 
        icon: 'error', 
        title: 'Error', 
        text: errorMsg
      });
      return;
    }

    // Contraseña cambiada exitosamente
    await showAlert({ 
      icon: 'success', 
      title: '¡Éxito!', 
      text: 'Tu contraseña ha sido actualizada correctamente.',
      autoClose: 2000
    });

    // Limpiar los campos de contraseña
    currentPassword.value = '';
    newPassword.value = '';
    
    // Cerrar el modal
    closeProfileModal();
      
  } catch (error) {
    hideLoading();
    console.error('Error al cambiar contraseña:', error);
    await showAlert({ 
      icon: 'error', 
      title: 'Error', 
      text: 'Ocurrió un error al cambiar la contraseña. Inténtalo de nuevo.'
    });
  }
};
// --- (Fin Lógica Modal) ---


// --- LÓGICA DE PARTÍCULAS (Se mantiene igual) ---
const canvas = ref(null);
const container = ref(null);
let animationId = null;
let particles = [];
let cw, ch;
const NUM_PARTICLES = 120;
const MAX_CONNECTION_DISTANCE = 100;
const mouse = { x: 9999, y: 9999, radius: 70 };

function randRange(a, b) { return a + Math.random() * (b - a); }

class Particle {
  constructor(x, y) {
    this.pos = { x, y };
    // Aumentamos la velocidad base para movimiento constante más visible
    this.vel = { x: randRange(-0.8, 0.8), y: randRange(-0.8, 0.8) }; 
    this.colorWeight = randRange(0.15, 0.45); 
    this.size = randRange(0.8, 2.5);
  }
  move() {
    const dx_mouse = this.pos.x - mouse.x;
    const dy_mouse = this.pos.y - mouse.y;
    const dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);
    if (dist_mouse < mouse.radius) {
        const angle = Math.atan2(dy_mouse, dx_mouse);
        const repelForce = (mouse.radius - dist_mouse) / mouse.radius;
        this.vel.x += Math.cos(angle) * repelForce * 0.8;
        this.vel.y += Math.sin(angle) * repelForce * 0.8;
    }
    this.vel.x *= 0.98;
    this.vel.y *= 0.98;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    if (this.pos.x < -10) this.pos.x = cw + 10;
    if (this.pos.x > cw + 10) this.pos.x = -10;
    if (this.pos.y < -10) this.pos.y = ch + 10;
    if (this.pos.y > ch + 10) this.pos.y = -10;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 255, 255, ${this.colorWeight})`;
    ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
function resizeCanvas(c) {
    if (!container.value) return; 
    const rect = container.value.getBoundingClientRect();
    cw = rect.width;
    ch = rect.height;
    const dpr = window.devicePixelRatio || 1;
    c.width = Math.floor(cw * dpr);
    c.height = Math.floor(ch * dpr);
    c.style.width = cw + 'px';
    c.style.height = ch + 'px';
    const ctx = c.getContext('2d');
    ctx && ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
}
function drawConnections(ctx) {
    particles.forEach(p1 => {
        particles.forEach(p2 => {
            const dx = p1.pos.x - p2.pos.x;
            const dy = p1.pos.y - p2.pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MAX_CONNECTION_DISTANCE) {
                const alpha = 1 - dist / MAX_CONNECTION_DISTANCE;
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.08})`; 
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(p1.pos.x, p1.pos.y);
                ctx.lineTo(p2.pos.x, p2.pos.y);
                ctx.stroke();
            }
        });
    });
}
function animateLoop() {
    const c = canvas.value;
    if (!c) {
        animationId = requestAnimationFrame(animateLoop);
        return;
    }
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = 'rgba(0,0,0,0.1)'; 
    ctx.fillRect(0, 0, cw, ch);
    drawConnections(ctx);
    particles.forEach(p => {
        p.move();
        p.draw(ctx);
    });
    animationId = requestAnimationFrame(animateLoop);
}
function initCanvas(c) {
    resizeCanvas(c);
    for (let i = 0; i < NUM_PARTICLES; i++) {
         particles.push(new Particle(randRange(0, cw), randRange(0, ch)));
    }
    animateLoop();
}
function handleMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}
let onResizeHandler = null; 
onMounted(async () => {
    // Sincronizar plan desde el backend
    await syncUserPlan();
    currentPlan.value = getUserPlan();
    userSubscription.value = currentPlan.value;
    console.log('📋 Plan sincronizado en Dashboard:', currentPlan.value);
    
    const c = canvas.value;
    if (!c) return;
    initCanvas(c);
    onResizeHandler = () => { resizeCanvas(c); };
    window.addEventListener('resize', onResizeHandler);
    window.addEventListener('mousemove', handleMouseMove);
});
onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    if (onResizeHandler) {
        window.removeEventListener('resize', onResizeHandler);
    }
    window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped>
/* Importamos los estilos del Dashboard */
@import '../assets/Dashboard.css';

/* Estilos específicos para el fondo del canvas */
.canvas-container-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1; /* Fondo */
    pointer-events: none;
}
</style>
<style scoped>
.password-wrapper { position: relative; }
.password-wrapper input { width: 100%; padding-right: 82px; }
.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 6px 10px;
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.toggle-password svg { width: 20px; height: 20px; }
.toggle-password:hover { background: rgba(255,255,255,0.08); }
</style>