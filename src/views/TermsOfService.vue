<template>
  <div class="legal-page">
    <div class="canvas-container-bg" ref="container">
      <canvas ref="canvas" class="w-full h-full"></canvas>
    </div>

    <router-link to="/" class="btn-back-home">← Volver al Inicio</router-link>

    <div class="legal-container">
      <header class="legal-header">
        <div class="logo">
          <img src="/logos/logo.ico" alt="DBFlow" class="logo-icon" />
          <strong>DBFlow</strong>
        </div>
        <h1>Términos de Servicio</h1>
        <p class="update-date">Última actualización: 11 de noviembre de 2025</p>
      </header>

      <div class="legal-content">
        <section class="legal-section">
          <h2>1. Aceptación de los Términos</h2>
          <p>Al acceder y utilizar DBFlow, usted acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.</p>
        </section>

        <section class="legal-section">
          <h2>2. Descripción del Servicio</h2>
          <p>DBFlow proporciona servicios de gestión y alojamiento de bases de datos en la nube, incluyendo pero no limitado a:</p>
          <ul>
            <li>Creación y gestión de instancias de bases de datos</li>
            <li>Soporte para MySQL, PostgreSQL, MongoDB, Cassandra y Redis</li>
            <li>Panel de control para administración de bases de datos</li>
            <li>Conexiones seguras y cifradas</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>3. Registro de Cuenta</h2>
          <p>Para utilizar DBFlow, debe:</p>
          <ul>
            <li>Proporcionar información precisa y completa durante el registro</li>
            <li>Mantener la seguridad de su contraseña</li>
            <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta</li>
            <li>Ser responsable de todas las actividades que ocurran bajo su cuenta</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>4. Uso Aceptable</h2>
          <p>Al utilizar DBFlow, usted se compromete a:</p>
          <ul>
            <li>No utilizar el servicio para actividades ilegales</li>
            <li>No intentar acceder sin autorización a otros sistemas</li>
            <li>No sobrecargar intencionalmente nuestros servidores</li>
            <li>No almacenar contenido ilegal, ofensivo o que viole derechos de terceros</li>
            <li>Cumplir con todas las leyes y regulaciones aplicables</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>5. Planes y Pagos</h2>
          <p>DBFlow ofrece diferentes planes de suscripción:</p>
          <ul>
            <li>Los precios están sujetos a cambios con previo aviso</li>
            <li>Los pagos son no reembolsables salvo lo establecido por ley</li>
            <li>Las suscripciones se renuevan automáticamente</li>
            <li>Puede cancelar su suscripción en cualquier momento</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>6. Limitaciones de Responsabilidad</h2>
          <p>DBFlow se proporciona "tal cual" sin garantías de ningún tipo. No nos hacemos responsables de:</p>
          <ul>
            <li>Pérdida de datos no respaldados por el usuario</li>
            <li>Interrupciones del servicio por mantenimiento o causas de fuerza mayor</li>
            <li>Daños indirectos o consecuentes derivados del uso del servicio</li>
            <li>Contenido almacenado por los usuarios en sus bases de datos</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>7. Terminación del Servicio</h2>
          <p>Nos reservamos el derecho de:</p>
          <ul>
            <li>Suspender o terminar su cuenta por violación de estos términos</li>
            <li>Modificar o discontinuar el servicio con previo aviso</li>
            <li>Eliminar contenido que viole nuestras políticas</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>8. Propiedad Intelectual</h2>
          <p>Todo el contenido, diseño y funcionalidad de DBFlow es propiedad de nuestra empresa y está protegido por leyes de propiedad intelectual.</p>
        </section>

        <section class="legal-section">
          <h2>9. Modificaciones</h2>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.</p>
        </section>

        <section class="legal-section">
          <h2>10. Contacto</h2>
          <p>Si tiene preguntas sobre estos Términos de Servicio, puede contactarnos a través de nuestros canales de soporte.</p>
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

<style scoped src="../assets/LegalPages.css"></style>
