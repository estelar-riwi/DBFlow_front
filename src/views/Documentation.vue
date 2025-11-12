<template>
  <div class="doc-page">
    <div class="canvas-container-bg" ref="container">
      <canvas ref="canvas" class="w-full h-full"></canvas>
    </div>

    <router-link to="/" class="btn-back-home">← Volver al Inicio</router-link>

    <div class="doc-container">
      <header class="doc-header">
        <div class="logo">
          <img src="/logos/logo.ico" alt="DBFlow" class="logo-icon" />
          <strong>DBFlow</strong>
        </div>
        <h1>Documentación</h1>
        <p>Guía completa para usar DBFlow</p>
      </header>

      <div class="doc-content">
        <section class="doc-section">
          <h2>Introducción</h2>
          <p>DBFlow es una plataforma de gestión de bases de datos que permite crear, administrar y escalar tus bases de datos MySQL, PostgreSQL, MongoDB, Cassandra y Redis de forma sencilla.</p>
        </section>

        <section class="doc-section">
          <h2>Primeros Pasos</h2>
          <h3>1. Registro</h3>
          <p>Crea tu cuenta en DBFlow y verifica tu correo electrónico.</p>
          
          <h3>2. Crear tu primera base de datos</h3>
          <p>Desde el dashboard, selecciona el tipo de base de datos que necesitas y configura los parámetros iniciales.</p>
          
          <h3>3. Conectar a tu base de datos</h3>
          <p>Usa las credenciales proporcionadas para conectarte desde tu aplicación.</p>
        </section>

        <section class="doc-section">
          <h2>Bases de Datos Soportadas</h2>
          
          <div class="db-grid">
            <div class="db-item">
              <h4>MySQL</h4>
              <p>Base de datos relacional de código abierto, ideal para aplicaciones web.</p>
            </div>
            
            <div class="db-item">
              <h4>PostgreSQL</h4>
              <p>Sistema de base de datos relacional-objeto con características avanzadas.</p>
            </div>
            
            <div class="db-item">
              <h4>MongoDB</h4>
              <p>Base de datos NoSQL orientada a documentos, flexible y escalable.</p>
            </div>
            
            <div class="db-item">
              <h4>Cassandra</h4>
              <p>Base de datos distribuida diseñada para manejar grandes volúmenes de datos.</p>
            </div>
            
            <div class="db-item">
              <h4>Redis</h4>
              <p>Almacén de estructuras de datos en memoria, ultra rápido para caché.</p>
            </div>
          </div>
        </section>

        <section class="doc-section">
          <h2>Gestión de Instancias</h2>
          <p>Desde el panel de control puedes:</p>
          <ul>
            <li>Crear nuevas instancias de bases de datos</li>
            <li>Ver el estado y métricas de tus instancias</li>
            <li>Obtener credenciales de conexión</li>
            <li>Eliminar instancias que no necesites</li>
          </ul>
        </section>

        <section class="doc-section">
          <h2>Planes y Cuotas</h2>
          <p>DBFlow ofrece diferentes planes según tus necesidades:</p>
          <ul>
            <li><strong>Plan Gratuito:</strong> Hasta 2 bases de datos</li>
            <li><strong>Plan Intermedio:</strong> Hasta 5 bases de datos</li>
            <li><strong>Plan Avanzado:</strong> Bases de datos ilimitadas</li>
          </ul>
        </section>

        <section class="doc-section">
          <h2>Soporte</h2>
          <p>Si necesitas ayuda, puedes:</p>
          <ul>
            <li>Consultar las preguntas frecuentes en la página principal</li>
            <li>Contactar con nuestro equipo de soporte</li>
            <li>Unirte a nuestra comunidad en Discord</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvas = ref(null);
const container = ref(null);
let animationId = null;
let particles = [];
let cw = 0, ch = 0;

class Particle {
  constructor(x, y) {
    this.pos = { x, y };
    this.vel = { x: 0, y: 0 };
    this.size = 1;
  }
  
  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.vel.x *= 0.95;
    this.vel.y *= 0.95;
  }
  
  draw(ctx) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
  }
}

function resizeCanvas() {
  if (!canvas.value || !container.value) return;
  cw = container.value.offsetWidth;
  ch = container.value.offsetHeight;
  canvas.value.width = cw;
  canvas.value.height = ch;
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(
      Math.random() * cw,
      Math.random() * ch
    ));
  }
}

function animate() {
  const ctx = canvas.value?.getContext('2d');
  if (!ctx) return;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, cw, ch);
  
  particles.forEach(p => {
    p.vel.x += (Math.random() - 0.5) * 0.2;
    p.vel.y += (Math.random() - 0.5) * 0.2;
    p.update();
    p.draw(ctx);
    
    if (p.pos.x < 0 || p.pos.x > cw) p.vel.x *= -1;
    if (p.pos.y < 0 || p.pos.y > ch) p.vel.y *= -1;
  });
  
  animationId = requestAnimationFrame(animate);
}

onMounted(() => {
  resizeCanvas();
  initParticles();
  animate();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });
});

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId);
  window.removeEventListener('resize', resizeCanvas);
});
</script>

<style scoped>
.doc-page {
  min-height: 100vh;
  background: #000;
  color: #fff;
  font-family: 'Roboto Mono', monospace;
  position: relative;
  overflow-x: hidden;
}

.canvas-container-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.btn-back-home {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-back-home:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(-5px);
}

.doc-container {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 80px 20px 60px;
}

.doc-header {
  text-align: center;
  margin-bottom: 60px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
}

.doc-header h1 {
  font-size: 3rem;
  margin: 0 0 15px;
  background: linear-gradient(135deg, #fff 0%, #999 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.doc-header p {
  font-size: 1.2rem;
  color: #888;
}

.doc-content {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 40px;
  backdrop-filter: blur(10px);
}

.doc-section {
  margin-bottom: 50px;
}

.doc-section:last-child {
  margin-bottom: 0;
}

.doc-section h2 {
  font-size: 2rem;
  margin: 0 0 20px;
  color: #fff;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}

.doc-section h3 {
  font-size: 1.4rem;
  margin: 25px 0 15px;
  color: #ddd;
}

.doc-section h4 {
  font-size: 1.2rem;
  margin: 0 0 10px;
  color: #fff;
}

.doc-section p {
  line-height: 1.8;
  color: #aaa;
  margin-bottom: 15px;
}

.doc-section ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.doc-section li {
  padding: 10px 0 10px 25px;
  position: relative;
  color: #aaa;
  line-height: 1.6;
}

.doc-section li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #fff;
}

.db-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.db-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.db-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
}

.db-item h4 {
  margin-bottom: 10px;
}

.db-item p {
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .doc-header h1 {
    font-size: 2rem;
  }
  
  .doc-content {
    padding: 25px;
  }
  
  .doc-section h2 {
    font-size: 1.5rem;
  }
  
  .db-grid {
    grid-template-columns: 1fr;
  }
}
</style>
