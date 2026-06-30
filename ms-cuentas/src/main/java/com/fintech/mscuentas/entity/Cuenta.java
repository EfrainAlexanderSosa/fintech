package com.fintech.mscuentas.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cuentas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cuenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_cuenta", unique = true, nullable = false, length = 20)
    private String numeroCuenta;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_cuenta", nullable = false)
    private TipoCuenta tipoCuenta;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal saldo;

    @Column(length = 3)
    private String moneda;

    @Enumerated(EnumType.STRING)
    private EstadoCuenta estado;

    @Column(name = "fecha_apertura")
    private LocalDateTime fechaApertura;

    @PrePersist
    public void prePersist() {
        this.fechaApertura = LocalDateTime.now();
        if (this.estado == null) this.estado = EstadoCuenta.ACTIVA;
        if (this.moneda == null) this.moneda = "PEN";
        if (this.saldo == null) this.saldo = BigDecimal.ZERO;
    }

    public enum TipoCuenta {
        AHORROS, CORRIENTE, PLAZO_FIJO
    }

    public enum EstadoCuenta {
        ACTIVA, INACTIVA, BLOQUEADA
    }
}
