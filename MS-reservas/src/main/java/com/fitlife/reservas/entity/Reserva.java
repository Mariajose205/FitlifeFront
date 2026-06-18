package com.fitlife.reservas.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El ID de usuario es obligatorio")
    @Column(name = "id_usuario", nullable = false)
    @JsonProperty("idUsuario")
    private Long idUsuario;

    @NotNull(message = "El ID de horario es obligatorio")
    @Column(name = "id_horario", nullable = false)
    @JsonProperty("idHorario")
    private Long idHorario;

    @NotNull(message = "El ID de location es obligatorio")
    @Column(name = "id_location", nullable = false)
    @JsonProperty("idLocation")
    private Long idLocation;

    @NotNull(message = "La fecha de reserva es obligatoria")
    @Column(name = "fecha_reserva", nullable = false)
    @JsonProperty("fechaReserva")
    private LocalDateTime fechaReserva;

    @NotNull(message = "La fecha de clase es obligatoria")
    @Column(name = "fecha_clase", nullable = false)
    @JsonProperty("fechaClase")
    private LocalDateTime fechaClase;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @JsonProperty("estado")
    private EstadoReserva estado = EstadoReserva.ACTIVA;

    @Min(value = 1, message = "El número de personas debe ser al menos 1")
    @Max(value = 50, message = "El número de personas no puede exceder 50")
    @Column(name = "numero_personas", nullable = false)
    @JsonProperty("numeroPersonas")
    private Integer numeroPersonas = 1;

    @Column(name = "monto_total")
    @JsonProperty("montoTotal")
    private Double montoTotal;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @Column(name = "fecha_cancelacion")
    private LocalDateTime fechaCancelacion;

    @Column(name = "motivo_cancelacion", length = 500)
    private String motivoCancelacion;

    // Constructores
    public Reserva() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaReserva = LocalDateTime.now();
    }

    public Reserva(Long idUsuario, Long idHorario, Long idLocation, LocalDateTime fechaClase) {
        this();
        this.idUsuario = idUsuario;
        this.idHorario = idHorario;
        this.idLocation = idLocation;
        this.fechaClase = fechaClase;
    }

    public Reserva(Long idUsuario, Long idHorario, Long idLocation, LocalDateTime fechaClase, Integer numeroPersonas) {
        this(idUsuario, idHorario, idLocation, fechaClase);
        this.numeroPersonas = numeroPersonas;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Long getIdHorario() {
        return idHorario;
    }

    public void setIdHorario(Long idHorario) {
        this.idHorario = idHorario;
    }

    public Long getIdLocation() {
        return idLocation;
    }

    public void setIdLocation(Long idLocation) {
        this.idLocation = idLocation;
    }

    public LocalDateTime getFechaReserva() {
        return fechaReserva;
    }

    public void setFechaReserva(LocalDateTime fechaReserva) {
        this.fechaReserva = fechaReserva;
    }

    public LocalDateTime getFechaClase() {
        return fechaClase;
    }

    public void setFechaClase(LocalDateTime fechaClase) {
        this.fechaClase = fechaClase;
    }

    public EstadoReserva getEstado() {
        return estado;
    }

    public void setEstado(EstadoReserva estado) {
        this.estado = estado;
    }

    public Integer getNumeroPersonas() {
        return numeroPersonas;
    }

    public void setNumeroPersonas(Integer numeroPersonas) {
        this.numeroPersonas = numeroPersonas;
    }

    public Double getMontoTotal() {
        return montoTotal;
    }

    public void setMontoTotal(Double montoTotal) {
        this.montoTotal = montoTotal;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
        this.fechaActualizacion = fechaActualizacion;
    }

    public LocalDateTime getFechaCancelacion() {
        return fechaCancelacion;
    }

    public void setFechaCancelacion(LocalDateTime fechaCancelacion) {
        this.fechaCancelacion = fechaCancelacion;
    }

    public String getMotivoCancelacion() {
        return motivoCancelacion;
    }

    public void setMotivoCancelacion(String motivoCancelacion) {
        this.motivoCancelacion = motivoCancelacion;
    }

    @PreUpdate
    public void preUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }

    // Métodos de utilidad
    public boolean estaActiva() {
        return estado == EstadoReserva.ACTIVA;
    }

    public boolean estaCancelada() {
        return estado == EstadoReserva.CANCELADA;
    }

    public boolean estaCompletada() {
        return estado == EstadoReserva.COMPLETADA;
    }

    public boolean estaPendiente() {
        return estado == EstadoReserva.PENDIENTE;
    }

    public void cancelar(String motivo) {
        this.estado = EstadoReserva.CANCELADA;
        this.fechaCancelacion = LocalDateTime.now();
        this.motivoCancelacion = motivo;
    }

    public void completar() {
        this.estado = EstadoReserva.COMPLETADA;
    }

    public void confirmar() {
        this.estado = EstadoReserva.ACTIVA;
    }

    public boolean esClaseFutura() {
        return fechaClase.isAfter(LocalDateTime.now());
    }

    public boolean esClaseHoy() {
        return fechaClase.toLocalDate().equals(LocalDateTime.now().toLocalDate());
    }

    public boolean esClasePasada() {
        return fechaClase.isBefore(LocalDateTime.now());
    }

    public long getMinutosParaClase() {
        return java.time.Duration.between(LocalDateTime.now(), fechaClase).toMinutes();
    }

    public boolean puedeCancelarse() {
        return estaActiva() && getMinutosParaClase() > 60; // Mínimo 1 hora antes
    }

    // Enum para estados
    public enum EstadoReserva {
        PENDIENTE,
        ACTIVA,
        CANCELADA,
        COMPLETADA
    }
}
