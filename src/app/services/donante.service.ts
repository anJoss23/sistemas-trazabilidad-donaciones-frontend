import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DonanteService {
  private url = 'http://localhost:8080/api/donantes';
  constructor(private http: HttpClient) {}

  listar(): Observable<any> { return this.http.get(this.url); }
  guardar(d: any): Observable<any> {
    return d.donanteId ? this.http.put(this.url, d) : this.http.post(this.url, d);
  }
  eliminar(id: number): Observable<any> { return this.http.delete(`${this.url}/${id}`); }
}
