package com.fintech.msusuarios;

import com.fintech.msusuarios.dto.LoginRequest;
import com.fintech.msusuarios.dto.LoginResponse;
import com.fintech.msusuarios.entity.Usuario;
import com.fintech.msusuarios.repository.UsuarioRepository;
import com.fintech.msusuarios.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    private Usuario usuarioMock;

    @BeforeEach
    void setUp() {
        usuarioMock = Usuario.builder()
                .id(1L)
                .email("test@fintech.pe")
                .password("$2a$hash")
                .nombre("Test")
                .apellido("User")
                .rol(Usuario.Rol.CLIENTE)
                .activo(true)
                .build();
    }

    @Test
    void loginExitoso_debeRetornarLoginResponse() {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@fintech.pe");
        req.setPassword("password123");

        when(usuarioRepository.findByEmail("test@fintech.pe")).thenReturn(Optional.of(usuarioMock));
        when(passwordEncoder.matches("password123", "$2a$hash")).thenReturn(true);

        LoginResponse resp = usuarioService.login(req);

        assertTrue(resp.isAutenticado());
        assertEquals("test@fintech.pe", resp.getEmail());
        assertEquals("Test", resp.getNombre());
    }

    @Test
    void loginConPasswordIncorrecto_debeLanzarExcepcion() {
        LoginRequest req = new LoginRequest();
        req.setEmail("test@fintech.pe");
        req.setPassword("wrongPassword");

        when(usuarioRepository.findByEmail("test@fintech.pe")).thenReturn(Optional.of(usuarioMock));
        when(passwordEncoder.matches("wrongPassword", "$2a$hash")).thenReturn(false);

        assertThrows(ResponseStatusException.class, () -> usuarioService.login(req));
    }

    @Test
    void loginConEmailInexistente_debeLanzarExcepcion() {
        LoginRequest req = new LoginRequest();
        req.setEmail("noexiste@fintech.pe");
        req.setPassword("cualquiera");

        when(usuarioRepository.findByEmail("noexiste@fintech.pe")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> usuarioService.login(req));
    }

    @Test
    void loginUsuarioInactivo_debeLanzarExcepcion() {
        usuarioMock.setActivo(false);
        LoginRequest req = new LoginRequest();
        req.setEmail("test@fintech.pe");
        req.setPassword("password123");

        when(usuarioRepository.findByEmail("test@fintech.pe")).thenReturn(Optional.of(usuarioMock));

        assertThrows(ResponseStatusException.class, () -> usuarioService.login(req));
    }
}
