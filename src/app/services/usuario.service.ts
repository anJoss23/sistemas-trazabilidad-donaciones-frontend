import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private url = 'http://localhost:8080/api/usuarios';
  constructor(private http: HttpClient) {}

  listar(): Observable<any> { return this.http.get(this.url); }
  guardar(u: any): Observable<any> {
    return u.usuarioId ? this.http.put(this.url, u) : this.http.post(this.url, u);
  }
  eliminar(id: number): Observable<any> { return this.http.delete(`${this.url}/${id}`); }
}
