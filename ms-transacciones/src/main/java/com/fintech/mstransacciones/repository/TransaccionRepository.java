package com.fintech.mstransacciones.repository;

import com.fintech.mstransacciones.entity.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {
    List<Transaccion> findByCuentaOrigenIdOrCuentaDestinoId(Long cuentaOrigenId, Long cuentaDestinoId);
    List<Transaccion> findByCuentaOrigenId(Long cuentaOrigenId);
}
