import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cuenta } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CuentaService {

  private url = environment.msCuentasUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(this.url);
  }

  getById(id: number): Observable<Cuenta> {
    return this.http.get<Cuenta>(`${this.url}/${id}`);
  }

  getByUsuario(usuarioId: number): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(`${this.url}/usuario/${usuarioId}`);
  }

  create(cuenta: Cuenta): Observable<Cuenta> {
    return this.http.post<Cuenta>(this.url, cuenta);
  }

  update(id: number, cuenta: Cuenta): Observable<Cuenta> {
    return this.http.put<Cuenta>(`${this.url}/${id}`, cuenta);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
