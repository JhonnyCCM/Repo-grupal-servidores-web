# Configuración de Supabase para desactivar JWT en Edge Functions

## config.toml en la raíz del proyecto

Crea o actualiza el archivo `supabase/config.toml` con:

```toml
[functions.webhook-event-logger]
verify_jwt = false

[functions.webhook-external-notifier]
verify_jwt = false
```

Luego redespliega:

```bash
supabase functions deploy webhook-event-logger
supabase functions deploy webhook-external-notifier
```

Esto hará que las Edge Functions NO requieran JWT y solo validen por firma HMAC.
