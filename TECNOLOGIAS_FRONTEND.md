# 🚀 Tecnologías y Características del Frontend - DBFlow

## 📚 Stack Tecnológico Principal

### Framework y Librería Core
- **Vue.js 3.5.0** - Framework JavaScript progresivo
  - Composition API
  - Script Setup
  - Reactive refs y computed properties
  - Lifecycle hooks (onMounted, onUnmounted, onBeforeUnmount)

- **Vue Router 4.6.3** - Enrutamiento oficial de Vue
  - Navegación declarativa
  - Guards de navegación
  - Rutas protegidas con autenticación
  - Lazy loading de componentes

### Build Tools y Desarrollo
- **Vite 6.0.0** - Build tool y dev server ultrarrápido
  - Hot Module Replacement (HMR)
  - Optimización de producción
  - Tree shaking automático

### Estilos y UI
- **Tailwind CSS 4.1.16** - Framework CSS utility-first
  - PostCSS 8.5.6
  - Autoprefixer 10.4.21
  - @tailwindcss/postcss 4.1.16
  - Configuración personalizada

- **CSS Personalizado**
  - Animaciones glassmorphism
  - Efectos de partículas interactivas
  - Gradientes y sombras personalizadas
  - Tema oscuro nativo

### HTTP Client
- **Axios 1.13.2** - Cliente HTTP basado en promesas
  - Interceptores de request/response
  - Manejo automático de tokens JWT
  - Cancelación de peticiones
  - Timeout configurables

### Calidad de Código
- **ESLint 9.39.1** - Linter para JavaScript/Vue
  - @eslint/js 9.39.1
  - eslint-plugin-vue 10.5.1
  - Configuración flat config
  - Reglas recomendadas de Vue

---

## 🎨 Características de Diseño

### Sistema de Diseño
- **Glassmorphism** - Efecto de vidrio esmerilado
  - Backdrop filters
  - Bordes semi-transparentes
  - Sombras luminosas

- **Animaciones Canvas**
  - Sistema de partículas interactivo
  - Efectos de conexión de nodos
  - Repulsión al mouse
  - 120 partículas con física personalizada

- **Efectos Visuales**
  - Degradados dinámicos
  - Pulsaciones y transiciones suaves
  - Reveal on scroll
  - Stagger animations

### Paleta de Colores
- Fondo principal: `#0a0a0a`
- Superficies: `#0f0f10`
- Texto primario: `#e2e8f0`
- Texto secundario: `#94a3b8`, `#64748b`
- Acentos: Gradientes de colores específicos por motor de BD

### Tipografía
- **Fuente principal**: System fonts
- **Fuente monoespaciada**: 'Roboto Mono' - Para código y datos técnicos

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```
src/
├── assets/          # Estilos globales
│   ├── main.css
│   ├── alerts.css
│   ├── Auth.css
│   ├── Dashboard.css
│   └── Home.css
├── components/      # Componentes reutilizables
│   ├── ConvergingLines.vue
│   ├── LoadingOverlay.vue
│   └── StatCard.vue
├── composables/     # Composables de Vue 3
│   └── useDatabaseCount.js
├── config/          # Configuraciones
│   └── plans.js
├── router/          # Configuración de rutas
│   └── index.js
├── services/        # Servicios API
│   ├── authService.js
│   ├── databaseService.js
│   ├── paymentService.js
│   └── subscriptionService.js
├── store/           # Estado global
│   └── loading.js
├── utils/           # Utilidades
│   ├── authDebug.js
│   ├── notify.js
│   └── tokenDebug.js
├── views/           # Páginas/Vistas
│   ├── Home.vue
│   ├── Login.vue
│   ├── Register.vue
│   ├── Dashboard.vue
│   ├── DatabaseList.vue
│   ├── SubscriptionView.vue
│   ├── ForgotPassword.vue
│   ├── ResetPassword.vue
│   ├── VerifyEmail.vue
│   ├── ConfirmEmail.vue
│   ├── Documentation.vue
│   ├── TermsOfService.vue
│   └── PrivacyPolicy.vue
├── App.vue          # Componente raíz
└── main.js          # Punto de entrada
```

---

## 🔐 Sistema de Autenticación

### Características
- **JWT (JSON Web Tokens)** - Autenticación basada en tokens
  - Almacenamiento en localStorage
  - Decodificación de payload
  - Verificación de expiración
  - Auto-logout en expiración

- **Funcionalidades**
  - Login / Registro
  - Verificación de email
  - Recuperación de contraseña
  - Reset de contraseña
  - Persistencia de sesión
  - Guards de navegación

### Token Timer
- Visualización de tiempo restante de sesión
- Advertencia visual (< 5 minutos)
- Auto-cierre de sesión al expirar
- Actualización en tiempo real cada segundo

---

## 💾 Gestión de Bases de Datos

### Motores Soportados
1. **MySQL** - Color: `#00758F`
2. **PostgreSQL** - Color: `#336791`
3. **MongoDB** - Color: `#47A248`
4. **Cassandra** - Color: `#1287B1` (En proceso)
5. **SQL Server** - Color: `#8B5CF6`
6. **Redis** - Color: `#DC382D` (En proceso)

### Operaciones CRUD
- ✅ Crear base de datos
- ✅ Ver credenciales (con rotación automática)
- ✅ Rotar credenciales manualmente
- ✅ Eliminar base de datos
- ✅ Listar bases de datos
- ✅ Filtrar por motor
- ✅ Búsqueda por nombre

### Características Especiales
- **Límites por plan** (Free, Intermediate, Advanced)
- **Contadores en tiempo real**
- **Preview de conexión** con datos reales
- **Copiar credenciales** al portapapeles
- **Ocultar contraseñas** copiadas
- **Modales de confirmación** personalizados
- **Estados de carga** con overlay

---

## 💳 Sistema de Suscripciones

### Planes Disponibles
1. **Free Plan** - $0/mes
   - 2 bases de datos por motor
   - Funcionalidades básicas

2. **Intermediate Plan** - $9.99/mes
   - 5 bases de datos por motor
   - Soporte prioritario

3. **Advanced Plan** - $19.99/mes
   - 10 bases de datos por motor
   - Funcionalidades avanzadas

### Integración de Pagos
- **Wompi** - Pasarela de pagos
  - Widget embebido
  - Callbacks de confirmación
  - Manejo de transacciones
  - Sincronización de plan

---

## 🎯 Componentes Personalizados

### LoadingOverlay
- Overlay de carga global
- Spinner animado
- Mensaje personalizable
- Z-index máximo

### StatCard
- Tarjetas estadísticas reutilizables
- Logos personalizados
- Gradientes por color
- Animaciones stagger

### ConvergingLines
- Animación de líneas convergentes
- Canvas HTML5
- Efectos visuales dinámicos

---

## 🔔 Sistema de Notificaciones

### SweetAlert2 (Personalizado)
- Tema oscuro nativo
- Iconos personalizados
- Auto-cierre configurable
- Confirmaciones con callbacks
- Estilos glassmorphism

### Tipos de Alertas
- ✅ Success
- ❌ Error
- ⚠️ Warning
- ℹ️ Info
- ❓ Confirmación

---

## 🎨 Animaciones y Efectos

### Animaciones de Entrada
- Fade in
- Slide in
- Reveal on scroll
- Stagger children

### Efectos Interactivos
- Hover states
- Focus states
- Active states
- Transform animations
- Glow effects
- Pulse animations

### Canvas Animations
- Sistema de partículas
- Física de movimiento
- Conexiones dinámicas
- Interacción con mouse
- Colores degradados

---

## 🌐 Internacionalización

### Idioma
- **Español** - Idioma principal
- Mensajes de error personalizados
- Validaciones en español
- Documentación en español

---

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

### Adaptaciones
- Grid responsivos
- Navegación móvil
- Tablas horizontales scroll
- Texto adaptativo
- Botones compactos
- Ocultación de columnas

---

## 🔧 Utilidades y Helpers

### authDebug.js
- Modal de estado de autenticación
- Información de usuario
- Verificación de token
- Datos de plan

### notify.js
- Sistema de alertas SweetAlert2
- Configuración global
- Tema personalizado

### tokenDebug.js
- Decodificador de JWT
- Verificación de expiración
- Logging detallado

---

## 🚀 Características Avanzadas

### Optimizaciones
- Lazy loading de rutas
- Tree shaking automático
- Code splitting
- Minificación de assets
- Compresión de imágenes

### SEO y Meta
- Meta tags dinámicos
- Favicon personalizado
- Títulos por página
- Viewport configurado

### Seguridad
- Sanitización de inputs
- Validación de formularios
- CSRF protection (backend)
- XSS prevention
- HTTPS only (producción)

### Performance
- Virtual scrolling (pendiente)
- Debounce en búsquedas
- Throttle en eventos
- Lazy loading de imágenes
- Caché de API responses

---

## 🐛 Debugging y Desarrollo

### Herramientas
- Vue DevTools compatible
- Axios interceptors para logging
- Console logs estructurados
- Error boundaries
- Source maps en desarrollo

### Variables de Entorno
```bash
VITE_API_URL=http://localhost:5030
```

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview

# Lint código
npm run lint
```

---

## 🎯 Estado del Proyecto

### Funcionalidades Completas ✅
- Sistema de autenticación completo
- Gestión de bases de datos (MySQL, PostgreSQL, MongoDB, SQL Server)
- Sistema de suscripciones
- Integración con Wompi
- Dashboard interactivo
- Diseño responsive
- Sistema de notificaciones
- Verificación de email
- Recuperación de contraseña
- Timer de sesión

### En Desarrollo 🚧
- Cassandra support
- Redis support
- Google OAuth
- Documentación técnica
- Tests unitarios

### Pendiente ⏳
- Modo claro/oscuro toggle
- Múltiples idiomas
- PWA support
- Gráficas de uso
- Logs de actividad

---

## 📄 Licencia y Créditos

**Proyecto:** DBFlow - Database Management Platform
**Versión:** 1.0.0
**Tipo:** Private
**Frontend Framework:** Vue.js 3
**Build Tool:** Vite
**Autor:** Equipo DBFlow

---

**Última actualización:** Noviembre 2025
