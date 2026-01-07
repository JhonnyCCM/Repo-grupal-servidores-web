@echo off
echo ========================================
echo 🏋️ Sistema de Gimnasio - Verificación
echo ========================================
echo.

echo Verificando servicios...
echo.

REM API Gateway
curl -s http://localhost:3000 >nul 2>&1
if errorlevel 1 (
  echo ❌ API Gateway - No disponible
) else (
  echo ✅ API Gateway - http://localhost:3000
)

REM MS Clases
curl -s http://localhost:3001/clases >nul 2>&1
if errorlevel 1 (
  echo ❌ MS Clases - No disponible
) else (
  echo ✅ MS Clases - http://localhost:3001
)

REM MS Inscripciones
curl -s http://localhost:3002/inscripciones >nul 2>&1
if errorlevel 1 (
  echo ❌ MS Inscripciones - No disponible
) else (
  echo ✅ MS Inscripciones - http://localhost:3002
)

REM RabbitMQ
docker exec rabbitmq rabbitmq-diagnostics ping >nul 2>&1
if errorlevel 1 (
  echo ❌ RabbitMQ - No disponible
) else (
  echo ✅ RabbitMQ - http://localhost:15672 ^(guest/guest^)
)

REM Redis
docker exec redis redis-cli ping >nul 2>&1
if errorlevel 1 (
  echo ❌ Redis - No disponible
) else (
  echo ✅ Redis - Disponible
)

REM PostgreSQL Clases
docker exec postgres-clases pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
  echo ❌ PostgreSQL Clases - No disponible
) else (
  echo ✅ PostgreSQL Clases - Puerto 5432
)

REM PostgreSQL Inscripciones
docker exec postgres-inscripciones pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
  echo ❌ PostgreSQL Inscripciones - No disponible
) else (
  echo ✅ PostgreSQL Inscripciones - Puerto 5433
)

echo.
echo ========================================
echo 📊 Estadísticas
echo ========================================
echo.

echo Clases registradas:
docker exec postgres-clases psql -U postgres -d gym_clases -t -c "SELECT COUNT(*) FROM clases;"

echo Inscripciones registradas:
docker exec postgres-inscripciones psql -U postgres -d gym_inscripciones -t -c "SELECT COUNT(*) FROM inscripciones;"

echo Claves idempotentes en Redis:
docker exec redis redis-cli DBSIZE

echo.
echo ========================================
echo ✅ Verificación completada
echo ========================================
echo.
pause
