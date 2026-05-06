# 🚀 FitLife - Configuración con Laragon (BDs Separadas)

## 📋 Requisitos Previos
- Laragon instalado y corriendo
- JDK 17 o superior
- Maven 3.6+
- Node.js 18+

## 🔧 Paso 1: Crear Bases de Datos en Laragon

### 1.1 Abrir phpMyAdmin
```
http://localhost/phpmyadmin
```

### 1.2 Crear las 4 bases de datos:
```
1. fitlife_pagos_db
2. fitlife_locations_db
3. fitlife_reservas_db
4. fitlife_notificaciones_db
```

Todas con cotejamiento: `utf8mb4_unicode_ci`

### 1.3 Importar Scripts SQL
Importa cada archivo en su respectiva base de datos:

- **fitlife_pagos_db** → Importa `Back/fitlife_pagos_db.sql`
- **fitlife_locations_db** → Importa `Back/fitlife_locations_db.sql`
- **fitlife_reservas_db** → Importa `Back/fitlife_reservas_db.sql`
- **fitlife_notificaciones_db** → Importa `Back/fitlife_notificaciones_db.sql`

## 🔧 Paso 2: Iniciar Microservicios

### Terminal 1 - Microservicio de Pagos (8081)
```bash
cd Back/MS-gestionPago-master
mvn spring-boot:run
```

### Terminal 2 - Microservicio de Locations (8082)
```bash
cd Back/MS-locacion-master
mvn spring-boot:run
```

### Terminal 3 - Microservicio de Reservas (8083)
```bash
cd Back/MS-reservas-master
mvn spring-boot:run
```

### Terminal 4 - Microservicio de Notificaciones (8084)
```bash
cd Back/MS-notificaciones-master
mvn spring-boot:run
```

## 🔧 Paso 3: Iniciar Frontend

### Terminal 5 - Frontend Vite
```bash
cd FitlifeFront
npm install
npm run dev
```

## 🌐 URLs de Acceso

### Frontend:
- **Principal**: http://localhost:5173
- **Login**: http://localhost:5173/login
- **Admin Dashboard**: http://localhost:5173/admin-dashboard
- **Trainer Dashboard**: http://localhost:5173/trainer-dashboard

### APIs Backend:
- **Pagos**: http://localhost:8081/api/pagos
- **Locations**: http://localhost:8082/api/locations
- **Reservas**: http://localhost:8083/api/reservas
- **Notificaciones**: http://localhost:8084/api/notificaciones

### Base de Datos:
- **phpMyAdmin**: http://localhost/phpmyadmin
- **4 BDs separadas** con sus propios datos

## 👤 Usuarios para Prueba

| Rol | Email | Contraseña | Redirección |
|-----|-------|------------|-------------|
| Admin | admin@fitlife.cl | password123 | /admin-dashboard |
| Trainer | trainer@fitlife.cl | password123 | /trainer-dashboard |
| User | usuario@gmail.com | password123 | /dashboard |

## 🧪 Probar con Postman

### Health Checks:
```http
GET http://localhost:8081/api/pagos/health
GET http://localhost:8082/api/locations/estadisticas/activas/count
GET http://localhost:8084/api/notificaciones/health
```

### Endpoints por Servicio:
```http
# Pagos (fitlife_pagos_db)
GET http://localhost:8081/api/pagos
POST http://localhost:8081/api/pagos
GET http://localhost:8081/api/pagos/usuario/1

# Locations (fitlife_locations_db)
GET http://localhost:8082/api/locations
GET http://localhost:8082/api/locations/activas
POST http://localhost:8082/api/locations

# Reservas (fitlife_reservas_db)
GET http://localhost:8083/api/reservas
GET http://localhost:8083/api/reservas/usuario/1
POST http://localhost:8083/api/reservas

# Notificaciones (fitlife_notificaciones_db)
GET http://localhost:8084/api/notificaciones
POST http://localhost:8084/api/notificaciones
POST http://localhost:8084/api/notificaciones/{id}/enviar
```

## 🔍 Verificación

### Verificar Bases de Datos:
```sql
-- En cada BD, ejecutar:
SHOW TABLES;
SELECT COUNT(*) as total FROM [nombre_tabla];
```

### Verificar Microservicios:
- Cada servicio debe mostrar "Started [nombre-servicio]"
- Los logs deben mostrar conexión exitosa a su BD específica
- Health checks deben responder 200 OK

### Verificar Frontend:
- Debe cargar en http://localhost:5173
- Login debe funcionar y redirigir según rol
- Dashboards deben mostrar datos reales

## 🐛 Troubleshooting

### Problemas Comunes:

1. **Error de conexión a BD específica**:
   ```bash
   # Verificar que la BD exista
   mysql -u root -e "SHOW DATABASES LIKE 'fitlife_%';"
   
   # Verificar usuario y permisos
   mysql -u root -e "SELECT User, Host FROM mysql.user;"
   ```

2. **Un microservicio no inicia**:
   ```bash
   # Verificar puerto
   netstat -ano | findstr :8081
   
   # Revisar logs del servicio específico
   # En la terminal donde corre el servicio
   ```

3. **Datos no aparecen en frontend**:
   - Verificar que el microservicio correspondiente esté corriendo
   - Revisar configuración CORS en controladores
   - Confirmar que la BD tenga datos

4. **Importación SQL falla**:
   ```sql
   -- Verificar que la BD exista primero
   CREATE DATABASE IF NOT EXISTS fitlife_pagos_db;
   
   -- Luego importar el contenido
   USE fitlife_pagos_db;
   -- pegar el resto del script
   ```

## 📊 Arquitectura de BDs Separadas

```
┌─────────────────┐    ┌─────────────────┐
│  MS-gestionPago │    │ MS-notificaciones│
│   (8081)        │    │   (8084)        │
│                 │    │                 │
│ fitlife_pagos_db │    │fitlife_notif_db │
└─────────────────┘    └─────────────────┘

┌─────────────────┐    ┌─────────────────┐
│ MS-locacion     │    │ MS-reservas     │
│   (8082)        │    │   (8083)        │
│                 │    │                 │
│fitlife_loc_db    │    │fitlife_res_db   │
└─────────────────┘    └─────────────────┘
```

## 🔄 Ventajas de BDs Separadas

✅ **Aislamiento total** - Si una BD falla, las otras siguen funcionando  
✅ **Escalabilidad independiente** - Cada microservicio puede escalar su BD  
✅ **Mantenimiento sin impacto** - Puedes reiniciar una BD sin afectar otras  
✅ **Seguridad mejorada** - Cada servicio tiene acceso solo a sus datos  
✅ **Backups específicos** - Estrategias de backup por servicio  

## 🚀 Flujo Completo

1. **Laragon** → 4 BDs MySQL separadas corriendo
2. **Microservicios** → Cada uno conecta a su BD específica
3. **Frontend** → Consume las APIs independientes
4. **Usuario** → Experimenta un sistema unificado pero con backend resiliente

## 🎯 Listo para Producción

Esta arquitectura con BDs separadas es ideal para:
- **Alta disponibilidad**
- **Mantenimiento sin downtime**
- **Escalabilidad horizontal**
- **Aislamiento de fallos**

¡Todo configurado para desarrollo local con máxima resiliencia!
