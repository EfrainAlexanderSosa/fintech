package com.fintech.msprestamos;

import com.fintech.msprestamos.client.CuentaFeignClient;
import com.fintech.msprestamos.client.UsuarioFeignClient;
import com.fintech.msprestamos.dto.*;
import com.fintech.msprestamos.entity.Prestamo;
import com.fintech.msprestamos.repository.PrestamoRepository;
import com.fintech.msprestamos.service.PrestamoService;
import feign.FeignException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PrestamoServiceTest {

    @Mock private PrestamoRepository prestamoRepository;
    @Mock private UsuarioFeignClient usuarioFeignClient;
    @Mock private CuentaFeignClient cuentaFeignClient;

    @InjectMocks private PrestamoService prestamoService;

    private UsuarioClientDTO usuarioMock;
    private CuentaClientDTO cuentaMock;
    private PrestamoRequest request;

    @BeforeEach
    void setUp() {
        usuarioMock = new UsuarioClientDTO();
        usuarioMock.setId(1L);
        usuarioMock.setNombre("Carlos");
        usuarioMock.setApellido("Mendoza");
        usuarioMock.setEmail("carlos@fintech.pe");
        usuarioMock.setActivo(true);

        cuentaMock = new CuentaClientDTO();
        cuentaMock.setId(1L);
        cuentaMock.setNumeroCuenta("FT10000001");
        cuentaMock.setUsuarioId(1L);
        cuentaMock.setEstado("ACTIVA");

        request = new PrestamoRequest();
        request.setUsuarioId(1L);
        request.setCuentaDesembolsoId(1L);
        request.setMontoSolicitado(new BigDecimal("5000.00"));
        request.setTasaInteres(new BigDecimal("18.00"));
        request.setPlazoMeses(12);
        request.setTipoPrestamo(Prestamo.TipoPrestamo.PERSONAL);
        request.setMoneda("PEN");
    }

    @Test
    void crear_conDatosValidos_debeRetornarPrestamo() {
        Prestamo saved = Prestamo.builder()
                .id(1L).numeroPrestamo("PRE123")
                .usuarioId(1L).nombreUsuario("Carlos Mendoza")
                .cuentaDesembolsoId(1L).numeroCuenta("FT10000001")
                .montoSolicitado(new BigDecimal("5000.00"))
                .montoAprobado(new BigDecimal("5000.00"))
                .tasaInteres(new BigDecimal("18.00"))
                .plazoMeses(12)
                .cuotaMensual(new BigDecimal("458.46"))
                .tipoPrestamo(Prestamo.TipoPrestamo.PERSONAL)
                .estado(Prestamo.EstadoPrestamo.PENDIENTE)
                .moneda("PEN").build();

        // ★ Mock de FeignClients ★
        when(usuarioFeignClient.obtenerUsuarioPorId(1L)).thenReturn(usuarioMock);
        when(cuentaFeignClient.obtenerCuentaPorId(1L)).thenReturn(cuentaMock);
        when(prestamoRepository.save(any())).thenReturn(saved);

        PrestamoResponse resp = prestamoService.crear(request);

        assertNotNull(resp);
        assertEquals("Carlos Mendoza", resp.getNombreUsuario());
        assertEquals("FT10000001", resp.getNumeroCuenta());
        assertEquals("PENDIENTE", resp.getEstado());

        // Verificar que los FeignClients fueron llamados
        verify(usuarioFeignClient, times(1)).obtenerUsuarioPorId(1L);
        verify(cuentaFeignClient, times(1)).obtenerCuentaPorId(1L);
    }

    @Test
    void crear_usuarioNoExiste_debeLanzar404() {
        when(usuarioFeignClient.obtenerUsuarioPorId(999L))
                .thenThrow(FeignException.NotFound.class);
        request.setUsuarioId(999L);

        assertThrows(ResponseStatusException.class, () -> prestamoService.crear(request));
        verify(cuentaFeignClient, never()).obtenerCuentaPorId(any());
    }

    @Test
    void crear_usuarioInactivo_debeLanzarBadRequest() {
        usuarioMock.setActivo(false);
        when(usuarioFeignClient.obtenerUsuarioPorId(1L)).thenReturn(usuarioMock);

        assertThrows(ResponseStatusException.class, () -> prestamoService.crear(request));
        verify(cuentaFeignClient, never()).obtenerCuentaPorId(any());
    }

    @Test
    void crear_cuentaNoPertenece_debeLanzarBadRequest() {
        cuentaMock.setUsuarioId(99L); // cuenta de otro usuario
        when(usuarioFeignClient.obtenerUsuarioPorId(1L)).thenReturn(usuarioMock);
        when(cuentaFeignClient.obtenerCuentaPorId(1L)).thenReturn(cuentaMock);

        assertThrows(ResponseStatusException.class, () -> prestamoService.crear(request));
    }

    @Test
    void crear_cuentaBloqueada_debeLanzarBadRequest() {
        cuentaMock.setEstado("BLOQUEADA");
        when(usuarioFeignClient.obtenerUsuarioPorId(1L)).thenReturn(usuarioMock);
        when(cuentaFeignClient.obtenerCuentaPorId(1L)).thenReturn(cuentaMock);

        assertThrows(ResponseStatusException.class, () -> prestamoService.crear(request));
    }

    @Test
    void listarTodos_debeRetornarLista() {
        when(prestamoRepository.findAll()).thenReturn(List.of());
        List<PrestamoResponse> result = prestamoService.listarTodos();
        assertNotNull(result);
        verify(prestamoRepository).findAll();
    }

    @Test
    void buscarPorIdInexistente_debeLanzar404() {
        when(prestamoRepository.findById(999L)).thenReturn(java.util.Optional.empty());
        assertThrows(ResponseStatusException.class, () -> prestamoService.buscarPorId(999L));
    }
}
