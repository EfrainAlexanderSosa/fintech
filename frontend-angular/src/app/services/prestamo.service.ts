import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Prestamo } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PrestamoService {

  private url = environment.msPrestamosUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.url);
  }

  getById(id: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.url}/${id}`);
  }

  getByUsuario(usuarioId: number): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.url}/usuario/${usuarioId}`);
  }

  create(prestamo: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(this.url, prestamo);
  }

  aprobar(id: number): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.url}/${id}/aprobar`, {});
  }

  update(id: number, prestamo: Prestamo): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.url}/${id}`, prestamo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
