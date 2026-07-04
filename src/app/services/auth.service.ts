// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales);
  }

  guardarToken(token: string): void {
    localStorage.setItem('token', token);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
  }
  //  MÉTODO PARA LEER LOS DATOS DEL TOKEN
  /*obtenerDatosUsuario(): any {
    const token = this.obtenerToken();
    if (token) {
      try {
        // El token JWT tiene 3 partes separadas por un punto. Los datos están en el medio .
        const payload = token.split('.')[1];
        // Decodificamos el texto de Base64
        const decodedPayload = atob(payload);
        return JSON.parse(decodedPayload);
      } catch (error) {
        console.error('Error al decodificar el token', error);
        return null;
      }

    }
    return null;
  }*/

    obtenerDatosUsuario(): any {
    const token = this.obtenerToken();
    if (token) {
      try {
        let payload = token.split('.')[1];

        // 1. Reemplazamos caracteres especiales de Base64-URL por si el token los trae
        payload = payload.replace(/-/g, '+').replace(/_/g, '/');

        // 2. Decodificación segura para tildes y eñes (UTF-8)
        const decodedPayload = decodeURIComponent(
          window.atob(payload).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join('')
        );

        return JSON.parse(decodedPayload);
      } catch (error) {
        console.error('Error al decodificar el token', error);
        return null;
      }
    }
    return null;
  }
}
