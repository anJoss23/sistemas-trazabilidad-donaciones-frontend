import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private url = 'http://localhost:8080/api/historial-cambios';

  constructor(private http: HttpClient) {}

  listar(): Observable<any> {
    return this.http.get(this.url);
  }

  guardar(historial: any): Observable<any> {
    if (historial.historialId) {
      return this.http.put(this.url, historial);
    } else {
      return this.http.post(this.url, historial);
    }
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
