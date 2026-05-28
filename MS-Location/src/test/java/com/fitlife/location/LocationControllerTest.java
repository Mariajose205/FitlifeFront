package com.fitlife.location;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fitlife.location.controller.LocationController;
import com.fitlife.location.entity.Location;
import com.fitlife.location.service.LocationService;

@ExtendWith(MockitoExtension.class)
class LocationControllerTest {

    @Mock
    private LocationService locationService;

    @InjectMocks
    private LocationController locationController;

    private Location location;

    @BeforeEach
    void setUp() {
        location = new Location();
        location.setId(1L);
        location.setNombre("FitLife Centro");
        location.setDireccion("Av. Providencia 1234, Santiago");
        location.setCiudad("Santiago");
        location.setPais("Chile");
        location.setCapacidadMaxima(100);
        location.setCapacidadActual(50);
        location.setActiva(true);
    }

    @Test
    void testCrearLocation_Success() {
        when(locationService.crearLocation(any(Location.class))).thenReturn(location);

        ResponseEntity<Location> response = locationController.crearLocation(location);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        
        verify(locationService, times(1)).crearLocation(any(Location.class));
    }

    @Test
    void testCrearLocation_ValidationFailed() {
        when(locationService.crearLocation(any(Location.class))).thenThrow(new RuntimeException("Validación fallida"));

        ResponseEntity<Location> response = locationController.crearLocation(location);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
        
        verify(locationService, times(1)).crearLocation(any(Location.class));
    }

    @Test
    void testObtenerLocationPorId_Success() {
        when(locationService.obtenerLocationPorId(1L)).thenReturn(Optional.of(location));

        ResponseEntity<Location> response = locationController.obtenerLocationPorId(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        
        verify(locationService, times(1)).obtenerLocationPorId(1L);
    }

    @Test
    void testObtenerLocationPorId_NotFound() {
        when(locationService.obtenerLocationPorId(999L)).thenReturn(Optional.empty());

        ResponseEntity<Location> response = locationController.obtenerLocationPorId(999L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        
        verify(locationService, times(1)).obtenerLocationPorId(999L);
    }

    @Test
    void testObtenerTodasLasLocations_Success() {
        when(locationService.obtenerTodasLasLocations()).thenReturn(List.of(location));

        ResponseEntity<List<Location>> response = locationController.obtenerTodasLasLocations();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        
        verify(locationService, times(1)).obtenerTodasLasLocations();
    }

    @Test
    void testObtenerLocationsActivas_Success() {
        when(locationService.obtenerLocationsActivas()).thenReturn(List.of(location));

        ResponseEntity<List<Location>> response = locationController.obtenerLocationsActivas();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        
        verify(locationService, times(1)).obtenerLocationsActivas();
    }

    @Test
    void testActualizarLocation_Success() {
        Location locationActualizada = new Location();
        locationActualizada.setId(1L);
        locationActualizada.setNombre("FitLife Centro Actualizado");

        when(locationService.actualizarLocation(eq(1L), any(Location.class))).thenReturn(locationActualizada);

        ResponseEntity<Location> response = locationController.actualizarLocation(1L, locationActualizada);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        
        verify(locationService, times(1)).actualizarLocation(eq(1L), any(Location.class));
    }

    @Test
    void testActualizarLocation_NotFound() {
        when(locationService.actualizarLocation(eq(1L), any(Location.class))).thenThrow(new RuntimeException("Location no encontrada"));

        ResponseEntity<Location> response = locationController.actualizarLocation(1L, location);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        
        verify(locationService, times(1)).actualizarLocation(eq(1L), any(Location.class));
    }

    @Test
    void testEliminarLocation_Success() {
        doNothing().when(locationService).eliminarLocation(1L);

        ResponseEntity<Void> response = locationController.eliminarLocation(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        
        verify(locationService, times(1)).eliminarLocation(1L);
    }

    @Test
    void testEliminarLocation_NotFound() {
        doThrow(new RuntimeException("Location no encontrada")).when(locationService).eliminarLocation(1L);

        ResponseEntity<Void> response = locationController.eliminarLocation(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        
        verify(locationService, times(1)).eliminarLocation(1L);
    }

    @Test
    void testDesactivarLocation_Success() {
        doNothing().when(locationService).desactivarLocation(1L);

        ResponseEntity<Void> response = locationController.desactivarLocation(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        
        verify(locationService, times(1)).desactivarLocation(1L);
    }

    @Test
    void testDesactivarLocation_NotFound() {
        doThrow(new RuntimeException("Location no encontrada")).when(locationService).desactivarLocation(1L);

        ResponseEntity<Void> response = locationController.desactivarLocation(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        
        verify(locationService, times(1)).desactivarLocation(1L);
    }
}
