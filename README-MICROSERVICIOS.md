# 🚀 FitLife - Microservicios Completos

## 📋 Arquitectura General

Se han creado 4 microservicios independientes con sus propias bases de datos:

### 🏢 **MS-Location** (Puerto 8082)
- **Propósito**: Gestión de ubicaciones/gimnasios
- **Base de datos**: `fitlife_locations_db`
- **Endpoints principales**:
  - `GET /api/locations` - Todas las ubicaciones
  - `GET /api/locations/activas` - Ubicaciones activas
  - `GET /api/locations/disponibles` - Con disponibilidad
  - `POST /api/locations` - Crear ubicación
  - `Health check**: `GET /api/locations/health`

### 📧 **MS-notificaciones** (Puerto 8084)
- **Propósito**: Sistema de notificaciones por email
- **Base de datos**: `fitlife_notificaciones_db`
- **Endpoints principales**:
  - `GET /api/notificaciones` - Todas las notificaciones
  - `GET /api/notificaciones/destinatario/{email}` - Por destinatario
  - `POST /api/notificaciones` - Crear notificación
  - `POST /api/notificaciones/{id}/enviar` - Enviar notificación
  - `Health check`: `GET /api/notificaciones/health`

### 📅 **MS-reservas** (Puerto 8083)
- **Propósito**: Gestión de reservas de clases
- **Base de datos**: `fitlife_reservas_db`
- **Endpoints principales**:
  - `GET /api/reservas` - Todas las reservas
  - `GET /api/reservas/usuario/{id}` - Por usuario
  - `GET /api/reservas/hoy` - Reservas de hoy
  - `POST /api/reservas` - Crear reserva
  - `PATCH /api/reservas/{id}/cancelar` - Cancelar reserva

### 💳 **MS-gestionPago** (Puerto 8081)
- **Propósito**: Gestión de pagos y tarjetas
- **Base de datos**: `fitlife_pagos_db`
- **Endpoints principales**:
  - `GET /api/pagos` - Todos los pagos
  - `GET /api/pagos/usuario/{id}` - Por usuario
  - `POST /api/pagos` - Crear pago
  - `GET /api/tarjetas/usuario/{id}` - Tarjetas de usuario
  - `Health check`: `GET /api/pagos/health`

## 🔧 Configuración Rápida

### Requisitos Previos
- ✅ Laragon corriendo (MySQL)
- ✅ JDK 17+
- ✅ Maven 3.6+
- ✅ Node.js 18+

### Instalación Automática
1. **Ejecutar el script de configuración**:
   ```bash
   setup-microservicios.bat
   ```

2. **Iniciar microservicios**:
   ```bash
   iniciar-microservicios.bat
   ```

3. **Iniciar frontend**:
   ```bash
   cd FitlifeFront
   npm install
   npm run dev
   ```

### Configuración Manual
Si prefieres hacerlo manualmente:

#### 1. Crear Bases de Datos
```sql
CREATE DATABASE fitlife_locations_db;
CREATE DATABASE fitlife_notificaciones_db;
CREATE DATABASE fitlife_reservas_db;
CREATE DATABASE fitlife_pagos_db;
```

#### 2. Importar Datos
```bash
mysql -u root fitlife_locations_db < MS-Location/src/main/resources/fitlife_locations_db.sql
mysql -u root fitlife_notificaciones_db < MS-notificaciones/src/main/resources/fitlife_notificaciones_db.sql
mysql -u root fitlife_reservas_db < MS-reservas/src/main/resources/fitlife_reservas_db.sql
mysql -u root fitlife_pagos_db < MS-gestionPago/src/main/resources/fitlife_pagos_db.sql
```

#### 3. Iniciar Microservicios
```bash
# Terminal 1
cd MS-Location && mvn spring-boot:run

# Terminal 2  
cd MS-notificaciones && mvn spring-boot:run

# Terminal 3
cd MS-reservas && mvn spring-boot:run

# Terminal 4
cd MS-gestionPago && mvn spring-boot:run
```

## 🌐 URLs de Acceso

### Frontend
- **Principal**: http://localhost:5173
- **Login**: http://localhost:5173/login

### APIs Backend
- **Locations**: http://localhost:8082/api/locations
- **Notificaciones**: http://localhost:8084/api/notificaciones  
- **Reservas**: http://localhost:8083/api/reservas
- **Pagos**: http://localhost:8081/api/pagos

### Base de Datos
- **phpMyAdmin**: http://localhost/phpmyadmin

## 📊 Datos de Ejemplo

Cada microservicio incluye datos de ejemplo para pruebas:

### Locations (10 registros)
- FitLife Central, Norte, Sur, Vitacura, etc.
- Capacidades entre 20-60 personas
- Distribuidas en Santiago y otras ciudades

### Notificaciones (10 registros)
- Bienvenida, confirmaciones, recordatorios
- Estados: PENDIENTE, ENVIADA, LEIDA
- Ejemplos para admin, trainer, usuario

### Reservas (15 registros)
- Usuarios 1-5 con diferentes tipos de reservas
- Estados: PENDIENTE, ACTIVA, CANCELADA, COMPLETADA
- Fechas pasadas, presentes y futuras

### Pagos (15 registros)
- Múltiples métodos de pago
- Estados: PENDIENTE, COMPLETADO, CANCELADO, FALLIDO
- Tarjetas asociadas con saldos y límites

## 🧪 Pruebas de Integración

### Health Checks
```bash
curl http://localhost:8082/api/locations/health
curl http://localhost:8084/api/notificaciones/health  
curl http://localhost:8083/api/reservas/hoy
curl http://localhost:8081/api/pagos/health
```

### Ejemplos de API Calls
```bash
# Obtener locations activas
curl http://localhost:8082/api/locations/activas

# Crear reserva
curl -X POST http://localhost:8083/api/reservas \
  -H "Content-Type: application/json" \
  -d '{"idUsuario":1,"idHorario":1,"idLocation":1,"fechaClase":"2024-12-31T10:00:00","numeroPersonas":1}'

# Enviar notificación
curl -X POST http://localhost:8084/api/notificaciones/1/enviar

# Procesar pago
curl -X POST http://localhost:8081/api/pagos/1/procesar
```

## 🔄 Flujo Completo de Ejemplo

1. **Usuario** ve locations disponibles en el frontend
2. **Reserva** una clase en una location específica
3. **Pago** procesa el pago con tarjeta guardada
4. **Notificación** envía confirmación por email
5. **Sistema** actualiza capacities y estados

## 🐛 Troubleshooting

### Problemas Comunes

**Error de conexión a BD**:
- Verificar que Laragon esté corriendo
- Confirmar que las 4 BDs existan
- Revisar usuario/password (root/sin password)

**Puertos ocupados**:
```bash
netstat -ano | findstr :8081
netstat -ano | findstr :8082
netstat -ano | findstr :8083
netstat -ano | findstr :8084
```

**Maven compilation errors**:
- Verificar JDK 17+
- Limpiar con `mvn clean install`

**Frontend no conecta**:
- Verificar que los 4 microservicios estén corriendo
- Revisar CORS configuration
- Confirmar URLs en `FitlifeFront/src/services/api.ts`

## 🎯 Arquitectura de BDs Separadas

✅ **Aislamiento total** - Cada servicio tiene su propia BD  
✅ **Escalabilidad independiente** - Cada BD puede escalar por separado  
✅ **Mantenimiento sin impacto** - Reiniciar un servicio no afecta a otros  
✅ **Seguridad mejorada** - Cada servicio accede solo a sus datos  
✅ **Backups específicos** - Estrategias de backup por servicio  

## 📈 Monitoreo

Cada microservicio expone endpoints de health:
- `/health` - Estado general
- Actuator endpoints disponibles
- Logs detallados en consola

## 🚀 Listo para Producción

Esta arquitectura está lista para:
- **Alta disponibilidad**
- **Mantenimiento sin downtime** 
- **Escalabilidad horizontal**
- **Aislamiento de fallos**

---

**¡Todo configurado y listo para usar!** 🎉
