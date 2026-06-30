package com.fintech.msprestamos.service;

import com.fintech.msprestamos.client.CuentaFeignClient;
import com.fintech.msprestamos.client.UsuarioFeignClient;
import com.fintech.msprestamos.dto.*;
import com.fintech.msprestamos.entity.Prestamo;
import com.fintech.msprestamos.repository.PrestamoRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrestamoService {

    private final PrestamoRepository prestamoRepository;

    // ★ Inyección de FeignClients ★
    private final UsuarioFeignClient usuarioFeignClient;
    private final CuentaFeignClient cuentaFeignClient;

    // ── LISTAR ────────────────────────────────────────────────
    public List<PrestamoResponse> listarTodos() {
        return prestamoRepository.findAll()
                .stream().map(PrestamoResponse::from).collect(Collectors.toList());
    }

    public List<PrestamoResponse> listarPorUsuario(Long usuarioId) {
        return prestamoRepository.findByUsuarioId(usuarioId)
                .stream().map(PrestamoResponse::from).collect(Collectors.toList());
    }

    public PrestamoResponse buscarPorId(Long id) {
        Prestamo p = prestamoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Préstamo no encontrado con id: " + id));
        return PrestamoResponse.from(p);
    }

    // ── CREAR con validación FeignClient ─────────────────────
    public PrestamoResponse crear(PrestamoRequest request) {

        // ★ VALIDACIÓN 1: verificar usuario vía FeignClient → ms-usuarios ★
        log.info("FeignClient → ms-usuarios: verificando usuario id={}", request.getUsuarioId());
        UsuarioClientDTO usuario;
        try {
            usuario = usuarioFeignClient.obtenerUsuarioPorId(request.getUsuarioId());
        } catch (FeignException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Usuario no encontrado con id: " + request.getUsuarioId() +
                    " (consultado via FeignClient en ms-usuarios)");
        } catch (FeignException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "ms-usuarios no disponible. Verifique que esté activo en puerto 8081.");
        }

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El usuario " + usuario.getEmail() + " está inactivo y no puede solicitar préstamos.");
        }
        log.info("FeignClient → ms-usuarios OK: {} {}", usuario.getNombre(), usuario.getApellido());

        // ★ VALIDACIÓN 2: verificar cuenta de desembolso vía FeignClient → ms-cuentas ★
        log.info("FeignClient → ms-cuentas: verificando cuenta id={}", request.getCuentaDesembolsoId());
        CuentaClientDTO cuenta;
        try {
            cuenta = cuentaFeignClient.obtenerCuentaPorId(request.getCuentaDesembolsoId());
        } catch (FeignException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Cuenta no encontrada con id: " + request.getCuentaDesembolsoId() +
                    " (consultado via FeignClient en ms-cuentas)");
        } catch (FeignException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "ms-cuentas no disponible. Verifique que esté activo en puerto 8082.");
        }

        // Verificar que la cuenta pertenece al usuario
        if (!cuenta.getUsuarioId().equals(request.getUsuarioId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La cuenta " + cuenta.getNumeroCuenta() +
                    " no pertenece al usuario con id: " + request.getUsuarioId());
        }

        // Verificar que la cuenta está activa
        if (!"ACTIVA".equals(cuenta.getEstado())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La cuenta " + cuenta.getNumeroCuenta() +
                    " no está activa (estado actual: " + cuenta.getEstado() + ")");
        }
        log.info("FeignClient → ms-cuentas OK: cuenta {} estado={}", cuenta.getNumeroCuenta(), cuenta.getEstado());

        // ── Calcular cuota mensual (sistema francés) ──────────
        BigDecimal cuotaMensual = calcularCuotaMensual(
                request.getMontoSolicitado(),
                request.getTasaInteres(),
                request.getPlazoMeses()
        );

        // ── Construir y guardar préstamo ──────────────────────
        Prestamo prestamo = Prestamo.builder()
                .usuarioId(request.getUsuarioId())
                .nombreUsuario(usuario.getNombre() + " " + usuario.getApellido())
                .cuentaDesembolsoId(request.getCuentaDesembolsoId())
                .numeroCuenta(cuenta.getNumeroCuenta())
                .montoSolicitado(request.getMontoSolicitado())
                .montoAprobado(request.getMontoSolicitado())
                .tasaInteres(request.getTasaInteres())
                .plazoMeses(request.getPlazoMeses())
                .cuotaMensual(cuotaMensual)
                .tipoPrestamo(request.getTipoPrestamo())
                .estado(Prestamo.EstadoPrestamo.PENDIENTE)
                .moneda(request.getMoneda() != null ? request.getMoneda() : "PEN")
                .fechaVencimiento(LocalDate.now().plusMonths(request.getPlazoMeses()))
                .build();

        Prestamo saved = prestamoRepository.save(prestamo);
        log.info("Préstamo {} creado correctamente para usuario {}", saved.getNumeroPrestamo(), usuario.getEmail());

        return PrestamoResponse.from(saved);
    }

    // ── APROBAR ───────────────────────────────────────────────
    public PrestamoResponse aprobar(Long id) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Préstamo no encontrado con id: " + id));

        if (prestamo.getEstado() != Prestamo.EstadoPrestamo.PENDIENTE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Solo se pueden aprobar préstamos en estado PENDIENTE. Estado actual: " + prestamo.getEstado());
        }

        prestamo.setEstado(Prestamo.EstadoPrestamo.APROBADO);
        prestamo.setFechaAprobacion(LocalDateTime.now());

        return PrestamoResponse.from(prestamoRepository.save(prestamo));
    }

    // ── ACTUALIZAR ────────────────────────────────────────────
    public PrestamoResponse actualizar(Long id, PrestamoRequest request) {
        Prestamo prestamo = prestamoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Préstamo no encontrado con id: " + id));

        if (request.getEstado() != null) prestamo.setEstado(request.getEstado());
        if (request.getTasaInteres() != null) prestamo.setTasaInteres(request.getTasaInteres());
        if (request.getPlazoMeses() != null)  prestamo.setPlazoMeses(request.getPlazoMeses());

        return PrestamoResponse.from(prestamoRepository.save(prestamo));
    }

    // ── ELIMINAR ──────────────────────────────────────────────
    public void eliminar(Long id) {
        if (!prestamoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Préstamo no encontrado con id: " + id);
        }
        prestamoRepository.deleteById(id);
    }

    // ── CÁLCULO CUOTA (Sistema Francés) ───────────────────────
    /**
     * Fórmula de cuota fija mensual (amortización francesa):
     * C = P × [i(1+i)^n] / [(1+i)^n - 1]
     *
     * Donde:
     *   P = monto del préstamo
     *   i = tasa de interés mensual (tasa anual / 12 / 100)
     *   n = número de cuotas (plazo en meses)
     */
    private BigDecimal calcularCuotaMensual(BigDecimal monto, BigDecimal tasaAnual, int plazoMeses) {
        BigDecimal tasaMensual = tasaAnual
                .divide(BigDecimal.valueOf(12), 10, RoundingMode.HALF_UP)
                .divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP);

        BigDecimal unoPlusTasa = BigDecimal.ONE.add(tasaMensual);
        BigDecimal factor = unoPlusTasa.pow(plazoMeses, new MathContext(10));

        BigDecimal numerador = monto.multiply(tasaMensual).multiply(factor);
        BigDecimal denominador = factor.subtract(BigDecimal.ONE);

        return numerador.divide(denominador, 2, RoundingMode.HALF_UP);
    }
}
