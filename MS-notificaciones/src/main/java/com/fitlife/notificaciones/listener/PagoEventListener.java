package com.fitlife.notificaciones.listener;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fitlife.notificaciones.dto.PagoEventDTO;
import com.fitlife.notificaciones.service.NotificacionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class PagoEventListener {

    private static final Logger logger = LoggerFactory.getLogger(PagoEventListener.class);

    @Autowired
    private NotificacionService notificacionService;

    @Autowired
    private ObjectMapper objectMapper;

    @RabbitListener(queues = "${fitlife.queue.mensaje-notify}")
    public void handlePagoEvent(String message) {
        try {
            logger.info("📧 Recibido evento de pago: {}", message);
            
            // Deserializar el evento
            PagoEventDTO pagoEvent = objectMapper.readValue(message, PagoEventDTO.class);
            
            logger.info("💳 Procesando evento de pago: {}", pagoEvent);
            
            // Procesar el evento según su tipo
            if ("PAGO_EXITOSO".equals(pagoEvent.getTipoEvento())) {
                procesarPagoExitoso(pagoEvent);
            } else if ("PAGO_FALLIDO".equals(pagoEvent.getTipoEvento())) {
                procesarPagoFallido(pagoEvent);
            } else {
                logger.warn("⚠️ Tipo de evento no reconocido: {}", pagoEvent.getTipoEvento());
            }
            
        } catch (Exception e) {
            logger.error("❌ Error procesando evento de pago: {}", message, e);
            // Aquí podrías implementar lógica de reintento o dead letter queue
            throw new RuntimeException("Error procesando evento de pago", e);
        }
    }

    private void procesarPagoExitoso(PagoEventDTO pagoEvent) {
        try {
            logger.info("✅ Procesando pago exitoso para usuario: {}", pagoEvent.getEmailUsuario());
            
            // Crear mapa de datos para el servicio de notificaciones
            Map<String, Object> eventoData = new HashMap<>();
            eventoData.put("tipoEvento", "PAGO_EXITOSO");
            eventoData.put("emailUsuario", pagoEvent.getEmailUsuario());
            eventoData.put("idReserva", pagoEvent.getIdReserva());
            eventoData.put("idPago", pagoEvent.getIdPago());
            eventoData.put("monto", pagoEvent.getMonto());
            eventoData.put("fechaPago", pagoEvent.getFechaPago());
            eventoData.put("codigoAutorizacion", pagoEvent.getCodigoAutorizacion());
            eventoData.put("metodoPago", pagoEvent.getMetodoPago());
            
            // Usar el servicio existente para crear y enviar notificación
            String resultado = notificacionService.procesarEventoReserva(eventoData);
            
            logger.info("📧 Notificación de pago exitoso procesada: {}", resultado);
            
        } catch (Exception e) {
            logger.error("❌ Error procesando pago exitoso: {}", pagoEvent, e);
            throw new RuntimeException("Error procesando pago exitoso", e);
        }
    }

    private void procesarPagoFallido(PagoEventDTO pagoEvent) {
        try {
            logger.info("❌ Procesando pago fallido para usuario: {}", pagoEvent.getEmailUsuario());
            
            // Crear mapa de datos para el servicio de notificaciones
            Map<String, Object> eventoData = new HashMap<>();
            eventoData.put("tipoEvento", "PAGO_FALLIDO");
            eventoData.put("emailUsuario", pagoEvent.getEmailUsuario());
            eventoData.put("idReserva", pagoEvent.getIdReserva());
            eventoData.put("idPago", pagoEvent.getIdPago());
            eventoData.put("monto", pagoEvent.getMonto());
            eventoData.put("fechaPago", pagoEvent.getFechaPago());
            eventoData.put("estadoPago", pagoEvent.getEstadoPago());
            
            // Aquí podrías agregar un nuevo método en NotificacionService para pagos fallidos
            // Por ahora, logeamos el evento
            logger.info("📧 Evento de pago fallido procesado para: {}", pagoEvent.getEmailUsuario());
            
        } catch (Exception e) {
            logger.error("❌ Error procesando pago fallido: {}", pagoEvent, e);
            throw new RuntimeException("Error procesando pago fallido", e);
        }
    }
}
