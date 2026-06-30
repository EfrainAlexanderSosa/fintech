package com.fintech.mstransacciones.client;

import lombok.Data;
import java.math.BigDecimal;

/**
 * DTO que mapea la respuesta de GET /api/cuentas/{id} (ms-cuentas)
 * usado por el FeignClient de ms-transacciones.
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
}
