package com.fintech.msusuarios.controller;

import com.fintech.msusuarios.dto.ForgotPasswordRequest;
import com.fintech.msusuarios.dto.ResetPasswordRequest;
import com.fintech.msusuarios.service.PasswordRecoveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios/password")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PasswordRecoveryController {

    private final PasswordRecoveryService passwordRecoveryService;

    @PostMapping("/forgot")
    public ResponseEntity<Map<String, String>> solicitarRecuperacion(
            @Valid @RequestBody ForgotPasswordRequest request) {

        String enlace = passwordRecoveryService
                .solicitarRecuperacion(request.getEmail());

        return ResponseEntity.ok(
                Map.of(
                        "message", "Enlace generado correctamente",
                        "link", enlace != null ? enlace : ""
                )
        );
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> restablecerContrasena(@Valid @RequestBody ResetPasswordRequest request) {
        passwordRecoveryService.restablecerContrasena(request.getToken(), request.getNuevaPassword());
        return ResponseEntity.status(HttpStatus.OK).body(Map.of(
                "message", "Contraseña actualizada correctamente"
        ));
    }
}