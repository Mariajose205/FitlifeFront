-- Base de datos para MS-usuarios
CREATE DATABASE IF NOT EXISTS fitlife_usuarios_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE fitlife_usuarios_db;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'TRAINER', 'USER') NOT NULL DEFAULT 'USER',
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_nacimiento DATE,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo),
    INDEX idx_rol_activo (rol, activo),
    INDEX idx_nombre (nombre),
    INDEX idx_fecha_creacion (fecha_creacion)
);

-- Insertar usuarios de ejemplo (contraseñas encriptadas con BCrypt)
-- admin@fitlife.cl / admin123
INSERT INTO usuarios (nombre, email, password, rol, telefono, direccion) VALUES
('Carlos Rodríguez', 'admin@fitlife.cl', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', '+56 9 2468 1357', 'Av. Providencia 1234, Santiago'),
('María González', 'trainer@fitlife.cl', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'TRAINER', '+56 9 8765 4321', 'Av. Las Condes 5678, Santiago'),
('Juan Pérez', 'juan.perez@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', '+56 9 1234 5678', 'Av. Vitacura 9012, Santiago'),
('Ana Silva', 'ana.silva@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', '+56 9 9876 5432', 'Av. La Dehesa 3456, Santiago'),
('Pedro Martínez', 'pedro.martinez@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'USER', '+56 9 5555 1111', 'Av. Kennedy 7890, Santiago');

-- Nota: La contraseña 'admin123' encriptada con BCrypt es: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- En producción, cada usuario debería tener su propia contraseña única y encriptada
