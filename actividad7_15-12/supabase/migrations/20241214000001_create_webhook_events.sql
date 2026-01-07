-- Tabla para almacenar todos los eventos de webhook recibidos
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  webhook_id TEXT NOT NULL,
  source TEXT NOT NULL,
  version TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  payload JSONB NOT NULL,
  metadata JSONB,
  signature TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_webhook_events_idempotency ON webhook_events(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_webhook_events_webhook_id ON webhook_events(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_source ON webhook_events(source);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_timestamp ON webhook_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_webhook_events_received_at ON webhook_events(received_at);

-- Tabla para tracking de webhooks procesados (opcional, para auditoría adicional)
CREATE TABLE IF NOT EXISTS processed_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES webhook_events(id) ON DELETE CASCADE,
  idempotency_key TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  processing_status TEXT NOT NULL CHECK (processing_status IN ('success', 'failed', 'pending')),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para processed_webhooks
CREATE INDEX IF NOT EXISTS idx_processed_webhooks_event_id ON processed_webhooks(event_id);
CREATE INDEX IF NOT EXISTS idx_processed_webhooks_idempotency ON processed_webhooks(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_processed_webhooks_status ON processed_webhooks(processing_status);

-- Comentarios para documentación
COMMENT ON TABLE webhook_events IS 'Almacena todos los eventos de webhook recibidos de los microservicios';
COMMENT ON TABLE processed_webhooks IS 'Tracking del procesamiento de webhooks para auditoría';
COMMENT ON COLUMN webhook_events.idempotency_key IS 'Clave única para prevenir procesamiento duplicado';
COMMENT ON COLUMN webhook_events.signature IS 'Firma HMAC-SHA256 para validar autenticidad';
