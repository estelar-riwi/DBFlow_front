<template>
<div class="dashboard-view">
<div class="view-header">
    <h1>Mis Bases de Datos</h1>
    <button class="btn-primary" @click="openCreateModal">Crear Base de Datos</button>
</div>

<section class="quota-section reveal-on-scroll">
    <h3>Bases de Datos</h3>
    <div class="quota-grid">
    <StatCard title="MYSQL" :value="`${countByEngine('MySQL')} / 2`" subtitle="Instancias usadas" logo="/logos/mysql.svg" cardColor="#00758F" />
    <StatCard title="POSTGRESQL" :value="`${countByEngine('PostgreSQL')} / 2`" subtitle="Instancias usadas" logo="/logos/postgresql.svg" cardColor="#336791" />
    <StatCard title="MONGODB" :value="`${countByEngine('MongoDB')} / 2`" subtitle="Instancias usadas" logo="/logos/mongodb.svg" cardColor="#47A248" />
    <StatCard title="CASSANDRA" :value="`${countByEngine('Cassandra')} / 2`" subtitle="Instancias usadas" logo="/logos/cassandra.svg" cardColor="#1287B1" />
    <StatCard title="SQL SERVER" :value="`${countByEngine('SQL Server')} / 2`" subtitle="Instancias usadas" logo="/logos/sqlserver.svg" cardColor="#8B5CF6" />
    <StatCard title="REDIS" :value="`${countByEngine('Redis')} / 2`" subtitle="Instancias usadas" logo="/logos/redis.svg" cardColor="#DC382D" />
    </div>
</section>

<section class="instances-section reveal-on-scroll">
    <div class="toolbar">
    <div class="toolbar-field" style="flex:1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input v-model="searchTerm" placeholder="Buscar por nombre..." />
    </div>
    <select v-model="filterEngine" class="toolbar-select">
        <option value="">Todos nuestros gestores de bases de datos</option>
        <option>MySQL</option>
        <option>PostgreSQL</option>
        <option>MongoDB</option>
        <option>Cassandra</option>
        <option>SQL Server</option>
        <option>Redis</option>
    </select>
    </div>

    <div class="db-table-container">
    <table class="db-table">
        <thead>
        <tr>
            <th>Estado</th>
            <th>Nombre</th>
            <th>Gestor</th>
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
                    <button class="action-btn" @click="viewCredentials(db)" title="Ver credenciales completas">Ver</button>
                    <button class="action-btn delete" @click="removeDatabase(db)" title="Eliminar base de datos">Borrar</button>
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
    <div class="modal-content-glass">
    <button class="modal-close-btn" @click="showCreate=false">×</button>
    
    <!-- Paso 1: Selección de Motor -->
    <div v-if="createStep === 1" class="step-content">
        <h2 class="modal-title">Selecciona el Motor de Base de Datos</h2>
        <p class="modal-subtitle">Elige el tipo de base de datos que deseas crear</p>
        
        <div class="engine-grid">
        <div 
            v-for="engine in engineOptions" 
            :key="engine.name"
            class="engine-card"
            :class="{ 
              'selected': newDb.engine === engine.name,
              'disabled': engine.name !== 'MySQL'
            }"
            :style="{ '--engine-color': engine.color }"
            @click="selectEngine(engine.name)"
        >
            <div class="engine-icon">
            <img :src="engine.logo" :alt="engine.name" />
            </div>
            <h3>{{ engine.name }}</h3>
            <p class="engine-desc">{{ engine.description }}</p>
            <div class="engine-meta">
            <span v-if="engine.name === 'MySQL'" class="badge-available">✓ Disponible</span>
            <span v-else class="badge-coming-soon">🔧 En proceso</span>
            </div>
        </div>
        </div>
    </div>

    <!-- Paso 2: Configuración -->
    <div v-if="createStep === 2" class="step-content">
        <button type="button" class="btn-back" @click="createStep = 1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Volver
        </button>

        <h2 class="modal-title">Configuración de {{ newDb.engine }}</h2>
        <p class="modal-subtitle">Define el nombre de tu instancia</p>

        <form class="modal-form" @submit.prevent="createDb">
        <div class="form-group">
            <label>Nombre de la Base de Datos</label>
            <input 
            v-model="newDb.name" 
            required 
            placeholder="mi_base_datos"
            pattern="[a-zA-Z0-9_]+"
            title="Solo letras, números y guiones bajos"
            />
            <small class="form-hint">Solo se permiten letras, números y guiones bajos</small>
        </div>

        <div class="connection-preview">
            <h4>Vista Previa de Conexión</h4>
            <div class="preview-item">
            <span class="preview-label">Host:</span>
            <span class="preview-value">{{ getEngineHost(newDb.engine) }}</span>
            </div>
            <div class="preview-item">
            <span class="preview-label">Puerto:</span>
            <span class="preview-value">{{ getEnginePort(newDb.engine) }}</span>
            </div>
            <div class="preview-item">
            <span class="preview-label">String de conexión:</span>
            <code class="preview-code">{{ getConnectionString(newDb.engine, newDb.name) }}</code>
            </div>
        </div>

        <div class="modal-actions">
            <button type="button" class="btn-outline" @click="createStep = 1">Atrás</button>
            <button type="submit" class="btn-primary">Crear Instancia</button>
        </div>
        </form>
    </div>
    </div>
</div>

</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatCard from '../components/StatCard.vue'
import { showAlert } from '@/utils/notify'
import { createDatabase, getDatabaseCredentials, deleteDatabase, getAllDatabases, rotateCredentials } from '@/services/databaseService'
import { showLoading, hideLoading } from '@/store/loading'

const searchTerm = ref('')
const filterEngine = ref('')
const databases = ref([])


const filteredDbs = computed(() => {
const term = searchTerm.value.toLowerCase()
const eng = filterEngine.value
return databases.value
    .filter(db => (eng ? db.engine === eng : true))
    .filter(db => (term ? db.name.toLowerCase().includes(term) : true))
})

const countByEngine = (eng) => databases.value.filter(db => db.engine === eng).length

const showCreate = ref(false)
const createStep = ref(1)
const newDb = ref({ name: '', engine: '' })

// Opciones de motores con metadata
const engineOptions = ref([
  {
    name: 'MySQL',
    description: 'Base de datos relacional de código abierto',
    logo: '/logos/mysql.svg',
    defaultPort: 3306,
    host: 'mysql.dbflow.dev',
    connectionString: 'mysql://username:password@mysql.dbflow.dev:3306/{dbname}',
    color: '#00758F'
  },
  {
    name: 'PostgreSQL',
    description: 'Sistema de gestión de bases de datos relacional',
    logo: '/logos/postgresql.svg',
    defaultPort: 5432,
    host: 'postgres.dbflow.dev',
    connectionString: 'postgresql://username:password@postgres.dbflow.dev:5432/{dbname}',
    color: '#336791'
  },
  {
    name: 'MongoDB',
    description: 'Base de datos NoSQL orientada a documentos',
    logo: '/logos/mongodb.svg',
    defaultPort: 27017,
    host: 'mongo.dbflow.dev',
    connectionString: 'mongodb://username:password@mongo.dbflow.dev:27017/{dbname}',
    color: '#47A248'
  },
  {
    name: 'Cassandra',
    description: 'Base de datos distribuida altamente escalable',
    logo: '/logos/cassandra.svg',
    defaultPort: 9042,
    host: 'cassandra.dbflow.dev',
    connectionString: 'cassandra://cassandra.dbflow.dev:9042/{dbname}',
    color: '#1287B1'
  },
  {
    name: 'SQL Server',
    description: 'Sistema de gestión de bases de datos de Microsoft',
    logo: '/logos/sqlserver.svg',
    defaultPort: 1433,
    host: 'sqlserver.dbflow.dev',
    connectionString: 'Server=sqlserver.dbflow.dev,1433;Database={dbname};User Id=username;Password=password;',
    color: '#8B5CF6'
  },
  {
    name: 'Redis',
    description: 'Almacén de estructura de datos en memoria',
    logo: '/logos/redis.svg',
    defaultPort: 6379,
    host: 'redis.dbflow.dev',
    connectionString: 'redis://username:password@redis.dbflow.dev:6379',
    color: '#DC382D'
  }
])

const selectEngine = (engineName) => {
  // Solo MySQL está disponible por ahora
  if (engineName !== 'MySQL') {
    showAlert({ 
      icon: 'info', 
      title: 'Próximamente', 
      text: `${engineName} estará disponible próximamente. Por ahora solo MySQL está habilitado.`,
      confirmText: 'Entendido'
    })
    return
  }
  
  newDb.value.engine = engineName
  createStep.value = 2
}

const getEngineHost = (engineName) => {
  const engine = engineOptions.value.find(e => e.name === engineName)
  return engine?.host || 'db.dbflow.dev'
}

const getEnginePort = (engineName) => {
  const engine = engineOptions.value.find(e => e.name === engineName)
  return engine?.defaultPort || 8000
}

const getConnectionString = (engineName, dbName) => {
  const engine = engineOptions.value.find(e => e.name === engineName)
  if (!engine) return ''
  return engine.connectionString.replace('{dbname}', dbName || 'database_name')
}

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
  createStep.value = 1
  showCreate.value = true
}

const createDb = async () => {
  if (!newDb.value.name || !newDb.value.engine) {
    showAlert('Por favor completa todos los campos', 'error')
    return
  }

  try {
    showLoading('Creando base de datos...')
    
    // Llamar a la API
    const response = await createDatabase({
      databaseName: newDb.value.name,
      engine: newDb.value.engine
    })
    
    console.log('Base de datos creada:', response)
    
    // Agregar la nueva base de datos a la lista local
    databases.value.push({
      id: response.id,
      name: response.databaseName,
      engine: newDb.value.engine,
      host: response.host,
      port: response.port,
      status: 'Activo',
      username: response.username,
      password: response.password || '••••••••'
    })
    
    // Resetear el formulario
    newDb.value = { name: '', engine: '' }
    createStep.value = 1
    showCreate.value = false
    
    showAlert('Base de datos creada exitosamente', 'success')
  } catch (error) {
    console.error('Error al crear base de datos:', error)
    console.error('Response data:', error.response?.data)
    console.error('Response status:', error.response?.status)
    console.error('Response headers:', error.response?.headers)
    
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.title
      || error.response?.data?.errors
      || error.message
      || 'Error al crear la base de datos'
    
    showAlert(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage, 'error')
  } finally {
    hideLoading()
  }
}

// Cargar bases de datos desde la API
const loadDatabases = async () => {
  try {
    showLoading('Cargando bases de datos...')
    const data = await getAllDatabases()
    
    console.log('Bases de datos recibidas del backend:', data)
    
    // Solo actualizar si hay datos
    if (data && Array.isArray(data)) {
      // Mapear la respuesta de la API al formato esperado
      databases.value = data.map(db => ({
        id: db.id,
        name: db.databaseName || db.name,
        engine: db.engine,
        host: db.host || getEngineHost(db.engine),
        port: db.port || getEnginePort(db.engine),
        status: db.status || 'Activo',
        username: db.username,
        password: db.password || '••••••••'
      }))
      
      console.log('Bases de datos mapeadas:', databases.value)
    }
  } catch (error) {
    console.error('Error al cargar bases de datos:', error)
    console.error('Response:', error.response?.data)
    // Mantener la lista vacía si falla la carga
  } finally {
    hideLoading()
  }
}

// Eliminar base de datos
const removeDatabase = async (db) => {
  if (!confirm(`¿Estás seguro de eliminar la base de datos "${db.name}"?`)) {
    return
  }
  
  try {
    showLoading('Eliminando base de datos...')
    await deleteDatabase(db.id, db.engine)
    
    // Remover de la lista local
    databases.value = databases.value.filter(d => d.id !== db.id)
    
    showAlert('Base de datos eliminada exitosamente', 'success')
  } catch (error) {
    console.error('Error al eliminar base de datos:', error)
    showAlert(error.response?.data?.message || 'Error al eliminar la base de datos', 'error')
  } finally {
    hideLoading()
  }
}

// Ver credenciales de una base de datos
const viewCredentials = async (db) => {
  try {
    showLoading('Obteniendo credenciales...')
    const credentials = await getDatabaseCredentials(db.id)
    
    // Actualizar la base de datos con las credenciales completas
    const index = databases.value.findIndex(d => d.id === db.id)
    if (index !== -1) {
      databases.value[index] = {
        ...databases.value[index],
        ...credentials
      }
    }
    
    showAlert('Credenciales obtenidas exitosamente', 'success')
  } catch (error) {
    console.error('Error al obtener credenciales:', error)
    showAlert(error.response?.data?.message || 'Error al obtener credenciales', 'error')
  } finally {
    hideLoading()
  }
}

// Rotar credenciales (generar nueva contraseña)
const rotateDbCredentials = async (db) => {
  if (!confirm(`¿Deseas generar una nueva contraseña para "${db.name}"? La contraseña anterior dejará de funcionar.`)) {
    return
  }
  
  try {
    showLoading('Rotando credenciales...')
    const newCredentials = await rotateCredentials(db.id)
    
    // Actualizar la base de datos con las nuevas credenciales
    const index = databases.value.findIndex(d => d.id === db.id)
    if (index !== -1) {
      databases.value[index] = {
        ...databases.value[index],
        ...newCredentials
      }
    }
    
    showAlert('Credenciales actualizadas exitosamente', 'success')
  } catch (error) {
    console.error('Error al rotar credenciales:', error)
    showAlert(error.response?.data?.message || 'Error al rotar credenciales', 'error')
  } finally {
    hideLoading()
  }
}

onMounted(() => {
  // Cargar bases de datos al montar el componente
  // loadDatabases() // TODO: Verificar endpoint correcto para listar bases de datos
  
  // Observer para animaciones
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
grid-template-columns: repeat(3, 1fr);
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

/* ============================================
   MODAL DE CREACIÓN - GLASSMORPHISM
   ============================================ */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content-glass {
  background: rgba(15, 15, 16, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 32px;
  max-width: 650px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  position: relative;
  animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Scrollbar personalizado para el modal */
.modal-content-glass::-webkit-scrollbar {
  width: 8px;
}

.modal-content-glass::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.modal-content-glass::-webkit-scrollbar-thumb {
  background: rgba(0, 191, 255, 0.3);
  border-radius: 10px;
}

.modal-content-glass::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 191, 255, 0.5);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #fff;
  background: linear-gradient(135deg, #00bfff 0%, #0080ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-subtitle {
  color: #94a3b8;
  margin: 0 0 32px 0;
  font-size: 1rem;
}

.step-content {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Grid de motores de BD */
.engine-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}

.engine-card {
  background: rgba(255, 255, 255, 0.03);
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.engine-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--engine-color, #00bfff) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.engine-card:hover {
  border-color: var(--engine-color, rgba(0, 191, 255, 0.4));
  transform: translateY(-4px);
  box-shadow: 0 8px 24px var(--engine-color, rgba(0, 191, 255, 0.15));
}

.engine-card:hover::before {
  opacity: 0.15;
}

.engine-card.selected {
  border-color: var(--engine-color, #00bfff);
  background: linear-gradient(135deg, var(--engine-color, #00bfff) 0%, transparent 100%);
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2), 0 0 20px var(--engine-color, rgba(0, 191, 255, 0.3));
}

.engine-card.selected::before {
  opacity: 0.2;
}

/* Tarjetas deshabilitadas */
.engine-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.engine-card.disabled:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.engine-card.disabled::before {
  opacity: 0 !important;
}

.engine-icon {
  width: 42px;
  height: 42px;
  margin: 0 auto 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.engine-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.engine-card h3 {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #fff;
  border: none;
  padding: 0;
  text-transform: none;
  letter-spacing: normal;
  position: relative;
  z-index: 1;
}

.engine-desc {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0 0 10px 0;
  line-height: 1.3;
  position: relative;
  z-index: 1;
}

.engine-meta {
  font-size: 0.7rem;
  color: #64748b;
  font-family: monospace;
  position: relative;
  z-index: 1;
}

/* Badges de estado */
.badge-available {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: 'Roboto Mono', monospace;
}

.badge-coming-soon {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: 'Roboto Mono', monospace;
}

/* Formulario del paso 2 */
.modal-form {
  margin-top: 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 8px;
}

.form-group input,
.form-group select {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #00bfff;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 4px rgba(0, 191, 255, 0.1);
}

.form-hint {
  display: block;
  margin-top: 6px;
  font-size: 0.8rem;
  color: #64748b;
}

/* Vista previa de conexión */
.connection-preview {
  background: rgba(0, 191, 255, 0.05);
  border: 1px solid rgba(0, 191, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.connection-preview h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #00bfff;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 16px;
}

.preview-item:last-child {
  margin-bottom: 0;
}

.preview-label {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
  min-width: 140px;
}

.preview-value {
  font-size: 0.9rem;
  color: #e2e8f0;
  font-family: monospace;
  text-align: right;
}

.preview-code {
  font-size: 0.8rem;
  color: #00bfff;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 12px;
  border-radius: 6px;
  display: block;
  overflow-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  flex: 1;
  line-height: 1.4;
}

/* Botones del modal */
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
}

.btn-primary,
.btn-outline {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  font-weight: 600;
  font-family: 'Roboto Mono', monospace;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2),
              0 0 40px rgba(255, 255, 255, 0.1);
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.4),
              0 0 60px rgba(255, 255, 255, 0.2),
              0 0 90px rgba(255, 255, 255, 0.1);
  color: #fff;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-outline {
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.btn-outline:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.btn-back:hover {
  border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}

.btn-back svg {
  width: 18px;
  height: 18px;
}

/* Responsive para el modal */
@media (max-width: 768px) {
  .modal-content-glass {
    padding: 24px;
  }

  .modal-title {
    font-size: 1.4rem;
  }

  .engine-grid {
    grid-template-columns: 1fr;
  }

  .preview-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .preview-label {
    min-width: auto;
  }

  .preview-value {
    text-align: left;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-outline {
    width: 100%;
  }
}

</style>