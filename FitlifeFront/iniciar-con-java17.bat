@echo off
echo Iniciando microservicios con Java 17...
echo.

echo [1/4] Configurando Java 17...
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot
set PATH=%JAVA_HOME%\bin;%PATH%
echo Java configurado: 
java -version

echo.
echo [2/4] Iniciando MS-gestionPago (puerto 8081)...
start "MS-gestionPago" cmd /k "cd /d %~dp0MS-gestionPago && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

echo [3/4] Iniciando MS-Location (puerto 8082)...
start "MS-Location" cmd /k "cd /d %~dp0MS-Location && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

echo [4/4] Iniciando MS-reservas (puerto 8083)...
start "MS-reservas" cmd /k "cd /d %~dp0MS-reservas && mvn spring-boot:run"
timeout /t 5 /nobreak >nul

echo [5/4] Iniciando MS-notificaciones (puerto 8084)...
start "MS-notificaciones" cmd /k "cd /d %~dp0MS-notificaciones && mvn spring-boot:run"

echo.
echo Todos los microservicios están iniciando...
echo.
echo Espera 30 segundos para que los servicios se inicien completamente
timeout /t 30 /nobreak

echo.
echo Abriendo navegador para verificar servicios...
start http://localhost:8082/api/locations/health
start http://localhost:8084/api/notificaciones/health
start http://localhost:8083/api/reservas/hoy
start http://localhost:8081/api/pagos/health

echo.
echo ========================================
echo  MICROSERVICIOS INICIADOS
echo ========================================
echo.
echo URLs de los microservicios:
echo - MS-Location: http://localhost:8082/api/locations
echo - MS-notificaciones: http://localhost:8084/api/notificaciones
echo - MS-reservas: http://localhost:8083/api/reservas
echo - MS-gestionPago: http://localhost:8081/api/pagos
echo.
echo Presiona Enter para salir...
pause
