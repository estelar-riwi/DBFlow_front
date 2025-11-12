# Implementación de Checkout Pro en el Backend

## Agregar este DTOs y endpoint al controlador PaymentsController

```csharp
using System;
using System.Threading.Tasks;
using CrudCloud.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CrudCloud.Controllers
{
    // DTO para Checkout Pro
    public class CheckoutProRequest
    {
        public string PlanId { get; set; }
        public int UserId { get; set; }
        public string Email { get; set; }
    }

    public class CheckoutProResponse
    {
        public string InitPoint { get; set; }
        public string PreferenceId { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly MercadoPagoService _mpService;
        private readonly ILogger<PaymentsController> _logger;

        public PaymentsController(MercadoPagoService mpService, ILogger<PaymentsController> logger)
        {
            _mpService = mpService;
            _logger = logger;
        }

        // ✅ ENDPOINT EXISTENTE
        [HttpPost("create-preference")]
        public async Task<IActionResult> CreatePreference([FromBody] PreferenceRequest request)
        {
            if (string.IsNullOrEmpty(request.PlanId) || request.UserId <= 0)
            {
                return BadRequest(new { error = "PlanId y UserId son obligatorios." });
            }

            try
            {
                _logger.LogInformation("Creando preferencia para UserId: {UserId} y PlanId: {PlanId}", request.UserId, request.PlanId);

                var preference = await _mpService.CreatePreferenceAsync(request.PlanId, request.UserId);
                
                return Ok(preference);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Intento de crear preferencia con PlanId inválido: {PlanId}", request.PlanId);
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error crítico al crear la preferencia de pago para UserId: {UserId}", request.UserId);
                return StatusCode(500, new { error = "Ocurrió un error inesperado al procesar el pago." });
            }
        }

        // ✅ NUEVO ENDPOINT PARA CHECKOUT PRO
        [HttpPost("checkout-pro")]
        public async Task<IActionResult> CheckoutPro([FromBody] CheckoutProRequest request)
        {
            if (string.IsNullOrEmpty(request.PlanId) || request.UserId <= 0 || string.IsNullOrEmpty(request.Email))
            {
                return BadRequest(new { 
                    message = "PlanId, UserId y Email son obligatorios." 
                });
            }

            try
            {
                _logger.LogInformation("Iniciando Checkout Pro para UserId: {UserId}, PlanId: {PlanId}, Email: {Email}", 
                    request.UserId, request.PlanId, request.Email);

                // Usar el servicio de Mercado Pago para crear la preferencia
                var preference = await _mpService.CreatePreferenceAsync(request.PlanId, request.UserId, request.Email);
                
                _logger.LogInformation("Preferencia creada exitosamente con initPoint: {InitPoint}", preference.InitPoint);

                return Ok(new CheckoutProResponse
                {
                    InitPoint = preference.InitPoint,
                    PreferenceId = preference.PreferenceId
                });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Argumento inválido en CheckoutPro: {PlanId}", request.PlanId);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error crítico en CheckoutPro para UserId: {UserId}", request.UserId);
                return StatusCode(500, new { 
                    message = "Ocurrió un error al procesar el checkout. Inténtalo de nuevo más tarde." 
                });
            }
        }

        public class PreferenceRequest
        {
            public string PlanId { get; set; }
            public int UserId { get; set; }
        }
    }
}
```

## Cambios en MercadoPagoService

Actualiza tu `MercadoPagoService.cs` con esta sobrecarga que acepte email:

```csharp
/// <summary>
/// Crea una preferencia de pago para Checkout Pro (sobrecarga con email).
/// </summary>
public async Task<Preference> CreatePreferenceAsync(string planExternalId, int userId, string email = null)
{
    var plan = await _planRepository.GetPlanByExternalIdAsync(planExternalId);
    if (plan == null)
    {
        throw new ArgumentException("El PlanId proporcionado no es válido o no existe en la base de datos.", nameof(planExternalId));
    }

    var backUrls = new PreferenceBackUrlsRequest
    {
        Success = $"https://estelar.andrescortes.dev/dashboard/subscription?status=approved&plan={planExternalId}",
        Failure = $"https://estelar.andrescortes.dev/dashboard/subscription?status=rejected&plan={planExternalId}",
        Pending = $"https://estelar.andrescortes.dev/dashboard/subscription?status=pending&plan={planExternalId}"
    };

    var items = new List<PreferenceItemRequest>
    {
        new PreferenceItemRequest
        {
            Id = plan.ExternalId,
            Title = plan.Name,
            Description = plan.Description,
            Quantity = 1,
            CurrencyId = "COP",
            UnitPrice = plan.Price,
        }
    };

    var request = new PreferenceRequest
    {
        Items = items,
        BackUrls = backUrls,
        AutoReturn = "approved",
        ExternalReference = userId.ToString(),
        NotificationUrl = $"{_configuration["AppSettings:BackendUrl"]}/api/webhooks/mercadopago",
        Payer = !string.IsNullOrEmpty(email) ? new PreferencePayerRequest { Email = email } : null
    };

    var client = new PreferenceClient();
    Preference preference = await client.CreateAsync(request);
    
    return preference;
}
```

## Notas importantes

1. El endpoint `/api/payments/checkout-pro` está en la misma ruta que el existente
2. Retorna un objeto con `InitPoint` y `PreferenceId`
3. Registra logs detallados para debugging
4. Incluye manejo de errores completo
