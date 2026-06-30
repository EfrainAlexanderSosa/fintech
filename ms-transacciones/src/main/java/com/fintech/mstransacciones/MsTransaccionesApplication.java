package com.fintech.mstransacciones;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * ★ @EnableFeignClients activa CuentaFeignClient para
 *   validar saldo antes de registrar retiros/transferencias.
 */
@SpringBootApplication
@EnableFeignClients
public class MsTransaccionesApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsTransaccionesApplication.class, args);
    }
}
