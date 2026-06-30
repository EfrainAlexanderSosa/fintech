package com.fintech.msprestamos.client;

import com.fintech.msprestamos.dto.UsuarioClientDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * ★ FeignClient → ms-usuarios (Puerto 8081) ★
 *
 * Permite que ms-prestamos consulte datos de usuarios
 * declarativamente, sin escribir código HTTP manual.
 *
 * @FeignClient:
 *   - name: identificador lógico del cliente
 *   - url:  URL base del microservicio destino (desde application.properties)
 */
@FeignClient(name = "ms-usuarios", url = "${feign.client.ms-usuarios.url}")
public interface UsuarioFeignClient {

    /**
     * Consulta si el usuario existe y está activo en ms-usuarios.
     * Mapea: GET http://localhost:8081/api/usuarios/{id}
     */
    @GetMapping("/api/usuarios/{id}")
    UsuarioClientDTO obtenerUsuarioPorId(@PathVariable("id") Long id);
}
