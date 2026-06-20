import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DespachoService {
  private url = 'http://localhost:8080/api/despachos';

  constructor(private http: HttpClient) {}

  listar(): Observable<any> {
    return this.http.get(this.url);
  }

  guardar(despacho: any): Observable<any> {
    if (despacho.donacionId) {
      return this.http.put(this.url, despacho);
    } else {
      return this.http.post(this.url, despacho);
    }
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
