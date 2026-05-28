package com.fitlife.location.controller;

import com.fitlife.location.entity.Location;
import com.fitlife.location.service.LocationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/locations")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class LocationController {

    @Autowired
    private LocationService locationService;

    // CRUD básico
    @PostMapping
    public ResponseEntity<Location> crearLocation(@Valid @RequestBody Location location) {
        try {
            Location nuevaLocation = locationService.crearLocation(location);
            return new ResponseEntity<>(nuevaLocation, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> obtenerLocationPorId(@PathVariable Long id) {
        Optional<Location> location = locationService.obtenerLocationPorId(id);
        return location.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping
    public ResponseEntity<List<Location>> obtenerTodasLasLocations() {
        List<Location> locations = locationService.obtenerTodasLasLocations();
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    @GetMapping("/activas")
    public ResponseEntity<List<Location>> obtenerLocationsActivas() {
        List<Location> locations = locationService.obtenerLocationsActivas();
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Location> actualizarLocation(@PathVariable Long id, @Valid @RequestBody Location location) {
        try {
            Location locationActualizada = locationService.actualizarLocation(id, location);
            return new ResponseEntity<>(locationActualizada, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLocation(@PathVariable Long id) {
        try {
            locationService.eliminarLocation(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivarLocation(@PathVariable Long id) {
        try {
            locationService.desactivarLocation(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Métodos de disponibilidad
    @GetMapping("/disponibles")
    public ResponseEntity<List<Location>> obtenerLocationsConDisponibilidad() {
        List<Location> locations = locationService.obtenerLocationsConDisponibilidad();
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    @GetMapping("/disponibles/capacidad/{capacidad}")
    public ResponseEntity<List<Location>> obtenerLocationsConDisponibilidadYCapacidad(@PathVariable int capacidad) {
        List<Location> locations = locationService.obtenerLocationsConDisponibilidadYCapacidadMinima(capacidad);
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    @PatchMapping("/{id}/incrementar-capacidad")
    public ResponseEntity<Void> incrementarCapacidadActual(@PathVariable Long id) {
        try {
            locationService.incrementarCapacidadActual(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PatchMapping("/{id}/decrementar-capacidad")
    public ResponseEntity<Void> decrementarCapacidadActual(@PathVariable Long id) {
        try {
            locationService.decrementarCapacidadActual(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Métodos de búsqueda
    @GetMapping("/ciudad/{ciudad}")
    public ResponseEntity<List<Location>> buscarLocationsPorCiudad(@PathVariable String ciudad) {
        List<Location> locations = locationService.buscarLocationsPorCiudad(ciudad);
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    @GetMapping("/pais/{pais}")
    public ResponseEntity<List<Location>> buscarLocationsPorPais(@PathVariable String pais) {
        List<Location> locations = locationService.buscarLocationsPorPais(pais);
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Location>> buscarLocationsPorNombre(@RequestParam String nombre) {
        List<Location> locations = locationService.buscarLocationsPorNombre(nombre);
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    @GetMapping("/ciudad/{ciudad}/activas-disponibles")
    public ResponseEntity<List<Location>> buscarLocationsActivasEnCiudad(@PathVariable String ciudad) {
        List<Location> locations = locationService.buscarLocationsActivasEnCiudad(ciudad);
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    @GetMapping("/capacidad/rango")
    public ResponseEntity<List<Location>> buscarLocationsPorRangoCapacidad(
            @RequestParam int minima, @RequestParam int maxima) {
        List<Location> locations = locationService.buscarLocationsPorRangoCapacidad(minima, maxima);
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    @GetMapping("/buscar/termino")
    public ResponseEntity<List<Location>> buscarLocationsPorTermino(@RequestParam String termino) {
        List<Location> locations = locationService.buscarLocationsPorTermino(termino);
        return new ResponseEntity<>(locations, HttpStatus.OK);
    }

    // Estadísticas
    @GetMapping("/estadisticas/activas/count")
    public ResponseEntity<Long> contarLocationsActivas() {
        long count = locationService.contarLocationsActivas();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/estadisticas/disponibles/count")
    public ResponseEntity<Long> contarLocationsConDisponibilidad() {
        long count = locationService.contarLocationsConDisponibilidad();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/estadisticas/capacidad-promedio")
    public ResponseEntity<Double> obtenerCapacidadPromedio() {
        double promedio = locationService.obtenerCapacidadPromedio();
        return new ResponseEntity<>(promedio, HttpStatus.OK);
    }

    // Health check
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return new ResponseEntity<>("MS-Location is running!", HttpStatus.OK);
    }
}
