# Sistema de Planes de Suscripción - DBFlow

## 📋 Resumen

Este sistema gestiona los límites de bases de datos según el plan de suscripción del usuario.

## 🎯 Planes Disponibles

| Plan | Límite por Gestor | Precio | ID |
|------|-------------------|--------|-----|
| **Gratuito** | 2 bases de datos | $0 COP | `free` |
| **Intermedio** | 5 bases de datos | $9.99 USD | `intermediate` |
| **Avanzado** | 10 bases de datos | $19.99 USD | `advanced` |

## 📁 Archivos Creados

### 1. `/src/config/plans.js`
Configuración centralizada de todos los planes:
- Define límites de bases de datos
- Características de cada plan
- Funciones helper para validar límites

### 2. `/src/services/subscriptionService.js`
Gestión de la suscripción del usuario:
- `getUserPlan()` - Obtiene el plan actual del localStorage
- `setUserPlan(planId)` - Actualiza el plan del usuario
- `hasActivePlan()` - Verifica si tiene plan de pago
- `getSubscriptionInfo()` - Información completa de suscripción

## 🔧 Implementación

### En `DatabaseList.vue`

#### Importaciones necesarias:
```javascript
import { getUserPlan } from '@/services/subscriptionService'
import { getDatabaseLimit, canCreateDatabase } from '@/config/plans'
```

#### Variables reactivas:
```javascript
const userPlan = ref(getUserPlan()) // 'free', 'intermediate', 'advanced'
const databaseLimit = ref(getDatabaseLimit(userPlan.value)) // 2, 5 o 10
```

#### Validación al crear bases de datos:
```javascript
const createDb = async () => {
  // Validar límite del plan
  const currentCount = countByEngine(newDb.value.engine)
  const canCreate = canCreateDatabase(userPlan.value, currentCount)
  
  if (!canCreate) {
    // Mostrar mensaje de límite alcanzado
    // Redirigir a la vista de suscripción
    router.push('/subscription')
    return
  }
  
  // Continuar con la creación...
}
```

#### Tarjetas dinámicas:
```vue
<StatCard 
  title="MYSQL" 
  :value="`${countByEngine('MySQL')} / ${databaseLimit}`" 
  subtitle="Instancias usadas" 
/>
```

### En `SubscriptionView.vue`

#### Planes dinámicos:
Los planes se cargan automáticamente desde `/src/config/plans.js`, lo que facilita su actualización.

#### Flujo de pago:
1. Usuario selecciona un plan
2. Se llama a `createSubscription(planId, email)`
3. Se guarda el plan en `localStorage` como `pending_plan`
4. Se redirige a Mercado Pago
5. Al regresar, si el pago fue exitoso:
   - Se actualiza el plan con `setUserPlan(planId)`
   - Se actualiza la UI con los nuevos límites

### En `paymentService.js`

#### Actualización automática del plan:
```javascript
export const createSubscription = async (planId, email) => {
  const response = await axios.post(...)
  
  if (response.data && response.status === 200) {
    setUserPlan(planId) // ✅ Actualiza automáticamente
  }
  
  return response.data
}
```

## 🔄 Flujo Completo

### 1. Usuario con Plan Gratuito (2 DBs por gestor)
```
Usuario → Crea 2 bases MySQL → ✅ Permitido
Usuario → Intenta crear 3ra MySQL → ❌ Bloqueado
Sistema → Muestra alerta de límite alcanzado
Sistema → Ofrece actualizar plan
Usuario → Click "Ver planes" → Redirige a /subscription
```

### 2. Usuario Compra Plan Intermedio
```
Usuario → Selecciona Plan Intermedio
Sistema → Llama createSubscription('intermediate', email)
Sistema → Guarda 'pending_plan' = 'intermediate'
Sistema → Redirige a Mercado Pago
Usuario → Completa el pago
Mercado Pago → Redirige de vuelta con ?status=approved
Sistema → Detecta pending_plan
Sistema → Actualiza plan con setUserPlan('intermediate')
Sistema → Límite cambia de 2 → 5 bases de datos
Usuario → Puede crear 3 bases más ✅
```

### 3. Usuario con Plan Avanzado (10 DBs por gestor)
```
Usuario → Tiene límite de 10 DBs por gestor
Usuario → Crea 10 bases MySQL → ✅ Todas permitidas
Sistema → Puede tener 10 MySQL + 10 PostgreSQL + 10 MongoDB, etc.
```

## 🎨 Visualización en la UI

### Tarjetas de Contador
```
┌─────────────────────────┐
│  MYSQL                  │
│  1 / 2  (Plan Gratuito) │
│  Instancias usadas      │
└─────────────────────────┘

┌─────────────────────────┐
│  MYSQL                  │
│  3 / 5  (Plan Intermedio)│
│  Instancias usadas      │
└─────────────────────────┘
```

## 🔐 Persistencia

### LocalStorage:
- `user_plan`: ID del plan actual (`'free'`, `'intermediate'`, `'advanced'`)
- `pending_plan`: Plan pendiente de confirmación de pago
- `subscription_start_date`: Fecha de inicio de suscripción
- `subscription_end_date`: Fecha de fin (si aplica)

### Limpieza al Logout:
Automáticamente se limpia toda la información de suscripción mediante `clearSubscriptionInfo()`.

## 📊 Testing

### Cambiar plan manualmente (para pruebas):
```javascript
// En la consola del navegador:
localStorage.setItem('user_plan', 'intermediate') // o 'advanced'
location.reload()
```

### Simular límite alcanzado:
1. Establece plan gratuito
2. Crea 2 bases de datos del mismo gestor
3. Intenta crear una tercera → debe bloquear

## 🚀 Próximos Pasos

1. **Backend**: Implementar endpoint `/api/Users/{userId}/Plan` que devuelva el plan del usuario
2. **Sincronización**: Sincronizar el plan desde el backend en lugar de solo localStorage
3. **Webhooks**: Recibir notificaciones de Mercado Pago para actualizar planes automáticamente
4. **Renovación**: Implementar lógica de renovación automática de suscripciones
5. **Downgrade**: Manejar el caso cuando un usuario baja de plan

## 💡 Ventajas de esta Implementación

✅ **Centralizado**: Toda la lógica de planes en un solo lugar (`plans.js`)
✅ **Escalable**: Fácil agregar nuevos planes o modificar límites
✅ **Validación en Frontend**: Evita peticiones innecesarias al backend
✅ **UX Fluida**: El usuario ve inmediatamente sus límites
✅ **Integración con Pagos**: Actualización automática tras pago exitoso

## 🔧 Mantenimiento

### Para agregar un nuevo plan:
1. Editar `/src/config/plans.js`
2. Agregar configuración del nuevo plan
3. Agregar mapeo en `PLAN_IDS`
4. Actualizar `SubscriptionView.vue` con el ID de Mercado Pago

### Para cambiar límites:
Solo editar `databaseLimit` en `/src/config/plans.js` - se propaga automáticamente.
