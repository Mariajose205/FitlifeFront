package com.fitlife.usuarios.service;

import com.fitlife.usuarios.entity.Usuario;
import com.fitlife.usuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    
    // CRUD Operations
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public Usuario crearUsuario(Usuario usuario) {
        // Guardar contraseña como está (para pruebas)
        return usuarioRepository.save(usuario);
    }

    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        Usuario usuario = usuarioOpt.get();
        
        // Actualizar campos permitidos
        if (usuarioActualizado.getNombre() != null) {
            usuario.setNombre(usuarioActualizado.getNombre());
        }
        if (usuarioActualizado.getEmail() != null) {
            usuario.setEmail(usuarioActualizado.getEmail());
        }
        if (usuarioActualizado.getTelefono() != null) {
            usuario.setTelefono(usuarioActualizado.getTelefono());
        }
        if (usuarioActualizado.getRol() != null) {
            usuario.setRol(usuarioActualizado.getRol());
        }
        if (usuarioActualizado.getActivo() != null) {
            usuario.setActivo(usuarioActualizado.getActivo());
        }
        
        return usuarioRepository.save(usuario);
    }

    public void eliminarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    // Métodos por rol
    public List<Usuario> obtenerUsuariosPorRol(Usuario.Rol rol) {
        return usuarioRepository.findByRol(rol);
    }

    public List<Usuario> obtenerUsuariosActivosPorRol(Usuario.Rol rol) {
        return usuarioRepository.findByRolAndActivo(rol, true);
    }

    // Métodos de búsqueda
    public List<Usuario> buscarPorNombre(String nombre) {
        return usuarioRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public List<Usuario> buscarPorTermino(String termino) {
        return usuarioRepository.buscarPorTermino(termino);
    }

    // Métodos de estado
    public Usuario activarUsuario(Long id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        Usuario usuario = usuarioOpt.get();
        usuario.activar();
        return usuarioRepository.save(usuario);
    }

    public Usuario desactivarUsuario(Long id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        Usuario usuario = usuarioOpt.get();
        usuario.desactivar();
        return usuarioRepository.save(usuario);
    }

    // Estadísticas
    public long contarPorRol(Usuario.Rol rol) {
        return usuarioRepository.countByRol(rol);
    }

    public long contarActivos() {
        return usuarioRepository.countByActivo(true);
    }

    public long contarInactivos() {
        return usuarioRepository.countByActivo(false);
    }

    // Métodos utilitarios
    public boolean existeEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    public List<Usuario> obtenerUsuariosRecientes() {
        return usuarioRepository.findAllByOrderByFechaCreacionDesc();
    }
}
