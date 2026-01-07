# 🏋️ Sistema de Gestión de Gimnasio - Arquitectura Distribuida

## 📋 Descripción del Proyecto

Sistema de gestión de gimnasio con arquitectura híbrida (REST + Mensajería) para taller académico.
Implementa comunicación asíncrona con RabbitMQ y estrategia de resiliencia mediante **Idempotent Consumer**.

## 🏗️ Arquitectura

```
┌─────────────────┐
│   API Gateway   │  ← Expone REST API
│   (NestJS)      │
└────────┬────────┘
         │ (Publica eventos)
         ▼
┌─────────────────┐
│    RabbitMQ     │  ← Comunicación asíncrona
└────────┬────────┘
         │
    ┌────┴─────┐
    ▼          ▼
┌──────────┐ ┌──────────────┐
│ MS-Clases│ │MS-Inscripciones│
│ (NestJS) │ │   (NestJS)     │
│  + DB    │ │   + DB + Redis │
└──────────┘ └────────────────┘
```

### Componentes

- **API Gateway**: Punto de entrada REST, valida y publica eventos
- **Microservicio Clases**: Gestiona clases del gimnasio
- **Microservicio Inscripciones**: Gestiona inscripciones con idempotencia
- **RabbitMQ**: Bus de mensajería asíncrona
- **Redis**: Storage para claves idempotentes
- **PostgreSQL**: 2 instancias (BD independientes)

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker Desktop
- Node.js 18+ (solo para desarrollo local)

### Levantar todo el sistema

```bash
docker-compose up --build
```

### Servicios disponibles

| Servicio | URL | Descripción |
|----------|-----|-------------|
| API Gateway | http://localhost:3000 | REST API |
| RabbitMQ Management | http://localhost:15672 | UI de RabbitMQ (guest/guest) |
| MS Clases | http://localhost:3001 | Solo interno |
| MS Inscripciones | http://localhost:3002 | Solo interno |

## 📡 API Endpoints

### Clases

```bash
# Crear clase
POST http://localhost:3000/clases
Content-Type: application/json

{
  "nombre": "Yoga Avanzado",
  "horario": "Lunes 18:00",
  "cupo": 20,
  "instructor": "Juan Pérez"
}

# Listar clases
GET http://localhost:3000/clases
```

### Inscripciones

```bash
# Crear inscripción
POST http://localhost:3000/inscripciones
Content-Type: application/json

{
  "claseId": 1,
  "alumno": "María García",
  "email": "maria@example.com"
}

# Listar inscripciones
GET http://localhost:3000/inscripciones
```

## 🛡️ Estrategia de Resiliencia: Idempotent Consumer

### ¿Qué es?

Garantiza que un mensaje duplicado no genere dos inscripciones. Usa Redis para trackear mensajes ya procesados.

### Implementación

1. Cada mensaje tiene un `messageId` único
2. Antes de procesar, se verifica en Redis si ya fue procesado
3. Si existe → se ignora (idempotente)
4. Si no existe → se procesa y se guarda en Redis (TTL: 24h)

### Demostración de Resiliencia

#### 1. Escenario Normal

```bash
# Primera inscripción (se procesa)
curl -X POST http://localhost:3000/inscripciones \
  -H "Content-Type: application/json" \
  -d '{
    "claseId": 1,
    "alumno": "Test User",
    "email": "test@example.com"
  }'

# Respuesta: {"received": true, "messageId": "uuid-123"}
```

#### 2. Escenario con Duplicación

Para simular mensajes duplicados, accede directamente a RabbitMQ:

```bash
# Entrar al contenedor de RabbitMQ
docker exec -it rabbitmq bash

# Publicar mensaje duplicado manualmente
rabbitmqadmin publish routing_key=gym.class.enroll payload='{"messageId":"uuid-duplicado","data":{"claseId":1,"alumno":"Test","email":"test@example.com"}}'
```

O ejecuta el script de prueba:

```bash
npm run test:idempotency
```

#### 3. Verificación en logs

```bash
# Ver logs del MS Inscripciones
docker logs -f ms-inscripciones

# Buscar líneas como:
# ✓ Message uuid-123 processed successfully
# ⚠ Message uuid-123 already processed (idempotent skip)
```

#### 4. Verificación en RabbitMQ Management

1. Accede a http://localhost:15672 (guest/guest)
2. Ve a **Queues** → `gym.class.enroll`
3. Publica mensajes manualmente con el mismo `messageId`
4. Observa que solo el primero se procesa

#### 5. Verificación en Redis

```bash
# Conectar a Redis
docker exec -it redis redis-cli

# Ver claves idempotentes
KEYS idempotent:*

# Ver valor de una clave
GET idempotent:uuid-123

# Ver TTL (tiempo de expiración)
TTL idempotent:uuid-123
```

## 🔍 Colas RabbitMQ

| Cola | Productor | Consumidor | Propósito |
|------|-----------|------------|-----------|
| `gym.class.create` | API Gateway | MS Clases | Crear nueva clase |
| `gym.class.enroll` | API Gateway | MS Inscripciones | Crear inscripción |
| `gym.class.update-quota` | MS Inscripciones | MS Clases | Reducir cupo |

## 📊 Base de Datos

### MS Clases (PostgreSQL - Puerto 5432)

```sql
CREATE TABLE clases (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  horario VARCHAR(100) NOT NULL,
  cupo INTEGER NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### MS Inscripciones (PostgreSQL - Puerto 5433)

```sql
CREATE TABLE inscripciones (
  id SERIAL PRIMARY KEY,
  clase_id INTEGER NOT NULL,
  alumno VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message_id VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Pruebas de Carga

```bash
# Instalar herramienta (opcional)
npm install -g autocannon

# Probar creación de clases
autocannon -c 10 -d 30 -m POST \
  -H "Content-Type: application/json" \
  -b '{"nombre":"Test","horario":"10:00","cupo":50,"instructor":"Test"}' \
  http://localhost:3000/clases

# Probar inscripciones (prueba idempotencia)
autocannon -c 5 -d 10 -m POST \
  -H "Content-Type: application/json" \
  -b '{"claseId":1,"alumno":"Load Test","email":"load@test.com"}' \
  http://localhost:3000/inscripciones
```

## 🛠️ Desarrollo Local

### Instalar dependencias en todos los servicios

```bash
cd api-gateway && npm install
cd ../ms-clases && npm install
cd ../ms-inscripciones && npm install
```

### Ejecutar en modo desarrollo (requiere RabbitMQ/PostgreSQL/Redis locales)

```bash
# Terminal 1
cd api-gateway && npm run start:dev

# Terminal 2
cd ms-clases && npm run start:dev

# Terminal 3
cd ms-inscripciones && npm run start:dev
```

## 📚 Conceptos Clave del Taller

### 1. Arquitectura Híbrida

- **Entrada**: REST (síncrono, simple para clientes)
- **Comunicación interna**: RabbitMQ (asíncrono, desacoplado)
- **Beneficio**: Mejor UX + resiliencia interna

### 2. Event-Driven Architecture

- Los servicios se comunican mediante eventos
- No hay acoplamiento directo entre microservicios
- Fácil agregar nuevos consumidores

### 3. Idempotent Consumer

- **Problema**: Red puede duplicar mensajes
- **Solución**: Trackear mensajes procesados
- **Herramienta**: Redis (rápido, TTL automático)

### 4. Database per Service

- Cada microservicio tiene su propia BD
- No hay queries cross-service
- Datos compartidos vía eventos

### 5. Configuración de Consumidores

```typescript
// Evitar sobrecarga
@RabbitSubscribe({
  exchange: 'gym.exchange',
  routingKey: 'gym.class.enroll',
  queueOptions: {
    durable: true,
    arguments: {
      'x-max-priority': 10,
    }
  }
})
```

## 🐛 Troubleshooting

### RabbitMQ no conecta

```bash
# Verificar que el contenedor está arriba
docker ps | grep rabbitmq

# Ver logs
docker logs rabbitmq

# Reiniciar
docker-compose restart rabbitmq
```

### PostgreSQL no conecta

```bash
# Verificar puertos
netstat -an | findstr "5432"
netstat -an | findstr "5433"

# Conectar manualmente
docker exec -it postgres-clases psql -U postgres -d gym_clases
```

### Redis no conecta

```bash
# Verificar
docker exec -it redis redis-cli ping
# Debe responder: PONG
```

### Ver todos los logs

```bash
docker-compose logs -f
```

## 📖 Referencias

- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [RabbitMQ Tutorial](https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html)
- [Idempotent Consumer Pattern](https://microservices.io/patterns/communication-style/idempotent-consumer.html)
- [Database per Service Pattern](https://microservices.io/patterns/data/database-per-service.html)

## 👨‍🏫 Autor

Proyecto desarrollado para taller académico de Arquitectura Distribuida.

---

**¿Preguntas?** Revisa los logs con `docker-compose logs -f [servicio]`
