<template>
  <canvas ref="linesCanvas" class="converging-lines-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const linesCanvas = ref(null);
let animationId = null;
let lines = [];
let cw, ch;

// Puntos de convergencia (centro)
const centerX = () => cw / 2;
const centerY = () => ch / 2;

/**
 * Esta clase ahora define un "trazo" (streak) que se mueve
 * a lo largo de una curva Bezier cuadrática.
 */
class ConvergingLine {
  constructor(side, position) {
    // Lado del que sale: 1=right, 2=bottom, 3=left
    this.side = side;
    this.startPosition = position; // Posición en el lado (0 a 1)
    
    // Inicializa la curva y el estado
    this.reset();
  }
  
  reset() {
    // Progreso a lo largo de la curva (0 a 1)
    this.progress = Math.random();
    
    // Velocidad (más lentas para un efecto sutil)
    this.speed = 0.0003 + Math.random() * 0.001;
    
    // Opacidad base del trazo
    this.opacity = 0.15 + Math.random() * 0.25;
    
    // Longitud del trazo (como % de la trayectoria)
    this.length = 0.05 + Math.random() * 0.15;

    // --- Definir la trayectoria de la curva ---
    
    // 1. Punto de inicio (en el borde)
    this.start = this.getStartPosition();
    
    // 2. Punto final (el centro)
    this.end = { x: centerX(), y: centerY() };

    // 3. Punto de control (para la curvatura)
    // Esto es lo que hace el efecto "swoosh"
    const deviation = 0.5; // Qué tan "abierta" es la curva (50%)
    let cx, cy;
    
    if (this.side === 1) { // Right
        cx = this.start.x + Math.random() * cw * deviation;
        cy = this.start.y + (Math.random() - 0.5) * ch * deviation;
    } else if (this.side === 2) { // Bottom
        cx = this.start.x + (Math.random() - 0.5) * cw * deviation;
        cy = this.start.y + Math.random() * ch * deviation;
    } else { // Left (side === 3)
        cx = this.start.x - Math.random() * cw * deviation;
        cy = this.start.y + (Math.random() - 0.5) * ch * deviation;
    }
    this.control = { x: cx, y: cy };
  }
  
  getStartPosition() {
    switch(this.side) {
      case 1: // Right
        return { x: cw, y: this.startPosition * ch };
      case 2: // Bottom
        return { x: this.startPosition * cw, y: ch };
      case 3: // Left
        return { x: 0, y: this.startPosition * ch };
      default:
        return { x: 0, y: 0 };
    }
  }

  // Función helper para encontrar un punto en una curva Bezier cuadrática
  getQuadraticBezierPoint(t) {
    const p0 = this.start;
    const p1 = this.control;
    const p2 = this.end;
    
    const x = Math.pow(1 - t, 2) * p0.x +
              2 * (1 - t) * t * p1.x +
              Math.pow(t, 2) * p2.x;
              
    const y = Math.pow(1 - t, 2) * p0.y +
              2 * (1 - t) * t * p1.y +
              Math.pow(t, 2) * p2.y;
              
    return { x, y };
  }
  
  update() {
    this.progress += this.speed;
    
    // Si el trazo completa su ciclo, reinicia desde el principio
    if (this.progress > 1 + this.length) {
      this.progress = 0;
      
      // Opcional: resetear la curva para que sea diferente cada vez
      // this.reset(); 
    }
  }
  
  draw(ctx) {
    // Cabeza del trazo (punto más cercano al centro)
    const t1 = this.progress;
    // Cola del trazo (punto más cercano al borde)
    const t2 = this.progress - this.length;
    
    // No dibujar si está completamente fuera de la vista
    if (t1 < 0 || t2 > 1) return;
    
    // Obtener las coordenadas de la cabeza y la cola en la curva
    const p1 = this.getQuadraticBezierPoint(Math.max(0, t2)); // Cola
    const p2 = this.getQuadraticBezierPoint(Math.min(1, t1)); // Cabeza

    // Crear un gradiente lineal entre la cola y la cabeza
    // Esto crea el efecto "streak" (cola transparente, cabeza opaca)
    const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
    gradient.addColorStop(0, `rgba(255, 255, 255, 0)`); // Cola
    gradient.addColorStop(0.7, `rgba(255, 255, 255, ${this.opacity * 0.8})`); // Cuerpo
    gradient.addColorStop(1, `rgba(255, 255, 255, ${this.opacity})`); // Cabeza

    // Dibujar el segmento
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.2; // Un poco más grueso que 1px
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    // Usamos lineTo. Como el segmento (length) es corto,
    // la aproximación recta es visualmente idéntica a la curva.
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
}

function resizeCanvas(canvas) {
  const parent = canvas.parentElement;
  if (!parent) return;
  
  cw = parent.offsetWidth;
  ch = parent.offsetHeight;
  
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(cw * dpr);
  canvas.height = Math.floor(ch * dpr);
  canvas.style.width = `${cw}px`;
  canvas.style.height = `${ch}px`;
  
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function initLines() {
  lines = [];
  // Usar más líneas para el efecto denso de la imagen
  const totalLines = 250;
  
  for (let i = 0; i < totalLines; i++) {
    let side;
    const randSide = Math.random();
    
    // Como en la imagen, las líneas vienen de los lados y el fondo,
    // pero no de arriba.
    // 0=top, 1=right, 2=bottom, 3=left
    
    if (randSide < 0.45) { // 45% de la izquierda
        side = 3; 
    } else if (randSide < 0.9) { // 45% de la derecha
        side = 1;
    } else { // 10% de abajo
        side = 2;
    }
    
    const position = Math.random(); // Posición aleatoria en ese lado
    lines.push(new ConvergingLine(side, position));
  }
}

function animate() {
  const canvas = linesCanvas.value;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // ¡Esta parte tuya es CORRECTA!
  // Dibuja un rectángulo negro semi-transparente sobre todo.
  // Esto desvanece el fotograma anterior, creando el "motion blur".
  ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  ctx.fillRect(0, 0, cw, ch);
  
  // Actualizar y dibujar todas las líneas (trazos)
  lines.forEach(line => {
    line.update();
    line.draw(ctx);
  });
  
  animationId = requestAnimationFrame(animate);
}

let resizeHandler = null;

onMounted(() => {
  const canvas = linesCanvas.value;
  if (!canvas) return;
  
  // Asegurarse de que el padre esté listo
  if (canvas.parentElement.offsetWidth === 0) {
      // Esperar un frame si el DOM no está listo
      setTimeout(() => {
          resizeCanvas(canvas);
          initLines();
          animate();
      }, 100);
  } else {
      resizeCanvas(canvas);
      initLines();
      animate();
  }
  
  resizeHandler = () => {
    resizeCanvas(canvas);
    initLines(); // Regenerar las líneas con las nuevas dimensiones
  };
  
  window.addEventListener('resize', resizeHandler);
});

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
  }
});
</script>

<style scoped>
.converging-lines-canvas {
  /* Esto es clave. El canvas se posiciona absolutamente
    detrás de tu contenido (z-index: 0).
  */
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none; /* El canvas no debe ser clickeable */
}
</style>