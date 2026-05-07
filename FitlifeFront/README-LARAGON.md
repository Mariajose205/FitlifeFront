# 🚀 FitLife - Configuración con Laragon

## 📋 Requisitos Previos
- Laragon instalado y corriendo
- JDK 17 o superior
- Maven 3.6+
- Node.js 18+

## 🔧 Pasos para Configurar

### 1. Configurar Base de Datos en Laragon

1. **Inicia Laragon**
2. **Ve a phpMyAdmin**: http://localhost/phpmyadmin
3. **Crea la base de datos**:
   - Nombre: `fitlife_db`
   - Cotejamiento: `utf8mb4_unicode_ci`
4. **Importa el script SQL**:
   - Abre el archivo: `Back/fitlife_database.sql`
   - Copia y pega el SQL en phpMyAdmin
   - Ejecuta el script

### 2. Iniciar los Microservicios

Abre 4 terminales y ejecuta:

**Terminal 1 - Microservicio de Pagos (8081):**
```bash
cd Back/MS-gestionPago-master
mvn spring-boot:run
```

**Terminal 2 - Microservicio de Locations (8082):**
```bash
cd Back/MS-locacion-master
mvn spring-boot:run
```

**Terminal 3 - Microservicio de Reservas (8083):**
```bash
cd Back/MS-reservas-master
mvn spring-boot:run
```

**Terminal 4 - Microservicio de Notificaciones (8084):**
```bash
cd Back/MS-notificaciones-master
mvn spring-boot:run
```

### 3. Iniciar el Frontend

**Terminal 5 - Frontend Vite:**
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
- **Base de datos**: fitlife_db
- **Usuario**: root
- **Contraseña**: (vacía)

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

### Ejemplos de Endpoints:
```http
GET http://localhost:8082/api/locations
POST http://localhost:8082/api/locations
GET http://localhost:8081/api/pagos/usuario/1
POST http://localhost:8083/api/reservas
```

## 🔍 Verificación

### 1. Base de Datos:
```sql
-- Verificar tablas
SHOW TABLES;

-- Verificar datos
SELECT * FROM location WHERE activa = TRUE;
SELECT * FROM pago;
SELECT * FROM reserva;
SELECT * FROM notificacion;
```

### 2. Microservicios:
- Cada servicio debe mostrar "Started [nombre-servicio]"
- Los logs deben mostrar conexión exitosa a MySQL
- Health checks deben responder 200 OK

### 3. Frontend:
- Debe cargar en http://localhost:5173
- Login debe funcionar y redirigir según rol
- Dashboards deben mostrar datos reales

## 🐛 Troubleshooting

### Problemas Comunes:

1. **Error de conexión a MySQL**:
   - Verifica que Laragon esté corriendo
   - Confirma que la base de datos `fitlife_db` existe
   - Revisa que el usuario root no tenga contraseña

2. **Puertos en uso**:
   ```bash
   # Ver qué usa el puerto
   netstat -ano | findstr :8081
   # Cambiar puerto en application.yml si es necesario
   ```

3. **Error de compilación Maven**:
   ```bash
   # Limpiar y recompilar
   mvn clean install
   # O forzar descarga de dependencias
   mvn clean install -U
   ```

4. **Frontend no conecta con APIs**:
   - Verifica que los microservicios estén corriendo
   - Revisa configuración CORS en los controladores
   - Confirma puertos correctos en api.ts

## 📊 Estructura de Datos

El sistema incluye datos iniciales:
- **5 sedes** de gimnasio en Santiago
- **5 pagos** de ejemplo
- **5 reservas** de ejemplo  
- **5 notificaciones** de ejemplo

## 🔄 Flujo Completo

1. **Laragon** → MySQL corriendo en localhost:3306
2. **Microservicios** → Se conectan a MySQL y exponen APIs
3. **Frontend** → Consume las APIs y muestra dashboards
4. **Usuario** → Inicia sesión y es redirigido según rol

## 🚀 Listo para Usar

Una vez que todos los servicios estén corriendo:
1. Abre http://localhost:5173
2. Inicia sesión con cualquiera de los usuarios de prueba
3. Explora los dashboards con datos reales
4. Prueba las APIs con Postman

¡Todo configurado para desarrollo local con Laragon!
