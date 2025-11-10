# 🧪 Cómo Probar la Verificación de Email

## 📋 Pasos para Probar

### 1️⃣ Registro de Usuario
1. Abre la aplicación en tu navegador: `http://localhost:5173`
2. Ve a la página de registro (`/register`)
3. Completa el formulario con:
   - Nombre
   - Email (usa un email de prueba)
   - Contraseña
4. Haz clic en "Registrarse"
5. Deberías ver un mensaje indicando que se ha enviado un email de verificación

### 2️⃣ Revisar el Email de Verificación
1. Revisa la bandeja de entrada del email que registraste
2. Busca el correo de verificación de DBFlow
3. **IMPORTANTE**: Copia el enlace completo del correo

### 3️⃣ Verificar el Token en la Consola
**Antes de hacer clic en el enlace**, abre la consola del navegador (F12) para ver los logs:

1. Haz clic en el enlace de verificación del email
2. En la consola verás estos logs importantes:
   ```
   🔍 VerifyEmail mounted
   📋 Route params: { token: "..." }
   📋 Route query: { }
   🔑 Token encontrado: ...
   ✉️ Iniciando verificación con token: ...
   🔑 verifyEmail llamado con token: ...
   📡 URL completa: http://localhost:5030/api/Access/Verify-Email?token=...
   ```

3. Si hay un error, verás:
   ```
   ❌ Error en verifyEmail: { status: 400/401/404, data: ... }
   ```

### 4️⃣ Analizar los Posibles Errores

#### ❌ Error: "Token no encontrado" o "Token vacío"
**Causa**: El enlace del email no tiene el token correctamente formateado

**Solución**: El backend debe generar enlaces como:
- `http://localhost:5173/verify-email/TOKEN_AQUI` (preferido)
- O `http://localhost:5173/verify-email?token=TOKEN_AQUI`

**Verificar en el backend**: El código que genera el email debe crear URLs como:
```csharp
var verificationUrl = $"{frontendUrl}/verify-email/{token}";
```

#### ❌ Error 400: "Token inválido"
**Causa**: El token no tiene el formato esperado por el backend

**Verificar**:
1. Revisa el token en la consola
2. Compara con el formato esperado por tu backend
3. Puede necesitar URL encoding/decoding

#### ❌ Error 400/404: "Token expirado"
**Causa**: El token ya expiró (tiempo configurado en el backend)

**Solución**:
1. Solicita un nuevo enlace usando "Reenviar correo de verificación"
2. Ajusta el tiempo de expiración en el backend si es muy corto

#### ❌ Error 401: "No autorizado"
**Causa**: El interceptor está añadiendo el Bearer token cuando no debería

**Verificar en consola**:
```
🚫 NO agregando token para ruta de autenticación: /api/Access/Verify-Email
```

Si no ves este log, el interceptor está mal configurado.

### 5️⃣ Verificar la Configuración del Backend

El backend debe:

#### A) Generar el enlace correcto en el email
```csharp
// ✅ CORRECTO
var verificationUrl = $"{frontendUrl}/verify-email/{token}";

// ❌ INCORRECTO
var verificationUrl = $"{backendUrl}/Verify-Email?token={token}";
```

#### B) Aceptar tokens por query parameter
```csharp
[HttpGet("Verify-Email")]
public async Task<IActionResult> VerifyEmail([FromQuery] string token)
{
    // Validar token
}
```

#### C) No requerir autenticación
```csharp
[AllowAnonymous]
[HttpGet("Verify-Email")]
```

#### D) Tener CORS configurado
```csharp
services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder.WithOrigins("http://localhost:5173", "https://dbflow.estelar.andrescortes.dev")
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});
```

### 6️⃣ Probar el Reenvío de Verificación

Si el token expira o hay problemas:

1. Ve a `/verify-email` (sin token)
2. Ingresa tu email
3. Haz clic en "Reenviar correo de verificación"
4. Revisa la consola para ver:
   ```
   🔄 Reenviando verificación a: tu@email.com
   ✅ Email enviado exitosamente
   ```

### 7️⃣ Formatos de URL Soportados

El frontend acepta estos formatos:

1. **Token en la ruta** (preferido):
   ```
   http://localhost:5173/verify-email/ABC123XYZ
   ```

2. **Token en query string**:
   ```
   http://localhost:5173/verify-email?token=ABC123XYZ
   ```

3. **Alias con mayúsculas**:
   ```
   http://localhost:5173/Verify-Email/ABC123XYZ
   ```

## 🔍 Checklist de Debugging

- [ ] El email llega correctamente
- [ ] El enlace del email tiene un token
- [ ] Al hacer clic, se abre la página `/verify-email`
- [ ] La consola muestra el token capturado
- [ ] La URL del API es correcta (`http://localhost:5030/api/Access/Verify-Email`)
- [ ] No se añade Bearer token a la petición
- [ ] La respuesta del backend es clara (success o error específico)
- [ ] En caso de éxito, redirige a `/login`

## 📝 Ejemplo de Flujo Exitoso

```
Usuario → Registro → Backend envía email
Usuario → Revisa email → Clic en enlace
Frontend → Extrae token → Llama verifyEmail(token)
Backend → Valida token → Marca email como verificado
Frontend → Muestra éxito → Redirige a /login
```

## 🆘 Si Todo Falla

1. **Verifica el token directamente**:
   - Copia el token de la consola
   - Prueba la API manualmente: `curl -X GET "http://localhost:5030/api/Access/Verify-Email?token=TU_TOKEN"`

2. **Revisa los logs del backend**:
   - Verifica que recibe el token
   - Verifica que el token está en la base de datos
   - Verifica que no ha expirado

3. **Prueba con Postman/Insomnia**:
   - GET: `http://localhost:5030/api/Access/Verify-Email?token=TU_TOKEN`
   - Sin headers de autenticación

## 🎯 Cambios Implementados

1. ✅ Logs detallados en `VerifyEmail.vue`
2. ✅ Logs detallados en `authService.js`
3. ✅ Manejo de tokens desde params y query
4. ✅ Mensajes de error más descriptivos
5. ✅ Auto-redirect a login después de verificación exitosa
6. ✅ Soporte para múltiples formatos de URL

## 📞 Información de Debug a Reportar

Si sigues teniendo problemas, reporta:
1. Los logs completos de la consola
2. La URL completa del enlace de verificación
3. La respuesta del backend (status y data)
4. Si el email llega y tiene un enlace
