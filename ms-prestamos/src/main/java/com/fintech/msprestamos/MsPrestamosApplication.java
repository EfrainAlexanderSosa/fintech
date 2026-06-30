package com.fintech.msprestamos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * ★ @EnableFeignClients activa el escaneo de interfaces
 *   anotadas con @FeignClient en el paquete base.
 *   Sin esta anotación los FeignClients no funcionan.
 */
@SpringBootApplication
@EnableFeignClients
public class MsPrestamosApplication {
    public static void main(String[] args) {
        SpringApplication.run(MsPrestamosApplication.class, args);
    }
}
