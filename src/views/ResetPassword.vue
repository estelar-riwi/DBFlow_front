<template>
  <div class="auth-page-wrap">
    
    <div class="canvas-container-bg" ref="container">
      <canvas ref="canvas" class="w-full h-full"></canvas>
    </div>
    
    <router-link to="/" class="btn-back-home">← Volver al Inicio</router-link>
    
    <div class="auth-card">
      <div class="logo">
        <div class="logo-icon"></div>
        <strong>DBFlow</strong>
      </div>

      <h2 class="auth-title">Restablecer Contraseña</h2>
      <p class="auth-subtitle">Ingresa tu nueva contraseña.</p>

      <form @submit.prevent="handleResetPassword" class="auth-form">
        
        <div class="form-group">
          <label for="newPassword">Nueva Contraseña</label>
          <input 
            type="password" 
            id="newPassword" 
            v-model="newPassword" 
            required 
            placeholder="••••••••"
            minlength="6"
          >
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required 
            placeholder="••••••••"
            minlength="6"
          >
        </div>
        
        <button type="submit" class="btn-primary btn-full-width" :disabled="isLoading">
          {{ isLoading ? 'Restableciendo...' : 'Restablecer Contraseña' }}
        </button>
      </form>
      
      <p class="auth-footer-text">
        ¿Recordaste tu contraseña?
        <router-link to="/login" class="link-secondary">Inicia Sesión</router-link>
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router'; 
import { resetPassword } from '@/services/authService';

const route = useRoute();
const router = useRouter();

// --- Variables del Formulario ---
const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const token = ref('');

// Obtener el token de la URL
onMounted(() => {
  token.value = route.query.token || '';
  
  if (!token.value) {
    alert('Token de restablecimiento inválido o expirado');
    router.push('/forgot-password');
  }
  
  // Inicializar canvas
  const c = canvas.value;
  if (!c) return;
  
  initCanvas(c);

  onResizeHandler = () => {
    resizeCanvas(c);
  };
  window.addEventListener('resize', onResizeHandler);
  window.addEventListener('mousemove', handleMouseMove);
});

const handleResetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('Las contraseñas no coinciden');
    return;
  }
  
  if (newPassword.value.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres');
    return;
  }
  
  isLoading.value = true;
  
  try {
    const result = await resetPassword({
      token: token.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value
    });
    
    if (result.success) {
      alert(result.message);
      router.push('/login');
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error during password reset:', error);
    alert('Error al conectar con el servidor');
  } finally {
    isLoading.value = false;
  }
};

// --- LÓGICA DE PARTÍCULAS (Campo Estelar Dinámico) ---
const canvas = ref(null);
const container = ref(null);
let animationId = null;
let particles = [];
let cw, ch;
const NUM_PARTICLES = 120;
const MAX_CONNECTION_DISTANCE = 100;

const mouse = {
  x: 9999,
  y: 9999,
  radius: 70
};

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

// --- Ciclo de Vida ---
let onResizeHandler = null; 

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  if (onResizeHandler) {
    window.removeEventListener('resize', onResizeHandler);
  }
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped>
@import '../assets/Auth.css';

.canvas-container-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.auth-card {
  position: relative;
  z-index: 10;
}
</style>
