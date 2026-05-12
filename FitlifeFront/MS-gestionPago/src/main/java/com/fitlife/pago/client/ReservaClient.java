package com.fitlife.pago.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Component
public class ReservaClient {

    private static final Logger logger = LoggerFactory.getLogger(ReservaClient.class);
    
    private final WebClient webClient;
    private final String msReservasUrl;

    public ReservaClient(@Value("${ms.reservas.url:http://localhost:8082}") String msReservasUrl) {
        this.msReservasUrl = msReservasUrl;
        this.webClient = WebClient.builder()
                .baseUrl(msReservasUrl)
                .build();
    }

    /**
     * Confirma una reserva en el microservicio de reservas
     * @param idReserva ID de la reserva a confirmar
     * @return true si la confirmación fue exitosa, false en caso contrario
     */
    public boolean confirmarReserva(Long idReserva) {
        try {
            logger.info("🔄 Intentando confirmar reserva ID: {} en MS-reservas", idReserva);
            
            String response = webClient.patch()
                    .uri("/reservas/{id}/confirmar", idReserva)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            
            logger.info("✅ Reserva {} confirmada exitosamente en MS-reservas", idReserva);
            return true;
            
        } catch (WebClientResponseException e) {
            logger.error("❌ Error al confirmar reserva {}: Status {}, Body: {}", 
                    idReserva, e.getStatusCode(), e.getResponseBodyAsString());
            return false;
        } catch (Exception e) {
            logger.error("❌ Error de conexión al confirmar reserva {}: {}", idReserva, e.getMessage());
            return false;
        }
    }

    /**
     * Verifica si una reserva existe en el microservicio de reservas
     * @param idReserva ID de la reserva a verificar
     * @return true si la reserva existe, false en caso contrario
     */
    public boolean verificarReserva(Long idReserva) {
        try {
            logger.info("🔍 Verificando existencia de reserva ID: {}", idReserva);
            
            String response = webClient.get()
                    .uri("/reservas/{id}", idReserva)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            
            logger.info("✅ Reserva {} existe en MS-reservas", idReserva);
            return true;
            
        } catch (WebClientResponseException.NotFound e) {
            logger.warn("⚠️ Reserva {} no encontrada en MS-reservas", idReserva);
            return false;
        } catch (Exception e) {
            logger.error("❌ Error al verificar reserva {}: {}", idReserva, e.getMessage());
            return false;
        }
    }

    /**
     * Obtiene información de una reserva
     * @param idReserva ID de la reserva
     * @return String con la información de la reserva o null si no existe
     */
    public String obtenerReserva(Long idReserva) {
        try {
            logger.info("📋 Obteniendo información de reserva ID: {}", idReserva);
            
            String response = webClient.get()
                    .uri("/reservas/{id}", idReserva)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            
            logger.info("✅ Información de reserva {} obtenida", idReserva);
            return response;
            
        } catch (WebClientResponseException.NotFound e) {
            logger.warn("⚠️ Reserva {} no encontrada en MS-reservas", idReserva);
            return null;
        } catch (Exception e) {
            logger.error("❌ Error al obtener reserva {}: {}", idReserva, e.getMessage());
            return null;
        }
    }
}
