package com.fintech.mstransacciones;

import com.fintech.mstransacciones.dto.TransaccionRequest;
import com.fintech.mstransacciones.dto.TransaccionResponse;
import com.fintech.mstransacciones.entity.Transaccion;
import com.fintech.mstransacciones.repository.TransaccionRepository;
import com.fintech.mstransacciones.service.TransaccionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransaccionServiceTest {

    @Mock
    private TransaccionRepository transaccionRepository;

    @InjectMocks
    private TransaccionService transaccionService;

    @Test
    void listarTodas_debeRetornarLista() {
        Transaccion t = Transaccion.builder()
                .id(1L).cuentaOrigenId(1L)
                .tipoTransaccion(Transaccion.TipoTransaccion.DEPOSITO)
                .monto(new BigDecimal("500.00")).moneda("PEN")
                .estado(Transaccion.EstadoTransaccion.COMPLETADA)
                .fechaTransaccion(LocalDateTime.now())
                .numeroReferencia("TXN001").build();

        when(transaccionRepository.findAll()).thenReturn(List.of(t));
        List<TransaccionResponse> result = transaccionService.listarTodas();
        assertEquals(1, result.size());
        assertEquals("DEPOSITO", result.get(0).getTipoTransaccion());
    }

    @Test
    void crear_debeRegistrarTransaccion() {
        TransaccionRequest req = new TransaccionRequest();
        req.setCuentaOrigenId(1L);
        req.setTipoTransaccion(Transaccion.TipoTransaccion.RETIRO);
        req.setMonto(new BigDecimal("200.00"));
        req.setMoneda("PEN");
        req.setDescripcion("Retiro en cajero");

        Transaccion saved = Transaccion.builder()
                .id(1L).cuentaOrigenId(1L)
                .tipoTransaccion(Transaccion.TipoTransaccion.RETIRO)
                .monto(new BigDecimal("200.00")).moneda("PEN")
                .descripcion("Retiro en cajero")
                .estado(Transaccion.EstadoTransaccion.COMPLETADA)
                .fechaTransaccion(LocalDateTime.now())
                .numeroReferencia("TXN999").build();

        when(transaccionRepository.save(any())).thenReturn(saved);
        TransaccionResponse resp = transaccionService.crear(req);

        assertNotNull(resp);
        assertEquals("RETIRO", resp.getTipoTransaccion());
        assertEquals(0, new BigDecimal("200.00").compareTo(resp.getMonto()));
    }

    @Test
    void buscarPorIdInexistente_debeLanzarExcepcion() {
        when(transaccionRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResponseStatusException.class, () -> transaccionService.buscarPorId(99L));
    }
}
