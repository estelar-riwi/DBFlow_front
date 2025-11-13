<template>
  <div>
    <header 
      class="main-header"
      :class="{ 'header-hidden': !showHeader }"
    >
    <div class="logo">
    <img src="/logos/logo.ico" alt="DBFlow Logo" class="new-logo-icon">
    DBFlow
    </div>

      <nav class="main-nav">
        <a href="#hero-section" @click="smoothScrollToSection" :class="{ 'active': activeSection === 'hero-section' }">Inicio</a>
        <a href="#features-section" @click="smoothScrollToSection" :class="{ 'active': activeSection === 'features-section' }">Funcionalidades</a>
        <a href="#pricing-section" @click="smoothScrollToSection" :class="{ 'active': activeSection === 'pricing-section' }">Precios</a>
        <a href="#faq-section" @click="smoothScrollToSection" :class="{ 'active': activeSection === 'faq-section' }">Preguntas</a>
      </nav>
      <div class="auth-buttons">
        
        <router-link to="/login" custom v-slot="{ navigate }">
          <a @click="navigate" role="link" class="btn-signin">Iniciar Sesión</a>
        </router-link>

        <router-link to="/register" custom v-slot="{ navigate }">
          <a @click="navigate" role="link" class="btn-primary">Empieza ahora</a>
        </router-link>
      </div>
    </header>

    <section class="hero-wrap" id="hero-section" ref="heroSection">
      <div class="canvas-container" ref="container">
        <canvas ref="canvas" class="w-full h-full"></canvas>
      </div>

      <div class="hero-main-content">
        <h1 class="main-title">El futuro de la gestión de bases de datos</h1>
        <p class="main-subtitle">Una forma nueva, más rápida e inteligente de interactuar con tus datos.</p>
        <router-link to="/register" custom v-slot="{ navigate }">
          <button class="btn-primary-large" @click="navigate">Empieza ahora</button>
        </router-link>
      </div>

      <div class="hero-footer-content">
        <div class="logo-carousel-wrap">
          <span>Servicios</span>
          <div class="logo-track-container">
            <div class="logo-track">
              <div class="logo-item">MySQL</div>
              <div class="logo-item">PostgreSQL</div>
              <div class="logo-item">MongoDB</div>
              <div class="logo-item">SQL Server</div>
              <div class="logo-item">Cassandra</div>
              
              <div class="logo-item">MySQL</div>
              <div class="logo-item">PostgreSQL</div>
              <div class="logo-item">MongoDB</div>
              <div class="logo-item">SQL Server</div>
              <div class="logo-item">Cassandra</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section class="features-section" id="features-section" ref="featuresSection">
      <h2 class="section-title">Funcionalidades Esenciales</h2>
      <p class="section-subtitle">
          La automatización que tu gestión de bases de datos necesita para pasar al siguiente nivel.
      </p>
      <div class="features-grid">
        
    <div class="feature-card reveal-on-scroll">
            <h4>Monitoreo y Analíticas</h4>
            <h3>Insights Instantáneos</h3>
            <p>Optimiza con métricas de rendimiento y consumo de recursos de tus DBs en tiempo real.</p>
        </div>

    <div class="feature-card reveal-on-scroll">
            <h4>Administración de Equipos</h4>
            <h3>Colaboración Fluida</h3>
            <p>Gestiona y escala todas tus bases de datos (MySQL, Mongo, etc.) de manera centralizada.</p>
        </div>

    <div class="feature-card reveal-on-scroll">
            <h4>Disponibilidad Máxima</h4>
            <h3>99.9%</h3>
            <p>Garantía de alta disponibilidad para mantener tus aplicaciones siempre operativas.</p>
        </div>

    <div class="feature-card reveal-on-scroll">
            <h4>Seguridad Aislada</h4>
            <h3>Blindaje Empresarial</h3>
            <p>Cifrado de extremo a extremo, aislamiento total y seguridad garantizada por **JWT**.</p>
        </div>
        
    <div class="feature-card reveal-on-scroll">
            <h4>Escalabilidad y Acceso</h4>
            <h3>Despliegue Global</h3>
            <p>Infraestructura global para que accedas a tu panel **DBflow** desde cualquier lugar.</p>
        </div>
      </div>
    </section>
    
    <section class="pricing-section" id="pricing-section" ref="pricingSection">
      <h2 class="section-title">Precios Simples y Transparentes</h2>
      <p class="section-subtitle">
          Elige el plan perfecto para escalar tus bases de datos en la nube. Sin cargos ocultos, solo gestión pura.
      </p>
      <div class="pricing-cards">
        
    <div class="pricing-card reveal-on-scroll">
            <div class="card-header">
                <h3>Plan Gratuito</h3>
                <div class="price-badge">
                    <span class="currency">$</span>
                    <span class="amount">0</span>
                    <span class="period">/siempre</span>
                </div>
            </div>
            <p class="card-description">Perfecto para proyectos personales y pruebas iniciales.</p>
            <ul class="features-list">
                <li><span class="check-icon">✓</span>2 Bases de Datos por gestor</li>
                <li><span class="check-icon">✓</span>6 Gestores soportados (MySQL, PostgreSQL, MongoDB, SQL Server, Redis, Cassandra)</li>
                <li><span class="check-icon">✓</span>Hasta 12 bases de datos en total</li>
                <li><span class="check-icon">✓</span>Generación automática de credenciales</li>
                <li><span class="check-icon">✓</span>Autenticación segura JWT</li>
            </ul>
            <router-link to="/register" class="btn-pricing">Registrarse Gratis →</router-link>
        </div>

    <div class="pricing-card popular reveal-on-scroll">
            <div class="popular-badge">Más Popular</div>
            <div class="card-header">
                <h3>Plan Intermedio</h3>
                <div class="price-badge">
                    <span class="currency">$</span>
                    <span class="amount">5.000</span>
                    <span class="period">/mes COP</span>
                </div>
            </div>
            <p class="card-description">Ideal para pequeños equipos y aplicaciones en crecimiento.</p>
            <ul class="features-list">
                <li><span class="check-icon">✓</span>5 Bases de Datos por gestor</li>
                <li><span class="check-icon">✓</span>Hasta 30 bases de datos en total</li>
                <li><span class="check-icon">✓</span>Todos los gestores disponibles</li>
                <li><span class="check-icon">✓</span>Gestión centralizada del ciclo de vida</li>
                <li><span class="check-icon">✓</span>Panel de control avanzado</li>
            </ul>
            <button class="btn-pricing popular-btn">Suscribirse →</button>
        </div>

    <div class="pricing-card reveal-on-scroll">
            <div class="card-header">
                <h3>Plan Avanzado</h3>
                <div class="price-badge">
                    <span class="currency">$</span>
                    <span class="amount">10.000</span>
                    <span class="period">/mes COP</span>
                </div>
            </div>
            <p class="card-description">La solución completa para desarrolladores y proyectos de alta demanda.</p>
            <ul class="features-list">
                <li><span class="check-icon">✓</span>10 Bases de Datos por gestor</li>
                <li><span class="check-icon">✓</span>Hasta 60 bases de datos en total</li>
                <li><span class="check-icon">✓</span>Gestión completa del ciclo de vida (CRUD)</li>
                <li><span class="check-icon">✓</span>Visualización de credenciales seguras</li>
                <li><span class="check-icon">✓</span>Todos los beneficios del Plan Intermedio</li>
            </ul>
            <button class="btn-pricing">Suscribirse →</button>
        </div>
        
      </div>
    </section>

    <section class="faq-section" id="faq-section" ref="faqSection">
      <h2 class="section-title">Preguntas Frecuentes</h2>
      <p class="section-subtitle">
          Todo lo que necesitas saber sobre DBflow. ¿No encuentras lo que buscas? Contacta a nuestro equipo de soporte.
      </p>
      <div class="faq-list">
        
        <details class="reveal-on-scroll">
            <summary>¿Qué es DBflow y qué gestores de bases de datos soporta?</summary>
            <p>DBflow es una plataforma cloud para la gestión automatizada de bases de datos que te permite crear, administrar y escalar instancias de gestores populares como MySQL, PostgreSQL, MongoDB, SQL Server, Redis y Cassandra de manera centralizada.</p>
        </details>
        
        <details class="reveal-on-scroll">
            <summary>¿Puedo probar DBflow antes de comprometerme con un plan de pago?</summary>
            <p>¡Sí! Al registrarte, accedes automáticamente al Plan Gratuito, que te permite crear y mantener activas hasta dos bases de datos por cada gestor (hasta 12 DBs en total) sin costo ni tarjeta de crédito.</p>
        </details>
        
        <details class="reveal-on-scroll">
            <summary>¿Qué tan segura es mi información y cómo se aíslan mis bases de datos en DBflow?</summary>
            <p>Garantizamos seguridad blindada y aislamiento de datos entre clientes. Usamos cifrado de extremo a extremo, JWT (JSON Web Token) para la autenticación y generamos credenciales únicas y aisladas para cada instancia de base de datos que creas.</p>
        </details>
        
        <details class="reveal-on-scroll">
            <summary>¿Puedo cambiar o cancelar mi plan de membresía en cualquier momento?</summary>
            <p>Absolutamente. Puedes actualizar o cancelar tu suscripción en cualquier momento desde el panel de control. Todos los pagos y la gestión de membresías se procesan de forma segura a través de Mercado Pago.</p>
        </details>
        
      </div>
    </section>

    <section class="cta-section">
      
      <!-- Converging Lines Effect for CTA Section -->

      <ConvergingLines />
      
      <div class="cta-content">
        <h2>¿Listo para Transformar tu Gestión de DBs?</h2>
        
        <p>Únete a cientos de desarrolladores y empresas que ya usan CCD para automatizar la creación y escalabilidad de sus bases de datos en la nube.</p>
        
        <div class="cta-buttons">
            <a href="/register" class="btn-primary">Comienza con el Plan Gratuito</a>
            
            <a href="#pricing-section" @click="smoothScrollToSection" class="btn-primary">Ver Planes y Precios</a>
        </div>
      </div>
    </section>
    <footer class="main-footer" id="footer-section" ref="footerSection">
    <div class="footer-top-content">
      <!-- Columna de marca -->
      <div class="footer-brand">
        <div class="brand-row">
        <img src="/logos/logo.ico" alt="DBFlow" class="footer-logo" />
        <strong>DBFlow</strong>
        </div>
        <p class="brand-desc">Potenciando negocios con soluciones de automatización de bases de datos de vanguardia.</p>
        <p class="quote">"Toma el control de tu éxito con DBFlow."</p>
        
        <!-- Redes sociales -->
        <div class="social-links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          </a>
        </div>
      </div>
          
      <!-- Navegación -->
      <div class="footer-links">
        <div class="footer-col">
          <h4>Navegación</h4>
          <a href="#hero-section" @click="smoothScrollToSection">Inicio</a>
          <a href="#features-section" @click="smoothScrollToSection">Funcionalidades</a>
          <a href="#pricing-section" @click="smoothScrollToSection">Precios</a>
          <a href="#faq-section" @click="smoothScrollToSection">Preguntas</a>
        </div>
        
        <div class="footer-col">
          <h4>Recursos</h4>
          <router-link to="/documentation">Documentación</router-link>
          <a href="#faq-section" @click="smoothScrollToSection">Soporte</a>
        </div>
        
        <div class="footer-col">
          <h4>Legal</h4>
          <router-link to="/terms-of-service">Términos de Servicio</router-link>
          <router-link to="/privacy-policy">Política de Privacidad</router-link>
        </div>
      </div>
    </div>

    <div class="footer-divider"></div>
      
    <p class="copyright">
      © 2025 DBFlow. Todos los derechos reservados.
    </p>
  </footer>
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ConvergingLines from '../components/ConvergingLines.vue'

// --- SCRIPT DEL HOME (CANVAS) ---
// ... (Toda tu lógica de Partículas, Clases, y Canvas se mantiene igual) ...
// (Particle, randRange, resizeCanvas, drawTextToOffscreen, generateParticlesFromText, animateLoop)
const props = defineProps({
  words: {
    type: Array,
    default: () => ["DBFlow", "Databases"]
  }
})

const canvas = ref(null)
const container = ref(null)
let animationId = null
let particles = []
let frameCount = 0
let wordIndex = 0
const mouse = { x: 0, y: 0, isPressed: false, isRightClick: false }
const pixelSteps = 6 
const drawAsPoints = true

function randRange(a, b) { return a + Math.random() * (b - a) }

class Particle {
  constructor(x = 0, y = 0) {
    this.pos = { x, y }
    this.vel = { x: 0, y: 0 }
    this.acc = { x: 0, y: 0 }
    this.target = { x: 0, y: 0 }
    this.mass = 1
    this.colorWeight = 0
    this.isKilled = false
    this.size = 1
  }
  
  move() {
    const tx = this.target.x - this.pos.x
    const ty = this.target.y - this.pos.y
    const dist = Math.sqrt(tx * tx + ty * ty) || 1
    const forceMag = Math.min(dist * 0.015, 10)
    const fx = (tx / dist) * forceMag
    const fy = (ty / dist) * forceMag
    this.acc.x = fx / this.mass
    this.acc.y = fy / this.mass
    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.vel.x *= 0.94
    this.vel.y *= 0.94
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
  }
  
  draw(ctx, asPoints = true) {
    if (asPoints) {
      ctx.beginPath()
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0.05, Math.min(1, this.colorWeight))})`
      ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillStyle = `rgba(255,255,255,${this.colorWeight})`
      ctx.fillRect(this.pos.x, this.pos.y, this.size * 2, this.size * 2)
    }
  }
  setTarget(x, y) { this.target.x = x; this.target.y = y }
  kill(w, h) {
    this.isKilled = true
    this.target.x = Math.random() * w
    this.target.y = h + 200 + Math.random() * 200
  }
}

let cw, ch;
function resizeCanvas(c) {
  if (!container.value) return; 
  const rect = container.value.getBoundingClientRect()
  cw = rect.width
  ch = rect.height
  const dpr = window.devicePixelRatio || 1
  
  c.width = Math.floor(cw * dpr)
  c.height = Math.floor(ch * dpr)
  c.style.width = cw + 'px'
  c.style.height = ch + 'px'
  
  const ctx = c.getContext('2d')
  ctx && ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  
  return ctx
}

function drawTextToOffscreen(ctx, text, width, height) {
  const fontSize = Math.floor(Math.min(width, height) * 0.15)
  ctx.clearRect(0,0,width,height)
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${fontSize}px sans-serif`
  ctx.fillText(text, width / 2, height / 2)
}

function generateParticlesFromText(c, pixelStep = 6) {
  const off = document.createElement('canvas')
  off.width = cw 
  off.height = ch
  const ctx = off.getContext('2d', { willReadFrequently: true }) 
  if (!ctx) return;

  drawTextToOffscreen(ctx, props.words[wordIndex % props.words.length], off.width, off.height)
  
  const img = ctx.getImageData(0,0,off.width, off.height)
  const newTargets = []
  
  for (let y = 0; y < off.height; y += pixelStep) {
    for (let x = 0; x < off.width; x += pixelStep) {
      const idx = (y * off.width + x) * 4
      const alpha = img.data[idx + 3]
      if (alpha > 100) { 
        newTargets.push({ x: x, y: y }) 
      }
    }
  }

  if (newTargets.length > particles.length) {
    const add = newTargets.length - particles.length
    for (let i = 0; i < add; i++) {
      // 🌟 NUEVO: Partículas vienen desde todas direcciones (efecto radial)
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.max(cw, ch) * 0.8; // Distancia desde el centro
      const centerX = cw / 2;
      const centerY = ch / 2;
      const startX = centerX + Math.cos(angle) * distance;
      const startY = centerY + Math.sin(angle) * distance;
      
      const p = new Particle(startX, startY);
      p.size = Math.max(0.8, pixelStep / 5);
      // Añadir velocidad inicial hacia el centro
      p.vel.x = -Math.cos(angle) * (15 + Math.random() * 10);
      p.vel.y = -Math.sin(angle) * (15 + Math.random() * 10);
      particles.push(p)
    }
  }

  for (let i = 0; i < newTargets.length; i++) {
    const p = particles[i]
    const t = newTargets[i]
    // Añadir impulso adicional para efecto de convergencia
    const dx = t.x - p.pos.x;
    const dy = t.y - p.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    p.vel.x += (dx / dist) * (10 + Math.random() * 15);
    p.vel.y += (dy / dist) * (10 + Math.random() * 15);
    p.setTarget(t.x, t.y)
    p.isKilled = false
    p.colorWeight = 1
  }

  for (let i = newTargets.length; i < particles.length; i++) {
    particles[i].kill(cw, ch)
  }
}

function animateLoop() {
  const c = canvas.value
  if (!c) {
    animationId = requestAnimationFrame(animateLoop);
    return;
  }
  const ctx = c.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = 'rgba(0,0,0,0.05)' // Efecto de estela
  ctx.fillRect(0,0, cw, ch)

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.move()
    p.draw(ctx, drawAsPoints)
    if (p.isKilled && p.pos.y > ch + 300) {
      particles.splice(i,1)
    }
  }

  frameCount++
  if (frameCount % 240 === 0) {
    wordIndex++
    generateParticlesFromText(c, pixelSteps)
  }
  animationId = requestAnimationFrame(animateLoop)
}


// --- LÓGICA DEL HEADER INTELIGENTE (SMART HEADER) ---
const showHeader = ref(true) 
let lastScrollY = 0 
const SCROLL_DOWN_THRESHOLD = 50 
const SCROLL_UP_THRESHOLD = 200 

function handleScroll() {
  const currentScrollY = window.scrollY
  const isScrollingDown = currentScrollY > lastScrollY
  
  if (isScrollingDown && currentScrollY > SCROLL_DOWN_THRESHOLD) {
    showHeader.value = false
  } else if (!isScrollingDown || currentScrollY < SCROLL_UP_THRESHOLD) {
    showHeader.value = true
  }

  lastScrollY = currentScrollY
}
// ----------------------------------------------------

// --- SMOOTH SCROLL CON OFFSET DINÁMICO ---
function getScrollOffset() {
  const header = document.querySelector('.main-header')
  if (!header) return 120
  
  // Obtiene la altura real del header + el top (15px) + margen adicional
  const headerHeight = header.offsetHeight
  const headerTop = 15
  const extraMargin = 20
  
  return headerHeight + headerTop + extraMargin
}

function smoothScrollToSection(event) {
  event.preventDefault()
  const targetId = event.currentTarget.getAttribute('href')
  const targetElement = document.querySelector(targetId)
  
  if (targetElement) {
    const headerOffset = getScrollOffset()
    const elementPosition = targetElement.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}
// ----------------------------------------------------


// --- LÓGICA DE SCROLL SPY (ACTUALIZADA) ---
const activeSection = ref(null) 

// 🔑 CORRECCIÓN: Añadimos la ref para el Hero
const heroSection = ref(null) 
const featuresSection = ref(null)
const pricingSection = ref(null)
const faqSection = ref(null)
const footerSection = ref(null)

let observers = [] 

function setupIntersectionObservers() {
  // 🔑 CORRECCIÓN: Añadimos heroSection a la lista de secciones
  const sections = [
    { ref: heroSection, id: 'hero-section' }, 
    { ref: featuresSection, id: 'features-section' },
    { ref: pricingSection, id: 'pricing-section' },
    { ref: faqSection, id: 'faq-section' },
    { ref: footerSection, id: 'footer-section' },
  ]

  // Usar el offset dinámico
  const headerHeight = getScrollOffset()
  
  const options = {
    root: null, 
    rootMargin: `-${headerHeight}px 0px -50% 0px`, 
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
  }

  sections.forEach(section => {
    if (section.ref.value) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            activeSection.value = section.id
          }
        })
      }, options)
      observer.observe(section.ref.value)
      observers.push(observer) 
    }
  })
}
// ------------------------------------


// --- REVEAL ON SCROLL (tarjetas y contenidos) ---
function setupRevealAnimations() {
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  if (!revealEls.length) return;

  // Asignar un pequeño delay escalonado por orden visual
  revealEls.forEach((el, i) => {
    el.style.setProperty('--reveal-delay', `${i * 120}ms`);
  });

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // solo una vez
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => obs.observe(el));
}
// ------------------------------------------------

// --- ACTUALIZAR SCROLL OFFSET DINÁMICO ---
function updateScrollOffset() {
  const offset = getScrollOffset()
  document.documentElement.style.setProperty('--scroll-offset', `${offset}px`)
}
// ------------------------------------------------

let onResizeHandler = null; 
onMounted(() => {
  const c = canvas.value
  if (!c) return
  const ctx = resizeCanvas(c)
  if (!ctx) return;
  generateParticlesFromText(c, pixelSteps)
  animateLoop()

  onResizeHandler = () => {
    resizeCanvas(c)
    generateParticlesFromText(c, pixelSteps)
    updateScrollOffset() // Actualizar offset al cambiar tamaño
  }
  
  window.addEventListener('resize', onResizeHandler)
  window.addEventListener('scroll', handleScroll) 
  
  // Inicializar scroll offset
  updateScrollOffset() 

  c.addEventListener('mousemove', (e) => {
    const rect = c.getBoundingClientRect()
    mouse.x = (e.clientX - rect.left)
    mouse.y = (e.clientY - rect.top)
  })
  c.addEventListener('mousedown', (e) => {
    mouse.isPressed = true
    mouse.isRightClick = e.button === 2
  })
  c.addEventListener('mouseup', () => { mouse.isPressed = false })

  c.addEventListener('contextmenu', (ev) => ev.preventDefault())

  // Inicializamos los Intersection Observers
  setupIntersectionObservers() 
  // Inicializamos las animaciones de aparición
  setupRevealAnimations()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  if (onResizeHandler) {
    window.removeEventListener('resize', onResizeHandler)
  }
  window.removeEventListener('scroll', handleScroll)

  // Limpiamos los Intersection Observers
  observers.forEach(observer => observer.disconnect()) 
})
</script>

<style scoped src="../assets/Home.css"></style>