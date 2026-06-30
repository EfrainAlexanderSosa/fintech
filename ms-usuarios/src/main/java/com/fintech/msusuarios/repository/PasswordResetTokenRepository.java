package com.fintech.msusuarios.repository;

import com.fintech.msusuarios.entity.PasswordResetToken;
import com.fintech.msusuarios.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    List<PasswordResetToken> findAllByUsuarioAndUsadoFalse(Usuario usuario);
}