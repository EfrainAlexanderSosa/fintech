import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <app-navbar *ngIf="auth.isLoggedIn()"></app-navbar>
    <main class="main-content" [class.with-nav]="auth.isLoggedIn()">
      <router-outlet></router-outlet>
    </main>
    <footer class="app-footer">
      <div class="app-footer-inner">
        <span>FinTechPro · Plataforma financiera</span>
        <span>© 2026 · DAW II</span>
      </div>
    </footer>
  `,
  styles: [`
    .main-content { min-height: calc(100vh - 64px); background: #f0f4ff; }
    .main-content.with-nav { padding-top: 72px; }
    .app-footer {
      border-top: 1px solid rgba(37, 99, 235, .08);
      background: linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%);
      color: #64748b;
      font-size: 12px;
      padding: 16px 24px;
    }
    .app-footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
