# MS-Inscripciones - Microservicio de Gestión de Inscripciones

## Descripción

Microservicio encargado de gestionar inscripciones a clases. Implementa el patrón **Idempotent Consumer** para garantizar que mensajes duplicados no generen inscripciones duplicadas.

## Responsabilidades

- ✅ Crear inscripciones
- ✅ Validar disponibilidad de cupo
- ✅ Implementar idempotencia con Redis
- ✅ Publicar eventos de actualización de cupo
- ✅ Consumir eventos de RabbitMQ
- ✅ Mantener base de datos independiente

## ⭐ Patrón Idempotent Consumer

### ¿Qué Problema Resuelve?

En sistemas distribuidos, los mensajes pueden duplicarse por:
- Reintentos automáticos
- Problemas de red
- Fallos parciales del consumidor

**Sin idempotencia**: El mismo mensaje se procesa múltiples veces → datos duplicados

**Con idempotencia**: Solo se procesa una vez, mensajes duplicados se ignoran

### Implementación

#### 1. Verificar antes de procesar

```typescript
const alreadyProcessed = await this.idempotencyService.isProcessed(messageId);

if (alreadyProcessed) {
  return { success: true, duplicate: true }; // Skip
}
```

#### 2. Procesar mensaje

```typescript
const inscripcion = await this.create(messageId, data);
```

#### 3. Marcar como procesado

```typescript
await this.idempotencyService.markAsProcessed(messageId);
```

### Storage: Redis

- **Clave**: `idempotent:<messageId>`
- **Valor**: `{ processedAt, messageId }`
- **TTL**: 24 horas (86400 segundos)

## Eventos que Consume

### `gym.class.enroll`

Registra una nueva inscripción.

**Payload**:
```json
{
  "messageId": "uuid-unico",
  "data": {
    "claseId": 1,
    "alumno": "María García",
    "email": "maria@example.com"
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```

**Procesamiento**:
1. Verifica si `messageId` existe en Redis
2. Si existe → Skip (idempotente)
3. Si no existe:
   - Guarda inscripción en PostgreSQL
   - Marca messageId en Redis (TTL 24h)
   - Publica evento `gym.class.update-quota`

## Eventos que Publica

### `gym.class.update-quota`

Notifica a MS-Clases que debe reducir el cupo.

**Payload**:
```json
{
  "messageId": "uuid",
  "data": {
    "claseId": 1
  },
  "timestamp": "2024-01-15T10:05:00Z"
}
```

## Variables de Entorno

```env
PORT=3002
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
DB_HOST=postgres-inscripciones
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gym_inscripciones
REDIS_HOST=redis
REDIS_PORT=6379
```

## Base de Datos

**Tabla: inscripciones**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL PRIMARY KEY | ID autogenerado |
| clase_id | INTEGER | ID de la clase (NO FK) |
| alumno | VARCHAR(255) | Nombre del alumno |
| email | VARCHAR(255) | Email del alumno |
| **message_id** | VARCHAR(255) UNIQUE | **Clave para idempotencia** |
| created_at | TIMESTAMP | Fecha de creación |

**Nota**: `message_id` tiene constraint UNIQUE → doble protección contra duplicados

## Dependencias Principales

- `@nestjs/typeorm` - ORM para PostgreSQL
- `typeorm` - TypeORM
- `pg` - Driver de PostgreSQL
- `ioredis` - Cliente de Redis
- `amqp-connection-manager` - RabbitMQ

## Estructura

```
src/
├── main.ts
├── app.module.ts
├── inscripciones/
│   ├── inscripciones.module.ts
│   ├── inscripciones.controller.ts  # Consumer con idempotencia
│   ├── inscripciones.service.ts     # Lógica + idempotencia
│   └── entities/
│       └── inscripcion.entity.ts
└── shared/
    ├── redis.module.ts              # Configuración Redis
    ├── idempotency.service.ts       # ⭐ Servicio clave
    ├── rabbitmq.module.ts
    └── rabbitmq.service.ts
```

## Flujo de Procesamiento con Idempotencia

```
1. Recibe evento gym.class.enroll
2. Extrae messageId del payload
3. Consulta Redis: GET idempotent:<messageId>
   ├─ Si existe → Log warning + Skip
   └─ Si NO existe → Continúa al paso 4
4. Guarda inscripción en PostgreSQL
5. Guarda en Redis: SET idempotent:<messageId> {...} EX 86400
6. Publica evento gym.class.update-quota
7. Log success + Envía ACK a RabbitMQ
```

## Desarrollo Local

```bash
npm install
npm run start:dev
```

Requiere PostgreSQL y Redis locales o usar Docker:

```bash
# PostgreSQL
docker run -d \
  -p 5433:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=gym_inscripciones \
  postgres:15-alpine

# Redis
docker run -d \
  -p 6379:6379 \
  redis:7-alpine
```

## Docker

```bash
docker build -t ms-inscripciones .
docker run -p 3002:3002 \
  -e RABBITMQ_URL=amqp://rabbitmq:5672 \
  -e DB_HOST=postgres-inscripciones \
  -e REDIS_HOST=redis \
  ms-inscripciones
```

## Logs Importantes

```bash
docker logs -f ms-inscripciones
```

**Mensaje nuevo** (procesado):
```
📥 Received enrollment message: uuid-123
✅ New enrollment processed successfully | MessageID: uuid-123 | InscripcionID: 1
✅ Message uuid-123 marked as processed (TTL: 86400s)
```

**Mensaje duplicado** (ignorado):
```
📥 Received enrollment message: uuid-123
⚠️ Message uuid-123 already processed (idempotent skip)
⚠️ Duplicate message detected: uuid-123 | Processed at: 2024-01-15T10:00:05Z | Action: SKIPPED
```

## Verificaciones

### 1. Ver inscripciones en BD

```bash
docker exec -it postgres-inscripciones psql -U postgres -d gym_inscripciones

SELECT * FROM inscripciones;
SELECT COUNT(*) FROM inscripciones WHERE message_id = 'uuid-123';
```

### 2. Ver claves en Redis

```bash
docker exec -it redis redis-cli

# Listar todas las claves idempotentes
KEYS idempotent:*

# Ver contenido de una clave
GET idempotent:uuid-123

# Ver TTL (tiempo restante)
TTL idempotent:uuid-123
```

### 3. Probar Idempotencia

**Opción A: Script automatizado**
```bash
test-idempotency.bat
```

**Opción B: Manual con RabbitMQ UI**

1. Abrir http://localhost:15672 (guest/guest)
2. Ir a Queues → `gym.class.enroll`
3. Publicar mensaje:

```json
{
  "messageId": "TEST-DUPLICATE-001",
  "data": {
    "claseId": 1,
    "alumno": "Test Duplicate",
    "email": "test@duplicate.com"
  }
}
```

4. Click "Publish message"
5. **Esperar 2 segundos**
6. Click "Publish message" nuevamente (mismo mensaje)
7. Ver logs: Solo el primero se procesa
8. Verificar BD: Solo 1 fila con message_id = "TEST-DUPLICATE-001"

## Testing

### Crear inscripción normal

```bash
curl -X POST http://localhost:3000/inscripciones \
  -H "Content-Type: application/json" \
  -d '{"claseId":1,"alumno":"Test","email":"test@example.com"}'
```

### Verificar en Redis

```bash
# Conectar
docker exec -it redis redis-cli

# Buscar claves
KEYS idempotent:*

# Ver una clave específica
GET idempotent:<messageId-del-log>

# Ver TTL
TTL idempotent:<messageId>
```

## Notas Importantes

- ⚠️ TTL de 24 horas es configurable (archivo `idempotency.service.ts`)
- ⚠️ Si Redis cae, constraint UNIQUE en BD evita duplicados (fallback)
- ✅ Doble protección: Redis (rápido) + BD (seguro)
- ✅ messageId generado por API Gateway (UUID v4)
- ✅ Logs detallados para debugging

## Configuración de IdempotencyService

```typescript
// src/shared/idempotency.service.ts
private readonly TTL = 86400; // 24 horas en segundos
private readonly PREFIX = 'idempotent:';
```

**Modificar TTL**: Cambiar `86400` por el valor deseado en segundos.

## Resiliencia

### Escenario: Redis caído

1. MS-Inscripciones intenta verificar idempotencia en Redis
2. Redis no responde → Error
3. **Fallback**: Constraint UNIQUE en `message_id` evita duplicados
4. Se guarda inscripción si es nueva
5. Si es duplicado → PostgreSQL lanza error de constraint

### Escenario: PostgreSQL caído

1. MS-Inscripciones recibe mensaje
2. Verifica idempotencia en Redis (funciona)
3. Intenta guardar en PostgreSQL → Falla
4. **NO** marca como procesado en Redis
5. RabbitMQ reintenta el mensaje automáticamente
6. Cuando PostgreSQL se recupera, se procesa exitosamente

## Mejoras Futuras

- [ ] Validar cupo antes de inscribir (query a MS-Clases)
- [ ] Implementar Dead Letter Queue para mensajes fallidos
- [ ] Agregar métricas (Prometheus)
- [ ] Circuit breaker para Redis
- [ ] Retry policy configurable
