package com.fintech.msusuarios.service;

import com.fintech.msusuarios.entity.PasswordResetToken;
import com.fintech.msusuarios.entity.Usuario;
import com.fintech.msusuarios.repository.PasswordResetTokenRepository;
import com.fintech.msusuarios.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordRecoveryService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    @Value("${app.password-reset.frontend-url}")
    private String frontendUrl;

    @Value("${app.password-reset.expiration-minutes:30}")
    private long expirationMinutes;

    @Transactional
    public String solicitarRecuperacion(String email) {

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty() || !Boolean.TRUE.equals(usuarioOpt.get().getActivo())) {
            log.info("Solicitud de recuperación ignorada para {}", email);
            return null;
        }

        Usuario usuario = usuarioOpt.get();

        invalidarTokensActivos(usuario);

        String token = generarToken();

        PasswordResetToken passwordResetToken = PasswordResetToken.builder()
                .token(token)
                .usuario(usuario)
                .fechaCreacion(LocalDateTime.now())
                .fechaExpiracion(LocalDateTime.now().plusMinutes(expirationMinutes))
                .usado(false)
                .build();

        passwordResetTokenRepository.save(passwordResetToken);

        String enlace = construirEnlaceReseteo(token);
        //mailService.enviarCorreoRecuperacion(usuario.getEmail(), usuario.getNombre(), enlace);

        log.info("=================================================");
        log.info("LINK DE RECUPERACION:");
        log.info(enlace);
        log.info("=================================================");

        // Desactivado temporalmente para pruebas
        // mailService.enviarCorreoRecuperacion(
        //         usuario.getEmail(),
        //         usuario.getNombre(),
        //         enlace
        // );

        return enlace;
    }


    @Transactional
    public void restablecerContrasena(String token, String nuevaPassword) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token inválido o expirado"));

        if (Boolean.TRUE.equals(passwordResetToken.getUsado())
                || passwordResetToken.getFechaExpiracion().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token inválido o expirado");
        }

        Usuario usuario = passwordResetToken.getUsuario();
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);

        passwordResetToken.setUsado(true);
        passwordResetToken.setFechaUso(LocalDateTime.now());
        passwordResetTokenRepository.save(passwordResetToken);

        log.info("Contraseña actualizada para usuario {}", usuario.getEmail());
    }

    private void invalidarTokensActivos(Usuario usuario) {
        List<PasswordResetToken> tokensActivos = passwordResetTokenRepository.findAllByUsuarioAndUsadoFalse(usuario);
        if (tokensActivos.isEmpty()) {
            return;
        }

        LocalDateTime ahora = LocalDateTime.now();
        tokensActivos.forEach(token -> {
            token.setUsado(true);
            token.setFechaUso(ahora);
        });
        passwordResetTokenRepository.saveAll(tokensActivos);
    }

    private String generarToken() {
        return UUID.randomUUID().toString().replace("-", "");
    }

    private String construirEnlaceReseteo(String token) {
        return frontendUrl + "?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
    }
}