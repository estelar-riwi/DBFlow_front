<template>
<div class="auth-page-wrap">
    
    <div class="canvas-container-bg" ref="container">
    <canvas ref="canvas" class="w-full h-full"></canvas>
    </div>
    
    <router-link to="/" class="btn-back-home">← Back to Home</router-link>
    
    <div class="auth-card">
    <div class="logo">
        <div class="logo-icon"></div>
        <strong>DBFlow Login</strong>
    </div>

    <h2 class="auth-title">Welcome Back</h2>
    <p class="auth-subtitle">Sign in to manage your databases.</p>

    <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" v-model="email" required placeholder="name@example.com">
        </div>
        
        <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required placeholder="••••••••">
        </div>

        <button type="submit" class="btn-primary btn-full-width">Sign In</button>
    </form>
    
    <p class="auth-footer-text">
        Don't have an account? 
        <router-link to="/register" class="link-secondary">Register here</router-link>
    </p>

    </div>
</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink } from 'vue-router'; 

// --- Variables del Formulario ---
const email = ref('');
const password = ref('');
const handleLogin = () => {
    console.log('Attempting login with:', email.value, password.value);
    alert(`Login: ${email.value}`);
};

// --- LÓGICA DE PARTÍCULAS (Campo Estelar Dinámico) ---
const canvas = ref(null);
const container = ref(null);
let animationId = null;
let particles = [];
let cw, ch;
const NUM_PARTICLES = 120; // Cantidad óptima para un fondo sutil
const MAX_CONNECTION_DISTANCE = 100; // Máx. distancia para dibujar líneas

function randRange(a, b) { return a + Math.random() * (b - a); }

class Particle {
constructor(x, y) {
    this.pos = { x, y };
    // 🔑 Movimiento simple: Velocidad inicial baja y constante
    this.vel = { x: randRange(-0.1, 0.1), y: randRange(-0.1, 0.1) }; 
    this.colorWeight = randRange(0.15, 0.45); // Partículas muy sutiles
    this.size = randRange(0.8, 2.5);
}

move() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    // Reinicio de la partícula al salir de los bordes (Mantiene el flujo)
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
                // Líneas muy sutiles, pero visibles
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

    // Fondo semi-transparente para la estela: Mantiene el color oscuro
    ctx.fillStyle = 'rgba(0,0,0,0.1)'; 
    ctx.fillRect(0, 0, cw, ch);

    // Dibujar conexiones y partículas
    drawConnections(ctx);
    particles.forEach(p => {
        p.move();
        p.draw(ctx);
    });

    animationId = requestAnimationFrame(animateLoop);
}

function initCanvas(c) {
    resizeCanvas(c);
    // Inicializar partículas en posiciones aleatorias
    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push(new Particle(randRange(0, cw), randRange(0, ch)));
    }
    animateLoop();
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
});

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    if (onResizeHandler) {
        window.removeEventListener('resize', onResizeHandler);
    }
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