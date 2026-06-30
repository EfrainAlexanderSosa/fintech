package com.fintech.msprestamos.dto;

import com.fintech.msprestamos.entity.Prestamo;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrestamoResponse {
    private Long id;
    private String numeroPrestamo;
    private Long usuarioId;
    private String nombreUsuario;
    private Long cuentaDesembolsoId;
    private String numeroCuenta;
    private BigDecimal montoSolicitado;
    private BigDecimal montoAprobado;
    private BigDecimal tasaInteres;
    private Integer plazoMeses;
    private BigDecimal cuotaMensual;
    private String tipoPrestamo;
    private String estado;
    private String moneda;
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaAprobacion;
    private LocalDate fechaVencimiento;

    public static PrestamoResponse from(Prestamo p) {
        return PrestamoResponse.builder()
                .id(p.getId())
                .numeroPrestamo(p.getNumeroPrestamo())
                .usuarioId(p.getUsuarioId())
                .nombreUsuario(p.getNombreUsuario())
                .cuentaDesembolsoId(p.getCuentaDesembolsoId())
                .numeroCuenta(p.getNumeroCuenta())
                .montoSolicitado(p.getMontoSolicitado())
                .montoAprobado(p.getMontoAprobado())
                .tasaInteres(p.getTasaInteres())
                .plazoMeses(p.getPlazoMeses())
                .cuotaMensual(p.getCuotaMensual())
                .tipoPrestamo(p.getTipoPrestamo().name())
                .estado(p.getEstado().name())
                .moneda(p.getMoneda())
                .fechaSolicitud(p.getFechaSolicitud())
                .fechaAprobacion(p.getFechaAprobacion())
                .fechaVencimiento(p.getFechaVencimiento())
                .build();
    }
}
