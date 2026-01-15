# MS-Clases - Microservicio de Gestión de Clases

## Descripción

Microservicio encargado de gestionar las clases del gimnasio. Consume eventos de RabbitMQ y mantiene su propia base de datos.

## Responsabilidades

- ✅ Crear nuevas clases
- ✅ Listar clases disponibles
- ✅ Actualizar cupo de clases
- ✅ Consumir eventos de RabbitMQ
- ✅ Mantener base de datos independiente

## Eventos que Consume

### `gym.class.create`

Crea una nueva clase en el sistema.

**Payload**:
```json
{
  "messageId": "uuid",
  "data": {
    "nombre": "Yoga Avanzado",
    "horario": "Lunes 18:00",
    "cupo": 20,
    "instructor": "Juan Pérez"
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```

### `gym.class.update-quota`

Reduce el cupo disponible de una clase (cuando hay inscripción).

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

## Endpoints HTTP (Opcionales)

- `GET /clases` - Listar todas las clases

## Variables de Entorno

```env
PORT=3001
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
DB_HOST=postgres-clases
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gym_clases
```

## Base de Datos

**Tabla: clases**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | SERIAL PRIMARY KEY | ID autogenerado |
| nombre | VARCHAR(255) | Nombre de la clase |
| horario | VARCHAR(100) | Día y hora |
| cupo | INTEGER | Cupos disponibles |
| instructor | VARCHAR(255) | Nombre del instructor |
| created_at | TIMESTAMP | Fecha de creación |

## Dependencias Principales

- `@nestjs/typeorm` - ORM para PostgreSQL
- `typeorm` - TypeORM
- `pg` - Driver de PostgreSQL
- `amqp-connection-manager` - RabbitMQ

## Estructura

```
src/
├── main.ts
├── app.module.ts
├── clases/
│   ├── clases.module.ts
│   ├── clases.controller.ts    # Consumer de RabbitMQ
│   ├── clases.service.ts       # Lógica de negocio
│   └── entities/
│       └── clase.entity.ts
└── shared/
    ├── rabbitmq.module.ts
    └── rabbitmq.service.ts
```

## Flujo de Procesamiento

### Crear Clase

1. Recibe evento `gym.class.create` de RabbitMQ
2. Extrae datos del payload
3. Crea entity Clase
4. Guarda en PostgreSQL
5. Registra log ✅
6. Envía ACK a RabbitMQ

### Actualizar Cupo

1. Recibe evento `gym.class.update-quota`
2. Busca clase por ID
3. Verifica que exista y tenga cupo > 0
4. Decrementa cupo en 1
5. Guarda cambio en PostgreSQL
6. Registra log ✅

## Desarrollo Local

```bash
npm install
npm run start:dev
```

Requiere PostgreSQL local o usar Docker:

```bash
docker run -d \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=gym_clases \
  postgres:15-alpine
```

## Docker

```bash
docker build -t ms-clases .
docker run -p 3001:3001 \
  -e RABBITMQ_URL=amqp://rabbitmq:5672 \
  -e DB_HOST=postgres-clases \
  ms-clases
```

## Logs Importantes

```bash
docker logs -f ms-clases
```

Busca:
- `🏋️ MS-Clases running on http://localhost:3001`
- `📥 Received message: uuid-123`
- `✅ Class created successfully: 1`
- `✅ Quota decremented for class 1. New quota: 19`

## Verificar Base de Datos

```bash
# Conectar a PostgreSQL
docker exec -it postgres-clases psql -U postgres -d gym_clases

# Listar clases
SELECT * FROM clases;

# Ver cupo de una clase
SELECT id, nombre, cupo FROM clases WHERE id = 1;
```

## Testing

### Publicar evento manualmente

1. Abrir RabbitMQ Management: http://localhost:15672
2. Ir a Queues → `gym.class.create`
3. Publicar mensaje:

```json
{
  "messageId": "test-123",
  "data": {
    "nombre": "Test",
    "horario": "Test 10:00",
    "cupo": 30,
    "instructor": "Test"
  }
}
```

4. Verificar logs y base de datos

## Notas Importantes

- ⚠️ No se comunica con otros microservicios vía HTTP
- ⚠️ Solo mediante eventos de RabbitMQ
- ✅ Base de datos completamente independiente
- ✅ Usa TypeORM con auto-sincronización (solo desarrollo)
