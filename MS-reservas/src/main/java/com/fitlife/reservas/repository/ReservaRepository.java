package com.fitlife.reservas.repository;

import com.fitlife.reservas.entity.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    // Búsquedas básicas
    List<Reserva> findByIdUsuario(Long idUsuario);
    List<Reserva> findByIdHorario(Long idHorario);
    List<Reserva> findByIdLocation(Long idLocation);
    List<Reserva> findByEstado(Reserva.EstadoReserva estado);
    
    // Búsquedas combinadas
    List<Reserva> findByIdUsuarioAndEstado(Long idUsuario, Reserva.EstadoReserva estado);
    List<Reserva> findByIdHorarioAndEstado(Long idHorario, Reserva.EstadoReserva estado);
    List<Reserva> findByIdLocationAndEstado(Long idLocation, Reserva.EstadoReserva estado);
    
    // Búsquedas por fechas
    List<Reserva> findByFechaClaseBetween(LocalDateTime inicio, LocalDateTime fin);
    List<Reserva> findByFechaReservaBetween(LocalDateTime inicio, LocalDateTime fin);
    List<Reserva> findByFechaClaseAfter(LocalDateTime fecha);
    List<Reserva> findByFechaClaseBefore(LocalDateTime fecha);
    
    // Búsquedas específicas
    List<Reserva> findByIdUsuarioAndFechaClaseBetween(Long idUsuario, LocalDateTime inicio, LocalDateTime fin);
    List<Reserva> findByIdLocationAndFechaClaseBetween(Long idLocation, LocalDateTime inicio, LocalDateTime fin);
    
    // Reservas de hoy
    @Query("SELECT r FROM Reserva r WHERE DATE(r.fechaClase) = CURRENT_DATE")
    List<Reserva> findReservasDeHoy();
    
    @Query("SELECT r FROM Reserva r WHERE DATE(r.fechaClase) = CURRENT_DATE AND r.idUsuario = :idUsuario")
    List<Reserva> findReservasDeHoyPorUsuario(@Param("idUsuario") Long idUsuario);
    
    // Reservas futuras
    @Query("SELECT r FROM Reserva r WHERE r.fechaClase > :ahora AND r.estado = 'ACTIVA'")
    List<Reserva> findReservasFuturasActivas(@Param("ahora") LocalDateTime ahora);
    
    @Query("SELECT r FROM Reserva r WHERE r.fechaClase > :ahora AND r.estado = 'ACTIVA' AND r.idUsuario = :idUsuario")
    List<Reserva> findReservasFuturasActivasPorUsuario(@Param("ahora") LocalDateTime ahora, @Param("idUsuario") Long idUsuario);
    
    // Reservas pasadas
    @Query("SELECT r FROM Reserva r WHERE r.fechaClase < :ahora AND r.estado != 'CANCELADA'")
    List<Reserva> findReservasPasadas(@Param("ahora") LocalDateTime ahora);
    
    // Contadores
    @Query("SELECT COUNT(r) FROM Reserva r WHERE r.idHorario = :idHorario AND r.estado = 'ACTIVA'")
    long countByIdHorarioAndActiva(@Param("idHorario") Long idHorario);
    
    @Query("SELECT COUNT(r) FROM Reserva r WHERE r.idLocation = :idLocation AND r.estado = 'ACTIVA' AND DATE(r.fechaClase) = CURRENT_DATE")
    long countByIdLocationAndActivaHoy(@Param("idLocation") Long idLocation);
    
    @Query("SELECT COUNT(r) FROM Reserva r WHERE r.idUsuario = :idUsuario AND r.estado = 'ACTIVA'")
    long countByIdUsuarioAndActiva(@Param("idUsuario") Long idUsuario);
    
    // Estadísticas
    @Query("SELECT r.estado, COUNT(r) FROM Reserva r GROUP BY r.estado")
    List<Object[]> countByEstado();
    
    @Query("SELECT DATE(r.fechaClase), COUNT(r) FROM Reserva r GROUP BY DATE(r.fechaClase) ORDER BY DATE(r.fechaClase) DESC")
    List<Object[]> countByFechaClase();
    
    @Query("SELECT r.idLocation, COUNT(r) FROM Reserva r WHERE r.estado = 'ACTIVA' GROUP BY r.idLocation")
    List<Object[]> countByLocation();
    
    // Verificar disponibilidad
    @Query("SELECT COUNT(r) FROM Reserva r WHERE r.idHorario = :idHorario AND r.fechaClase = :fechaClase AND r.estado = 'ACTIVA'")
    long countByIdHorarioAndFechaClaseAndActiva(@Param("idHorario") Long idHorario, @Param("fechaClase") LocalDateTime fechaClase);
    
    // Reservas para cancelar automáticamente
    @Query("SELECT r FROM Reserva r WHERE r.estado = 'ACTIVA' AND r.fechaClase < :limite AND r.fechaClase < :ahora")
    List<Reserva> findReservasVencidas(@Param("limite") LocalDateTime limite, @Param("ahora") LocalDateTime ahora);
    
    // Búsqueda por término
    @Query("SELECT r FROM Reserva r WHERE " +
           "CAST(r.id AS STRING) LIKE CONCAT('%', :termino, '%') OR " +
           "CAST(r.idUsuario AS STRING) LIKE CONCAT('%', :termino, '%') OR " +
           "CAST(r.idHorario AS STRING) LIKE CONCAT('%', :termino, '%') OR " +
           "CAST(r.idLocation AS STRING) LIKE CONCAT('%', :termino, '%')")
    List<Reserva> buscarPorTermino(@Param("termino") String termino);
    
    // Últimas reservas
    @Query("SELECT r FROM Reserva r ORDER BY r.fechaCreacion DESC")
    List<Reserva> findUltimasReservas();
    
    @Query("SELECT r FROM Reserva r WHERE r.idUsuario = :idUsuario ORDER BY r.fechaCreacion DESC")
    List<Reserva> findUltimasReservasPorUsuario(@Param("idUsuario") Long idUsuario);
    
    // Verificar duplicados
    @Query("SELECT COUNT(r) FROM Reserva r WHERE r.idUsuario = :idUsuario AND r.idHorario = :idHorario AND r.fechaClase = :fechaClase AND r.estado != 'CANCELADA'")
    long countReservasDuplicadas(@Param("idUsuario") Long idUsuario, @Param("idHorario") Long idHorario, @Param("fechaClase") LocalDateTime fechaClase);
}
