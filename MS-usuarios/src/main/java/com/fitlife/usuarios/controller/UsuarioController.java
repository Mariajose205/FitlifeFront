package com.fitlife.usuarios.controller;

import com.fitlife.usuarios.entity.Usuario;
import com.fitlife.usuarios.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // Health check
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "MS-usuarios",
                "version", "1.0.0"
        ));
    }

    // Login (compatible con frontend)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String email = loginRequest.get("email");
            String password = loginRequest.get("password");
            
            Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorEmail(email);
            
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Usuario no encontrado"));
            }
            
            Usuario usuario = usuarioOpt.get();
            
            if (!usuario.estaActivo()) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Usuario inactivo"));
            }
            
            // Lógica simple de autenticación (sin encriptación por ahora)
            if (!password.equals("admin123")) { // Contraseña temporal para pruebas
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Contraseña incorrecta"));
            }
            
            // Respuesta compatible con frontend
            Map<String, Object> response = Map.of(
                "token", "mock-jwt-token-" + System.currentTimeMillis(),
                "user", Map.of(
                    "id", usuario.getId(),
                    "email", usuario.getEmail(),
                    "nombre", usuario.getNombre(),
                    "rol", usuario.getRol().name(),
                    "activo", usuario.getActivo()
                )
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error en el servidor"));
        }
    }

    // Register (compatible con frontend)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> registerRequest) {
        try {
            String nombre = (String) registerRequest.get("nombre");
            String email = (String) registerRequest.get("email");
            String password = (String) registerRequest.get("password");
            String telefono = (String) registerRequest.getOrDefault("telefono", "");
            String direccion = (String) registerRequest.getOrDefault("direccion", "");
            
            // Verificar si el email ya existe
            if (usuarioService.existeEmail(email)) {
                return ResponseEntity.status(400)
                        .body(Map.of("error", "El email ya está registrado"));
            }
            
            // Detectar rol automáticamente según lógica del frontend
            Usuario.Rol rol = Usuario.Rol.USER;
            if (email != null) {
                String emailLower = email.toLowerCase();
                String[] parts = emailLower.split("@");
                if (parts.length > 1) {
                    String domain = parts[1];
                    if (domain.equals("fitlife.cl")) {
                        if (emailLower.contains("admin")) {
                            rol = Usuario.Rol.ADMIN;
                        } else if (emailLower.contains("trainer")) {
                            rol = Usuario.Rol.TRAINER;
                        }
                    }
                }
            }
            
            // Crear usuario
            Usuario usuario = new Usuario(nombre, email, password, rol);
            usuario.setTelefono(telefono);
            // La dirección no está en la entidad simple, omitir por ahora    
            Usuario usuarioCreado = usuarioService.crearUsuario(usuario);
            
            // Respuesta compatible con frontend
            Map<String, Object> response = Map.of(
                "token", "mock-jwt-token-" + System.currentTimeMillis(),
                "user", Map.of(
                    "id", usuarioCreado.getId(),
                    "email", usuarioCreado.getEmail(),
                    "nombre", usuarioCreado.getNombre(),
                    "rol", usuarioCreado.getRol().name(),
                    "activo", usuarioCreado.getActivo()
                )
            );
            
            return ResponseEntity.status(201).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error en el servidor"));
        }
    }

    // Listar todos los usuarios
    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodosLosUsuarios() {
        List<Usuario> usuarios = usuarioService.obtenerTodosLosUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    // Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.obtenerUsuarioPorId(id);
        
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Obtener usuario por email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> obtenerUsuarioPorEmail(@PathVariable String email) {
        Optional<Usuario> usuario = usuarioService.obtenerUsuarioPorEmail(email);
        
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Verificar si existe email
    @GetMapping("/existe/email/{email}")
    public ResponseEntity<Boolean> existeEmail(@PathVariable String email) {
        boolean existe = usuarioService.existeEmail(email);
        return ResponseEntity.ok(existe);
    }

    // Eliminar usuario (con lógica de autorización)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        try {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.ok(Map.of("message", "Usuario eliminado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Estadísticas
    @GetMapping("/estadisticas/total")
    public ResponseEntity<Long> contarUsuarios() {
        long count = usuarioService.obtenerTodosLosUsuarios().size();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/estadisticas/rol/{rol}/count")
    public ResponseEntity<Long> contarPorRol(@PathVariable String rol) {
        try {
            Usuario.Rol rolEnum = Usuario.Rol.valueOf(rol.toUpperCase());
            long count = usuarioService.contarPorRol(rolEnum);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/estadisticas/activos/count")
    public ResponseEntity<Long> contarActivos() {
        long count = usuarioService.contarActivos();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/estadisticas/inactivos/count")
    public ResponseEntity<Long> contarInactivos() {
        long count = usuarioService.contarInactivos();
        return ResponseEntity.ok(count);
    }
}
