package com.fintech.mscuentas.controller;

import com.fintech.mscuentas.dto.CuentaRequest;
import com.fintech.mscuentas.dto.CuentaResponse;
import com.fintech.mscuentas.service.CuentaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/cuentas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CuentaController {

    private final CuentaService cuentaService;

    // GET /api/cuentas
    @GetMapping
    public ResponseEntity<List<CuentaResponse>> listarTodas() {
        return ResponseEntity.ok(cuentaService.listarTodas());
    }

    // GET /api/cuentas/usuario/{usuarioId}
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<CuentaResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(cuentaService.listarPorUsuario(usuarioId));
    }

    // GET /api/cuentas/{id}
    @GetMapping("/{id}")
    public ResponseEntity<CuentaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cuentaService.buscarPorId(id));
    }

    // POST /api/cuentas
    @PostMapping
    public ResponseEntity<CuentaResponse> crear(@Valid @RequestBody CuentaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cuentaService.crear(request));
    }

    // PUT /api/cuentas/{id}
    @PutMapping("/{id}")
    public ResponseEntity<CuentaResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody CuentaRequest request) {
        return ResponseEntity.ok(cuentaService.actualizar(id, request));
    }

    // PATCH /api/cuentas/{id}/saldo?delta=-100.00
    @PutMapping("/{id}/saldo")
    public ResponseEntity<CuentaResponse> actualizarSaldo(
            @PathVariable Long id,
            @RequestParam BigDecimal delta) {
        return ResponseEntity.ok(cuentaService.actualizarSaldo(id, delta));
    }

    // DELETE /api/cuentas/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        cuentaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
