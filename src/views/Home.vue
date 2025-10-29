<template>
  <div>
    <header 
      class="main-header"
      :class="{ 'header-hidden': !showHeader }"
    >
      <div class="logo">
        <div class="logo-icon"></div>
        <strong>DBFlow</strong>
      </div>

      <nav class="main-nav">
        <a href="#features-section" :class="{ 'active': activeSection === 'features-section' }">Features</a>
        <a href="#pricing-section" :class="{ 'active': activeSection === 'pricing-section' }">Pricing</a>
        <a href="#faq-section" :class="{ 'active': activeSection === 'faq-section' }">About</a>
        <a href="#footer-section" :class="{ 'active': activeSection === 'footer-section' }">Testimonials</a>
      </nav>
      <div class="auth-buttons">
        
        <router-link to="/login" custom v-slot="{ navigate }">
          <a @click="navigate" role="link" class="btn-signin">Sign In</a>
        </router-link>

        <router-link to="/register" custom v-slot="{ navigate }">
          <a @click="navigate" role="link" class="btn-primary">Get Started</a>
        </router-link>
      </div>
    </header>

    <section class="hero-wrap">
      <div class="canvas-container" ref="container">
        <canvas ref="canvas" class="w-full h-full"></canvas>
      </div>

      <div class="hero-main-content">
        <h1 class="main-title">The Future of Database Management</h1>
        <p class="main-subtitle">A new, faster, and smarter way to interact with your data.</p>
        <button class="btn-primary-large">Get Started Now</button>
      </div>

      <div class="hero-footer-content">
        <div class="logo-carousel-wrap">
          <span>Powering the best teams</span>
          <div class="logo-track-container">
            <div class="logo-track">
              <div class="logo-item">OpenAI</div>
              <div class="logo-item">NVIDIA</div>
              <div class="logo-item">column</div>
              <div class="logo-item">GitHub</div>
              <div class="logo-item">Figma</div>
              <div class="logo-item">lemon squeezy</div>

              <div class="logo-item">OpenAI</div>
              <div class="logo-item">NVIDIA</div>
              <div class="logo-item">column</div>
              <div class="logo-item">GitHub</div>
              <div class="logo-item">Figma</div>
              <div class="logo-item">lemon squeezy</div>
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
        
        <div class="feature-card">
            <h4>Monitoreo y Analíticas</h4>
            <h3>Insights Instantáneos</h3>
            <p>Optimiza con métricas de rendimiento y consumo de recursos de tus DBs en tiempo real.</p>
        </div>

        <div class="feature-card">
            <h4>Administración de Equipos</h4>
            <h3>Colaboración Fluida</h3>
            <p>Gestiona y escala todas tus bases de datos (MySQL, Mongo, etc.) de manera centralizada.</p>
        </div>

        <div class="feature-card">
            <h4>Disponibilidad Máxima</h4>
            <h3>99.9%</h3>
            <p>Garantía de alta disponibilidad para mantener tus aplicaciones siempre operativas.</p>
        </div>

        <div class="feature-card">
            <h4>Seguridad Aislada</h4>
            <h3>Blindaje Empresarial</h3>
            <p>Cifrado de extremo a extremo, aislamiento total y seguridad garantizada por **JWT**.</p>
        </div>
        
        <div class="feature-card">
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
        
        <div class="pricing-card">
            <h3>Plan Gratuito</h3>
            <h1>$0<span>/siempre</span></h1>
            <p>Perfecto para proyectos personales y pruebas iniciales.</p>
            <ul>
                <li>Hasta **2 Bases de Datos por Motor**</li>
                <li>Motores: MySQL, Mongo, Postgre, etc.</li>
                <li>Generación automática de Credenciales</li>
                <li>Autenticación segura JWT</li>
                <li>Soporte vía correo (Estándar)</li>
            </ul>
            <button class="btn-primary">Registrarse Gratis →</button>
        </div>

        <div class="pricing-card popular">
            <div class="tag">Más Popular</div>
            <h3>Plan Intermedio</h3>
            <h1>$5.000<span>/mes COP</span></h1>
            <p>Ideal para pequeños equipos y aplicaciones en crecimiento.</p>
            <ul>
                <li>Hasta **5 Bases de Datos por Motor**</li>
                <li>**Webhooks** para notificaciones y errores</li>
                <li>Integración directa con **Mercado Pago**</li>
                <li>Gestión centralizada de facturación</li>
                <li>Rotación de credenciales bajo demanda</li>
            </ul>
            <button class="btn-primary">Suscribirse (Mercado Pago) →</button>
        </div>

        <div class="pricing-card">
            <h3>Plan Avanzado</h3>
            <h1>$10.000<span>/mes COP</span></h1>
            <p>La solución completa para desarrolladores y proyectos de alta demanda.</p>
            <ul>
                <li>Hasta **10 Bases de Datos por Motor**</li>
                <li>Acceso a todos los **Webhooks**</li>
                <li>Soporte prioritario y SLA</li>
                <li>Auditoría completa de eventos (Logs)</li>
                <li>Todos los beneficios del Plan Intermedio</li>
            </ul>
            <button class="btn-outline">Actualizar Plan →</button>
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
      <h2>¿Listo para Transformar tu Gestión de DBs?</h2>
      
      <p>Únete a cientos de desarrolladores y empresas que ya usan CCD para automatizar la creación y escalabilidad de sus bases de datos en la nube.</p>
      
      <div class="cta-buttons">
          <button class="btn-primary">Comienza con el Plan Gratuito</button>
          
          <button class="btn-outline">Ver Planes y Precios</button>
      </div>
    </section>

    <footer class="main-footer" id="footer-section" ref="footerSection">
      <div class="footer-top-content">
          
          <div class="footer-brand">
              <strong>DBFlow</strong>
              
              <p>Potenciando negocios con soluciones de automatización de bases de datos de vanguardia.</p>
              
              <p class="tagline">Toma el control de tu éxito con DBflow.</p>
          </div>
          
          <div class="footer-links">
              
              <div>
                  <h4>Product</h4>
                  <a href="#features-section">Features</a>
                  <a href="#pricing-section">Pricing</a>
                  <a href="#security-section">Security</a>
                  <a href="#integrations-section">Integrations</a>
              </div>
              
              <div>
                  <h4>Company</h4>
                  <a href="#">About</a>
                  <a href="#">Blog</a>
                  <a href="#">Careers</a>
                  <a href="#">Contact</a>
              </div>
          </div>
      </div>
      
      <p class="copyright">
          © 2025 DBflow. All rights reserved.
      </p>
    </footer>
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// --- SCRIPT DEL HOME (CANVAS) ---
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
      const side = Math.floor(Math.random() * 4);
      let startX, startY;
      const margin = 100;
      if (side === 0) { startX = Math.random() * cw; startY = -margin; }
      else if (side === 1) { startX = cw + margin; startY = Math.random() * ch; }
      else if (side === 2) { startX = Math.random() * cw; startY = ch + margin; }
      else { startX = -margin; startY = Math.random() * ch; }
      const p = new Particle(startX, startY);
      p.size = Math.max(0.6, pixelStep / 6)
      particles.push(p)
    }
  }

  for (let i = 0; i < newTargets.length; i++) {
    const p = particles[i]
    const t = newTargets[i]
    p.vel.x += (Math.random() - 0.5) * 25;
    p.vel.y += (Math.random() - 0.5) * 25;
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
const showHeader = ref(true) // Estado de visibilidad
let lastScrollY = 0 // Última posición de scroll
const SCROLL_DOWN_THRESHOLD = 50 // Umbral para empezar a ocultar
const SCROLL_UP_THRESHOLD = 200 // Umbral para re-mostrar al subir (evita el temblor al inicio)

function handleScroll() {
  const currentScrollY = window.scrollY
  const isScrollingDown = currentScrollY > lastScrollY
  
  if (isScrollingDown && currentScrollY > SCROLL_DOWN_THRESHOLD) {
    // Si baja y no está cerca de la parte superior, oculta el header
    showHeader.value = false
  } else if (!isScrollingDown || currentScrollY < SCROLL_UP_THRESHOLD) {
    // Si sube O está cerca de la parte superior, muestra el header
    showHeader.value = true
  }

  lastScrollY = currentScrollY
}
// ----------------------------------------------------


// --- LÓGICA DE SCROLL SPY (NUEVO) ---
const activeSection = ref(null) // Estado reactivo para la sección activa

// Refs para las secciones (para Observer)
const featuresSection = ref(null)
const pricingSection = ref(null)
const faqSection = ref(null)
const footerSection = ref(null) // El footer también es una sección "anclable"

let observers = [] // Para limpiar los IntersectionObservers

function setupIntersectionObservers() {
  const sections = [
    { ref: featuresSection, id: 'features-section' },
    { ref: pricingSection, id: 'pricing-section' },
    { ref: faqSection, id: 'faq-section' },
    { ref: footerSection, id: 'footer-section' },
  ]

  // CRÍTICO: La altura de compensación usada en home.css es 100px.
  const headerHeight = 100; 
  
  // Modificamos el rootMargin para que el centro de la sección se considere visible
  const options = {
    root: null, // El viewport es el root
    // Margen superior negativo para compensar el header fijo
    rootMargin: `-${headerHeight}px 0px 0px 0px`, 
    threshold: 0 // Cualquier intersección activa el callback
  }

  sections.forEach(section => {
    if (section.ref.value) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Lógica para manejar el Scroll Spy
            // Verificamos si la sección está realmente en la parte superior del viewport
            const rect = entry.target.getBoundingClientRect();
            // Si la parte superior de la sección está ~justo en la posición del header fijo
            if (rect.top <= headerHeight && rect.bottom > headerHeight) {
                activeSection.value = section.id
            }
          }
        })
      }, options)
      observer.observe(section.ref.value)
      observers.push(observer) // Guardamos el observer para limpieza
    }
  })
}
// ------------------------------------


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
