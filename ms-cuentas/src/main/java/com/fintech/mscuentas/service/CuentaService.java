package com.fintech.mscuentas.service;

import com.fintech.mscuentas.dto.CuentaRequest;
import com.fintech.mscuentas.dto.CuentaResponse;
import com.fintech.mscuentas.entity.Cuenta;
import com.fintech.mscuentas.repository.CuentaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CuentaService {

    private final CuentaRepository cuentaRepository;

    public List<CuentaResponse> listarTodas() {
        return cuentaRepository.findAll()
                .stream().map(CuentaResponse::from).collect(Collectors.toList());
    }

    public List<CuentaResponse> listarPorUsuario(Long usuarioId) {
        return cuentaRepository.findByUsuarioId(usuarioId)
                .stream().map(CuentaResponse::from).collect(Collectors.toList());
    }

    public CuentaResponse buscarPorId(Long id) {
        Cuenta cuenta = cuentaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Cuenta no encontrada con id: " + id));
        return CuentaResponse.from(cuenta);
    }

    public CuentaResponse crear(CuentaRequest request) {
        String numeroCuenta = generarNumeroCuenta();

        Cuenta cuenta = Cuenta.builder()
                .numeroCuenta(numeroCuenta)
                .usuarioId(request.getUsuarioId())
                .tipoCuenta(request.getTipoCuenta())
                .saldo(request.getSaldoInicial() != null ? request.getSaldoInicial() : BigDecimal.ZERO)
                .moneda(request.getMoneda() != null ? request.getMoneda() : "PEN")
                .estado(request.getEstado() != null ? request.getEstado() : Cuenta.EstadoCuenta.ACTIVA)
                .build();

        return CuentaResponse.from(cuentaRepository.save(cuenta));
    }

    public CuentaResponse actualizar(Long id, CuentaRequest request) {
        Cuenta cuenta = cuentaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Cuenta no encontrada con id: " + id));

        cuenta.setTipoCuenta(request.getTipoCuenta());
        if (request.getSaldoInicial() != null) cuenta.setSaldo(request.getSaldoInicial());
        if (request.getMoneda() != null) cuenta.setMoneda(request.getMoneda());
        if (request.getEstado() != null) cuenta.setEstado(request.getEstado());

        return CuentaResponse.from(cuentaRepository.save(cuenta));
    }

    public void eliminar(Long id) {
        if (!cuentaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cuenta no encontrada con id: " + id);
        }
        cuentaRepository.deleteById(id);
    }

    /**
     * Ajusta el saldo de una cuenta sumando el delta (puede ser negativo para descontar).
     * Usado internamente por ms-transacciones vía FeignClient.
     */
    public CuentaResponse actualizarSaldo(Long id, java.math.BigDecimal delta) {
        Cuenta cuenta = cuentaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Cuenta no encontrada con id: " + id));
        BigDecimal nuevoSaldo = cuenta.getSaldo().add(delta);
        if (nuevoSaldo.compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Saldo insuficiente. Saldo actual: " + cuenta.getSaldo());
        }
        cuenta.setSaldo(nuevoSaldo);
        return CuentaResponse.from(cuentaRepository.save(cuenta));
    }

    private String generarNumeroCuenta() {
        String numero;
        do {
            numero = "FT" + System.currentTimeMillis() % 100000000L;
        } while (cuentaRepository.existsByNumeroCuenta(numero));
        return numero;
    }
}
