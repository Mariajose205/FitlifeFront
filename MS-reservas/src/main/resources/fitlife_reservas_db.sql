-- Base de datos para MS-reservas
CREATE DATABASE IF NOT EXISTS fitlife_reservas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE fitlife_reservas_db;

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL,
    id_horario BIGINT NOT NULL,
    id_location BIGINT NOT NULL,
    fecha_reserva TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_clase TIMESTAMP NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    numero_personas INT NOT NULL DEFAULT 1,
    monto_total DECIMAL(10,2),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
    fecha_cancelacion TIMESTAMP NULL,
    motivo_cancelacion VARCHAR(500),
    
    INDEX idx_id_usuario (id_usuario),
    INDEX idx_id_horario (id_horario),
    INDEX idx_id_location (id_location),
    INDEX idx_estado (estado),
    INDEX idx_fecha_clase (fecha_clase),
    INDEX idx_fecha_reserva (fecha_reserva),
    INDEX idx_usuario_estado (id_usuario, estado),
    INDEX idx_horario_fecha (id_horario, fecha_clase),
    INDEX idx_location_fecha (id_location, fecha_clase),
    
    CONSTRAINT chk_estado CHECK (estado IN ('PENDIENTE', 'ACTIVA', 'CANCELADA', 'COMPLETADA')),
    CONSTRAINT chk_numero_personas CHECK (numero_personas >= 1 AND numero_personas <= 50),
    CONSTRAINT chk_monto_total CHECK (monto_total IS NULL OR monto_total >= 0)
);

-- Datos de ejemplo
INSERT INTO reservas (id_usuario, id_horario, id_location, fecha_clase, estado, numero_personas, monto_total) VALUES
(1, 1, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), 'ACTIVA', 1, 15000.00),
(1, 2, 2, DATE_ADD(NOW(), INTERVAL 2 DAY), 'ACTIVA', 2, 25000.00),
(2, 3, 1, DATE_ADD(NOW(), INTERVAL 3 DAY), 'PENDIENTE', 1, 12000.00),
(3, 1, 3, DATE_ADD(NOW(), INTERVAL 1 DAY), 'ACTIVA', 1, 18000.00),
(2, 4, 4, DATE_ADD(NOW(), INTERVAL 4 DAY), 'ACTIVA', 3, 45000.00),
(1, 5, 5, DATE_SUB(NOW(), INTERVAL 1 DAY), 'COMPLETADA', 1, 20000.00),
(3, 2, 2, DATE_SUB(NOW(), INTERVAL 2 DAY), 'CANCELADA', 1, 15000.00),
(4, 3, 1, DATE_ADD(NOW(), INTERVAL 5 DAY), 'PENDIENTE', 2, 30000.00),
(2, 1, 3, DATE_ADD(NOW(), INTERVAL 6 DAY), 'ACTIVA', 1, 16000.00),
(5, 4, 4, DATE_SUB(NOW(), INTERVAL 3 DAY), 'COMPLETADA', 2, 35000.00),
(1, 6, 6, DATE_ADD(NOW(), INTERVAL 7 DAY), 'ACTIVA', 1, 22000.00),
(3, 5, 5, DATE_ADD(NOW(), INTERVAL 8 DAY), 'PENDIENTE', 1, 19000.00),
(4, 2, 2, DATE_SUB(NOW(), INTERVAL 1 DAY), 'CANCELADA', 1, 14000.00, NOW(), 'Usuario solicitó cancelación'),
(2, 3, 1, DATE_ADD(NOW(), INTERVAL 1 HOUR), 'ACTIVA', 1, 13000.00),
(5, 1, 4, DATE_ADD(NOW(), INTERVAL 9 DAY), 'PENDIENTE', 2, 28000.00);
