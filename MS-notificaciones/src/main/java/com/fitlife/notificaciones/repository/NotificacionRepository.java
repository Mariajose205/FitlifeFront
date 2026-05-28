package com.fitlife.notificaciones.repository;

import com.fitlife.notificaciones.entity.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    // Búsquedas básicas
    List<Notificacion> findByDestinatario(String destinatario);
    List<Notificacion> findByEstado(Notificacion.EstadoNotificacion estado);
    List<Notificacion> findByTipoNotificacion(String tipoNotificacion);
    List<Notificacion> findByIdReferencia(Long idReferencia);
    
    // Búsquedas combinadas
    List<Notificacion> findByDestinatarioAndEstado(String destinatario, Notificacion.EstadoNotificacion estado);
    List<Notificacion> findByTipoNotificacionAndEstado(String tipoNotificacion, Notificacion.EstadoNotificacion estado);
    
    // Búsquedas por fechas
    List<Notificacion> findByFechaCreacionBetween(LocalDateTime inicio, LocalDateTime fin);
    List<Notificacion> findByFechaEnvioBetween(LocalDateTime inicio, LocalDateTime fin);
    
    // Búsquedas con like
    List<Notificacion> findByAsuntoContainingIgnoreCase(String asunto);
    List<Notificacion> findByMensajeContainingIgnoreCase(String mensaje);
    
    // Notificaciones pendientes vencidas
    @Query("SELECT n FROM Notificacion n WHERE n.estado = 'PENDIENTE' AND n.fechaCreacion < :fechaLimite")
    List<Notificacion> findNotificacionesPendientesVencidas(@Param("fechaLimite") LocalDateTime fechaLimite);
    
    // Contadores
    @Query("SELECT COUNT(n) FROM Notificacion n WHERE n.estado = :estado")
    long countByEstado(@Param("estado") Notificacion.EstadoNotificacion estado);
    
    @Query("SELECT COUNT(n) FROM Notificacion n WHERE n.destinatario = :destinatario AND n.estado = :estado")
    long countByDestinatarioAndEstado(@Param("destinatario") String destinatario, 
                                     @Param("estado") Notificacion.EstadoNotificacion estado);
    
    // Estadísticas por tipo
    @Query("SELECT n.tipoNotificacion, COUNT(n) FROM Notificacion n WHERE n.tipoNotificacion IS NOT NULL GROUP BY n.tipoNotificacion")
    List<Object[]> countByTipoNotificacion();
    
    // Estadísticas por fecha
    @Query("SELECT DATE(n.fechaCreacion), COUNT(n) FROM Notificacion n GROUP BY DATE(n.fechaCreacion) ORDER BY DATE(n.fechaCreacion) DESC")
    List<Object[]> countByFechaCreacion();
    
    // Últimas notificaciones
    @Query("SELECT n FROM Notificacion n ORDER BY n.fechaCreacion DESC")
    List<Notificacion> findUltimasNotificaciones();
    
    @Query("SELECT n FROM Notificacion n WHERE n.destinatario = :destinatario ORDER BY n.fechaCreacion DESC")
    List<Notificacion> findUltimasNotificacionesPorDestinatario(@Param("destinatario") String destinatario);
    
    // Búsqueda por término
    @Query("SELECT n FROM Notificacion n WHERE " +
           "LOWER(n.asunto) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(n.mensaje) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(n.destinatario) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Notificacion> buscarPorTermino(@Param("termino") String termino);
    
    // Notificaciones no leídas
    @Query("SELECT n FROM Notificacion n WHERE n.destinatario = :destinatario AND n.estado != 'LEIDA'")
    List<Notificacion> findNotificacionesNoLeidasPorDestinatario(@Param("destinatario") String destinatario);
    
    // Verificar existencia
    boolean existsByDestinatarioAndAsunto(String destinatario, String asunto);
}
