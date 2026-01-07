# 🧪 Guía de Pruebas de Resiliencia

## Objetivo

Demostrar el funcionamiento del **Idempotent Consumer Pattern** y validar que los mensajes duplicados no generan inscripciones duplicadas.

---

## 📋 Pre-requisitos

1. Sistema levantado con `docker-compose up`
2. Herramienta para hacer requests HTTP (curl, Postman, Thunder Client)
3. Acceso a RabbitMQ Management UI: http://localhost:15672

---

## 🧪 Escenarios de Prueba

### 1. Flujo Normal (Sin Duplicados)

**Objetivo**: Verificar que el flujo básico funciona correctamente.

#### Paso 1: Crear una clase

```bash
curl -X POST http://localhost:3000/clases ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Spinning\",\"horario\":\"Lunes 18:00\",\"cupo\":20,\"instructor\":\"Carlos Ruiz\"}"
```

**Respuesta esperada**:
```json
{
  "message": "Clase creation request received",
  "messageId": "uuid-generado-1",
  "received": true
}
```

#### Paso 2: Verificar en logs de MS-Clases

```bash
docker logs ms-clases
```

Buscar líneas como:
```
📥 Received message: uuid-generado-1
✅ Class created successfully: 1
```

#### Paso 3: Crear inscripción

```bash
curl -X POST http://localhost:3000/inscripciones ^
  -H "Content-Type: application/json" ^
  -d "{\"claseId\":1,\"alumno\":\"María García\",\"email\":\"maria@example.com\"}"
```

**Respuesta esperada**:
```json
{
  "message": "Enrollment request received",
  "messageId": "uuid-generado-2",
  "received": true
}
```

#### Paso 4: Verificar en logs de MS-Inscripciones

```bash
docker logs ms-inscripciones
```

Buscar:
```
📥 Received enrollment message: uuid-generado-2
✅ New enrollment processed successfully | MessageID: uuid-generado-2 | InscripcionID: 1
```

#### Paso 5: Verificar en Redis

```bash
docker exec -it redis redis-cli

# Listar claves idempotentes
KEYS idempotent:*

# Ver contenido
GET idempotent:uuid-generado-2

# Ver TTL
TTL idempotent:uuid-generado-2
```

**Resultado esperado**: 
- Clave existe
- TTL alrededor de 86400 segundos (24 horas)

---

### 2. Simulación de Mensaje Duplicado (Automático)

**Objetivo**: Demostrar que mensajes duplicados se ignoran.

#### Paso 1: Crear múltiples inscripciones rápidamente

```bash
# Ejecutar 5 veces la misma inscripción
for /L %i in (1,1,5) do (
  curl -X POST http://localhost:3000/inscripciones ^
    -H "Content-Type: application/json" ^
    -d "{\"claseId\":1,\"alumno\":\"Test User\",\"email\":\"test@example.com\"}"
)
```

#### Paso 2: Verificar logs

```bash
docker logs ms-inscripciones --tail 50
```

**Resultado esperado**:
- Solo UNA inscripción se procesa
- Los demás mensajes tienen `messageId` diferente, por lo que TODOS se procesan
- Para duplicados reales, necesitamos publicar manualmente con el mismo `messageId`

---

### 3. Duplicación Manual con RabbitMQ (Real)

**Objetivo**: Duplicar el mismo mensaje con el mismo `messageId`.

#### Paso 1: Acceder a RabbitMQ Management

1. Abrir: http://localhost:15672
2. Usuario: `guest` / Password: `guest`

#### Paso 2: Publicar mensaje duplicado

1. Ir a pestaña **Queues**
2. Click en `gym.class.enroll`
3. Expandir sección **Publish message**
4. Configurar:

**Headers**: (dejar vacío)

**Payload**:
```json
{
  "messageId": "TEST-DUPLICATE-001",
  "data": {
    "claseId": 1,
    "alumno": "Duplicate Test",
    "email": "duplicate@test.com"
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```

5. Click en **Publish message**
6. Esperar 2 segundos
7. **Click nuevamente** en **Publish message** (mismo payload)

#### Paso 3: Verificar logs

```bash
docker logs ms-inscripciones --tail 20
```

**Primera vez** (mensaje nuevo):
```
📥 Received enrollment message: TEST-DUPLICATE-001
✅ New enrollment processed successfully | MessageID: TEST-DUPLICATE-001 | InscripcionID: 2
✅ Message TEST-DUPLICATE-001 marked as processed (TTL: 86400s)
```

**Segunda vez** (mensaje duplicado):
```
📥 Received enrollment message: TEST-DUPLICATE-001
⚠️ Message TEST-DUPLICATE-001 already processed (idempotent skip)
⚠️ Duplicate message detected: TEST-DUPLICATE-001 | Processed at: 2024-01-15T10:00:05Z | Action: SKIPPED (idempotent)
```

#### Paso 4: Verificar en Base de Datos

```bash
# Conectar a PostgreSQL
docker exec -it postgres-inscripciones psql -U postgres -d gym_inscripciones

# Contar inscripciones con ese messageId
SELECT COUNT(*) FROM inscripciones WHERE message_id = 'TEST-DUPLICATE-001';
```

**Resultado esperado**: `1` (solo una fila)

---

### 4. Verificar Reducción de Cupo

**Objetivo**: Validar que el cupo se reduce correctamente.

#### Paso 1: Consultar cupo inicial

```bash
docker exec -it postgres-clases psql -U postgres -d gym_clases

SELECT id, nombre, cupo FROM clases WHERE id = 1;
```

Anotar el cupo inicial (ejemplo: 20).

#### Paso 2: Crear 3 inscripciones

```bash
curl -X POST http://localhost:3000/inscripciones ^
  -H "Content-Type: application/json" ^
  -d "{\"claseId\":1,\"alumno\":\"Alumno 1\",\"email\":\"alumno1@test.com\"}"

curl -X POST http://localhost:3000/inscripciones ^
  -H "Content-Type: application/json" ^
  -d "{\"claseId\":1,\"alumno\":\"Alumno 2\",\"email\":\"alumno2@test.com\"}"

curl -X POST http://localhost:3000/inscripciones ^
  -H "Content-Type: application/json" ^
  -d "{\"claseId\":1,\"alumno\":\"Alumno 3\",\"email\":\"alumno3@test.com\"}"
```

#### Paso 3: Verificar cupo actualizado

```bash
docker exec -it postgres-clases psql -U postgres -d gym_clases

SELECT id, nombre, cupo FROM clases WHERE id = 1;
```

**Resultado esperado**: Cupo = 17 (20 - 3)

---

### 5. Prueba de Concurrencia con Autocannon

**Objetivo**: Enviar múltiples requests simultáneos y verificar consistencia.

#### Paso 1: Instalar Autocannon (si no está instalado)

```bash
npm install -g autocannon
```

#### Paso 2: Ejecutar prueba de carga

```bash
autocannon -c 10 -d 5 -m POST ^
  -H "Content-Type: application/json" ^
  -b "{\"claseId\":1,\"alumno\":\"Load Test\",\"email\":\"load@test.com\"}" ^
  http://localhost:3000/inscripciones
```

Parámetros:
- `-c 10`: 10 conexiones concurrentes
- `-d 5`: Durante 5 segundos
- `-m POST`: Método HTTP POST

#### Paso 3: Verificar resultados

```bash
# Contar inscripciones creadas
docker exec -it postgres-inscripciones psql -U postgres -d gym_inscripciones -c "SELECT COUNT(*) FROM inscripciones;"

# Ver claves en Redis
docker exec -it redis redis-cli KEYS "idempotent:*" | wc -l
```

---

## 📊 Métricas de Validación

### ✅ Pruebas Exitosas

| Métrica | Valor Esperado |
|---------|----------------|
| Inscripciones únicas por `messageId` | 1 |
| Claves en Redis por mensaje | 1 |
| Logs de duplicados ignorados | Presentes |
| Cupo reducido correctamente | Sí |
| Sin errores de BD (unique constraint) | Sí |

### ❌ Señales de Problema

- Múltiples inscripciones con mismo `messageId`
- Cupo reducido más de lo esperado
- Errores de constraint en PostgreSQL
- Falta de logs de idempotencia

---

## 🎯 Demostración en Clase

### Guion Recomendado

1. **Mostrar arquitectura** (README.md - diagrama)
2. **Levantar sistema**: `docker-compose up`
3. **Crear clase** (Paso 1 del flujo normal)
4. **Crear inscripción** (Paso 3 del flujo normal)
5. **Abrir RabbitMQ Management UI**
6. **Publicar mensaje duplicado** (Escenario 3)
7. **Mostrar logs** que demuestran el skip
8. **Verificar BD** (solo 1 fila)
9. **Mostrar Redis** con la clave
10. **Explicar TTL** y por qué 24 horas

---

## 🔍 Troubleshooting

### Problema: No veo mensajes duplicados en logs

**Solución**: Asegúrate de usar el **mismo** `messageId` al publicar manualmente.

### Problema: Redis no tiene claves

**Solución**: 
```bash
# Verificar conexión
docker logs ms-inscripciones | grep Redis

# Debe decir: ✅ Connected to Redis
```

### Problema: Cupo no se reduce

**Solución**: 
```bash
# Verificar logs de MS-Clases
docker logs ms-clases | grep quota

# Debe procesar eventos gym.class.update-quota
```

---

## 📚 Referencias

- [Idempotent Consumer Pattern](https://microservices.io/patterns/communication-style/idempotent-consumer.html)
- [RabbitMQ Tutorial](https://www.rabbitmq.com/getstarted.html)
- [Redis TTL](https://redis.io/commands/expire/)
