# 🔄 Workflows de n8n para Arquitectura Híbrida

Esta carpeta contiene los 3 workflows obligatorios de n8n listos para importar.

## 📁 Contenido

```
n8n-workflows/
├── 1-workflow-notificaciones.json       # Workflow 1: Notificaciones con IA
├── 2-workflow-sincronizacion.json       # Workflow 2: Sync con Google Sheets
├── 3-workflow-alertas.json              # Workflow 3: Sistema de alertas
├── GUIA-RAPIDA.md                       # 🚀 EMPIEZA AQUÍ (10 min)
├── README-IMPORTAR-WORKFLOWS.md         # Guía detallada de importación
├── DIAGRAMAS-WORKFLOWS.md               # Diagramas visuales
└── README.md                            # Este archivo
```

## 🚀 Inicio Rápido (10 minutos)

### 1. Lee la Guía Rápida
```bash
GUIA-RAPIDA.md
```

### 2. Importa los workflows
1. Abre http://localhost:5678
2. Importa los 3 archivos `.json`
3. Configura credenciales (Telegram, OpenAI, Google Sheets)
4. Activa los workflows

### 3. Registra webhooks
```bash
# Windows
.\scripts\register-n8n-webhooks.bat

# PowerShell
.\scripts\register-n8n-webhooks.ps1
```

### 4. Prueba
```bash
.\scripts\test-n8n-webhooks.bat
```

## 📋 Workflows Incluidos

### 🔔 Workflow 1: Notificaciones en Tiempo Real
**Archivo**: `1-workflow-notificaciones.json`

**Flujo**:
```
Webhook → Validar → Transform → OpenAI → Telegram → Respuesta
```

**Características**:
- ✅ Genera mensajes con IA (OpenAI GPT-4)
- ✅ Notificaciones a Telegram
- ✅ Validación de datos
- ✅ Respuesta al backend

**Eventos que procesa**:
- `clase.created`
- `inscripcion.created`
- `clase.enrollment_processed`

**Credenciales requeridas**:
- OpenAI API
- Telegram Bot

---

### 📊 Workflow 2: Sincronización Google Sheets
**Archivo**: `2-workflow-sincronizacion.json`

**Flujo**:
```
Webhook → Filtrar → Transform → Google Sheets Append → Respuesta
```

**Características**:
- ✅ Registra todas las operaciones en Google Sheets
- ✅ Filtra eventos relevantes
- ✅ Formatea datos automáticamente
- ✅ Columnas estructuradas

**Eventos que procesa**:
- `clase.created`
- `inscripcion.created`
- `clase.quota_updated`

**Credenciales requeridas**:
- Google Sheets OAuth2

**Configuración adicional**:
- Crear Google Sheet con encabezados
- Configurar `GOOGLE_SHEETS_DOCUMENT_ID` en `.env`

---

### 🚨 Workflow 3: Alertas de Condiciones Críticas
**Archivo**: `3-workflow-alertas.json`

**Flujo**:
```
Webhook → Filtrar → Extraer → OpenAI Analizar → Switch →
    ├── CRITICAL → Telegram
    ├── WARNING  → Email
    └── INFO     → Log
```

**Características**:
- ✅ Análisis inteligente con IA
- ✅ Switch por nivel de urgencia
- ✅ Múltiples canales de notificación
- ✅ Acciones sugeridas

**Eventos que procesa**:
- `clase.quota_alert`

**Niveles de urgencia**:
| Cupo | Urgencia | Canal |
|------|----------|-------|
| 0 | CRITICAL | Telegram |
| ≤ 2 | CRITICAL | Telegram |
| ≤ 5 | WARNING | Email |
| ≤ 10 | INFO | Log |

**Credenciales requeridas**:
- OpenAI API
- Telegram Bot
- SMTP Account (opcional)

## 📚 Documentación

### Para empezar
1. **[GUIA-RAPIDA.md](./GUIA-RAPIDA.md)** ⭐ - Empieza aquí
2. **[README-IMPORTAR-WORKFLOWS.md](./README-IMPORTAR-WORKFLOWS.md)** - Guía detallada
3. **[DIAGRAMAS-WORKFLOWS.md](./DIAGRAMAS-WORKFLOWS.md)** - Visualización

### Documentación adicional
- **[../docs/N8N-SETUP.md](../docs/N8N-SETUP.md)** - Configuración completa de n8n
- **[../docs/IMPLEMENTACION-COMPLETADA.md](../docs/IMPLEMENTACION-COMPLETADA.md)** - Resumen técnico

## 🔧 Requisitos Previos

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
# Telegram
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_CHAT_ID=123456789

# OpenAI
OPENAI_API_KEY=sk-...

# Google Sheets
GOOGLE_SHEETS_DOCUMENT_ID=1abc...xyz

# Email (opcional)
EMAIL_FROM=gimnasio@example.com
EMAIL_ADMIN=admin@example.com
```

### Servicios Necesarios
- ✅ Docker y Docker Compose
- ✅ n8n corriendo (puerto 5678)
- ✅ Backend corriendo (puertos 3000-3002)
- ✅ Bot de Telegram creado
- ✅ API Key de OpenAI
- ✅ Google Sheet creado

## 🧪 Pruebas

### Prueba Individual

#### Workflow 1: Notificaciones
```bash
curl -X POST http://localhost:3000/clases \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Zumba","instructor":"Laura H","horario":"Miércoles 19:00","cupo":25}'
```

**Espera**: Mensaje en Telegram generado por IA

#### Workflow 2: Sincronización
Usa el mismo comando anterior.

**Espera**: Nueva fila en Google Sheets

#### Workflow 3: Alertas
```bash
curl -X PATCH http://localhost:3001/clases/25 \
  -H "Content-Type: application/json" \
  -d '{"cupo": 2}'
```

**Espera**: Alerta CRÍTICA en Telegram con análisis de IA

### Prueba Completa
```bash
# Windows
.\scripts\test-n8n-webhooks.bat

# Linux/Mac
./scripts/test-n8n-webhooks.sh
```

## 📊 Monitoreo

### Ver Ejecuciones en n8n
1. Abre http://localhost:5678
2. Click en **Executions** (menú lateral)
3. Ve el historial completo de ejecuciones
4. Click en cualquier ejecución para ver detalles

### Ver Logs
```bash
# Logs de n8n
docker logs n8n -f

# Logs del backend
docker logs ms-clases -f

# Ver webhooks registrados
curl http://localhost:3001/webhooks/subscriptions
```

## 🎯 Casos de Uso

### Caso 1: Nueva Clase
```
Usuario crea clase → Backend → Webhook n8n
                                    ↓
                        ┌───────────┴──────────┐
                        ▼                      ▼
                Workflow 1:           Workflow 2:
                Notifica Telegram     Registra Sheet
```

### Caso 2: Cupo Bajo
```
Cupo llega a 5 → Backend → Webhook n8n
                                ↓
                        Workflow 3:
                        IA analiza → WARNING → Email
```

### Caso 3: Cupo Crítico
```
Cupo llega a 2 → Backend → Webhook n8n
                                ↓
                        Workflow 3:
                        IA analiza → CRITICAL → Telegram URGENTE
```

## 🔐 Seguridad

Todos los webhooks usan:
- ✅ Firma HMAC-SHA256
- ✅ Secret compartido
- ✅ Validación de payload
- ✅ HTTPS en producción (recomendado)

## 🛠️ Personalización

### Modificar Prompts de IA

Edita el nodo "Generar Mensaje con IA" en n8n:

```
Eres un asistente del gimnasio que genera notificaciones...
[Personaliza aquí]
```

### Agregar Más Eventos

1. En el backend:
```typescript
await this.webhookPublisher.publishEvent({
  type: 'clase.cancelada',
  data: { ... }
});
```

2. En n8n: Edita filtros de workflows o crea uno nuevo

### Agregar Más Canales

En n8n, agrega nodos:
- Discord
- Slack
- SMS (Twilio)
- WhatsApp Business
- Push Notifications

## ❓ Troubleshooting

### Workflow no recibe eventos
```bash
# Verifica que esté activo
# En n8n: Toggle debe estar verde

# Verifica webhook registrado
curl http://localhost:3001/webhooks/subscriptions

# Ve logs
docker logs n8n -f
```

### OpenAI falla
- Verifica saldo en cuenta
- Comprueba límites de API
- Verifica API key válida

### Telegram no envía
- Inicia el bot: `/start`
- Verifica token correcto
- Verifica chat_id correcto

### Google Sheets no actualiza
- Verifica permisos OAuth
- Verifica ID de documento
- Verifica nombre de hoja

## 📈 Métricas

Monitorea en n8n:
- Total de ejecuciones
- Tasa de éxito/fallo
- Tiempo promedio de ejecución
- Eventos por tipo

## 🎓 Para Estudiantes

### Entregables
- [ ] 3 workflows importados y activos
- [ ] Credenciales configuradas
- [ ] Pruebas exitosas documentadas
- [ ] Capturas de pantalla de:
  - [ ] Workflows en n8n
  - [ ] Ejecuciones exitosas
  - [ ] Notificaciones en Telegram
  - [ ] Registros en Google Sheets

### Criterios de Evaluación
- ✅ Workflows funcionan correctamente
- ✅ Eventos se procesan en tiempo real
- ✅ IA genera mensajes contextuales
- ✅ Sistema de alertas por niveles funciona
- ✅ Sincronización automática opera

## 🔗 Enlaces Útiles

- [Documentación n8n](https://docs.n8n.io/)
- [n8n Workflow Templates](https://n8n.io/workflows/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [OpenAI API](https://platform.openai.com/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)

## 📞 Soporte

Si encuentras problemas:
1. Revisa la documentación en `/docs`
2. Verifica logs de Docker
3. Consulta la guía de troubleshooting
4. Revisa ejecuciones en n8n

---

**Versión**: 1.0.0  
**Última actualización**: 11 de enero de 2026  
**Estado**: ✅ Listo para usar
