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
          <router-link to="/dashboard/webhooks" exact-active-class="active">
            <span>Webhooks</span>
          </router-link>
      </nav>
      
      <div class="sidebar-footer">
        
        <div class="sidebar-profile-area" @click="openProfileModal">
          <div class="profile-avatar">
            <span>J</span> </div>
          <div class="profile-info">
            <strong>{{ profileName }}</strong> <span class="profile-plan">Plan Gratuito</span>
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
      <router-view />
    </main>

    <div class="modal-overlay" v-if="isModalOpen" @click="closeProfileModal">
      <div class="modal-card" @click.stop>
        <button class="modal-close-btn" @click="closeProfileModal">×</button>
        <h2>Editar Perfil</h2>
        
        <form @submit.prevent="handleProfileUpdate" class="modal-form">
          
          <h3 class="modal-subtitle">Información de la Cuenta</h3>
          <div class="form-group">
            <label for="profile-name">Nombre de Usuario</label>
            <input type="text" id="profile-name" v-model="profileName">
          </div>
          <div class="form-group">
            <label for="profile-email">Correo</label>
            <input type="email" id="profile-email" v-model="profileEmail">
          </div>

          <h3 class="modal-subtitle">Cambiar Contraseña</h3>
          <div class="form-group">
            <label for="current-password">Contraseña Actual</label>
            <div class="password-wrapper">
              <input :type="showCurrentPassword ? 'text' : 'password'" id="current-password" v-model="currentPassword" placeholder="••••••••">
              <button type="button" class="toggle-password" @click="showCurrentPassword = !showCurrentPassword" :aria-label="showCurrentPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
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
              <input :type="showNewPassword ? 'text' : 'password'" id="new-password" v-model="newPassword" placeholder="••••••••">
              <button type="button" class="toggle-password" @click="showNewPassword = !showNewPassword" :aria-label="showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
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
            <label for="confirm-password">Confirmar Nueva Contraseña</label>
            <div class="password-wrapper">
              <input :type="showConfirmPassword ? 'text' : 'password'" id="confirm-password" v-model="confirmPassword" placeholder="••••••••">
              <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword" :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c1.83 0 3.543-.417 5.057-1.157M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.5a10.522 10.522 0 01-4.293 5.362M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.01 9.964 7.178.07.207.07.437 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-outline" @click="closeProfileModal">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar Cambios</button>
          </div>
        </form>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router'; 
import { showAlert } from '@/utils/notify';
import { logoutAndRedirect } from '@/services/authService';

// --- Lógica del Modal y Perfil ---
const isModalOpen = ref(false);

// Datos del perfil (simulados)
const profileName = ref('Jerónimo');
const profileEmail = ref('jeronimo@example.com');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const openProfileModal = () => {
  // Resetea los campos de contraseña al abrir
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
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
    // Delay para que se cierre el modal antes de mostrar la pantalla de carga
    await new Promise(resolve => setTimeout(resolve, 200));
    // Limpia credenciales y redirige al login (ya maneja showLoading internamente)
    await logoutAndRedirect(router);
  }
}

const handleProfileUpdate = async () => {
  // Lógica de actualización (simulada)
  
  // 1. Validar contraseña (si se está cambiando)
    if (newPassword.value) {
    if (newPassword.value !== confirmPassword.value) {
      showAlert({ icon: 'error', title: 'Error', text: 'Las nuevas contraseñas no coinciden.' });
      return;
    }
    if (!currentPassword.value) {
      showAlert({ icon: 'error', title: 'Error', text: 'Debes ingresar tu contraseña actual para cambiarla.' });
      return;
    }
    
    // Validar requisitos de contraseña (todos a la vez)
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
    
    console.log('Enviando cambio de contraseña...');
  }

  // 2. Enviar datos del perfil
  console.log('Actualizando perfil:', profileName.value, profileEmail.value);
  showAlert({ icon: 'success', title: 'Perfil', text: 'Perfil actualizado (simulación)' }).then(() => {
    closeProfileModal();
  });
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