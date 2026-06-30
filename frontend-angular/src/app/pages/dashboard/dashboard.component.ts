import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CuentaService } from '../../services/cuenta.service';
import { TransaccionService } from '../../services/transaccion.service';
import { PrestamoService } from '../../services/prestamo.service';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="page-container dashboard-shell">
      <mat-card class="welcome-banner">
        <div class="welcome-copy">
          <div class="welcome-pill">Banca digital</div>
          <h1>Bienvenido, {{ session?.nombre }}</h1>
          <p>Panel de control · FinTechPro</p>
        </div>
        <span class="badge" [class.badge-secondary]="isAdmin" [class.badge-info]="!isAdmin">
          {{ session?.rol }}
        </span>
      </mat-card>

      <!-- ───── VISTA ADMIN ───── -->
      <ng-container *ngIf="isAdmin">
        <div class="kpi-grid">
          <mat-card class="kpi-card" routerLink="/usuarios">
            <div class="kpi-icon accent-blue"><mat-icon>group</mat-icon></div>
            <div class="kpi-info">
              <div class="kpi-value">{{ totalUsuarios }}</div>
              <div class="kpi-label">Usuarios registrados</div>
            </div>
          </mat-card>
          <mat-card class="kpi-card" routerLink="/cuentas">
            <div class="kpi-icon accent-violet"><mat-icon>account_balance</mat-icon></div>
            <div class="kpi-info">
              <div class="kpi-value">{{ totalCuentas }}</div>
              <div class="kpi-label">Cuentas activas</div>
            </div>
          </mat-card>
          <mat-card class="kpi-card" routerLink="/transacciones">
            <div class="kpi-icon accent-emerald"><mat-icon>swap_horiz</mat-icon></div>
            <div class="kpi-info">
              <div class="kpi-value">{{ totalTransacciones }}</div>
              <div class="kpi-label">Transacciones</div>
            </div>
          </mat-card>
          <mat-card class="kpi-card">
            <div class="kpi-icon accent-amber"><mat-icon>paid</mat-icon></div>
            <div class="kpi-info">
              <div class="kpi-value">S/ {{ totalSaldo | number:'1.2-2' }}</div>
              <div class="kpi-label">Saldo total en cuentas</div>
            </div>
          </mat-card>
        </div>

        <div class="quick-section card">
          <h2>Acceso rápido</h2>
          <div class="quick-grid">
            <a routerLink="/usuarios" class="quick-item">
              <mat-icon>group</mat-icon>
              <div>
                <strong>Gestionar Usuarios</strong>
                <small>Crear, editar y eliminar usuarios del sistema</small>
              </div>
            </a>
            <a routerLink="/cuentas" class="quick-item">
              <mat-icon>account_balance</mat-icon>
              <div>
                <strong>Gestionar Cuentas</strong>
                <small>Administrar cuentas bancarias y saldos</small>
              </div>
            </a>
            <a routerLink="/transacciones" class="quick-item">
              <mat-icon>swap_horiz</mat-icon>
              <div>
                <strong>Ver Transacciones</strong>
                <small>Depósitos, retiros y transferencias</small>
              </div>
            </a>
            <a routerLink="/prestamos" class="quick-item">
              <mat-icon>request_quote</mat-icon>
              <div>
                <strong>Gestionar Préstamos</strong>
                <small>Aprobar, rechazar y administrar préstamos</small>
              </div>
            </a>
          </div>
        </div>

        <div class="card" style="margin-top:20px">
          <h2 style="margin-bottom:16px;font-size:16px;color:#2563eb">Estado de Microservicios</h2>
          <div class="ms-grid">
            <div class="ms-card" *ngFor="let ms of microservicios">
              <div class="ms-dot" [class]="ms.ok ? 'dot-ok' : 'dot-err'"></div>
              <div>
                <strong>{{ ms.nombre }}</strong>
                <small>{{ ms.puerto }}</small>
              </div>
              <span class="badge" [class]="ms.ok ? 'badge-success' : 'badge-danger'">
                {{ ms.ok ? 'Online' : 'Offline' }}
              </span>
            </div>
          </div>
        </div>
      </ng-container>

      <!-- ───── VISTA CLIENTE ───── -->
      <ng-container *ngIf="!isAdmin">
        <div class="kpi-grid">
          <mat-card class="kpi-card" routerLink="/cuentas">
            <div class="kpi-icon accent-violet"><mat-icon>account_balance</mat-icon></div>
            <div class="kpi-info">
              <div class="kpi-value">{{ misCuentas }}</div>
              <div class="kpi-label">Mis cuentas</div>
            </div>
          </mat-card>
          <mat-card class="kpi-card">
            <div class="kpi-icon accent-emerald"><mat-icon>payments</mat-icon></div>
            <div class="kpi-info">
              <div class="kpi-value">S/ {{ miSaldo | number:'1.2-2' }}</div>
              <div class="kpi-label">Saldo total</div>
            </div>
          </mat-card>
          <mat-card class="kpi-card" routerLink="/transacciones">
            <div class="kpi-icon accent-blue"><mat-icon>swap_horiz</mat-icon></div>
            <div class="kpi-info">
              <div class="kpi-value">{{ misTransacciones }}</div>
              <div class="kpi-label">Mis transacciones</div>
            </div>
          </mat-card>
          <mat-card class="kpi-card" routerLink="/prestamos">
            <div class="kpi-icon accent-amber"><mat-icon>request_quote</mat-icon></div>
            <div class="kpi-info">
              <div class="kpi-value">{{ misPrestamos }}</div>
              <div class="kpi-label">Mis préstamos</div>
            </div>
          </mat-card>
        </div>

        <div class="quick-section card">
          <h2>¿Qué deseas hacer?</h2>
          <div class="quick-grid">
            <a routerLink="/cuentas" class="quick-item">
              <mat-icon>account_balance</mat-icon>
              <div>
                <strong>Ver mis cuentas</strong>
                <small>Consulta tus cuentas y saldos disponibles</small>
              </div>
            </a>
            <a routerLink="/transacciones" class="quick-item">
              <mat-icon>swap_horiz</mat-icon>
              <div>
                <strong>Realizar una transacción</strong>
                <small>Depósitos, retiros y transferencias</small>
              </div>
            </a>
            <a routerLink="/prestamos" class="quick-item">
              <mat-icon>request_quote</mat-icon>
              <div>
                <strong>Solicitar un préstamo</strong>
                <small>Revisa tus préstamos o solicita uno nuevo</small>
              </div>
            </a>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .dashboard-shell { display: grid; gap: 18px; }

    .welcome-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      border-radius: 22px;
      padding: 28px 30px;
      background: linear-gradient(135deg, #ffffff 0%, #eff6ff 100%);
      box-shadow: 0 14px 36px rgba(15, 23, 42, .08);
      border: 1px solid rgba(37, 99, 235, .08);
    }

    .welcome-pill {
      display: inline-flex;
      padding: 7px 12px;
      border-radius: 999px;
      background: #e8f1ff;
      color: #1d4ed8;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .4px;
      margin-bottom: 12px;
    }

    .welcome-banner h1 { margin: 0; font-size: 28px; font-weight: 800; color: #0f172a; }
    .welcome-banner p { margin: 6px 0 0; color: #64748b; }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .kpi-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      cursor: pointer;
      border-radius: 18px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, .08);
      border: 1px solid rgba(37, 99, 235, .08);
      transition: transform .15s ease, box-shadow .15s ease;
    }

    .kpi-card:hover { transform: translateY(-2px); box-shadow: 0 16px 36px rgba(15, 23, 42, .10); }
    .kpi-icon {
      width: 56px; height: 56px; border-radius: 16px; display: grid; place-items: center;
      flex-shrink: 0; color: #fff;
    }
    .kpi-icon mat-icon { width: 26px; height: 26px; font-size: 26px; }
    .accent-blue { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
    .accent-violet { background: linear-gradient(135deg, #4f46e5, #7c3aed); }
    .accent-emerald { background: linear-gradient(135deg, #059669, #10b981); }
    .accent-amber { background: linear-gradient(135deg, #d97706, #f59e0b); }
    .kpi-value { font-size: 26px; font-weight: 800; color: #0f172a; line-height: 1.1; }
    .kpi-label { font-size: 12px; color: #64748b; margin-top: 2px; }

    .quick-section h2 { font-size: 16px; font-weight: 700; margin-bottom: 16px; color: #0f172a; }

    .quick-grid { display: grid; gap: 10px; }
    .quick-item {
      display: flex; align-items: center; gap: 14px; padding: 14px 16px;
      background: #f8fafc; border-radius: 14px; text-decoration: none; color: inherit;
      transition: background .15s ease, transform .15s ease;
    }
    .quick-item:hover { background: #eef4ff; transform: translateX(2px); }
    .quick-item mat-icon { color: #2563eb; }
    .quick-item strong { display: block; font-size: 14px; color: #0f172a; }
    .quick-item small { color: #64748b; font-size: 12px; }

    .ms-grid { display: grid; gap: 10px; }
    .ms-card { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #f8fafc; border-radius: 12px; }
    .ms-card strong { display: block; font-size: 13px; }
    .ms-card small { color: #64748b; font-size: 12px; }
    .ms-card .badge { margin-left: auto; }
    .ms-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    .dot-ok  { background: #16a34a; box-shadow: 0 0 0 3px #dcfce7; }
    .dot-err { background: #dc2626; box-shadow: 0 0 0 3px #fee2e2; }

    @media (max-width: 900px) {
      .welcome-banner { align-items: flex-start; flex-direction: column; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  session = this.auth.getSession();
  get isAdmin(): boolean { return this.session?.rol === 'ADMIN'; }

  // Admin stats
  totalUsuarios = 0;
  totalCuentas = 0;
  totalTransacciones = 0;
  totalSaldo = 0;

  // Cliente stats
  misCuentas = 0;
  miSaldo = 0;
  misTransacciones = 0;
  misPrestamos = 0;

  microservicios = [
    { nombre: 'ms-usuarios',      puerto: 'Puerto 8081', ok: false },
    { nombre: 'ms-cuentas',       puerto: 'Puerto 8082', ok: false },
    { nombre: 'ms-transacciones', puerto: 'Puerto 8083', ok: false },
    { nombre: 'ms-prestamos ★ FeignClient', puerto: 'Puerto 8084', ok: false }
  ];

  constructor(
    private auth: AuthService,
    private usuarioSvc: UsuarioService,
    private cuentaSvc: CuentaService,
    private transaccionSvc: TransaccionService,
    private prestamoSvc: PrestamoService
  ) {}

  ngOnInit(): void {
    this.isAdmin ? this.cargarDatosAdmin() : this.cargarDatosCliente();
  }

  cargarDatosAdmin(): void {
    this.usuarioSvc.getAll().subscribe({
      next: (u) => { this.totalUsuarios = u.length; this.microservicios[0].ok = true; },
      error: () => {}
    });
    this.cuentaSvc.getAll().subscribe({
      next: (c) => {
        this.totalCuentas = c.length;
        this.totalSaldo = c.reduce((s, cu) => s + (cu.saldo || 0), 0);
        this.microservicios[1].ok = true;
      },
      error: () => {}
    });
    this.transaccionSvc.getAll().subscribe({
      next: (t) => { this.totalTransacciones = t.length; this.microservicios[2].ok = true; },
      error: () => {}
    });
    this.prestamoSvc.getAll().subscribe({
      next: () => { this.microservicios[3].ok = true; },
      error: () => {}
    });
  }

  cargarDatosCliente(): void {
    const uid = this.session!.usuarioId;
    this.cuentaSvc.getByUsuario(uid).subscribe({
      next: (c) => {
        this.misCuentas = c.length;
        this.miSaldo = c.reduce((s, cu) => s + (cu.saldo || 0), 0);
        // transacciones de todas sus cuentas
        c.forEach(cuenta => {
          this.transaccionSvc.getByCuenta(cuenta.id!).subscribe({
            next: (t) => this.misTransacciones += t.length,
            error: () => {}
          });
        });
      },
      error: () => {}
    });
    this.prestamoSvc.getByUsuario(uid).subscribe({
      next: (p) => this.misPrestamos = p.length,
      error: () => {}
    });
  }
}
