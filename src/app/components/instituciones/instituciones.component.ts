import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InstitucionService } from '../../services/institucion.service';

@Component({
  selector: 'app-instituciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instituciones.component.html'
})
export class InstitucionesComponent implements OnInit {
  inst: any = { institucionId: null, nombreColegio: '', director: '', direccion: '', ugel: '', telefonoContacto: '' };
  lista: any[] = [];
  mensajeExito: boolean = false;

  constructor(private service: InstitucionService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.service.listar().subscribe(data => {
      this.lista = data;
      this.cdr.detectChanges();
    });
  }

  guardar() {
    this.service.guardar(this.inst).subscribe(() => {
      this.cargar();
      this.limpiar();
      this.mensajeExito = true;
      setTimeout(() => this.mensajeExito = false, 3000);
      this.cdr.detectChanges();
    });
  }

  limpiar() { this.inst = { institucionId: null, nombreColegio: '', director: '', direccion: '', ugel: '', telefonoContacto: '' }; }
  eliminar(id: number) { if(confirm('¿Eliminar?')) this.service.eliminar(id).subscribe(() => this.cargar()); }
  editar(i: any) { this.inst = { ...i }; }
}
