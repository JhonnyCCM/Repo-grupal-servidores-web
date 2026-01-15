# Edge Function 2: Webhook External Notifier

## 📋 Descripción

Edge Function que procesa webhooks y envía notificaciones externas a través de Telegram Bot y/o Email.

## ✅ Funcionalidades Implementadas

1. **Validación de firma HMAC-SHA256** - Verifica autenticidad del webhook
2. **Idempotencia con PostgreSQL** - Previene notificaciones duplicadas
3. **Notificaciones a Telegram** - Envía mensajes formateados a Telegram Bot
4. **Notificaciones por Email** - Envía emails (integración lista para servicios SMTP)
5. **Registro en base de datos** - Guarda resultado en `webhook_notifications`
6. **Retry automático** - Retorna 500 en fallos para que el sistema reintente

## 🗄️ Tabla de Base de Datos

### webhook_notifications
Registra todas las notificaciones enviadas:
- `id` - UUID único de la notificación
- `event_id` - Referencia a webhook_events
- `idempotency_key` - Clave para deduplicación (UNIQUE)
- `notification_type` - Tipo (telegram, email, both)
- `recipient` - Destinatarios (telegram:ID, email:address)
- `status` - Estado (success, failed, pending)
- `sent_at` - Timestamp de envío exitoso
- `error_message` - Mensaje de error si aplica
- `telegram_message_id` - ID del mensaje de Telegram
- `email_message_id` - ID del email enviado
- `retry_count` - Contador de reintentos
- `created_at` - Timestamp de creación
- `updated_at` - Timestamp de última actualización

## 🔧 Configuración

### Variables de Entorno Requeridas

#### Para Telegram Bot:
```bash
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_CHAT_ID=123456789
```

#### Para Email (opcional):
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-password
EMAIL_FROM=noreply@tu-dominio.com
EMAIL_TO=destinatario@example.com
```

#### Secreto para validación:
```bash
WEBHOOK_SECRET=mismo-secreto-que-microservicios
```

### Crear Bot de Telegram

1. **Habla con [@BotFather](https://t.me/BotFather)** en Telegram
2. Envía `/newbot` y sigue las instrucciones
3. Copia el **Bot Token** que te proporciona
4. Obtén tu **Chat ID**:
   - Envía un mensaje a tu bot
   - Visita: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Busca `"chat":{"id":123456789}`
   - Ese número es tu CHAT_ID

## 🚀 Deployment

### Local (Development)

```bash
# 1. Iniciar Supabase local
supabase start

# 2. Configurar variables (Unix/Mac)
export WEBHOOK_SECRET="mi-secreto"
export TELEGRAM_BOT_TOKEN="tu-bot-token"
export TELEGRAM_CHAT_ID="tu-chat-id"
export EMAIL_TO="tu-email@example.com"

# 2. Configurar variables (Windows)
set WEBHOOK_SECRET=mi-secreto
set TELEGRAM_BOT_TOKEN=tu-bot-token
set TELEGRAM_CHAT_ID=tu-chat-id
set EMAIL_TO=tu-email@example.com

# 3. Aplicar migración
supabase migration up

# 4. Servir la función
supabase functions serve webhook-external-notifier
```

### Producción

```bash
# 1. Deploy la función
supabase functions deploy webhook-external-notifier

# 2. Configurar secretos
supabase secrets set WEBHOOK_SECRET=tu-secreto
supabase secrets set TELEGRAM_BOT_TOKEN=tu-bot-token
supabase secrets set TELEGRAM_CHAT_ID=tu-chat-id
supabase secrets set EMAIL_TO=tu-email@example.com
```

## 📡 Headers Requeridos

```
Content-Type: application/json
X-Webhook-Signature: <hmac-sha256-hex>
X-Webhook-Id: <uuid>
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

## 📨 Formato de Notificaciones

### Telegram
```
🔔 Webhook Event Received

Event: clase.created
Source: ms-clases
Environment: production
Timestamp: 2025-12-14T10:30:00Z

Data:
{
  "id": 1,
  "nombre": "Yoga Avanzado",
  "instructor": "María López"
}

Correlation ID: uuid-v4
```

### Email
```
Subject: Webhook Event: clase.created

Webhook Event Received

Event: clase.created
Source: ms-clases
Environment: production
Timestamp: 2025-12-14T10:30:00Z

Data:
{
  "id": 1,
  "nombre": "Yoga Avanzado",
  "instructor": "María López"
}

Correlation ID: uuid-v4
Webhook ID: uuid-v4
```

## 📊 Responses

### Success (200 OK)
```json
{
  "success": true,
  "message": "Notifications sent successfully",
  "telegram_message_id": "12345",
  "email_message_id": "email-abc123"
}
```

### Duplicate (200 OK)
```json
{
  "message": "Notification already processed",
  "idempotency_key": "uuid-existente"
}
```

### Invalid Signature (401)
```json
{
  "error": "Invalid signature"
}
```

### Notification Failed (500) - Trigger Retry
```json
{
  "success": false,
  "error": "Failed to send notifications",
  "details": "Telegram: Connection timeout"
}
```

## 🔄 Retry Strategy

Cuando la función retorna **500**, el sistema de webhooks de los microservicios automáticamente reintenta con exponential backoff:
- Intento 1: Inmediato
- Intento 2: +2 segundos
- Intento 3: +4 segundos
- Intento 4: +8 segundos
- Intento 5: +16 segundos

## 🧪 Testing

### Con curl (Telegram)

```bash
curl -i --location --request POST \
  'https://tu-proyecto.supabase.co/functions/v1/webhook-external-notifier' \
  --header 'Authorization: Bearer tu-anon-key' \
  --header 'Content-Type: application/json' \
  --header 'X-Webhook-Signature: firma-hmac-sha256' \
  --header 'X-Webhook-Id: 123e4567-e89b-12d3-a456-426614174000' \
  --data '{
    "event": "clase.created",
    "version": "1.0",
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "idempotency_key": "unique-key-123",
    "timestamp": "2025-12-14T10:30:00Z",
    "data": {"id": 1, "nombre": "Yoga", "instructor": "María"},
    "metadata": {
      "source": "ms-clases",
      "environment": "development",
      "correlation_id": "correlation-123"
    }
  }'
```

### Verificar en Telegram

Después de enviar un webhook exitoso, deberías recibir un mensaje en tu chat de Telegram con el formato mostrado arriba.

## 🔗 Integración con Microservicios

Registra esta Edge Function como suscriptor:

```bash
POST http://localhost:3001/webhooks/subscriptions
{
  "url": "https://tu-proyecto.supabase.co/functions/v1/webhook-external-notifier",
  "events": ["clase.created", "inscripcion.created"],
  "secret": "tu-secreto-compartido"
}
```

## 📈 Monitoreo

### Consultar notificaciones enviadas

```sql
SELECT 
  id,
  notification_type,
  recipient,
  status,
  sent_at,
  error_message
FROM webhook_notifications
ORDER BY created_at DESC
LIMIT 100;
```

### Estadísticas por tipo

```sql
SELECT 
  notification_type,
  status,
  COUNT(*) as total
FROM webhook_notifications
GROUP BY notification_type, status
ORDER BY total DESC;
```

### Notificaciones fallidas

```sql
SELECT 
  id,
  idempotency_key,
  notification_type,
  error_message,
  retry_count,
  created_at
FROM webhook_notifications
WHERE status = 'failed'
ORDER BY created_at DESC;
```

## 🔒 Seguridad

- **Validación HMAC-SHA256** para autenticar webhooks
- **Idempotencia** para prevenir duplicados
- **Rate limiting** nativo de Supabase
- **Secrets management** con Supabase Vault

## 📝 Logs

La función registra:
- ✅ Firma válida
- ✅ No es duplicado
- ✅ Notificaciones enviadas exitosamente
- ❌ Errores de Telegram API
- ❌ Errores de envío de email
- ⚠️ Notificaciones duplicadas detectadas

## 🚨 Troubleshooting

### Error: "Invalid bot token"
- Verifica que el token de Telegram sea correcto
- Asegúrate de que el bot no esté bloqueado

### Error: "Chat not found"
- Verifica el CHAT_ID
- Asegúrate de haber enviado al menos un mensaje al bot

### Notificaciones no llegan
- Revisa los logs de la función
- Verifica que las variables de entorno estén configuradas
- Confirma que el webhook tenga la firma correcta

## 📚 Referencias

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [HMAC Authentication](https://en.wikipedia.org/wiki/HMAC)
