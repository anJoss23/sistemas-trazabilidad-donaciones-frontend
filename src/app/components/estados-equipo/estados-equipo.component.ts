import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  mensajeExito: boolean = false;
  mensajeAccion: string = 'guardado';

  constructor(private service: EstadoEquipoService, private cdr: ChangeDetectorRef) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.service.listar().subscribe((d: any) => {
      this.lista = d;
      this.cdr.detectChanges();
    });
  }

  guardar() {
    this.mensajeAccion = this.estado.estadoId ? 'actualizado' : 'guardado';
    this.service.guardar(this.estado).subscribe(() => {
      this.cargar();
      this.limpiar();
      this.mensajeExito = true;
      this.cdr.detectChanges(); // Forzamos actualización visual
      setTimeout(() => this.mensajeExito = false, 3000);
    });
  }

  limpiar() { this.estado = { estadoId: null, nombreEstado: '' }; }

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
