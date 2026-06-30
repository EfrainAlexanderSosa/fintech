// ── Usuario ────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  autenticado: boolean;
  mensaje: string;
  usuarioId: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

export interface Usuario {
  id?: number;
  email: string;
  password?: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol: 'ADMIN' | 'CLIENTE';
  activo?: boolean;
  fechaRegistro?: string;
}

// ── Cuenta ─────────────────────────────────────────────────────────────────
export interface Cuenta {
  id?: number;
  numeroCuenta?: string;
  usuarioId: number;
  tipoCuenta: 'AHORROS' | 'CORRIENTE' | 'PLAZO_FIJO';
  saldo?: number;
  saldoInicial?: number;
  moneda?: string;
  estado?: 'ACTIVA' | 'INACTIVA' | 'BLOQUEADA';
  fechaApertura?: string;
}

// ── Transaccion ────────────────────────────────────────────────────────────
export interface Transaccion {
  id?: number;
  cuentaOrigenId: number;
  cuentaDestinoId?: number;
  tipoTransaccion: 'DEPOSITO' | 'RETIRO' | 'TRANSFERENCIA' | 'PAGO';
  monto: number;
  moneda?: string;
  descripcion?: string;
  estado?: 'PENDIENTE' | 'COMPLETADA' | 'FALLIDA' | 'CANCELADA';
  fechaTransaccion?: string;
  numeroReferencia?: string;
}

// ── Prestamo ───────────────────────────────────────────────
export interface Prestamo {
  id?: number;
  numeroPrestamo?: string;
  usuarioId: number;
  nombreUsuario?: string;
  cuentaDesembolsoId: number;
  numeroCuenta?: string;
  montoSolicitado: number;
  montoAprobado?: number;
  tasaInteres: number;
  plazoMeses: number;
  cuotaMensual?: number;
  tipoPrestamo: 'PERSONAL' | 'HIPOTECARIO' | 'VEHICULAR' | 'EMPRESARIAL' | 'CONSUMO';
  estado?: 'PENDIENTE' | 'APROBADO' | 'DESEMBOLSADO' | 'RECHAZADO' | 'PAGADO' | 'VENCIDO';
  moneda?: string;
  fechaSolicitud?: string;
  fechaAprobacion?: string;
  fechaVencimiento?: string;
}
