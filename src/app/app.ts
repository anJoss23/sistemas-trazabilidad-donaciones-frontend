import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
// 1. Importamos el AuthService
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  // CORRECCIÓN DE RUTAS EXACTAS SEGÚN TUS NOMBRES DE ARCHIVO:
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  showMenu: boolean = false;

  // 2.  Inyectamos private authService: AuthService en el constructor
  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Mostramos el menú en todas las rutas excepto login
        this.showMenu = event.url !== '/login' && event.url !== '/';
      }
    });
  }

  // 3. Creamos el "Getter" para leer los datos del token en la vista
  get usuarioActual() {
    return this.authService.obtenerDatosUsuario();
  }
  // 4. Atajo para obtener el nombre del rol en mayúsculas (evita errores de texto)
  get rolUsuario() {
    const user = this.usuarioActual;
    const rol = user ? (user.role || user.rol || user.authorities || '') : '';
    return rol.toUpperCase();
  }


  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
