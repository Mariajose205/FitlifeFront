package com.fitlife.reservas.service;

import com.fitlife.reservas.entity.Reserva;
import com.fitlife.reservas.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    // CRUD básico
    public Reserva crearReserva(Reserva reserva) {
        // Validar que la fecha de clase sea futura
        if (reserva.getFechaClase().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("La fecha de clase no puede ser en el pasado");
        }
        
        // Establecer estado inicial
        reserva.setEstado(Reserva.EstadoReserva.PENDIENTE);
        
        return reservaRepository.save(reserva);
    }

    public Optional<Reserva> obtenerReservaPorId(Long id) {
        return reservaRepository.findById(id);
    }

    public List<Reserva> obtenerTodasLasReservas() {
        return reservaRepository.findAll();
    }

    public Reserva actualizarReserva(Long id, Reserva reservaActualizada) {
        return reservaRepository.findById(id)
                .map(reserva -> {
                    reserva.setIdUsuario(reservaActualizada.getIdUsuario());
                    reserva.setIdHorario(reservaActualizada.getIdHorario());
                    reserva.setIdLocation(reservaActualizada.getIdLocation());
                    reserva.setFechaClase(reservaActualizada.getFechaClase());
                    reserva.setNumeroPersonas(reservaActualizada.getNumeroPersonas());
                    reserva.setMontoTotal(reservaActualizada.getMontoTotal());
                    reserva.setEstado(reservaActualizada.getEstado());
                    return reservaRepository.save(reserva);
                })
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));
    }

    public void eliminarReserva(Long id) {
        reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));
        reservaRepository.deleteById(id);
    }

    // Métodos de gestión de reservas
    public Reserva cancelarReserva(Long id, String motivo) {
        return reservaRepository.findById(id)
                .map(reserva -> {
                    if (!reserva.puedeCancelarse()) {
                        throw new RuntimeException("Esta reserva no puede ser cancelada. Debe cancelarse con al menos 1 hora de anticipación");
                    }
                    reserva.cancelar(motivo);
                    return reservaRepository.save(reserva);
                })
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));
    }

    public Reserva confirmarReserva(Long id) {
        return reservaRepository.findById(id)
                .map(reserva -> {
                    if (!reserva.estaPendiente()) {
                        throw new RuntimeException("Solo se pueden confirmar reservas en estado PENDIENTE");
                    }
                    reserva.confirmar();
                    return reservaRepository.save(reserva);
                })
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));
    }

    public Reserva completarReserva(Long id) {
        return reservaRepository.findById(id)
                .map(reserva -> {
                    if (!reserva.estaActiva()) {
                        throw new RuntimeException("Solo se pueden completar reservas en estado ACTIVA");
                    }
                    reserva.completar();
                    return reservaRepository.save(reserva);
                })
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada con ID: " + id));
    }

    // Métodos de búsqueda
    public List<Reserva> obtenerReservasPorUsuario(Long idUsuario) {
        return reservaRepository.findByIdUsuario(idUsuario);
    }

    public List<Reserva> obtenerReservasPorHorario(Long idHorario) {
        return reservaRepository.findByIdHorario(idHorario);
    }

    public List<Reserva> obtenerReservasPorLocation(Long idLocation) {
        return reservaRepository.findByIdLocation(idLocation);
    }

    public List<Reserva> obtenerReservasPorEstado(String estado) {
        Reserva.EstadoReserva estadoEnum;
        try {
            estadoEnum = Reserva.EstadoReserva.valueOf(estado.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado no válido: " + estado);
        }
        return reservaRepository.findByEstado(estadoEnum);
    }

    public List<Reserva> obtenerReservasPorRangoFechas(LocalDateTime inicio, LocalDateTime fin) {
        return reservaRepository.findByFechaClaseBetween(inicio, fin);
    }

    public List<Reserva> buscarReservasPorTermino(String termino) {
        return reservaRepository.buscarPorTermino(termino);
    }

    // Métodos especializados
    public List<Reserva> obtenerReservasDeHoy() {
        return reservaRepository.findReservasDeHoy();
    }

    public List<Reserva> obtenerReservasDeHoyPorUsuario(Long idUsuario) {
        return reservaRepository.findReservasDeHoyPorUsuario(idUsuario);
    }

    public List<Reserva> obtenerReservasFuturasActivas() {
        return reservaRepository.findReservasFuturasActivas(LocalDateTime.now());
    }

    public List<Reserva> obtenerReservasFuturasActivasPorUsuario(Long idUsuario) {
        return reservaRepository.findReservasFuturasActivasPorUsuario(LocalDateTime.now(), idUsuario);
    }

    public List<Reserva> obtenerReservasPasadas() {
        return reservaRepository.findReservasPasadas(LocalDateTime.now());
    }

    // Métodos de disponibilidad
    public long contarReservasPorHorario(Long idHorario) {
        return reservaRepository.countByIdHorarioAndActiva(idHorario);
    }

    public long contarReservasPorLocationHoy(Long idLocation) {
        return reservaRepository.countByIdLocationAndActivaHoy(idLocation);
    }

    public long contarReservasActivasPorUsuario(Long idUsuario) {
        return reservaRepository.countByIdUsuarioAndActiva(idUsuario);
    }

    public boolean hayDisponibilidadHorario(Long idHorario, LocalDateTime fechaClase, int capacidadMaxima) {
        long reservasExistentes = reservaRepository.countByIdHorarioAndFechaClaseAndActiva(idHorario, fechaClase);
        return reservasExistentes < capacidadMaxima;
    }

    // Métodos de mantenimiento
    public List<Reserva> obtenerReservasVencidas() {
        LocalDateTime limite = LocalDateTime.now().minusHours(24); // Reservas de hace más de 24 horas
        return reservaRepository.findReservasVencidas(limite, LocalDateTime.now());
    }

    public void completarReservasVencidas() {
        List<Reserva> reservasVencidas = obtenerReservasVencidas();
        reservasVencidas.forEach(reserva -> {
            reserva.completar();
            reservaRepository.save(reserva);
        });
    }

    // Métodos de estadísticas
    public long contarReservasPorEstado(String estado) {
        Reserva.EstadoReserva estadoEnum;
        try {
            estadoEnum = Reserva.EstadoReserva.valueOf(estado.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado no válido: " + estado);
        }
        return reservaRepository.findByEstado(estadoEnum).size();
    }

    public List<Reserva> obtenerUltimasReservas() {
        return reservaRepository.findUltimasReservas();
    }

    public List<Reserva> obtenerUltimasReservasPorUsuario(Long idUsuario) {
        return reservaRepository.findUltimasReservasPorUsuario(idUsuario);
    }

    // Métodos de utilidad
    public List<Reserva> obtenerReservasProximas(Long idUsuario, int dias) {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime limite = ahora.plusDays(dias);
        return reservaRepository.findByIdUsuarioAndFechaClaseBetween(idUsuario, ahora, limite)
                .stream()
                .filter(Reserva::estaActiva)
                .collect(Collectors.toList());
    }

    public List<Reserva> obtenerHistorialReservas(Long idUsuario, int dias) {
        LocalDateTime inicio = LocalDateTime.now().minusDays(dias);
        return reservaRepository.findByIdUsuarioAndFechaClaseBetween(idUsuario, inicio, LocalDateTime.now());
    }

    public boolean tieneReservaActivaHoy(Long idUsuario) {
        return !reservaRepository.findReservasDeHoyPorUsuario(idUsuario).isEmpty();
    }

    // Validaciones específicas
    public void validarReserva(Reserva reserva) {
        if (reserva.getFechaClase().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("La fecha de clase no puede ser en el pasado");
        }
        
        if (reserva.getNumeroPersonas() == null || reserva.getNumeroPersonas() < 1) {
            throw new RuntimeException("El número de personas debe ser al menos 1");
        }
        
        if (reserva.getNumeroPersonas() > 50) {
            throw new RuntimeException("El número de personas no puede exceder 50");
        }
    }
}
