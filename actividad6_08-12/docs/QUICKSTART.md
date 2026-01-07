# 🚀 Inicio Rápido - 5 Minutos

Este es el camino más rápido para tener el sistema funcionando.

---

## ✅ Pre-requisitos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Docker Desktop** (Windows/Mac) o Docker Engine (Linux)
  - Descargar: https://www.docker.com/products/docker-desktop
  - Verificar: `docker --version` y `docker-compose --version`

---

## 🎯 Pasos

### 1. Levantar Todo el Sistema

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
docker-compose up --build
```

**Nota**: La primera vez tomará 5-10 minutos (descarga imágenes y construye servicios).

**Espera hasta ver estos mensajes**:
```
✅ Connected to Redis
🐰 Connected to RabbitMQ
🚀 API Gateway running on http://localhost:3000
🏋️ MS-Clases running on http://localhost:3001
📝 MS-Inscripciones running on http://localhost:3002
```

---

### 2. Crear una Clase

Abre otra terminal o usa una herramienta como Postman/Thunder Client:

```bash
curl -X POST http://localhost:3000/clases ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Yoga\",\"horario\":\"Lunes 18:00\",\"cupo\":20,\"instructor\":\"Juan\"}"
```

**Respuesta esperada**:
```json
{
  "message": "Clase creation request received",
  "messageId": "uuid-generado",
  "received": true
}
```

---

### 3. Crear una Inscripción

```bash
curl -X POST http://localhost:3000/inscripciones ^
  -H "Content-Type: application/json" ^
  -d "{\"claseId\":1,\"alumno\":\"María\",\"email\":\"maria@test.com\"}"
```

**Respuesta esperada**:
```json
{
  "message": "Enrollment request received",
  "messageId": "uuid-generado",
  "received": true
}
```

---

### 4. Verificar que Funcionó

#### Ver logs de procesamiento:

```bash
docker logs ms-clases
docker logs ms-inscripciones
```

Busca líneas como:
```
✅ Class created successfully: 1
✅ New enrollment processed successfully
```

#### Ver RabbitMQ Management:

1. Abre: http://localhost:15672
2. Usuario: `guest` / Password: `guest`
3. Ve a **Queues** y verifica que los mensajes se procesaron

---

### 5. Probar Idempotencia (Opcional)

Ejecuta el script de prueba:

**Windows**:
```bash
test-idempotency.bat
```

**Linux/Mac**:
```bash
chmod +x test-idempotency.sh
./test-idempotency.sh
```

Este script:
1. Crea una clase
2. Publica el mismo mensaje 3 veces
3. Verifica que solo se creó 1 inscripción

---

## 📊 URLs Útiles

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| API Gateway | http://localhost:3000 | - |
| RabbitMQ Management | http://localhost:15672 | guest / guest |
| MS Clases | http://localhost:3001 | - |
| MS Inscripciones | http://localhost:3002 | - |

---

## 🛑 Detener el Sistema

```bash
# Detener sin eliminar datos
docker-compose stop

# Detener y eliminar todo
docker-compose down

# Detener y eliminar TODO (incluyendo volúmenes)
docker-compose down -v
```

---

## 🐛 Problemas Comunes

### Error: "port is already allocated"

**Solución**: Otro servicio está usando el puerto.

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Error: "Cannot connect to Docker daemon"

**Solución**: Docker Desktop no está corriendo. Ábrelo y espera a que inicie.

### Servicios no inician correctamente

```bash
# Ver logs detallados
docker-compose logs -f

# Reconstruir desde cero
docker-compose down -v
docker-compose up --build
```

---

## 📖 Próximos Pasos

1. Lee `TESTING.md` para pruebas detalladas de resiliencia
2. Lee `ARCHITECTURE.md` para entender la arquitectura
3. Experimenta con el archivo `requests.http` (VS Code + REST Client)

---

## 💡 Tips

- Usa `docker-compose logs -f [servicio]` para ver logs en tiempo real
- Usa `Ctrl+C` para detener todos los servicios
- Los datos persisten entre reinicios (a menos que uses `down -v`)

---

**¿Listo?** Ejecuta `docker-compose up --build` y empieza a experimentar! 🎉
