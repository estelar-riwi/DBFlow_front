# Configuración Backend para DBFlow

## CORS Configuration

El backend debe tener configurado CORS para permitir peticiones desde el frontend desplegado.

### En Program.cs o Startup.cs:

```csharp
// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173", // Desarrollo
            "https://dbflow.estelar.andrescortes.dev" // Producción
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});

// Después de builder.Build()
var app = builder.Build();

// IMPORTANTE: UseCors debe ir ANTES de UseAuthentication y UseAuthorization
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
```

## Verificación de Headers

El frontend envía el token de la siguiente manera:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Asegúrate de que el backend esté configurado para leer este header.

## Endpoints Necesarios

### Bases de Datos
- `POST /api/Databases/MySQL` - Crear base de datos (requiere autenticación)
- `GET /api/Users/{userId}/Databases` - Obtener bases de datos del usuario
- `GET /api/Users/{userId}/Databases/Count` - Obtener conteo de bases de datos
- `POST /api/Databases/MySQL/{id}/RotateCredentials` - Rotar credenciales
- `DELETE /api/Databases/MySQL/{id}` - Eliminar base de datos

### Autenticación
- `POST /api/Access/Login` - Login
- `POST /api/Access/Register` - Registro
- `POST /api/Access/Resend-Verification` - Reenviar verificación de email
- `GET /api/Users/Profile` - Obtener perfil del usuario

### Suscripciones
- `GET /api/Users/Subscriptions` - Obtener historial de suscripciones
- `POST /api/Payments/subscription` - Crear suscripción

## Logs de Debug Recomendados

Agrega logs en el backend para verificar:
1. Si el token está llegando en el header Authorization
2. Si el token se está validando correctamente
3. Si el userId se está extrayendo correctamente del token
4. Si CORS está permitiendo las peticiones

```csharp
// Middleware para log
app.Use(async (context, next) =>
{
    if (context.Request.Headers.ContainsKey("Authorization"))
    {
        var authHeader = context.Request.Headers["Authorization"].ToString();
        Console.WriteLine($"Authorization Header: {authHeader.Substring(0, Math.Min(50, authHeader.Length))}...");
    }
    else
    {
        Console.WriteLine($"⚠️ No Authorization header in {context.Request.Method} {context.Request.Path}");
    }
    
    await next();
});
```

## Errores Comunes

### 401 Unauthorized
- Verifica que el token JWT sea válido y no esté expirado
- Verifica que la clave secreta (JWT_SECRET) sea la misma que se usó para generar el token
- Verifica que el token esté en formato: `Bearer {token}`

### 400 Bad Request
- Verifica que el payload tenga la estructura correcta
- El frontend envía: `{ databaseName: string, engine: string, userId: number }`

### CORS Errors
- Asegúrate de que `UseCors()` esté ANTES de `UseAuthentication()` y `UseAuthorization()`
- Verifica que el dominio del frontend esté en la lista de orígenes permitidos
