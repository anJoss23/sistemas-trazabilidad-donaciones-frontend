import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TipoEquipoService } from '../../services/tipo-equipo.service';

@Component({
  selector: 'app-tipo-equipo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo-equipo.component.html'
})
export class TipoEquipoComponent implements OnInit {
  tipoEquipo: any = { tipoId: null, nombreTipo: '' };
  lista: any[] = [];
  mensajeExito: boolean = false;
  mensajeAccion: string = 'guardado';

  constructor(private service: TipoEquipoService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.service.listar().subscribe((data: any) => {
      this.lista = data;
      this.cdr.detectChanges();
    });
  }

  guardar() {
    this.mensajeAccion = this.tipoEquipo.tipoId ? 'actualizado' : 'guardado';
    this.service.guardar(this.tipoEquipo).subscribe(() => {
      this.cargar();
      this.limpiar();
      this.mensajeExito = true;
      setTimeout(() => this.mensajeExito = false, 3000);
      this.cdr.detectChanges();
    });
  }

  limpiar() {
    this.tipoEquipo = { tipoId: null, nombreTipo: '' };
  }

  editar(t: any) {
    console.log("Datos a editar recibidos de la tabla:", t);
    this.tipoEquipo = { ...t };
    this.cdr.detectChanges();
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar este tipo de equipo?')) {
      this.service.eliminar(id).subscribe(() => this.cargar());
    }
  }
}
