# 🔧 Corrección del Backend - Enlaces de Verificación

## 🎯 Problema Identificado

El backend está generando enlaces con la URL del backend en lugar del frontend:

**❌ URL Incorrecta (actual):**
```
https://estelar.andrescortes.dev/Verify-Email?token=...
```

**✅ URL Correcta (debe ser):**
```
http://localhost:5174/verify-email/TOKEN_AQUI          (desarrollo)
https://dbflow.estelar.andrescortes.dev/verify-email/TOKEN_AQUI  (producción)
```

## 📝 Cambios Necesarios en el Backend

### 1. Agregar FrontendUrl a appsettings

**appsettings.Development.json:**
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "FrontendUrl": "http://localhost:5174",
  "ConnectionStrings": {
    "DefaultConnection": "..."
  }
}
```

**appsettings.Production.json:**
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "FrontendUrl": "https://dbflow.estelar.andrescortes.dev",
  "ConnectionStrings": {
    "DefaultConnection": "..."
  }
}
```

### 2. Modificar el Servicio que Genera Emails

**Archivo: `Services/UserService.cs` (o similar)**

**❌ Código Actual (INCORRECTO):**
```csharp
// En el método RegisterUser o similar
var verificationUrl = $"https://estelar.andrescortes.dev/Verify-Email?token={emailToken}";

_logger.LogInformation("--- ENLACE DE VERIFICACIÓN GENERADO (PARA PRUEBAS) ---");
_logger.LogInformation(verificationUrl);
_logger.LogInformation("-----------------------------------------------------");
```

**✅ Código Corregido:**
```csharp
// Al inicio de la clase, inyectar IConfiguration
private readonly IConfiguration _configuration;

public UserService(
    ApplicationDbContext context,
    IEmailService emailService,
    IConfiguration configuration,  // ← Agregar esto
    ILogger<UserService> logger
)
{
    _context = context;
    _emailService = emailService;
    _configuration = configuration;  // ← Agregar esto
    _logger = logger;
}

// En el método RegisterUser
var frontendUrl = _configuration["FrontendUrl"];
var verificationUrl = $"{frontendUrl}/verify-email/{emailToken}";

_logger.LogInformation("--- ENLACE DE VERIFICACIÓN GENERADO (PARA PRUEBAS) ---");
_logger.LogInformation(verificationUrl);
_logger.LogInformation("-----------------------------------------------------");
```

### 3. Actualizar el Template del Email

**Archivo: `Templates/VerificationEmail.html` (o donde generes el HTML del email)**

**❌ HTML Actual:**
```html
<a href="https://estelar.andrescortes.dev/Verify-Email?token={{TOKEN}}">
    Verificar Correo
</a>
```

**✅ HTML Corregido:**
```html
<a href="{{VERIFICATION_URL}}">
    Verificar Correo
</a>
```

**Y en el código C# donde usas el template:**
```csharp
var frontendUrl = _configuration["FrontendUrl"];
var verificationUrl = $"{frontendUrl}/verify-email/{emailToken}";

var emailBody = emailTemplate
    .Replace("{{TOKEN}}", emailToken)
    .Replace("{{VERIFICATION_URL}}", verificationUrl)
    .Replace("{{USER_NAME}}", userName);
```

### 4. Verificar CORS en el Backend

Asegúrate de que el backend permite peticiones desde el frontend:

**Archivo: `Program.cs` o `Startup.cs`**

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", builder =>
    {
        builder.WithOrigins(
                "http://localhost:5173",  // Puerto por defecto de Vite
                "http://localhost:5174",  // Puerto alternativo
                "https://dbflow.estelar.andrescortes.dev"  // Producción
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Más abajo en el pipeline
app.UseCors("AllowFrontend");
```

## 🧪 Cómo Probar los Cambios

### Paso 1: Aplicar los cambios al backend

1. Modifica los archivos mencionados
2. Guarda los cambios
3. Reinicia el servidor del backend

### Paso 2: Probar el registro

1. Ve a `http://localhost:5174/register`
2. Regístrate con un nuevo email
3. Revisa los logs del backend - ahora deberías ver:
   ```
   info: CrudCloud.Services.UserService[0]
         --- ENLACE DE VERIFICACIÓN GENERADO (PARA PRUEBAS) ---
   info: CrudCloud.Services.UserService[0]
         http://localhost:5174/verify-email/TOKEN_AQUI
   info: CrudCloud.Services.UserService[0]
         -----------------------------------------------------
   ```

### Paso 3: Hacer clic en el enlace del email

1. Revisa tu correo
2. El enlace ahora debe apuntar a `http://localhost:5174/verify-email/...`
3. Haz clic y verifica que funcione

## ✅ Checklist de Verificación

- [ ] `appsettings.Development.json` tiene `FrontendUrl: http://localhost:5174`
- [ ] `appsettings.Production.json` tiene `FrontendUrl: https://dbflow.estelar.andrescortes.dev`
- [ ] `UserService.cs` inyecta `IConfiguration`
- [ ] El código usa `_configuration["FrontendUrl"]` para generar URLs
- [ ] El template del email usa `{{VERIFICATION_URL}}` en lugar de URL hardcodeada
- [ ] CORS permite peticiones desde ambos frontends (local y producción)
- [ ] Los logs muestran la URL correcta del frontend

## 🎯 Resultado Esperado

Después de estos cambios:

1. **Desarrollo local:**
   - Email contiene: `http://localhost:5174/verify-email/TOKEN`
   - Usuario hace clic → se abre el frontend local
   - Frontend llama a `http://localhost:5030/api/Access/Verify-Email?token=TOKEN`
   - Backend verifica y marca como verificado ✅

2. **Producción:**
   - Email contiene: `https://dbflow.estelar.andrescortes.dev/verify-email/TOKEN`
   - Usuario hace clic → se abre el frontend de producción
   - Frontend llama a `https://service.estelar.andrescortes.dev/api/Access/Verify-Email?token=TOKEN`
   - Backend verifica y marca como verificado ✅

## 📞 Si Necesitas Ayuda

Si no tienes acceso al código del backend o necesitas más ayuda, comparte:
1. La estructura de archivos del proyecto backend
2. El contenido del archivo `UserService.cs` o similar
3. El contenido de `appsettings.json`

¡Y te ayudaré a hacer los cambios exactos!
