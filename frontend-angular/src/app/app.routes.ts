import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'reset-password/:token',
    loadComponent: () =>
      import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'usuarios',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent)
  },
  {
    path: 'cuentas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/cuentas/cuentas.component').then(m => m.CuentasComponent)
  },
  {
    path: 'transacciones',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/transacciones/transacciones.component').then(m => m.TransaccionesComponent)
  },
  {
    path: 'prestamos',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/prestamos/prestamos.component').then(m => m.PrestamosComponent)
  },
  { path: '**', redirectTo: 'login' }
];
