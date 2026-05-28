package com.fitlife.notificaciones.config;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${fitlife.queue.mensaje-notify}")
    private String mensajeNotifyQueue;

    @Value("${fitlife.exchange.reserva-confirmada}")
    private String reservaConfirmadaExchange;

    @Value("${fitlife.routing-key.mensaje}")
    private String mensajeRoutingKey;

    @Bean
    public Queue mensajeNotifyQueue() {
        return QueueBuilder.durable(mensajeNotifyQueue).build();
    }

    @Bean
    public TopicExchange reservaConfirmadaExchange() {
        return new TopicExchange(reservaConfirmadaExchange);
    }

    @Bean
    public Binding mensajeNotifyBinding() {
        return BindingBuilder
                .bind(mensajeNotifyQueue())
                .to(reservaConfirmadaExchange())
                .with(mensajeRoutingKey);
    }
}
