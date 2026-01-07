// EDGE FUNCTION 1 - EVENT LOGGER
// Responsabilidades:
// - Validar firma HMAC del webhook
// - Verificar timestamp (anti-replay attack, máximo 5 minutos)
// - Verificar idempotencia (deduplicar eventos duplicados)
// - Guardar evento completo en tabla webhook_events
// - Retornar 200 OK con event_id generado

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Configuración
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET") || "default-secret-change-me";
const MAX_TIMESTAMP_DIFF_MS = 5 * 60 * 1000; // 5 minutos

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
 * Verifica que el timestamp no sea muy antiguo (anti-replay attack)
 */
function verifyTimestamp(timestamp: string): boolean {
  const webhookTime = new Date(timestamp).getTime();
  const currentTime = Date.now();
  const diff = Math.abs(currentTime - webhookTime);

  return diff <= MAX_TIMESTAMP_DIFF_MS;
}

/**
 * Verifica si el evento ya fue procesado (idempotencia)
 */
async function checkIdempotency(idempotencyKey: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("webhook_events")
    .select("id")
    .eq("idempotency_key", idempotencyKey)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows found
    console.error("Error checking idempotency:", error);
    throw error;
  }

  return data !== null;
}

/**
 * Guarda el evento en la base de datos
 */
async function saveWebhookEvent(
  payload: WebhookPayload,
  signature: string
): Promise<string> {
  const { data, error } = await supabase
    .from("webhook_events")
    .insert({
      event_type: payload.event,
      idempotency_key: payload.idempotency_key,
      webhook_id: payload.id,
      source: payload.metadata.source,
      version: payload.version,
      timestamp: payload.timestamp,
      payload: payload,
      metadata: payload.metadata,
      signature: signature,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error saving webhook event:", error);
    throw error;
  }

  return data.id;
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
    const webhookTimestamp = req.headers.get("x-webhook-timestamp");

    if (!signature || !webhookId || !webhookTimestamp) {
      return new Response(
        JSON.stringify({
          error: "Missing required headers",
          required: ["x-webhook-signature", "x-webhook-id", "x-webhook-timestamp"],
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Leer el body
    const body = await req.text();
    const payload: WebhookPayload = JSON.parse(body);

    console.log("📨 Webhook received:", {
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

    // 2. Verificar timestamp (anti-replay attack)
    const isValidTimestamp = verifyTimestamp(payload.timestamp);
    if (!isValidTimestamp) {
      console.error("❌ Timestamp too old (replay attack detected)");
      return new Response(
        JSON.stringify({
          error: "Timestamp too old",
          maxAge: "5 minutes",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log("✅ Timestamp valid");

    // 3. Verificar idempotencia
    const isDuplicate = await checkIdempotency(payload.idempotency_key);
    if (isDuplicate) {
      console.warn("⚠️ Duplicate event detected:", payload.idempotency_key);
      return new Response(
        JSON.stringify({
          message: "Event already processed",
          idempotency_key: payload.idempotency_key,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log("✅ Not a duplicate");

    // 4. Guardar evento en la base de datos
    const eventId = await saveWebhookEvent(payload, signature);
    console.log("✅ Event saved:", eventId);

    // 5. Retornar 200 OK con event_id
    return new Response(
      JSON.stringify({
        success: true,
        event_id: eventId,
        message: "Webhook event logged successfully",
        received_at: new Date().toISOString(),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
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
  2. Set environment variable: export WEBHOOK_SECRET="your-secret"
  3. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/webhook-event-logger' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --header 'X-Webhook-Signature: your-hmac-signature' \
    --header 'X-Webhook-Id: uuid' \
    --header 'X-Webhook-Timestamp: 2025-12-14T10:00:00Z' \
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
