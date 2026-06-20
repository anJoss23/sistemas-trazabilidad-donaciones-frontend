import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoEquipoService {
  private url = 'http://localhost:8080/api/tipos-equipo';

  constructor(private http: HttpClient) {}

  listar(): Observable<any> {
    return this.http.get(this.url);
  }

  guardar(tipo: any): Observable<any> {
    if (tipo.tipoId) {
      return this.http.put(this.url, tipo);
    } else {
      return this.http.post(this.url, tipo);
    }
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
