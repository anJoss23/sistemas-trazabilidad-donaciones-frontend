import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.obtenerDatosUsuario();

    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // Obtenemos el rol del token
    const rol = user.role || user.rol || user.authorities || '';

    // Leemos la lista de roles bloqueados que definiremos en las rutas
    const rolesDenegados = route.data['rolesDenegados'] as Array<string>;

    // Si el rol del usuario está en la lista negra, le negamos el acceso
    if (rolesDenegados && rolesDenegados.includes(rol.toUpperCase())) {
      alert('Acceso denegado: Tu rol no tiene permisos para ver esta pantalla.');
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true; // Si no está en la lista negra, lo dejamos pasar
  }
}
