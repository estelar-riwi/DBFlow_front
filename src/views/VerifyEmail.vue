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

    <h2 class="auth-title">Verifica tu Correo</h2>
    <p class="auth-subtitle">
        Hemos enviado un enlace de verificación a tu correo. Por favor, revisa tu bandeja de entrada (y spam).
    </p>

    <form @submit.prevent="handleResend" class="auth-form">
        
        <button type="submit" class="btn-primary btn-full-width">Reenviar Correo</button>
    </form>
    
    <p class="auth-footer-text">
        ¿Ya verificaste?
        <router-link to="/login" class="link-secondary">Inicia Sesión</router-link>
    </p>

    </div>
</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterLink } from 'vue-router'; 

// --- Variables del Formulario ---
const handleResend = () => {
    // Aquí iría tu lógica para reenviar el correo
    console.log('Attempting to resend email...');
    alert('Correo de verificación reenviado.');
};

// --- LÓGICA DE PARTÍCULAS (Interactiva y Rápida) ---
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
    // Repulsión del Ratón
    const dx_mouse = this.pos.x - mouse.x;
    const dy_mouse = this.pos.y - mouse.y;
    const dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);

    if (dist_mouse < mouse.radius) {
        const angle = Math.atan2(dy_mouse, dx_mouse);
        const repelForce = (mouse.radius - dist_mouse) / mouse.radius;
        this.vel.x += Math.cos(angle) * repelForce * 0.8;
        this.vel.y += Math.sin(angle) * repelForce * 0.8;
    }
    
    // Fricción
    this.vel.x *= 0.98;
    this.vel.y *= 0.98;
    
    // Movimiento base
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    // Reinicio en bordes
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

onMounted(() => {
    const c = canvas.value;
    if (!c) return;
    
    initCanvas(c);

    onResizeHandler = () => {
        resizeCanvas(c);
    };
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
/* Importamos los mismos estilos que Login/Register */
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