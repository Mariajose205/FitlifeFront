package com.fitlife.notificaciones.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El destinatario es obligatorio")
    @Email(message = "El destinatario debe ser un email válido")
    @Column(nullable = false, length = 100)
    private String destinatario;

    @NotBlank(message = "El asunto es obligatorio")
    @Size(max = 200, message = "El asunto no puede exceder 200 caracteres")
    @Column(nullable = false, length = 200)
    private String asunto;

    @NotBlank(message = "El mensaje es obligatorio")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String mensaje;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoNotificacion estado = EstadoNotificacion.PENDIENTE;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio;

    @Column(name = "fecha_lectura")
    private LocalDateTime fechaLectura;

    @Column(name = "tipo_notificacion", length = 50)
    private String tipoNotificacion;

    @Column(name = "id_referencia")
    private Long idReferencia;

    // Constructores
    public Notificacion() {
        this.fechaCreacion = LocalDateTime.now();
    }

    public Notificacion(String destinatario, String asunto, String mensaje) {
        this();
        this.destinatario = destinatario;
        this.asunto = asunto;
        this.mensaje = mensaje;
    }

    public Notificacion(String destinatario, String asunto, String mensaje, String tipoNotificacion, Long idReferencia) {
        this(destinatario, asunto, mensaje);
        this.tipoNotificacion = tipoNotificacion;
        this.idReferencia = idReferencia;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDestinatario() {
        return destinatario;
    }

    public void setDestinatario(String destinatario) {
        this.destinatario = destinatario;
    }

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public EstadoNotificacion getEstado() {
        return estado;
    }

    public void setEstado(EstadoNotificacion estado) {
        this.estado = estado;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(LocalDateTime fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    public LocalDateTime getFechaLectura() {
        return fechaLectura;
    }

    public void setFechaLectura(LocalDateTime fechaLectura) {
        this.fechaLectura = fechaLectura;
    }

    public String getTipoNotificacion() {
        return tipoNotificacion;
    }

    public void setTipoNotificacion(String tipoNotificacion) {
        this.tipoNotificacion = tipoNotificacion;
    }

    public Long getIdReferencia() {
        return idReferencia;
    }

    public void setIdReferencia(Long idReferencia) {
        this.idReferencia = idReferencia;
    }

    // Métodos de utilidad
    public boolean estaEnviada() {
        return estado == EstadoNotificacion.ENVIADA;
    }

    public boolean estaLeida() {
        return estado == EstadoNotificacion.LEIDA;
    }

    public boolean estaPendiente() {
        return estado == EstadoNotificacion.PENDIENTE;
    }

    public boolean estaFallida() {
        return estado == EstadoNotificacion.FALLIDA;
    }

    public void marcarComoEnviada() {
        this.estado = EstadoNotificacion.ENVIADA;
        this.fechaEnvio = LocalDateTime.now();
    }

    public void marcarComoLeida() {
        this.estado = EstadoNotificacion.LEIDA;
        this.fechaLectura = LocalDateTime.now();
    }

    public void marcarComoFallida() {
        this.estado = EstadoNotificacion.FALLIDA;
    }

    public boolean estaVencida(int minutosVencimiento) {
        return estado == EstadoNotificacion.PENDIENTE && 
               fechaCreacion.plusMinutes(minutosVencimiento).isBefore(LocalDateTime.now());
    }

    // Enum para estados
    public enum EstadoNotificacion {
        PENDIENTE,
        ENVIADA,
        LEIDA,
        FALLIDA
    }
}
