-- Tabla para registrar notificaciones enviadas
CREATE TABLE IF NOT EXISTS webhook_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES webhook_events(id) ON DELETE CASCADE,
  idempotency_key TEXT NOT NULL UNIQUE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('telegram', 'email', 'both')),
  recipient TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  telegram_message_id TEXT,
  email_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_webhook_notifications_event_id ON webhook_notifications(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_notifications_idempotency ON webhook_notifications(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_webhook_notifications_status ON webhook_notifications(status);
CREATE INDEX IF NOT EXISTS idx_webhook_notifications_type ON webhook_notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_webhook_notifications_recipient ON webhook_notifications(recipient);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_webhook_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_webhook_notifications_updated_at
  BEFORE UPDATE ON webhook_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_webhook_notifications_updated_at();

-- Comentarios para documentación
COMMENT ON TABLE webhook_notifications IS 'Registra todas las notificaciones enviadas (Telegram, Email, etc)';
COMMENT ON COLUMN webhook_notifications.idempotency_key IS 'Clave única para prevenir notificaciones duplicadas';
COMMENT ON COLUMN webhook_notifications.telegram_message_id IS 'ID del mensaje enviado a Telegram';
COMMENT ON COLUMN webhook_notifications.email_message_id IS 'ID del email enviado';
