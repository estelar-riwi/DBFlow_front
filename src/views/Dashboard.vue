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
            <span>Subscriptions</span>
          </router-link>
      </nav>
      
      <div class="sidebar-footer">
        
        <div class="sidebar-profile-area" @click="openProfileModal">
          <div class="profile-avatar">
            <span>{{ userInitial }}</span> </div>
          <div class="profile-info">
            <strong>{{ firstName }}</strong>
            <span class="profile-plan">{{ planDisplay }}</span>
          </div>
        </div>
        
        <div style="display:flex; gap:8px; margin-top:12px;">
          <button class="btn-logout" @click="onLogoutClick" title="Cerrar sesión" style="background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.06);padding:6px 10px;border-radius:8px;">
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <transition name="page-fade" mode="out-in">
        <router-view :key="$route.fullPath" />
      </transition>
    </main>

    <transition name="modal-fade">
      <div class="modal-overlay" v-if="isModalOpen" @click="closeProfileModal">
        <transition name="modal-scale">
          <div class="modal-card" v-if="isModalOpen" @click.stop>
            <button class="modal-close-btn" @click="closeProfileModal">×</button>
            <h2>Editar Perfil</h2>
        
        <form @submit.prevent="handleProfileUpdate" class="modal-form" autocomplete="off">
          
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
          </div>

          <!-- Botones de Acción -->
          <div class="modal-actions">
            <button type="button" class="btn-outline" @click="closeProfileModal">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar Cambios</button>
          </div>
        </form>

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
import { logoutAndRedirect, getCurrentUser, updateProfile, changePassword } from '@/services/authService';
import { showLoading, hideLoading } from '@/store/loading';

// --- Lógica del Modal y Perfil ---
const isModalOpen = ref(false);

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

// Obtener el plan del usuario desde localStorage o JWT
let userPlan = 'Gratuito'; // Valor por defecto
if (user) {
  userPlan = user.Plan || user.plan || 
             user.SubscriptionType || user.subscriptionType ||
             user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
             'Gratuito';
}

const userSubscription = ref(userPlan);

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
  const planMap = {
    'free': 'Plan Gratuito',
    'gratuito': 'Plan Gratuito',
    'intermediate': 'Plan Intermedio',
    'intermedio': 'Plan Intermedio',
    'advanced': 'Plan Avanzado',
    'avanzado': 'Plan Avanzado'
  };
  
  const planLower = userSubscription.value.toLowerCase();
  return planMap[planLower] || `Plan ${userSubscription.value}`;
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
    
    // Esperar a que termine la animación (400ms)
    await new Promise(resolve => setTimeout(resolve, 400));
    
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
  
  // 1. Validar y cambiar contraseña (si se está cambiando)
  if (newPassword.value) {
    if (!currentPassword.value) {
      await showAlert({ icon: 'error', title: 'Error', text: 'Debes ingresar tu contraseña actual para cambiarla.' });
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
        // Mensaje mejorado para cuando el endpoint no existe
        const errorMsg = passwordResult.message || 'No se pudo cambiar la contraseña';
        await showAlert({ 
          icon: 'warning', 
          title: 'Función no disponible', 
          text: 'El cambio de contraseña desde el perfil estará disponible próximamente.\n\nPor ahora, puedes cambiar tu contraseña usando la opción "Olvidé mi contraseña" en el login.'
        });
        return;
      }

      // Contraseña cambiada exitosamente
      await showAlert({ 
        icon: 'success', 
        title: 'Éxito', 
        text: 'Contraseña actualizada correctamente',
        autoClose: 1500
      });

      // Limpiar los campos de contraseña
      currentPassword.value = '';
      newPassword.value = '';
      
    } catch (error) {
      hideLoading();
      console.error('Error al cambiar contraseña:', error);
      await showAlert({ 
        icon: 'error', 
        title: 'Error', 
        text: 'Ocurrió un error al cambiar la contraseña'
      });
      return;
    }
  }

  // 2. Actualizar datos del perfil
  try {
    showLoading('Actualizando perfil...');
    
    const result = await updateProfile({
      userName: profileName.value.trim(),
      email: profileEmail.value.trim()
    });

    hideLoading();

    if (result.success) {
      await showAlert({ 
        icon: 'success', 
        title: 'Éxito', 
        text: 'Perfil actualizado correctamente',
        autoClose: 1500
      });
      closeProfileModal();
      
      // Recargar la página para reflejar los cambios
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      await showAlert({ 
        icon: 'error', 
        title: 'Error', 
        text: result.message || 'No se pudo actualizar el perfil'
      });
    }
  } catch (error) {
    hideLoading();
    console.error('Error al actualizar perfil:', error);
    
    // Mensaje más amigable si el endpoint no existe (404)
    const is404 = error.response?.status === 404;
    await showAlert({ 
      icon: 'warning', 
      title: is404 ? 'Función no disponible' : 'Error', 
      text: is404 
        ? 'La actualización de perfil estará disponible próximamente.\n\nPor ahora, los cambios en el perfil solo se pueden hacer contactando al administrador.'
        : 'Ocurrió un error al actualizar el perfil'
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
    this.vel = { x: randRange(-0.4, 0.4), y: randRange(-0.4, 0.4) }; 
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
onMounted(() => {
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