import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EquipoService } from '../../services/equipo.service';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipos.component.html'
})
export class EquiposComponent implements OnInit {
  nuevoEquipo: any = {
    equipoId: null,
    numeroSerie: '',
    marca: '',
    modelo: '',
    fechaRecepcion: '',
    tipoEquipo: { tipoId: null },
    estadoActual: { estadoId: null },
    donante: { donanteId: null },
    usuarioResponsable: { usuarioId: null } // AGREGADO
  };

  listaEquipos: any[] = [];
  listaTipos: any[] = [];
  listaEstados: any[] = [];
  listaDonantes: any[] = [];
  listaUsuarios: any[] = []; // AGREGADO

  mensajeExito = false;
  mensajeError = false;
  mensajeAccion: string = '';

  constructor(
    private equipoService: EquipoService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.cargarLista();
    this.cargarCatalogos();
  }

  cargarLista() {
    this.equipoService.listarEquipos().subscribe((data: any) => {
      this.listaEquipos = data;
      this.cdr.detectChanges();
    });
  }

  cargarCatalogos() {
    this.http.get<any[]>('http://localhost:8080/api/tipos-equipo').subscribe(data => { this.listaTipos = data; this.cdr.detectChanges(); });
    this.http.get<any[]>('http://localhost:8080/api/estados-equipo').subscribe(data => { this.listaEstados = data; this.cdr.detectChanges(); });
    this.http.get<any[]>('http://localhost:8080/api/donantes').subscribe(data => { this.listaDonantes = data; this.cdr.detectChanges(); });

    // CAMBIO AQUÍ: Ahora pedimos específicamente a los "tecnicos"
    this.http.get<any[]>('http://localhost:8080/api/usuarios/tecnicos').subscribe(data => {
      this.listaUsuarios = data;
      this.cdr.detectChanges();
    });}

  registrar() {
    const esEdicion = !!this.nuevoEquipo.equipoId;
    const operacion = esEdicion ? this.equipoService.actualizarEquipo(this.nuevoEquipo) : this.equipoService.registrarEquipo(this.nuevoEquipo);

    operacion.subscribe({
      next: () => {
        this.mensajeAccion = esEdicion ? 'Equipo editado correctamente' : 'Equipo registrado correctamente';
        this.mensajeExito = true;
        this.limpiarFormulario();
        this.cargarLista();
        this.cdr.detectChanges();
        setTimeout(() => this.mensajeExito = false, 3000);
      },
      error: () => { this.mensajeError = true; this.cdr.detectChanges(); }
    });
  }

  eliminar(id: number) {
    if(confirm('¿Seguro que deseas eliminar?')) {
      this.equipoService.eliminar(id).subscribe(() => this.cargarLista());
    }
  }

  cargarParaEditar(eq: any) {
    this.nuevoEquipo = {
      ...eq,
      tipoEquipo: eq.tipoEquipo ? { ...eq.tipoEquipo } : { tipoId: null },
      estadoActual: eq.estadoActual ? { ...eq.estadoActual } : { estadoId: null },
      donante: eq.donante ? { ...eq.donante } : { donanteId: null },
      usuarioResponsable: eq.usuarioResponsable ? { ...eq.usuarioResponsable } : { usuarioId: null } // AGREGADO
    };
    if (this.nuevoEquipo.fechaRecepcion) this.nuevoEquipo.fechaRecepcion = this.nuevoEquipo.fechaRecepcion.split('T')[0];
  }

  limpiarFormulario() {
    this.nuevoEquipo = {
      equipoId: null, numeroSerie: '', marca: '', modelo: '', fechaRecepcion: '',
      tipoEquipo: { tipoId: null }, estadoActual: { estadoId: null }, donante: { donanteId: null },
      usuarioResponsable: { usuarioId: null } // AGREGADO
    };
  }
}
