# 🔧 Configuración Requerida en el Backend

## 🚨 Problema Actual

El frontend desplegado en `https://dbflow.estelar.andrescortes.dev` **no puede hacer peticiones** al backend en `https://service.estelar.andrescortes.dev` porque:

1. **Error 401 (Unauthorized)** - El backend rechaza el token inmediatamente después de generarlo
2. **Error "No se encontró el ID del usuario"** - El token JWT no incluye el userId en los claims
3. **CORS bloqueado** - El backend no permite peticiones desde el frontend

## ✅ Configuraciones Necesarias

### 1. CORS - Permitir Frontend

**Archivo: `Program.cs` o `Startup.cs`**

```csharp
// Agregar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "https://dbflow.estelar.andrescortes.dev"  // ← IMPORTANTE: Dominio del frontend
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// MÁS ABAJO en el pipeline
app.UseCors("AllowFrontend");  // ← Debe estar ANTES de UseAuthorization
app.UseAuthentication();
app.UseAuthorization();
```

**⚠️ IMPORTANTE:** `app.UseCors()` debe estar **ANTES** de `app.UseAuthentication()` y `app.UseAuthorization()`.

### 2. JWT - Incluir userId en los Claims

**Archivo: Donde se genera el token JWT (probablemente `UserService.cs` o `AuthController.cs`)**

```csharp
// Al generar el token JWT
var claims = new List<Claim>
{
    new Claim(ClaimTypes.Name, user.UserName),
    new Claim(ClaimTypes.Email, user.Email),
    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()), // ← IMPORTANTE
    new Claim("userId", user.UserId.ToString()),  // ← Claim adicional
    new Claim("subscriptionType", user.SubscriptionType ?? "free")
};

var token = new JwtSecurityToken(
    issuer: _configuration["Jwt:Issuer"],
    audience: _configuration["Jwt:Audience"],
    claims: claims,
    expires: DateTime.UtcNow.AddHours(24), // ← Tiempo de expiración
    signingCredentials: credentials
);
```

### 3. Login Response - Incluir userId

**Archivo: `AuthController.cs` o `UserService.cs`**

Cuando el usuario hace login, la respuesta debe incluir:

```csharp
return Ok(new
{
    token = tokenString,
    userId = user.UserId,  // ← IMPORTANTE: Incluir userId en la respuesta
    user = new
    {
        userId = user.UserId,
        userName = user.UserName,
        email = user.Email,
        subscriptionType = user.SubscriptionType ?? "free",
        subscriptionStatus = user.SubscriptionStatus ?? "active"
    }
});
```

### 4. Validación del Token JWT

**Archivo: `Program.cs` o `Startup.cs`**

```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])
            ),
            ClockSkew = TimeSpan.Zero // ← Evita que acepte tokens expirados
        };
    });
```

### 5. Endpoints - Permitir Anónimos en Auth

**Archivo: Controllers de autenticación**

```csharp
[AllowAnonymous]
[HttpPost("Login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    // ...
}

[AllowAnonymous]
[HttpPost("Register")]
public async Task<IActionResult> Register([FromBody] RegisterRequest request)
{
    // ...
}

[AllowAnonymous]
[HttpGet("Verify-Email")]
public async Task<IActionResult> VerifyEmail([FromQuery] string token)
{
    // ...
}
```

### 6. Databases Endpoint - Requerir Autenticación

```csharp
[Authorize] // ← IMPORTANTE
[HttpGet("api/Users/{userId}/Databases")]
public async Task<IActionResult> GetUserDatabases(int userId)
{
    // Verificar que el userId del token coincida con el de la URL
    var userIdFromToken = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    
    if (userIdFromToken != userId.ToString())
    {
        return Unauthorized("No tienes permiso para acceder a estos datos");
    }
    
    // Obtener bases de datos
    var databases = await _databaseService.GetUserDatabases(userId);
    return Ok(databases);
}
```

## 🧪 Cómo Verificar

### 1. Verificar CORS

Abre la consola del navegador en `https://dbflow.estelar.andrescortes.dev` y verifica que NO aparezcan errores de CORS:

```
❌ INCORRECTO:
Access to XMLHttpRequest at 'https://service.estelar.andrescortes.dev' 
from origin 'https://dbflow.estelar.andrescortes.dev' has been blocked by CORS policy

✅ CORRECTO:
No errores de CORS
```

### 2. Verificar Token JWT

Después del login, copia el token y pégalo en [https://jwt.io](https://jwt.io) para ver los claims:

```json
{
  "nameid": "66",           // ← Debe estar presente
  "userId": "66",           // ← O este
  "name": "Jeronimo",
  "email": "user@example.com",
  "subscriptionType": "free",
  "exp": 1699999999,
  "iss": "tu-issuer",
  "aud": "tu-audience"
}
```

### 3. Verificar Respuesta de Login

En la consola del navegador, después del login deberías ver:

```javascript
{
  "token": "eyJhbGc...",
  "userId": 66,  // ← Debe estar presente
  "user": {
    "userId": 66,
    "userName": "Jeronimo",
    "email": "user@example.com",
    "subscriptionType": "free"
  }
}
```

## 🔍 Debugging

Si sigues teniendo problemas, verifica en el backend:

1. **Logs del backend** - Revisa qué dice cuando rechaza el token
2. **Configuración de JWT** - Verifica Issuer, Audience y Key
3. **Orden del middleware** - CORS debe estar antes de Authentication
4. **Claims del token** - Verifica que incluya userId

## 📞 Endpoints que DEBEN funcionar

Después de estas configuraciones, estos endpoints deben responder correctamente:

```bash
# Login (sin autenticación)
POST https://service.estelar.andrescortes.dev/api/Access/Login

# Obtener bases de datos (CON autenticación)
GET https://service.estelar.andrescortes.dev/api/Users/66/Databases
Headers: Authorization: Bearer TOKEN_AQUI

# Crear base de datos (CON autenticación)
POST https://service.estelar.andrescortes.dev/api/Databases/MySQL
Headers: Authorization: Bearer TOKEN_AQUI
Body: { "databaseName": "test", "engine": "MySQL", "userId": 66 }
```

## ✅ Checklist

- [ ] CORS configurado con el dominio del frontend
- [ ] JWT incluye userId en los claims
- [ ] Respuesta de login incluye userId
- [ ] Endpoints de autenticación tienen `[AllowAnonymous]`
- [ ] Endpoints protegidos tienen `[Authorize]`
- [ ] Orden correcto del middleware (CORS → Auth → Authorization)
- [ ] Token tiene tiempo de expiración razonable (24h+)

---

**Una vez implementados estos cambios en el backend, el frontend funcionará correctamente sin necesidad de cambios adicionales.**
