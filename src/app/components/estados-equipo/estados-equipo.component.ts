import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { EstadoEquipoService } from '../../services/estado-equipo.service';

@Component({
  selector: 'app-estados-equipo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estados-equipo.component.html'
})
export class EstadosEquipoComponent implements OnInit {
  estado: any = { estadoId: null, nombreEstado: '' };
  lista: any[] = [];

  //esto esta
  //mensajeExito: boolean = false;
//  mensajeAccion: string = 'guardado';
//esto es nuevo
  mensajeExito = false;
  mensajeError = false;
  mensajeAccion: string = '';



  constructor(private service: EstadoEquipoService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.service.listar().subscribe((d: any) => {
      this.lista = d;
      this.cdr.detectChanges();
    });
  }

  // AHORA RECIBE EL NgForm
  guardar(form: NgForm) {
    const esEdicion = !!this.estado.estadoId;

    this.service.guardar(this.estado).subscribe({
      next: () => {
        this.mensajeAccion = esEdicion ? 'Estado actualizado correctamente' : 'Estado registrado correctamente';
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
    this.estado = { estadoId: null, nombreEstado: '' };
  }

  editar(e: any) { this.estado = { ...e }; }

  eliminar(id: number) {
    if (confirm('¿Seguro que deseas eliminar este estado?')) {
      this.service.eliminar(id).subscribe(() => {
        this.cargar();
        this.cdr.detectChanges();
      });
    }
  }
}
