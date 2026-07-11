import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HistorialService } from '../../services/historial.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.component.html'
})
export class HistorialComponent implements OnInit {
  registro: any = {
    historialId: null,
    equipo: { equipoId: null },
    estadoAnterior: { estadoId: null },
    estadoNuevo: { estadoId: null },
    usuarioResponsable: { usuarioId: null },
    observaciones: ''
  };

  listaHistorial: any[] = [];
  listaEquipos: any[] = [];
  listaUsuarios: any[] = [];
  listaEstados: any[] = [];

  mensajeExito = false;
  mensajeError = false;
  mensajeAccion: string = '';

  constructor(
    private service: HistorialService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.service.listar().subscribe((data: any) => {
      this.listaHistorial = data;
      this.cdr.detectChanges();
    });
    this.http.get('https://localhost:8080/api/equipos').subscribe((data: any) => this.listaEquipos = data);
    //this.http.get('https://localhost:8080/api/usuarios').subscribe((data: any) => this.listaUsuarios = data);
    // MODIFICADO: Filtramos la lista de usuarios para que solo guarde a los Técnicos
    this.http.get<any[]>('https://localhost:8080/api/usuarios').subscribe((data: any[]) => {
      this.listaUsuarios = data.filter(u => {
        // Extraemos el nombre del rol, manejando posibles valores nulos
        const nombreRol = (u.rol?.nombreRol || u.rol?.nombre || '').toUpperCase();
        // Solo dejamos pasar a los que coincidan con TECNICO (con o sin tilde)
        return nombreRol === 'TECNICO' || nombreRol === 'TÉCNICO';
      });
    });

    this.http.get('https://localhost:8080/api/estados-equipo').subscribe((data: any) => this.listaEstados = data);
  }

  // Lógica para auto-llenar el estado anterior
  onEquipoSeleccionado() {
    const equipoId = this.registro.equipo.equipoId;
    const equipoEncontrado = this.listaEquipos.find(e => e.equipoId == equipoId);

    if (equipoEncontrado && equipoEncontrado.estadoActual) {
      // Clonamos el estado para que sea un objeto independiente
      this.registro.estadoAnterior = { ...equipoEncontrado.estadoActual };
    } else {
      this.registro.estadoAnterior = { estadoId: null };
    }
    this.cdr.detectChanges();
  }

  // AHORA RECIBE EL NgForm
  guardar(form: NgForm) {
    const esEdicion = !!this.registro.historialId;

    this.service.guardar(this.registro).subscribe({
      next: () => {
        this.mensajeAccion = esEdicion ? 'Historial actualizado correctamente' : 'Historial registrado correctamente';
        this.cargarDatos();

        // borrar el historial de bordes rojos
        if (form) {
          form.resetForm();
        }

        this.limpiar();
        this.mensajeExito = true;
        this.mensajeError = false;
        setTimeout(() => this.mensajeExito = false, 3000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error al registrar:", err);
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
    this.registro = {
      historialId: null, equipo: { equipoId: null },
      estadoAnterior: { estadoId: null }, estadoNuevo: { estadoId: null },
      usuarioResponsable: { usuarioId: null }, observaciones: ''
    };
  }

  editar(h: any) {
    this.registro = {
      ...h,
      estadoAnterior: h.estadoAnterior ? { ...h.estadoAnterior } : { estadoId: null },
      estadoNuevo: h.estadoNuevo ? { ...h.estadoNuevo } : { estadoId: null },
      equipo: h.equipo ? { ...h.equipo } : { equipoId: null },
      usuarioResponsable: h.usuarioResponsable ? { ...h.usuarioResponsable } : { usuarioId: null }
    };
    this.cdr.detectChanges();
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que deseas eliminar?')) {
      this.service.eliminar(id).subscribe(() => this.cargarDatos());
    }
  }
}
