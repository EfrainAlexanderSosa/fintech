package com.fintech.mstransacciones.service;

import com.fintech.mstransacciones.client.CuentaClientDTO;
import com.fintech.mstransacciones.client.CuentaFeignClient;
import com.fintech.mstransacciones.dto.TransaccionRequest;
import com.fintech.mstransacciones.dto.TransaccionResponse;
import com.fintech.mstransacciones.entity.Transaccion;
import com.fintech.mstransacciones.repository.TransaccionRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransaccionService {

    private final TransaccionRepository transaccionRepository;
    private final CuentaFeignClient cuentaFeignClient;

    public List<TransaccionResponse> listarTodas() {
        return transaccionRepository.findAll()
                .stream().map(TransaccionResponse::from).collect(Collectors.toList());
    }

    public List<TransaccionResponse> listarPorCuenta(Long cuentaId) {
        return transaccionRepository
                .findByCuentaOrigenIdOrCuentaDestinoId(cuentaId, cuentaId)
                .stream().map(TransaccionResponse::from).collect(Collectors.toList());
    }

    public TransaccionResponse buscarPorId(Long id) {
        Transaccion t = transaccionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Transacción no encontrada con id: " + id));
        return TransaccionResponse.from(t);
    }

    public TransaccionResponse crear(TransaccionRequest request) {

        // ─── Validar cuenta origen y saldo (RETIRO, TRANSFERENCIA y PAGO) ───────
        if (request.getTipoTransaccion() == Transaccion.TipoTransaccion.RETIRO ||
            request.getTipoTransaccion() == Transaccion.TipoTransaccion.TRANSFERENCIA ||
            request.getTipoTransaccion() == Transaccion.TipoTransaccion.PAGO) {

            log.info("FeignClient → ms-cuentas: verificando saldo cuenta id={}",
                    request.getCuentaOrigenId());
            try {
                CuentaClientDTO cuenta = cuentaFeignClient
                        .obtenerCuentaPorId(request.getCuentaOrigenId());

                if (!"ACTIVA".equals(cuenta.getEstado())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "La cuenta " + cuenta.getNumeroCuenta() +
                            " no está activa (estado: " + cuenta.getEstado() + ")");
                }

                if (cuenta.getSaldo().compareTo(request.getMonto()) < 0) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                            "Saldo insuficiente. Saldo disponible: " +
                            cuenta.getSaldo() + " " + cuenta.getMoneda() +
                            ". Monto solicitado: " + request.getMonto());
                }

                log.info("FeignClient → ms-cuentas OK: saldo={} >= monto={}",
                        cuenta.getSaldo(), request.getMonto());

            } catch (FeignException.NotFound e) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Cuenta origen no encontrada con id: " + request.getCuentaOrigenId());
            } catch (ResponseStatusException e) {
                throw e;
            } catch (FeignException e) {
                log.warn("ms-cuentas no disponible, omitiendo validación de saldo: {}", e.getMessage());
            }
        }

        // ─── Persistir la transacción ────────────────────────────────────────────
        Transaccion transaccion = Transaccion.builder()
                .cuentaOrigenId(request.getCuentaOrigenId())
                .cuentaDestinoId(request.getCuentaDestinoId())
                .tipoTransaccion(request.getTipoTransaccion())
                .monto(request.getMonto())
                .moneda(request.getMoneda() != null ? request.getMoneda() : "PEN")
                .descripcion(request.getDescripcion())
                .estado(request.getEstado() != null
                        ? request.getEstado()
                        : Transaccion.EstadoTransaccion.COMPLETADA)
                .build();

        Transaccion saved = transaccionRepository.save(transaccion);
        log.info("Transacción persistida id={} tipo={} monto={}",
                saved.getId(), saved.getTipoTransaccion(), saved.getMonto());

        // ─── Actualizar saldos en ms-cuentas ────────────────────────────────────
        try {
            switch (saved.getTipoTransaccion()) {
                case DEPOSITO:
                    // Acredita en cuenta origen
                    cuentaFeignClient.actualizarSaldo(saved.getCuentaOrigenId(), saved.getMonto());
                    log.info("DEPOSITO: +{} en cuenta {}", saved.getMonto(), saved.getCuentaOrigenId());
                    break;

                case RETIRO:
                    // Debita de cuenta origen
                    cuentaFeignClient.actualizarSaldo(saved.getCuentaOrigenId(), saved.getMonto().negate());
                    log.info("RETIRO: -{} en cuenta {}", saved.getMonto(), saved.getCuentaOrigenId());
                    break;

                case TRANSFERENCIA:
                    // Debita de origen y acredita en destino
                    cuentaFeignClient.actualizarSaldo(saved.getCuentaOrigenId(), saved.getMonto().negate());
                    if (saved.getCuentaDestinoId() != null) {
                        cuentaFeignClient.actualizarSaldo(saved.getCuentaDestinoId(), saved.getMonto());
                    }
                    log.info("TRANSFERENCIA: -{} cuenta {} | +{} cuenta {}",
                            saved.getMonto(), saved.getCuentaOrigenId(),
                            saved.getMonto(), saved.getCuentaDestinoId());
                    break;

                case PAGO:
                    // Debita de cuenta origen
                    cuentaFeignClient.actualizarSaldo(saved.getCuentaOrigenId(), saved.getMonto().negate());
                    log.info("PAGO: -{} en cuenta {}", saved.getMonto(), saved.getCuentaOrigenId());
                    break;
            }
        } catch (FeignException e) {
            // Si ms-cuentas falla después de guardar, marcamos la transacción como PENDIENTE
            log.error("Error actualizando saldo en ms-cuentas: {}. Transacción id={} marcada como PENDIENTE.",
                    e.getMessage(), saved.getId());
            saved.setEstado(Transaccion.EstadoTransaccion.PENDIENTE);
            saved = transaccionRepository.save(saved);
        }

        return TransaccionResponse.from(saved);
    }

    public TransaccionResponse actualizar(Long id, TransaccionRequest request) {
        Transaccion transaccion = transaccionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Transacción no encontrada con id: " + id));
        transaccion.setDescripcion(request.getDescripcion());
        if (request.getEstado() != null) transaccion.setEstado(request.getEstado());
        return TransaccionResponse.from(transaccionRepository.save(transaccion));
    }

    public void eliminar(Long id) {
        if (!transaccionRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Transacción no encontrada con id: " + id);
        }
        transaccionRepository.deleteById(id);
    }
}
