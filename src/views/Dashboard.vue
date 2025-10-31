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
          <router-link to="/dashboard/billing" exact-active-class="active">
            <span>Plan y Facturación</span>
          </router-link>
          <router-link to="/dashboard/webhooks" exact-active-class="active">
            <span>Webhooks</span>
          </router-link>
          <router-link to="/dashboard/profile" exact-active-class="active">
            <span>Perfil</span>
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

        <router-link to="/" class="btn-back-home-sidebar">
          ← Volver al Inicio
        </router-link>
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
            <input type="password" id="current-password" v-model="currentPassword" placeholder="••••••••">
          </div>
          <div class="form-group">
            <label for="new-password">Nueva Contraseña</label>
            <input type="password" id="new-password" v-model="newPassword" placeholder="••••••••">
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirmar Nueva Contraseña</label>
            <input type="password" id="confirm-password" v-model="confirmPassword" placeholder="••••••••">
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
import { RouterLink, RouterView } from 'vue-router'; 

// --- Lógica del Modal y Perfil ---
const isModalOpen = ref(false);

// Datos del perfil (simulados)
const profileName = ref('Jerónimo');
const profileEmail = ref('jeronimo@example.com');
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

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

const handleProfileUpdate = () => {
  // Lógica de actualización (simulada)
  
  // 1. Validar contraseña (si se está cambiando)
  if (newPassword.value) {
    if (newPassword.value !== confirmPassword.value) {
      alert('Las nuevas contraseñas no coinciden.');
      return;
    }
    if (!currentPassword.value) {
      alert('Debes ingresar tu contraseña actual para cambiarla.');
      return;
    }
    console.log('Enviando cambio de contraseña...');
  }

  // 2. Enviar datos del perfil
  console.log('Actualizando perfil:', profileName.value, profileEmail.value);
  alert('Perfil actualizado (simulación)');
  
  closeProfileModal();
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