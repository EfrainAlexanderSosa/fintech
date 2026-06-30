package com.fintech.msprestamos.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "prestamos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prestamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_prestamo", unique = true, nullable = false, length = 20)
    private String numeroPrestamo;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "cuenta_desembolso_id", nullable = false)
    private Long cuentaDesembolsoId;

    @Column(name = "monto_solicitado", nullable = false, precision = 15, scale = 2)
    private BigDecimal montoSolicitado;

    @Column(name = "monto_aprobado", precision = 15, scale = 2)
    private BigDecimal montoAprobado;

    @Column(name = "tasa_interes", nullable = false, precision = 5, scale = 2)
    private BigDecimal tasaInteres;

    @Column(name = "plazo_meses", nullable = false)
    private Integer plazoMeses;

    @Column(name = "cuota_mensual", precision = 15, scale = 2)
    private BigDecimal cuotaMensual;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPrestamo estado;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_prestamo", nullable = false)
    private TipoPrestamo tipoPrestamo;

    @Column(length = 3)
    private String moneda;

    @Column(name = "fecha_solicitud")
    private LocalDateTime fechaSolicitud;

    @Column(name = "fecha_aprobacion")
    private LocalDateTime fechaAprobacion;

    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;

    @Column(name = "nombre_usuario", length = 200)
    private String nombreUsuario;

    @Column(name = "numero_cuenta", length = 20)
    private String numeroCuenta;

    @PrePersist
    public void prePersist() {
        this.fechaSolicitud = LocalDateTime.now();
        if (this.estado == null) this.estado = EstadoPrestamo.PENDIENTE;
        if (this.moneda == null) this.moneda = "PEN";
        this.numeroPrestamo = "PRE" + System.currentTimeMillis();
    }

    public enum EstadoPrestamo {
        PENDIENTE, APROBADO, DESEMBOLSADO, RECHAZADO, PAGADO, VENCIDO
    }

    public enum TipoPrestamo {
        PERSONAL, HIPOTECARIO, VEHICULAR, EMPRESARIAL, CONSUMO
    }
}
