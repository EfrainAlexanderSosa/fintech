import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/models';
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
  selector: 'app-usuarios',
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
    <div class="page-container usuarios-page">
      <mat-card class="hero-card">
        <div class="hero-copy">
          <div class="eyebrow">Administración</div>
          <h1>Gestión de Usuarios</h1>
          <p>Control centralizado de usuarios con una interfaz más clara, consistente y profesional.</p>
        </div>
        <button mat-raised-button color="primary" (click)="abrirModal()">
          <mat-icon>person_add</mat-icon>
          Nuevo usuario
        </button>
      </mat-card>

      <div *ngIf="mensaje" class="alert" [class.alert-success]="!esError" [class.alert-danger]="esError">
        {{ mensaje }}
      </div>

      <mat-card class="table-card">
        <div class="table-wrap">
          <table mat-table [dataSource]="usuarios" aria-label="Tabla de usuarios" class="usuarios-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let u"><strong>#{{ u.id }}</strong></td>
            </ng-container>

            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let u">
                <div class="user-cell">
                  <strong>{{ u.nombre }} {{ u.apellido }}</strong>
                  <span>{{ u.email }}</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="telefono">
              <th mat-header-cell *matHeaderCellDef>Teléfono</th>
              <td mat-cell *matCellDef="let u">{{ u.telefono || '—' }}</td>
            </ng-container>

            <ng-container matColumnDef="rol">
              <th mat-header-cell *matHeaderCellDef>Rol</th>
              <td mat-cell *matCellDef="let u">
                <span class="badge" [class.badge-secondary]="u.rol==='ADMIN'" [class.badge-info]="u.rol==='CLIENTE'">
                  {{ u.rol }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let u">
                <span class="badge" [class.badge-success]="u.activo" [class.badge-danger]="!u.activo">
                  {{ u.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let u">
                <button mat-icon-button color="primary" matTooltip="Editar usuario" (click)="editarUsuario(u)"><mat-icon>edit</mat-icon></button>
                <button mat-icon-button color="warn" matTooltip="Eliminar usuario" (click)="eliminarUsuario(u.id!)"><mat-icon>delete</mat-icon></button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>

          <div class="loading-row" *ngIf="loading">
            <mat-progress-spinner diameter="36" mode="indeterminate"></mat-progress-spinner>
            <span>Cargando usuarios...</span>
          </div>

          <div class="empty-state" *ngIf="!loading && usuarios.length === 0">
            <mat-icon>group_off</mat-icon>
            <h3>No hay usuarios registrados</h3>
            <p>Cuando existan registros, se mostrarán aquí con una tabla más limpia y legible.</p>
          </div>
        </div>
      </mat-card>
    </div>

    <ng-template #usuarioDialog>
      <h2 mat-dialog-title>{{ modoEdicion ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>
      <mat-dialog-content class="dialog-content">
        <form #usuarioForm="ngForm" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput [(ngModel)]="form.nombre" name="nombre" placeholder="Juan" required minlength="2" #nombreModel="ngModel" />
          <mat-error *ngIf="nombreModel.invalid && (nombreModel.dirty || nombreModel.touched)">Ingrese al menos 2 caracteres.</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Apellido</mat-label>
          <input matInput [(ngModel)]="form.apellido" name="apellido" placeholder="Pérez" required minlength="2" #apellidoModel="ngModel" />
          <mat-error *ngIf="apellidoModel.invalid && (apellidoModel.dirty || apellidoModel.touched)">Ingrese al menos 2 caracteres.</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" [(ngModel)]="form.email" name="email" placeholder="juan@fintech.pe" [disabled]="modoEdicion" required email #emailModel="ngModel" />
          <mat-error *ngIf="emailModel.invalid && (emailModel.dirty || emailModel.touched)">Ingrese un correo válido.</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ modoEdicion ? 'Nueva Contraseña (dejar en blanco para no cambiar)' : 'Contraseña' }}</mat-label>
          <input matInput type="password" [(ngModel)]="form.password" name="password" placeholder="••••••••" [required]="!modoEdicion" minlength="6" #passwordModel="ngModel" />
          <mat-error *ngIf="passwordModel.errors?.['required'] && (passwordModel.dirty || passwordModel.touched)">La contraseña es obligatoria.</mat-error>
          <mat-error *ngIf="passwordModel.errors?.['minlength'] && (passwordModel.dirty || passwordModel.touched)">Debe tener al menos 6 caracteres.</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Teléfono</mat-label>
          <input matInput [(ngModel)]="form.telefono" name="telefono" placeholder="999 999 999" pattern="^[0-9\s+()-]{7,20}$" #telefonoModel="ngModel" />
          <mat-error *ngIf="telefonoModel.invalid && (telefonoModel.dirty || telefonoModel.touched)">Ingrese solo números o símbolos válidos.</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Rol</mat-label>
          <mat-select [(ngModel)]="form.rol" name="rol" required #rolModel="ngModel">
            <mat-option value="ADMIN">ADMIN</mat-option>
            <mat-option value="CLIENTE">CLIENTE</mat-option>
          </mat-select>
          <mat-error *ngIf="rolModel.invalid && (rolModel.dirty || rolModel.touched)">Seleccione un rol.</mat-error>
        </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="cerrarModal()">Cancelar</button>
        <button mat-raised-button color="primary" (click)="guardar()" [disabled]="guardando || usuarioForm.invalid">
          {{ guardando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear') }}
        </button>
      </mat-dialog-actions>
    </ng-template>
  `,
  styles: [`
    :host { display: block; }

    .usuarios-page {
      display: grid;
      gap: 18px;
    }

    .hero-card,
    .table-card {
      border-radius: 20px;
      box-shadow: 0 14px 40px rgba(15, 23, 42, 0.08);
      border: 1px solid rgba(37, 99, 235, 0.08);
    }

    .hero-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      padding: 24px 28px;
      background: linear-gradient(135deg, #ffffff 0%, #f7faff 100%);
    }

    .hero-copy h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
    }

    .eyebrow {
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
    .empty-state p {
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }

    .table-card {
      padding: 20px;
    }

    .table-wrap {
      position: relative;
      overflow: auto;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
    }

    .usuarios-table {
      width: 100%;
      min-width: 900px;
      background: #ffffff;
    }

    .usuarios-table th {
      font-size: 12px;
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      background: #f8fafc;
    }

    .usuarios-table td,
    .usuarios-table th {
      padding-inline: 16px;
    }

    .user-cell {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-cell span {
      color: #94a3b8;
      font-size: 12px;
    }

    .loading-row,
    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 10px;
      padding: 28px;
      text-align: center;
    }

    .loading-row {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(2px);
    }

    .empty-state mat-icon {
      font-size: 42px;
      width: 42px;
      height: 42px;
      color: #94a3b8;
    }

    .empty-state h3 {
      margin: 0;
      color: #0f172a;
      font-size: 16px;
      font-weight: 700;
    }

    .dialog-content {
      display: grid;
      gap: 14px;
      min-width: min(92vw, 620px);
    }

    .dialog-form {
      display: grid;
      gap: 14px;
    }

    @media (max-width: 900px) {
      .hero-card {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `]
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = true;
  showModal = false;
  modoEdicion = false;
  guardando = false;
  mensaje = '';
  esError = false;
  editandoId: number | null = null;
  dialogRef: MatDialogRef<unknown> | null = null;

  @ViewChild('usuarioDialog') usuarioDialogTpl!: TemplateRef<unknown>;

  form: Usuario = this.formVacio();

  constructor(private usuarioSvc: UsuarioService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  get displayedColumns(): string[] {
    return ['id', 'nombre', 'telefono', 'rol', 'estado', 'acciones'];
  }

  ngOnInit(): void { this.cargarUsuarios(); }

  cargarUsuarios(): void {
    this.loading = true;
    this.usuarioSvc.getAll().subscribe({
      next: (data) => { this.usuarios = data; this.loading = false; },
      error: () => { this.mostrarMensaje('Error al cargar usuarios. Verifique que ms-usuarios esté activo.', true); this.loading = false; }
    });
  }

  abrirModal(): void {
    this.form = this.formVacio();
    this.modoEdicion = false;
    this.editandoId = null;
    this.abrirDialogo();
  }

  editarUsuario(u: Usuario): void {
    this.form = { ...u, password: '' };
    this.modoEdicion = true;
    this.editandoId = u.id!;
    this.abrirDialogo();
  }

  cerrarModal(): void { this.dialogRef?.close(); }

  guardar(): void {
    if (!this.form.nombre || !this.form.apellido || !this.form.email) {
      this.mostrarMensaje('Complete los campos obligatorios.', true); return;
    }
    this.guardando = true;
    const obs = this.modoEdicion
      ? this.usuarioSvc.update(this.editandoId!, this.form)
      : this.usuarioSvc.create(this.form);

    obs.subscribe({
      next: () => {
        this.mostrarMensaje(this.modoEdicion ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.');
        this.cerrarModal();
        this.cargarUsuarios();
        this.guardando = false;
      },
      error: (err) => {
        this.mostrarMensaje(err.error?.message || 'Error al guardar usuario.', true);
        this.guardando = false;
      }
    });
  }

  eliminarUsuario(id: number): void {
    if (!confirm('¿Confirma eliminar este usuario?')) return;
    this.usuarioSvc.delete(id).subscribe({
      next: () => { this.mostrarMensaje('Usuario eliminado.'); this.cargarUsuarios(); },
      error: () => this.mostrarMensaje('Error al eliminar usuario.', true)
    });
  }

  private mostrarMensaje(msg: string, error = false): void {
    this.mensaje = msg; this.esError = error;
    this.snackBar.open(msg, 'Cerrar', { duration: 3500, horizontalPosition: 'end', verticalPosition: 'top' });
    setTimeout(() => this.mensaje = '', 4000);
  }

  private abrirDialogo(): void {
    this.dialogRef?.close();
    this.dialogRef = this.dialog.open(this.usuarioDialogTpl, { width: 'min(92vw, 620px)', autoFocus: false, disableClose: true });
    this.dialogRef.afterClosed().subscribe(() => { this.dialogRef = null; this.guardando = false; });
  }

  private formVacio(): Usuario {
    return { email: '', password: '', nombre: '', apellido: '', telefono: '', rol: 'CLIENTE' };
  }
}
