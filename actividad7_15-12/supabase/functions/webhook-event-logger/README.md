# Edge Function 1: Webhook Event Logger

## 📋 Descripción

Edge Function que valida y registra eventos de webhook provenientes de los microservicios.

## ✅ Funcionalidades Implementadas

1. **Validación de firma HMAC-SHA256** - Verifica la autenticidad del webhook
2. **Anti-replay attack** - Rechaza webhooks con timestamp mayor a 5 minutos
3. **Idempotencia** - Previene procesamiento duplicado de eventos
4. **Persistencia** - Guarda todos los eventos en `webhook_events`
5. **Response rápido** - Retorna 200 OK con `event_id` generado

## 🗄️ Tablas Creadas

### webhook_events
Almacena todos los eventos de webhook recibidos:
- `id` - UUID único del evento
- `event_type` - Tipo de evento (ej: "clase.created")
- `idempotency_key` - Clave para deduplicación
- `webhook_id` - ID del webhook original
- `source` - Microservicio origen
- `version` - Versión del schema
- `timestamp` - Timestamp del evento original
- `received_at` - Timestamp de recepción
- `payload` - Payload completo (JSONB)
- `metadata` - Metadata del evento (JSONB)
- `signature` - Firma HMAC-SHA256

### processed_webhooks (opcional)
Tracking adicional del procesamiento:
- `id` - UUID del registro
- `event_id` - Referencia a webhook_events
- `idempotency_key` - Clave de deduplicación
- `processed_at` - Timestamp de procesamiento
- `processing_status` - Estado (success, failed, pending)
- `error_message` - Mensaje de error si aplica
- `retry_count` - Contador de reintentos

## 🔧 Configuración

### Variables de Entorno

Configura en Supabase Dashboard o localmente:

```bash
WEBHOOK_SECRET=tu-secreto-compartido-con-microservicios
SUPABASE_URL=tu-url-de-supabase
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

### Migración de Base de Datos

Ejecuta la migración para crear las tablas:

```bash
supabase migration up
```

O aplica manualmente el archivo:
```
supabase/migrations/20241214000001_create_webhook_events.sql
```

## 🚀 Deployment

### Local (Development)

```bash
# 1. Iniciar Supabase local
supabase start

# 2. Configurar secret (Unix/Mac)
export WEBHOOK_SECRET="mi-secreto-seguro"

# 2. Configurar secret (Windows)
set WEBHOOK_SECRET=mi-secreto-seguro

# 3. Servir la función
supabase functions serve webhook-event-logger
```

### Producción

```bash
# Deploy a Supabase
supabase functions deploy webhook-event-logger

# Configurar secreto
supabase secrets set WEBHOOK_SECRET=tu-secreto-seguro
```

## 📡 Headers Requeridos

Cada webhook debe incluir:

```
Content-Type: application/json
X-Webhook-Signature: <hmac-sha256-hex>
X-Webhook-Id: <uuid>
X-Webhook-Timestamp: <iso-8601-timestamp>
```

## 📦 Payload Esperado

```json
{
  "event": "clase.created",
  "version": "1.0",
  "id": "uuid-v4",
  "idempotency_key": "uuid-v4",
  "timestamp": "2025-12-14T10:30:00Z",
  "data": {
    "id": 1,
    "nombre": "Yoga Avanzado",
    "instructor": "María López"
  },
  "metadata": {
    "source": "ms-clases",
    "environment": "production",
    "correlation_id": "uuid-v4"
  }
}
```

## 🔒 Seguridad

### Validación de Firma

La función calcula HMAC-SHA256 del payload y lo compara con el header `X-Webhook-Signature`:

```typescript
HMAC-SHA256(payload_json, WEBHOOK_SECRET) === X-Webhook-Signature
```

### Anti-Replay Attack

Rechaza webhooks con timestamp mayor a 5 minutos:

```typescript
|current_time - webhook_timestamp| <= 5 minutes
```

### Idempotencia

Verifica que `idempotency_key` no exista en la tabla antes de procesar.

## 📊 Responses

### Success (200 OK)
```json
{
  "success": true,
  "event_id": "uuid-generado",
  "message": "Webhook event logged successfully",
  "received_at": "2025-12-14T10:30:00Z"
}
```

### Duplicate (200 OK)
```json
{
  "message": "Event already processed",
  "idempotency_key": "uuid-existente"
}
```

### Invalid Signature (401)
```json
{
  "error": "Invalid signature"
}
```

### Timestamp Too Old (400)
```json
{
  "error": "Timestamp too old",
  "maxAge": "5 minutes"
}
```

### Missing Headers (400)
```json
{
  "error": "Missing required headers",
  "required": [
    "x-webhook-signature",
    "x-webhook-id",
    "x-webhook-timestamp"
  ]
}
```

## 🧪 Testing

### Con curl

```bash
curl -i --location --request POST \
  'https://tu-proyecto.supabase.co/functions/v1/webhook-event-logger' \
  --header 'Authorization: Bearer tu-anon-key' \
  --header 'Content-Type: application/json' \
  --header 'X-Webhook-Signature: firma-hmac-sha256' \
  --header 'X-Webhook-Id: 123e4567-e89b-12d3-a456-426614174000' \
  --header 'X-Webhook-Timestamp: 2025-12-14T10:30:00Z' \
  --data '{
    "event": "clase.created",
    "version": "1.0",
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "idempotency_key": "unique-key-123",
    "timestamp": "2025-12-14T10:30:00Z",
    "data": {"id": 1, "nombre": "Yoga"},
    "metadata": {
      "source": "ms-clases",
      "environment": "development",
      "correlation_id": "correlation-123"
    }
  }'
```

### Generar firma HMAC (Node.js)

```javascript
const crypto = require('crypto');

const payload = JSON.stringify({...}); // Tu payload
const secret = 'tu-secreto';

const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

console.log('Signature:', signature);
```

## 📝 Logs

La función registra:
- ✅ Signature válida
- ✅ Timestamp válido
- ✅ No es duplicado
- ✅ Evento guardado con ID
- ❌ Errores de validación
- ⚠️ Eventos duplicados detectados

## 🔗 Integración con Microservicios

Los microservicios deben enviar webhooks a:

```
https://tu-proyecto.supabase.co/functions/v1/webhook-event-logger
```

Asegúrate de:
1. Usar el mismo `WEBHOOK_SECRET` en todos los servicios
2. Incluir todos los headers requeridos
3. Firmar el payload correctamente
4. Usar `idempotency_key` único por evento

## 📈 Monitoreo

### Consultar eventos recibidos

```sql
SELECT 
  id,
  event_type,
  source,
  timestamp,
  received_at
FROM webhook_events
ORDER BY received_at DESC
LIMIT 100;
```

### Verificar duplicados rechazados

Revisa los logs de la función para ver eventos con `idempotency_key` duplicado.

### Estadísticas por fuente

```sql
SELECT 
  source,
  event_type,
  COUNT(*) as total
FROM webhook_events
GROUP BY source, event_type
ORDER BY total DESC;
```
