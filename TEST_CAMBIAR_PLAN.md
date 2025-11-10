# 🧪 Cómo Cambiar el Plan del Usuario (Testing)

## Método Rápido (Consola del Navegador)

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Para cambiar a Plan Intermedio (5 DBs por gestor)
localStorage.setItem('user_plan', 'intermediate')
const user = JSON.parse(localStorage.getItem('user') || '{}')
user.subscriptionType = 'intermediate'
localStorage.setItem('user', JSON.stringify(user))
location.reload()
```

```javascript
// Para cambiar a Plan Avanzado (10 DBs por gestor)
localStorage.setItem('user_plan', 'advanced')
const user = JSON.parse(localStorage.getItem('user') || '{}')
user.subscriptionType = 'advanced'
localStorage.setItem('user', JSON.stringify(user))
location.reload()
```

```javascript
// Para volver a Plan Gratuito (2 DBs por gestor)
localStorage.setItem('user_plan', 'free')
const user = JSON.parse(localStorage.getItem('user') || '{}')
user.subscriptionType = 'free'
localStorage.setItem('user', JSON.stringify(user))
location.reload()
```

## Script Todo-en-Uno

Copia y pega este código completo en la consola:

```javascript
// Función helper para cambiar plan fácilmente
function cambiarPlan(plan) {
  console.clear()
  console.log('🔄 Cambiando plan a:', plan)
  
  // Actualizar localStorage
  localStorage.setItem('user_plan', plan)
  
  // Actualizar objeto de usuario
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  user.subscriptionType = plan
  localStorage.setItem('user', JSON.stringify(user))
  
  console.log('✅ Plan actualizado')
  console.log('🔄 Recargando en 1 segundo...')
  
  setTimeout(() => location.reload(), 1000)
}

// Ahora puedes usar:
// cambiarPlan('free')
// cambiarPlan('intermediate')  
// cambiarPlan('advanced')

console.log('✅ Función cambiarPlan() lista!')
console.log('Uso: cambiarPlan("intermediate") o cambiarPlan("advanced")')
```

## Verificar Plan Actual

```javascript
console.log('Plan actual:', localStorage.getItem('user_plan'))
const user = JSON.parse(localStorage.getItem('user') || '{}')
console.log('Plan en usuario:', user.subscriptionType)
```

## Qué Deberías Ver Después de Cambiar

### Plan Gratuito (`free`)
- Badge gris en el sidebar: "Plan Gratuito"
- Contadores: `X / 2`
- Sin icono de corona

### Plan Intermedio (`intermediate`)
- Badge azul cian en el sidebar: "Plan Intermedio" 👑
- Contadores: `X / 5`
- Icono de corona dorada

### Plan Avanzado (`advanced`)
- Badge dorado en el sidebar: "Plan Avanzado" 👑
- Contadores: `X / 10`
- Icono de corona dorada

## Importante

⚠️ **IMPORTANTE**: Debes actualizar TANTO `user_plan` COMO `user.subscriptionType` para que funcione correctamente.

El sistema verifica ambos lugares:
1. `localStorage.getItem('user_plan')` - Para el límite de DBs
2. `JSON.parse(localStorage.getItem('user')).subscriptionType` - Para el badge del perfil
