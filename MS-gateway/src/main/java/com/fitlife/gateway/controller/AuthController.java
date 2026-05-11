package com.fitlife.gateway.controller;

import com.fitlife.gateway.config.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private WebClient.Builder webClientBuilder;

    @PostMapping("/login")
    public Mono<ResponseEntity<?>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        logger.info("Login attempt for email: {} at {}", email, LocalDateTime.now());

        if (email == null || password == null) {
            logger.warn("Login attempt with missing credentials - Email: {}, Password: {}", 
                       email != null ? "provided" : "missing", 
                       password != null ? "provided" : "missing");
            return Mono.just(ResponseEntity.badRequest().body(Map.of("error", "Email y password son requeridos")));
        }

        // Validar credenciales contra MS-Usuarios
        return (Mono<ResponseEntity<?>>) (Mono<?>) webClientBuilder.build()
                .post()
                .uri("http://localhost:8185/api/usuarios/auth/validate")
                .bodyValue(Map.of("email", email, "password", password))
                .retrieve()
                .bodyToMono(Map.class)
                .flatMap(response -> {
                    Boolean valid = (Boolean) response.get("valid");
                    if (valid != null && valid) {
                        // Extraer información del usuario
                        @SuppressWarnings("unchecked")
                        Map<String, Object> user = (Map<String, Object>) response.get("user");
                        String role = (String) user.get("rol");
                        Long userId = ((Number) user.get("id")).longValue();
                        
                        // Generar JWT con información real del usuario
                        String jwtToken = jwtUtil.generateToken(email, role, userId);
                        
                        Map<String, Object> authResponse = new HashMap<>();
                        authResponse.put("token", jwtToken);
                        authResponse.put("user", Map.of("email", email, "rol", role, "id", userId));
                        authResponse.put("type", "Bearer");
                        
                        logger.info("Successful authentication for email: {} with role: {}", email, role);
                        return Mono.just(ResponseEntity.ok(authResponse));
                    } else {
                        logger.warn("Failed authentication attempt for email: {}", email);
                        return Mono.just(ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas")));
                    }
                })
                .onErrorResume(e -> {
                    logger.error("Authentication service error for email: {} - Error: {}", email, e.getMessage());
                    return Mono.just(ResponseEntity.status(500).body(Map.of("error", "Error en el servicio de autenticación")));
                });
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token no proporcionado o inválido"));
        }

        String token = authHeader.substring(7);
        
        if (jwtUtil.validateToken(token)) {
            String username = jwtUtil.extractUsername(token);
            return ResponseEntity.ok(Map.of("valid", true, "username", username));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Token inválido o expirado"));
        }
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        logger.info("Health check requested");
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "MS-gateway",
                "version", "1.0.0",
                "timestamp", java.time.LocalDateTime.now().toString()
        ));
    }
}
