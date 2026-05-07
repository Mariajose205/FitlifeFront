package com.fitlife.payment.service;

import com.fitlife.payment.entity.Tarjeta;
import com.fitlife.payment.repository.TarjetaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class TarjetaService {
    
    private final TarjetaRepository tarjetaRepository;
    
    public TarjetaService(TarjetaRepository tarjetaRepository) {
        this.tarjetaRepository = tarjetaRepository;
    }
    
    public List<Tarjeta> obtenerTarjetasPorUsuario(Long idUsuario) {
        return tarjetaRepository.findByIdUsuarioAndActivo(idUsuario, true); 
    }
    
    public Optional<Tarjeta> obtenerTarjetaPredeterminada(Long idUsuario) {
        System.out.println("Buscando tarjeta predeterminada para usuario: " + idUsuario);
        List<Tarjeta> tarjetasActivas = tarjetaRepository.findByIdUsuarioAndActivo(idUsuario, true);
        Optional<Tarjeta> predeterminada = tarjetasActivas.stream()
                .filter(t -> t.getPorDefecto() != null && t.getPorDefecto())
                .findFirst();
        
        if (predeterminada.isPresent()) {
            System.out.println("Tarjeta predeterminada encontrada: " + predeterminada.get().getNumero());
        } else {
            System.out.println("No se encontró tarjeta predeterminada para usuario: " + idUsuario);
        }
        
        return predeterminada;
    }
    
    @Transactional
    public Optional<Tarjeta> guardarTarjeta(Tarjeta tarjeta) {
        // Enmascarar número de tarjeta (guardar solo últimos 4 dígitos)
        String numeroCompleto = tarjeta.getNumero();
        if (numeroCompleto != null && numeroCompleto.length() > 4) {
            String numeroEnmascarado = "**** **** **** " + numeroCompleto.substring(numeroCompleto.length() - 4);
            tarjeta.setNumero(numeroEnmascarado);
        }
        
        // Establecer valores por defecto
        if (tarjeta.getFechaCreacion() == null) {
            tarjeta.setFechaCreacion(LocalDate.now());
        }
        tarjeta.setActivo(true);
        
        Tarjeta guardada = tarjetaRepository.save(tarjeta);
        return Optional.of(guardada);
    }
    
    @Transactional
    public Tarjeta actualizarSaldoTarjeta(Long id, BigDecimal nuevoSaldo) {
        Optional<Tarjeta> tarjetaExistente = tarjetaRepository.findById(id);
        if (tarjetaExistente.isPresent()) {
            Tarjeta tarjeta = tarjetaExistente.get();
            tarjeta.setSaldo(nuevoSaldo);
            return tarjetaRepository.save(tarjeta);
        }
        throw new RuntimeException("Tarjeta no encontrada con ID: " + id);
    }
    
    @Transactional
    public Tarjeta actualizarTarjeta(Long id, Tarjeta tarjetaActualizada) {
        Optional<Tarjeta> tarjetaExistente = tarjetaRepository.findById(id);
        if (tarjetaExistente.isPresent()) {
            Tarjeta tarjeta = tarjetaExistente.get();
            
            // Actualizar campos permitidos
            if (tarjetaActualizada.getNumero() != null) {
                String numeroCompleto = tarjetaActualizada.getNumero();
                if (numeroCompleto.length() > 4) {
                    String numeroEnmascarado = "**** **** **** " + numeroCompleto.substring(numeroCompleto.length() - 4);
                    tarjeta.setNumero(numeroEnmascarado);
                }
            }
            
            if (tarjetaActualizada.getSaldo() != null) {
                tarjeta.setSaldo(tarjetaActualizada.getSaldo());
            }
            
            if (tarjetaActualizada.getPorDefecto() != null) {
                tarjeta.setPorDefecto(tarjetaActualizada.getPorDefecto());
            }
            
            return tarjetaRepository.save(tarjeta);
        }
        throw new RuntimeException("Tarjeta no encontrada con ID: " + id);
    }
    
    @Transactional
    public void eliminarTarjeta(Long id) {
        Optional<Tarjeta> tarjeta = tarjetaRepository.findById(id);
        if (tarjeta.isPresent()) {
            Tarjeta tarjetaExistente = tarjeta.get();
            tarjetaExistente.setActivo(false);
            tarjetaRepository.save(tarjetaExistente);
        }
    }
    
    @Transactional
    public Tarjeta marcarComoPredeterminada(Long id, Long idUsuario) {
        // Primero desmarcar todas las tarjetas del usuario como no predeterminadas
        List<Tarjeta> tarjetasUsuario = obtenerTarjetasPorUsuario(idUsuario);
        tarjetasUsuario.forEach(t -> {
            t.setPorDefecto(false);
            tarjetaRepository.save(t);
        });
        
        // Marcar la tarjeta seleccionada como predeterminada
        Optional<Tarjeta> tarjetaSeleccionada = tarjetaRepository.findById(id);
        if (tarjetaSeleccionada.isPresent()) {
            Tarjeta tarjeta = tarjetaSeleccionada.get();
            tarjeta.setPorDefecto(true);
            return tarjetaRepository.save(tarjeta);
        }
        throw new RuntimeException("Tarjeta no encontrada con ID: " + id);
    }
}
