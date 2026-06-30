package com.fintech.msprestamos.controller;

import com.fintech.msprestamos.dto.PrestamoRequest;
import com.fintech.msprestamos.dto.PrestamoResponse;
import com.fintech.msprestamos.service.PrestamoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/prestamos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PrestamoController {

    private final PrestamoService prestamoService;

    // GET /api/prestamos
    @GetMapping
    public ResponseEntity<List<PrestamoResponse>> listarTodos() {
        return ResponseEntity.ok(prestamoService.listarTodos());
    }

    // GET /api/prestamos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<PrestamoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(prestamoService.buscarPorId(id));
    }

    // GET /api/prestamos/usuario/{usuarioId}
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PrestamoResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(prestamoService.listarPorUsuario(usuarioId));
    }

    // POST /api/prestamos
    // ★ Aquí se disparan los FeignClients hacia ms-usuarios y ms-cuentas ★
    @PostMapping
    public ResponseEntity<PrestamoResponse> crear(@Valid @RequestBody PrestamoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(prestamoService.crear(request));
    }

    // PUT /api/prestamos/{id}/aprobar
    @PutMapping("/{id}/aprobar")
    public ResponseEntity<PrestamoResponse> aprobar(@PathVariable Long id) {
        return ResponseEntity.ok(prestamoService.aprobar(id));
    }

    // PUT /api/prestamos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<PrestamoResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody PrestamoRequest request) {
        return ResponseEntity.ok(prestamoService.actualizar(id, request));
    }

    // DELETE /api/prestamos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        prestamoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
