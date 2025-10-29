<template>
  <div>
    <header class="main-header">
      <div class="logo">
        <div class="logo-icon"></div>
        <strong>DBFlow</strong>
      </div>

      <nav class="main-nav">
        <a href="#">Features</a>
        <a href="#">Pricing</a>
        <a href="#">About</a>
        <a href="#">Testimonials</a>
      </nav>
      <div class="auth-buttons">
        <a href="#" class="btn-signin">Sign In</a>
        <button class="btn-primary">Get Started</button>
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
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  if (onResizeHandler) {
    window.removeEventListener('resize', onResizeHandler)
  }
})

// --- SCRIPT DEL HEADER Y FOOTER ---
// (Ambos tenían scripts vacíos, así que no hay nada que añadir)
</script>

<style scoped src="../assets/Home.css"></style>

