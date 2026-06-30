package com.fintech.msprestamos.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO que mapea la respuesta de GET /api/usuarios/{id} (ms-usuarios)
 * usado por FeignClient.
 */
@Data
public class UsuarioClientDTO {
    private Long id;
    private String email;
    private String nombre;
    private String apellido;
    private String telefono;
    private String rol;
    private Boolean activo;
    private LocalDateTime fechaRegistro;
}
