package com.fintech.msprestamos.dto;

import com.fintech.msprestamos.entity.Prestamo;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PrestamoRequest {

    @NotNull(message = "El usuarioId es obligatorio")
    private Long usuarioId;

    @NotNull(message = "La cuenta de desembolso es obligatoria")
    private Long cuentaDesembolsoId;

    @NotNull(message = "El monto solicitado es obligatorio")
    @DecimalMin(value = "500.00", message = "El monto mínimo es S/ 500.00")
    private BigDecimal montoSolicitado;

    @NotNull(message = "La tasa de interés es obligatoria")
    @DecimalMin(value = "1.00", message = "La tasa mínima es 1%")
    private BigDecimal tasaInteres;

    @NotNull(message = "El plazo en meses es obligatorio")
    @Min(value = 3, message = "El plazo mínimo es 3 meses")
    @Max(value = 360, message = "El plazo máximo es 360 meses")
    private Integer plazoMeses;

    @NotNull(message = "El tipo de préstamo es obligatorio")
    private Prestamo.TipoPrestamo tipoPrestamo;

    private String moneda;
    private Prestamo.EstadoPrestamo estado;
}
