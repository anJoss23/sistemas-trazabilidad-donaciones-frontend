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
  mensajeExito: boolean = false; // Variable para controlar el mensaje

  constructor(private service: DonanteService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.service.listar().subscribe(data => {
      this.lista = data;
      this.cdr.detectChanges();
    });
  }

  guardar() {
    this.service.guardar(this.donante).subscribe(() => {
      this.cargar();
      this.limpiar();
      this.mensajeExito = true; // Mostramos el mensaje
      setTimeout(() => this.mensajeExito = false, 3000); // Lo ocultamos tras 3 segundos
      this.cdr.detectChanges();
    });
  }

  limpiar() { this.donante = { donanteId: null, razonSocial: '', rucDni: '', contactoNombre: '', correo: '', telefono: '', direccion: '' }; }
  eliminar(id: number) { if(confirm('¿Eliminar?')) this.service.eliminar(id).subscribe(() => this.cargar()); }
  editar(d: any) { this.donante = { ...d }; }
}
