# 🔍 Debug del Token de Verificación

## Problema Actual
El servidor responde con **400 Bad Request** y el mensaje "Enlace de verificación inválido o expirado".

## ✅ Pasos para Diagnosticar

### 1. Revisar los Logs Completos en la Consola

Cuando hagas clic en el enlace de verificación, deberías ver estos logs:

```
🔍 VerifyEmail mounted
📋 Route params: { ... }
📋 Route query: { ... }
🔑 Token encontrado: ...
✉️ Iniciando verificación con token: ...
🔑 verifyEmail llamado
📝 Token recibido: [EL_TOKEN_COMPLETO]
📏 Longitud del token: [NÚMERO]
🔤 Tipo de token: string
📡 URL del API: http://localhost:5030/api/Access
📡 URL completa que se enviará: http://localhost:5030/api/Access/Verify-Email?token=[TOKEN]
```

### 2. Copiar el Token Completo

Del log `📝 Token recibido:`, **copia el token completo** y guárdalo.

### 3. Probar el Endpoint Directamente

Abre una nueva pestaña y prueba la URL directamente en el navegador:

```
http://localhost:5030/api/Access/Verify-Email?token=[PEGA_EL_TOKEN_AQUI]
```

Si esto también falla, **el problema está en el backend**, no en el frontend.

### 4. Verificar el Formato del Enlace en el Email

El email de verificación debe contener un enlace en uno de estos formatos:

**Formato correcto para el frontend:**
```
http://localhost:5173/verify-email/[TOKEN_AQUI]
```

**O también acepta:**
```
http://localhost:5173/verify-email?token=[TOKEN_AQUI]
```

**❌ Formato INCORRECTO (directo al backend):**
```
http://localhost:5030/api/Access/Verify-Email?token=[TOKEN]
```

## 🔧 Posibles Causas y Soluciones

### Causa 1: Token ya usado o expirado
**Síntoma**: El token funciona solo una vez

**Solución Backend**: Verifica la lógica de validación:
```csharp
// El backend debe permitir verificar el estado del token
// y dar un mensaje claro si ya fue usado o expiró
```

**Solución Frontend**: Usa el botón "Reenviar Correo" para obtener un nuevo token

### Causa 2: Token mal formateado en el email
**Síntoma**: El token en los logs tiene caracteres raros o está incompleto

**Solución Backend**: Generar el enlace correctamente:
```csharp
var token = GenerateToken(); // Debe ser URL-safe
var verificationUrl = $"http://localhost:5173/verify-email/{token}";
```

### Causa 3: El backend espera el token en otro lugar
**Síntoma**: El backend dice "token no encontrado" aunque se envía

**Solución Backend**: Verificar que el endpoint acepta el token por query parameter:
```csharp
[HttpGet("Verify-Email")]
public async Task<IActionResult> VerifyEmail([FromQuery] string token)
{
    // NO usar [FromRoute] o [FromBody]
}
```

### Causa 4: Tiempo de expiración muy corto
**Síntoma**: El token funciona inmediatamente pero falla después de unos minutos

**Solución Backend**: Aumentar el tiempo de expiración:
```csharp
// Ejemplo: cambiar de 15 minutos a 24 horas
tokenExpiry = DateTime.UtcNow.AddHours(24);
```

### Causa 5: Token encoding/decoding
**Síntoma**: El token tiene caracteres especiales como `+`, `/`, `=`

**Solución**: El token debe ser URL-safe. En el backend:
```csharp
var token = Convert.ToBase64String(bytes)
    .Replace("+", "-")
    .Replace("/", "_")
    .Replace("=", "");
```

## 🧪 Prueba Rápida

**Haz esto para identificar el problema:**

1. Abre dos pestañas:
   - Pestaña 1: Tu aplicación
   - Pestaña 2: Consola del navegador (F12)

2. Registra un nuevo usuario

3. Revisa el email y **NO HAGAS CLIC** en el enlace todavía

4. Copia el enlace completo del email y pégalo aquí:
   ```
   [PEGAR EL ENLACE DEL EMAIL AQUÍ]
   ```

5. Ahora **SÍ** haz clic en el enlace

6. Inmediatamente ve a la consola y copia TODO el output

7. Compara:
   - ¿El token en el email es igual al token en los logs?
   - ¿La URL del email apunta a localhost:5173 o a localhost:5030?

## 📊 Información Necesaria para Ayudarte

Por favor proporciona:

1. **El enlace COMPLETO del email** (puedes ocultar el token, pero muestra el formato)
   ```
   Ejemplo: http://localhost:5173/verify-email/ABC...XYZ
   ```

2. **Los logs completos de la consola** cuando haces clic en el enlace

3. **La respuesta del backend** (está en los logs):
   ```
   ❌ Error en verifyEmail: {
     status: 400,
     data: "..."
   }
   ```

4. **Cuánto tiempo pasa** entre recibir el email y hacer clic en el enlace
   - ¿Inmediato?
   - ¿Minutos?
   - ¿Horas?

## 🎯 Siguiente Paso

Con esta información más detallada que ahora muestra el frontend, podré identificar exactamente dónde está el problema:
- ✅ En el frontend (token mal capturado)
- ✅ En el backend (token mal validado)
- ✅ En el email (enlace mal generado)
- ✅ En la configuración (timeout muy corto)

**Por favor ejecuta estos pasos y comparte los logs completos de la consola.**
