// EDGE FUNCTION 2 - EXTERNAL NOTIFIER
// Responsabilidades:
// - Validar firma HMAC del webhook
// - Verificar idempotencia con PostgreSQL
// - Enviar notificaciones a Telegram Bot / Email
// - Registrar resultado de notificación
// - Retornar 200 OK o 500 para retry

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Configuración
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET") || "default-secret-change-me";
const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_TOKEN"); // Cambiado de TELEGRAM_BOT_TOKEN a TELEGRAM_TOKEN
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");
const SMTP_HOST = Deno.env.get("SMTP_HOST");
const SMTP_PORT = Deno.env.get("SMTP_PORT") || "587";
const SMTP_USER = Deno.env.get("SMTP_USER");
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");
const EMAIL_FROM = Deno.env.get("EMAIL_FROM");
const EMAIL_TO = Deno.env.get("EMAIL_TO");

// Debug: Log configuration status (sin exponer los valores completos)
console.log("🔧 Configuration status:");
console.log("  WEBHOOK_SECRET:", WEBHOOK_SECRET ? `configured (${WEBHOOK_SECRET.substring(0, 10)}...)` : "NOT SET");
console.log("  TELEGRAM_TOKEN:", TELEGRAM_BOT_TOKEN ? `configured (${TELEGRAM_BOT_TOKEN.substring(0, 10)}...)` : "NOT SET");
console.log("  TELEGRAM_CHAT_ID:", TELEGRAM_CHAT_ID ? `configured (${TELEGRAM_CHAT_ID})` : "NOT SET");
console.log("  EMAIL_TO:", EMAIL_TO ? `configured (${EMAIL_TO})` : "NOT SET");

// Cliente de Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface WebhookPayload {
  event: string;
  version: string;
  id: string;
  idempotency_key: string;
  timestamp: string;
  data: any;
  metadata: {
    source: string;
    environment: string;
    correlation_id: string;
  };
}

interface NotificationResult {
  success: boolean;
  telegramMessageId?: string;
  emailMessageId?: string;
  error?: string;
}

/**
 * Verifica la firma HMAC-SHA256 del webhook
 */
async function verifySignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  const computedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computedSignature === signature;
}

/**
 * Verifica idempotencia - si ya se procesó esta notificación
 */
async function checkIdempotency(idempotencyKey: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("webhook_notifications")
    .select("id")
    .eq("idempotency_key", idempotencyKey)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error checking idempotency:", error);
    throw error;
  }

  return data !== null;
}

/**
 * Envía notificación a Telegram
 */
async function sendTelegramNotification(payload: WebhookPayload): Promise<string | null> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram not configured, skipping");
    return null;
  }

  const message = formatTelegramMessage(payload);
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Telegram API error: ${error}`);
    }

    const result = await response.json();
    console.log("✅ Telegram notification sent:", result.result.message_id);
    return result.result.message_id.toString();
  } catch (error) {
    console.error("❌ Failed to send Telegram notification:", error);
    throw error;
  }
}

/**
 * Formatea el mensaje para Telegram con HTML
 */
function formatTelegramMessage(payload: WebhookPayload): string {
  const { event, data, metadata } = payload;
  
  let message = `<b>🔔 Webhook Event Received</b>\n\n`;
  message += `<b>Event:</b> ${event}\n`;
  message += `<b>Source:</b> ${metadata.source}\n`;
  message += `<b>Environment:</b> ${metadata.environment}\n`;
  message += `<b>Timestamp:</b> ${payload.timestamp}\n\n`;
  message += `<b>Data:</b>\n`;
  message += `<code>${JSON.stringify(data, null, 2)}</code>\n\n`;
  message += `<i>Correlation ID: ${metadata.correlation_id}</i>`;

  return message;
}

/**
 * Envía notificación por Email (usando API simple)
 * Nota: Para producción, usar un servicio como SendGrid, Mailgun, etc.
 */
async function sendEmailNotification(payload: WebhookPayload): Promise<string | null> {
  if (!EMAIL_TO) {
    console.warn("Email not configured, skipping");
    return null;
  }

  // Esta es una implementación simplificada
  // En producción, integra con SendGrid, Mailgun, AWS SES, etc.
  console.log("📧 Email notification would be sent to:", EMAIL_TO);
  console.log("Subject:", `Webhook Event: ${payload.event}`);
  console.log("Body:", formatEmailBody(payload));

  // Simular envío exitoso
  // En producción, reemplazar con llamada real a API de email
  const mockMessageId = `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return mockMessageId;
}

/**
 * Formatea el cuerpo del email
 */
function formatEmailBody(payload: WebhookPayload): string {
  const { event, data, metadata, timestamp } = payload;
  
  return `
Webhook Event Received

Event: ${event}
Source: ${metadata.source}
Environment: ${metadata.environment}
Timestamp: ${timestamp}

Data:
${JSON.stringify(data, null, 2)}

Correlation ID: ${metadata.correlation_id}
Webhook ID: ${payload.id}
  `.trim();
}

/**
 * Envía notificaciones (Telegram y/o Email)
 */
async function sendNotifications(payload: WebhookPayload): Promise<NotificationResult> {
  const results: NotificationResult = { success: true };

  try {
    // Enviar a Telegram
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        results.telegramMessageId = await sendTelegramNotification(payload);
      } catch (error) {
        console.error("Telegram notification failed:", error);
        results.error = `Telegram: ${error.message}`;
        results.success = false;
      }
    }

    // Enviar Email
    if (EMAIL_TO) {
      try {
        results.emailMessageId = await sendEmailNotification(payload);
      } catch (error) {
        console.error("Email notification failed:", error);
        results.error = results.error 
          ? `${results.error}; Email: ${error.message}`
          : `Email: ${error.message}`;
        results.success = false;
      }
    }

    // Si no hay configuración de notificaciones
    if (!TELEGRAM_BOT_TOKEN && !EMAIL_TO) {
      results.error = "No notification channels configured";
      results.success = false;
    }

    return results;
  } catch (error) {
    console.error("Error sending notifications:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Registra el resultado de la notificación en la base de datos
 */
async function recordNotificationResult(
  payload: WebhookPayload,
  result: NotificationResult
): Promise<void> {
  // Determinar tipo de notificación
  let notificationType = "both";
  if (result.telegramMessageId && !result.emailMessageId) {
    notificationType = "telegram";
  } else if (!result.telegramMessageId && result.emailMessageId) {
    notificationType = "email";
  }

  // Determinar destinatario
  const recipient = [
    TELEGRAM_CHAT_ID ? `telegram:${TELEGRAM_CHAT_ID}` : null,
    EMAIL_TO ? `email:${EMAIL_TO}` : null,
  ].filter(Boolean).join(", ");

  const { error } = await supabase
    .from("webhook_notifications")
    .insert({
      idempotency_key: payload.idempotency_key,
      notification_type: notificationType,
      recipient: recipient || "none",
      status: result.success ? "success" : "failed",
      sent_at: result.success ? new Date().toISOString() : null,
      error_message: result.error || null,
      telegram_message_id: result.telegramMessageId || null,
      email_message_id: result.emailMessageId || null,
    });

  if (error) {
    console.error("Error recording notification result:", error);
    throw error;
  }

  console.log("✅ Notification result recorded");
}

Deno.serve(async (req) => {
  // Solo aceptar POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Obtener headers
    const signature = req.headers.get("x-webhook-signature");
    const webhookId = req.headers.get("x-webhook-id");

    if (!signature || !webhookId) {
      return new Response(
        JSON.stringify({
          error: "Missing required headers",
          required: ["x-webhook-signature", "x-webhook-id"],
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Leer el body
    const body = await req.text();
    const payload: WebhookPayload = JSON.parse(body);

    console.log("📨 Notification webhook received:", {
      id: payload.id,
      event: payload.event,
      source: payload.metadata.source,
    });

    // 1. Validar firma HMAC
    const isValidSignature = await verifySignature(body, signature, WEBHOOK_SECRET);
    if (!isValidSignature) {
      console.error("❌ Invalid signature");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log("✅ Signature valid");

    // 2. Verificar idempotencia
    const isDuplicate = await checkIdempotency(payload.idempotency_key);
    if (isDuplicate) {
      console.warn("⚠️ Duplicate notification detected:", payload.idempotency_key);
      return new Response(
        JSON.stringify({
          message: "Notification already processed",
          idempotency_key: payload.idempotency_key,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log("✅ Not a duplicate");

    // 3. Enviar notificaciones (Telegram y/o Email)
    const notificationResult = await sendNotifications(payload);

    // 4. Registrar resultado
    await recordNotificationResult(payload, notificationResult);

    // 5. Retornar respuesta apropiada
    if (notificationResult.success) {
      console.log("✅ Notifications sent successfully");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Notifications sent successfully",
          telegram_message_id: notificationResult.telegramMessageId,
          email_message_id: notificationResult.emailMessageId,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      // Retornar 500 para que el webhook reintente
      console.error("❌ Notifications failed:", notificationResult.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to send notifications",
          details: notificationResult.error,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("❌ Error processing notification webhook:", error);
    
    // Retornar 500 para retry
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start`
  2. Set environment variables:
     export WEBHOOK_SECRET="your-secret"
     export TELEGRAM_BOT_TOKEN="your-bot-token"
     export TELEGRAM_CHAT_ID="your-chat-id"
     export EMAIL_TO="recipient@example.com"
  
  3. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/webhook-external-notifier' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --header 'X-Webhook-Signature: your-hmac-signature' \
    --header 'X-Webhook-Id: uuid' \
    --data '{
      "event": "clase.created",
      "version": "1.0",
      "id": "uuid",
      "idempotency_key": "uuid",
      "timestamp": "2025-12-14T10:00:00Z",
      "data": {...},
      "metadata": {
        "source": "ms-clases",
        "environment": "development",
        "correlation_id": "uuid"
      }
    }'

*/
