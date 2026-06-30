package com.fintech.msprestamos.repository;

import com.fintech.msprestamos.entity.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {
    List<Prestamo> findByUsuarioId(Long usuarioId);
    List<Prestamo> findByEstado(Prestamo.EstadoPrestamo estado);
    boolean existsByNumeroPrestamo(String numeroPrestamo);
}
