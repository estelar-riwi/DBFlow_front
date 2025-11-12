# Guía de Despliegue - DBFlow Frontend

## Variables de Entorno

### Desarrollo (.env o .env.development)
```env
VITE_API_URL=https://service.estelar.andrescortes.dev
```

### Producción (.env.production)
```env
VITE_API_URL=https://service.estelar.andrescortes.dev
```

## Comandos de Build

### Desarrollo
```bash
npm run dev
```

### Build para Producción
```bash
npm run build
```

### Preview de Build
```bash
npm run preview
```

## Despliegue

### 1. Asegúrate de tener el archivo .env.production
El archivo `.env.production` debe contener:
```env
VITE_API_URL=https://service.estelar.andrescortes.dev
```

### 2. Genera el build
```bash
npm run build
```

Esto creará la carpeta `dist/` con los archivos estáticos.

### 3. Despliega la carpeta dist/
Sube el contenido de la carpeta `dist/` a tu servidor o servicio de hosting.

## Verificación del Despliegue

### Errores Comunes

#### Error 401 (Unauthorized)
**Causas:**
1. Token expirado - El usuario necesita hacer login nuevamente
2. CORS no configurado en el backend
3. Headers de Authorization no se están enviando

**Solución:**
- Verifica que el archivo `.env.production` exista y tenga la URL correcta
- Asegúrate de hacer el build con `npm run build` después de crear el archivo
- Limpia el localStorage del navegador y haz login nuevamente
- Verifica en la consola del navegador que se muestra la URL correcta:
  ```
  🌐 API_BASE_URL configurada: https://service.estelar.andrescortes.dev
  ```

#### CORS Errors
**Solución en el Backend:**
El backend debe tener configurado CORS para permitir el dominio del frontend:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://dbflow.estelar.andrescortes.dev")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
```

## Checklist de Despliegue

- [ ] Archivo `.env.production` creado con la URL correcta del backend
- [ ] Build generado con `npm run build`
- [ ] CORS configurado en el backend para el dominio del frontend
- [ ] Backend desplegado y accesible en la URL especificada
- [ ] SSL/HTTPS configurado en ambos (frontend y backend)
- [ ] Tokens de autenticación funcionando correctamente

## Logs de Debug

En producción, puedes ver los logs en la consola del navegador:
- URL configurada del API
- Modo de ejecución (development/production)
- Estado del interceptor de Axios
- Errores de autenticación

Para habilitar logs adicionales, revisa la consola del navegador (F12).
