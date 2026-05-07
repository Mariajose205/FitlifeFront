-- Base de datos para MS-Location
CREATE DATABASE IF NOT EXISTS fitlife_locations_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE fitlife_locations_db;

-- Tabla de locations
CREATE TABLE IF NOT EXISTS locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    capacidad_maxima INT NOT NULL,
    capacidad_actual INT NOT NULL DEFAULT 0,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_ciudad (ciudad),
    INDEX idx_pais (pais),
    INDEX idx_activa (activa),
    INDEX idx_nombre (nombre),
    INDEX idx_capacidad_disponible (capacidad_maxima - capacidad_actual),
    
    CONSTRAINT chk_capacidad_actual CHECK (capacidad_actual >= 0),
    CONSTRAINT chk_capacidad_maxima CHECK (capacidad_maxima > 0),
    CONSTRAINT chk_capacidad_actual_maxima CHECK (capacidad_actual <= capacidad_maxima)
);

-- Datos de ejemplo
INSERT INTO locations (nombre, direccion, ciudad, pais, capacidad_maxima, capacidad_actual, activa) VALUES
('FitLife Central', 'Av. Principal 123', 'Santiago', 'Chile', 50, 25, TRUE),
('FitLife Norte', 'Calle Norte 456', 'Santiago', 'Chile', 30, 15, TRUE),
('FitLife Sur', 'Av. Sur 789', 'Santiago', 'Chile', 40, 35, TRUE),
('FitLife Vitacura', 'Manquehue 012', 'Santiago', 'Chile', 60, 20, TRUE),
('FitLife Las Condes', 'Apoquindo 345', 'Santiago', 'Chile', 45, 10, TRUE),
('FitLife Providencia', 'Providencia 678', 'Santiago', 'Chile', 35, 30, TRUE),
('FitLife Valparaíso', 'Blanco 901', 'Valparaíso', 'Chile', 25, 20, TRUE),
('FitLife Viña', 'Quillota 234', 'Viña del Mar', 'Chile', 40, 25, TRUE),
('FitLife Concepción', 'O''Higgins 567', 'Concepción', 'Chile', 30, 18, TRUE),
('FitLife La Serena', 'Francisco de Aguirre 890', 'La Serena', 'Chile', 20, 12, TRUE);
