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
        <a href="#hero-section" :class="{ 'active': activeSection === 'hero-section' }">Inicio</a>
        <a href="#features-section" :class="{ 'active': activeSection === 'features-section' }">Funcionalidades</a>
        <a href="#pricing-section" :class="{ 'active': activeSection === 'pricing-section' }">Precios</a>
        <a href="#faq-section" :class="{ 'active': activeSection === 'faq-section' }">Preguntas</a>
      </nav>
      <div class="auth-buttons">
        
        <router-link to="/login" custom v-slot="{ navigate }">
          <a @click="navigate" role="link" class="btn-signin">Sign In</a>
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
        <button class="btn-primary-large">Empieza ahora</button>
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
            <h3>Plan Gratuito</h3>
            <h1>$0<span>/siempre</span></h1>
            <p>Perfecto para proyectos personales y pruebas iniciales.</p>
            <ul>
                <li>Hasta 2 Bases de Datos por Motor</li>
                <li>Motores: MySQL, Mongo, Postgre, etc.</li>
                <li>Generación automática de Credenciales</li>
                <li>Autenticación segura JWT</li>
                <li>Soporte vía correo (Estándar)</li>
            </ul>
            <button class="btn-primary">Registrarse Gratis →</button>
        </div>

    <div class="pricing-card popular reveal-on-scroll">
            <div class="tag">Más Popular</div>
            <h3>Plan Intermedio</h3>
            <h1>$5.000<span>/mes COP</span></h1>
            <p>Ideal para pequeños equipos y aplicaciones en crecimiento.</p>
            <ul>
                <li>Hasta 5 Bases de Datos por Motor</li>
                <li>Webhooks para notificaciones y errores</li>
                <li>Integración directa</li>
                <li>Gestión centralizada de facturación</li>
                <li>Rotación de credenciales bajo demanda</li>
            </ul>
            <button class="btn-primary">Suscribirse →</button>
        </div>

    <div class="pricing-card reveal-on-scroll">
            <h3>Plan Avanzado</h3>
            <h1>$10.000<span>/mes COP</span></h1>
            <p>La solución completa para desarrolladores y proyectos de alta demanda.</p>
            <ul>
                <li>Hasta 10 Bases de Datos por Motor</li>
                <li>Acceso a todos los Webhooks</li>
                <li>Soporte prioritario y SLA</li>
                <li>Auditoría completa de eventos (Logs)</li>
                <li>Todos los beneficios del Plan Intermedio</li>
            </ul>
            <button class="btn-primary">Suscribirse →</button>
        </div>
        
      </div>
    </section>

    <section class="faq-section" id="faq-section" ref="faqSection">
      <h2 class="section-title">Preguntas Frecuentes</h2>
      <p class="section-subtitle">
          Todo lo que necesitas saber sobre DBflow. ¿No encuentras lo que buscas? Contacta a nuestro equipo de soporte.
      </p>
      <div class="faq-list">
        
        <details>
            <summary>¿Qué es DBflow y qué motores de bases de datos soporta?</summary>
            <p>DBflow es una plataforma cloud para la gestión automatizada de bases de datos que te permite crear, administrar y escalar instancias de motores populares como MySQL, PostgreSQL, MongoDB, SQL Server, Redis y Cassandra de manera centralizada.</p>
        </details>
        
        <details>
            <summary>¿Puedo probar DBflow antes de comprometerme con un plan de pago?</summary>
            <p>¡Sí! Al registrarte, accedes automáticamente al Plan Gratuito, que te permite crear y mantener activas hasta dos bases de datos por cada motor (hasta 12 DBs en total) sin costo ni tarjeta de crédito.</p>
        </details>
        
        <details>
            <summary>¿Qué tan segura es mi información y cómo se aíslan mis bases de datos en DBflow?</summary>
            <p>Garantizamos seguridad blindada y aislamiento de datos entre clientes. Usamos cifrado de extremo a extremo, JWT (JSON Web Token) para la autenticación y generamos credenciales únicas y aisladas para cada instancia de base de datos que creas.</p>
        </details>
        
        <details>
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
            
            <a href="#pricing-section" class="btn-primary">Ver Planes y Precios</a>
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
        <p class="quote">“Toma el control de tu éxito con DBFlow.”</p>
      </div>
          
      <!-- Columnas de enlaces -->
      <div class="footer-links">
        <div class="footer-col">
          <h4>Product</h4>
          <a href="#features-section">Features</a>
          <a href="#pricing-section">Pricing</a>
          <a href="#faq-section">Security</a>
          <a href="#features-section">Integrations</a>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Blog</a>
          <a href="#">Careers</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </div>

    <div class="footer-divider"></div>
      
    <p class="copyright">
      © 2025 DBFlow. All rights reserved.
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

  // Compensación de 90px (del home.css) + 15px (top del header) = 105px
  const headerHeight = 105; 
  
  const options = {
    root: null, 
    rootMargin: `-${headerHeight}px 0px 0px 0px`, 
    threshold: 0 
  }

  sections.forEach(section => {
    if (section.ref.value) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Lógica para manejar el Scroll Spy
            const rect = entry.target.getBoundingClientRect();
            if (rect.top <= headerHeight && rect.bottom > headerHeight) {
                activeSection.value = section.id
            }
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
  }
  
  window.addEventListener('resize', onResizeHandler)
  window.addEventListener('scroll', handleScroll) 

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