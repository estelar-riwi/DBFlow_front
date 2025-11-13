<template>
<div class="dashboard-view fade-in-view">
<div class="view-header stagger-item" style="--stagger-index: 0">
    <h1>Mis Bases de Datos</h1>
    <div class="header-actions">
        <div v-if="tokenTimeRemaining" class="token-timer" :class="{ 'warning': tokenTimeRemaining < 300 }" title="Tiempo de sesión restante">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
            </svg>
            <span class="timer-label">Sesión:</span>
            <span class="timer-value">{{ formatTokenTime(tokenTimeRemaining) }}</span>
        </div>
        <button v-if="hasAnyDatabase" class="btn-primary" @click="openCreateModal">
            <span class="desktop-text">Crear Base de Datos</span>
            <span class="mobile-text">+ Crear</span>
        </button>
    </div>
</div>

<section class="quota-section reveal-on-scroll stagger-item" style="--stagger-index: 1">
    <h3>Bases de Datos</h3>
    
    <!-- Mensaje cuando no hay bases de datos -->
    <div v-if="!hasAnyDatabase" class="empty-databases-message">
        <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <h4>No tienes bases de datos creadas</h4>
        <p>Crea tu primera base de datos para comenzar</p>
        <button class="btn-create-first" @click="openCreateModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 4v16m8-8H4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Crear Base de Datos
        </button>
    </div>
    
    <!-- Grid de contadores -->
    <div v-else class="quota-grid">
    <StatCard v-if="countByEngine('MySQL') > 0" class="stagger-child" style="--child-index: 0" title="MYSQL" :value="`${countByEngine('MySQL')} / ${databaseLimit}`" subtitle="Instancias usadas" logo="/logos/mysql.svg" cardColor="#00758F" />
    <StatCard v-if="countByEngine('PostgreSQL') > 0" class="stagger-child" style="--child-index: 1" title="POSTGRESQL" :value="`${countByEngine('PostgreSQL')} / ${databaseLimit}`" subtitle="Instancias usadas" logo="/logos/postgresql.svg" cardColor="#336791" />
    <StatCard v-if="countByEngine('MongoDB') > 0" class="stagger-child" style="--child-index: 2" title="MONGODB" :value="`${countByEngine('MongoDB')} / ${databaseLimit}`" subtitle="Instancias usadas" logo="/logos/mongodb.svg" cardColor="#47A248" />
    <StatCard v-if="countByEngine('Cassandra') > 0" class="stagger-child" style="--child-index: 3" title="CASSANDRA" :value="`${countByEngine('Cassandra')} / ${databaseLimit}`" subtitle="Instancias usadas" logo="/logos/cassandra.svg" cardColor="#1287B1" />
    <StatCard v-if="countByEngine('SQL Server') > 0" class="stagger-child" style="--child-index: 4" title="SQL SERVER" :value="`${countByEngine('SQL Server')} / ${databaseLimit}`" subtitle="Instancias usadas" logo="/logos/sqlserver.svg" cardColor="#8B5CF6" />
    <StatCard v-if="countByEngine('Redis') > 0" class="stagger-child" style="--child-index: 5" title="REDIS" :value="`${countByEngine('Redis')} / ${databaseLimit}`" subtitle="Instancias usadas" logo="/logos/redis.svg" cardColor="#DC382D" />
    </div>
</section>

<section class="instances-section reveal-on-scroll stagger-item" style="--stagger-index: 2">
    <div class="toolbar">
    <div class="toolbar-field">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input v-model="searchTerm" placeholder="Buscar..." />
    </div>
    <select v-model="filterEngine" class="toolbar-select">
        <option value="">Todos los gestores</option>
        <option>MySQL</option>
        <option>PostgreSQL</option>
        <option>MongoDB</option>
        <option>Cassandra</option>
        <option>SQL Server</option>
        <option>Redis</option>
    </select>
    </div>

    <div class="db-table-container">
    <!-- Vista de tabla para desktop -->
    <table class="db-table desktop-table">
        <thead>
        <tr>
            <th class="col-priority-1">Estado</th>
            <th class="col-priority-1">Nombre</th>
            <th class="col-priority-2">Gestor</th>
            <th class="col-priority-3">Host</th>
            <th class="col-priority-4">Puerto</th>
            <th class="col-priority-4">Usuario</th>
            <th class="col-priority-5">Contraseña</th>
            <th class="col-priority-1">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="db in filteredDbs" :key="db.id">
            <td class="col-priority-1">
                <span :class="'badge '+(db.status==='Activo'?'badge-success':'')">{{ db.status }}</span>
            </td>
            <td class="col-priority-1">
                <div class="db-name-cell">
                    <span class="db-name">{{ db.name }}</span>
                    <button 
                      class="icon-btn-small" 
                      @click="copyToClipboard(db.name)" 
                      title="Copiar nombre"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                </div>
            </td>
            <td class="col-priority-2">
                <span class="engine-badge" :class="`engine-${db.engine.toLowerCase().replace(/\s+/g, '')}`">{{ db.engine }}</span>
            </td>
            <td class="col-priority-3">
                <div class="compact-cell">
                    <span class="cell-text" :title="db.host">{{ db.host }}</span>
                    <button 
                      class="icon-btn-small" 
                      @click="copyToClipboard(db.host)" 
                      title="Copiar"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                </div>
            </td>
            <td class="col-priority-4">{{ db.port }}</td>
            <td class="col-priority-4">
                <div class="compact-cell">
                    <span class="cell-text">{{ db.username || 'N/A' }}</span>
                    <button 
                      class="icon-btn-small" 
                      @click="copyToClipboard(db.username)" 
                      :disabled="!db.username"
                      title="Copiar"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                </div>
            </td>
            <td class="col-priority-5">
                <div class="compact-cell">
                    <span class="cell-text">{{ db.passwordVisible ? db.password : masked(db.password) }}</span>
                    <button 
                      class="icon-btn-small" 
                      @click="copyPasswordAndHide(db)" 
                      :disabled="!db.passwordVisible"
                      :title="!db.passwordVisible ? 'Ya copiada' : 'Copiar'"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                </div>
            </td>
            <td class="col-priority-1">
                <div class="actions-compact">
                    <button 
                      class="action-btn-compact" 
                      @click="viewCredentials(db)" 
                      title="Ver credenciales completas"
                    >
                      Ver
                    </button>
                    <button class="action-btn-compact delete" @click="removeDatabase(db)" title="Eliminar base de datos">Borrar</button>
                </div>
            </td>
        </tr>
        <tr v-if="filteredDbs.length === 0">
            <td colspan="8" class="empty-state">No se encontraron bases de datos</td>
        </tr>
        </tbody>
    </table>
    
    <!-- Vista de tarjetas para móvil -->
    <div class="mobile-cards">
        <div v-for="db in filteredDbs" :key="db.id" class="db-card">
            <div class="card-header">
                <span :class="'badge '+(db.status==='Activo'?'badge-success':'')">{{ db.status }}</span>
                <span class="card-engine">{{ db.engine }}</span>
            </div>
            
            <div class="card-body">
                <div class="card-row">
                    <span class="card-label">📝 Nombre</span>
                    <div class="card-value-group">
                        <span class="card-value">{{ db.name }}</span>
                        <button class="icon-btn-card" @click="copyToClipboard(db.name)" title="Copiar nombre">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                    </div>
                </div>
                
                <div class="card-row">
                    <span class="card-label">🌐 Host</span>
                    <div class="card-value-group">
                        <span class="card-value">{{ db.host }}</span>
                        <button class="icon-btn-card" @click="copyToClipboard(db.host)" title="Copiar host">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                    </div>
                </div>
                
                <div class="card-row">
                    <span class="card-label">🔌 Puerto</span>
                    <span class="card-value-simple">{{ db.port }}</span>
                </div>
                
                <div class="card-row">
                    <span class="card-label">👤 Usuario</span>
                    <div class="card-value-group">
                        <span class="card-value">{{ db.username || 'N/A' }}</span>
                        <button class="icon-btn-card" @click="copyToClipboard(db.username)" :disabled="!db.username" title="Copiar usuario">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                    </div>
                </div>
                
                <div class="card-row">
                    <span class="card-label">🔐 Contraseña</span>
                    <div class="card-value-group">
                        <span class="card-value">{{ db.passwordVisible ? db.password : masked(db.password) }}</span>
                        <button 
                          class="icon-btn-card" 
                          @click="copyPasswordAndHide(db)" 
                          :disabled="!db.passwordVisible"
                          :title="!db.passwordVisible ? 'Ya copiada' : 'Copiar contraseña'"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="card-actions">
                <button class="action-btn" @click="viewCredentials(db)" title="Ver credenciales">
                    Ver Credenciales
                </button>
                <button class="action-btn delete" @click="removeDatabase(db)" title="Eliminar">
                    Borrar
                </button>
            </div>
        </div>
        
        <div v-if="filteredDbs.length === 0" class="empty-state-mobile">
            No se encontraron bases de datos
        </div>
    </div>
    </div>
</section>

<!-- Modal Ver Credenciales -->
<div v-if="showCredentials" class="modal-overlay" @click.self="closeCredentials">
    <div class="modal-content-glass credentials-modal">
        <button class="modal-close-btn" @click="closeCredentials">×</button>
        
        <div class="step-content">
            <h2 class="modal-title">🔑 Credenciales de {{ selectedDb?.name || 'Base de Datos' }}</h2>
            <p class="modal-subtitle">Utiliza estos datos para conectarte a tu base de datos</p>
            
            <div class="credentials-container">
                <!-- Host -->
                <div class="credential-item">
                    <span class="credential-label">🌐 Host:</span>
                    <div class="credential-value-wrapper">
                        <span class="credential-value">{{ currentCredentials?.host || 'N/A' }}</span>
                        <button class="copy-btn" @click="copyToClipboard(currentCredentials?.host)" title="Copiar host">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Puerto -->
                <div class="credential-item">
                    <span class="credential-label">🔌 Puerto:</span>
                    <div class="credential-value-wrapper">
                        <span class="credential-value">{{ currentCredentials?.port || 'N/A' }}</span>
                        <button class="copy-btn" @click="copyToClipboard(currentCredentials?.port)" title="Copiar puerto">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Usuario -->
                <div class="credential-item">
                    <span class="credential-label">👤 Usuario:</span>
                    <div class="credential-value-wrapper">
                        <span class="credential-value">{{ currentCredentials?.username || 'N/A' }}</span>
                        <button class="copy-btn" @click="copyToClipboard(currentCredentials?.username)" title="Copiar usuario">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Contraseña -->
                <div class="credential-item credential-password">
                    <span class="credential-label">🔐 Contraseña:</span>
                    <div class="credential-value-wrapper">
                        <span class="credential-value password-value">{{ currentCredentials?.password || 'N/A' }}</span>
                        <button class="copy-btn" @click="copyToClipboard(currentCredentials?.password)" title="Copiar contraseña">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Base de datos -->
                <div class="credential-item">
                    <span class="credential-label">💾 Base de datos:</span>
                    <div class="credential-value-wrapper">
                        <span class="credential-value">{{ currentCredentials?.databaseName || selectedDb?.name || 'N/A' }}</span>
                        <button class="copy-btn" @click="copyToClipboard(currentCredentials?.databaseName || selectedDb?.name)" title="Copiar nombre de base de datos">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Advertencia importante -->
            <div class="warning-box">
                <span class="warning-icon">⚠️</span>
                <div class="warning-content">
                    <p class="warning-title">IMPORTANTE:</p>
                    <p class="warning-text">Esta contraseña ha sido regenerada. Actualiza tus aplicaciones con las nuevas credenciales.</p>
                </div>
            </div>
            
            <div class="modal-actions">
                <button type="button" class="btn-outline" @click="closeCredentials">Cerrar</button>
            </div>
        </div>
    </div>
</div>

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
              'disabled': engine.name !== 'MySQL' && engine.name !== 'PostgreSQL' && engine.name !== 'SQL Server' && engine.name !== 'MongoDB'
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
            <span v-if="engine.name === 'MySQL' || engine.name === 'PostgreSQL' || engine.name === 'SQL Server' || engine.name === 'MongoDB'" class="badge-available">✓ Disponible</span>
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

        <div class="connection-preview" :class="`engine-${newDb.engine?.toLowerCase().replace(/\s+/g, '')}`">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import StatCard from '../components/StatCard.vue'
import { showAlert } from '@/utils/notify'
import { 
  createDatabase, 
  getDatabaseCredentials, 
  deleteDatabase, 
  getAllDatabases, 
  rotateCredentials, 
  getDatabasesCount,
  createPostgreSQLDatabase,
  getPostgreSQLCredentials,
  rotatePostgreSQLCredentials,
  deletePostgreSQLDatabase,
  createSQLServerDatabase,
  getSQLServerCredentials,
  rotateSQLServerCredentials,
  deleteSQLServerDatabase,
  createMongoDBDatabase,
  getMongoDBCredentials,
  rotateMongoDBCredentials,
  deleteMongoDBDatabase
} from '@/services/databaseService'
import { showLoading, hideLoading } from '@/store/loading'
import { logoutAndRedirect } from '@/services/authService'
import { getUserPlan, syncUserPlan } from '@/services/subscriptionService'
import { getDatabaseLimit, canCreateDatabase } from '@/config/plans'

const router = useRouter()
const searchTerm = ref('')
const filterEngine = ref('')
const databases = ref([])
const userPlan = ref(getUserPlan()) // Plan del usuario
const databaseLimit = ref(getDatabaseLimit(userPlan.value)) // Límite según el plan
const tokenTimeRemaining = ref(0)

const databasesCount = ref({
  mysql: 0,
  postgresql: 0,
  mongodb: 0,
  cassandra: 0,
  sqlserver: 0,
  redis: 0
})

const filteredDbs = computed(() => {
const term = searchTerm.value.toLowerCase()
const eng = filterEngine.value
return databases.value
    .filter(db => (eng ? db.engine === eng : true))
    .filter(db => (term ? db.name.toLowerCase().includes(term) : true))
})

// Verificar si hay alguna base de datos con instancias
const hasAnyDatabase = computed(() => {
  return countByEngine('MySQL') > 0 || 
         countByEngine('PostgreSQL') > 0 || 
         countByEngine('MongoDB') > 0 || 
         countByEngine('Cassandra') > 0 || 
         countByEngine('SQL Server') > 0 || 
         countByEngine('Redis') > 0
})

const countByEngine = (eng) => {
  // Mapear nombres de motor a las claves del objeto count
  const engineMap = {
    'MySQL': 'mysql',
    'PostgreSQL': 'postgresql',
    'MongoDB': 'mongodb',
    'Cassandra': 'cassandra',
    'SQL Server': 'sqlserver',
    'Redis': 'redis'
  }
  
  const key = engineMap[eng]
  const apiCount = key ? databasesCount.value[key] || 0 : 0
  
  // Si el conteo de la API es 0, contar desde las bases de datos locales como fallback
  if (apiCount === 0 && databases.value.length > 0) {
    const localCount = databases.value.filter(db => db.engine === eng).length
    console.log(`🔄 Usando conteo local para ${eng}: ${localCount}`)
    return localCount
  }
  
  return apiCount
}

const showCreate = ref(false)
const createStep = ref(1)
const newDb = ref({ name: '', engine: '' })

// Estado del modal de credenciales
const showCredentials = ref(false)
const selectedDb = ref(null)
const currentCredentials = ref(null)

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
  // MySQL, PostgreSQL, SQL Server y MongoDB están disponibles
  if (engineName !== 'MySQL' && engineName !== 'PostgreSQL' && engineName !== 'SQL Server' && engineName !== 'MongoDB') {
    showAlert({ 
      icon: 'info', 
      title: 'Próximamente', 
      text: `${engineName} estará disponible próximamente. Por ahora solo MySQL, PostgreSQL, SQL Server y MongoDB están habilitados.`,
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

// Password masking
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

// Copiar contraseña y ocultarla permanentemente
const copyPasswordAndHide = async (db) => {
    // Si la contraseña no está visible, mostrar advertencia
    if (!db.passwordVisible) {
        await showAlert({ 
            icon: 'warning', 
            title: 'Contraseña no disponible', 
            text: 'La contraseña ya fue copiada anteriormente. Usa el botón "Ver" para obtener una nueva contraseña.',
            confirmText: 'Entendido'
        })
        return
    }
    
    // Copiar la contraseña
    try {
        await navigator.clipboard.writeText(db.password)
        await showAlert({ 
            icon: 'success', 
            title: 'Copiada', 
            text: 'Contraseña copiada. Por seguridad, ahora está oculta permanentemente. Usa "Ver" para obtener una nueva.',
            autoClose: 2500 
        })
        
        // Ocultar la contraseña permanentemente después de copiarla
        db.passwordVisible = false
        
        // Guardar en localStorage que esta contraseña ya fue copiada
        const hiddenPasswords = JSON.parse(localStorage.getItem('hiddenPasswords') || '[]')
        if (!hiddenPasswords.includes(db.id)) {
            hiddenPasswords.push(db.id)
            localStorage.setItem('hiddenPasswords', JSON.stringify(hiddenPasswords))
        }
    } catch (e) {
        console.warn('Clipboard API no disponible, usando fallback', e)
        const textarea = document.createElement('textarea')
        textarea.value = db.password
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        await showAlert({ 
            icon: 'success', 
            title: 'Copiada', 
            text: 'Contraseña copiada. Por seguridad, ahora está oculta permanentemente.',
            autoClose: 2500 
        })
        
        // Ocultar la contraseña permanentemente después de copiarla
        db.passwordVisible = false
        
        // Guardar en localStorage que esta contraseña ya fue copiada
        const hiddenPasswords = JSON.parse(localStorage.getItem('hiddenPasswords') || '[]')
        if (!hiddenPasswords.includes(db.id)) {
            hiddenPasswords.push(db.id)
            localStorage.setItem('hiddenPasswords', JSON.stringify(hiddenPasswords))
        }
    }
}

const openCreateModal = () => {
  newDb.value = { name: '', engine: '' }
  createStep.value = 1
  showCreate.value = true
}

// Función para formatear el tiempo restante del token
const formatTokenTime = (seconds) => {
  if (seconds <= 0) return '0m 0s'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m ${secs}s`
}

// Función para calcular el tiempo restante del token
const updateTokenTime = () => {
  const token = localStorage.getItem('authToken')
  if (!token) {
    tokenTimeRemaining.value = 0
    return
  }
  
  try {
    // Decodificar el token JWT (sin verificar, solo para leer el payload)
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    
    const payload = JSON.parse(jsonPayload)
    const exp = payload.exp * 1000 // Convertir a milisegundos
    const now = Date.now()
    const remaining = Math.max(0, Math.floor((exp - now) / 1000))
    
    tokenTimeRemaining.value = remaining
    
    // Si el token expiró, cerrar sesión
    if (remaining <= 0) {
      logoutAndRedirect()
    }
  } catch (error) {
    console.error('Error al decodificar token:', error)
    tokenTimeRemaining.value = 0
  }
}

// Función de debug para verificar autenticación
const createDb = async () => {
  if (!newDb.value.name || !newDb.value.engine) {
    await showAlert({ 
      icon: 'error', 
      title: 'Campos incompletos', 
      text: 'Por favor completa todos los campos',
      confirmText: 'Entendido'
    })
    return
  }

  // Validar límite del plan antes de crear
  const currentCount = countByEngine(newDb.value.engine)
  const canCreate = canCreateDatabase(userPlan.value, currentCount)
  
  if (!canCreate) {
    const planName = userPlan.value === 'free' ? 'Gratuito' : 
                     userPlan.value === 'intermediate' ? 'Intermedio' : 'Avanzado'
    
    await showAlert({ 
      icon: 'warning', 
      title: '⚠️ Límite alcanzado', 
      text: `Has alcanzado el límite de ${databaseLimit.value} bases de datos de ${newDb.value.engine} para tu plan ${planName}.\n\n¿Deseas actualizar tu plan para obtener más bases de datos?`,
      confirmText: 'Ver planes',
      showCancel: true,
      cancelText: 'Cancelar'
    }).then((result) => {
      if (result && result.isConfirmed) {
        router.push({ name: 'Subscription' })
      }
    })
    return
  }

  try {
    showLoading('Creando base de datos...')
    
    let response;
    
    // Llamar a la API correspondiente según el engine
    if (newDb.value.engine === 'PostgreSQL') {
      response = await createPostgreSQLDatabase({
        databaseName: newDb.value.name,
        engine: newDb.value.engine
      })
    } else if (newDb.value.engine === 'SQL Server') {
      response = await createSQLServerDatabase({
        databaseName: newDb.value.name
        // No pasamos engine aquí porque databaseService.js ya lo incluye como "SQL Server"
      })
    } else if (newDb.value.engine === 'MongoDB') {
      response = await createMongoDBDatabase({
        databaseName: newDb.value.name,
        engine: newDb.value.engine
      })
    } else {
      // MySQL por defecto
      response = await createDatabase({
        databaseName: newDb.value.name,
        engine: newDb.value.engine || 'MySQL'
      })
    }
    
    console.log('✅ Base de datos creada exitosamente:', response)
    console.log('📋 Engine de la BD creada:', response.engine)
    console.log('📋 Nombre de la BD creada:', response.databaseName)
    
    // Recargar las bases de datos y el conteo
    console.log('🔄 Recargando lista de bases de datos...')
    await loadDatabases()
    console.log('🔄 Recargando conteo de bases de datos...')
    await loadDatabasesCount()
    
    // Resetear el formulario
    newDb.value = { name: '', engine: '' }
    createStep.value = 1
    showCreate.value = false
    
    await showAlert({ 
      icon: 'success', 
      title: '¡Base de datos creada!', 
      text: `La base de datos "${response.databaseName}" ha sido creada exitosamente`,
      confirmText: 'Perfecto',
      autoClose: 1000  // Se cierra automáticamente después de 1 segundo
    })
  } catch (error) {
    console.error('Error al crear base de datos:', error)
    console.error('Response data:', error.response?.data)
    console.error('Response status:', error.response?.status)
    
    // Si es un error 400, el payload es inválido
    if (error.response?.status === 400) {
      const errorDetail = error.response?.data?.errors 
        || error.response?.data?.message 
        || error.response?.data?.title
        || 'El servidor rechazó la petición';
      
      let errorMessage = '❌ Error 400 - Bad Request\n\n';
      
      if (typeof errorDetail === 'object') {
        errorMessage += 'Detalles del error:\n';
        Object.keys(errorDetail).forEach(key => {
          errorMessage += `• ${key}: ${JSON.stringify(errorDetail[key])}\n`;
        });
      } else {
        errorMessage += errorDetail;
      }
      
      errorMessage += '\n\nVerifica en la consola para más detalles.';
      
      await showAlert({ 
        icon: 'error', 
        title: 'Petición Inválida (400)', 
        text: errorMessage,
        confirmText: 'Entendido'
      })
      return
    }
    
    // Si es un error 405, el método no está permitido (problema del backend)
    if (error.response?.status === 405) {
      await showAlert({ 
        icon: 'error', 
        title: 'Método no permitido (405)', 
        text: 'El backend no acepta peticiones POST a este endpoint.\n\nVerifica:\n• Que el endpoint /api/Databases/MySQL acepte POST\n• Que CORS esté configurado correctamente\n• Que el backend esté corriendo en el puerto 5030',
        confirmText: 'Entendido'
      })
      return
    }
    
    // Si es un error 401, el token expiró - cerrar sesión automáticamente
    if (error.response?.status === 401) {
      console.warn('⚠️ Error 401 - Token expirado');
      
      // Mostrar mensaje y cerrar sesión automáticamente
      await showAlert({ 
        icon: 'warning', 
        title: '⚠️ Sesión Expirada', 
        text: 'Tu sesión ha expirado. Serás redirigido al inicio de sesión.',
        confirmText: 'Entendido',
        autoClose: 3000  // Se cierra automáticamente después de 3 segundos
      })
      
      console.log('🚪 Cerrando sesión automáticamente...');
      
      // Cerrar sesión y redirigir
      await logoutAndRedirect(router)
      
      return
    }
    
    const errorMessage = error.response?.data?.message 
      || error.response?.data?.title
      || error.response?.data?.errors
      || error.message
      || 'Error al crear la base de datos'
    
    await showAlert({ 
      icon: 'error', 
      title: `Error al crear base de datos (${error.response?.status || 'RED'})`, 
      text: typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage,
      confirmText: 'Entendido'
    })
  } finally {
    hideLoading()
  }
}

// Cargar bases de datos desde la API
const loadDatabases = async () => {
  try {
    showLoading('Cargando bases de datos...')
    
    console.log('📡 Intentando cargar bases de datos...');
    
    const data = await getAllDatabases()
    
    console.log('📥 Bases de datos recibidas del backend:', data)
    
    // Obtener las contraseñas que ya fueron copiadas (ocultas permanentemente)
    const hiddenPasswords = JSON.parse(localStorage.getItem('hiddenPasswords') || '[]')
    
    // Solo actualizar si hay datos
    if (data && Array.isArray(data)) {
      console.log('🔍 Mapeando bases de datos recibidas del backend...')
      console.log('📦 DATOS COMPLETOS DEL BACKEND:', JSON.stringify(data, null, 2))
      
      // Mapear la respuesta de la API al formato esperado
      databases.value = data.map(db => {
        console.log('📦 BD del backend:', {
          id: db.id,
          name: db.databaseName || db.name,
          engine: db.engine,
          engineName: db.engineName, // ✨ Campo correcto del backend
          engineType: typeof db.engine,
          todasLasPropiedades: Object.keys(db)
        })
        
        // ✅ El backend devuelve "engineName" en lugar de "engine"
        const engine = db.engineName || db.engine || 'MySQL';
        
        // Normalizar 'SQLServer' a 'SQL Server' para la UI
        const normalizedEngine = engine === 'SQLServer' ? 'SQL Server' : engine;
        
        console.log(`🔧 Engine detectado para "${db.databaseName || db.name}": ${engine} → ${normalizedEngine}`)
        console.log(`⚠️ ADVERTENCIA: db.engine = ${db.engine}, db.engineName = ${db.engineName}`)
        
        // Configurar host y port según el engine
        let defaultHost = 'mysql.dbflow.dev';
        let defaultPort = 3306;
        
        if (normalizedEngine === 'PostgreSQL') {
          defaultHost = 'postgres.dbflow.dev';
          defaultPort = 5432;
        } else if (normalizedEngine === 'MongoDB') {
          defaultHost = 'mongo.dbflow.dev';
          defaultPort = 27017;
        } else if (normalizedEngine === 'Redis') {
          defaultHost = 'redis.dbflow.dev';
          defaultPort = 6379;
        } else if (normalizedEngine === 'Cassandra') {
          defaultHost = 'cassandra.dbflow.dev';
          defaultPort = 9042;
        } else if (normalizedEngine === 'SQL Server' || normalizedEngine === 'SQLServer') {
          defaultHost = 'sqlserver.dbflow.dev';
          defaultPort = 1433;
        }
        
        return {
          id: db.id,
          name: db.databaseName || db.name,
          engine: normalizedEngine, // ✅ Usar el engine normalizado para la UI
          host: db.host || defaultHost,
          port: db.port || defaultPort,
          status: db.status || 'Activo',
          username: db.username,
          password: db.password || '••••••••',
          // Si la contraseña ya fue copiada antes, mantenerla oculta
          passwordVisible: !hiddenPasswords.includes(db.id)
        }
      })
      
      console.log('✅ Bases de datos mapeadas:', databases.value)
      console.log('📊 Total de bases de datos:', databases.value.length)
      
      // Contar por motor
      const countByEngineLocal = databases.value.reduce((acc, db) => {
        acc[db.engine] = (acc[db.engine] || 0) + 1
        return acc
      }, {})
      console.log('📊 Conteo local por motor:', countByEngineLocal)
    }
  } catch (error) {
    console.error('❌ Error al cargar bases de datos:', error)
    console.error('❌ Response:', error.response?.data)
    console.error('❌ Status:', error.response?.status)
    
    // Ocultar loading inmediatamente
    hideLoading()
    
    // Si es un error 401, verificar si acabamos de iniciar sesión
    if (error.response?.status === 401) {
      console.warn('⚠️ Error 401 al cargar bases de datos');
      
      // Verificar cuánto tiempo ha pasado desde el login
      const loginTime = localStorage.getItem('login_time');
      const now = Date.now();
      const timeSinceLogin = loginTime ? (now - parseInt(loginTime)) : Infinity;
      
      // Si acabamos de iniciar sesión (menos de 10 segundos), no cerrar sesión aún
      if (timeSinceLogin < 10000) {
        console.log('⏰ Inicio de sesión reciente, no cerrando sesión automáticamente');
        console.log('📋 Mostrando mensaje de error en lugar de cerrar sesión');
        
        await showAlert({
          icon: 'error',
          title: '❌ Error de Configuración del Backend',
          text: 'El backend está rechazando el token de autenticación.\n\nPosibles causas:\n• CORS no configurado correctamente\n• Token no incluye userId en los claims\n• Backend no permite peticiones desde este dominio\n\nContacta al equipo de backend con el archivo BACKEND_CONFIG_REQUIRED.md',
          confirmText: 'Entendido'
        });
        
        // No hacer return, continuar para que hideLoading se ejecute
      } else {
        // Si pasó más tiempo, cerrar sesión automáticamente
        console.warn('⚠️ Token expirado - cerrando sesión');
        
        await showAlert({ 
          icon: 'warning', 
          title: '⚠️ Sesión Expirada', 
          text: 'Tu sesión ha expirado. Serás redirigido al inicio de sesión.',
          confirmText: 'Entendido',
          autoClose: 3000
        })
        
        await logoutAndRedirect(router)
        return
      }
    }
    
    // Mantener la lista vacía si falla la carga
  } finally {
    hideLoading()
  }
}

// Cargar el conteo de bases de datos
const loadDatabasesCount = async () => {
  try {
    const count = await getDatabasesCount()
    console.log('📊 Conteo de bases de datos recibido:', count)
    console.log('📊 Tipo de respuesta:', typeof count)
    console.log('📊 Es array?:', Array.isArray(count))
    console.log('📊 Claves de la respuesta:', count ? Object.keys(count) : 'null')
    console.log('📊 CONTENIDO COMPLETO:', JSON.stringify(count, null, 2))
    
    // Actualizar el conteo - manejar diferentes formatos de respuesta
    if (count) {
      // Si el backend devuelve un array, convertirlo a objeto
      let countObj = count;
      
      if (Array.isArray(count)) {
        console.log('⚠️ Backend devolvió un array, convirtiendo a objeto...')
        
        // El backend devuelve: [{ engineName: "PostgreSQL", count: 2 }]
        // Necesitamos convertirlo a: { postgresql: 2, mysql: 0, ... }
        const countByEngine = {
          mysql: 0,
          postgresql: 0,
          mongodb: 0,
          cassandra: 0,
          sqlserver: 0,
          redis: 0
        };
        
        count.forEach(item => {
          const engineName = item.engineName || item.enginename || item.engine;
          const engineCount = item.count || 0;
          
          console.log(`� Contando: ${engineName} = ${engineCount}`);
          
          // Mapear engineName a la clave correcta
          if (engineName === 'MySQL') {
            countByEngine.mysql = engineCount;
          } else if (engineName === 'PostgreSQL') {
            countByEngine.postgresql = engineCount;
          } else if (engineName === 'MongoDB') {
            countByEngine.mongodb = engineCount;
          } else if (engineName === 'Cassandra') {
            countByEngine.cassandra = engineCount;
          } else if (engineName === 'SQL Server' || engineName === 'SQLServer') {
            countByEngine.sqlserver = engineCount;
          } else if (engineName === 'Redis') {
            countByEngine.redis = engineCount;
          }
        });
        
        databasesCount.value = countByEngine;
        console.log('✅ Conteo actualizado desde array:', databasesCount.value);
      } else {
        // Si es un objeto, usar el mapeo anterior
        databasesCount.value = {
          mysql: countObj.mysql || countObj.MySQL || countObj.Mysql || 0,
          postgresql: countObj.postgresql || countObj.PostgreSQL || countObj.Postgresql || 0,
          mongodb: countObj.mongodb || countObj.MongoDB || countObj.Mongodb || 0,
          cassandra: countObj.cassandra || countObj.Cassandra || 0,
          sqlserver: countObj.sqlserver || countObj.sqlServer || countObj.SQLServer || countObj['SQL Server'] || 0,
          redis: countObj.redis || countObj.Redis || 0
        }
        console.log('✅ Conteo actualizado desde objeto:', databasesCount.value);
      }
    }
  } catch (error) {
    console.error('❌ Error al cargar conteo de bases de datos:', error)
    console.error('❌ Detalles del error:', error.response?.data || error.message)
    // Mantener el conteo en 0 si falla
  }
}

// Eliminar base de datos
const removeDatabase = async (db) => {
  const result = await showAlert({ 
    icon: 'warning', 
    title: '¿Eliminar base de datos?', 
    text: `¿Estás seguro de eliminar la base de datos "${db.name}"? Esta acción no se puede deshacer.`,
    confirmText: 'Sí, eliminar',
    showCancel: true,
    cancelText: 'Cancelar'
  })
  
  // Verificar si el usuario confirmó (isConfirmed === true)
  if (!result || !result.isConfirmed) {
    return
  }
  
  try {
    showLoading('Eliminando base de datos...')
    
    // Usar la API correspondiente según el engine
    if (db.engine === 'PostgreSQL') {
      await deletePostgreSQLDatabase(db.id)
    } else if (db.engine === 'SQLServer' || db.engine === 'SQL Server') {
      await deleteSQLServerDatabase(db.id)
    } else if (db.engine === 'MongoDB') {
      await deleteMongoDBDatabase(db.id)
    } else {
      // MySQL por defecto
      await deleteDatabase(db.id)
    }
    
    // Limpiar el localStorage de contraseñas ocultas para esta BD
    const hiddenPasswords = JSON.parse(localStorage.getItem('hiddenPasswords') || '[]')
    const updatedHidden = hiddenPasswords.filter(id => id !== db.id)
    localStorage.setItem('hiddenPasswords', JSON.stringify(updatedHidden))
    
    // Recargar las bases de datos y el conteo
    await loadDatabases()
    await loadDatabasesCount()
    
    await showAlert({ 
      icon: 'success', 
      title: '¡Base de datos eliminada!', 
      text: `La base de datos "${db.name}" ha sido eliminada exitosamente`,
      confirmText: 'Entendido',
      autoClose: 1000  // Se cierra automáticamente después de 1 segundo
    })
  } catch (error) {
    console.error('Error al eliminar base de datos:', error)
    await showAlert({ 
      icon: 'error', 
      title: 'Error al eliminar', 
      text: error.response?.data?.message || 'Error al eliminar la base de datos',
      confirmText: 'Entendido'
    })
  } finally {
    hideLoading()
  }
}

// Ver credenciales de una base de datos
const viewCredentials = async (db) => {
  // Advertir al usuario que se van a rotar las credenciales
  console.log('🚀 Iniciando viewCredentials para:', db);
  
  const confirmResult = await showAlert({
    icon: 'info',
    title: '⚠️ Nota Importante',
    text: 'Al ver las credenciales, se generará una nueva contraseña. ¿Deseas continuar?',
    showCancel: true,
    confirmText: 'Sí, continuar'
  });

  console.log('📋 Resultado de confirmación:', confirmResult);

  if (!confirmResult?.isConfirmed) {
    console.log('❌ Usuario canceló la operación');
    return;
  }

  try {
    console.log('✅ Usuario confirmó, mostrando loading...');
    showLoading('Generando nuevas credenciales...')
    
    console.log('🔍 Solicitando credenciales para DB:', db)
    
    let credentials;
    
    // Usar la API correspondiente según el engine
    if (db.engine === 'PostgreSQL') {
      credentials = await getPostgreSQLCredentials(db.id)
    } else if (db.engine === 'SQLServer' || db.engine === 'SQL Server') {
      credentials = await getSQLServerCredentials(db.id)
    } else if (db.engine === 'MongoDB') {
      credentials = await getMongoDBCredentials(db.id)
    } else {
      // MySQL por defecto (usa rotación porque no tiene endpoint GET)
      credentials = await getDatabaseCredentials(db.id)
    }
    
    console.log('✅ Credenciales recibidas:', credentials)
    
    // Actualizar el usuario en la base de datos local, pero NO marcar la contraseña como visible
    // La contraseña solo se verá en el modal, no en la tabla
    const dbIndex = databases.value.findIndex(d => d.id === db.id)
    if (dbIndex !== -1) {
      databases.value[dbIndex].password = credentials.password
      databases.value[dbIndex].username = credentials.username
      // NO actualizar passwordVisible - mantener la contraseña oculta en la tabla
    }
    
    // Guardar las credenciales y la DB seleccionada
    currentCredentials.value = credentials
    selectedDb.value = db
    
    // Cerrar loading y mostrar el modal
    hideLoading();
    showCredentials.value = true
    
    console.log('✅ Modal de credenciales abierto');
  } catch (error) {
    console.error('❌ Error al obtener credenciales:', error)
    console.error('Response status:', error.response?.status)
    console.error('Response data:', error.response?.data)
    
    let errorMessage = 'Error al obtener credenciales';
    
    if (error.response?.status === 400) {
      const errorDetail = error.response?.data?.errors || error.response?.data?.message || error.response?.data;
      errorMessage = '❌ Error 400 - Bad Request\n\n';
      
      if (typeof errorDetail === 'object') {
        errorMessage += 'El servidor rechazó la petición:\n';
        Object.keys(errorDetail).forEach(key => {
          errorMessage += `• ${key}: ${JSON.stringify(errorDetail[key])}\n`;
        });
      } else {
        errorMessage += errorDetail;
      }
    } else if (error.response?.status === 404) {
      errorMessage = 'No se encontró la base de datos.\n\nPuede que haya sido eliminada.';
    } else if (error.response?.status === 403) {
      errorMessage = 'No tienes permisos para acceder a estas credenciales.';
    } else {
      errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
    }
    
    await showAlert({ 
      icon: 'error', 
      title: 'Error al obtener credenciales', 
      text: errorMessage,
      confirmText: 'Entendido'
    })
  } finally {
    console.log('🧹 Limpieza: cerrando loading en finally...');
    hideLoading()
    console.log('✅ ViewCredentials completado');
  }
}

// Cerrar modal de credenciales
const closeCredentials = () => {
  showCredentials.value = false
  selectedDb.value = null
  currentCredentials.value = null
}

// Copiar al portapapeles
const copyToClipboard = async (text) => {
  if (!text) return
  
  try {
    await navigator.clipboard.writeText(String(text))
    await showAlert({ 
      icon: 'success', 
      title: 'Copiado', 
      text: 'Copiado al portapapeles',
      autoClose: 1200 
    })
  } catch (e) {
    console.warn('Clipboard API no disponible, usando fallback', e)
    const textarea = document.createElement('textarea')
    textarea.value = String(text)
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    await showAlert({ 
      icon: 'success', 
      title: 'Copiado', 
      text: 'Copiado al portapapeles',
      autoClose: 1200 
    })
  }
}

// Rotar credenciales (generar nueva contraseña)
const rotateDbCredentials = async (db) => {
  const result = await showAlert({ 
    icon: 'info', 
    title: '¿Rotar credenciales?', 
    text: `¿Deseas generar una nueva contraseña para "${db.name}"? La contraseña anterior dejará de funcionar.`,
    confirmText: 'Sí, generar nueva',
    showCancel: true,
    cancelText: 'Cancelar'
  })
  
  // Verificar si el usuario confirmó (isConfirmed === true)
  if (!result || !result.isConfirmed) {
    return
  }
  
  try {
    showLoading('Rotando credenciales...')
    
    let newCredentials;
    
    // Usar la API correspondiente según el engine
    if (db.engine === 'PostgreSQL') {
      newCredentials = await rotatePostgreSQLCredentials(db.id)
    } else if (db.engine === 'SQLServer' || db.engine === 'SQL Server') {
      newCredentials = await rotateSQLServerCredentials(db.id)
    } else if (db.engine === 'MongoDB') {
      newCredentials = await rotateMongoDBCredentials(db.id)
    } else {
      // MySQL por defecto
      newCredentials = await rotateCredentials(db.id)
    }
    
    console.log('Nuevas credenciales:', newCredentials)
    
    // Recargar las bases de datos para obtener la nueva contraseña
    await loadDatabases()
    
    await showAlert({ 
      icon: 'success', 
      title: '¡Credenciales actualizadas!', 
      text: `Nueva contraseña generada para "${db.name}"`,
      confirmText: 'Entendido'
    })
  } catch (error) {
    console.error('Error al rotar credenciales:', error)
    await showAlert({ 
      icon: 'error', 
      title: 'Error', 
      text: error.response?.data?.message || 'Error al rotar credenciales',
      confirmText: 'Entendido'
    })
  } finally {
    hideLoading()
  }
}

onMounted(async () => {
  console.log('🚀 DatabaseList montado');
  
  // Verificar si hay token antes de hacer cualquier cosa
  const token = localStorage.getItem('authToken');
  console.log('🔑 Token presente:', token ? 'SÍ' : 'NO');
  
  if (!token) {
    console.warn('⚠️ No hay token, redirigiendo a login...');
    await showAlert({ 
      icon: 'warning', 
      title: '⚠️ Sesión No Iniciada', 
      text: 'Debes iniciar sesión para acceder a esta página.',
      confirmText: 'Ir a Login',
      autoClose: 2000
    });
    await router.push('/login');
    return;
  }
  
  // Sincronizar plan desde el backend
  await syncUserPlan()
  
  // Recargar plan actualizado
  userPlan.value = getUserPlan()
  databaseLimit.value = getDatabaseLimit(userPlan.value)
  
  console.log('📋 Plan actual del usuario:', userPlan.value)
  console.log('🔢 Límite de bases de datos:', databaseLimit.value)
  
  // Cargar bases de datos y conteo al montar el componente
  await loadDatabases()
  await loadDatabasesCount()
  
  // Inicializar el temporizador del token
  updateTokenTime()
  const tokenInterval = setInterval(updateTokenTime, 1000)
  
  // Guardar el interval para limpiarlo después
  onUnmounted(() => {
    clearInterval(tokenInterval)
  })
  
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
  padding: 0 20px;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

@media (max-width: 768px) {
  .dashboard-view {
    padding: 0 16px;
  }
}

@media (max-width: 480px) {
  .dashboard-view {
    padding: 0 12px;
  }
}

@media (max-width: 360px) {
  .dashboard-view {
    padding: 0 10px;
  }
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

.header-actions {
    display: flex;
    gap: 12px;
    align-items: center;
}

.token-timer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
  color: #94a3b8;
  font-family: 'Roboto Mono', monospace;
  transition: all 0.3s ease;
}

.token-timer svg {
  width: 18px;
  height: 18px;
  color: #64748b;
}

.token-timer .timer-label {
  color: #64748b;
  font-size: 0.85rem;
}

.token-timer .timer-value {
  color: #94a3b8;
  font-weight: 600;
}

.token-timer.warning {
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.1);
  animation: pulse-warning 2s ease-in-out infinite;
}

.token-timer.warning svg {
  color: #ef4444;
}

.token-timer.warning .timer-label,
.token-timer.warning .timer-value {
  color: #ef4444;
}

@keyframes pulse-warning {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Mostrar texto completo en desktop, texto corto en móvil */
.desktop-text {
    display: inline;
}

.mobile-text {
    display: none;
}

.view-subtitle { color:#94a3b8; margin-top:6px; font-size:.95rem; }

.toolbar { 
  display: flex; 
  gap: 12px; 
  align-items: center; 
  margin-bottom: 20px; 
  flex-wrap: wrap; 
}

.toolbar-field { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  background: #0f0f10; 
  border: 1px solid #222; 
  color: #9aa0a6; 
  padding: 8px 12px; 
  border-radius: 10px; 
  transition: border-color 0.2s;
  flex: 1;
  min-width: 220px;
}

.toolbar-field:focus-within { 
  border-color: #00bfff; 
}

.toolbar-field input { 
  background: transparent; 
  border: none; 
  outline: none; 
  color: #fff; 
  width: 100%;
  flex: 1;
}

.toolbar-field svg { 
  width: 18px; 
  height: 18px; 
  flex-shrink: 0;
}

.toolbar-select { 
  background: #0f0f10; 
  border: 1px solid #222; 
  color: #fff; 
  padding: 8px 12px; 
  border-radius: 10px; 
  cursor: pointer; 
  transition: border-color 0.2s;
  min-width: 200px;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toolbar-select:hover { 
  border-color: #444; 
}

.toolbar-select option {
  white-space: normal;
}

.quota-section { 
  margin-bottom: 40px; 
}

.empty-databases-message {
  background: #0f0f10;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 64px 32px;
  text-align: center;
  animation: fadeIn 0.5s ease;
}

.empty-databases-message .empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-databases-message .empty-icon svg {
  width: 40px;
  height: 40px;
  color: #64748b;
}

.empty-databases-message h4 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 8px;
  text-transform: none;
  letter-spacing: 0;
  border: none;
  padding: 0;
}

.empty-databases-message p {
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 32px;
}

.btn-create-first {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: 'Roboto Mono', monospace;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2),
              0 0 40px rgba(255, 255, 255, 0.1);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2),
                0 0 40px rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.4),
                0 0 60px rgba(255, 255, 255, 0.2),
                0 0 90px rgba(255, 255, 255, 0.1);
  }
}

.btn-create-first svg {
  width: 20px;
  height: 20px;
}

.btn-create-first:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.4),
              0 0 60px rgba(255, 255, 255, 0.2),
              0 0 90px rgba(255, 255, 255, 0.1);
}

.btn-create-first:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .empty-databases-message {
    padding: 48px 24px;
  }
  
  .empty-databases-message .empty-icon {
    width: 64px;
    height: 64px;
  }
  
  .empty-databases-message .empty-icon svg {
    width: 32px;
    height: 32px;
  }
  
  .empty-databases-message h4 {
    font-size: 1.25rem;
  }
  
  .empty-databases-message p {
    font-size: 0.9rem;
  }
}

.quota-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 992px) {
  .quota-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 640px) {
  .quota-section {
    margin-bottom: 30px;
  }
  
  .quota-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .quota-section {
    margin-bottom: 24px;
  }
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
  overflow-x: visible;
  overflow-y: visible;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.db-table { 
  width: 100%; 
  border-collapse: collapse;
  table-layout: auto;
}

.db-table th, .db-table td { 
  padding: 12px 10px; 
  text-align: left;
  vertical-align: middle;
}

.db-table thead th { 
  background: rgba(255,255,255,0.03); 
  font-size: .85rem; 
  color: #cbd5e1; 
  font-weight: 600;
  white-space: nowrap;
}

.db-table tbody tr { 
  border-top: 1px solid rgba(255,255,255,0.06); 
}

.db-table tbody tr:hover { 
  background: rgba(255,255,255,0.03); 
}

/* Celdas compactas con texto e icono */
.compact-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 200px;
}

.cell-text {
  font-family: monospace;
  font-size: 0.85rem;
  color: #e2e8f0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.db-name-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.db-name {
  font-family: monospace;
  font-size: 0.9rem;
  color: #fff;
  font-weight: 500;
}

.engine-badge {
  background: rgba(0, 191, 255, 0.1);
  color: #00bfff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

/* Colores específicos para cada motor de base de datos */
.engine-badge.engine-mysql {
  background: rgba(0, 117, 143, 0.15);
  color: #00758F;
  border: 1px solid rgba(0, 117, 143, 0.3);
}

.engine-badge.engine-postgresql {
  background: rgba(51, 103, 145, 0.15);
  color: #336791;
  border: 1px solid rgba(51, 103, 145, 0.3);
}

.engine-badge.engine-mongodb {
  background: rgba(71, 162, 72, 0.15);
  color: #47A248;
  border: 1px solid rgba(71, 162, 72, 0.3);
}

.engine-badge.engine-cassandra {
  background: rgba(18, 135, 177, 0.15);
  color: #1287B1;
  border: 1px solid rgba(18, 135, 177, 0.3);
}

.engine-badge.engine-sqlserver {
  background: rgba(139, 92, 246, 0.15);
  color: #8B5CF6;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.engine-badge.engine-redis {
  background: rgba(220, 47, 2, 0.15);
  color: #DC2F02;
  border: 1px solid rgba(220, 47, 2, 0.3);
}

/* Botones de iconos pequeños */
.icon-btn-small {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.1);
  color: #9aa0a6;
  border-radius: 6px;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.icon-btn-small:hover:not(:disabled) {
  border-color: rgba(0, 191, 255, 0.4);
  background: rgba(0, 191, 255, 0.1);
  color: #00bfff;
}

.icon-btn-small:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.icon-btn-small svg {
  width: 14px;
  height: 14px;
}

/* Acciones compactas */
.actions-compact {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
}

.action-btn-compact {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  white-space: nowrap;
  font-weight: 500;
}

.action-btn-compact:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.4);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2),
              0 0 30px rgba(255, 255, 255, 0.1);
}

.action-btn-compact.delete {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.3);
}

.action-btn-compact.delete:hover {
  background: rgba(248, 113, 113, 0.1);
  border-color: rgba(248, 113, 113, 0.5);
  color: #ff6b6b;
}

/* Sistema de prioridades de columnas - Todas visibles en desktop */
.col-priority-1,
.col-priority-2,
.col-priority-3,
.col-priority-4,
.col-priority-5 {
  display: table-cell;
}

/* Ocultar columnas progresivamente según el tamaño de pantalla */

/* Pantallas grandes (< 1400px): Ocultar contraseña */
@media (max-width: 1400px) {
  .col-priority-5 {
    display: none;
  }
}

/* Pantallas medianas (< 1200px): Ocultar puerto y usuario */
@media (max-width: 1200px) {
  .col-priority-4,
  .col-priority-5 {
    display: none;
  }
}

/* Tablets (< 1024px): Ocultar host */
@media (max-width: 1024px) {
  .col-priority-3,
  .col-priority-4,
  .col-priority-5 {
    display: none;
  }
  
  .db-table th,
  .db-table td {
    padding: 12px 8px;
  }
}

/* Tablets pequeños (< 900px): Ocultar gestor, solo esenciales */
@media (max-width: 900px) {
  .col-priority-2,
  .col-priority-3,
  .col-priority-4,
  .col-priority-5 {
    display: none;
  }
  
  .db-table th,
  .db-table td {
    padding: 10px 6px;
    font-size: 0.85rem;
  }
  
  .action-btn-compact {
    padding: 5px 10px;
    font-size: 0.8rem;
  }
  
  .actions-compact {
    gap: 6px;
  }
}

.badge { 
  background: rgba(255,255,255,0.06); 
  color:#ddd; 
  border:1px solid rgba(255,255,255,0.12); 
  padding:4px 10px; 
  border-radius:999px; 
  font-size:.8rem; 
  white-space: nowrap; 
}

.badge-success { 
  color:#22c55e; 
  border-color: rgba(34,197,94,0.35); 
  background: rgba(34,197,94,0.08); 
}

.empty-state {
text-align: center;
color: #94a3b8;
padding: 60px 20px !important;
font-style: italic;
font-size: 0.95rem;
}

/* ============================================
   VISTA DE TARJETAS MÓVILES
   ============================================ */

/* Ocultar tarjetas en desktop, mostrar tabla */
.mobile-cards {
  display: none;
}

.desktop-table {
  display: table;
  width: 100%;
}

/* Tarjetas para móvil */
.db-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.db-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.card-engine {
  font-size: 0.9rem;
  font-weight: 600;
  color: #00bfff;
  background: rgba(0, 191, 255, 0.1);
  padding: 4px 12px;
  border-radius: 6px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.card-row:last-child {
  border-bottom: none;
}

.card-label {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
  min-width: 100px;
  flex-shrink: 0;
}

.card-value-simple {
  font-size: 0.9rem;
  color: #e2e8f0;
  flex: 1;
  text-align: right;
}

.card-value-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}

.card-value {
  font-size: 0.9rem;
  color: #e2e8f0;
  font-family: 'Roboto Mono', monospace;
  word-break: break-all;
  text-align: right;
}

.icon-btn-card {
  background: rgba(56, 139, 253, 0.1);
  border: 1px solid rgba(56, 139, 253, 0.3);
  color: #58a6ff;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn-card svg {
  width: 16px;
  height: 16px;
}

.icon-btn-card:hover:not(:disabled) {
  background: rgba(56, 139, 253, 0.2);
  border-color: #58a6ff;
  transform: scale(1.05);
}

.icon-btn-card:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.card-actions {
  display: flex;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.card-actions .action-btn {
  flex: 1;
  text-align: center;
  padding: 10px;
  font-size: 0.85rem;
}

.empty-state-mobile {
  text-align: center;
  color: #94a3b8;
  padding: 60px 20px;
  font-style: italic;
  font-size: 0.95rem;
}

/* Responsive mejorado para header y toolbar */
@media (max-width: 992px) {
  .quota-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .view-header { 
    flex-direction: column; 
    align-items: stretch; 
    gap: 16px; 
    margin-bottom: 24px;
  }
  
  .view-header h1 {
    font-size: 1.6rem;
  }
  
  .header-actions {
    width: 100%;
  }
  
  /* Toolbar en columna para tablets */
  .toolbar { 
    flex-direction: column; 
    width: 100%; 
    gap: 10px;
    align-items: stretch;
  }
  
  .toolbar-field { 
    width: 100%;
    min-width: auto;
    flex: none;
  }
  
  .toolbar-field input { 
    width: 100%; 
  }
  
  .toolbar-select { 
    width: 100%;
    min-width: auto;
  }
  
  .quota-grid { 
    grid-template-columns: 1fr; 
    gap: 12px;
  }
  
  /* CAMBIAR A VISTA DE TARJETAS EN MÓVIL */
  .desktop-table {
    display: none !important;
  }
  
  .mobile-cards {
    display: block !important;
  }
  
  .db-table-container {
    background: transparent;
    border: none;
    box-shadow: none;
    overflow: visible;
    margin: 0;
    padding: 0;
  }
}

@media (max-width: 640px) {
  .view-header h1 {
    font-size: 1.4rem;
  }
  
  .btn-primary, .btn-debug {
    padding: 10px 18px;
    font-size: 0.9rem;
  }
  
  /* Ajustar tarjetas en pantallas medianas */
  .db-card {
    padding: 14px;
  }
  
  .card-label {
    font-size: 0.8rem;
    min-width: 100px;
  }
  
  .card-value {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .view-header h1 {
    font-size: 1.2rem;
  }
  
  h3 {
    font-size: 0.75rem;
  }
  
  /* Cambiar a texto corto en móviles pequeños */
  .desktop-text {
    display: none;
  }
  
  .mobile-text {
    display: inline;
  }
  
  .btn-primary, .btn-debug {
    padding: 10px 16px;
    font-size: 0.9rem;
    white-space: nowrap;
    flex: 1;
  }
  
  .header-actions {
    display: flex;
    gap: 8px;
  }
  
  .token-timer {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
  
  .token-timer svg {
    width: 16px;
    height: 16px;
  }
  
  .token-timer .timer-label {
    display: none; /* Ocultar "Sesión:" en móviles */
  }
  
  .toolbar-field {
    padding: 10px 12px;
  }
  
  .toolbar-select {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
  
  .db-table {
    min-width: 700px;
    font-size: 0.8rem;
  }
  
  .db-table th,
  .db-table td {
    padding: 8px 10px;
  }
  
  .action-btn {
    padding: 5px 8px;
    font-size: 0.75rem;
  }
  
  .badge {
    font-size: 0.7rem;
    padding: 3px 8px;
  }
  
  /* Ajustar tarjetas para móviles pequeños */
  .db-card {
    padding: 12px;
    margin-bottom: 12px;
  }
  
  .card-header {
    margin-bottom: 12px;
    padding-bottom: 10px;
  }
  
  .card-engine {
    font-size: 0.8rem;
    padding: 3px 10px;
  }
  
  .card-body {
    gap: 10px;
  }
  
  .card-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 6px 0;
  }
  
  .card-label {
    font-size: 0.75rem;
    min-width: auto;
  }
  
  .card-value-wrapper {
    width: 100%;
    justify-content: space-between;
  }
  
  .card-value {
    font-size: 0.8rem;
    text-align: left;
  }
  
  .card-actions {
    padding-top: 10px;
    gap: 8px;
  }
  
  .card-actions .action-btn {
    font-size: 0.8rem;
    padding: 8px;
  }
}

/* Pantallas muy pequeñas */
@media (max-width: 360px) {
  .view-header h1 {
    font-size: 1.1rem;
  }
  
  .btn-primary, .btn-debug {
    padding: 9px 12px;
    font-size: 0.85rem;
  }
  
  .toolbar-field {
    padding: 8px 10px;
  }
  
  .toolbar-field svg {
    width: 16px;
    height: 16px;
  }
  
  .toolbar-select {
    padding: 8px 10px;
    font-size: 0.85rem;
  }
  
  /* Tarjetas ultra-compactas */
  .db-card {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
  }
  
  .card-header {
    margin-bottom: 10px;
    padding-bottom: 8px;
  }
  
  .card-engine {
    font-size: 0.75rem;
    padding: 2px 8px;
  }
  
  .badge {
    font-size: 0.65rem;
    padding: 2px 6px;
  }
  
  .card-label {
    font-size: 0.7rem;
  }
  
  .card-value {
    font-size: 0.75rem;
  }
  
  .card-actions .action-btn {
    font-size: 0.75rem;
    padding: 7px;
  }
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
}

.modal-subtitle {
  color: #fff;
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
  background: rgba(255, 255, 255, 0.05);
  box-shadow: 0 0 0 2px var(--engine-color, rgba(0, 191, 255, 0.5)), 
              0 0 30px var(--engine-color, rgba(0, 191, 255, 0.2)),
              0 8px 24px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.engine-card.selected::before {
  opacity: 0.12;
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
  transition: all 0.3s ease;
}

/* Colores específicos por motor de base de datos */
.connection-preview.engine-mysql {
  background: rgba(0, 117, 143, 0.08);
  border: 1px solid rgba(0, 117, 143, 0.3);
}

.connection-preview.engine-mysql h4 {
  color: #00758F;
}

.connection-preview.engine-mysql .preview-code {
  color: #00758F;
}

.connection-preview.engine-postgresql {
  background: rgba(51, 103, 145, 0.08);
  border: 1px solid rgba(51, 103, 145, 0.3);
}

.connection-preview.engine-postgresql h4 {
  color: #336791;
}

.connection-preview.engine-postgresql .preview-code {
  color: #5599cc;
}

.connection-preview.engine-mongodb {
  background: rgba(71, 162, 72, 0.08);
  border: 1px solid rgba(71, 162, 72, 0.3);
}

.connection-preview.engine-mongodb h4 {
  color: #47A248;
}

.connection-preview.engine-mongodb .preview-code {
  color: #47A248;
}

.connection-preview.engine-cassandra {
  background: rgba(18, 135, 177, 0.08);
  border: 1px solid rgba(18, 135, 177, 0.3);
}

.connection-preview.engine-cassandra h4 {
  color: #1287B1;
}

.connection-preview.engine-cassandra .preview-code {
  color: #1287B1;
}

.connection-preview.engine-redis {
  background: rgba(220, 47, 2, 0.08);
  border: 1px solid rgba(220, 47, 2, 0.3);
}

.connection-preview.engine-redis h4 {
  color: #DC2F02;
}

.connection-preview.engine-redis .preview-code {
  color: #DC2F02;
}

.connection-preview.engine-sql.server,
.connection-preview.engine-sqlserver {
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.connection-preview.engine-sql.server h4,
.connection-preview.engine-sqlserver h4 {
  color: #8B5CF6;
}

.connection-preview.engine-sql.server .preview-code,
.connection-preview.engine-sqlserver .preview-code {
  color: #A78BFA;
}

.connection-preview h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #00bfff;
  margin: 0 0 16px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
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

.btn-debug {
  background: rgba(59, 130, 246, 0.1);
  border: 2px solid rgba(59, 130, 246, 0.3);
  color: #60a5fa;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Roboto Mono', monospace;
}

.btn-debug:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
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

/* Responsive mejorado para modales */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-content-glass {
    padding: 20px;
    max-height: 95vh;
    border-radius: 16px;
  }

  .modal-title {
    font-size: 1.4rem;
    margin-bottom: 6px;
  }
  
  .modal-subtitle {
    font-size: 0.9rem;
    margin-bottom: 24px;
  }

  .engine-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .engine-card {
    padding: 12px;
  }
  
  .engine-icon {
    width: 36px;
    height: 36px;
  }
  
  .engine-card h3 {
    font-size: 0.9rem;
  }
  
  .engine-desc {
    font-size: 0.7rem;
  }

  .preview-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .preview-label {
    min-width: auto;
    font-size: 0.8rem;
  }

  .preview-value {
    text-align: left;
    font-size: 0.85rem;
  }
  
  .preview-code {
    font-size: 0.75rem;
    padding: 6px 10px;
  }

  .modal-actions {
    flex-direction: column-reverse;
    gap: 10px;
  }

  .btn-primary,
  .btn-outline {
    width: 100%;
  }
  
  .credential-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 8px 12px;
  }
  
  .credential-value-wrapper {
    width: 100%;
    justify-content: space-between;
  }
  
  .credential-value {
    text-align: left;
    font-size: 0.85rem;
    word-break: break-word;
  }
  
  .credential-label {
    min-width: auto;
    font-size: 0.8rem;
  }
  
  .password-value {
    font-size: 0.9rem;
  }
  
  .warning-box {
    padding: 10px 12px;
  }
  
  .warning-title {
    font-size: 0.8rem;
  }
  
  .warning-text {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .modal-content-glass {
    padding: 16px;
  }
  
  .modal-close-btn {
    width: 32px;
    height: 32px;
    font-size: 20px;
    top: 12px;
    right: 12px;
  }
  
  .modal-title {
    font-size: 1.2rem;
    padding-right: 30px;
  }
  
  .modal-subtitle {
    font-size: 0.85rem;
  }
  
  .engine-card {
    padding: 10px;
  }
  
  .engine-icon {
    width: 32px;
    height: 32px;
  }
  
  .engine-card h3 {
    font-size: 0.85rem;
  }
  
  .engine-desc {
    font-size: 0.65rem;
  }
  
  .connection-preview {
    padding: 14px;
  }
  
  .connection-preview h4 {
    font-size: 0.85rem;
    margin-bottom: 12px;
  }
  
  .preview-code {
    font-size: 0.7rem;
    padding: 6px 8px;
  }
  
  .form-group label {
    font-size: 0.85rem;
  }
  
  .form-group input,
  .form-group select {
    font-size: 0.9rem;
    padding: 10px 12px;
  }
  
  .credential-item {
    padding: 8px 10px;
  }
  
  .credential-label {
    font-size: 0.75rem;
  }
  
  .credential-value {
    font-size: 0.8rem;
  }
  
  .password-value {
    font-size: 0.85rem;
  }
  
  .copy-btn {
    width: 28px;
    height: 28px;
  }
  
  .copy-btn svg {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 360px) {
  .modal-content-glass {
    padding: 12px;
  }
  
  .modal-title {
    font-size: 1.1rem;
  }
  
  .modal-subtitle {
    font-size: 0.8rem;
    margin-bottom: 16px;
  }
  
  .engine-card {
    padding: 8px;
  }
  
  .engine-icon {
    width: 28px;
    height: 28px;
    margin-bottom: 8px;
  }
  
  .engine-card h3 {
    font-size: 0.8rem;
    margin-bottom: 4px;
  }
  
  .engine-desc {
    font-size: 0.6rem;
    margin-bottom: 6px;
  }
  
  .badge-available,
  .badge-coming-soon {
    font-size: 0.65rem;
    padding: 3px 8px;
  }
  
  .btn-primary,
  .btn-outline {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
}

/* ============================================
   MODAL DE CREDENCIALES
   ============================================ */
.credentials-modal {
  max-width: 580px;
}

.credentials-container {
  background: rgba(15, 15, 17, 0.6);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.credential-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border-left: 3px solid #00bfff;
  transition: all 0.2s ease;
}

.credential-item:last-child {
  margin-bottom: 0;
}

.credential-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.credential-password {
  background: rgba(0, 191, 255, 0.08);
  border: 1.5px solid rgba(0, 191, 255, 0.3);
  border-left: 3px solid #00bfff;
  box-shadow: 0 0 20px rgba(0, 191, 255, 0.15);
}

.credential-password:hover {
  background: rgba(0, 191, 255, 0.12);
  box-shadow: 0 0 25px rgba(0, 191, 255, 0.2);
}

.credential-label {
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
  min-width: 130px;
  letter-spacing: 0.3px;
}

.credential-password .credential-label {
  color: #00bfff;
  font-weight: 700;
}

.credential-value-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  justify-content: flex-end;
}

.credential-value {
  color: #e2e8f0;
  font-size: 0.9rem;
  font-weight: 500;
  word-break: break-all;
  text-align: right;
  font-family: 'Roboto Mono', monospace;
}

.password-value {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-shadow: 0 0 10px rgba(0, 191, 255, 0.5);
}

.copy-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.copy-btn:hover {
  background: rgba(0, 191, 255, 0.15);
  border-color: rgba(0, 191, 255, 0.4);
  color: #00bfff;
  box-shadow: 0 0 15px rgba(0, 191, 255, 0.2);
}

.copy-btn svg {
  width: 16px;
  height: 16px;
}

.warning-box {
  background: rgba(239, 68, 68, 0.1);
  border: 1.5px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 24px;
}

.warning-icon {
  font-size: 1.1rem;
  line-height: 1;
  flex-shrink: 0;
}

.warning-content {
  flex: 1;
}

.warning-title {
  margin: 0 0 4px 0;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.4px;
}

.warning-text {
  margin: 0;
  color: #fff;
  font-size: 0.8rem;
  line-height: 1.4;
}

/* ========================================================================= */
/* =================== ANIMACIONES DE ENTRADA ESCALONADA =================== */
/* ========================================================================= */

/* Contenedor principal con fade-in */
.fade-in-view {
  animation: viewFadeIn 0.5s ease-out;
}

@keyframes viewFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Elementos con animación escalonada */
.stagger-item {
  opacity: 0;
  transform: translateY(20px);
  animation: staggerFadeIn 0.6s ease-out forwards;
  animation-delay: calc(var(--stagger-index) * 0.1s);
}

@keyframes staggerFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hijos con animación escalonada (tarjetas de stats) */
.stagger-child {
  opacity: 0;
  transform: translateY(15px) scale(0.95);
  animation: staggerChildFadeIn 0.5s ease-out forwards;
  animation-delay: calc(0.3s + (var(--child-index) * 0.08s));
}

@keyframes staggerChildFadeIn {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Animación para filas de tabla */
.db-table tbody tr {
  opacity: 0;
  transform: translateX(-10px);
  animation: tableFadeIn 0.4s ease-out forwards;
}

.db-table tbody tr:nth-child(1) { animation-delay: 0.4s; }
.db-table tbody tr:nth-child(2) { animation-delay: 0.45s; }
.db-table tbody tr:nth-child(3) { animation-delay: 0.5s; }
.db-table tbody tr:nth-child(4) { animation-delay: 0.55s; }
.db-table tbody tr:nth-child(5) { animation-delay: 0.6s; }
.db-table tbody tr:nth-child(6) { animation-delay: 0.65s; }
.db-table tbody tr:nth-child(7) { animation-delay: 0.7s; }
.db-table tbody tr:nth-child(8) { animation-delay: 0.75s; }
.db-table tbody tr:nth-child(9) { animation-delay: 0.8s; }
.db-table tbody tr:nth-child(10) { animation-delay: 0.85s; }

@keyframes tableFadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Animación para tarjetas móviles */
.mobile-cards .db-card-mobile {
  opacity: 0;
  transform: translateY(15px);
  animation: cardFadeIn 0.4s ease-out forwards;
}

.mobile-cards .db-card-mobile:nth-child(1) { animation-delay: 0.4s; }
.mobile-cards .db-card-mobile:nth-child(2) { animation-delay: 0.45s; }
.mobile-cards .db-card-mobile:nth-child(3) { animation-delay: 0.5s; }
.mobile-cards .db-card-mobile:nth-child(4) { animation-delay: 0.55s; }
.mobile-cards .db-card-mobile:nth-child(5) { animation-delay: 0.6s; }
.mobile-cards .db-card-mobile:nth-child(6) { animation-delay: 0.65s; }

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
