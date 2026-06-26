import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonanteService } from '../../services/donante.service';

@Component({
  selector: 'app-donantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donantes.component.html'
})
export class DonantesComponent implements OnInit {
  donante: any = { donanteId: null, razonSocial: '', rucDni: '', contactoNombre: '', correo: '', telefono: '', direccion: '' };
  lista: any[] = [];
   // Variable para controlar el mensaje
  mensajeExito = false;
  mensajeError = false;
  mensajeAccion: string = '';

  constructor(private service: DonanteService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.service.listar().subscribe(data => {
      this.lista = data;
      this.cdr.detectChanges();
    });
  }

  guardar() {
    const esEdicion = !!this.donante.donanteId;

    this.service.guardar(this.donante).subscribe({
      next: () => {
        this.mensajeAccion = esEdicion ? 'Donante actualizado correctamente' : 'Donante registrado correctamente';
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

  limpiar() { this.donante = { donanteId: null, razonSocial: '', rucDni: '', contactoNombre: '', correo: '', telefono: '', direccion: '' }; }
  eliminar(id: number) { if(confirm('¿Eliminar?')) this.service.eliminar(id).subscribe(() => this.cargar()); }
  editar(d: any) { this.donante = { ...d }; }
}
