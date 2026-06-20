import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EstadoEquipoService {
  private url = 'http://localhost:8080/api/estados-equipo';
  constructor(private http: HttpClient) {}
  listar(): Observable<any> { return this.http.get(this.url); }
  guardar(e: any): Observable<any> {
    return e.estadoId ? this.http.put(this.url, e) : this.http.post(this.url, e);
  }
  eliminar(id: number): Observable<any> { return this.http.delete(`${this.url}/${id}`); }
}
