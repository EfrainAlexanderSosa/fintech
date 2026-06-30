import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuentaService } from '../../services/cuenta.service';
import { AuthService } from '../../services/auth.service';
import { Cuenta } from '../../models/models';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-cuentas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule
  ],
  template: `
    <div class="page-container">
      <mat-card class="card" style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:16px;border-radius:20px">
        <div>
          <div style="display:inline-flex;padding:6px 12px;border-radius:999px;background:#e8f1ff;color:#1d4ed8;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin-bottom:10px">Banca digital</div>
          <h1 style="margin:0;font-size:24px;font-weight:800;color:#0f172a">{{ isAdmin ? 'Gestión de Cuentas' : 'Mis Cuentas' }}</h1>
          <p style="margin:6px 0 0;color:#64748b">Vista ordenada de cuentas, saldos y estados con acciones más claras.</p>
        </div>
        <button mat-raised-button color="primary" (click)="abrirModal()">
          <mat-icon>add</mat-icon>
          Nueva cuenta
        </button>
      </mat-card>

      <div *ngIf="mensaje" class="alert" [class.alert-success]="!esError" [class.alert-danger]="esError">
        {{ mensaje }}
      </div>

      <mat-card class="card" style="border-radius:20px;overflow:hidden">
        <div style="overflow:auto;position:relative">
          <table mat-table [dataSource]="cuentas" aria-label="Tabla de cuentas" style="width:100%">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let c"><strong>#{{ c.id }}</strong></td>
            </ng-container>

            <ng-container matColumnDef="numeroCuenta">
              <th mat-header-cell *matHeaderCellDef>N° Cuenta</th>
              <td mat-cell *matCellDef="let c"><code style="background:#eef4ff;padding:4px 8px;border-radius:999px;font-size:12px;color:#1d4ed8">{{ c.numeroCuenta }}</code></td>
            </ng-container>

            <ng-container matColumnDef="usuarioId" *ngIf="isAdmin">
              <th mat-header-cell *matHeaderCellDef>Usuario</th>
              <td mat-cell *matCellDef="let c">#{{ c.usuarioId }}</td>
            </ng-container>

            <ng-container matColumnDef="tipoCuenta">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let c"><span class="badge badge-secondary">{{ c.tipoCuenta }}</span></td>
            </ng-container>

            <ng-container matColumnDef="saldo">
              <th mat-header-cell *matHeaderCellDef>Saldo</th>
              <td mat-cell *matCellDef="let c"><strong>{{ c.saldo | number:'1.2-2' }}</strong></td>
            </ng-container>

            <ng-container matColumnDef="moneda">
              <th mat-header-cell *matHeaderCellDef>Moneda</th>
              <td mat-cell *matCellDef="let c">{{ c.moneda }}</td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let c">
                <span class="badge"
                  [class.badge-success]="c.estado==='ACTIVA'"
                  [class.badge-warning]="c.estado==='BLOQUEADA'"
                  [class.badge-danger]="c.estado==='INACTIVA'">
                  {{ c.estado }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let c">
                <button mat-icon-button color="primary" matTooltip="Editar cuenta" (click)="editarCuenta(c)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button *ngIf="isAdmin" mat-icon-button color="warn" matTooltip="Eliminar cuenta" (click)="eliminarCuenta(c.id!)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>

          <div *ngIf="loading" style="display:flex;align-items:center;justify-content:center;gap:12px;padding:28px;color:#64748b">
            <mat-progress-spinner diameter="36" mode="indeterminate"></mat-progress-spinner>
            Cargando cuentas...
          </div>

          <div *ngIf="!loading && cuentas.length === 0" style="text-align:center;padding:32px;color:#64748b">
            {{ isAdmin ? 'No hay cuentas registradas' : 'No tienes cuentas registradas' }}
          </div>
        </div>
      </mat-card>
    </div>

    <ng-template #cuentaDialog>
      <h2 mat-dialog-title>{{ modoEdicion ? 'Editar Cuenta' : 'Nueva Cuenta' }}</h2>
      <mat-dialog-content style="display:grid;gap:14px;min-width:min(560px,92vw)">
        <form #cuentaForm="ngForm" style="display:grid;gap:14px">
        <mat-form-field appearance="outline" *ngIf="isAdmin">
          <mat-label>ID de Usuario</mat-label>
          <input matInput type="number" [(ngModel)]="form.usuarioId" name="usuarioId" placeholder="1" required min="1" #usuarioIdModel="ngModel" />
          <mat-error *ngIf="usuarioIdModel.invalid && (usuarioIdModel.dirty || usuarioIdModel.touched)">Ingrese un ID válido mayor que 0.</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Tipo de Cuenta</mat-label>
          <mat-select [(ngModel)]="form.tipoCuenta" name="tipoCuenta" required #tipoCuentaModel="ngModel">
            <mat-option value="AHORROS">AHORROS</mat-option>
            <mat-option value="CORRIENTE">CORRIENTE</mat-option>
            <mat-option value="PLAZO_FIJO">PLAZO FIJO</mat-option>
          </mat-select>
          <mat-error *ngIf="tipoCuentaModel.invalid && (tipoCuentaModel.dirty || tipoCuentaModel.touched)">Seleccione un tipo de cuenta.</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" *ngIf="!modoEdicion">
          <mat-label>Saldo inicial</mat-label>
          <input matInput type="number" [(ngModel)]="form.saldoInicial" name="saldoInicial" placeholder="0.00" min="0" step="0.01" #saldoInicialModel="ngModel" />
          <mat-error *ngIf="saldoInicialModel.invalid && (saldoInicialModel.dirty || saldoInicialModel.touched)">El saldo inicial no puede ser negativo.</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Moneda</mat-label>
          <mat-select [(ngModel)]="form.moneda" name="moneda" required #monedaModel="ngModel">
            <mat-option value="PEN">PEN - Soles</mat-option>
            <mat-option value="USD">USD - Dólares</mat-option>
          </mat-select>
          <mat-error *ngIf="monedaModel.invalid && (monedaModel.dirty || monedaModel.touched)">Seleccione una moneda.</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline" *ngIf="modoEdicion && isAdmin">
          <mat-label>Estado</mat-label>
          <mat-select [(ngModel)]="form.estado" name="estado" required #estadoModel="ngModel">
            <mat-option value="ACTIVA">ACTIVA</mat-option>
            <mat-option value="INACTIVA">INACTIVA</mat-option>
            <mat-option value="BLOQUEADA">BLOQUEADA</mat-option>
          </mat-select>
          <mat-error *ngIf="estadoModel.invalid && (estadoModel.dirty || estadoModel.touched)">Seleccione un estado.</mat-error>
        </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="cerrarModal()">Cancelar</button>
        <button mat-raised-button color="primary" (click)="guardar()" [disabled]="guardando || cuentaForm.invalid">
          {{ guardando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear') }}
        </button>
      </mat-dialog-actions>
    </ng-template>
  `
})
export class CuentasComponent implements OnInit {
  cuentas: Cuenta[] = [];
  loading = true;
  showModal = false;
  modoEdicion = false;
  guardando = false;
  mensaje = '';
  esError = false;
  editandoId: number | null = null;
  dialogRef: MatDialogRef<unknown> | null = null;

  @ViewChild('cuentaDialog') cuentaDialogTpl!: TemplateRef<unknown>;

  form: Cuenta = this.formVacio();

  get isAdmin(): boolean { return this.auth.getSession()?.rol === 'ADMIN'; }
  get usuarioId(): number { return this.auth.getSession()!.usuarioId; }
  get displayedColumns(): string[] {
    return this.isAdmin
      ? ['id', 'numeroCuenta', 'usuarioId', 'tipoCuenta', 'saldo', 'moneda', 'estado', 'acciones']
      : ['id', 'numeroCuenta', 'tipoCuenta', 'saldo', 'moneda', 'estado', 'acciones'];
  }

  constructor(private cuentaSvc: CuentaService, private auth: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void { this.cargarCuentas(); }

  cargarCuentas(): void {
    this.loading = true;
    const obs = this.isAdmin
      ? this.cuentaSvc.getAll()
      : this.cuentaSvc.getByUsuario(this.usuarioId);

    obs.subscribe({
      next: (data) => { this.cuentas = data; this.loading = false; },
      error: () => { this.mostrarMensaje('Error al cargar cuentas. Verifique que ms-cuentas esté activo.', true); this.loading = false; }
    });
  }

  abrirModal(): void {
    this.form = this.formVacio();
    this.modoEdicion = false;
    this.editandoId = null;
    this.abrirDialogo();
  }

  editarCuenta(c: Cuenta): void {
    this.form = { ...c, saldoInicial: c.saldo };
    this.modoEdicion = true;
    this.editandoId = c.id!;
    this.abrirDialogo();
  }

  cerrarModal(): void { this.dialogRef?.close(); }

  guardar(): void {
    if (!this.form.tipoCuenta) {
      this.mostrarMensaje('Complete los campos obligatorios.', true); return;
    }
    // Si es cliente, forzar su propio usuarioId
    if (!this.isAdmin) this.form.usuarioId = this.usuarioId;

    this.guardando = true;
    const obs = this.modoEdicion
      ? this.cuentaSvc.update(this.editandoId!, this.form)
      : this.cuentaSvc.create(this.form);

    obs.subscribe({
      next: () => {
        this.mostrarMensaje(this.modoEdicion ? 'Cuenta actualizada.' : 'Cuenta creada.');
        this.cerrarModal(); this.cargarCuentas(); this.guardando = false;
      },
      error: (err) => { this.mostrarMensaje(err.error?.message || 'Error al guardar cuenta.', true); this.guardando = false; }
    });
  }

  eliminarCuenta(id: number): void {
    if (!confirm('¿Confirma eliminar esta cuenta?')) return;
    this.cuentaSvc.delete(id).subscribe({
      next: () => { this.mostrarMensaje('Cuenta eliminada.'); this.cargarCuentas(); },
      error: () => this.mostrarMensaje('Error al eliminar cuenta.', true)
    });
  }

  private mostrarMensaje(msg: string, error = false): void {
    this.mensaje = msg; this.esError = error;
    this.snackBar.open(msg, 'Cerrar', { duration: 3500, horizontalPosition: 'end', verticalPosition: 'top' });
    setTimeout(() => this.mensaje = '', 4000);
  }

  private abrirDialogo(): void {
    this.dialogRef?.close();
    this.dialogRef = this.dialog.open(this.cuentaDialogTpl, { width: 'min(92vw, 640px)', autoFocus: false, disableClose: true });
    this.dialogRef.afterClosed().subscribe(() => { this.dialogRef = null; this.guardando = false; });
  }

  private formVacio(): Cuenta {
    return { usuarioId: 0, tipoCuenta: 'AHORROS', saldoInicial: 0, moneda: 'PEN', estado: 'ACTIVA' };
  }
}
