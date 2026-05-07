@echo off
echo ========================================
echo  FITLIFE - Configuracion de Microservicios
echo ========================================
echo.

echo [1/5] Verificando requisitos...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java no esta instalado o no esta en el PATH
    pause
    exit /b 1
)

mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven no esta instalado o no esta en el PATH
    pause
    exit /b 1
)

echo OK: Java y Maven encontrados
echo.

echo [2/5] Creando bases de datos en Laragon...
echo Por favor, asegurate de que Laragon este corriendo
echo.

mysql -u root -e "CREATE DATABASE IF NOT EXISTS fitlife_locations_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
mysql -u root -e "CREATE DATABASE IF NOT EXISTS fitlife_notificaciones_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
mysql -u root -e "CREATE DATABASE IF NOT EXISTS fitlife_reservas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul
mysql -u root -e "CREATE DATABASE IF NOT EXISTS fitlife_pagos_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>nul

if %errorlevel% neq 0 (
    echo ERROR: No se pudo conectar a MySQL. Asegurate de que Laragon este corriendo
    pause
    exit /b 1
)

echo OK: Bases de datos creadas
echo.

echo [3/5] Importando datos de ejemplo...
mysql -u root fitlife_locations_db < "MS-Location\src\main\resources\fitlife_locations_db.sql" 2>nul
mysql -u root fitlife_notificaciones_db < "MS-notificaciones\src\main\resources\fitlife_notificaciones_db.sql" 2>nul
mysql -u root fitlife_reservas_db < "MS-reservas\src\main\resources\fitlife_reservas_db.sql" 2>nul
mysql -u root fitlife_pagos_db < "MS-gestionPago\src\main\resources\fitlife_pagos_db.sql" 2>nul

echo OK: Datos de ejemplo importados
echo.

echo [4/5] Compilando microservicios...
cd MS-Location
call mvn clean compile -q
cd ..

cd MS-notificaciones
call mvn clean compile -q
cd ..

cd MS-reservas
call mvn clean compile -q
cd ..

cd MS-gestionPago
call mvn clean compile -q
cd ..

echo OK: Microservicios compilados
echo.

echo [5/5] Preparando scripts de inicio...
echo Creando script para iniciar todos los microservicios...

(
echo @echo off
echo echo Iniciando todos los microservicios de FitLife...
echo echo.
echo echo Abriendo 4 terminales para los microservicios...
echo.
echo start "MS-Location" cmd /k "cd /d %~dp0MS-Location && mvn spring-boot:run"
echo timeout /t 3 /nobreak >nul
echo start "MS-notificaciones" cmd /k "cd /d %~dp0MS-notificaciones && mvn spring-boot:run"
echo timeout /t 3 /nobreak >nul
echo start "MS-reservas" cmd /k "cd /d %~dp0MS-reservas && mvn spring-boot:run"
echo timeout /t 3 /nobreak >nul
echo start "MS-gestionPago" cmd /k "cd /d %~dp0MS-gestionPago && mvn spring-boot:run"
echo timeout /t 3 /nobreak >nul
echo.
echo echo Todos los microservicios estan iniciando...
echo echo.
echo echo Espera 30 segundos para que los servicios se inicien completamente
echo timeout /t 30 /nobreak
echo.
echo echo Abriendo navegador para verificar servicios...
echo start http://localhost:8082/api/locations/health
echo start http://localhost:8084/api/notificaciones/health
echo start http://localhost:8083/api/reservas/hoy
echo start http://localhost:8081/api/pagos/health
echo.
echo echo Configuracion completada!
echo echo.
echo echo URLs de los microservicios:
echo echo - MS-Location: http://localhost:8082/api/locations
echo echo - MS-notificaciones: http://localhost:8084/api/notificaciones
echo echo - MS-reservas: http://localhost:8083/api/reservas
echo echo - MS-gestionPago: http://localhost:8081/api/pagos
echo echo.
echo pause
) > iniciar-microservicios.bat

echo OK: Script de inicio creado
echo.

echo ========================================
echo  CONFIGURACION COMPLETADA EXITOSAMENTE
echo ========================================
echo.
echo Bases de datos creadas y con datos de ejemplo
echo Microservicios compilados
echo Script 'iniciar-microservicios.bat' creado
echo.
echo Para iniciar los microservicios, ejecuta:
echo iniciar-microservicios.bat
echo.
echo Luego inicia el frontend con:
echo cd FitlifeFront
echo npm install
echo npm run dev
echo.
echo pause
