import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {
  rol: any = { rolId: null, nombreRol: '' };
  lista: any[] = [];
  mensajeExito = false;
  mensajeError = false;
  mensajeAccion: string = '';

  constructor(private service: RolService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.service.listar().subscribe((d: any) => {
      this.lista = d;
      this.cdr.detectChanges();
    });
  }

  guardar() {
    const esEdicion = !!this.rol.rolId;

    this.service.guardar(this.rol).subscribe({
      next: () => {
        this.mensajeAccion = esEdicion ? 'Rol actualizado correctamente' : 'Rol registrado correctamente';
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

  limpiar() { this.rol = { rolId: null, nombreRol: '' }; }

  editar(r: any) { this.rol = { ...r }; }

  eliminar(id: number) {
    if (confirm('¿Seguro que deseas eliminar este rol?')) {
      this.service.eliminar(id).subscribe(() => {
        this.cargar();
        this.cdr.detectChanges();
      });
    }
  }
}
