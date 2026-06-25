import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // Inyectamos tu AuthService y el Router para poder redireccionar
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Verificamos si existe el token usando el método creado
    if (this.authService.obtenerToken()) {
      return true; // ¡Tiene token, pasa!
    } else {
      this.router.navigate(['/login']); // No tiene token,  al login
      return false;
    }
  }
}
