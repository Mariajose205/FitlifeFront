package com.fitlife.usuarios.factory;

import com.fitlife.usuarios.entity.Usuario;

/**
 * Factory Method para la creación de usuarios según su rol.
 * Implementa el patrón Factory Method para instanciar diferentes tipos de usuarios.
 */
public class UsuarioFactory {

    /**
     * Crea un usuario según el rol especificado.
     * 
     * @param tipoRol Tipo de rol a crear (ADMIN, TRAINER, USER)
     * @param nombre Nombre del usuario
     * @param email Email del usuario
     * @param password Contraseña del usuario
     * @return Usuario instanciado con el rol correspondiente
     * @throws IllegalArgumentException si el rol no es válido
     */
    public static Usuario crearUsuario(String tipoRol, String nombre, String email, String password) {
        Usuario.Rol rol;
        
        try {
            rol = Usuario.Rol.valueOf(tipoRol.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Rol no válido: " + tipoRol + 
                ". Roles válidos: ADMIN, TRAINER, USER");
        }
        
        return crearUsuario(rol, nombre, email, password);
    }

    /**
     * Crea un usuario según el rol especificado usando el enum.
     * 
     * @param rol Rol a crear
     * @param nombre Nombre del usuario
     * @param email Email del usuario
     * @param password Contraseña del usuario
     * @return Usuario instanciado con el rol correspondiente
     */
    public static Usuario crearUsuario(Usuario.Rol rol, String nombre, String email, String password) {
        switch (rol) {
            case ADMIN:
                return crearAdministrador(nombre, email, password);
            case TRAINER:
                return crearEntrenador(nombre, email, password);
            case USER:
                return crearUsuarioNormal(nombre, email, password);
            default:
                throw new IllegalArgumentException("Rol no soportado: " + rol);
        }
    }

    /**
     * Crea un usuario con rol de Administrador.
     * El administrador tiene permisos completos en el sistema.
     * 
     * @param nombre Nombre del administrador
     * @param email Email del administrador
     * @param password Contraseña del administrador
     * @return Usuario con rol ADMIN
     */
    public static Usuario crearAdministrador(String nombre, String email, String password) {
        Usuario admin = new Usuario(nombre, email, password, Usuario.Rol.ADMIN);
        admin.setActivo(true);
        return admin;
    }

    /**
     * Crea un usuario con rol de Entrenador.
     * El entrenador puede ver sus clases, alumnos e historial.
     * 
     * @param nombre Nombre del entrenador
     * @param email Email del entrenador
     * @param password Contraseña del entrenador
     * @return Usuario con rol TRAINER
     */
    public static Usuario crearEntrenador(String nombre, String email, String password) {
        Usuario trainer = new Usuario(nombre, email, password, Usuario.Rol.TRAINER);
        trainer.setActivo(true);
        return trainer;
    }

    /**
     * Crea un usuario con rol de Usuario Normal.
     * El usuario normal puede ver su historial de reservas, pagos, clases y entrenadores.
     * 
     * @param nombre Nombre del usuario
     * @param email Email del usuario
     * @param password Contraseña del usuario
     * @return Usuario con rol USER
     */
    public static Usuario crearUsuarioNormal(String nombre, String email, String password) {
        Usuario user = new Usuario(nombre, email, password, Usuario.Rol.USER);
        user.setActivo(true);
        return user;
    }

    /**
     * Crea un usuario detectando automáticamente el rol basado en el email.
     * 
     * @param nombre Nombre del usuario
     * @param email Email del usuario (se usa para detectar el rol)
     * @param password Contraseña del usuario
     * @return Usuario con el rol detectado automáticamente
     */
    public static Usuario crearUsuarioAutoDetect(String nombre, String email, String password) {
        Usuario.Rol rol = detectarRolPorEmail(email);
        return crearUsuario(rol, nombre, email, password);
    }

    /**
     * Detecta el rol basado en el dominio del email.
     * 
     * @param email Email del usuario
     * @return Rol detectado
     */
    private static Usuario.Rol detectarRolPorEmail(String email) {
        if (email == null || email.isEmpty()) {
            return Usuario.Rol.USER;
        }
        
        String emailLower = email.toLowerCase();
        String[] parts = emailLower.split("@");
        
        if (parts.length > 1) {
            String domain = parts[1];
            String localPart = parts[0];
            
            if (domain.equals("fitlife.cl")) {
                if (localPart.contains("admin")) {
                    return Usuario.Rol.ADMIN;
                } else if (localPart.contains("trainer")) {
                    return Usuario.Rol.TRAINER;
                }
            }
        }
        
        return Usuario.Rol.USER;
    }
}
