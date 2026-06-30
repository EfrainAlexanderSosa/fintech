package com.fintech.msprestamos.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO que mapea la respuesta de GET /api/cuentas/{id} (ms-cuentas)
 * usado por FeignClient.
 */
@Data
public class CuentaClientDTO {
    private Long id;
    private String numeroCuenta;
    private Long usuarioId;
    private String tipoCuenta;
    private BigDecimal saldo;
    private String moneda;
    private String estado;
    private LocalDateTime fechaApertura;
}
