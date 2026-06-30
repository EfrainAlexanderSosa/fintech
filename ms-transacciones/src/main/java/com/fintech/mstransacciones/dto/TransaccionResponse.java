package com.fintech.mstransacciones.dto;

import com.fintech.mstransacciones.entity.Transaccion;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransaccionResponse {
    private Long id;
    private Long cuentaOrigenId;
    private Long cuentaDestinoId;
    private String tipoTransaccion;
    private BigDecimal monto;
    private String moneda;
    private String descripcion;
    private String estado;
    private LocalDateTime fechaTransaccion;
    private String numeroReferencia;

    public static TransaccionResponse from(Transaccion t) {
        return TransaccionResponse.builder()
                .id(t.getId())
                .cuentaOrigenId(t.getCuentaOrigenId())
                .cuentaDestinoId(t.getCuentaDestinoId())
                .tipoTransaccion(t.getTipoTransaccion().name())
                .monto(t.getMonto())
                .moneda(t.getMoneda())
                .descripcion(t.getDescripcion())
                .estado(t.getEstado().name())
                .fechaTransaccion(t.getFechaTransaccion())
                .numeroReferencia(t.getNumeroReferencia())
                .build();
    }
}
