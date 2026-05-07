package com.fitlife.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class MSGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(MSGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Ruta para MS-usuarios
                .route("usuarios", r -> r.path("/api/usuarios/**")
                        .uri("http://localhost:8085"))
                
                // Ruta para MS-Location
                .route("locations", r -> r.path("/api/locations/**")
                        .uri("http://localhost:8082"))
                
                // Ruta para MS-reservas
                .route("reservas", r -> r.path("/api/reservas/**")
                        .uri("http://localhost:8083"))
                
                // Ruta para MS-notificaciones
                .route("notificaciones", r -> r.path("/api/notificaciones/**")
                        .uri("http://localhost:8084"))
                
                // Ruta para MS-gestionPago
                .route("pagos", r -> r.path("/api/pagos/**", "/api/tarjetas/**")
                        .uri("http://localhost:8086"))
                
                .build();
    }
}
