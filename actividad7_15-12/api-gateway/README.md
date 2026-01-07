# API Gateway - Sistema de Gestión de Gimnasio

## Descripción

Punto de entrada REST al sistema. Valida requests y publica eventos en RabbitMQ.

## Responsabilidades

- ✅ Exponer endpoints REST públicos
- ✅ Validar DTOs de entrada
- ✅ Publicar eventos en RabbitMQ
- ✅ Retornar respuestas rápidas (202 Accepted)
- ❌ NO contiene lógica de negocio

## Endpoints

### Clases

- `POST /clases` - Solicitar creación de clase
- `GET /clases` - Listar clases (consultar MS-Clases directamente)

### Inscripciones

- `POST /inscripciones` - Solicitar inscripción
- `GET /inscripciones` - Listar inscripciones (consultar MS-Inscripciones directamente)

## Variables de Entorno

```env
PORT=3000
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
```

## Dependencias Principales

- `@nestjs/common` - Framework base
- `@nestjs/microservices` - Cliente RabbitMQ
- `class-validator` - Validación de DTOs
- `amqp-connection-manager` - Gestión de conexión RabbitMQ
- `uuid` - Generación de messageIds únicos

## Estructura

```
src/
├── main.ts                  # Punto de entrada
├── app.module.ts            # Módulo principal
├── clases/
│   ├── clases.controller.ts
│   └── dto/
│       └── create-clase.dto.ts
├── inscripciones/
│   ├── inscripciones.controller.ts
│   └── dto/
│       └── create-inscripcion.dto.ts
└── shared/
    └── rabbitmq.service.ts  # Servicio de publicación
```

## Flujo de un Request

1. Cliente envía POST /inscripciones
2. NestJS valida el DTO automáticamente
3. Controller llama a `rabbitMQService.publishEvent()`
4. Se genera un `messageId` único (UUID)
5. Se publica evento en RabbitMQ
6. Se retorna 202 Accepted inmediatamente

## Desarrollo Local

```bash
npm install
npm run start:dev
```

## Docker

```bash
docker build -t api-gateway .
docker run -p 3000:3000 -e RABBITMQ_URL=amqp://localhost:5672 api-gateway
```

## Logs

```bash
docker logs -f api-gateway
```

Busca:
- `🚀 API Gateway running on http://localhost:3000`
- `🐰 Connected to RabbitMQ`
- `📤 Message published: gym.class.create | ID: uuid-123`

## Testing

```bash
# Crear clase
curl -X POST http://localhost:3000/clases \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","horario":"10:00","cupo":20,"instructor":"Test"}'

# Respuesta esperada:
# {"message":"Clase creation request received","messageId":"uuid","received":true}
```

## Notas Importantes

- ⚠️ No contiene lógica de negocio (by design)
- ⚠️ No hace queries a bases de datos
- ⚠️ No espera respuesta de los microservicios
- ✅ Solo valida, publica y retorna
