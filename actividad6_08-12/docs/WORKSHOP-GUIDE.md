# 🎯 Taller Académico - Guía del Instructor

## 📋 Información del Taller

**Duración**: 2-3 horas  
**Nivel**: Intermedio-Avanzado  
**Pre-requisitos**: Conocimientos básicos de Node.js, Docker, REST APIs

---

## 🎓 Objetivos de Aprendizaje

Al finalizar el taller, los estudiantes serán capaces de:

1. ✅ Comprender arquitecturas híbridas (REST + Mensajería)
2. ✅ Implementar comunicación asíncrona con RabbitMQ
3. ✅ Aplicar el patrón Idempotent Consumer para resiliencia
4. ✅ Diseñar microservicios con bases de datos independientes
5. ✅ Utilizar Docker Compose para orquestar sistemas distribuidos

---

## 📚 Agenda Sugerida

### Módulo 1: Introducción (30 min)

**Teoría** (15 min):
- ¿Qué son los microservicios?
- Ventajas y desventajas vs monolitos
- Arquitectura del proyecto (mostrar diagrama del README.md)
- Introducción a RabbitMQ y Event-Driven Architecture

**Demo** (15 min):
1. Mostrar estructura del proyecto
2. Explicar Docker Compose
3. Levantar sistema: `docker-compose up --build`
4. Abrir RabbitMQ Management UI

**Código clave a revisar**:
- `docker-compose.yml` (orquestación)
- `README.md` (diagrama de arquitectura)

---

### Módulo 2: API Gateway y Comunicación (30 min)

**Teoría** (10 min):
- Patrón API Gateway
- ¿Por qué no lógica de negocio en el gateway?
- Validación con DTOs

**Demo** (20 min):
1. Revisar `api-gateway/src/clases/clases.controller.ts`
2. Mostrar DTOs: `create-clase.dto.ts`
3. Explicar `RabbitMQService`
4. Crear clase con Postman/curl
5. Mostrar logs: `docker logs api-gateway`
6. Ver mensaje en RabbitMQ UI

**Ejercicio práctico**:
```
Crear endpoint POST /clases en API Gateway
Validar que tenga los campos requeridos
Publicar evento en RabbitMQ
Verificar en Management UI
```

**Código clave**:
```typescript
// api-gateway/src/clases/clases.controller.ts
@Post()
@HttpCode(HttpStatus.ACCEPTED)
async create(@Body() createClaseDto: CreateClaseDto) {
  const result = await this.rabbitMQService.publishEvent(
    'gym.class.create',
    createClaseDto,
  );
  return { message: 'Request received', ...result };
}
```

---

### Módulo 3: Microservicio Clases (30 min)

**Teoría** (10 min):
- Consumers de RabbitMQ
- TypeORM y entities
- Database per Service pattern

**Demo** (20 min):
1. Revisar `ms-clases/src/clases/clases.controller.ts`
2. Explicar `@EventPattern('gym.class.create')`
3. Mostrar Entity: `clase.entity.ts`
4. Crear clase y verificar en BD:
   ```bash
   docker exec -it postgres-clases psql -U postgres -d gym_clases
   SELECT * FROM clases;
   ```
5. Explicar logs de procesamiento

**Ejercicio práctico**:
```
Revisar cómo el MS-Clases consume eventos
Verificar que la clase se guardó en PostgreSQL
Entender el flujo: Gateway → RabbitMQ → MS-Clases → BD
```

**Código clave**:
```typescript
// ms-clases/src/clases/clases.controller.ts
@EventPattern('gym.class.create')
async handleClassCreate(@Payload() message: any) {
  const clase = await this.clasesService.create(message.data);
  return { success: true, claseId: clase.id };
}
```

---

### Módulo 4: Idempotent Consumer (45 min) ⭐ **核心**

**Teoría** (15 min):
- ¿Qué es idempotencia?
- Problemas de mensajes duplicados
- Soluciones: Redis, BD, memoria
- TTL y por qué 24 horas

**Demo** (30 min):
1. Revisar `idempotency.service.ts`
2. Explicar flujo:
   ```
   1. Verificar en Redis si messageId existe
   2. Si existe → Skip (retornar sin procesar)
   3. Si no existe → Procesar
   4. Marcar como procesado en Redis
   ```
3. **Demostración en vivo**:
   - Crear inscripción normal
   - Ver logs: `✅ New enrollment processed`
   - Publicar mensaje duplicado en RabbitMQ UI
   - Ver logs: `⚠️ Duplicate message detected`
   - Verificar Redis: `docker exec redis redis-cli GET idempotent:<messageId>`
   - Verificar BD: Solo 1 fila con ese messageId

4. Ejecutar script: `test-idempotency.bat`

**Ejercicio práctico**:
```
1. Crear una inscripción
2. Anotar el messageId de los logs
3. Publicar manualmente el mismo mensaje 2 veces más
4. Verificar que solo se creó 1 inscripción
5. Verificar clave en Redis
```

**Código clave**:
```typescript
// ms-inscripciones/src/inscripciones/inscripciones.service.ts
async processEnrollmentIdempotent(messageId: string, data: any) {
  // 1. Verificar si ya fue procesado
  const alreadyProcessed = await this.idempotencyService.isProcessed(messageId);
  
  if (alreadyProcessed) {
    return { success: true, duplicate: true };
  }

  // 2. Procesar
  const inscripcion = await this.create(messageId, data);

  // 3. Marcar como procesado
  await this.idempotencyService.markAsProcessed(messageId);

  return { success: true, duplicate: false };
}
```

---

### Módulo 5: Flujo Completo (30 min)

**Teoría** (10 min):
- Consistencia eventual
- Comunicación entre microservicios vía eventos
- Event-driven architecture

**Demo** (20 min):
1. Crear una clase (cupo = 20)
2. Verificar cupo inicial en BD
3. Crear 3 inscripciones
4. Mostrar logs de ambos microservicios:
   ```
   MS-Inscripciones: ✅ Enrollment processed
   MS-Clases: 📥 Quota update received
   MS-Clases: ✅ Quota decremented. New quota: 17
   ```
5. Verificar cupo final en BD (debe ser 17)

**Flujo completo**:
```
Cliente → API Gateway
  ↓ (publica gym.class.enroll)
RabbitMQ
  ↓
MS-Inscripciones
  ↓ (guarda inscripción)
PostgreSQL (inscripciones)
  ↓ (publica gym.class.update-quota)
RabbitMQ
  ↓
MS-Clases
  ↓ (reduce cupo)
PostgreSQL (clases)
```

**Ejercicio práctico**:
```
1. Crear clase con cupo 10
2. Crear 5 inscripciones
3. Verificar cupo final = 5
4. Revisar logs de ambos MS
5. Explicar el flujo evento por evento
```

---

### Módulo 6: Resiliencia y Casos Edge (15 min)

**Demostraciones**:

1. **MS caído**:
   ```bash
   docker stop ms-clases
   # Crear inscripción (funciona)
   # Mensaje queda en cola
   docker start ms-clases
   # Mensaje se procesa automáticamente
   ```

2. **Redis caído**:
   ```bash
   docker stop redis
   # Crear inscripción (funciona)
   # Constraint UNIQUE en BD evita duplicados
   docker start redis
   ```

3. **Carga concurrente**:
   ```bash
   # Si tienen autocannon instalado
   autocannon -c 10 -d 5 -m POST http://localhost:3000/inscripciones
   ```

---

## 🎯 Puntos Clave a Enfatizar

### 1. Arquitectura Híbrida
- REST para entrada (simple para clientes)
- Mensajería para comunicación interna (resiliente)

### 2. Desacoplamiento
- Microservicios no se conocen directamente
- Solo conocen eventos y colas

### 3. Idempotencia
- Fundamental en sistemas distribuidos
- Doble protección: Redis + BD

### 4. Event-Driven
- Los servicios reaccionan a eventos
- Fácil agregar nuevos consumidores

### 5. Database per Service
- Cada MS es dueño de sus datos
- No hay queries cross-service

---

## 🧪 Ejercicios Adicionales

### Ejercicio 1: Agregar Validación de Cupo

**Objetivo**: Verificar cupo disponible antes de crear inscripción.

**Pasos**:
1. En MS-Inscripciones, hacer query HTTP a MS-Clases
2. Verificar cupo > 0
3. Si no hay cupo, lanzar error

**Desafío**: ¿Esto viola la prohibición de HTTP entre MS? ¿Alternativas?

### Ejercicio 2: Evento de Cancelación

**Objetivo**: Implementar cancelación de inscripción.

**Pasos**:
1. Agregar endpoint DELETE /inscripciones/:id
2. Publicar evento `gym.class.unenroll`
3. MS-Clases incrementa cupo

### Ejercicio 3: Dead Letter Queue

**Objetivo**: Manejar mensajes que fallan repetidamente.

**Pasos**:
1. Configurar DLQ en RabbitMQ
2. Simular error en consumer
3. Verificar que mensaje va a DLQ

---

## 📝 Evaluación

### Preguntas de Comprensión

1. ¿Por qué usamos RabbitMQ en lugar de HTTP directo?
2. ¿Qué problema resuelve el Idempotent Consumer?
3. ¿Cómo funciona el TTL en Redis?
4. ¿Qué pasa si un mensaje falla en el procesamiento?
5. ¿Cómo escalarías este sistema para 10x tráfico?

### Actividad Práctica Final

**Tarea**: Agregar endpoint para listar inscripciones de una clase.

**Requisitos**:
- Endpoint: GET /clases/:id/inscripciones
- Debe consultar MS-Inscripciones
- Retornar lista de alumnos

**Debate**: ¿Esto viola Database per Service? ¿Alternativas?

---

## 🛠️ Troubleshooting Durante el Taller

### Problema: Servicios no inician

```bash
docker-compose down -v
docker-compose up --build
```

### Problema: Puerto ocupado

```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # Puerto externo diferente
```

### Problema: Logs no muestran nada

```bash
# Ver logs de todos los servicios
docker-compose logs -f
```

---

## 📚 Recursos Adicionales

**Para estudiantes**:
- README.md - Overview del proyecto
- QUICKSTART.md - Inicio rápido
- ARCHITECTURE.md - Explicación detallada
- TESTING.md - Guía de pruebas
- FAQ.md - Preguntas frecuentes

**Para profundizar**:
- [Microservices.io](https://microservices.io)
- [NestJS Docs](https://docs.nestjs.com)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)
- [Redis Documentation](https://redis.io/documentation)

---

## ✅ Checklist Pre-Taller

- [ ] Docker Desktop instalado y corriendo
- [ ] Clonar/descargar proyecto
- [ ] Probar `docker-compose up --build` antes del taller
- [ ] Verificar acceso a RabbitMQ UI (http://localhost:15672)
- [ ] Tener Postman/curl listo
- [ ] Preparar slides con diagramas (usar los del README.md)
- [ ] Revisar FAQ.md para preguntas comunes

---

## 💡 Tips para el Instructor

1. **Mostrar primero, explicar después**: Demo en vivo antes de teoría
2. **Usar logs en tiempo real**: `docker logs -f` mientras se ejecutan requests
3. **Pausar para preguntas** después de cada módulo
4. **Hacer énfasis en los WHY**, no solo en los HOW
5. **Comparar con enfoques alternativos** (ej: monolito vs microservicios)
6. **Animar a experimentar**: Que rompan cosas y vean qué pasa

---

## 🎉 Cierre del Taller

**Resumen**:
- ✅ Arquitectura híbrida (REST + RabbitMQ)
- ✅ Event-Driven Architecture
- ✅ Idempotent Consumer Pattern
- ✅ Database per Service
- ✅ Resiliencia y manejo de fallos

**Próximos pasos**:
- Experimentar con el código
- Agregar features (notificaciones, reportes, etc.)
- Explorar CQRS y Event Sourcing
- Leer documentación de los patrones

**Pregunta final**: ¿En qué proyectos aplicarían esta arquitectura?

---

**¿Preguntas del instructor?** Contacto: [email del responsable del taller]
