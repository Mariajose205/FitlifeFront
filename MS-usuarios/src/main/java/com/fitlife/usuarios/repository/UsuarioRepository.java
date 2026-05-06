package com.fitlife.usuarios.repository;

import com.fitlife.usuarios.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Búsquedas básicas
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByRol(Usuario.Rol rol);
    List<Usuario> findByActivo(Boolean activo);
    List<Usuario> findByRolAndActivo(Usuario.Rol rol, Boolean activo);
    
    // Búsquedas por nombre
    List<Usuario> findByNombreContainingIgnoreCase(String nombre);
    
    // Verificar existencia
    boolean existsByEmail(String email);
    
    // Contadores
    long countByRol(Usuario.Rol rol);
    long countByActivo(Boolean activo);
    
    // Búsqueda por término (múltiples campos)
    @Query("SELECT u FROM Usuario u WHERE " +
           "LOWER(u.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(u.telefono) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Usuario> buscarPorTermino(@Param("termino") String termino);
    
    // Usuarios recientes
    List<Usuario> findAllByOrderByFechaCreacionDesc();
}
