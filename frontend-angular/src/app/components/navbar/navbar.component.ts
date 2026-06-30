import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatButtonModule, MatIconModule, MatToolbarModule],
  template: `
    <mat-toolbar class="navbar" color="primary">
      <div class="navbar-brand">
        <div class="logo-mark">
          <mat-icon>account_balance</mat-icon>
        </div>
        <div class="logo-copy">
          <span class="logo-text">FinTech<span class="logo-accent">Pro</span></span>
          <small>Banca digital</small>
        </div>
      </div>

      <div class="navbar-links">
        <a mat-button routerLink="/dashboard" routerLinkActive="active">Dashboard</a>

        <!-- Solo ADMIN -->
        <ng-container *ngIf="isAdmin">
          <a mat-button routerLink="/usuarios" routerLinkActive="active">Usuarios</a>
        </ng-container>

        <a mat-button routerLink="/cuentas" routerLinkActive="active">Cuentas</a>
        <a mat-button routerLink="/transacciones" routerLinkActive="active">Transacciones</a>
        <a mat-button routerLink="/prestamos" routerLinkActive="active">
          Préstamos <span *ngIf="isAdmin" class="feign-tag">FeignClient</span>
        </a>
      </div>

      <div class="navbar-user">
        <div class="user-meta">
          <span class="user-name">{{ session?.nombre }} {{ session?.apellido }}</span>
          <span class="user-role">{{ session?.rol }}</span>
        </div>
        <span class="badge" [class.badge-secondary]="isAdmin" [class.badge-info]="!isAdmin">
          {{ session?.rol }}
        </span>
        <button mat-stroked-button color="primary" class="logout-btn" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Salir
        </button>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 900;
      height: 72px;
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 0 24px;
      background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
      color: #0f172a;
      box-shadow: 0 8px 24px rgba(15, 23, 42, .08);
      border-bottom: 1px solid rgba(37, 99, 235, .08);
    }
    .navbar-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .logo-mark {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #fff;
      flex-shrink: 0;
    }
    .logo-mark mat-icon { width: 22px; height: 22px; font-size: 22px; }
    .logo-copy { display: flex; flex-direction: column; line-height: 1.1; }
    .logo-text { font-size: 18px; font-weight: 800; color: #0f172a; }
    .logo-accent { color: #7c3aed; }
    .logo-copy small { color: #64748b; font-size: 11px; margin-top: 2px; }

    .navbar-links { display: flex; gap: 4px; flex: 1; align-items: center; overflow: auto; }
    .navbar-links a {
      padding: 8px 12px; border-radius: 999px;
      text-decoration: none; color: #64748b;
      font-weight: 600; font-size: 13px;
      transition: background .15s, color .15s;
      display: flex; align-items: center; gap: 6px;
    }
    .navbar-links a:hover { background: #eef4ff; color: #2563eb; }
    .navbar-links a.active { background: #e8f1ff; color: #1d4ed8; }

    .feign-tag {
      font-size: 9px; font-weight: 700; background: #7c3aed;
      color: #fff; padding: 1px 5px; border-radius: 4px;
      letter-spacing: .3px;
    }

    .navbar-user { display: flex; align-items: center; gap: 10px; margin-left: auto; }
    .user-meta { display: flex; flex-direction: column; line-height: 1.1; text-align: right; }
    .user-name { font-size: 13px; font-weight: 700; color: #0f172a; }
    .user-role { font-size: 11px; color: #64748b; }
    .logout-btn { border-radius: 999px; }

    @media (max-width: 1100px) {
      .navbar { flex-wrap: wrap; height: auto; padding: 12px 16px; }
      .navbar-links { order: 3; width: 100%; }
      .navbar-user { margin-left: 0; }
    }
  `]
})
export class NavbarComponent {
  session = this.auth.getSession();
  get isAdmin(): boolean { return this.session?.rol === 'ADMIN'; }
  constructor(private auth: AuthService, private router: Router) {}
  logout(): void { this.auth.logout(); this.router.navigate(['/login']); }
}
