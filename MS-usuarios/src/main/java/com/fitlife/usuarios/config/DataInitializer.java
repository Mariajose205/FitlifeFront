package com.fitlife.usuarios.config;

import com.fitlife.usuarios.entity.Usuario;
import com.fitlife.usuarios.repository.UsuarioRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
public class DataInitializer {

    private static final Logger logger = Logger.getLogger(DataInitializer.class.getName());

    private final UsuarioRepository usuarioRepository;

    public DataInitializer(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initializeData() {
        logger.info("Iniciando inicialización de datos por defecto...");

        // Crear usuario Admin si no existe
        if (!usuarioRepository.existsByEmail("admin@fitlife.com")) {
            Usuario admin = new Usuario();
            admin.setNombre("Admin");
            admin.setEmail("admin@fitlife.com");
            admin.setPassword("admin123");
            admin.setRol(Usuario.Rol.ADMIN);
            admin.setActivo(true);
            usuarioRepository.save(admin);
            logger.info("Usuario admin creado exitosamente: admin@fitlife.com / admin123");
        } else {
            logger.info("Usuario admin ya existe: admin@fitlife.com");
        }

        // Crear usuario Entrenador si no existe
        if (!usuarioRepository.existsByEmail("trainer@fitlife.com")) {
            Usuario trainer = new Usuario();
            trainer.setNombre("Trainer");
            trainer.setEmail("trainer@fitlife.com");
            trainer.setPassword("trainer123");
            trainer.setRol(Usuario.Rol.TRAINER);
            trainer.setActivo(true);
            usuarioRepository.save(trainer);
            logger.info("Usuario trainer creado exitosamente: trainer@fitlife.com / trainer123");
        } else {
            logger.info("Usuario trainer ya existe: trainer@fitlife.com");
        }

        logger.info("Inicialización de datos completada.");
    }
}
