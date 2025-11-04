<template>
<div class="auth-page-wrap">
    
    <div class="canvas-container-bg" ref="container">
    <canvas ref="canvas" class="w-full h-full"></canvas>
    </div>
    
    <router-link to="/" class="btn-back-home">← Back to Home</router-link>
    
    <div class="auth-card">
    
    <div class="logo">
        <div class="logo-icon"></div>
        <strong>DBFlow Register</strong>
    </div>

    <h2 class="auth-title">Create Account</h2>
    <p class="auth-subtitle">Start managing your databases now.</p>

    <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
        <label for="name">Full Name</label>
        <input type="text" id="name" v-model="name" required placeholder="John Doe">
        </div>

        <div class="form-group">
        <label for="email">Correo</label>
        <input type="email" id="email" v-model="email" required placeholder="nombre@ejemplo.com">
        </div>
        
        <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" v-model="password" required placeholder="••••••••">
        </div>

        <button type="submit" class="btn-primary btn-full-width" :disabled="isLoading">
            {{ isLoading ? 'Registrando...' : 'Registrarse' }}
        </button>
    </form>
    
    <p class="auth-footer-text">
        ¿Ya tienes una cuenta?
        <router-link to="/login" class="link-secondary">Iniciar Sesión</router-link>
    </p>

    </div>
</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink, useRouter } from 'vue-router'; 
import { register } from '@/services/authService';

const router = useRouter();

// --- Variables del Formulario ---
const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
    errorMessage.value = '';
    isLoading.value = true;
    
    try {
        const result = await register({
            name: name.value,
            email: email.value,
            password: password.value
        });
        
        if (result.success) {
            alert(result.message);
            // Redirigir a la página de verificación de email
            router.push('/verify-email');
        } else {
            errorMessage.value = result.message;
            alert(result.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        errorMessage.value = 'Error al conectar con el servidor';
        alert('Error al conectar con el servidor');
    } finally {
        isLoading.value = false;
    }
};

// --- LÓGICA DE PARTÍCULAS (Interactiva y Rápida) ---
const canvas = ref(null);
const container = ref(null);
let animationId = null;
let particles = [];
let cw, ch;
const NUM_PARTICLES = 120; 
const MAX_CONNECTION_DISTANCE = 100;

// 🚨 NUEVO: Objeto para rastrear el ratón
const mouse = {
    x: 9999,
    y: 9999,
    radius: 70 // Radio de la "burbuja" de repulsión
};

function randRange(a, b) { return a + Math.random() * (b - a); }

class Particle {
  constructor(x, y) {
    this.pos = { x, y };
    // 🔑 CORRECCIÓN: Aumentamos la velocidad base (antes -0.1 a 0.1)
    this.vel = { x: randRange(-0.4, 0.4), y: randRange(-0.4, 0.4) }; 
    this.colorWeight = randRange(0.15, 0.45); 
    this.size = randRange(0.8, 2.5);
  }
  
  move() {
    // 1. 🚨 NUEVO: Repulsión del Ratón
    const dx_mouse = this.pos.x - mouse.x;
    const dy_mouse = this.pos.y - mouse.y;
    const dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);

    if (dist_mouse < mouse.radius) {
        const angle = Math.atan2(dy_mouse, dx_mouse);
        const repelForce = (mouse.radius - dist_mouse) / mouse.radius; // Fuerza basada en la cercanía
        
        // Aplicamos la fuerza de repulsión
        this.vel.x += Math.cos(angle) * repelForce * 0.8; // 0.8 = Fuerza
        this.vel.y += Math.sin(angle) * repelForce * 0.8;
    }
    
    // 2. 🚨 NUEVO: Fricción (para que el efecto del ratón no sea infinito)
    this.vel.x *= 0.98; // 0.98 es fricción ligera
    this.vel.y *= 0.98;
    
    // 3. Movimiento base
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    // 4. Reinicio en bordes
    if (this.pos.x < -10) this.pos.x = cw + 10;
    if (this.pos.x > cw + 10) this.pos.x = -10;
    if (this.pos.y < -10) this.pos.y = ch + 10;
    if (this.pos.y > ch + 10) this.pos.y = -10;
  }
  
  draw(ctx) {
    ctx.beginPath();
    // 🔑 PUEDES CAMBIAR EL COLOR AQUÍ (ej. 0, 191, 255 para cian)
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

// 🚨 NUEVO: Manejador del movimiento del ratón
function handleMouseMove(e) {
    // Usamos clientX/Y porque el canvas cubre todo el viewport
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

// --- Ciclo de Vida ---
let onResizeHandler = null; 

onMounted(() => {
    const c = canvas.value;
    if (!c) return;
    
    initCanvas(c);

    onResizeHandler = () => {
        resizeCanvas(c);
    };
    window.addEventListener('resize', onResizeHandler);
    
    // 🚨 NUEVO: Añadimos el listener del ratón
    window.addEventListener('mousemove', handleMouseMove);
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    if (onResizeHandler) {
        window.removeEventListener('resize', onResizeHandler);
    }
    // 🚨 NUEVO: Limpiamos el listener del ratón
    window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped>
/* Aseguramos que los estilos de la tarjeta Auth.css se importen/apliquen */
@import '../assets/Auth.css';

/* Estilos específicos para el fondo del canvas */
.canvas-container-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1; /* Fondo, debajo de la tarjeta */
    pointer-events: none; /* Permite clics a través del canvas */
}

/* Elevamos la tarjeta para que quede por encima del canvas */
.auth-card {
    position: relative;
    z-index: 10;
}
</style>