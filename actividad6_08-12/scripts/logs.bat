@echo off
echo ========================================
echo 📋 Ver Logs del Sistema
echo ========================================
echo.
echo Selecciona un servicio:
echo.
echo 1. API Gateway
echo 2. MS Clases
echo 3. MS Inscripciones
echo 4. RabbitMQ
echo 5. Todos los servicios
echo 6. Salir
echo.
set /p option="Opción: "

if "%option%"=="1" docker logs -f api-gateway
if "%option%"=="2" docker logs -f ms-clases
if "%option%"=="3" docker logs -f ms-inscripciones
if "%option%"=="4" docker logs -f rabbitmq
if "%option%"=="5" docker-compose logs -f
if "%option%"=="6" exit /b 0

echo.
echo Presiona Ctrl+C para salir
