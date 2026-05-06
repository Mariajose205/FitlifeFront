package com.fitlife.notificaciones.controller;

import com.fitlife.notificaciones.entity.Notificacion;
import com.fitlife.notificaciones.service.NotificacionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/notificaciones")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    // CRUD básico
    @PostMapping
    public ResponseEntity<Notificacion> crearNotificacion(@Valid @RequestBody Notificacion notificacion) {
        try {
            Notificacion nuevaNotificacion = notificacionService.crearNotificacion(notificacion);
            return new ResponseEntity<>(nuevaNotificacion, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notificacion> obtenerNotificacionPorId(@PathVariable Long id) {
        Optional<Notificacion> notificacion = notificacionService.obtenerNotificacionPorId(id);
        return notificacion.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Notificacion>> obtenerTodasLasNotificaciones() {
        List<Notificacion> notificaciones = notificacionService.obtenerTodasLasNotificaciones();
        return new ResponseEntity<>(notificaciones, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notificacion> actualizarNotificacion(@PathVariable Long id, @Valid @RequestBody Notificacion notificacion) {
        try {
            Notificacion notificacionActualizada = notificacionService.actualizarNotificacion(id, notificacion);
            return new ResponseEntity<>(notificacionActualizada, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarNotificacion(@PathVariable Long id) {
        try {
            notificacionService.eliminarNotificacion(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Métodos de envío
    @PostMapping("/{id}/enviar")
    public ResponseEntity<Notificacion> enviarNotificacion(@PathVariable Long id) {
        try {
            Notificacion notificacionEnviada = notificacionService.enviarNotificacion(id);
            return new ResponseEntity<>(notificacionEnviada, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/procesar-reserva")
    public ResponseEntity<String> procesarEventoReserva(@RequestBody Map<String, Object> evento) {
        try {
            String resultado = notificacionService.procesarEventoReserva(evento);
            return new ResponseEntity<>(resultado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Métodos de búsqueda
    @GetMapping("/destinatario/{email}")
    public ResponseEntity<List<Notificacion>> obtenerNotificacionesPorDestinatario(@PathVariable String email) {
        List<Notificacion> notificaciones = notificacionService.obtenerNotificacionesPorDestinatario(email);
        return new ResponseEntity<>(notificaciones, HttpStatus.OK);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Notificacion>> obtenerNotificacionesPorEstado(@PathVariable String estado) {
        try {
            List<Notificacion> notificaciones = notificacionService.obtenerNotificacionesPorEstado(estado);
            return new ResponseEntity<>(notificaciones, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Notificacion>> obtenerNotificacionesPorTipo(@PathVariable String tipo) {
        List<Notificacion> notificaciones = notificacionService.obtenerNotificacionesPorTipo(tipo);
        return new ResponseEntity<>(notificaciones, HttpStatus.OK);
    }

    @GetMapping("/referencia/{idReferencia}")
    public ResponseEntity<List<Notificacion>> obtenerNotificacionesPorReferencia(@PathVariable Long idReferencia) {
        List<Notificacion> notificaciones = notificacionService.obtenerNotificacionesPorReferencia(idReferencia);
        return new ResponseEntity<>(notificaciones, HttpStatus.OK);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Notificacion>> buscarNotificacionesPorTermino(@RequestParam String termino) {
        List<Notificacion> notificaciones = notificacionService.buscarNotificacionesPorTermino(termino);
        return new ResponseEntity<>(notificaciones, HttpStatus.OK);
    }

    @GetMapping("/no-leidas/{email}")
    public ResponseEntity<List<Notificacion>> obtenerNotificacionesNoLeidas(@PathVariable String email) {
        List<Notificacion> notificaciones = notificacionService.obtenerNotificacionesNoLeidas(email);
        return new ResponseEntity<>(notificaciones, HttpStatus.OK);
    }

    // Métodos de mantenimiento
    @GetMapping("/pendientes-vencidas")
    public ResponseEntity<List<Notificacion>> obtenerNotificacionesPendientesVencidas() {
        List<Notificacion> notificaciones = notificacionService.obtenerNotificacionesPendientesVencidas();
        return new ResponseEntity<>(notificaciones, HttpStatus.OK);
    }

    @GetMapping("/contador/estado/{estado}")
    public ResponseEntity<Long> contarNotificacionesPorEstado(@PathVariable String estado) {
        try {
            long count = notificacionService.contarNotificacionesPorEstado(estado);
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return new ResponseEntity<>("MS-notificaciones is running!", HttpStatus.OK);
    }
}
