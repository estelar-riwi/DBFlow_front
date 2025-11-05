<template>
<div class="dashboard-view">
<div class="view-header">
    <h1>Mis Bases de Datos</h1>
    <button class="btn-primary" @click="openCreateModal">Crear Base de Datos</button>
</div>

<section class="quota-section reveal-on-scroll">
    <h3>Bases de Datos</h3>
    <div class="quota-grid">
    <StatCard title="MYSQL" :value="`${countByEngine('MySQL')} / 2`" subtitle="Instancias usadas">
        <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
        </template>
    </StatCard>
    <StatCard title="POSTGRESQL" :value="`${countByEngine('PostgreSQL')} / 2`" subtitle="Instancias usadas">
        <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
        </template>
    </StatCard>
    <StatCard title="MONGODB" :value="`${countByEngine('MongoDB')} / 2`" subtitle="Instancias usadas">
        <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
        </template>
    </StatCard>
    <StatCard title="CASSANDRA" :value="`${countByEngine('Cassandra')} / 2`" subtitle="Instancias usadas">
        <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
        </template>
    </StatCard>
    <StatCard title="SQL SERVER" :value="`${countByEngine('SQL Server')} / 2`" subtitle="Instancias usadas">
        <template #icon>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/></svg>
        </template>
    </StatCard>
    </div>
</section>

<section class="instances-section reveal-on-scroll">
    <div class="toolbar">
    <div class="toolbar-field" style="flex:1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input v-model="searchTerm" placeholder="Buscar por nombre..." />
    </div>
    <select v-model="filterEngine" class="toolbar-select">
        <option value="">Todos los motores</option>
        <option>MySQL</option>
        <option>PostgreSQL</option>
        <option>Cassandra</option>
        <option>MongoDB</option>
        <option>SQL Server</option>
    </select>
    </div>

    <div class="db-table-container">
    <table class="db-table">
        <thead>
        <tr>
            <th>Estado</th>
            <th>Nombre</th>
            <th>Motor</th>
            <th>Host</th>
            <th>Puerto</th>
                            <th>Contraseña</th>
            <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="db in filteredDbs" :key="db.id">
            <td><span :class="'badge '+(db.status==='Activo'?'badge-success':'')">{{ db.status }}</span></td>
            <td>{{ db.name }}</td>
            <td>{{ db.engine }}</td>
            <td><span class="host">{{ db.host }}</span></td>
            <td>{{ db.port }}</td>
            <td>
                <div class="password-wrapper">
                    <span class="password">{{ showPasswords.has(db.id) ? db.password : masked(db.password) }}</span>
                        <button class="icon-btn" @click="togglePassword(db.id)" :aria-label="showPasswords.has(db.id) ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                            <svg v-if="!showPasswords.has(db.id)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>
                            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.77 21.77 0 0 1 5.06-6.94"/><path d="M1 1l22 22"/><path d="M10.58 10.58a2 2 0 1 0 2.83 2.83"/><path d="M9.88 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.82 21.82 0 0 1-3.12 4.56"/></svg>
                        </button>
                        <button class="icon-btn" @click="copyPassword(db.password)" aria-label="Copiar contraseña">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                </div>
            </td>
            <td>
                <div class="actions">
                    <button class="action-btn">Ver</button>
                    <button class="action-btn delete">Borrar</button>
                </div>
            </td>
        </tr>
        <tr v-if="filteredDbs.length === 0">
            <td colspan="6" class="empty-state">No se encontraron bases de datos</td>
        </tr>
        </tbody>
    </table>
    </div>
</section>

<!-- Modal Crear -->
<div v-if="showCreate" class="modal-overlay" @click.self="showCreate=false">
    <div class="modal-content">
    <button class="modal-close-btn" @click="showCreate=false">×</button>
    <h2>Nueva Base de Datos</h2>
    <form class="modal-form" @submit.prevent="createDb">
        <div class="form-group">
        <label>Nombre</label>
        <input v-model="newDb.name" required placeholder="mi_base_datos" />
        </div>
        <div class="form-group">
        <label>Motor</label>
        <select v-model="newDb.engine" required>
            <option value="">Selecciona un motor</option>
            <option>MySQL</option>
            <option>PostgreSQL</option>
            <option>MongoDB</option>
            <option>SQL Server</option>
        </select>
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
import { ref, computed, onMounted } from 'vue'
import StatCard from '../components/StatCard.vue'
import { showAlert } from '@/utils/notify'

const searchTerm = ref('')
const filterEngine = ref('')
const databases = ref([
    { id: 1, name: 'db_proyecto_final', engine: 'MySQL', host: 'mysql.dbflow.dev', port: 3306, status: 'Activo', password: 'mysql-3x4mpL3!' },
    { id: 2, name: 'db_blog_personal', engine: 'MongoDB', host: 'mongo.dbflow.dev', port: 27017, status: 'Activo', password: 'mongo-3x4mpL3!' },
    { id: 3, name: 'db_ecommerce', engine: 'PostgreSQL', host: 'postgres.dbflow.dev', port: 5432, status: 'Activo', password: 'pg-3x4mpL3!' }
])

const filteredDbs = computed(() => {
const term = searchTerm.value.toLowerCase()
const eng = filterEngine.value
return databases.value
    .filter(db => (eng ? db.engine === eng : true))
    .filter(db => (term ? db.name.toLowerCase().includes(term) : true))
})

const countByEngine = (eng) => databases.value.filter(db => db.engine === eng).length

const showCreate = ref(false)
const newDb = ref({ name: '', engine: '' })

// Password visibility states
const showPasswords = ref(new Set())
const togglePassword = (id) => {
    const s = new Set(showPasswords.value)
    if (s.has(id)) s.delete(id)
    else s.add(id)
    showPasswords.value = s
}

const masked = (pwd = '') => '•'.repeat(Math.max(8, Math.min(12, pwd.length || 8)))

const copyPassword = async (pwd = '') => {
    try {
        await navigator.clipboard.writeText(pwd)
        await showAlert({ icon: 'success', title: 'Copiada', text: 'Contraseña copiada al portapapeles', autoClose: 1200 })
    } catch (e) {
        console.warn('Clipboard API no disponible, usando fallback', e)
        const textarea = document.createElement('textarea')
        textarea.value = pwd
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        await showAlert({ icon: 'success', title: 'Copiada', text: 'Contraseña copiada', autoClose: 1200 })
    }
}

const openCreateModal = () => {
newDb.value = { name: '', engine: '' }
showCreate.value = true
}

const createDb = () => {
if (!newDb.value.name || !newDb.value.engine) return

const portByEngine = { MySQL: 3306, PostgreSQL: 5432, MongoDB: 27017, Cassandra: 9042, 'SQL Server': 1433 }
const hostByEngine = { MySQL: 'mysql.dbflow.dev', PostgreSQL: 'postgres.dbflow.dev', MongoDB: 'mongo.dbflow.dev', Cassandra: 'cassandra.dbflow.dev', 'SQL Server': 'sqlserver.dbflow.dev' }
    const generatePassword = (engine) => (engine?.slice(0,2) || 'db') + '-' + Math.random().toString(36).slice(2, 10) + '!'

databases.value.push({
    id: Date.now(),
    name: newDb.value.name,
    engine: newDb.value.engine,
    host: hostByEngine[newDb.value.engine] || 'db.dbflow.dev',
    port: portByEngine[newDb.value.engine] || 8000,
        status: 'Activo',
        password: generatePassword(newDb.value.engine)
})

newDb.value = { name: '', engine: '' }
showCreate.value = false
}

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
.dashboard-view {
width: 100%;
}

.view-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    color: white;
}

.view-header h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
}

.view-subtitle { color:#94a3b8; margin-top:6px; font-size:.95rem; }

.toolbar { display:flex; gap:12px; align-items:center; margin-bottom: 20px; flex-wrap: wrap; }
.toolbar-field { display:flex; align-items:center; gap:8px; background:#0f0f10; border:1px solid #222; color:#9aa0a6; padding:8px 12px; border-radius:10px; transition: border-color 0.2s; }
.toolbar-field:focus-within { border-color: #00bfff; }
.toolbar-field input { background:transparent; border:none; outline:none; color:#fff; min-width:220px; }
.toolbar-field svg { width:18px; height:18px; }
.toolbar-select { background:#0f0f10; border:1px solid #222; color:#fff; padding:8px 12px; border-radius:10px; cursor: pointer; transition: border-color 0.2s; }
.toolbar-select:hover { border-color: #444; }

.quota-section { margin-bottom: 40px; }
.quota-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
gap: 20px;
}

.instances-section {
    margin-bottom: 40px;
}

h3 {
    font-size: 0.85rem;
    font-weight: 600;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

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

.password-wrapper { display: flex; align-items: center; gap: 8px; }
.password { font-family: monospace; letter-spacing: 1px; color: #e2e8f0; }
.icon-btn { background: transparent; border: 1px solid rgba(255,255,255,0.12); color: #9aa0a6; border-radius: 8px; padding: 6px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; }
.icon-btn:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
.icon-btn svg { width: 18px; height: 18px; }

.badge { background: rgba(255,255,255,0.06); color:#ddd; border:1px solid rgba(255,255,255,0.12); padding:4px 10px; border-radius:999px; font-size:.8rem; white-space: nowrap; }
.badge-success { color:#22c55e; border-color: rgba(34,197,94,0.35); background: rgba(34,197,94,0.08); }
.host { color:#94a3b8; font-family: monospace; font-size: 0.9rem; }

.actions { display:flex; gap:8px; }
.action-btn { background: transparent; color:#e5e7eb; border:1px solid rgba(255,255,255,0.15); padding:6px 10px; border-radius:8px; cursor:pointer; font-size:.85rem; }
.action-btn:hover { border-color: rgba(255,255,255,0.35); }
.action-btn.delete { color:#f87171; border-color: rgba(248,113,113,0.35); }
.action-btn.delete:hover { border-color: rgba(248,113,113,0.6); background: rgba(248,113,113,0.06); }

.empty-state {
text-align: center;
color: #94a3b8;
padding: 60px 20px !important;
font-style: italic;
font-size: 0.95rem;
}

@media (max-width: 768px) {
.view-header { flex-direction: column; align-items: stretch; gap: 16px; }
.toolbar { flex-direction: column; width: 100%; }
.toolbar-field { width: 100%; }
.toolbar-field input { min-width: auto; width: 100%; }
.toolbar-select { width: 100%; }
.quota-grid { grid-template-columns: 1fr; }
}
</style>