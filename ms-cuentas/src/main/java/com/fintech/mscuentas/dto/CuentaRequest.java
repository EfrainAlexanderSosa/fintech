package com.fintech.mscuentas.dto;

import com.fintech.mscuentas.entity.Cuenta;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CuentaRequest {

    @NotNull(message = "El usuarioId es obligatorio")
    private Long usuarioId;

    @NotNull(message = "El tipo de cuenta es obligatorio")
    private Cuenta.TipoCuenta tipoCuenta;

    private BigDecimal saldoInicial;
    private String moneda;
    private Cuenta.EstadoCuenta estado;
}
