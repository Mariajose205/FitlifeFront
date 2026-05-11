package com.fitlife.reservas.controller;

import com.fitlife.reservas.entity.Reserva;
import com.fitlife.reservas.service.ReservaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/reservas")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    // CRUD básico
    @PostMapping
    public ResponseEntity<Reserva> crearReserva(@Valid @RequestBody Reserva reserva) {
        try {
            reservaService.validarReserva(reserva);
            Reserva nuevaReserva = reservaService.crearReserva(reserva);
            return new ResponseEntity<>(nuevaReserva, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserva> obtenerReservaPorId(@PathVariable Long id) {
        Optional<Reserva> reserva = reservaService.obtenerReservaPorId(id);
        return reserva.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Reserva>> obtenerTodasLasReservas() {
        List<Reserva> reservas = reservaService.obtenerTodasLasReservas();
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reserva> actualizarReserva(@PathVariable Long id, @Valid @RequestBody Reserva reserva) {
        try {
            reservaService.validarReserva(reserva);
            Reserva reservaActualizada = reservaService.actualizarReserva(id, reserva);
            return new ResponseEntity<>(reservaActualizada, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarReserva(@PathVariable Long id) {
        try {
            reservaService.eliminarReserva(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Métodos de gestión de reservas
    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Reserva> cancelarReserva(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String motivo = request.get("motivo");
            Reserva reservaCancelada = reservaService.cancelarReserva(id, motivo);
            return new ResponseEntity<>(reservaCancelada, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/{id}/confirmar")
    public ResponseEntity<Reserva> confirmarReserva(@PathVariable Long id) {
        try {
            Reserva reservaConfirmada = reservaService.confirmarReserva(id);
            return new ResponseEntity<>(reservaConfirmada, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/{id}/completar")
    public ResponseEntity<Reserva> completarReserva(@PathVariable Long id) {
        try {
            Reserva reservaCompletada = reservaService.completarReserva(id);
            return new ResponseEntity<>(reservaCompletada, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Métodos de búsqueda
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Reserva>> obtenerReservasPorUsuario(@PathVariable Long idUsuario) {
        List<Reserva> reservas = reservaService.obtenerReservasPorUsuario(idUsuario);
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    @GetMapping("/horario/{idHorario}")
    public ResponseEntity<List<Reserva>> obtenerReservasPorHorario(@PathVariable Long idHorario) {
        List<Reserva> reservas = reservaService.obtenerReservasPorHorario(idHorario);
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    @GetMapping("/location/{idLocation}")
    public ResponseEntity<List<Reserva>> obtenerReservasPorLocation(@PathVariable Long idLocation) {
        List<Reserva> reservas = reservaService.obtenerReservasPorLocation(idLocation);
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Reserva>> obtenerReservasPorEstado(@PathVariable String estado) {
        try {
            List<Reserva> reservas = reservaService.obtenerReservasPorEstado(estado);
            return new ResponseEntity<>(reservas, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/fechas")
    public ResponseEntity<List<Reserva>> obtenerReservasPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        List<Reserva> reservas = reservaService.obtenerReservasPorRangoFechas(inicio, fin);
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Reserva>> buscarReservasPorTermino(@RequestParam String termino) {
        List<Reserva> reservas = reservaService.buscarReservasPorTermino(termino);
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    // Métodos especializados
    @GetMapping("/hoy")
    public ResponseEntity<List<Reserva>> obtenerReservasDeHoy() {
        List<Reserva> reservas = reservaService.obtenerReservasDeHoy();
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    @GetMapping("/hoy/usuario/{idUsuario}")
    public ResponseEntity<List<Reserva>> obtenerReservasDeHoyPorUsuario(@PathVariable Long idUsuario) {
        List<Reserva> reservas = reservaService.obtenerReservasDeHoyPorUsuario(idUsuario);
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    @GetMapping("/futuras")
    public ResponseEntity<List<Reserva>> obtenerReservasFuturasActivas() {
        List<Reserva> reservas = reservaService.obtenerReservasFuturasActivas();
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    @GetMapping("/futuras/usuario/{idUsuario}")
    public ResponseEntity<List<Reserva>> obtenerReservasFuturasActivasPorUsuario(@PathVariable Long idUsuario) {
        List<Reserva> reservas = reservaService.obtenerReservasFuturasActivasPorUsuario(idUsuario);
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    @GetMapping("/pasadas")
    public ResponseEntity<List<Reserva>> obtenerReservasPasadas() {
        List<Reserva> reservas = reservaService.obtenerReservasPasadas();
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    // Métodos de disponibilidad
    @GetMapping("/horario/{idHorario}/count")
    public ResponseEntity<Long> contarReservasPorHorario(@PathVariable Long idHorario) {
        long count = reservaService.contarReservasPorHorario(idHorario);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/location/{idLocation}/hoy/count")
    public ResponseEntity<Long> contarReservasPorLocationHoy(@PathVariable Long idLocation) {
        long count = reservaService.contarReservasPorLocationHoy(idLocation);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/usuario/{idUsuario}/activas/count")
    public ResponseEntity<Long> contarReservasActivasPorUsuario(@PathVariable Long idUsuario) {
        long count = reservaService.contarReservasActivasPorUsuario(idUsuario);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/disponibilidad")
    public ResponseEntity<Boolean> verificarDisponibilidadHorario(
            @RequestParam Long idHorario,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaClase,
            @RequestParam int capacidadMaxima) {
        boolean disponible = reservaService.hayDisponibilidadHorario(idHorario, fechaClase, capacidadMaxima);
        return new ResponseEntity<>(disponible, HttpStatus.OK);
    }

    // Métodos de mantenimiento
    @GetMapping("/proximas/usuario/{idUsuario}")
    public ResponseEntity<List<Reserva>> obtenerReservasProximas(
            @PathVariable Long idUsuario, @RequestParam(defaultValue = "7") int dias) {
        List<Reserva> reservas = reservaService.obtenerReservasProximas(idUsuario, dias);
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    @GetMapping("/historial/usuario/{idUsuario}")
    public ResponseEntity<List<Reserva>> obtenerHistorialReservas(
            @PathVariable Long idUsuario, @RequestParam(defaultValue = "30") int dias) {
        List<Reserva> reservas = reservaService.obtenerHistorialReservas(idUsuario, dias);
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    @GetMapping("/usuario/{idUsuario}/hoy/tiene-activa")
    public ResponseEntity<Boolean> tieneReservaActivaHoy(@PathVariable Long idUsuario) {
        boolean tieneActiva = reservaService.tieneReservaActivaHoy(idUsuario);
        return new ResponseEntity<>(tieneActiva, HttpStatus.OK);
    }

    @GetMapping("/ultimas")
    public ResponseEntity<List<Reserva>> obtenerUltimasReservas() {
        List<Reserva> reservas = reservaService.obtenerUltimasReservas();
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    @GetMapping("/ultimas/usuario/{idUsuario}")
    public ResponseEntity<List<Reserva>> obtenerUltimasReservasPorUsuario(@PathVariable Long idUsuario) {
        List<Reserva> reservas = reservaService.obtenerUltimasReservasPorUsuario(idUsuario);
        return new ResponseEntity<>(reservas, HttpStatus.OK);
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return new ResponseEntity<>("MS-reservas is running!", HttpStatus.OK);
    }
}
