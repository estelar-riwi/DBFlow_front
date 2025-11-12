<    <template>
<div class="auth-page-wrap fade-in-view">
    
    <div class="canvas-container-bg" ref="container">
    <canvas ref="canvas" class="w-full h-full"></canvas>
    </div>
    
    <router-link to="/" class="btn-back-home stagger-item" style="--stagger-index: 0">← Volver al Inicio</router-link>
    
    <div class="auth-card stagger-item" style="--stagger-index: 1">
    <div class="logo">
        <div class="logo-icon"></div>
        <strong>DBFlow Login</strong>
    </div>

    <h2 class="auth-title">Bienvenido</h2>
    <p class="auth-subtitle">Inicia sesión para gestionar tus bases de datos.</p>

    <form @submit.prevent="handleLogin" class="auth-form" novalidate>
        <div class="form-group stagger-child" style="--child-index: 0">
        <label for="email">Correo</label>
        <input type="email" id="email" v-model="email" required placeholder="nombre@ejemplo.com">
        </div>
        
        <div class="form-group stagger-child" style="--child-index: 1">
        <label for="password">Contraseña</label>
        <div class="password-wrapper">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" required placeholder="••••••••">
                        <button type="button" class="toggle-password" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c1.83 0 3.543-.417 5.057-1.157M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.5a10.522 10.522 0 01-4.293 5.362M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.88 9.88" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.64 0 8.577 3.01 9.964 7.178.07.207.07.437 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
        </div>
        </div>

        <div class="form-extra stagger-child" style="--child-index: 2">
            <router-link to="/forgot-password" class="link-secondary link-forgot">
                ¿Olvidaste tu contraseña?
            </router-link>
        </div>

        <button type="submit" class="btn-primary btn-full-width stagger-child" style="--child-index: 3" :disabled="isLoading">
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
        </button>
    </form>
    
    <p class="auth-footer-text stagger-child" style="--child-index: 4">
        ¿No tienes una cuenta?
        <router-link to="/register" class="link-secondary">Regístrate</router-link>
    </p>

    </div>
</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { showAlert } from '@/utils/notify';
import { RouterLink, useRouter } from 'vue-router'; 
import { login } from '@/services/authService';
import { showLoading, hideLoading } from '@/store/loading';

const router = useRouter();

// --- Variables del Formulario ---
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
    errorMessage.value = '';
    isLoading.value = true;
    try { showLoading(); } catch (e) {}

    try {
        const result = await login({
            email: email.value,
            password: password.value
        });

        if (result.success) {
            // Ocultar loading antes de mostrar el modal de éxito
            try { hideLoading(); } catch (e) {}
            
            // Verificar que el token se guardó
            const tokenGuardado = localStorage.getItem('authToken');
            console.log('🔍 Verificación post-login - Token guardado:', tokenGuardado ? 'SÍ' : 'NO');
            
            // Alerta de éxito que se cierra automáticamente en 1.5 segundos
            showAlert({ 
                icon: 'success', 
                title: 'Bienvenido', 
                text: result.message,
                autoClose: 1500 
            });
            
            // Esperar un poco más para asegurar que el token esté disponible
            await new Promise(resolve => setTimeout(resolve, 1700));
            
            // Redirigir al dashboard
            router.push('/dashboard');
        } else {
            // Ocultar loading antes de mostrar error
            try { hideLoading(); } catch (e) {}
            
            // Verificar si el error es por email no verificado
            if (result.emailNotVerified) {
                // Guardar el email temporalmente para la página de verificación
                localStorage.setItem('unverified_email', result.email || email.value);
                
                await showAlert({ 
                    icon: 'warning', 
                    title: 'Email No Verificado', 
                    text: 'Tu cuenta existe pero aún no has verificado tu correo electrónico. Te redirigiremos a la página de verificación.',
                    confirmText: 'Continuar',
                    autoClose: 3000
                });
                
                // Esperar un poco y redirigir a verificación
                await new Promise(resolve => setTimeout(resolve, 3000));
                router.push('/verify-email');
            } else {
                // Error normal (credenciales incorrectas, etc.)
                errorMessage.value = result.message;
                await showAlert({ icon: 'error', title: 'Error', text: result.message });
            }
        }
    } catch (error) {
        console.error('Error during login:', error);
        try { hideLoading(); } catch (e) {}
        errorMessage.value = 'Error al conectar con el servidor';
        await showAlert({ icon: 'error', title: 'Error', text: 'Error al conectar con el servidor' });
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
    // Aumentamos la velocidad base para movimiento constante más visible
    this.vel = { x: randRange(-0.8, 0.8), y: randRange(-0.8, 0.8) }; 
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

/* ========================================================================= */
/* =================== ANIMACIONES DE ENTRADA ESCALONADA =================== */
/* ========================================================================= */

/* Contenedor principal con fade-in */
.fade-in-view {
  animation: viewFadeIn 0.6s ease-out;
}

@keyframes viewFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Elementos con animación escalonada */
.stagger-item {
  opacity: 0;
  transform: translateY(20px);
  animation: staggerFadeIn 0.6s ease-out forwards;
  animation-delay: calc(var(--stagger-index) * 0.15s);
}

@keyframes staggerFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hijos con animación escalonada (campos del formulario) */
.stagger-child {
  opacity: 0;
  transform: translateY(15px);
  animation: staggerChildFadeIn 0.5s ease-out forwards;
  animation-delay: calc(0.3s + (var(--child-index) * 0.1s));
}

@keyframes staggerChildFadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>>