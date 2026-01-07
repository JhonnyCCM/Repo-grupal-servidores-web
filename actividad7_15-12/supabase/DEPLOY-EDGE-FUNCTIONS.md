# Guía para Desplegar Edge Functions en Supabase

## Paso 1: Instalar Supabase CLI

```bash
npm install -g supabase
```

## Paso 2: Login en Supabase

```bash
supabase login
```

## Paso 3: Link al proyecto

```bash
supabase link --project-ref dpgrybtiuddihmgtmgqv
```

## Paso 4: Configurar el Secret para las Edge Functions

El secret DEBE ser el mismo que usas en tu microservicio:

```bash
supabase secrets set WEBHOOK_SECRET=7723622143b35e3fe91e5789b99b7e4b4010b9035aa20a0dd0fb0a1dd85c23c7
```

## Paso 5: Desplegar las Edge Functions

```bash
# Desplegar webhook-event-logger
supabase functions deploy webhook-event-logger

# Desplegar webhook-external-notifier
supabase functions deploy webhook-external-notifier
```

## Paso 6: Verificar que funcionan

```bash
# Test con curl
curl -i --location --request POST 'https://dpgrybtiuddihmgtmgqv.supabase.co/functions/v1/webhook-event-logger' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwZ3J5YnRpdWRkaWhtZ3RtZ3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE3NjEzMDIsImV4cCI6MjA0NzMzNzMwMn0.KiLIr8l_N-N2RR-EsjBLe2CUpTdOV8fgqP8rSYL_iQc' \
  --header 'Content-Type: application/json' \
  --header 'X-Webhook-Signature: test' \
  --header 'X-Webhook-Id: test' \
  --header 'X-Webhook-Timestamp: 2025-12-14T10:00:00Z' \
  --data '{
    "event": "clase.created",
    "version": "1.0",
    "id": "test",
    "idempotency_key": "test",
    "timestamp": "2025-12-14T10:00:00Z",
    "data": {},
    "metadata": {
      "source": "ms-clases",
      "environment": "development",
      "correlation_id": "test"
    }
  }'
```

## Paso 7: Ver logs

```bash
supabase functions logs webhook-event-logger
supabase functions logs webhook-external-notifier
```

## IMPORTANTE: Configurar variables de entorno en el Dashboard

También necesitas ir al dashboard de Supabase:
1. Ve a **Project Settings > Edge Functions**
2. Agrega estas variables de entorno:
   - `WEBHOOK_SECRET`: 7723622143b35e3fe91e5789b99b7e4b4010b9035aa20a0dd0fb0a1dd85c23c7
   - `TELEGRAM_BOT_TOKEN`: (tu token del bot de Telegram)
   - `TELEGRAM_CHAT_ID`: (el chat ID donde enviar notificaciones)

## Verificar despliegue

Después de desplegar, verifica en el dashboard que las funciones aparecen en:
**Edge Functions > Deployed Functions**

Y que el secret está configurado en:
**Project Settings > Edge Functions > Secrets**
