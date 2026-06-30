import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="password-shell">
      <mat-card class="password-card">
        <div class="password-header">
          <div class="password-icon">
            <mat-icon>mark_email_unread</mat-icon>
          </div>
          <div>
            <p class="password-eyebrow">Recuperación de acceso</p>
            <h1>¿Olvidaste tu contraseña?</h1>
            <p class="password-copy">Ingresa tu correo y te enviaremos las instrucciones para continuar.</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="password-form">
          <mat-form-field appearance="outline">
            <mat-label>Correo electrónico</mat-label>
            <input matInput type="email" formControlName="email" placeholder="admin@fintech.pe" />
            <mat-error *ngIf="email?.hasError('required')">El correo es obligatorio.</mat-error>
            <mat-error *ngIf="email?.hasError('email')">Ingrese un correo válido.</mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="loading || form.invalid" class="password-button">
            <ng-container *ngIf="!loading; else loadingTpl">Enviar enlace</ng-container>
          </button>

          <ng-template #loadingTpl>
            <span class="spinner-inline">
              <mat-spinner diameter="18"></mat-spinner>
              Enviando...
            </span>
          </ng-template>

          <a mat-button routerLink="/login" class="password-link">Volver al inicio de sesión</a>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .password-shell {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      background:
        radial-gradient(circle at top left, rgba(37, 99, 235, .15), transparent 28%),
        linear-gradient(135deg, #eff6ff 0%, #f8fbff 55%, #eef4fb 100%);
    }
    .password-card {
      width: min(100%, 520px);
      border-radius: 24px;
      padding: 30px;
      box-shadow: 0 24px 70px rgba(15, 23, 42, .14);
    }
    .password-header {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      margin-bottom: 22px;
    }
    .password-icon {
      width: 54px;
      height: 54px;
      border-radius: 16px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #fff;
      flex-shrink: 0;
    }
    .password-icon mat-icon { width: 26px; height: 26px; font-size: 26px; }
    .password-eyebrow {
      margin: 0 0 6px;
      color: #1d4ed8;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .4px;
      text-transform: uppercase;
    }
    .password-header h1 {
      margin: 0 0 8px;
      color: #0f172a;
      font-size: clamp(26px, 4vw, 34px);
      line-height: 1.1;
      font-weight: 800;
    }
    .password-copy {
      margin: 0;
      color: #64748b;
      line-height: 1.5;
    }
    .password-form { display: grid; gap: 14px; }
    .password-form mat-form-field { width: 100%; }
    .password-button {
      min-height: 48px;
      border-radius: 14px;
    }
    .spinner-inline {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .password-link {
      justify-self: center;
      color: #2563eb;
      font-weight: 700;
      text-decoration: none;
    }
    .password-link:hover { text-decoration: underline; }
  `]
})
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  get email() { return this.form.get('email'); }

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.http.post(`${environment.msUsuariosUrl}/password/forgot`, this.form.value).subscribe({
      next: (resp: any) => {
        this.snackBar.open(resp?.mensaje || 'Si el correo existe, recibirás las instrucciones de recuperación.', 'Cerrar', {
          duration: 4500,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'No fue posible enviar la solicitud. Intente nuevamente.', 'Cerrar', {
          duration: 4500,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loading = false;
      }
    });
  }
}