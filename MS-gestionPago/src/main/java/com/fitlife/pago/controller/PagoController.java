package com.fitlife.pago.controller;

import com.fitlife.pago.entity.Pago;
import com.fitlife.pago.service.PagoService;
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
@RequestMapping("/pagos")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    // CRUD básico
    @PostMapping
    public ResponseEntity<Pago> crearPago(@Valid @RequestBody Pago pago) {
        try {
            pagoService.validarPago(pago);
            Pago nuevoPago = pagoService.crearPago(pago);
            return new ResponseEntity<>(nuevoPago, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pago> obtenerPagoPorId(@PathVariable Long id) {
        Optional<Pago> pago = pagoService.obtenerPagoPorId(id);
        return pago.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Pago>> obtenerTodosLosPagos() {
        List<Pago> pagos = pagoService.obtenerTodosLosPagos();
        return new ResponseEntity<>(pagos, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pago> actualizarPago(@PathVariable Long id, @Valid @RequestBody Pago pago) {
        try {
            pagoService.validarPago(pago);
            Pago pagoActualizado = pagoService.actualizarPago(id, pago);
            return new ResponseEntity<>(pagoActualizado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPago(@PathVariable Long id) {
        try {
            pagoService.eliminarPago(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Métodos de gestión de pagos
    @PostMapping("/{id}/procesar")
    public ResponseEntity<Pago> procesarPago(@PathVariable Long id) {
        try {
            Pago pagoProcesado = pagoService.procesarPago(id);
            return new ResponseEntity<>(pagoProcesado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<Pago> cancelarPago(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String motivo = request.get("motivo");
            Pago pagoCancelado = pagoService.cancelarPago(id, motivo);
            return new ResponseEntity<>(pagoCancelado, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/{id}/devolver")
    public ResponseEntity<Pago> devolverPago(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Double monto = ((Number) request.get("monto")).doubleValue();
            String motivo = (String) request.get("motivo");
            Pago pagoDevuelto = pagoService.devolverPago(id, monto, motivo);
            return new ResponseEntity<>(pagoDevuelto, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Métodos de búsqueda
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Pago>> obtenerPagosPorUsuario(@PathVariable Long idUsuario) {
        List<Pago> pagos = pagoService.obtenerPagosPorUsuario(idUsuario);
        return new ResponseEntity<>(pagos, HttpStatus.OK);
    }

    @GetMapping("/reserva/{idReserva}")
    public ResponseEntity<List<Pago>> obtenerPagosPorReserva(@PathVariable Long idReserva) {
        List<Pago> pagos = pagoService.obtenerPagosPorReserva(idReserva);
        return new ResponseEntity<>(pagos, HttpStatus.OK);
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<Pago>> obtenerPagosPorEstado(@PathVariable String estado) {
        try {
            List<Pago> pagos = pagoService.obtenerPagosPorEstado(estado);
            return new ResponseEntity<>(pagos, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/metodo/{metodo}")
    public ResponseEntity<List<Pago>> obtenerPagosPorMetodo(@PathVariable String metodo) {
        try {
            List<Pago> pagos = pagoService.obtenerPagosPorMetodo(metodo);
            return new ResponseEntity<>(pagos, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/fechas")
    public ResponseEntity<List<Pago>> obtenerPagosPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        List<Pago> pagos = pagoService.obtenerPagosPorRangoFechas(inicio, fin);
        return new ResponseEntity<>(pagos, HttpStatus.OK);
    }

    // Métodos de estadísticas
    @GetMapping("/usuario/{idUsuario}/completados/count")
    public ResponseEntity<Long> contarPagosCompletadosPorUsuario(@PathVariable Long idUsuario) {
        long count = pagoService.contarPagosCompletadosPorUsuario(idUsuario);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/usuario/{idUsuario}/total")
    public ResponseEntity<Double> obtenerTotalPagadoPorUsuario(@PathVariable Long idUsuario) {
        Double total = pagoService.obtenerTotalPagadoPorUsuario(idUsuario);
        return new ResponseEntity<>(total, HttpStatus.OK);
    }

    @GetMapping("/recientes")
    public ResponseEntity<List<Pago>> obtenerPagosRecientes(@RequestParam(defaultValue = "7") int dias) {
        List<Pago> pagos = pagoService.obtenerPagosRecientes(dias);
        return new ResponseEntity<>(pagos, HttpStatus.OK);
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return new ResponseEntity<>("MS-gestionPago is running!", HttpStatus.OK);
    }
}
