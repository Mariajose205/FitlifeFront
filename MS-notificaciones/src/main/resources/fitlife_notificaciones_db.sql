-- Base de datos para MS-notificaciones
CREATE DATABASE IF NOT EXISTS fitlife_notificaciones_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE fitlife_notificaciones_db;

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    destinatario VARCHAR(100) NOT NULL,
    asunto VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_envio TIMESTAMP NULL,
    fecha_lectura TIMESTAMP NULL,
    tipo_notificacion VARCHAR(50),
    id_referencia BIGINT,
    
    INDEX idx_destinatario (destinatario),
    INDEX idx_estado (estado),
    INDEX idx_tipo_notificacion (tipo_notificacion),
    INDEX idx_id_referencia (id_referencia),
    INDEX idx_fecha_creacion (fecha_creacion),
    INDEX idx_fecha_envio (fecha_envio),
    
    CONSTRAINT chk_estado CHECK (estado IN ('PENDIENTE', 'ENVIADA', 'LEIDA', 'FALLIDA'))
);

-- Datos de ejemplo
INSERT INTO notificaciones (destinatario, asunto, mensaje, estado, tipo_notificacion, id_referencia, fecha_envio) VALUES
('usuario@gmail.com', 'Bienvenido a FitLife', 'Gracias por registrarte en FitLife. Tu cuenta ha sido creada exitosamente.', 'ENVIADA', 'BIENVENIDA', 1, NOW()),
('trainer@fitlife.cl', 'Nueva reserva asignada', 'Tienes una nueva reserva asignada para el día de hoy a las 14:00.', 'ENVIADA', 'RESERVA_ASIGNADA', 2, NOW()),
('admin@fitlife.cl', 'Reporte diario', 'Se han procesado 25 reservas hoy y 18 pagos exitosos.', 'LEIDA', 'REPORTE', 3, NOW()),
('usuario@gmail.com', 'Confirmación de pago', 'Tu pago por la reserva #456 ha sido procesado exitosamente.', 'ENVIADA', 'PAGO_EXITOSO', 456, NOW()),
('trainer@fitlife.cl', 'Recordatorio de clase', 'Recuerda que tienes una clase programada mañana a las 10:00 en FitLife Central.', 'PENDIENTE', 'RECORDATORIO', 789, NULL),
('usuario@gmail.com', 'Cancelación de reserva', 'Tu reserva #123 ha sido cancelada según tu solicitud.', 'ENVIADA', 'RESERVA_CANCELADA', 123, NOW()),
('admin@fitlife.cl', 'Alerta de sistema', 'El microservicio de pagos ha presentado intermitencia en los últimos 5 minutos.', 'PENDIENTE', 'ALERTA_SISTEMA', 999, NULL),
('usuario@gmail.com', 'Promoción especial', '¡20% de descuento en tu próxima reserva! Usa el código FIT20.', 'ENVIADA', 'PROMOCION', 555, NOW()),
('trainer@fitlife.cl', 'Evaluación de desempeño', 'Por favor completa tu evaluación de desempeño mensual.', 'LEIDA', 'EVALUACION', 777, NOW()),
('usuario@gmail.com', 'Recordatorio de pago', 'Tu membresía mensual vence en 3 días. Renueva ahora para evitar interrupciones.', 'PENDIENTE', 'RECORDATORIO_PAGO', 333, NULL);
