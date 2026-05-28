package com.fitlife.reservas;

import java.time.LocalDateTime;
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
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fitlife.reservas.controller.ReservaController;
import com.fitlife.reservas.entity.Reserva;
import com.fitlife.reservas.service.ReservaService;

@ExtendWith(MockitoExtension.class)
class ReservaControllerTest {

    @Mock
    private ReservaService reservaService;

    @InjectMocks
    private ReservaController reservaController;

    private Reserva reserva;

    @BeforeEach
    void setUp() {
        reserva = new Reserva();
        reserva.setId(1L);
        reserva.setIdUsuario(1L);
        reserva.setIdHorario(1L);
        reserva.setIdLocation(1L);
        reserva.setFechaReserva(LocalDateTime.now());
        reserva.setFechaClase(LocalDateTime.now().plusDays(1));
        reserva.setEstado(Reserva.EstadoReserva.ACTIVA);
        reserva.setNumeroPersonas(1);
    }

    @Test
    void testCrearReserva_Success() {
        when(reservaService.crearReserva(any(Reserva.class))).thenReturn(reserva);

        ResponseEntity<Reserva> response = reservaController.crearReserva(reserva);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        
        verify(reservaService, times(1)).crearReserva(any(Reserva.class));
    }

    @Test
    void testCrearReserva_ValidationFailed() {
        when(reservaService.crearReserva(any(Reserva.class))).thenThrow(new RuntimeException("Validación fallida"));

        ResponseEntity<Reserva> response = reservaController.crearReserva(reserva);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());
        
        verify(reservaService, times(1)).crearReserva(any(Reserva.class));
    }

    @Test
    void testObtenerReservaPorId_Success() {
        when(reservaService.obtenerReservaPorId(1L)).thenReturn(Optional.of(reserva));

        ResponseEntity<Reserva> response = reservaController.obtenerReservaPorId(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        
        verify(reservaService, times(1)).obtenerReservaPorId(1L);
    }

    @Test
    void testObtenerReservaPorId_NotFound() {
        when(reservaService.obtenerReservaPorId(999L)).thenReturn(Optional.empty());

        ResponseEntity<Reserva> response = reservaController.obtenerReservaPorId(999L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        
        verify(reservaService, times(1)).obtenerReservaPorId(999L);
    }

    @Test
    void testObtenerTodasLasReservas_Success() {
        when(reservaService.obtenerTodasLasReservas()).thenReturn(List.of(reserva));

        ResponseEntity<List<Reserva>> response = reservaController.obtenerTodasLasReservas();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        
        verify(reservaService, times(1)).obtenerTodasLasReservas();
    }

    @Test
    void testActualizarReserva_Success() {
        Reserva reservaActualizada = new Reserva();
        reservaActualizada.setId(1L);
        reservaActualizada.setEstado(Reserva.EstadoReserva.COMPLETADA);

        when(reservaService.actualizarReserva(eq(1L), any(Reserva.class))).thenReturn(reservaActualizada);

        ResponseEntity<Reserva> response = reservaController.actualizarReserva(1L, reservaActualizada);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        
        verify(reservaService, times(1)).actualizarReserva(eq(1L), any(Reserva.class));
    }

    @Test
    void testEliminarReserva_Success() {
        doNothing().when(reservaService).eliminarReserva(1L);

        ResponseEntity<Void> response = reservaController.eliminarReserva(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        
        verify(reservaService, times(1)).eliminarReserva(1L);
    }

    @Test
    void testConfirmarReserva_Success() {
        when(reservaService.confirmarReserva(1L)).thenReturn(reserva);

        ResponseEntity<Reserva> response = reservaController.confirmarReserva(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        
        verify(reservaService, times(1)).confirmarReserva(1L);
    }

    @Test
    void testObtenerReservasPorUsuario_Success() {
        when(reservaService.obtenerReservasPorUsuario(1L)).thenReturn(List.of(reserva));

        ResponseEntity<List<Reserva>> response = reservaController.obtenerReservasPorUsuario(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        
        verify(reservaService, times(1)).obtenerReservasPorUsuario(1L);
    }
}
