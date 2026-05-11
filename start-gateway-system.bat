@echo off
echo ========================================
echo Starting FitLife Gateway System
echo ========================================

echo.
echo 1. Starting MS-Gateway (Port 8080)...
start "MS-Gateway" cmd /k "cd /d MS-gateway && echo Starting Gateway on port 8080... && echo Make sure Maven is installed and Java 17+ is available"

echo.
echo 2. Starting MS-usuarios (Port 8185)...
start "MS-usuarios" cmd /k "cd /d MS-usuarios && echo Starting Usuarios Service on port 8185..."

echo.
echo 3. Starting MS-Location (Port 8082)...
start "MS-Location" cmd /k "cd /d MS-Location && echo Starting Location Service on port 8082..."

echo.
echo 4. Starting MS-reservas (Port 8183)...
start "MS-reservas" cmd /k "cd /d MS-reservas && echo Starting Reservas Service on port 8183..."

echo.
echo 5. Starting MS-notificaciones (Port 8084)...
start "MS-notificaciones" cmd /k "cd /d MS-notificaciones && echo Starting Notificaciones Service on port 8084..."

echo.
echo 6. Starting MS-gestionPago (Port 8186)...
start "MS-gestionPago" cmd /k "cd /d MS-gestionPago && echo Starting Pagos Service on port 8186..."

echo.
echo 7. Starting Frontend (Port 5173)...
start "Frontend" cmd /k "cd /d FitlifeFront-Front/FitlifeFront-Front_version_2.7 && echo Starting Frontend on port 5173... && npm install && npm run dev"

echo.
echo ========================================
echo All services starting...
echo ========================================
echo.
echo Access URLs:
echo - Gateway: http://localhost:8080
echo - Frontend: http://localhost:5173
echo - API Documentation: http://localhost:8080/actuator/gateway/routes
echo.
echo Database: Make sure Laragon is running with fitlife_db database
echo.
pause
