package com.fintech.mscuentas.dto;

import com.fintech.mscuentas.entity.Cuenta;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CuentaResponse {
    private Long id;
    private String numeroCuenta;
    private Long usuarioId;
    private String tipoCuenta;
    private BigDecimal saldo;
    private String moneda;
    private String estado;
    private LocalDateTime fechaApertura;

    public static CuentaResponse from(Cuenta c) {
        return CuentaResponse.builder()
                .id(c.getId())
                .numeroCuenta(c.getNumeroCuenta())
                .usuarioId(c.getUsuarioId())
                .tipoCuenta(c.getTipoCuenta().name())
                .saldo(c.getSaldo())
                .moneda(c.getMoneda())
                .estado(c.getEstado().name())
                .fechaApertura(c.getFechaApertura())
                .build();
    }
}
