# 🎓 Preguntas Frecuentes del Taller

## Arquitectura

### ¿Por qué usar RabbitMQ en lugar de HTTP directo?

**Ventajas de RabbitMQ**:
1. **Desacoplamiento**: Los servicios no necesitan conocerse directamente
2. **Resiliencia**: Si un servicio está caído, los mensajes se acumulan en la cola
3. **Escalabilidad**: Múltiples consumidores pueden procesar la misma cola
4. **Retry automático**: RabbitMQ puede reintentar mensajes fallidos
5. **Auditabilidad**: Todos los eventos quedan registrados

**Desventajas**:
- Mayor complejidad
- Requiere infraestructura adicional
- Debugging más difícil

### ¿Por qué bases de datos separadas?

**Database per Service Pattern**:
- Cada servicio es dueño de sus datos
- Permite usar diferentes tecnologías (ej: PostgreSQL + MongoDB)
- Facilita el escalado independiente
- Evita acoplamiento a nivel de datos

**Costo**: No se pueden hacer JOINs directos entre servicios.

### ¿Qué pasa si Redis se cae?

El sistema tiene **doble protección**:
1. Redis verifica idempotencia (rápido)
2. Si Redis falla, la constraint `UNIQUE` en PostgreSQL evita duplicados

**Comportamiento**: El sistema sigue funcionando pero será más lento.

---

## Idempotencia

### ¿Por qué 24 horas de TTL en Redis?

**Razonamiento**:
- Es suficiente tiempo para detectar duplicados típicos (segundos/minutos)
- Evita crecimiento infinito de claves en Redis
- Después de 24h, es improbable recibir duplicados

**Ajustable**: Puedes cambiar `TTL = 86400` en `idempotency.service.ts`.

### ¿Qué pasa si el mensaje falla DESPUÉS de marcar como procesado?

**Escenario**:
```typescript
await this.idempotencyService.markAsProcessed(messageId); // ✅
await this.inscripcionRepository.save(inscripcion); // ❌ FALLA
```

**Problema**: Mensaje marcado pero no guardado → se pierde.

**Solución en producción**:
- Usar transacciones distribuidas (Saga Pattern)
- Marcar como procesado DESPUÉS del commit
- Implementar Dead Letter Queue para mensajes fallidos

**En el taller**: Asumimos happy path por simplicidad.

### ¿Cómo sé que la idempotencia funciona?

**3 formas de verificar**:
1. **Logs**: Busca mensajes `⚠️ Duplicate message detected`
2. **Redis**: `docker exec redis redis-cli GET idempotent:<messageId>`
3. **Base de Datos**: `SELECT COUNT(*) FROM inscripciones WHERE message_id = '...'` debe ser 1

---

## RabbitMQ

### ¿Qué es un Exchange? ¿Qué es una Queue?

**Exchange**:
- Recibe mensajes de productores
- Decide a qué colas enviar el mensaje según el routing key
- Tipos: direct, topic, fanout, headers

**Queue**:
- Almacena mensajes hasta que un consumidor los procese
- Puede tener múltiples consumidores
- Puede ser durable (sobrevive reinicios)

**Analogía**:
- Exchange = Oficina de correos
- Routing Key = Código postal
- Queue = Buzón de tu casa

### ¿Qué significa `prefetchCount: 1`?

**Definición**: Número de mensajes que RabbitMQ envía al consumidor antes de esperar confirmación (ACK).

**Ejemplo**:
- `prefetchCount: 1` → Procesar un mensaje a la vez
- `prefetchCount: 10` → RabbitMQ envía hasta 10 mensajes sin esperar

**Por qué 1 en el taller**: Garantiza orden y evita problemas de concurrencia.

### ¿Cómo funcionan los ACKs?

**Flujo**:
1. RabbitMQ envía mensaje al consumidor
2. Consumidor procesa mensaje
3. Consumidor envía ACK (acknowledgment)
4. RabbitMQ elimina mensaje de la cola

**Si no hay ACK**: RabbitMQ reintenta el mensaje.

**En NestJS**: ACK automático si el handler no lanza error.

---

## Docker

### ¿Por qué `--build` en docker-compose?

**Razón**: Reconstruir imágenes si hay cambios en el código.

**Sin `--build`**: Docker usa imágenes cacheadas (puede tener código viejo).

**Cuándo usarlo**:
- Primera vez
- Después de cambiar código
- Después de cambiar `Dockerfile`

**Cuándo NO usarlo**:
- Solo cambios en configuración de docker-compose.yml
- Para ahorrar tiempo si no hay cambios

### ¿Qué son los healthchecks?

**Propósito**: Verificar que un servicio está listo antes de iniciar dependientes.

**Ejemplo**:
```yaml
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
  interval: 10s
  timeout: 5s
  retries: 5
```

**Significado**:
- Cada 10 segundos, ejecutar `redis-cli ping`
- Si falla 5 veces consecutivas → servicio unhealthy
- Otros servicios esperan hasta que esté healthy

### ¿Qué son los volúmenes?

**Definición**: Almacenamiento persistente para contenedores.

**Sin volumen**: Datos se pierden al eliminar contenedor.

**Con volumen**: Datos persisten entre reinicios.

**En el proyecto**:
```yaml
volumes:
  postgres-clases-data:/var/lib/postgresql/data
```

**Eliminar volúmenes**: `docker-compose down -v`

---

## NestJS

### ¿Qué son los DTOs?

**DTO**: Data Transfer Object - Objeto para transferir datos entre capas.

**Propósito**:
- Validación automática (con decoradores)
- Type safety
- Documentación implícita

**Ejemplo**:
```typescript
export class CreateClaseDto {
  @IsString()
  nombre: string;

  @IsInt()
  @Min(1)
  cupo: number;
}
```

**Beneficio**: NestJS valida automáticamente antes de llegar al controller.

### ¿Qué es `@EventPattern`?

**Definición**: Decorador para marcar un método como consumidor de eventos RabbitMQ.

**Ejemplo**:
```typescript
@EventPattern('gym.class.enroll')
async handleEnrollment(@Payload() message: any) {
  // Procesar mensaje
}
```

**Equivalente a**: Suscribirse a la cola `gym.class.enroll`.

### ¿Por qué `HttpStatus.ACCEPTED` (202)?

**202 Accepted**: Petición recibida, procesamiento asíncrono.

**vs 201 Created**: Recurso creado inmediatamente.

**En el gateway**: Retornamos 202 porque el procesamiento real ocurre después (event-driven).

---

## Escalabilidad

### ¿Cómo escalar este sistema?

**Horizontal Scaling**:
```yaml
# docker-compose.yml
ms-inscripciones:
  deploy:
    replicas: 3  # 3 instancias
```

**Load Balancer**: NGINX delante del API Gateway.

**RabbitMQ**: Múltiples consumidores procesan la misma cola.

**PostgreSQL**: Read replicas + connection pooling.

**Redis**: Redis Cluster para alta disponibilidad.

### ¿Cuántas inscripciones por segundo soporta?

**Depende de**:
- Hardware
- Número de réplicas
- Configuración de RabbitMQ (prefetch, concurrencia)
- Latencia de red

**Estimación conservadora** (1 instancia):
- 100-500 inscripciones/segundo
- Limitado por I/O de PostgreSQL

**Con 3 réplicas**: ~300-1500 inscripciones/segundo.

---

## Producción

### ¿Qué falta para producción?

**Crítico**:
- [ ] Autenticación y autorización (JWT, OAuth)
- [ ] HTTPS/TLS
- [ ] Logging estructurado (ELK Stack)
- [ ] Monitoreo (Prometheus + Grafana)
- [ ] Backup de bases de datos
- [ ] Secrets management (Vault, AWS Secrets Manager)
- [ ] Rate limiting
- [ ] Dead Letter Queue para mensajes fallidos

**Recomendado**:
- [ ] Tests (unitarios, integración, e2e)
- [ ] CI/CD pipeline
- [ ] Health checks avanzados
- [ ] Retry policies configurables
- [ ] Circuit breaker pattern
- [ ] API versioning

### ¿Cómo manejar transacciones distribuidas?

**Problema**: Inscripción creada pero cupo no reducido (falla parcial).

**Soluciones**:

**1. Saga Pattern** (Recomendado):
- Secuencia de transacciones locales
- Si una falla, ejecutar compensaciones
- Ejemplo: Compensar = eliminar inscripción si falla reducción de cupo

**2. 2PC (Two-Phase Commit)**:
- Protocolo de commit distribuido
- Complejo, bloquea recursos

**3. Event Sourcing**:
- Guardar eventos en lugar de estado
- Reconstruir estado desde eventos

**En el taller**: Asumimos éxito para simplicidad.

---

## Debugging

### ¿Cómo debuggear un mensaje que no se procesa?

**Pasos**:
1. **Verificar cola**: http://localhost:15672 → Queues
2. **Ver logs**: `docker logs ms-inscripciones`
3. **Verificar binding**: ¿Cola está conectada al exchange?
4. **Verificar routing key**: ¿Coincide con el esperado?
5. **Probar publicación manual**: RabbitMQ Management UI

### ¿Cómo ver qué hay en una cola?

**RabbitMQ Management UI**:
1. http://localhost:15672
2. Queues → Click en la cola
3. "Get messages" → Click "Get Message(s)"

**Nota**: Esto consume el mensaje (usa "Requeue: Yes" para devolverlo).

---

## Conceptos Avanzados

### ¿Qué es CQRS?

**CQRS**: Command Query Responsibility Segregation.

**Idea**: Separar escrituras (Commands) de lecturas (Queries).

**Ejemplo**:
- Write Model: MS-Inscripciones escribe en BD transaccional
- Read Model: Servicio separado con BD optimizada para consultas (ej: Elasticsearch)

**Beneficio**: Optimizar cada lado independientemente.

### ¿Qué es Event Sourcing?

**Definición**: Guardar eventos en lugar de estado actual.

**Ejemplo**:
```
Eventos:
- ClaseCreada(id=1, cupo=20)
- InscripcionCreada(claseId=1)
- InscripcionCreada(claseId=1)

Estado actual:
- Clase: cupo = 18 (20 - 2)
```

**Beneficio**: Historial completo, fácil auditoría.

**Costo**: Complejidad, storage.

---

**¿Más preguntas?** Revisa los archivos `ARCHITECTURE.md` y `TESTING.md` para información detallada.
