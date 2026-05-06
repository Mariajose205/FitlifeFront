package com.fitlife.pago.controller;

import com.fitlife.pago.entity.Tarjeta;
import com.fitlife.pago.service.TarjetaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/pagos/tarjetas")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TarjetaController {

    @Autowired
    private TarjetaService tarjetaService;

    // CRUD básico
    @PostMapping
    public ResponseEntity<Tarjeta> guardarTarjeta(@Valid @RequestBody Tarjeta tarjeta) {
        try {
            tarjetaService.validarTarjeta(tarjeta);
            Tarjeta nuevaTarjeta = tarjetaService.guardarTarjeta(tarjeta);
            return new ResponseEntity<>(nuevaTarjeta, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarjeta> obtenerTarjetaPorId(@PathVariable Long id) {
        Optional<Tarjeta> tarjeta = tarjetaService.obtenerTarjetaPorId(id);
        return tarjeta.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Tarjeta>> obtenerTodasLasTarjetas() {
        List<Tarjeta> tarjetas = tarjetaService.obtenerTodasLasTarjetas();
        return new ResponseEntity<>(tarjetas, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarjeta> actualizarTarjeta(@PathVariable Long id, @Valid @RequestBody Tarjeta tarjeta) {
        try {
            tarjetaService.validarTarjeta(tarjeta);
            Tarjeta tarjetaActualizada = tarjetaService.actualizarTarjeta(id, tarjeta);
            return new ResponseEntity<>(tarjetaActualizada, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTarjeta(@PathVariable Long id) {
        try {
            tarjetaService.eliminarTarjeta(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Métodos especializados
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Tarjeta>> obtenerTarjetasPorUsuario(@PathVariable Long idUsuario) {
        List<Tarjeta> tarjetas = tarjetaService.obtenerTarjetasPorUsuario(idUsuario);
        return new ResponseEntity<>(tarjetas, HttpStatus.OK);
    }

    @GetMapping("/usuario/{idUsuario}/predeterminada")
    public ResponseEntity<Tarjeta> obtenerTarjetaPredeterminada(@PathVariable Long idUsuario) {
        Optional<Tarjeta> tarjeta = tarjetaService.obtenerTarjetaPredeterminada(idUsuario);
        return tarjeta.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}/predeterminada/{idUsuario}")
    public ResponseEntity<Tarjeta> marcarComoPredeterminada(@PathVariable Long id, @PathVariable Long idUsuario) {
        try {
            Tarjeta tarjeta = tarjetaService.marcarComoPredeterminada(id, idUsuario);
            return new ResponseEntity<>(tarjeta, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/saldo")
    public ResponseEntity<Void> actualizarSaldoTarjeta(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Double saldo = ((Number) request.get("saldo")).doubleValue();
            tarjetaService.actualizarSaldoTarjeta(id, saldo);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/descontar")
    public ResponseEntity<Void> descontarSaldoTarjeta(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Double monto = ((Number) request.get("monto")).doubleValue();
            tarjetaService.descontarSaldoTarjeta(id, monto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}/reembolsar")
    public ResponseEntity<Void> reembolsarSaldoTarjeta(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            Double monto = ((Number) request.get("monto")).doubleValue();
            tarjetaService.reembolsarSaldoTarjeta(id, monto);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivarTarjeta(@PathVariable Long id) {
        try {
            tarjetaService.desactivarTarjeta(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<Void> activarTarjeta(@PathVariable Long id) {
        try {
            tarjetaService.activarTarjeta(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Métodos de consulta
    @GetMapping("/usuario/{idUsuario}/count")
    public ResponseEntity<Long> contarTarjetasActivasPorUsuario(@PathVariable Long idUsuario) {
        long count = tarjetaService.contarTarjetasActivasPorUsuario(idUsuario);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/usuario/{idUsuario}/tiene-predeterminada")
    public ResponseEntity<Boolean> tieneTarjetaPredeterminada(@PathVariable Long idUsuario) {
        boolean tiene = tarjetaService.tieneTarjetaPredeterminada(idUsuario);
        return new ResponseEntity<>(tiene, HttpStatus.OK);
    }

    @GetMapping("/usuario/{idUsuario}/credito")
    public ResponseEntity<List<Tarjeta>> obtenerTarjetasDeCreditoPorUsuario(@PathVariable Long idUsuario) {
        List<Tarjeta> tarjetas = tarjetaService.obtenerTarjetasDeCreditoPorUsuario(idUsuario);
        return new ResponseEntity<>(tarjetas, HttpStatus.OK);
    }

    @GetMapping("/usuario/{idUsuario}/debito")
    public ResponseEntity<List<Tarjeta>> obtenerTarjetasDeDebitoPorUsuario(@PathVariable Long idUsuario) {
        List<Tarjeta> tarjetas = tarjetaService.obtenerTarjetasDeDebitoPorUsuario(idUsuario);
        return new ResponseEntity<>(tarjetas, HttpStatus.OK);
    }
}
