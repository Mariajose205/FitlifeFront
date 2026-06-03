$Registry = $args[0]
$Version = $args[1]

if (-not $Registry) {
    Write-Host "Error: Se requiere el nombre del registry"
    Write-Host "Uso: .\build-and-push.ps1 tu-registry.com [version]"
    exit 1
}

if (-not $Version) {
    $Version = "latest"
}

Write-Host "Registry: $Registry"
Write-Host "Version: $Version"

$services = @(
    @("MS-gateway", "fitlife-ms-gateway"),
    @("MS-usuarios", "fitlife-ms-usuarios"),
    @("MS-reservas", "fitlife-ms-reservas"),
    @("MS-gestionPago", "fitlife-ms-gestion-pago"),
    @("MS-notificaciones", "fitlife-ms-notificaciones"),
    @("MS-Location", "fitlife-ms-location"),
    @("FitlifeFront-Front\FitlifeFront-Front_version_2.7", "fitlife-frontend")
)

foreach ($service in $services) {
    $path = $service[0]
    $imageName = $service[1]
    $fullImageName = "${Registry}/${imageName}:${Version}"
    
    Write-Host "Construyendo $imageName..." -ForegroundColor Cyan
    docker build -t $fullImageName $path
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Haciendo push de $fullImageName..." -ForegroundColor Cyan
        docker push $fullImageName
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ $imageName completado" -ForegroundColor Green
        } else {
            Write-Host "Error al hacer push de $imageName" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "Error al construir $imageName" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`n✓ Todas las imágenes construidas y push exitosamente!" -ForegroundColor Green
