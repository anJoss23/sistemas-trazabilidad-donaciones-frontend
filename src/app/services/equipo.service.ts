import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private apiUrl = 'https://localhost:8080/api/equipos';

  constructor(private http: HttpClient) { }

  listarEquipos(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  registrarEquipo(equipo: any): Observable<any> {
    return this.http.post(this.apiUrl, equipo);
  }

  actualizarEquipo(equipo: any): Observable<any> {
    return this.http.put(this.apiUrl, equipo);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
