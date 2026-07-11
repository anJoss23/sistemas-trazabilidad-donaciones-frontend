import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
  mensajeExito = false;
  mensajeError = false;
  mensajeAccion: string = '';

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

  // AHORA RECIBE EL NgForm
  guardar(form: NgForm) {
    const esEdicion = !!this.tipoEquipo.tipoId;

    this.service.guardar(this.tipoEquipo).subscribe({
      next: () => {
        this.mensajeAccion = esEdicion ? 'Tipo de equipo actualizado' : 'Tipo de equipo registrado';
        this.cargar();

        // Resetea el historial visual de campos rojos
        if (form) {
          form.resetForm();
        }

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

  // RECIBE FORM OPCIONAL PARA EL BOTÓN CANCELAR
  limpiar(form?: NgForm) {
    if (form) {
      form.resetForm();
    }
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
