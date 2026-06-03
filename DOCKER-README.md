# Dockerización de FitLife

Este proyecto contiene la configuración completa para dockerizar los microservicios y el frontend de FitLife.

## Servicios Dockerizados

### Microservicios (Spring Boot 3.2.0 - Java 17)
1. **ms-gateway** (puerto 8080) - API Gateway
2. **ms-usuarios** (puerto 8081) - Gestión de usuarios
3. **ms-reservas** (puerto 8082) - Gestión de reservas
4. **ms-gestion-pago** (puerto 8083) - Gestión de pagos
5. **ms-notificaciones** (puerto 8084) - Gestión de notificaciones
6. **ms-location** (puerto 8085) - Gestión de ubicaciones

### Frontend
- **fitlife-frontend** (puerto 3000) - React + Vite + TypeScript + TailwindCSS

## Estructura de Archivos

```
FitlifeFront/
├── MS-gateway/
│   └── Dockerfile
├── MS-usuarios/
│   └── Dockerfile
├── MS-reservas/
│   └── Dockerfile
├── MS-gestionPago/
│   └── Dockerfile
├── MS-notificaciones/
│   └── Dockerfile
├── MS-Location/
│   └── Dockerfile
├── FitlifeFront-Front/
│   └── FitlifeFront-Front_version_2.7/
│       ├── Dockerfile
│       └── nginx.conf
├── docker-compose.yml
├── build-and-push.ps1  (Windows)
└── build-and-push.sh   (Linux/Mac)
```

## Uso Local con Docker Compose

### Levantar todos los servicios
```bash
docker-compose up -d
```

### Ver logs
```bash
docker-compose logs -f
```

### Detener servicios
```bash
docker-compose down
```

### Reconstruir servicios
```bash
docker-compose up -d --build
```

## Build y Push a Docker Registry

### Windows (PowerShell)
```powershell
.\build-and-push.ps1 -Registry "tu-registry.com" -Version "1.0.0"
```

### Linux/Mac (Bash)
```bash
chmod +x build-and-push.sh
./build-and-push.sh tu-registry.com 1.0.0
```

### Ejemplo con Docker Hub
```powershell
# Primero login
docker login

# Luego ejecutar el script
.\build-and-push.ps1 -Registry "tu-usuario" -Version "1.0.0"
```

Esto creará las imágenes con el formato:
- `tu-usuario/fitlife-ms-gateway:1.0.0`
- `tu-usuario/fitlife-ms-usuarios:1.0.0`
- `tu-usuario/fitlife-ms-reservas:1.0.0`
- `tu-usuario/fitlife-ms-gestion-pago:1.0.0`
- `tu-usuario/fitlife-ms-notificaciones:1.0.0`
- `tu-usuario/fitlife-ms-location:1.0.0`
- `tu-usuario/fitlife-frontend:1.0.0`

## Build Individual de Servicios

### Microservicios
```bash
# Ejemplo para ms-gateway
cd MS-gateway
docker build -t fitlife-ms-gateway:latest .
```

### Frontend
```bash
cd FitlifeFront-Front/FitlifeFront-Front_version_2.7
docker build -t fitlife-frontend:latest .
```

## Configuración de Puertos

| Servicio | Puerto Host | Puerto Container |
|----------|-------------|-------------------|
| ms-gateway | 8080 | 8080 |
| ms-usuarios | 8081 | 8081 |
| ms-reservas | 8082 | 8082 |
| ms-gestion-pago | 8083 | 8083 |
| ms-notificaciones | 8084 | 8084 |
| ms-location | 8085 | 8085 |
| frontend | 3000 | 80 |

## Notas Importantes

1. Los Dockerfiles usan multi-stage build para optimizar el tamaño de las imágenes
2. Los microservicios usan Maven para el build y Eclipse Temurin JRE 17 Alpine para ejecución
3. El frontend usa Node.js 18 para el build y Nginx Alpine para servir los archivos estáticos
4. El nginx.conf del frontend está configurado para hacer proxy de las llamadas API al gateway
5. Todos los servicios están en una red bridge llamada `fitlife-network`

## Requisitos Previos

- Docker instalado (versión 20.10+)
- Docker Compose instalado
- Para push a registry: cuenta en Docker Hub u otro registry
