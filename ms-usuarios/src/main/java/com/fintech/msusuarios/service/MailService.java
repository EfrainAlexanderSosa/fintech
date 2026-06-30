package com.fintech.msusuarios.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:no-reply@fintech.pe}")
    private String from;

    public void enviarCorreoRecuperacion(String destinatario, String nombre, String enlaceReseteo) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(destinatario);
        message.setSubject("Recuperación de contraseña");
        message.setText("Hola " + nombre + ",\n\n"
                + "Recibimos una solicitud para restablecer tu contraseña.\n"
                + "Ingresa al siguiente enlace para crear una nueva contraseña:\n\n"
                + enlaceReseteo + "\n\n"
                + "Si no solicitaste este cambio, ignora este correo.");

        mailSender.send(message);
        log.info("Correo de recuperación enviado a {}", destinatario);
    }
}