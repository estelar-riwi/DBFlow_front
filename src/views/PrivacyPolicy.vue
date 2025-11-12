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
        <h1>Política de Privacidad</h1>
        <p class="update-date">Última actualización: 11 de noviembre de 2025</p>
      </header>

      <div class="legal-content">
        <section class="legal-section">
          <h2>1. Información que Recopilamos</h2>
          <p>En DBFlow, recopilamos la siguiente información:</p>
          <ul>
            <li>Información de registro: nombre, correo electrónico, contraseña</li>
            <li>Información de uso: datos sobre cómo utiliza nuestros servicios</li>
            <li>Información técnica: dirección IP, tipo de navegador, sistema operativo</li>
            <li>Información de pago: datos de facturación (procesados por terceros seguros)</li>
            <li>Datos de bases de datos: configuración y metadatos de sus instancias</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>2. Cómo Utilizamos su Información</h2>
          <p>Utilizamos la información recopilada para:</p>
          <ul>
            <li>Proporcionar y mantener nuestros servicios</li>
            <li>Procesar pagos y gestionar suscripciones</li>
            <li>Mejorar y personalizar su experiencia</li>
            <li>Enviar notificaciones importantes sobre el servicio</li>
            <li>Detectar y prevenir fraudes o abusos</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>3. Compartir Información</h2>
          <p>No vendemos su información personal. Podemos compartir información con:</p>
          <ul>
            <li>Proveedores de servicios que nos ayudan a operar (procesadores de pago, hosting)</li>
            <li>Autoridades legales cuando sea requerido por ley</li>
            <li>En caso de fusión, adquisición o venta de activos</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>4. Seguridad de Datos</h2>
          <p>Implementamos medidas de seguridad técnicas y organizativas:</p>
          <ul>
            <li>Cifrado de datos en tránsito y en reposo</li>
            <li>Autenticación segura y gestión de contraseñas</li>
            <li>Acceso restringido a datos personales</li>
            <li>Monitoreo continuo de seguridad</li>
            <li>Copias de seguridad regulares</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>5. Retención de Datos</h2>
          <p>Conservamos su información personal mientras:</p>
          <ul>
            <li>Su cuenta esté activa</li>
            <li>Sea necesario para proporcionar servicios</li>
            <li>Sea requerido por obligaciones legales</li>
            <li>Sea necesario para resolver disputas</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>6. Sus Derechos</h2>
          <p>Usted tiene derecho a:</p>
          <ul>
            <li>Acceder a su información personal</li>
            <li>Corregir información inexacta</li>
            <li>Solicitar la eliminación de sus datos</li>
            <li>Exportar sus datos en formato legible</li>
            <li>Oponerse al procesamiento de sus datos</li>
            <li>Retirar el consentimiento en cualquier momento</li>
          </ul>
        </section>

        <section class="legal-section">
          <h2>7. Cookies y Tecnologías Similares</h2>
          <p>Utilizamos cookies y tecnologías similares para:</p>
          <ul>
            <li>Mantener su sesión activa</li>
            <li>Recordar sus preferencias</li>
            <li>Analizar el uso del servicio</li>
            <li>Mejorar la seguridad</li>
          </ul>
          <p>Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad.</p>
        </section>

        <section class="legal-section">
          <h2>8. Privacidad de Menores</h2>
          <p>Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente información de menores.</p>
        </section>

        <section class="legal-section">
          <h2>9. Transferencias Internacionales</h2>
          <p>Sus datos pueden ser transferidos y procesados en diferentes países. Implementamos salvaguardias apropiadas para proteger su información.</p>
        </section>

        <section class="legal-section">
          <h2>10. Cambios a esta Política</h2>
          <p>Podemos actualizar esta política periódicamente. Le notificaremos sobre cambios significativos a través de nuestros canales de comunicación.</p>
        </section>

        <section class="legal-section">
          <h2>11. Contacto</h2>
          <p>Para preguntas sobre privacidad o para ejercer sus derechos, contáctenos a través de nuestros canales de soporte.</p>
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
