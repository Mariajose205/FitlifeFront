package com.fitlife.location.repository;

import com.fitlife.location.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    // Búsquedas básicas
    List<Location> findByActivaTrue();
    List<Location> findByActivaFalse();
    List<Location> findByCiudad(String ciudad);
    List<Location> findByPais(String pais);
    
    // Búsquedas combinadas
    List<Location> findByCiudadAndActivaTrue(String ciudad);
    List<Location> findByPaisAndActivaTrue(String pais);
    
    // Búsquedas por nombre (contiene)
    List<Location> findByNombreContainingIgnoreCase(String nombre);
    
    // Búsquedas por disponibilidad
    @Query("SELECT l FROM Location l WHERE l.activa = true AND l.capacidadActual < l.capacidadMaxima")
    List<Location> findLocationsConDisponibilidad();
    
    @Query("SELECT l FROM Location l WHERE l.activa = true AND l.capacidadActual < l.capacidadMaxima AND l.capacidadMaxima >= :capacidad")
    List<Location> findLocationsConDisponibilidadYCapacidadMinima(@Param("capacidad") int capacidad);
    
    // Búsquedas por rango de capacidad
    @Query("SELECT l FROM Location l WHERE l.capacidadMaxima BETWEEN :minima AND :maxima AND l.activa = true")
    List<Location> findByCapacidadMaximaBetweenAndActivaTrue(@Param("minima") int minima, @Param("maxima") int maxima);
    
    // Búsqueda por término (nombre, ciudad, país)
    @Query("SELECT l FROM Location l WHERE l.activa = true AND " +
           "(LOWER(l.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(l.ciudad) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(l.pais) LIKE LOWER(CONCAT('%', :termino, '%')))")
    List<Location> buscarPorTermino(@Param("termino") String termino);
    
    // Estadísticas
    @Query("SELECT COUNT(l) FROM Location l WHERE l.activa = true")
    long countByActivaTrue();
    
    @Query("SELECT COUNT(l) FROM Location l WHERE l.activa = true AND l.capacidadActual < l.capacidadMaxima")
    long countByActivaTrueAndConDisponibilidad();
    
    @Query("SELECT AVG(l.capacidadMaxima) FROM Location l WHERE l.activa = true")
    Double findCapacidadPromedioByActivaTrue();
    
    // Verificar existencia
    boolean existsByNombreIgnoreCase(String nombre);
    boolean existsByDireccionIgnoreCase(String direccion);
}
