import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly AUTH_KEY = 'fintech_user';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.msUsuariosUrl}/login`, credentials)
      .pipe(tap(resp => {
        if (resp.autenticado) {
          sessionStorage.setItem(this.AUTH_KEY, JSON.stringify(resp));
        }
      }));
  }

  logout(): void {
    sessionStorage.removeItem(this.AUTH_KEY);
  }

  getSession(): LoginResponse | null {
    const data = sessionStorage.getItem(this.AUTH_KEY);
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getSession();
  }
}
