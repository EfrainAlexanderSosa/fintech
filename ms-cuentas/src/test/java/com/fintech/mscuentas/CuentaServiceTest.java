package com.fintech.mscuentas;

import com.fintech.mscuentas.dto.CuentaRequest;
import com.fintech.mscuentas.dto.CuentaResponse;
import com.fintech.mscuentas.entity.Cuenta;
import com.fintech.mscuentas.repository.CuentaRepository;
import com.fintech.mscuentas.service.CuentaService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CuentaServiceTest {

    @Mock
    private CuentaRepository cuentaRepository;

    @InjectMocks
    private CuentaService cuentaService;

    @Test
    void listarTodas_debeRetornarLista() {
        Cuenta c = Cuenta.builder()
                .id(1L).numeroCuenta("FT001").usuarioId(1L)
                .tipoCuenta(Cuenta.TipoCuenta.AHORROS).saldo(BigDecimal.ZERO)
                .moneda("PEN").estado(Cuenta.EstadoCuenta.ACTIVA).build();
        when(cuentaRepository.findAll()).thenReturn(List.of(c));

        List<CuentaResponse> result = cuentaService.listarTodas();
        assertEquals(1, result.size());
        assertEquals("FT001", result.get(0).getNumeroCuenta());
    }

    @Test
    void buscarPorIdInexistente_debeLanzarExcepcion() {
        when(cuentaRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> cuentaService.buscarPorId(999L));
    }

    @Test
    void crear_debeRetornarCuentaCreada() {
        CuentaRequest req = new CuentaRequest();
        req.setUsuarioId(1L);
        req.setTipoCuenta(Cuenta.TipoCuenta.CORRIENTE);
        req.setSaldoInicial(new BigDecimal("1000.00"));
        req.setMoneda("PEN");

        Cuenta saved = Cuenta.builder()
                .id(1L).numeroCuenta("FT12345").usuarioId(1L)
                .tipoCuenta(Cuenta.TipoCuenta.CORRIENTE)
                .saldo(new BigDecimal("1000.00")).moneda("PEN")
                .estado(Cuenta.EstadoCuenta.ACTIVA).build();

        when(cuentaRepository.existsByNumeroCuenta(any())).thenReturn(false);
        when(cuentaRepository.save(any())).thenReturn(saved);

        CuentaResponse resp = cuentaService.crear(req);
        assertNotNull(resp);
        assertEquals("CORRIENTE", resp.getTipoCuenta());
    }
}
