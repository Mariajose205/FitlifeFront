package com.fitlife.notificaciones.service;

import com.fitlife.notificaciones.entity.Notificacion;
import com.fitlife.notificaciones.repository.NotificacionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    // CRUD básico
    public Notificacion crearNotificacion(Notificacion notificacion) {
        return notificacionRepository.save(notificacion);
    }

    public Optional<Notificacion> obtenerNotificacionPorId(Long id) {
        return notificacionRepository.findById(id);
    }

    public List<Notificacion> obtenerTodasLasNotificaciones() {
        return notificacionRepository.findAll();
    }

    public Notificacion actualizarNotificacion(Long id, Notificacion notificacionActualizada) {
        return notificacionRepository.findById(id)
                .map(notificacion -> {
                    notificacion.setDestinatario(notificacionActualizada.getDestinatario());
                    notificacion.setAsunto(notificacionActualizada.getAsunto());
                    notificacion.setMensaje(notificacionActualizada.getMensaje());
                    notificacion.setEstado(notificacionActualizada.getEstado());
                    notificacion.setTipoNotificacion(notificacionActualizada.getTipoNotificacion());
                    notificacion.setIdReferencia(notificacionActualizada.getIdReferencia());
                    return notificacionRepository.save(notificacion);
                })
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada con ID: " + id));
    }

    public void eliminarNotificacion(Long id) {
        notificacionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada con ID: " + id));
        notificacionRepository.deleteById(id);
    }

    // Métodos de envío
    public Notificacion enviarNotificacion(Long id) {
        return notificacionRepository.findById(id)
                .map(notificacion -> {
                    if (notificacion.estaEnviada()) {
                        throw new RuntimeException("La notificación ya fue enviada");
                    }
                    
                    // Simular envío de email
                    boolean envioExitoso = simularEnvioEmail(notificacion);
                    
                    if (envioExitoso) {
                        notificacion.marcarComoEnviada();
                    } else {
                        notificacion.marcarComoFallida();
                    }
                    
                    return notificacionRepository.save(notificacion);
                })
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada con ID: " + id));
    }

    // Procesamiento de eventos de reserva
    public String procesarEventoReserva(Map<String, Object> evento) {
        String tipoEvento = (String) evento.get("tipoEvento");
        String emailUsuario = (String) evento.get("emailUsuario");
        Long idReserva = evento.get("idReserva") != null ? ((Number) evento.get("idReserva")).longValue() : null;
        
        Notificacion notificacion = null;
        
        switch (tipoEvento) {
            case "RESERVA_CREADA":
                notificacion = crearNotificacionReservaCreada(emailUsuario, idReserva);
                break;
            case "RESERVA_CANCELADA":
                notificacion = crearNotificacionReservaCancelada(emailUsuario, idReserva);
                break;
            case "RESERVA_RECORDATORIO":
                notificacion = crearNotificacionRecordatorioReserva(emailUsuario, idReserva);
                break;
            case "PAGO_EXITOSO":
                notificacion = crearNotificacionPagoExitoso(emailUsuario, idReserva);
                break;
            default:
                throw new RuntimeException("Tipo de evento no reconocido: " + tipoEvento);
        }
        
        // Enviar automáticamente
        enviarNotificacion(notificacion.getId());
        
        return "Notificación procesada y enviada: " + notificacion.getAsunto();
    }

    // Métodos de búsqueda
    public List<Notificacion> obtenerNotificacionesPorDestinatario(String email) {
        return notificacionRepository.findByDestinatario(email);
    }

    public List<Notificacion> obtenerNotificacionesPorEstado(String estado) {
        Notificacion.EstadoNotificacion estadoEnum;
        try {
            estadoEnum = Notificacion.EstadoNotificacion.valueOf(estado.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado no válido: " + estado);
        }
        return notificacionRepository.findByEstado(estadoEnum);
    }

    public List<Notificacion> obtenerNotificacionesPorTipo(String tipo) {
        return notificacionRepository.findByTipoNotificacion(tipo);
    }

    public List<Notificacion> obtenerNotificacionesPorReferencia(Long idReferencia) {
        return notificacionRepository.findByIdReferencia(idReferencia);
    }

    public List<Notificacion> buscarNotificacionesPorTermino(String termino) {
        return notificacionRepository.buscarPorTermino(termino);
    }

    public List<Notificacion> obtenerNotificacionesNoLeidas(String email) {
        return notificacionRepository.findNotificacionesNoLeidasPorDestinatario(email);
    }

    // Métodos de mantenimiento
    public List<Notificacion> obtenerNotificacionesPendientesVencidas() {
        LocalDateTime fechaLimite = LocalDateTime.now().minusMinutes(30); // 30 minutos de vencimiento
        return notificacionRepository.findNotificacionesPendientesVencidas(fechaLimite);
    }

    public long contarNotificacionesPorEstado(String estado) {
        Notificacion.EstadoNotificacion estadoEnum;
        try {
            estadoEnum = Notificacion.EstadoNotificacion.valueOf(estado.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado no válido: " + estado);
        }
        return notificacionRepository.countByEstado(estadoEnum);
    }

    // Métodos de utilidad
    private boolean simularEnvioEmail(Notificacion notificacion) {
        // Simulación de envío de email
        // En un entorno real, aquí se usaría JavaMailSender
        try {
            // Simular delay de red
            Thread.sleep(100);
            return true; // Simular envío exitoso
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }

    private Notificacion crearNotificacionReservaCreada(String email, Long idReserva) {
        String asunto = "Confirmación de Reserva - FitLife";
        String mensaje = String.format(
            "Tu reserva ha sido creada exitosamente.\n\n" +
            "ID de Reserva: %d\n" +
            "Fecha: %s\n\n" +
            "Gracias por elegir FitLife!",
            idReserva, LocalDateTime.now().toLocalDate()
        );
        
        Notificacion notificacion = new Notificacion(email, asunto, mensaje);
        notificacion.setTipoNotificacion("RESERVA_CREADA");
        notificacion.setIdReferencia(idReserva);
        
        return crearNotificacion(notificacion);
    }

    private Notificacion crearNotificacionReservaCancelada(String email, Long idReserva) {
        String asunto = "Cancelación de Reserva - FitLife";
        String mensaje = String.format(
            "Tu reserva ha sido cancelada.\n\n" +
            "ID de Reserva: %d\n" +
            "Fecha de cancelación: %s\n\n" +
            "Si no realizaste esta acción, por favor contacta a soporte.",
            idReserva, LocalDateTime.now().toLocalDate()
        );
        
        Notificacion notificacion = new Notificacion(email, asunto, mensaje);
        notificacion.setTipoNotificacion("RESERVA_CANCELADA");
        notificacion.setIdReferencia(idReserva);
        
        return crearNotificacion(notificacion);
    }

    private Notificacion crearNotificacionRecordatorioReserva(String email, Long idReserva) {
        String asunto = "Recordatorio de Reserva - FitLife";
        String mensaje = String.format(
            "Recordatorio: Tienes una reserva programada.\n\n" +
            "ID de Reserva: %d\n" +
            "Fecha: %s\n\n" +
            "¡Te esperamos en FitLife!",
            idReserva, LocalDateTime.now().plusDays(1).toLocalDate()
        );
        
        Notificacion notificacion = new Notificacion(email, asunto, mensaje);
        notificacion.setTipoNotificacion("RESERVA_RECORDATORIO");
        notificacion.setIdReferencia(idReserva);
        
        return crearNotificacion(notificacion);
    }

    private Notificacion crearNotificacionPagoExitoso(String email, Long idReserva) {
        String asunto = "Confirmación de Pago - FitLife";
        String mensaje = String.format(
            "Tu pago ha sido procesado exitosamente.\n\n" +
            "ID de Reserva asociada: %d\n" +
            "Fecha de pago: %s\n\n" +
            "Gracias por tu confianza en FitLife!",
            idReserva, LocalDateTime.now().toLocalDate()
        );
        
        Notificacion notificacion = new Notificacion(email, asunto, mensaje);
        notificacion.setTipoNotificacion("PAGO_EXITOSO");
        notificacion.setIdReferencia(idReserva);
        
        return crearNotificacion(notificacion);
    }

    // Estadísticas
    public Map<String, Long> obtenerEstadisticasPorEstado() {
        List<Object[]> resultados = notificacionRepository.countByTipoNotificacion();
        return resultados.stream()
                .collect(Collectors.toMap(
                    resultado -> (String) resultado[0],
                    resultado -> (Long) resultado[1]
                ));
    }
}
