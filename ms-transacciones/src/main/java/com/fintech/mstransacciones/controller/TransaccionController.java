package com.fintech.mstransacciones.controller;

import com.fintech.mstransacciones.dto.TransaccionRequest;
import com.fintech.mstransacciones.dto.TransaccionResponse;
import com.fintech.mstransacciones.service.TransaccionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transacciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransaccionController {

    private final TransaccionService transaccionService;

    // GET /api/transacciones
    @GetMapping
    public ResponseEntity<List<TransaccionResponse>> listarTodas() {
        return ResponseEntity.ok(transaccionService.listarTodas());
    }

    // GET /api/transacciones/cuenta/{cuentaId}
    @GetMapping("/cuenta/{cuentaId}")
    public ResponseEntity<List<TransaccionResponse>> listarPorCuenta(@PathVariable Long cuentaId) {
        return ResponseEntity.ok(transaccionService.listarPorCuenta(cuentaId));
    }

    // GET /api/transacciones/{id}
    @GetMapping("/{id}")
    public ResponseEntity<TransaccionResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(transaccionService.buscarPorId(id));
    }

    // POST /api/transacciones
    @PostMapping
    public ResponseEntity<TransaccionResponse> crear(@Valid @RequestBody TransaccionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transaccionService.crear(request));
    }

    // PUT /api/transacciones/{id}
    @PutMapping("/{id}")
    public ResponseEntity<TransaccionResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody TransaccionRequest request) {
        return ResponseEntity.ok(transaccionService.actualizar(id, request));
    }

    // DELETE /api/transacciones/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        transaccionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
