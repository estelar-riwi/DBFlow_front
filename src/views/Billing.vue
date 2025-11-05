<template>
<div>
    <div class="view-header">
      <div>
        <h1>Plan y Facturación</h1>
        <p class="view-subtitle">Administra tu suscripción y consulta tu historial de pagos.</p>
      </div>
      <button class="btn-primary" @click="goToMercadoPago">Actualizar a Intermedio</button>
    </div>

    <h3>Plan Actual</h3>
    <div class="quota-grid">
      <StatCard title="Plan Actual" value="Gratuito" subtitle="2 DBs por motor">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v18l7-5 7 5V3z"/></svg>
        </template>
      </StatCard>
      <StatCard title="Costo Mensual" value="$0 COP" subtitle="Sin cargos">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" stroke-width="1.5"/><path d="M9 12h6M12 9v6" stroke-width="1.5"/></svg>
        </template>
      </StatCard>
      <StatCard title="Próximo Cobro" value="N/A" subtitle="Sin fecha">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="6" width="18" height="13" rx="2" stroke-width="1.5"/><path d="M3 10h18" stroke-width="1.5"/></svg>
        </template>
      </StatCard>
    </div>

    <h3>Historial de Facturación</h3>
  <div class="db-table-container reveal-on-scroll">
    <table class="db-table">
        <thead>
        <tr>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Estado</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>30 Oct, 2025</td>
            <td>Suscripción Plan Gratuito</td>
            <td>$0 COP</td>
            <td><span class="status-dot"></span> <span class="badge badge-success">Completado</span></td>
        </tr>
        </tbody>
    </table>
    </div>

</div>
</template>

<script setup>
import StatCard from '@/components/StatCard.vue'
import { ref, onMounted } from 'vue'

// Lógica para manejar la redirección a Mercado Pago
const goToMercadoPago = () => {
console.log('Redirigiendo a Mercado Pago...');
// Aquí iría la lógica para crear una suscripción en tu backend
// y redirigir al checkout de Mercado Pago.
alert('Redirección a Mercado Pago (Simulación)');
};

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
        }
      })
    },
    { threshold: 0.1 }
  )
  const reveals = document.querySelectorAll('.reveal-on-scroll')
  reveals.forEach((el) => observer.observe(el))
})
</script>

<style scoped>
.view-subtitle { color:#94a3b8; margin-top:6px; font-size:.95rem; }
.badge { background: rgba(255,255,255,0.06); color:#ddd; border:1px solid rgba(255,255,255,0.12); padding:3px 8px; border-radius:999px; font-size:.8rem; }
.badge-success { color:#22c55e; border-color: rgba(34,197,94,0.35); background: rgba(34,197,94,0.08); }

.quota-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

/* Tabla estilo unificado */
.db-table-container {
  background: #0f0f10;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.db-table { width: 100%; border-collapse: collapse; }
.db-table th, .db-table td { padding: 12px 14px; text-align: left; }
.db-table thead th { background: rgba(255,255,255,0.03); font-size: .85rem; color: #cbd5e1; font-weight: 600; }
.db-table tbody tr { border-top: 1px solid rgba(255,255,255,0.06); }
.db-table tbody tr:hover { background: rgba(255,255,255,0.03); }
</style>