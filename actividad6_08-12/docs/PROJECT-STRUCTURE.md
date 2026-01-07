# 📁 Estructura del Proyecto

```
gym-management-system/
│
├── 📄 README.md                    # Documentación principal del proyecto
├── 📄 QUICKSTART.md                # Guía de inicio rápido (5 minutos)
├── 📄 ARCHITECTURE.md              # Explicación detallada de arquitectura
├── 📄 TESTING.md                   # Guía de pruebas de resiliencia
├── 📄 FAQ.md                       # Preguntas frecuentes
├── 📄 WORKSHOP-GUIDE.md            # Guía para instructores del taller
├── 📄 docker-compose.yml           # Orquestación de todos los servicios
├── 📄 .gitignore                   # Archivos ignorados por Git
├── 📄 requests.http                # Ejemplos de requests HTTP
│
├── 🔧 test-idempotency.bat         # Script de prueba Windows
├── 🔧 test-idempotency.sh          # Script de prueba Linux/Mac
├── 🔧 check-status.bat             # Verificar estado del sistema
├── 🔧 clean.bat                    # Limpiar contenedores y volúmenes
├── 🔧 logs.bat                     # Ver logs de servicios
│
├── 📁 api-gateway/                 # API Gateway (REST)
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 nest-cli.json
│   ├── 📄 .env
│   └── 📁 src/
│       ├── 📄 main.ts              # Punto de entrada
│       ├── 📄 app.module.ts        # Módulo principal
│       ├── 📁 clases/
│       │   ├── 📄 clases.controller.ts
│       │   └── 📁 dto/
│       │       └── 📄 create-clase.dto.ts
│       ├── 📁 inscripciones/
│       │   ├── 📄 inscripciones.controller.ts
│       │   └── 📁 dto/
│       │       └── 📄 create-inscripcion.dto.ts
│       └── 📁 shared/
│           └── 📄 rabbitmq.service.ts    # Servicio de mensajería
│
├── 📁 ms-clases/                   # Microservicio de Clases
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   ├── 📄 tsconfig.json
│   ├── 📄 nest-cli.json
│   ├── 📄 .env
│   └── 📁 src/
│       ├── 📄 main.ts
│       ├── 📄 app.module.ts
│       ├── 📁 clases/
│       │   ├── 📄 clases.module.ts
│       │   ├── 📄 clases.controller.ts   # Consumer de RabbitMQ
│       │   ├── 📄 clases.service.ts      # Lógica de negocio
│       │   └── 📁 entities/
│       │       └── 📄 clase.entity.ts    # Entidad TypeORM
│       └── 📁 shared/
│           ├── 📄 rabbitmq.module.ts
│           └── 📄 rabbitmq.service.ts
│
└── 📁 ms-inscripciones/            # Microservicio de Inscripciones
    ├── 📄 Dockerfile
    ├── 📄 package.json
    ├── 📄 tsconfig.json
    ├── 📄 nest-cli.json
    ├── 📄 .env
    └── 📁 src/
        ├── 📄 main.ts
        ├── 📄 app.module.ts
        ├── 📁 inscripciones/
        │   ├── 📄 inscripciones.module.ts
        │   ├── 📄 inscripciones.controller.ts  # Consumer con idempotencia
        │   ├── 📄 inscripciones.service.ts     # Lógica + idempotencia
        │   └── 📁 entities/
        │       └── 📄 inscripcion.entity.ts
        └── 📁 shared/
            ├── 📄 redis.module.ts              # Configuración de Redis
            ├── 📄 idempotency.service.ts       # ⭐ Servicio de idempotencia
            ├── 📄 rabbitmq.module.ts
            └── 📄 rabbitmq.service.ts
```

---

## 🔑 Archivos Clave por Responsabilidad

### 🌐 API Gateway

| Archivo | Responsabilidad |
|---------|-----------------|
| `clases.controller.ts` | Recibir requests REST de clases |
| `inscripciones.controller.ts` | Recibir requests REST de inscripciones |
| `rabbitmq.service.ts` | Publicar eventos en RabbitMQ |
| `create-clase.dto.ts` | Validar datos de entrada |

### 🏋️ MS-Clases

| Archivo | Responsabilidad |
|---------|-----------------|
| `clases.controller.ts` | Consumir eventos de RabbitMQ |
| `clases.service.ts` | Lógica de negocio (CRUD, actualizar cupo) |
| `clase.entity.ts` | Modelo de datos (TypeORM) |
| `rabbitmq.service.ts` | Publicar eventos propios |

### 📝 MS-Inscripciones

| Archivo | Responsabilidad |
|---------|-----------------|
| `inscripciones.controller.ts` | Consumir eventos con idempotencia |
| `inscripciones.service.ts` | Lógica + procesamiento idempotente |
| `idempotency.service.ts` | ⭐ **Verificar/marcar mensajes procesados** |
| `redis.module.ts` | Configurar conexión a Redis |
| `inscripcion.entity.ts` | Modelo con `message_id` único |

---

## 📊 Flujo de Datos

### Crear Clase

```
1. Cliente → POST /clases (api-gateway)
2. Gateway valida DTO
3. Gateway publica evento → gym.class.create
4. RabbitMQ enruta a cola gym.class.create
5. MS-Clases consume evento
6. MS-Clases guarda en PostgreSQL
7. MS-Clases registra log ✅
```

### Crear Inscripción (con Idempotencia)

```
1. Cliente → POST /inscripciones (api-gateway)
2. Gateway genera messageId único (UUID)
3. Gateway publica evento → gym.class.enroll
4. RabbitMQ enruta a cola gym.class.enroll
5. MS-Inscripciones consume evento
6. 🛡️ Verifica en Redis si messageId existe
   ├─ SI existe → Skip (retorna duplicate: true)
   └─ NO existe → Continúa al paso 7
7. MS-Inscripciones guarda inscripción en PostgreSQL
8. MS-Inscripciones marca messageId en Redis (TTL 24h)
9. MS-Inscripciones publica evento → gym.class.update-quota
10. RabbitMQ enruta a MS-Clases
11. MS-Clases reduce cupo en PostgreSQL
12. MS-Clases registra log ✅
```

---

## 🐳 Docker Compose - Servicios

| Servicio | Imagen | Puerto | Propósito |
|----------|--------|--------|-----------|
| **api-gateway** | Custom (Node 18) | 3000 | Punto de entrada REST |
| **ms-clases** | Custom (Node 18) | 3001 | Gestión de clases |
| **ms-inscripciones** | Custom (Node 18) | 3002 | Gestión de inscripciones |
| **rabbitmq** | rabbitmq:3.12-management | 5672, 15672 | Bus de mensajería |
| **redis** | redis:7-alpine | 6379 | Storage idempotencia |
| **postgres-clases** | postgres:15-alpine | 5432 | BD MS-Clases |
| **postgres-inscripciones** | postgres:15-alpine | 5433 | BD MS-Inscripciones |

---

## 🔐 Variables de Entorno

### API Gateway

```env
PORT=3000
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
```

### MS-Clases

```env
PORT=3001
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
DB_HOST=postgres-clases
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=gym_clases
```

### MS-Inscripciones

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

---

## 📦 Dependencias Principales

### Comunes a todos los servicios

```json
{
  "@nestjs/common": "^10.0.0",
  "@nestjs/core": "^10.0.0",
  "@nestjs/microservices": "^10.0.0",
  "amqp-connection-manager": "^4.1.14",
  "amqplib": "^0.10.3",
  "rxjs": "^7.8.1"
}
```

### MS-Clases y MS-Inscripciones (adicionales)

```json
{
  "@nestjs/typeorm": "^10.0.0",
  "typeorm": "^0.3.17",
  "pg": "^8.11.3"
}
```

### Solo MS-Inscripciones (adicional)

```json
{
  "ioredis": "^5.3.2"
}
```

---

## 🗂️ Base de Datos

### MS-Clases: `gym_clases`

```sql
Table: clases
├── id (SERIAL PRIMARY KEY)
├── nombre (VARCHAR 255)
├── horario (VARCHAR 100)
├── cupo (INTEGER)
├── instructor (VARCHAR 255)
└── created_at (TIMESTAMP)
```

### MS-Inscripciones: `gym_inscripciones`

```sql
Table: inscripciones
├── id (SERIAL PRIMARY KEY)
├── clase_id (INTEGER)
├── alumno (VARCHAR 255)
├── email (VARCHAR 255)
├── message_id (VARCHAR 255 UNIQUE)  ← Clave para idempotencia
└── created_at (TIMESTAMP)
```

---

## 🔄 Colas RabbitMQ

```
Exchange: gym.exchange (topic)
│
├── Queue: gym.class.create
│   └── Routing Key: gym.class.create
│       └── Consumer: MS-Clases
│
├── Queue: gym.class.enroll
│   └── Routing Key: gym.class.enroll
│       └── Consumer: MS-Inscripciones
│
└── Queue: gym.class.update-quota
    └── Routing Key: gym.class.update-quota
        └── Consumer: MS-Clases
```

---

## 🧪 Scripts de Prueba

| Script | Propósito |
|--------|-----------|
| `test-idempotency.bat` | Demostrar Idempotent Consumer |
| `check-status.bat` | Verificar estado de todos los servicios |
| `clean.bat` | Limpiar contenedores y volúmenes |
| `logs.bat` | Ver logs de servicios individuales |

---

## 📚 Documentación

| Archivo | Contenido |
|---------|-----------|
| `README.md` | Overview, arquitectura, inicio rápido |
| `QUICKSTART.md` | Guía de 5 minutos para levantar el sistema |
| `ARCHITECTURE.md` | Explicación profunda de patrones y decisiones |
| `TESTING.md` | Guía completa de pruebas de resiliencia |
| `FAQ.md` | Respuestas a preguntas frecuentes |
| `WORKSHOP-GUIDE.md` | Guía para instructores académicos |
| `requests.http` | Ejemplos de requests HTTP para VS Code |

---

## 🎯 Características Implementadas

- ✅ Arquitectura híbrida (REST + RabbitMQ)
- ✅ API Gateway sin lógica de negocio
- ✅ Event-Driven Architecture
- ✅ **Idempotent Consumer Pattern** (con Redis)
- ✅ Database per Service
- ✅ Comunicación asíncrona 100%
- ✅ Docker Compose orquestación completa
- ✅ Logging estructurado
- ✅ Validación de DTOs
- ✅ TypeORM con PostgreSQL
- ✅ Healthchecks en Docker
- ✅ Scripts de prueba automatizados
- ✅ Documentación completa

---

## 🚀 Comandos Rápidos

```bash
# Iniciar todo
docker-compose up --build

# Ver logs
docker-compose logs -f [servicio]

# Detener
docker-compose down

# Limpiar todo
docker-compose down -v

# Verificar estado
check-status.bat

# Probar idempotencia
test-idempotency.bat
```

---

**Proyecto listo para taller académico de Arquitectura Distribuida** 🎓
