<template>
<div>
    <div class="view-header">
      <div>
        <h1>Webhooks</h1>
        <p class="view-subtitle">Recibe notificaciones HTTP POST cuando ocurran eventos específicos en tu plataforma.</p>
      </div>
      <button class="btn-primary" @click="openCreateModal">Crear Nuevo Webhook</button>
    </div>

    <h3>Resumen de Actividad</h3>
    <div class="quota-grid">
      <StatCard title="Endpoints Activos" value="1" subtitle="Configurados">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </template>
      </StatCard>
      <StatCard title="Eventos Hoy" value="12" subtitle="Disparados hoy">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke-width="1.5"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke-width="1.5"/></svg>
        </template>
      </StatCard>
      <StatCard title="Errores (7d)" value="0" subtitle="Sin errores">
        <template #icon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" stroke-width="1.5"/><path d="M12 8v4M12 16h.01" stroke-width="2"/></svg>
        </template>
      </StatCard>
    </div>

    <h3>Endpoints Registrados</h3>
    <div class="db-table-container reveal-on-scroll">
    <table class="db-table">
        <thead>
        <tr>
            <th>URL del Endpoint</th>
            <th>Eventos Suscritos</th>
            <th>Estado</th>
            <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="webhook-url">https://api.mi-servicio.com/hook/dbflow</td>
            <td><span class="badge">database.created</span> <span class="badge">database.deleted</span></td>
            <td><span class="status-dot"></span> <span class="badge badge-success">Activo</span></td>
            <td>
              <div class="actions">
                <button class="action-btn">Editar</button>
                <button class="action-btn delete">Borrar</button>
              </div>
            </td>
        </tr>
        </tbody>
    </table>
    </div>

    <!-- Modal crear webhook -->
    <div class="modal-overlay" v-if="showCreate" @click="showCreate=false">
      <div class="modal-card" @click.stop>
        <button class="modal-close-btn" @click="showCreate=false">×</button>
        <h2>Nuevo Webhook</h2>
        <form class="modal-form" @submit.prevent="showCreate=false">
          <div class="form-group">
            <label>URL del Endpoint</label>
            <input placeholder="https://api.ejemplo.com/webhook" />
          </div>
          <div class="form-group">
            <label>Eventos</label>
            <input placeholder="database.created, database.deleted" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-outline" @click="showCreate=false">Cancelar</button>
            <button type="submit" class="btn-primary">Crear</button>
          </div>
        </form>
      </div>
    </div>

</div>
</template>

<script setup>
import StatCard from '@/components/StatCard.vue'
import { ref, onMounted } from 'vue'

const showCreate = ref(false)
const openCreateModal = () => { showCreate.value = true }

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
.badge + .badge { margin-left: 6px; }
.badge-success { color:#22c55e; border-color: rgba(34,197,94,0.35); background: rgba(34,197,94,0.08); }
.webhook-url { font-family: 'Courier New', monospace; font-size: 0.9rem; color:#94a3b8; }

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

.actions { display:flex; gap:8px; }
.action-btn { background: transparent; color:#e5e7eb; border:1px solid rgba(255,255,255,0.15); padding:6px 10px; border-radius:8px; cursor:pointer; font-size:.85rem; }
.action-btn:hover { border-color: rgba(255,255,255,0.35); }
.action-btn.delete { color:#f87171; border-color: rgba(248,113,113,0.35); }
.action-btn.delete:hover { border-color: rgba(248,113,113,0.6); background: rgba(248,113,113,0.06); }
</style>