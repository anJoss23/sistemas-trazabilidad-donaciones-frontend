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
  mensajeExito: boolean = false;
  mensajeAccion: string = 'guardado';

  constructor(private service: RolService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.service.listar().subscribe((d: any) => {
      this.lista = d;
      this.cdr.detectChanges();
    });
  }

  guardar() {
    this.mensajeAccion = this.rol.rolId ? 'actualizado' : 'guardado';
    this.service.guardar(this.rol).subscribe(() => {
      this.cargar();
      this.limpiar();
      this.mensajeExito = true;
      this.cdr.detectChanges(); // Forzamos actualización visual
      setTimeout(() => this.mensajeExito = false, 3000);
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
