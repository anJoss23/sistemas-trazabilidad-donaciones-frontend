import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RolService {
  private url = 'https://localhost:8080/api/roles';
  constructor(private http: HttpClient) {}
  listar(): Observable<any> { return this.http.get(this.url); }
  guardar(r: any): Observable<any> {
    return r.rolId ? this.http.put(this.url, r) : this.http.post(this.url, r);
  }
  eliminar(id: number): Observable<any> { return this.http.delete(`${this.url}/${id}`); }
}
