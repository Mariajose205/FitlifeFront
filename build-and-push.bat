@echo off
set REGISTRY=%1
set VERSION=%2

if "%REGISTRY%"=="" (
    echo Error: Se requiere el nombre del registry
    echo Uso: build-and-push.bat tu-registry.com [version]
    exit /b 1
)

if "%VERSION%"=="" (
    set VERSION=latest
)

echo Registry: %REGISTRY%
echo Version: %VERSION%

echo.
echo Construyendo fitlife-ms-gateway...
docker build -t %REGISTRY%/fitlife-ms-gateway:%VERSION% MS-gateway
docker push %REGISTRY%/fitlife-ms-gateway:%VERSION%

echo.
echo Construyendo fitlife-ms-usuarios...
docker build -t %REGISTRY%/fitlife-ms-usuarios:%VERSION% MS-usuarios
docker push %REGISTRY%/fitlife-ms-usuarios:%VERSION%

echo.
echo Construyendo fitlife-ms-reservas...
docker build -t %REGISTRY%/fitlife-ms-reservas:%VERSION% MS-reservas
docker push %REGISTRY%/fitlife-ms-reservas:%VERSION%

echo.
echo Construyendo fitlife-ms-gestion-pago...
docker build -t %REGISTRY%/fitlife-ms-gestion-pago:%VERSION% MS-gestionPago
docker push %REGISTRY%/fitlife-ms-gestion-pago:%VERSION%

echo.
echo Construyendo fitlife-ms-notificaciones...
docker build -t %REGISTRY%/fitlife-ms-notificaciones:%VERSION% MS-notificaciones
docker push %REGISTRY%/fitlife-ms-notificaciones:%VERSION%

echo.
echo Construyendo fitlife-ms-location...
docker build -t %REGISTRY%/fitlife-ms-location:%VERSION% MS-Location
docker push %REGISTRY%/fitlife-ms-location:%VERSION%

echo.
echo Construyendo fitlife-frontend...
docker build -t %REGISTRY%/fitlife-frontend:%VERSION% FitlifeFront-Front\FitlifeFront-Front_version_2.7
docker push %REGISTRY%/fitlife-frontend:%VERSION%

echo.
echo Todas las imagenes construidas y push exitosamente!
