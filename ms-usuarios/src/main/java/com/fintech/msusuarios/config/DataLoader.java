package com.fintech.msusuarios.config;

import com.fintech.msusuarios.entity.Usuario;
import com.fintech.msusuarios.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Crea el usuario admin si no existe
        if (!usuarioRepository.existsByEmail("admin@fintech.pe")) {
            Usuario admin = Usuario.builder()
                    .email("admin@fintech.pe")
                    .password(passwordEncoder.encode("admin123"))
                    .nombre("Administrador")
                    .apellido("Sistema")
                    .telefono("999000001")
                    .rol(Usuario.Rol.ADMIN)
                    .activo(true)
                    .build();
            usuarioRepository.save(admin);
            log.info("✅ Usuario admin creado: admin@fintech.pe / admin123");
        }

        // Crea un cliente de prueba si no existe
        if (!usuarioRepository.existsByEmail("cliente@fintech.pe")) {
            Usuario cliente = Usuario.builder()
                    .email("cliente@fintech.pe")
                    .password(passwordEncoder.encode("admin123"))
                    .nombre("Carlos")
                    .apellido("Mendoza")
                    .telefono("999000002")
                    .rol(Usuario.Rol.CLIENTE)
                    .activo(true)
                    .build();
            usuarioRepository.save(cliente);
            log.info("✅ Usuario cliente creado: cliente@fintech.pe / admin123");
        }
    }
}
