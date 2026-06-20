import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Le quitamos la "ñ" aquí para que Angular no se queje
  credenciales = { correo: '', contrasena: '' };
  errorLogin = false;

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
    // Armamos un paquete especial devolviéndole la "ñ" para que tu Backend de Java lo entienda
    const paqueteParaBackend = {
      correo: this.credenciales.correo,
      contraseña: this.credenciales.contrasena
    };

    this.authService.login(paqueteParaBackend).subscribe({
      next: (respuesta) => {
        this.authService.guardarToken(respuesta.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorLogin = true;
      }
    });
  }
}
