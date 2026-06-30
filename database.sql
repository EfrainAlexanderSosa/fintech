-- ============================================================
--  FinTechPro · Script SQL inicial
--  Ejecutar antes de arrancar los microservicios
-- ============================================================

-- 1. Crear bases de datos
CREATE DATABASE IF NOT EXISTS fintech_usuarios
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS fintech_cuentas
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS fintech_transacciones
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ============================================================
--  BASE: fintech_usuarios
-- ============================================================
USE fintech_usuarios;

-- Hibernate creará la tabla con ddl-auto=update.
-- Este INSERT siembra el usuario admin inicial DESPUÉS de que
-- la tabla exista (ejecutar tras el primer arranque de ms-usuarios).

-- Password: admin123  →  BCrypt hash
INSERT IGNORE INTO usuarios
  (email, password, nombre, apellido, telefono, rol, activo, fecha_registro)
VALUES
  ('admin@fintech.pe',
   '$2a$10$N.gYzfKo4BFtXI7Hj/BFMeT3P3MBv3GV2bObJFNGdFYM/5P6.F7ZO',
   'Administrador', 'Sistema', '999000001', 'ADMIN', 1, NOW()),
  ('cliente@fintech.pe',
   '$2a$10$N.gYzfKo4BFtXI7Hj/BFMeT3P3MBv3GV2bObJFNGdFYM/5P6.F7ZO',
   'Carlos', 'Mendoza', '999000002', 'CLIENTE', 1, NOW());

-- ============================================================
--  BASE: fintech_cuentas
-- ============================================================
USE fintech_cuentas;

-- Hibernate crea la tabla. Datos de ejemplo:
INSERT IGNORE INTO cuentas
  (numero_cuenta, usuario_id, tipo_cuenta, saldo, moneda, estado, fecha_apertura)
VALUES
  ('FT10000001', 1, 'CORRIENTE', 50000.00, 'PEN', 'ACTIVA', NOW()),
  ('FT10000002', 2, 'AHORROS',    1500.00, 'PEN', 'ACTIVA', NOW()),
  ('FT10000003', 2, 'AHORROS',     500.00, 'USD', 'ACTIVA', NOW());

-- ============================================================
--  BASE: fintech_transacciones
-- ============================================================
USE fintech_transacciones;

-- Hibernate crea la tabla. Datos de ejemplo:
INSERT IGNORE INTO transacciones
  (cuenta_origen_id, cuenta_destino_id, tipo_transaccion,
   monto, moneda, descripcion, estado, fecha_transaccion, numero_referencia)
VALUES
  (1, NULL, 'DEPOSITO',      5000.00, 'PEN', 'Depósito inicial',           'COMPLETADA', NOW(), 'TXN001'),
  (2, NULL, 'DEPOSITO',       500.00, 'PEN', 'Depósito cliente',           'COMPLETADA', NOW(), 'TXN002'),
  (1, 2,    'TRANSFERENCIA', 1000.00, 'PEN', 'Transferencia entre cuentas','COMPLETADA', NOW(), 'TXN003');

-- ============================================================
--  BASE: fintech_prestamos (ms-prestamos - Puerto 8084)
-- ============================================================
CREATE DATABASE IF NOT EXISTS fintech_prestamos
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE fintech_prestamos;

-- Hibernate crea la tabla. Datos de ejemplo (ejecutar tras primer arranque):
INSERT IGNORE INTO prestamos
  (numero_prestamo, usuario_id, cuenta_desembolso_id, monto_solicitado, monto_aprobado,
   tasa_interes, plazo_meses, cuota_mensual, estado, tipo_prestamo,
   moneda, nombre_usuario, numero_cuenta, fecha_solicitud, fecha_vencimiento)
VALUES
  ('PRE001', 2, 2, 5000.00, 5000.00, 18.00, 12, 458.46,
   'APROBADO', 'PERSONAL', 'PEN', 'Carlos Mendoza', 'FT10000002',
   NOW(), DATE_ADD(NOW(), INTERVAL 12 MONTH)),
  ('PRE002', 2, 2, 15000.00, 15000.00, 14.50, 36, 517.80,
   'PENDIENTE', 'VEHICULAR', 'PEN', 'Carlos Mendoza', 'FT10000002',
   NOW(), DATE_ADD(NOW(), INTERVAL 36 MONTH));
