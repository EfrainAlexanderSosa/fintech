import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Transaccion } from '../models/models';

@Injectable({ providedIn: 'root' })
export class TransaccionService {

  private url = environment.msTransaccionesUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(this.url);
  }

  getById(id: number): Observable<Transaccion> {
    return this.http.get<Transaccion>(`${this.url}/${id}`);
  }

  getByCuenta(cuentaId: number): Observable<Transaccion[]> {
    return this.http.get<Transaccion[]>(`${this.url}/cuenta/${cuentaId}`);
  }

  create(transaccion: Transaccion): Observable<Transaccion> {
    return this.http.post<Transaccion>(this.url, transaccion);
  }

  update(id: number, transaccion: Transaccion): Observable<Transaccion> {
    return this.http.put<Transaccion>(`${this.url}/${id}`, transaccion);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
