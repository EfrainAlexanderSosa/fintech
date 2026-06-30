import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrestamoService } from '../../services/prestamo.service';
import { CuentaService } from '../../services/cuenta.service';
import { AuthService } from '../../services/auth.service';
import { Prestamo, Cuenta } from '../../models/models';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule
  ],
  template: `
    <div class="page-container prestamos-page">
      <mat-card class="hero-card">
        <div class="hero-copy">
          <div class="eyebrow">Banca digital</div>
          <h1>{{ isAdmin ? 'Gestión de Préstamos' : 'Mis Préstamos' }}</h1>
          <p>
            Seguimiento claro de solicitudes, aprobaciones y desembolsos con una experiencia más limpia,
            consistente y profesional.
          </p>
        </div>
        <div class="hero-actions">
          <button mat-raised-button color="primary" (click)="abrirModal()">
            <mat-icon>add</mat-icon>
            {{ isAdmin ? 'Nuevo préstamo' : 'Solicitar préstamo' }}
          </button>
        </div>
      </mat-card>

      <div class="kpi-grid">
        <mat-card class="kpi-card soft-blue">
          <div class="kpi-label">Préstamos</div>
          <div class="kpi-value">{{ totalPrestamos }}</div>
          <div class="kpi-hint">Registrados en el sistema</div>
        </mat-card>
        <mat-card class="kpi-card soft-amber">
          <div class="kpi-label">Pendientes</div>
          <div class="kpi-value">{{ totalPendientes }}</div>
          <div class="kpi-hint">En revisión o espera</div>
        </mat-card>
        <mat-card class="kpi-card soft-emerald">
          <div class="kpi-label">Monto solicitado</div>
          <div class="kpi-value">{{ monedaPrincipal }} {{ montoSolicitadoTotal | number:'1.2-2' }}</div>
          <div class="kpi-hint">Acumulado de la cartera</div>
        </mat-card>
      </div>

      <mat-card class="notice-card admin-notice" *ngIf="isAdmin">
        <mat-icon>link</mat-icon>
        <div>
          <strong>FeignClient activo</strong>
          <p>
            Al crear un préstamo, ms-prestamos consulta ms-usuarios y ms-cuentas para validar usuario activo,
            cuenta activa y pertenencia.
          </p>
        </div>
      </mat-card>

      <mat-card class="notice-card client-notice" *ngIf="!isAdmin">
        <mat-icon>info</mat-icon>
        <div>
          <strong>Solicitud guiada</strong>
          <p>
            Puedes solicitar préstamos personales, vehiculares y más con una interfaz más clara y orientada a completar el flujo sin fricción.
          </p>
        </div>
      </mat-card>

      <mat-card class="table-card">
        <div class="table-header">
          <div>
            <h2>Listado de préstamos</h2>
            <p>Vista responsive con acciones más accesibles y jerarquía visual más clara.</p>
          </div>
          <button mat-stroked-button color="primary" (click)="cargarPrestamos()">
            <mat-icon>refresh</mat-icon>
            Actualizar
          </button>
        </div>

        <div class="table-wrapper">
          <table mat-table [dataSource]="prestamos" class="prestamo-table" aria-label="Tabla de préstamos">
            <ng-container matColumnDef="numeroPrestamo">
              <th mat-header-cell *matHeaderCellDef>N° préstamo</th>
              <td mat-cell *matCellDef="let p">
                <span class="mono-pill">{{ p.numeroPrestamo || ('#' + p.id) }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="usuario" *ngIf="isAdmin">
              <th mat-header-cell *matHeaderCellDef>Usuario</th>
              <td mat-cell *matCellDef="let p">
                <div class="user-cell">
                  <strong>{{ p.nombreUsuario || 'Usuario #' + p.usuarioId }}</strong>
                  <span>ID {{ p.usuarioId }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="cuenta">
              <th mat-header-cell *matHeaderCellDef>Cuenta</th>
              <td mat-cell *matCellDef="let p">
                <div class="account-cell">
                  <strong>{{ p.numeroCuenta || ('Cuenta #' + p.cuentaDesembolsoId) }}</strong>
                  <span>{{ p.moneda || 'PEN' }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="tipo">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let p">
                <span class="type-chip">{{ p.tipoPrestamo }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="monto">
              <th mat-header-cell *matHeaderCellDef>Monto</th>
              <td mat-cell *matCellDef="let p">
                <strong>{{ p.moneda }} {{ p.montoSolicitado | number:'1.2-2' }}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="tasa">
              <th mat-header-cell *matHeaderCellDef>Tasa</th>
              <td mat-cell *matCellDef="let p">{{ p.tasaInteres }}%</td>
            </ng-container>

            <ng-container matColumnDef="plazo">
              <th mat-header-cell *matHeaderCellDef>Plazo</th>
              <td mat-cell *matCellDef="let p">{{ p.plazoMeses }} meses</td>
            </ng-container>

            <ng-container matColumnDef="cuota">
              <th mat-header-cell *matHeaderCellDef>Cuota</th>
              <td mat-cell *matCellDef="let p">
                <strong>{{ p.moneda }} {{ p.cuotaMensual | number:'1.2-2' }}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let p">
                <span class="status-chip" [ngClass]="estadoClase(p.estado)">
                  {{ p.estado || 'PENDIENTE' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let p">
                <div class="actions-cell" *ngIf="isAdmin; else clienteActions">
                  <button
                    *ngIf="p.estado === 'PENDIENTE'"
                    mat-icon-button
                    color="primary"
                    matTooltip="Aprobar préstamo"
                    (click)="aprobarPrestamo(p.id!)">
                    <mat-icon>task_alt</mat-icon>
                  </button>
                  <button mat-icon-button color="primary" matTooltip="Editar préstamo" (click)="editarPrestamo(p)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" matTooltip="Eliminar préstamo" (click)="eliminarPrestamo(p.id!)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
                <ng-template #clienteActions>
                  <div class="actions-cell">
                    <button
                      *ngIf="p.estado === 'PENDIENTE'"
                      mat-stroked-button
                      color="warn"
                      (click)="eliminarPrestamo(p.id!)">
                      Cancelar
                    </button>
                    <span *ngIf="p.estado !== 'PENDIENTE'" class="muted-action">Sin acciones disponibles</span>
                  </div>
                </ng-template>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>

          <div class="loading-overlay" *ngIf="loading">
            <mat-progress-spinner diameter="42" mode="indeterminate"></mat-progress-spinner>
            <span>Cargando préstamos...</span>
          </div>

          <div class="empty-state" *ngIf="!loading && prestamos.length === 0">
            <mat-icon>account_balance_wallet</mat-icon>
            <h3>{{ isAdmin ? 'No hay préstamos registrados' : 'No tienes préstamos solicitados' }}</h3>
            <p>Cuando existan registros, se mostrarán aquí con una vista más limpia y legible.</p>
          </div>
        </div>
      </mat-card>
    </div>

    <ng-template #loanDialog>
      <h2 mat-dialog-title>{{ modoEdicion ? 'Editar préstamo' : (isAdmin ? 'Nuevo préstamo' : 'Solicitar préstamo') }}</h2>
      <mat-dialog-content class="dialog-content">
        <form #prestamoForm="ngForm" class="dialog-form">
        

        <div class="dialog-grid">
          <mat-form-field appearance="outline" *ngIf="isAdmin">
            <mat-label>ID Usuario</mat-label>
            <input matInput type="number" [(ngModel)]="form.usuarioId" name="usuarioId" placeholder="1" required min="1" #usuarioIdModel="ngModel" />
            <mat-error *ngIf="usuarioIdModel.invalid && (usuarioIdModel.dirty || usuarioIdModel.touched)">Ingrese un ID válido mayor que 0.</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="isAdmin">
            <mat-label>ID Cuenta Desembolso</mat-label>
            <input matInput type="number" [(ngModel)]="form.cuentaDesembolsoId" name="cuentaDesembolsoId" placeholder="1" required min="1" #cuentaDesembolsoAdminModel="ngModel" />
            <mat-error *ngIf="cuentaDesembolsoAdminModel.invalid && (cuentaDesembolsoAdminModel.dirty || cuentaDesembolsoAdminModel.touched)">Ingrese un ID válido mayor que 0.</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" [class.full-width]="!isAdmin" *ngIf="!isAdmin">
            <mat-label>Cuenta de desembolso</mat-label>
            <mat-select [(ngModel)]="form.cuentaDesembolsoId" name="cuentaDesembolsoId" required #cuentaDesembolsoClientModel="ngModel">
              <mat-option [value]="0" disabled>Selecciona una cuenta</mat-option>
              <mat-option *ngFor="let c of misCuentas" [value]="c.id">
                {{ c.numeroCuenta }} · {{ c.tipoCuenta }} · {{ c.moneda }} {{ c.saldo | number:'1.2-2' }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="cuentaDesembolsoClientModel.invalid && (cuentaDesembolsoClientModel.dirty || cuentaDesembolsoClientModel.touched)">Seleccione una cuenta de desembolso.</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Tipo de préstamo</mat-label>
            <mat-select [(ngModel)]="form.tipoPrestamo" name="tipoPrestamo" required #tipoPrestamoModel="ngModel">
              <mat-option value="PERSONAL">PERSONAL</mat-option>
              <mat-option value="HIPOTECARIO">HIPOTECARIO</mat-option>
              <mat-option value="VEHICULAR">VEHICULAR</mat-option>
              <mat-option value="EMPRESARIAL" *ngIf="isAdmin">EMPRESARIAL</mat-option>
              <mat-option value="CONSUMO">CONSUMO</mat-option>
            </mat-select>
            <mat-error *ngIf="tipoPrestamoModel.invalid && (tipoPrestamoModel.dirty || tipoPrestamoModel.touched)">Seleccione un tipo de préstamo.</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Moneda</mat-label>
            <mat-select [(ngModel)]="form.moneda" name="moneda" required #monedaModel="ngModel">
              <mat-option value="PEN">PEN - Soles</mat-option>
              <mat-option value="USD">USD - Dólares</mat-option>
            </mat-select>
            <mat-error *ngIf="monedaModel.invalid && (monedaModel.dirty || monedaModel.touched)">Seleccione una moneda.</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Monto solicitado</mat-label>
            <input matInput type="number" [(ngModel)]="form.montoSolicitado" name="montoSolicitado" placeholder="5000.00" step="100" required min="100" #montoSolicitadoModel="ngModel" />
            <mat-error *ngIf="montoSolicitadoModel.invalid && (montoSolicitadoModel.dirty || montoSolicitadoModel.touched)">El monto debe ser mayor o igual a 100.</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Tasa de interés anual (%)</mat-label>
            <input matInput type="number" [(ngModel)]="form.tasaInteres" name="tasaInteres" placeholder="18.00" step="0.5" required min="0" max="100" [readonly]="!isAdmin" #tasaInteresModel="ngModel" />
            <mat-error *ngIf="tasaInteresModel.invalid && (tasaInteresModel.dirty || tasaInteresModel.touched)">La tasa debe estar entre 0 y 100.</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Plazo en meses</mat-label>
            <input matInput type="number" [(ngModel)]="form.plazoMeses" name="plazoMeses" placeholder="12" min="3" max="360" required #plazoMesesModel="ngModel" />
            <mat-error *ngIf="plazoMesesModel.invalid && (plazoMesesModel.dirty || plazoMesesModel.touched)">El plazo debe estar entre 3 y 360 meses.</mat-error>
          </mat-form-field>
        </div>

        <mat-card class="preview-card" *ngIf="form.montoSolicitado && form.tasaInteres && form.plazoMeses">
          <div>
            <span class="preview-label">Cuota mensual estimada</span>
            <strong>{{ form.moneda }} {{ calcularCuota() | number:'1.2-2' }}</strong>
          </div>
          <span class="preview-note">Estimación referencial antes de enviar la solicitud.</span>
        </mat-card>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button (click)="cerrarModal()">Cancelar</button>
        <button mat-raised-button color="primary" (click)="guardar()" [disabled]="guardando || prestamoForm.invalid">
          {{ guardando ? (isAdmin ? 'Verificando...' : 'Enviando...') : (modoEdicion ? 'Actualizar' : (isAdmin ? 'Registrar' : 'Solicitar')) }}
        </button>
      </mat-dialog-actions>
    </ng-template>
  `,
  styles: [`
    :host { display: block; }

    .prestamos-page { display: grid; gap: 18px; }

    .hero-card,
    .table-card,
    .notice-card,
    .preview-card,
    .kpi-card {
      border-radius: 20px;
      box-shadow: 0 14px 40px rgba(15, 23, 42, 0.08);
      border: 1px solid rgba(37, 99, 235, 0.08);
    }

    .hero-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      background: linear-gradient(135deg, #ffffff 0%, #f7faff 100%);
    }

    .hero-copy h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
    }

    .hero-copy .eyebrow {
      display: inline-flex;
      align-items: center;
      padding: 6px 12px;
      margin-bottom: 12px;
      border-radius: 999px;
      background: #e8f1ff;
      color: #1d4ed8;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.3px;
      text-transform: uppercase;
    }

    .hero-copy p,
    .table-header p,
    .notice-card p,
    .dialog-hint,
    .empty-state p,
    .kpi-hint,
    .preview-note {
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .kpi-card { padding: 18px 20px; background: #ffffff; }
    .kpi-card.soft-blue { background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%); }
    .kpi-card.soft-amber { background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%); }
    .kpi-card.soft-emerald { background: linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%); }

    .kpi-label {
      color: #64748b;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-bottom: 10px;
    }

    .kpi-value {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.1;
      margin-bottom: 6px;
    }

    .notice-card {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 16px 18px;
    }

    .notice-card mat-icon {
      color: #2563eb;
      background: #eff6ff;
      border-radius: 12px;
      padding: 10px;
    }

    .admin-notice { background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%); }
    .client-notice { background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%); }

    .notice-card strong,
    .table-header h2,
    .empty-state h3,
    .preview-card strong { color: #0f172a; }

    .table-card { padding: 20px; }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 18px;
    }

    .table-header h2 {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 700;
    }

    .table-wrapper {
      position: relative;
      overflow: auto;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
    }

    table.prestamo-table {
      width: 100%;
      min-width: 980px;
      background: #ffffff;
    }

    .prestamo-table th {
      font-size: 12px;
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      background: #f8fafc;
    }

    .prestamo-table td,
    .prestamo-table th { padding-inline: 16px; }

    .mono-pill,
    .type-chip,
    .status-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.2px;
      padding: 6px 12px;
      white-space: nowrap;
    }

    .mono-pill { background: #eff6ff; color: #1d4ed8; }
    .type-chip { background: #f1f5f9; color: #334155; }
    .status-chip.status-pendiente { background: #fef3c7; color: #92400e; }
    .status-chip.status-aprobado,
    .status-chip.status-desembolsado { background: #dcfce7; color: #166534; }
    .status-chip.status-pagado { background: #dbeafe; color: #1d4ed8; }
    .status-chip.status-rechazado,
    .status-chip.status-vencido { background: #fee2e2; color: #b91c1c; }
    .status-chip.status-default { background: #e2e8f0; color: #475569; }

    .user-cell,
    .account-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-cell span,
    .account-cell span,
    .muted-action {
      color: #94a3b8;
      font-size: 12px;
    }

    .actions-cell {
      display: flex;
      align-items: center;
    }

    .loading-overlay,
    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 10px;
      padding: 28px;
      text-align: center;
    }

    .loading-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(2px);
      z-index: 1;
    }

    .empty-state mat-icon {
      font-size: 44px;
      color: #94a3b8;
    }

    .dialog-content {
      display: grid;
      gap: 18px;
      min-width: min(760px, 92vw);
    }

    .dialog-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .full-width { grid-column: 1 / -1; }

    .preview-card {
      padding: 16px 18px;
      background: linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .preview-label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      color: #64748b;
      margin-bottom: 4px;
    }

    @media (max-width: 960px) {
      .hero-card {
        align-items: flex-start;
        flex-direction: column;
      }

      .kpi-grid,
      .dialog-grid { grid-template-columns: 1fr; }

      .table-header {
        align-items: flex-start;
        flex-direction: column;
      }

      .preview-card {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `]
})
export class PrestamosComponent implements OnInit {
  prestamos: Prestamo[] = [];
  misCuentas: Cuenta[] = [];
  loading = true;
  showModal = false;
  modoEdicion = false;
  guardando = false;
  mensaje = '';
  esError = false;
  editandoId: number | null = null;
  dialogRef: MatDialogRef<unknown> | null = null;

  @ViewChild('loanDialog') loanDialogTpl!: TemplateRef<unknown>;

  form: Prestamo = this.formVacio();

  get isAdmin(): boolean { return this.auth.getSession()?.rol === 'ADMIN'; }
  get usuarioId(): number { return this.auth.getSession()!.usuarioId; }
  get displayedColumns(): string[] {
    return this.isAdmin
      ? ['numeroPrestamo', 'usuario', 'cuenta', 'tipo', 'monto', 'tasa', 'plazo', 'cuota', 'estado', 'acciones']
      : ['numeroPrestamo', 'cuenta', 'tipo', 'monto', 'tasa', 'plazo', 'cuota', 'estado', 'acciones'];
  }
  get totalPrestamos(): number { return this.prestamos.length; }
  get totalPendientes(): number { return this.prestamos.filter(p => p.estado === 'PENDIENTE').length; }
  get montoSolicitadoTotal(): number { return this.prestamos.reduce((s, p) => s + (p.montoSolicitado || 0), 0); }
  get monedaPrincipal(): string { return this.prestamos.find(p => p.moneda)?.moneda || 'PEN'; }

  constructor(
    private prestamoSvc: PrestamoService,
    private cuentaSvc: CuentaService,
    private auth: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarPrestamos();
    if (!this.isAdmin) this.cargarMisCuentas();
  }

  cargarMisCuentas(): void {
    this.cuentaSvc.getByUsuario(this.usuarioId).subscribe({
      next: (c) => this.misCuentas = c.filter(x => x.estado === 'ACTIVA'),
      error: () => {}
    });
  }

  cargarPrestamos(): void {
    this.loading = true;
    const obs = this.isAdmin
      ? this.prestamoSvc.getAll()
      : this.prestamoSvc.getByUsuario(this.usuarioId);

    obs.subscribe({
      next: (data) => { this.prestamos = data; this.loading = false; },
      error: () => {
        this.mostrarMensaje('Error al cargar préstamos. Verifique que ms-prestamos esté activo en :8084.', true);
        this.loading = false;
      }
    });
  }

  abrirModal(): void {
    this.form = this.formVacio();
    this.modoEdicion = false;
    this.editandoId = null;
    this.abrirDialogo();
  }

  editarPrestamo(p: Prestamo): void {
    this.form = { ...p };
    this.modoEdicion = true;
    this.editandoId = p.id!;
    this.abrirDialogo();
  }

  cerrarModal(): void { this.dialogRef?.close(); }

  guardar(): void {
    if (!this.modoEdicion) {
      if (!this.form.montoSolicitado || !this.form.tasaInteres || !this.form.plazoMeses ||
          !this.form.cuentaDesembolsoId || this.form.cuentaDesembolsoId <= 0) {
        this.mostrarMensaje('Complete todos los campos obligatorios.', true); return;
      }
      // Cliente usa su propio ID
      if (!this.isAdmin) this.form.usuarioId = this.usuarioId;
    }

    this.guardando = true;
    const obs = this.modoEdicion
      ? this.prestamoSvc.update(this.editandoId!, this.form)
      : this.prestamoSvc.create(this.form);

    obs.subscribe({
      next: () => {
        this.mostrarMensaje(this.modoEdicion
          ? 'Préstamo actualizado correctamente.'
          : (this.isAdmin ? '✅ Préstamo creado. FeignClient verificó usuario y cuenta.' : '✅ Solicitud enviada. Un administrador la revisará pronto.'));
        this.cerrarModal();
        this.cargarPrestamos();
        this.guardando = false;
      },
      error: (err) => {
        this.mostrarMensaje(err.error?.message || 'Error al procesar préstamo.', true);
        this.guardando = false;
      }
    });
  }

  aprobarPrestamo(id: number): void {
    if (!confirm('¿Confirma aprobar este préstamo?')) return;
    this.prestamoSvc.aprobar(id).subscribe({
      next: () => { this.mostrarMensaje('Préstamo aprobado.'); this.cargarPrestamos(); },
      error: (err) => this.mostrarMensaje(err.error?.message || 'Error al aprobar.', true)
    });
  }

  eliminarPrestamo(id: number): void {
    const msg = this.isAdmin ? '¿Confirma eliminar este préstamo?' : '¿Confirma cancelar esta solicitud de préstamo?';
    if (!confirm(msg)) return;
    this.prestamoSvc.delete(id).subscribe({
      next: () => { this.mostrarMensaje(this.isAdmin ? 'Préstamo eliminado.' : 'Solicitud cancelada.'); this.cargarPrestamos(); },
      error: () => this.mostrarMensaje('Error al procesar la operación.', true)
    });
  }

  calcularCuota(): number {
    if (!this.form.montoSolicitado || !this.form.tasaInteres || !this.form.plazoMeses) return 0;
    const P = +this.form.montoSolicitado;
    const i = +this.form.tasaInteres / 12 / 100;
    const n = +this.form.plazoMeses;
    if (i === 0) return P / n;
    return P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  }

  private mostrarMensaje(msg: string, error = false): void {
    this.mensaje = msg;
    this.esError = error;
    this.snackBar.open(msg, 'Cerrar', {
      duration: 4500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: error ? ['snackbar-error'] : ['snackbar-success']
    });
    setTimeout(() => this.mensaje = '', 5000);
  }

  estadoClase(estado?: string): string {
    switch (estado) {
      case 'PENDIENTE': return 'status-pendiente';
      case 'APROBADO':
      case 'DESEMBOLSADO': return 'status-aprobado';
      case 'PAGADO': return 'status-pagado';
      case 'RECHAZADO':
      case 'VENCIDO': return 'status-rechazado';
      default: return 'status-default';
    }
  }

  private abrirDialogo(): void {
    this.dialogRef?.close();
    this.dialogRef = this.dialog.open(this.loanDialogTpl, {
      width: 'min(92vw, 840px)',
      maxWidth: '840px',
      autoFocus: false,
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
      this.guardando = false;
    });
  }

  private formVacio(): Prestamo {
    return {
      usuarioId: 0, cuentaDesembolsoId: 0,
      montoSolicitado: 0, tasaInteres: 18, plazoMeses: 12,
      tipoPrestamo: 'PERSONAL', moneda: 'PEN'
    };
  }
}
