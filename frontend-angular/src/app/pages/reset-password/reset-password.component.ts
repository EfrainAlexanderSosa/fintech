import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (!password || !confirmPassword) return null;
  return password === confirmPassword ? null : { passwordsMismatch: true };
};

@Component({
  selector: 'app-reset-password',
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
            <mat-icon>lock_reset</mat-icon>
          </div>
          <div>
            <p class="password-eyebrow">Nueva contraseña</p>
            <h1>Restablecer contraseña</h1>
            <p class="password-copy">Ingresa el token recibido y define una nueva contraseña segura.</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="password-form">
          <mat-form-field appearance="outline">
            <mat-label>Token</mat-label>
            <input matInput formControlName="token" placeholder="Pegue aquí el token recibido" />
            <mat-error *ngIf="token?.hasError('required')">El token es obligatorio.</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Nueva contraseña</mat-label>
            <input matInput type="password" formControlName="password" placeholder="Nueva contraseña" />
            <mat-error *ngIf="password?.hasError('required')">La nueva contraseña es obligatoria.</mat-error>
            <mat-error *ngIf="password?.hasError('minlength')">Debe tener al menos 6 caracteres.</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Confirmar contraseña</mat-label>
            <input matInput type="password" formControlName="confirmPassword" placeholder="Repita la contraseña" />
            <mat-error *ngIf="confirmPassword?.hasError('required')">Confirme la contraseña.</mat-error>
            <mat-error *ngIf="form.errors?.['passwordsMismatch'] && confirmPassword?.touched">Las contraseñas no coinciden.</mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="loading || form.invalid" class="password-button">
            <ng-container *ngIf="!loading; else loadingTpl">Restablecer contraseña</ng-container>
          </button>

          <ng-template #loadingTpl>
            <span class="spinner-inline">
              <mat-spinner diameter="18"></mat-spinner>
              Procesando...
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
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = false;

  form = this.fb.group({
    token: [this.route.snapshot.paramMap.get('token') || this.route.snapshot.queryParamMap.get('token') || '', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordsMatchValidator });

  get token() { return this.form.get('token'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }

  submit(): void {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      token: this.token?.value,
      newPassword: this.password?.value,
      confirmPassword: this.confirmPassword?.value
    };

    this.loading = true;
    this.http.post(`${environment.msUsuariosUrl}/password/reset`, payload).subscribe({
      next: (resp: any) => {
        this.snackBar.open(resp?.mensaje || 'La contraseña fue actualizada correctamente.', 'Cerrar', {
          duration: 4500,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message || 'No fue posible restablecer la contraseña.', 'Cerrar', {
          duration: 4500,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.loading = false;
      }
    });
  }
}