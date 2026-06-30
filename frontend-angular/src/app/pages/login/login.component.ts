import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule],
  template: `
    <div class="auth-shell">
      <div class="auth-visual">
        <div class="auth-visual-badge">FinTechPro</div>
        <h1>Acceso bancario moderno</h1>
        <p>
          Inicia sesión en una experiencia limpia, profesional y consistente con la identidad visual de la plataforma.
        </p>
      </div>

      <mat-card class="auth-card">
        <div class="auth-brand">
          <div class="brand-mark">
            <mat-icon>account_balance</mat-icon>
          </div>
          <div>
            <h2>FinTech<span>Pro</span></h2>
            <p>Plataforma de servicios financieros</p>
          </div>
        </div>

        <div *ngIf="error" class="alert alert-danger auth-alert">{{ error }}</div>

        <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="auth-form">
          <mat-form-field appearance="outline">
            <mat-label>Correo electrónico</mat-label>
            <input
              matInput
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="admin@fintech.pe"
              required
              email
              #emailModel="ngModel"
            />
            <mat-error *ngIf="emailModel.invalid && (emailModel.dirty || emailModel.touched)">Ingrese un correo válido.</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Contraseña</mat-label>
            <input
              matInput
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
              minlength="6"
              #passwordModel="ngModel"
            />
            <mat-error *ngIf="passwordModel.errors?.['required'] && (passwordModel.dirty || passwordModel.touched)">La contraseña es obligatoria.</mat-error>
            <mat-error *ngIf="passwordModel.errors?.['minlength'] && (passwordModel.dirty || passwordModel.touched)">La contraseña debe tener al menos 6 caracteres.</mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" type="submit" [disabled]="loading || loginForm.invalid" class="auth-button">
            <mat-icon>login</mat-icon>
            {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
          </button>

          <a mat-button routerLink="/forgot-password" class="forgot-link">¿Olvidaste tu contraseña?</a>
        </form>

        <div class="auth-footnote">
          <mat-icon>lock</mat-icon>
          <small>Demo: <strong>admin&#64;fintech.pe</strong> / <strong>admin123</strong></small>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .auth-shell {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1.1fr .9fr;
      background:
        radial-gradient(circle at top left, rgba(37, 99, 235, .14), transparent 30%),
        linear-gradient(135deg, #eff6ff 0%, #f8fbff 55%, #eef4fb 100%);
      padding: 24px;
      gap: 24px;
      align-items: center;
    }

    .auth-visual {
      color: #0f172a;
      max-width: 560px;
      padding: 24px;
    }

    .auth-visual-badge {
      display: inline-flex;
      padding: 8px 14px;
      border-radius: 999px;
      background: #e8f1ff;
      color: #1d4ed8;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .4px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .auth-visual h1 {
      font-size: clamp(32px, 5vw, 52px);
      line-height: 1.05;
      margin: 0 0 14px;
      font-weight: 800;
    }

    .auth-visual p {
      max-width: 540px;
      color: #64748b;
      font-size: 16px;
      line-height: 1.6;
      margin: 0;
    }

    .auth-card {
      width: 100%;
      max-width: 460px;
      justify-self: end;
      border-radius: 24px;
      padding: 28px;
      box-shadow: 0 24px 70px rgba(15, 23, 42, .14);
    }

    .auth-brand {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 22px;
    }

    .brand-mark {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #fff;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }

    .brand-mark mat-icon { font-size: 26px; width: 26px; height: 26px; }
    .auth-brand h2 { margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; }
    .auth-brand h2 span { color: #2563eb; }
    .auth-brand p { margin: 2px 0 0; color: #64748b; font-size: 13px; }

    .auth-form { display: grid; gap: 14px; }
    .auth-form mat-form-field { width: 100%; }

    .auth-button {
      width: 100%;
      min-height: 48px;
      border-radius: 14px;
    }

    .auth-button mat-icon { margin-right: 8px; }

    .forgot-link {
      justify-self: center;
      color: #2563eb;
      font-weight: 700;
      text-decoration: none;
      margin-top: -2px;
    }

    .forgot-link:hover { text-decoration: underline; }

    .auth-footnote {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 18px;
      color: #64748b;
    }

    .auth-alert { margin-bottom: 2px; }

    @media (max-width: 900px) {
      .auth-shell { grid-template-columns: 1fr; }
      .auth-visual { padding-bottom: 0; }
      .auth-card { justify-self: stretch; max-width: 100%; }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn()) this.router.navigate(['/dashboard']);
  }

  onLogin(): void {
    this.error = '';
    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err.status === 401
          ? 'Credenciales incorrectas. Verifique su email y contraseña.'
          : 'Error al conectar con el servidor. Verifique que los microservicios estén activos.';
        this.loading = false;
      }
    });
  }
}
