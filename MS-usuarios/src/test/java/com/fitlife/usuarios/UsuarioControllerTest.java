package com.fitlife.usuarios;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import com.fitlife.usuarios.controller.UsuarioController;
import com.fitlife.usuarios.entity.Usuario;
import com.fitlife.usuarios.service.UsuarioService;

@ExtendWith(MockitoExtension.class)
class UsuarioControllerTest {

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private UsuarioController usuarioController;

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
        usuario.setTelefono("+56912345678");
        usuario.setDireccion("Santiago, Chile");
        usuario.setFechaNacimiento(LocalDate.of(1990, 1, 1));
    }

    @Test
    void testLogin_Success() {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "juan@example.com");
        loginRequest.put("password", "password123");

        when(usuarioService.obtenerUsuarioPorEmail("juan@example.com")).thenReturn(Optional.of(usuario));

        ResponseEntity<?> response = usuarioController.login(loginRequest);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        
        Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
        assertNotNull(responseBody.get("token"));
        assertNotNull(responseBody.get("user"));
        
        verify(usuarioService, times(1)).obtenerUsuarioPorEmail("juan@example.com");
    }

    @Test
    void testLogin_UserNotFound() {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "notfound@example.com");
        loginRequest.put("password", "password123");

        when(usuarioService.obtenerUsuarioPorEmail("notfound@example.com")).thenReturn(Optional.empty());

        ResponseEntity<?> response = usuarioController.login(loginRequest);

        assertEquals(401, response.getStatusCode().value());
        verify(usuarioService, times(1)).obtenerUsuarioPorEmail("notfound@example.com");
    }

    @Test
    void testLogin_WrongPassword() {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "juan@example.com");
        loginRequest.put("password", "wrongpassword");

        when(usuarioService.obtenerUsuarioPorEmail("juan@example.com")).thenReturn(Optional.of(usuario));

        ResponseEntity<?> response = usuarioController.login(loginRequest);

        assertEquals(401, response.getStatusCode().value());
        verify(usuarioService, times(1)).obtenerUsuarioPorEmail("juan@example.com");
    }

    @Test
    void testLogin_InactiveUser() {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "juan@example.com");
        loginRequest.put("password", "password123");

        usuario.setActivo(false);
        when(usuarioService.obtenerUsuarioPorEmail("juan@example.com")).thenReturn(Optional.of(usuario));

        ResponseEntity<?> response = usuarioController.login(loginRequest);

        assertEquals(401, response.getStatusCode().value());
        verify(usuarioService, times(1)).obtenerUsuarioPorEmail("juan@example.com");
    }

    @Test
    void testRegister_Success() {
        Map<String, Object> registerRequest = new HashMap<>();
        registerRequest.put("nombre", "María García");
        registerRequest.put("email", "maria@example.com");
        registerRequest.put("password", "password123");
        registerRequest.put("telefono", "+56912345678");
        registerRequest.put("rol", "USER");

        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setId(2L);
        nuevoUsuario.setNombre("María García");
        nuevoUsuario.setEmail("maria@example.com");
        nuevoUsuario.setPassword("password123");
        nuevoUsuario.setRol(Usuario.Rol.USER);
        nuevoUsuario.setActivo(true);

        when(usuarioService.existeEmail("maria@example.com")).thenReturn(false);
        when(usuarioService.crearUsuario(any(Usuario.class))).thenReturn(nuevoUsuario);

        ResponseEntity<?> response = usuarioController.register(registerRequest);

        assertEquals(201, response.getStatusCode().value());
        assertNotNull(response.getBody());
        
        verify(usuarioService, times(1)).existeEmail("maria@example.com");
        verify(usuarioService, times(1)).crearUsuario(any(Usuario.class));
    }

    @Test
    void testRegister_EmailAlreadyExists() {
        Map<String, Object> registerRequest = new HashMap<>();
        registerRequest.put("nombre", "Juan Pérez");
        registerRequest.put("email", "juan@example.com");
        registerRequest.put("password", "password123");

        when(usuarioService.existeEmail("juan@example.com")).thenReturn(true);

        ResponseEntity<?> response = usuarioController.register(registerRequest);

        assertEquals(400, response.getStatusCode().value());
        verify(usuarioService, times(1)).existeEmail("juan@example.com");
        verify(usuarioService, never()).crearUsuario(any(Usuario.class));
    }

    @Test
    void testObtenerUsuarioPorId_Success() {
        when(usuarioService.obtenerUsuarioPorId(1L)).thenReturn(Optional.of(usuario));

        ResponseEntity<?> response = usuarioController.obtenerUsuarioPorId(1L);

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        
        verify(usuarioService, times(1)).obtenerUsuarioPorId(1L);
    }

    @Test
    void testObtenerUsuarioPorId_NotFound() {
        when(usuarioService.obtenerUsuarioPorId(999L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = usuarioController.obtenerUsuarioPorId(999L);

        assertEquals(404, response.getStatusCode().value());
        verify(usuarioService, times(1)).obtenerUsuarioPorId(999L);
    }

    @Test
    void testEliminarUsuario_Success() {
        doNothing().when(usuarioService).eliminarUsuario(1L);

        ResponseEntity<?> response = usuarioController.eliminarUsuario(1L);

        assertEquals(200, response.getStatusCode().value());
        verify(usuarioService, times(1)).eliminarUsuario(1L);
    }

    @Test
    void testEliminarUsuario_NotFound() {
        doThrow(new RuntimeException("Usuario no encontrado")).when(usuarioService).eliminarUsuario(999L);

        ResponseEntity<?> response = usuarioController.eliminarUsuario(999L);

        assertEquals(404, response.getStatusCode().value());
        verify(usuarioService, times(1)).eliminarUsuario(999L);
    }

    @Test
    void testHealth() {
        ResponseEntity<Map<String, String>> response = usuarioController.health();

        assertEquals(200, response.getStatusCode().value());
        assertNotNull(response.getBody());
        assertEquals("UP", response.getBody().get("status"));
        assertEquals("MS-usuarios", response.getBody().get("service"));
    }
}
