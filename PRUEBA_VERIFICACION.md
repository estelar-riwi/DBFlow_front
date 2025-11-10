# 🧪 GUÍA DE PRUEBA - Verificación de Email

## ⚠️ IMPORTANTE
Tu aplicación está corriendo en: **http://localhost:5174** (no 5173)

## 📝 Pasos para la Prueba

### Paso 1: Registrar un Nuevo Usuario

1. Abre tu navegador en: **http://localhost:5174/register**

2. Abre la **Consola del Navegador** (presiona F12)

3. Regístrate con un email nuevo

4. Verás que se envía un correo de verificación

### Paso 2: Revisar el Email

1. Ve a tu bandeja de entrada

2. Busca el email de verificación de DBFlow

3. **IMPORTANTE**: Mira la URL del enlace en el email. Debe ser algo como:
   ```
   http://localhost:5174/verify-email/[TOKEN_LARGO_AQUI]
   ```
   
   ❌ Si en cambio dice:
   ```
   http://localhost:5030/api/Access/Verify-Email?token=[TOKEN]
   ```
   **El problema está en el backend** - está generando mal la URL

### Paso 3: Hacer Clic en el Enlace

1. **ANTES de hacer clic**, asegúrate de tener la consola abierta (F12)

2. Haz clic en el enlace del email

3. La consola mostrará MUCHOS logs. Busca especialmente:

```
🔍 VerifyEmail mounted
📋 Route params: { ... }
📋 Route fullPath: "/verify-email/[EL_TOKEN]"
🔑 Token final seleccionado: [EL_TOKEN_COMPLETO]
📏 Longitud del token: [NÚMERO]
✉️ Token completo (para debug): [TOKEN_COMPLETO]

🔑 verifyEmail llamado
📝 Token recibido: [TOKEN]
📡 URL completa que se enviará: http://localhost:5030/api/Access/Verify-Email?token=[TOKEN]

❌ Error en verifyEmail: {
  status: 400,
  data: "..."
}
```

### Paso 4: Analizar el Error

Dependiendo del log `❌ Error en verifyEmail`, el problema puede ser:

#### Opción A: El backend dice "Token expirado"
```json
{
  "status": 400,
  "data": "Token expired" o "Token has expired"
}
```
**Solución**: El token expira muy rápido. Necesitas:
1. Hacer clic en el enlace INMEDIATAMENTE después de recibirlo
2. O pedirle al backend que aumente el tiempo de expiración

#### Opción B: El backend dice "Token inválido"
```json
{
  "status": 400,
  "data": "Invalid token" o "Token not found"
}
```
**Solución**: El token no existe en la base de datos. Posibles causas:
1. El token ya fue usado (ya verificaste el email)
2. El token nunca se guardó en la base de datos
3. El token tiene formato incorrecto

#### Opción C: El backend dice "Token ya usado"
```json
{
  "status": 400,
  "data": "Token already used"
}
```
**Solución**: Solo puedes usar el enlace UNA VEZ. Si necesitas otro, usa "Reenviar Correo"

### Paso 5: Copiar la Información

**Copia y pega aquí:**

1. **La URL completa del enlace del email:**
   ```
   [PEGAR AQUÍ]
   ```

2. **El token completo de los logs:**
   ```
   [PEGAR AQUÍ]
   ```

3. **El error completo del backend:**
   ```json
   [PEGAR AQUÍ]
   ```

4. **Cuánto tiempo pasó entre recibir el email y hacer clic:**
   ```
   [PEGAR AQUÍ: Inmediato / 5 minutos / 1 hora / etc]
   ```

## 🔧 Soluciones Rápidas

### Si el enlace del email apunta a localhost:5030
**Problema**: El backend está generando URLs incorrectas

**Solución en el Backend (.NET)**:
```csharp
// En el código que genera el email de verificación
var frontendUrl = "http://localhost:5174"; // O "https://dbflow.estelar.andrescortes.dev" en producción
var verificationUrl = $"{frontendUrl}/verify-email/{token}";

// NO usar:
// var verificationUrl = $"{backendUrl}/Verify-Email?token={token}"; ❌
```

### Si el token expira muy rápido
**Solución en el Backend (.NET)**:
```csharp
// Cuando creas el token de verificación
var tokenExpiration = DateTime.UtcNow.AddHours(24); // En lugar de minutos
```

### Si quieres probar sin registrarte de nuevo
Usa el botón "Reenviar Correo" en la página de verificación para obtener un nuevo token.

## 🎯 Diferencia Entre Frontend y Backend

**Frontend (tu app Vue)**: http://localhost:5174
- Aquí los usuarios hacen clic en el enlace del email
- Captura el token de la URL
- Llama al backend para verificar

**Backend (tu API .NET)**: http://localhost:5030
- Recibe la petición de verificación
- Valida el token
- Marca el email como verificado

**El flujo correcto es:**
```
Email → Usuario hace clic → Frontend (5174) → Backend (5030) → Verificación
```

**El flujo INCORRECTO sería:**
```
Email → Backend directo (5030) ❌
```

## 📞 Próximos Pasos

Después de hacer la prueba y copiar toda la información, compártela conmigo y podré:
1. Identificar si el problema está en el frontend o backend
2. Darte el código exacto para arreglarlo
3. Mostrarte cómo configurar correctamente el backend

**¡Haz la prueba ahora y comparte los logs completos de la consola!**
