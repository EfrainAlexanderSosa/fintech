package com.fintech.mstransacciones.dto;

import com.fintech.mstransacciones.entity.Transaccion;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransaccionRequest {

    @NotNull(message = "La cuenta origen es obligatoria")
    private Long cuentaOrigenId;

    private Long cuentaDestinoId;

    @NotNull(message = "El tipo de transacción es obligatorio")
    private Transaccion.TipoTransaccion tipoTransaccion;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private BigDecimal monto;

    private String moneda;
    private String descripcion;
    private Transaccion.EstadoTransaccion estado;
}
