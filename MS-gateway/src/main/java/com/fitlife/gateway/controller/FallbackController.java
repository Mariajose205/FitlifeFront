package com.fitlife.gateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador de fallback para el API Gateway.
 * Proporciona respuestas alternativas cuando un microservicio falla.
 */
@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/usuarios")
    public Map<String, Object> usuariosFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SERVICE_UNAVAILABLE");
        response.put("message", "El servicio de usuarios no está disponible en este momento. Por favor, intente más tarde.");
        response.put("service", "MS-usuarios");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @GetMapping("/locations")
    public Map<String, Object> locationsFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SERVICE_UNAVAILABLE");
        response.put("message", "El servicio de ubicaciones no está disponible en este momento. Por favor, intente más tarde.");
        response.put("service", "MS-Location");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @GetMapping("/reservas")
    public Map<String, Object> reservasFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SERVICE_UNAVAILABLE");
        response.put("message", "El servicio de reservas no está disponible en este momento. Por favor, intente más tarde.");
        response.put("service", "MS-reservas");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @GetMapping("/notificaciones")
    public Map<String, Object> notificacionesFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SERVICE_UNAVAILABLE");
        response.put("message", "El servicio de notificaciones no está disponible en este momento. Por favor, intente más tarde.");
        response.put("service", "MS-notificaciones");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }

    @GetMapping("/pagos")
    public Map<String, Object> pagosFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SERVICE_UNAVAILABLE");
        response.put("message", "El servicio de pagos no está disponible en este momento. Por favor, intente más tarde.");
        response.put("service", "MS-gestionPago");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
}
