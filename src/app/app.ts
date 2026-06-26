import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
// 1. NUEVO: Importamos el AuthService
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html'
})
export class App {
  showMenu: boolean = false;

  // 2. NUEVO: Inyectamos private authService: AuthService en el constructor
  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Mostramos el menú en todas las rutas excepto login
        this.showMenu = event.url !== '/login' && event.url !== '/';
      }
    });
  }

  // 3. NUEVO: Creamos el "Getter" para leer los datos del token en la vista
  get usuarioActual() {
    return this.authService.obtenerDatosUsuario();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
