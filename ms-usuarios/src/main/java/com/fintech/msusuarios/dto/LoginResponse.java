package com.fintech.msusuarios.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private boolean autenticado;
    private String mensaje;
    private Long usuarioId;
    private String nombre;
    private String apellido;
    private String email;
    private String rol;
}
