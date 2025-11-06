# 🔌 Integración Frontend-Backend

## Configuración

### 1. Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura la URL de tu backend:

```bash
cp .env.example .env
```

Edita `.env` y ajusta la URL del backend:

```env
VITE_API_URL=http://localhost:5030
```

### 2. Endpoints Implementados

#### 🔐 Autenticación (`/api/Access`)

| Método | Endpoint | Descripción | Vista |
|--------|----------|-------------|-------|
| POST | `/api/Access/Register` | Registro de usuario | `Register.vue` |
| POST | `/api/Access/Login` | Inicio de sesión | `Login.vue` |
| GET | `/api/Access/Verify-Email` | Verificación de email | `VerifyEmail.vue` |
| POST | `/api/Access/Forgot-Password` | Solicitar recuperación | `ForgotPassword.vue` |
| POST | `/api/Access/Reset-Password` | Restablecer contraseña | `ResetPassword.vue` |

#### 💳 Pagos (`/api/payments`)

| Método | Endpoint | Descripción | Vista |
|--------|----------|-------------|-------|
| POST | `/api/payments/create` | Crear suscripción Mercado Pago | `SubscriptionView.vue` |

## Servicios Creados

### `src/services/authService.js`

Maneja toda la autenticación:

```javascript
import { register, login, logout, forgotPassword, resetPassword, verifyEmail } from '@/services/authService';

// Registro
const result = await register({ name, email, password });

// Login
const result = await login({ email, password });

// Verificar email
const result = await verifyEmail(token);

// Recuperar contraseña
const result = await forgotPassword(email);

// Restablecer contraseña
const result = await resetPassword({ token, newPassword, confirmPassword });

// Cerrar sesión
logout();
```

### `src/services/paymentService.js`

Maneja las suscripciones:

```javascript
import { createSubscription } from '@/services/paymentService';

const result = await createSubscription(email);
if (result?.init_point) {
  window.location.href = result.init_point;
}
```

## Funcionalidades Implementadas

### ✅ Registro de Usuario
- Formulario en `/register`
- Validación de campos
- Redirige a `/verify-email` después del registro
- Manejo de errores del backend

### ✅ Inicio de Sesión
- Formulario en `/login`
- Guarda el token JWT en localStorage
- Redirige a `/dashboard` tras login exitoso
- Interceptor axios que añade token a todas las peticiones

### ✅ Verificación de Email
- Vista en `/verify-email`
- Verifica automáticamente si hay token en URL (`?token=...`)
- Muestra mensajes de éxito/error
- Opción para reenviar correo

### ✅ Recuperación de Contraseña
- Formulario en `/forgot-password`
- Envía email de recuperación
- Feedback visual durante el proceso

### ✅ Restablecer Contraseña
- Vista en `/reset-password`
- Lee token de URL (`?token=...`)
- Validación de contraseñas coincidentes
- Redirige a `/login` tras éxito

### ✅ Suscripciones Mercado Pago
- Vista en `/subscription`
- Redirige al checkout de Mercado Pago
- Manejo de errores

## Almacenamiento Local

El servicio de autenticación guarda automáticamente:

```javascript
localStorage.setItem('authToken', token);
localStorage.setItem('user', JSON.stringify(user));
```

Y proporciona helpers:

```javascript
import { isAuthenticated, getCurrentUser, getAuthToken } from '@/services/authService';

if (isAuthenticated()) {
  const user = getCurrentUser();
  const token = getAuthToken();
}
```

## Interceptor de Axios

Todas las peticiones HTTP automáticamente incluyen el token de autenticación:

```javascript
Authorization: Bearer <token>
```

## Rutas Disponibles

- `/register` - Registro
- `/login` - Inicio de sesión
- `/verify-email` - Verificación de email
- `/forgot-password` - Recuperar contraseña
- `/reset-password` - Restablecer contraseña
- `/subscription` - Suscripción Premium
- `/dashboard` - Dashboard (requiere autenticación)

## Próximos Pasos

1. **Protección de Rutas**: Crear guards de navegación para rutas privadas
2. **Refresh Token**: Implementar renovación automática de tokens
3. **Manejo Global de Errores**: Interceptor para errores 401/403
4. **Loading States**: Componente global de loading
5. **Toast Notifications**: Reemplazar alerts por notificaciones modernas
