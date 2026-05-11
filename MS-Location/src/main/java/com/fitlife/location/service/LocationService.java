package com.fitlife.location.service;

import com.fitlife.location.entity.Location;
import com.fitlife.location.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    // CRUD básico
    public Location crearLocation(Location location) {
        // Validar que no exista una location con el mismo nombre
        if (locationRepository.existsByNombreIgnoreCase(location.getNombre())) {
            throw new RuntimeException("Ya existe una ubicación con el nombre: " + location.getNombre());
        }
        
        // Validar que la capacidad actual no exceda la máxima
        if (location.getCapacidadActual() > location.getCapacidadMaxima()) {
            throw new RuntimeException("La capacidad actual no puede exceder la capacidad máxima");
        }
        
        return locationRepository.save(location);
    }

    public Optional<Location> obtenerLocationPorId(Long id) {
        return locationRepository.findById(id);
    }

    public List<Location> obtenerTodasLasLocations() {
        return locationRepository.findAll();
    }

    public List<Location> obtenerLocationsActivas() {
        return locationRepository.findByActivaTrue();
    }

    public Location actualizarLocation(Long id, Location locationActualizada) {
        return locationRepository.findById(id)
                .map(location -> {
                    // Validar nombre duplicado (si cambia)
                    if (!location.getNombre().equalsIgnoreCase(locationActualizada.getNombre()) &&
                        locationRepository.existsByNombreIgnoreCase(locationActualizada.getNombre())) {
                        throw new RuntimeException("Ya existe una ubicación con el nombre: " + locationActualizada.getNombre());
                    }
                    
                    // Validar capacidad
                    if (locationActualizada.getCapacidadActual() > locationActualizada.getCapacidadMaxima()) {
                        throw new RuntimeException("La capacidad actual no puede exceder la capacidad máxima");
                    }
                    
                    location.setNombre(locationActualizada.getNombre());
                    location.setDireccion(locationActualizada.getDireccion());
                    location.setCiudad(locationActualizada.getCiudad());
                    location.setPais(locationActualizada.getPais());
                    location.setCapacidadMaxima(locationActualizada.getCapacidadMaxima());
                    location.setCapacidadActual(locationActualizada.getCapacidadActual());
                    location.setActiva(locationActualizada.getActiva());
                    
                    return locationRepository.save(location);
                })
                .orElseThrow(() -> new RuntimeException("Location no encontrada con ID: " + id));
    }

    public void eliminarLocation(Long id) {
        locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location no encontrada con ID: " + id));
        locationRepository.deleteById(id);
    }

    public void desactivarLocation(Long id) {
        locationRepository.findById(id)
                .map(location -> {
                    location.setActiva(false);
                    return locationRepository.save(location);
                })
                .orElseThrow(() -> new RuntimeException("Location no encontrada con ID: " + id));
    }

    // Métodos de disponibilidad
    public List<Location> obtenerLocationsConDisponibilidad() {
        return locationRepository.findLocationsConDisponibilidad();
    }

    public List<Location> obtenerLocationsConDisponibilidadYCapacidadMinima(int capacidad) {
        return locationRepository.findLocationsConDisponibilidadYCapacidadMinima(capacidad);
    }

    public void incrementarCapacidadActual(Long id) {
        locationRepository.findById(id)
                .map(location -> {
                    if (location.getCapacidadActual() >= location.getCapacidadMaxima()) {
                        throw new RuntimeException("La ubicación ya está en su capacidad máxima");
                    }
                    location.setCapacidadActual(location.getCapacidadActual() + 1);
                    return locationRepository.save(location);
                })
                .orElseThrow(() -> new RuntimeException("Location no encontrada con ID: " + id));
    }

    public void decrementarCapacidadActual(Long id) {
        locationRepository.findById(id)
                .map(location -> {
                    if (location.getCapacidadActual() <= 0) {
                        throw new RuntimeException("La capacidad actual no puede ser negativa");
                    }
                    location.setCapacidadActual(location.getCapacidadActual() - 1);
                    return locationRepository.save(location);
                })
                .orElseThrow(() -> new RuntimeException("Location no encontrada con ID: " + id));
    }

    // Métodos de búsqueda
    public List<Location> buscarLocationsPorCiudad(String ciudad) {
        return locationRepository.findByCiudad(ciudad);
    }

    public List<Location> buscarLocationsPorPais(String pais) {
        return locationRepository.findByPais(pais);
    }

    public List<Location> buscarLocationsPorNombre(String nombre) {
        return locationRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public List<Location> buscarLocationsActivasEnCiudad(String ciudad) {
        return locationRepository.findByCiudadAndActivaTrue(ciudad);
    }

    public List<Location> buscarLocationsPorRangoCapacidad(int minima, int maxima) {
        return locationRepository.findByCapacidadMaximaBetweenAndActivaTrue(minima, maxima);
    }

    public List<Location> buscarLocationsPorTermino(String termino) {
        return locationRepository.buscarPorTermino(termino);
    }

    // Estadísticas
    public long contarLocationsActivas() {
        return locationRepository.countByActivaTrue();
    }

    public long contarLocationsConDisponibilidad() {
        return locationRepository.countByActivaTrueAndConDisponibilidad();
    }

    public double obtenerCapacidadPromedio() {
        Double promedio = locationRepository.findCapacidadPromedioByActivaTrue();
        return promedio != null ? promedio : 0.0;
    }
}
