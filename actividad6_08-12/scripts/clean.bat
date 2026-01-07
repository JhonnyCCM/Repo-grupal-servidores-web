@echo off
echo ========================================
echo 🧹 Limpieza del Sistema
echo ========================================
echo.

echo ADVERTENCIA: Esto eliminará TODOS los datos y volúmenes.
echo.
set /p confirm="¿Estás seguro? (S/N): "

if /i not "%confirm%"=="S" (
  echo Operación cancelada.
  exit /b 0
)

echo.
echo Deteniendo contenedores...
docker-compose down

echo.
echo Eliminando volúmenes...
docker-compose down -v

echo.
echo Eliminando imágenes del proyecto...
docker rmi gym-management-api-gateway 2>nul
docker rmi gym-management-ms-clases 2>nul
docker rmi gym-management-ms-inscripciones 2>nul

echo.
echo Limpiando build cache...
docker builder prune -f

echo.
echo ========================================
echo ✅ Limpieza completada
echo ========================================
echo.
echo Para reiniciar el sistema:
echo   docker-compose up --build
echo.
pause
