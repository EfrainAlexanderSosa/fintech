package com.fintech.msusuarios.dto;

import com.fintech.msusuarios.entity.Usuario;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponse {
    private Long id;
    private String email;
    private String nombre;
    private String apellido;
    private String telefono;
    private String rol;
    private Boolean activo;
    private LocalDateTime fechaRegistro;

    public static UsuarioResponse from(Usuario u) {
        return UsuarioResponse.builder()
                .id(u.getId())
                .email(u.getEmail())
                .nombre(u.getNombre())
                .apellido(u.getApellido())
                .telefono(u.getTelefono())
                .rol(u.getRol().name())
                .activo(u.getActivo())
                .fechaRegistro(u.getFechaRegistro())
                .build();
    }
}
