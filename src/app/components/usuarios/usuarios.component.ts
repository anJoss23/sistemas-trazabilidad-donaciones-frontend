import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClient } from '@angular/common/http'; // IMPORTANTE: Agregamos HttpClient

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  usuario: any = {
    usuarioId: null,
    nombre: '',
    correo: '',
    contrasena: '',
    rol: { rolId: null } // Cambiamos el 2 por null para que muestre el placeholder "-- Seleccione --"
  };

  lista: any[] = [];
  listaRoles: any[] = []; // NUEVA LISTA DINÁMICA
  mensajeExito = false;
  mensajeError = false;
  mensajeAccion: string = '';
  constructor(
    private usuarioService: UsuarioService,
    private http: HttpClient, // Inyectamos HttpClient
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargar();
    this.cargarRoles(); // Sincronizamos los roles de la BD
  }

  cargar() {
    this.usuarioService.listar().subscribe(data => {
      this.lista = data;
      this.cdr.detectChanges();
    });
  }

  // FUNCIÓN PARA TRAER ROLES DE MySQL
  cargarRoles() {
    this.http.get<any[]>('http://localhost:8080/api/roles').subscribe(data => {
      this.listaRoles = data;
      this.cdr.detectChanges();
    });
  }

  guardar() {
    const esEdicion = !!this.usuario.usuarioId;
    this.usuarioService.guardar(this.usuario).subscribe({
      next: () => {
        this.mensajeAccion = esEdicion ? 'Usuario actualizado correctamente' : 'Usuario registrado correctamente';
        this.cargar();
        this.limpiar();
        this.mensajeExito = true;
        this.mensajeError = false;
        setTimeout(() => this.mensajeExito = false, 3000);
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensajeError = true;
        this.mensajeExito = false;
        this.cdr.detectChanges();
      }
    });
  }

  limpiar() {
    this.usuario = {
      usuarioId: null,
      nombre: '',
      correo: '',
      contrasena: '',
      rol: { rolId: null }
    };
  }

  editar(u: any) {
    this.usuario = {
      ...u,
      contrasena: '',
      // Evita errores si el usuario no tiene rol asignado
      rol: u.rol ? { ...u.rol } : { rolId: null }
    };
    this.cdr.detectChanges();
  }

  eliminar(id: number) {
    if(confirm('¿Seguro que deseas eliminar?')) {
      this.usuarioService.eliminar(id).subscribe(() => this.cargar());
    }
  }
}
