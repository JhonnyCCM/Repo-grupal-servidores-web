@echo off
REM Script de prueba de idempotencia para Windows
REM Publica el mismo mensaje múltiples veces para demostrar idempotencia

echo ===========================================
echo 🧪 Prueba de Idempotent Consumer
echo ===========================================
echo.

REM Verificar que RabbitMQ esté disponible
echo Verificando conexión a RabbitMQ...
docker exec rabbitmq rabbitmq-diagnostics ping >nul 2>&1
if errorlevel 1 (
  echo ❌ RabbitMQ no está disponible
  exit /b 1
)
echo ✅ RabbitMQ disponible
echo.

REM Crear una clase primero
echo 📝 Creando clase de prueba...
curl -s -X POST http://localhost:3000/clases ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre\":\"Clase Test Idempotencia\",\"horario\":\"Test 10:00\",\"cupo\":50,\"instructor\":\"Test\"}"
echo.
echo.

REM Esperar a que se procese
timeout /t 3 /nobreak >nul

REM Generar messageId único
set MESSAGE_ID=IDEMPOTENCY-TEST-%RANDOM%-%TIME:~6,2%

echo ===========================================
echo 📤 PUBLICANDO MENSAJES
echo ===========================================
echo MessageID: %MESSAGE_ID%
echo.

REM Mensaje 1 (debería procesarse)
echo [1/3] Publicando mensaje original...
docker exec rabbitmq rabbitmqadmin publish exchange=gym.exchange routing_key=gym.class.enroll payload="{\"messageId\":\"%MESSAGE_ID%\",\"data\":{\"claseId\":1,\"alumno\":\"Idempotency Test\",\"email\":\"idempotency@test.com\"}}" >nul 2>&1
echo ✅ Mensaje 1 publicado
timeout /t 3 /nobreak >nul

REM Mensaje 2 (duplicado - debería ignorarse)
echo [2/3] Publicando mensaje DUPLICADO...
docker exec rabbitmq rabbitmqadmin publish exchange=gym.exchange routing_key=gym.class.enroll payload="{\"messageId\":\"%MESSAGE_ID%\",\"data\":{\"claseId\":1,\"alumno\":\"Idempotency Test\",\"email\":\"idempotency@test.com\"}}" >nul 2>&1
echo ⚠️ Mensaje 2 publicado (duplicado)
timeout /t 3 /nobreak >nul

REM Mensaje 3 (duplicado - debería ignorarse)
echo [3/3] Publicando mensaje DUPLICADO...
docker exec rabbitmq rabbitmqadmin publish exchange=gym.exchange routing_key=gym.class.enroll payload="{\"messageId\":\"%MESSAGE_ID%\",\"data\":{\"claseId\":1,\"alumno\":\"Idempotency Test\",\"email\":\"idempotency@test.com\"}}" >nul 2>&1
echo ⚠️ Mensaje 3 publicado (duplicado)
echo.

REM Esperar procesamiento final
echo ⏳ Esperando procesamiento...
timeout /t 3 /nobreak >nul

echo.
echo ===========================================
echo 📋 VERIFICACIÓN DE LOGS
echo ===========================================
echo.
docker logs ms-inscripciones 2>&1 | findstr /C:"%MESSAGE_ID%"

echo.
echo ===========================================
echo 🔍 VERIFICACIÓN EN REDIS
echo ===========================================
echo.
echo Clave: idempotent:%MESSAGE_ID%
docker exec redis redis-cli GET "idempotent:%MESSAGE_ID%"
echo.
echo TTL (segundos):
docker exec redis redis-cli TTL "idempotent:%MESSAGE_ID%"

echo.
echo ===========================================
echo 💾 VERIFICACIÓN EN BASE DE DATOS
echo ===========================================
echo.
for /f "tokens=*" %%a in ('docker exec postgres-inscripciones psql -U postgres -d gym_inscripciones -t -c "SELECT COUNT(*) FROM inscripciones WHERE message_id = '%MESSAGE_ID%';"') do set COUNT=%%a

REM Limpiar espacios
set COUNT=%COUNT: =%

echo Inscripciones creadas: %COUNT%

if "%COUNT%"=="1" (
  echo ✅ ÉXITO: Solo 1 inscripción creada ^(idempotencia funcionando^)
) else (
  echo ❌ FALLO: Se crearon %COUNT% inscripciones ^(esperaba 1^)
)

echo.
echo ===========================================
echo ✅ PRUEBA COMPLETADA
echo ===========================================
echo.
echo RESUMEN:
echo - Mensajes publicados: 3 ^(mismo messageId^)
echo - Inscripciones esperadas: 1
echo - Inscripciones creadas: %COUNT%
echo.
echo Para ver logs completos:
echo   docker logs ms-inscripciones
echo.
echo Para explorar Redis:
echo   docker exec -it redis redis-cli
echo   ^> KEYS idempotent:*
echo.
echo Para explorar Base de Datos:
echo   docker exec -it postgres-inscripciones psql -U postgres -d gym_inscripciones
echo   ^> SELECT * FROM inscripciones;
echo.
pause
