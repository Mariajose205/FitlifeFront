# FitLife - Script de Prueba de Integración
# PowerShell script para probar la conexión entre frontend y microservicios

Write-Host "========================================" -ForegroundColor Green
Write-Host "  FITLIFE - PRUEBA DE INTEGRACIÓN" -ForegroundColor Green  
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Función para probar endpoints
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$ExpectedStatus = "200"
    )
    
    Write-Host "Probando $Name..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri $Url -Method GET -TimeoutSec 10
        Write-Host "✅ $Name - OK" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ $Name - Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Función para probar POST endpoints
function Test-PostEndpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Body,
        [string]$ExpectedStatus = "200"
    )
    
    Write-Host "Probando $Name (POST)..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri $Url -Method POST -Body $Body -ContentType "application/json" -TimeoutSec 10
        Write-Host "✅ $Name - OK" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ $Name - Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host "Verificando que los microservicios estén corriendo..." -ForegroundColor Cyan
Write-Host ""

# Health checks
$locationHealth = Test-Endpoint "MS-Location Health" "http://localhost:8082/api/locations/health"
$notificacionesHealth = Test-Endpoint "MS-notificaciones Health" "http://localhost:8084/api/notificaciones/health"
$reservasHealth = Test-Endpoint "MS-reservas Health" "http://localhost:8083/api/reservas/hoy"
$pagosHealth = Test-Endpoint "MS-gestionPago Health" "http://localhost:8081/api/pagos/health"

Write-Host ""
Write-Host "Probando endpoints principales..." -ForegroundColor Cyan
Write-Host ""

# Test endpoints principales
$locationsList = Test-Endpoint "MS-Location - Listar" "http://localhost:8082/api/locations"
$locationsActivas = Test-Endpoint "MS-Location - Activas" "http://localhost:8082/api/locations/activas"
$locationsDisponibles = Test-Endpoint "MS-Location - Disponibles" "http://localhost:8082/api/locations/disponibles"

$notificacionesList = Test-Endpoint "MS-notificaciones - Listar" "http://localhost:8084/api/notificaciones"
$notificacionesPendientes = Test-Endpoint "MS-notificaciones - Pendientes" "http://localhost:8084/api/notificaciones/estado/PENDIENTE"

$reservasList = Test-Endpoint "MS-reservas - Listar" "http://localhost:8083/api/reservas"
$reservasHoy = Test-Endpoint "MS-reservas - Hoy" "http://localhost:8083/api/reservas/hoy"
$reservasUsuario = Test-Endpoint "MS-reservas - Usuario 1" "http://localhost:8083/api/reservas/usuario/1"

$pagosList = Test-Endpoint "MS-gestionPago - Listar" "http://localhost:8081/api/pagos"
$pagosUsuario = Test-Endpoint "MS-gestionPago - Usuario 1" "http://localhost:8081/api/pagos/usuario/1"
$tarjetasUsuario = Test-Endpoint "MS-gestionPago - Tarjetas Usuario 1" "http://localhost:8081/api/tarjetas/usuario/1"

Write-Host ""
Write-Host "Probendo endpoints de creación..." -ForegroundColor Cyan
Write-Host ""

# Test POST endpoints
$reservaBody = @{
    idUsuario = 1
    idHorario = 1
    idLocation = 1
    fechaClase = (Get-Date).AddDays(1).ToString("yyyy-MM-ddT10:00:00")
    numeroPersonas = 1
} | ConvertTo-Json

$pagoBody = @{
    idUsuario = 1
    idReserva = 1
    monto = 15000.00
    metodoPago = "TARJETA_CREDITO"
    fechaPago = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
} | ConvertTo-Json

$notificacionBody = @{
    destinatario = "test@fitlife.cl"
    asunto = "Test de Integración"
    mensaje = "Este es un mensaje de prueba automatizado"
    tipoNotificacion = "TEST"
} | ConvertTo-Json

$crearReserva = Test-PostEndpoint "MS-reservas - Crear" "http://localhost:8083/api/reservas" $reservaBody
$crearPago = Test-PostEndpoint "MS-gestionPago - Crear" "http://localhost:8081/api/pagos" $pagoBody
$crearNotificacion = Test-PostEndpoint "MS-notificaciones - Crear" "http://localhost:8084/api/notificaciones" $notificacionBody

Write-Host ""
Write-Host "Verificando frontend..." -ForegroundColor Cyan
Write-Host ""

# Test frontend
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -TimeoutSec 5
    Write-Host "✅ Frontend - OK" -ForegroundColor Green
    $frontendOk = $true
}
catch {
    Write-Host "❌ Frontend - Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Asegúrate de que el frontend esté corriendo con 'npm run dev'" -ForegroundColor Yellow
    $frontendOk = $false
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "RESUMEN DE PRUEBAS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$allTestsPassed = $true

# Health checks
Write-Host "HEALTH CHECKS:" -ForegroundColor Cyan
if ($locationHealth) { Write-Host "✅ MS-Location" -ForegroundColor Green } else { Write-Host "❌ MS-Location" -ForegroundColor Red; $allTestsPassed = $false }
if ($notificacionesHealth) { Write-Host "✅ MS-notificaciones" -ForegroundColor Green } else { Write-Host "❌ MS-notificaciones" -ForegroundColor Red; $allTestsPassed = $false }
if ($reservasHealth) { Write-Host "✅ MS-reservas" -ForegroundColor Green } else { Write-Host "❌ MS-reservas" -ForegroundColor Red; $allTestsPassed = $false }
if ($pagosHealth) { Write-Host "✅ MS-gestionPago" -ForegroundColor Green } else { Write-Host "❌ MS-gestionPago" -ForegroundColor Red; $allTestsPassed = $false }

Write-Host ""
Write-Host "ENDPOINTS PRINCIPALES:" -ForegroundColor Cyan
if ($locationsList -and $locationsActivas) { Write-Host "✅ MS-Location endpoints" -ForegroundColor Green } else { Write-Host "❌ MS-Location endpoints" -ForegroundColor Red; $allTestsPassed = $false }
if ($notificacionesList -and $notificacionesPendientes) { Write-Host "✅ MS-notificaciones endpoints" -ForegroundColor Green } else { Write-Host "❌ MS-notificaciones endpoints" -ForegroundColor Red; $allTestsPassed = $false }
if ($reservasList -and $reservasHoy -and $reservasUsuario) { Write-Host "✅ MS-reservas endpoints" -ForegroundColor Green } else { Write-Host "❌ MS-reservas endpoints" -ForegroundColor Red; $allTestsPassed = $false }
if ($pagosList -and $pagosUsuario -and $tarjetasUsuario) { Write-Host "✅ MS-gestionPago endpoints" -ForegroundColor Green } else { Write-Host "❌ MS-gestionPago endpoints" -ForegroundColor Red; $allTestsPassed = $false }

Write-Host ""
Write-Host "OPERACIONES CRUD:" -ForegroundColor Cyan
if ($crearReserva -and $crearPago -and $crearNotificacion) { Write-Host "✅ Operaciones de creación" -ForegroundColor Green } else { Write-Host "❌ Operaciones de creación" -ForegroundColor Red; $allTestsPassed = $false }

Write-Host ""
Write-Host "FRONTEND:" -ForegroundColor Cyan
if ($frontendOk) { Write-Host "✅ Frontend accesible" -ForegroundColor Green } else { Write-Host "❌ Frontend no accesible" -ForegroundColor Red; $allTestsPassed = $false }

Write-Host ""
if ($allTestsPassed) {
    Write-Host "🎉 ¡TODAS LAS PRUEBAS PASARON!" -ForegroundColor Green
    Write-Host "✅ El sistema está completamente funcional" -ForegroundColor Green
    Write-Host ""
    Write-Host "Puedes acceder a:" -ForegroundColor Cyan
    Write-Host "• Frontend: http://localhost:5173" -ForegroundColor White
    Write-Host "• API Locations: http://localhost:8082/api/locations" -ForegroundColor White
    Write-Host "• API Notificaciones: http://localhost:8084/api/notificaciones" -ForegroundColor White
    Write-Host "• API Reservas: http://localhost:8083/api/reservas" -ForegroundColor White
    Write-Host "• API Pagos: http://localhost:8081/api/pagos" -ForegroundColor White
} else {
    Write-Host "⚠️  ALGUNAS PRUEBAS FALLARON" -ForegroundColor Yellow
    Write-Host "Revisa los errores arriba y asegúrate de que:" -ForegroundColor Yellow
    Write-Host "• Laragon esté corriendo" -ForegroundColor White
    Write-Host "• Las 4 bases de datos existan" -ForegroundColor White
    Write-Host "• Los 4 microservicios estén iniciados" -ForegroundColor White
    Write-Host "• El frontend esté corriendo (npm run dev)" -ForegroundColor White
}

Write-Host ""
Write-Host "Presiona Enter para salir..."
Read-Host
