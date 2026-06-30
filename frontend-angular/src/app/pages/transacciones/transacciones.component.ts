import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransaccionService } from '../../services/transaccion.service';
import { CuentaService } from '../../services/cuenta.service';
import { AuthService } from '../../services/auth.service';
import { Transaccion, Cuenta } from '../../models/models';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-transacciones',
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
          <div style="display:inline-flex;padding:6px 12px;border-radius:999px;background:#ecfdf5;color:#166534;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;margin-bottom:10px">Operaciones</div>
          <h1 style="margin:0;font-size:24px;font-weight:800;color:#0f172a">{{ isAdmin ? 'Gestión de Transacciones' : 'Mis Transacciones' }}</h1>
          <p style="margin:6px 0 0;color:#64748b">Registro y seguimiento con una vista más clara y profesional.</p>
        </div>
        <button mat-raised-button color="primary" (click)="abrirModal()">
          <mat-icon>add</mat-icon>
          Nueva transacción
        </button>
      </mat-card>

      <div *ngIf="mensaje" class="alert" [class.alert-success]="!esError" [class.alert-danger]="esError">
        {{ mensaje }}
      </div>

      <mat-card class="card" style="border-radius:20px;overflow:hidden">
        <div style="overflow:auto;position:relative">
          <table mat-table [dataSource]="transacciones" aria-label="Tabla de transacciones" style="width:100%">
            <ng-container matColumnDef="numeroReferencia">
              <th mat-header-cell *matHeaderCellDef>Ref</th>
              <td mat-cell *matCellDef="let t"><code style="background:#eef4ff;padding:4px 8px;border-radius:999px;font-size:12px;color:#1d4ed8">{{ t.numeroReferencia }}</code></td>
            </ng-container>

            <ng-container matColumnDef="tipoTransaccion">
              <th mat-header-cell *matHeaderCellDef>Tipo</th>
              <td mat-cell *matCellDef="let t"><span class="badge" [class.badge-success]="t.tipoTransaccion==='DEPOSITO'" [class.badge-danger]="t.tipoTransaccion==='RETIRO'" [class.badge-info]="t.tipoTransaccion==='TRANSFERENCIA'" [class.badge-warning]="t.tipoTransaccion==='PAGO'">{{ t.tipoTransaccion }}</span></td>
            </ng-container>

            <ng-container matColumnDef="cuentaOrigenId">
              <th mat-header-cell *matHeaderCellDef>Cuenta Origen</th>
              <td mat-cell *matCellDef="let t">#{{ t.cuentaOrigenId }}</td>
            </ng-container>

            <ng-container matColumnDef="cuentaDestinoId">
              <th mat-header-cell *matHeaderCellDef>Cuenta Destino</th>
              <td mat-cell *matCellDef="let t">{{ t.cuentaDestinoId ? '#' + t.cuentaDestinoId : '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="monto">
              <th mat-header-cell *matHeaderCellDef>Monto</th>
              <td mat-cell *matCellDef="let t"><strong>{{ t.moneda }} {{ t.monto | number:'1.2-2' }}</strong></td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let t"><span class="badge" [class.badge-success]="t.estado==='COMPLETADA'" [class.badge-warning]="t.estado==='PENDIENTE'" [class.badge-danger]="t.estado==='FALLIDA'" [class.badge-secondary]="t.estado==='CANCELADA'">{{ t.estado }}</span></td>
            </ng-container>

            <ng-container matColumnDef="fechaTransaccion">
              <th mat-header-cell *matHeaderCellDef>Fecha</th>
              <td mat-cell *matCellDef="let t" style="font-size:12px;color:#64748b">{{ t.fechaTransaccion | date:'dd/MM/yyyy HH:mm' }}</td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let t">
                <button *ngIf="isAdmin" mat-icon-button color="primary" matTooltip="Editar transacción" (click)="editarTransaccion(t)"><mat-icon>edit</mat-icon></button>
                <button *ngIf="isAdmin" mat-icon-button color="warn" matTooltip="Eliminar transacción" (click)="eliminarTransaccion(t.id!)"><mat-icon>delete</mat-icon></button>
                <span *ngIf="!isAdmin" style="font-size:12px;color:#94a3b8">Solo lectura</span>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>

          <div *ngIf="loading" style="display:flex;align-items:center;justify-content:center;gap:12px;padding:28px;color:#64748b">
            <mat-progress-spinner diameter="36" mode="indeterminate"></mat-progress-spinner>
            Cargando transacciones...
          </div>

          <div *ngIf="!loading && transacciones.length === 0" style="text-align:center;padding:32px;color:#64748b">
            {{ isAdmin ? 'No hay transacciones registradas' : 'No tienes transacciones registradas' }}
          </div>
        </div>
      </mat-card>
    </div>

    <ng-template #transaccionDialog>
      <h2 mat-dialog-title>{{ modoEdicion ? 'Editar Transacción' : 'Nueva Transacción' }}</h2>
      <mat-dialog-content style="display:grid;gap:14px;min-width:min(600px,92vw)">
        <form #transaccionForm="ngForm" style="display:grid;gap:14px">
        <ng-container *ngIf="!modoEdicion">
          <mat-form-field appearance="outline">
            <mat-label>Tipo de Transacción</mat-label>
            <mat-select [(ngModel)]="form.tipoTransaccion" name="tipoTransaccion" required #tipoTransaccionModel="ngModel">
              <mat-option value="DEPOSITO">DEPÓSITO</mat-option>
              <mat-option value="RETIRO">RETIRO</mat-option>
              <mat-option value="TRANSFERENCIA">TRANSFERENCIA</mat-option>
              <mat-option value="PAGO">PAGO</mat-option>
            </mat-select>
            <mat-error *ngIf="tipoTransaccionModel.invalid && (tipoTransaccionModel.dirty || tipoTransaccionModel.touched)">Seleccione un tipo de transacción.</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="isAdmin">
            <mat-label>ID Cuenta Origen</mat-label>
            <input matInput type="number" [(ngModel)]="form.cuentaOrigenId" name="cuentaOrigenId" placeholder="1" required min="1" #cuentaOrigenAdminModel="ngModel" />
            <mat-error *ngIf="cuentaOrigenAdminModel.invalid && (cuentaOrigenAdminModel.dirty || cuentaOrigenAdminModel.touched)">Ingrese un ID válido mayor que 0.</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" *ngIf="!isAdmin">
            <mat-label>Cuenta Origen</mat-label>
            <mat-select [(ngModel)]="form.cuentaOrigenId" name="cuentaOrigenId" required #cuentaOrigenClientModel="ngModel">
              <mat-option [value]="null" disabled>Selecciona una cuenta</mat-option>
              <mat-option *ngFor="let c of misCuentas" [value]="c.id">
                {{ c.numeroCuenta }} — {{ c.tipoCuenta }} ({{ c.moneda }} {{ c.saldo | number:'1.2-2' }})
              </mat-option>
            </mat-select>
            <mat-error *ngIf="cuentaOrigenClientModel.invalid && (cuentaOrigenClientModel.dirty || cuentaOrigenClientModel.touched)">Seleccione una cuenta de origen.</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" *ngIf="form.tipoTransaccion === 'TRANSFERENCIA'">
            <mat-label>ID Cuenta Destino</mat-label>
            <input matInput type="number" [(ngModel)]="form.cuentaDestinoId" name="cuentaDestinoId" placeholder="2" required min="1" #cuentaDestinoModel="ngModel" />
            <mat-error *ngIf="cuentaDestinoModel.invalid && (cuentaDestinoModel.dirty || cuentaDestinoModel.touched)">Ingrese un ID válido mayor que 0.</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Monto</mat-label>
            <input matInput type="number" [(ngModel)]="form.monto" name="monto" placeholder="0.00" step="0.01" required min="0.01" #montoModel="ngModel" />
            <mat-error *ngIf="montoModel.invalid && (montoModel.dirty || montoModel.touched)">El monto debe ser mayor que 0.</mat-error>
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
            <mat-label>Descripción</mat-label>
            <input matInput [(ngModel)]="form.descripcion" name="descripcion" placeholder="Descripción de la operación" required minlength="3" #descripcionModel="ngModel" />
            <mat-error *ngIf="descripcionModel.invalid && (descripcionModel.dirty || descripcionModel.touched)">Describa la operación en al menos 3 caracteres.</mat-error>
          </mat-form-field>
        </ng-container>

        <ng-container *ngIf="modoEdicion && isAdmin">
          <mat-form-field appearance="outline">
            <mat-label>Descripción</mat-label>
            <input matInput [(ngModel)]="form.descripcion" name="descripcionEdit" required minlength="3" #descripcionEditModel="ngModel" />
            <mat-error *ngIf="descripcionEditModel.invalid && (descripcionEditModel.dirty || descripcionEditModel.touched)">La descripción debe tener al menos 3 caracteres.</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Estado</mat-label>
            <mat-select [(ngModel)]="form.estado" name="estado" required #estadoModel="ngModel">
              <mat-option value="PENDIENTE">PENDIENTE</mat-option>
              <mat-option value="COMPLETADA">COMPLETADA</mat-option>
              <mat-option value="FALLIDA">FALLIDA</mat-option>
              <mat-option value="CANCELADA">CANCELADA</mat-option>
            </mat-select>
            <mat-error *ngIf="estadoModel.invalid && (estadoModel.dirty || estadoModel.touched)">Seleccione un estado.</mat-error>
          </mat-form-field>
        </ng-container>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="cerrarModal()">Cancelar</button>
        <button mat-raised-button color="primary" (click)="guardar()" [disabled]="guardando || transaccionForm.invalid">
          {{ guardando ? 'Procesando...' : (modoEdicion ? 'Actualizar' : 'Registrar') }}
        </button>
      </mat-dialog-actions>
    </ng-template>
  `
})
export class TransaccionesComponent implements OnInit {
  transacciones: Transaccion[] = [];
  misCuentas: Cuenta[] = [];
  loading = true;
  showModal = false;
  modoEdicion = false;
  guardando = false;
  mensaje = '';
  esError = false;
  editandoId: number | null = null;
  dialogRef: MatDialogRef<unknown> | null = null;

  @ViewChild('transaccionDialog') transaccionDialogTpl!: TemplateRef<unknown>;

  form: Transaccion = this.formVacio();

  get isAdmin(): boolean { return this.auth.getSession()?.rol === 'ADMIN'; }
  get usuarioId(): number { return this.auth.getSession()!.usuarioId; }
  get displayedColumns(): string[] {
    return ['numeroReferencia', 'tipoTransaccion', 'cuentaOrigenId', 'cuentaDestinoId', 'monto', 'estado', 'fechaTransaccion', 'acciones'];
  }

  constructor(
    private transaccionSvc: TransaccionService,
    private cuentaSvc: CuentaService,
    private auth: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarTransacciones();
    if (!this.isAdmin) this.cargarMisCuentas();
  }

  cargarMisCuentas(): void {
    this.cuentaSvc.getByUsuario(this.usuarioId).subscribe({
      next: (c) => this.misCuentas = c,
      error: () => {}
    });
  }

  cargarTransacciones(): void {
    this.loading = true;
    if (this.isAdmin) {
      this.transaccionSvc.getAll().subscribe({
        next: (data) => { this.transacciones = data; this.loading = false; },
        error: () => { this.mostrarMensaje('Error al cargar transacciones.', true); this.loading = false; }
      });
    } else {
      // Carga cuentas del cliente y luego sus transacciones
      this.cuentaSvc.getByUsuario(this.usuarioId).subscribe({
        next: (cuentas) => {
          if (cuentas.length === 0) { this.loading = false; return; }
          let completadas = 0;
          const todas: Transaccion[] = [];
          cuentas.forEach(c => {
            this.transaccionSvc.getByCuenta(c.id!).subscribe({
              next: (t) => {
                todas.push(...t);
                completadas++;
                if (completadas === cuentas.length) {
                  // Eliminar duplicados y ordenar por fecha desc
                  const unique = [...new Map(todas.map(x => [x.id, x])).values()];
                  this.transacciones = unique.sort((a, b) =>
                    new Date(b.fechaTransaccion!).getTime() - new Date(a.fechaTransaccion!).getTime()
                  );
                  this.loading = false;
                }
              },
              error: () => { completadas++; if (completadas === cuentas.length) this.loading = false; }
            });
          });
        },
        error: () => { this.mostrarMensaje('Error al cargar tus transacciones.', true); this.loading = false; }
      });
    }
  }

  abrirModal(): void {
    this.form = this.formVacio();
    this.modoEdicion = false;
    this.editandoId = null;
    this.abrirDialogo();
  }

  editarTransaccion(t: Transaccion): void {
    this.form = { ...t };
    this.modoEdicion = true;
    this.editandoId = t.id!;
    this.abrirDialogo();
  }

  cerrarModal(): void { this.dialogRef?.close(); }

  guardar(): void {
    if (!this.modoEdicion && (
      !this.form.cuentaOrigenId || this.form.cuentaOrigenId <= 0 ||
      !this.form.monto || this.form.monto <= 0 ||
      (this.form.tipoTransaccion === 'TRANSFERENCIA' && (!this.form.cuentaDestinoId || this.form.cuentaDestinoId <= 0))
    )) {
      this.mostrarMensaje('Complete todos los campos obligatorios.', true); return;
    }
    this.guardando = true;
    const obs = this.modoEdicion
      ? this.transaccionSvc.update(this.editandoId!, this.form)
      : this.transaccionSvc.create(this.form);

    obs.subscribe({
      next: () => {
        this.mostrarMensaje(this.modoEdicion ? 'Transacción actualizada.' : 'Transacción registrada correctamente.');
        this.cerrarModal(); this.cargarTransacciones(); this.guardando = false;
      },
      error: (err) => {
        this.mostrarMensaje(err.error?.message || 'Error al procesar transacción.', true);
        this.guardando = false;
      }
    });
  }

  eliminarTransaccion(id: number): void {
    if (!confirm('¿Confirma eliminar esta transacción?')) return;
    this.transaccionSvc.delete(id).subscribe({
      next: () => { this.mostrarMensaje('Transacción eliminada.'); this.cargarTransacciones(); },
      error: () => this.mostrarMensaje('Error al eliminar transacción.', true)
    });
  }

  private mostrarMensaje(msg: string, error = false): void {
    this.mensaje = msg; this.esError = error;
    this.snackBar.open(msg, 'Cerrar', { duration: 3500, horizontalPosition: 'end', verticalPosition: 'top' });
    setTimeout(() => this.mensaje = '', 4000);
  }

  private abrirDialogo(): void {
    this.dialogRef?.close();
    this.dialogRef = this.dialog.open(this.transaccionDialogTpl, { width: 'min(92vw, 680px)', autoFocus: false, disableClose: true });
    this.dialogRef.afterClosed().subscribe(() => { this.dialogRef = null; this.guardando = false; });
  }

  private formVacio(): Transaccion {
    return { cuentaOrigenId: null as any, tipoTransaccion: 'DEPOSITO', monto: null as any, moneda: 'PEN', descripcion: '' };
  }
}
