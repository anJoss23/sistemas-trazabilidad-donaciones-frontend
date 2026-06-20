import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InstitucionService {
  private url = 'http://localhost:8080/api/instituciones';
  constructor(private http: HttpClient) {}

  listar(): Observable<any> { return this.http.get(this.url); }
  guardar(i: any): Observable<any> {
    return i.institucionId ? this.http.put(this.url, i) : this.http.post(this.url, i);
  }
  eliminar(id: number): Observable<any> { return this.http.delete(`${this.url}/${id}`); }
}
