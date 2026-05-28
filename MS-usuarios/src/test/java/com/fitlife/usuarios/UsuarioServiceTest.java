package com.fitlife.usuarios;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.fitlife.usuarios.entity.Usuario;
import com.fitlife.usuarios.repository.UsuarioRepository;
import com.fitlife.usuarios.service.UsuarioService;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Juan Pérez");
        usuario.setEmail("juan@example.com");
        usuario.setPassword("password123");
        usuario.setRol(Usuario.Rol.USER);
        usuario.setActivo(true);
    }

    @Test
    void testCrearUsuario_Success() {
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuario);

        Usuario resultado = usuarioService.crearUsuario(usuario);

        assertNotNull(resultado);
        assertEquals("Juan Pérez", resultado.getNombre());
        assertEquals("juan@example.com", resultado.getEmail());
        
        verify(usuarioRepository, times(1)).save(usuario);
    }

    @Test
    void testObtenerUsuarioPorId_Success() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));

        Optional<Usuario> resultado = usuarioService.obtenerUsuarioPorId(1L);

        assertTrue(resultado.isPresent());
        assertEquals("Juan Pérez", resultado.get().getNombre());
        
        verify(usuarioRepository, times(1)).findById(1L);
    }

    @Test
    void testObtenerUsuarioPorId_NotFound() {
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Usuario> resultado = usuarioService.obtenerUsuarioPorId(999L);

        assertFalse(resultado.isPresent());
        
        verify(usuarioRepository, times(1)).findById(999L);
    }

    @Test
    void testObtenerUsuarioPorEmail_Success() {
        when(usuarioRepository.findByEmail("juan@example.com")).thenReturn(Optional.of(usuario));

        Optional<Usuario> resultado = usuarioService.obtenerUsuarioPorEmail("juan@example.com");

        assertTrue(resultado.isPresent());
        assertEquals("Juan Pérez", resultado.get().getNombre());
        
        verify(usuarioRepository, times(1)).findByEmail("juan@example.com");
    }

    @Test
    void testObtenerUsuarioPorEmail_NotFound() {
        when(usuarioRepository.findByEmail("notfound@example.com")).thenReturn(Optional.empty());

        Optional<Usuario> resultado = usuarioService.obtenerUsuarioPorEmail("notfound@example.com");

        assertFalse(resultado.isPresent());
        
        verify(usuarioRepository, times(1)).findByEmail("notfound@example.com");
    }

    @Test
    void testActualizarUsuario_Success() {
        Usuario usuarioActualizado = new Usuario();
        usuarioActualizado.setId(1L);
        usuarioActualizado.setNombre("Juan Pérez Actualizado");
        usuarioActualizado.setEmail("juan@example.com");
        usuarioActualizado.setPassword("newpassword123");
        usuarioActualizado.setRol(Usuario.Rol.USER);
        usuarioActualizado.setActivo(true);

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioActualizado);

        Usuario resultado = usuarioService.actualizarUsuario(1L, usuarioActualizado);

        assertNotNull(resultado);
        assertEquals("Juan Pérez Actualizado", resultado.getNombre());
        
        verify(usuarioRepository, times(1)).findById(1L);
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    void testActualizarUsuario_NotFound() {
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            usuarioService.actualizarUsuario(999L, usuario);
        });
        
        verify(usuarioRepository, times(1)).findById(999L);
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void testEliminarUsuario_Success() {
        when(usuarioRepository.existsById(1L)).thenReturn(true);
        doNothing().when(usuarioRepository).deleteById(1L);

        usuarioService.eliminarUsuario(1L);
        
        verify(usuarioRepository, times(1)).existsById(1L);
        verify(usuarioRepository, times(1)).deleteById(1L);
    }

    @Test
    void testEliminarUsuario_NotFound() {
        when(usuarioRepository.existsById(999L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> {
            usuarioService.eliminarUsuario(999L);
        });
        
        verify(usuarioRepository, times(1)).existsById(999L);
        verify(usuarioRepository, never()).deleteById(anyLong());
    }

    @Test
    void testObtenerTodosLosUsuarios_Success() {
        when(usuarioRepository.findAll()).thenReturn(java.util.List.of(usuario));

        java.util.List<Usuario> resultado = usuarioService.obtenerTodosLosUsuarios();

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Juan Pérez", resultado.get(0).getNombre());
        
        verify(usuarioRepository, times(1)).findAll();
    }
}
