package com.fintech.msprestamos.client;

import com.fintech.msprestamos.dto.CuentaClientDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * ★ FeignClient → ms-cuentas (Puerto 8082) ★
 *
 * Permite que ms-prestamos verifique que la cuenta de desembolso
 * existe, pertenece al usuario solicitante y está ACTIVA
 * antes de registrar el préstamo.
 *
 * @FeignClient:
 *   - name: identificador lógico del cliente
 *   - url:  URL base del microservicio destino (desde application.properties)
 */
@FeignClient(name = "ms-cuentas", url = "${feign.client.ms-cuentas.url}")
public interface CuentaFeignClient {

    /**
     * Consulta los datos de la cuenta de desembolso en ms-cuentas.
     * Mapea: GET http://localhost:8082/api/cuentas/{id}
     */
    @GetMapping("/api/cuentas/{id}")
    CuentaClientDTO obtenerCuentaPorId(@PathVariable("id") Long id);
}
