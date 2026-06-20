import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// IMPORTAMOS TU SERVICIO DE HISTORIAL
import { HistorialService } from '../../services/historial.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html'
})
export class ReportesComponent implements OnInit {
  tipoReporte: string = 'equipos';

  // Datos Originales
  equipos: any[] = [];
  despachos: any[] = [];
  instituciones: any[] = [];
  historial: any[] = [];

  // Datos Filtrados
  equiposFiltrados: any[] = [];
  despachosFiltrados: any[] = [];
  institucionesFiltradas: any[] = [];
  historialFiltrado: any[] = [];

  // Catálogos para desplegables
  listaEstados: any[] = [];
  listaTipos: any[] = [];
  listaDonantes: any[] = [];
  listaUsuarios: any[] = [];

  // Filtros
  filtrosEquipos = { estadoId: null, tipoId: null, donanteId: null };
  filtroDespachos = { institucionId: null };
  filtrosHistorial = { usuarioId: null, equipoId: null };

  despachoSeleccionadoModal: any = null;

  // INYECTAMOS TU SERVICIO AQUÍ
  constructor(
    private http: HttpClient,
    private historialService: HistorialService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cambiarPestana(tipo: string) {
    this.tipoReporte = tipo;
    this.cdr.detectChanges();
  }

  cargarDatos() {
    this.http.get<any[]>('http://localhost:8080/api/equipos').subscribe(data => {
      this.equipos = data; this.equiposFiltrados = data;
    });
    this.http.get<any[]>('http://localhost:8080/api/despachos').subscribe(data => {
      this.despachos = data; this.despachosFiltrados = data;
    });
    this.http.get<any[]>('http://localhost:8080/api/instituciones').subscribe(data => {
      this.instituciones = data; this.institucionesFiltradas = data;
    });

    // MAGIA APLICADA: Usamos tu servicio para evitar el Error 404
    this.historialService.listar().subscribe((data: any) => {
      this.historial = data;
      this.historialFiltrado = data;
      this.cdr.detectChanges();
    });

    this.http.get<any[]>('http://localhost:8080/api/estados-equipo').subscribe(data => this.listaEstados = data);
    this.http.get<any[]>('http://localhost:8080/api/tipos-equipo').subscribe(data => this.listaTipos = data);
    this.http.get<any[]>('http://localhost:8080/api/donantes').subscribe(data => this.listaDonantes = data);
    this.http.get<any[]>('http://localhost:8080/api/usuarios').subscribe(data => this.listaUsuarios = data);
  }

  abrirModalEquipos(despacho: any) {
    this.despachoSeleccionadoModal = despacho;
    this.cdr.detectChanges();
  }

  cerrarModalEquipos() {
    this.despachoSeleccionadoModal = null;
    this.cdr.detectChanges();
  }

  aplicarFiltrosEquipos() {
    this.equiposFiltrados = this.equipos.filter(eq => {
      const c1 = this.filtrosEquipos.estadoId ? eq.estadoActual?.estadoId == this.filtrosEquipos.estadoId : true;
      const c2 = this.filtrosEquipos.tipoId ? eq.tipoEquipo?.tipoId == this.filtrosEquipos.tipoId : true;
      const c3 = this.filtrosEquipos.donanteId ? eq.donante?.donanteId == this.filtrosEquipos.donanteId : true;
      return c1 && c2 && c3;
    });
  }

  aplicarFiltrosDespachos() {
    this.despachosFiltrados = this.despachos.filter(d => {
      return this.filtroDespachos.institucionId ? d.institucion?.institucionId == this.filtroDespachos.institucionId : true;
    });
  }

  aplicarFiltrosHistorial() {
    this.historialFiltrado = this.historial.filter(h => {
      const c1 = this.filtrosHistorial.usuarioId ? h.usuarioResponsable?.usuarioId == this.filtrosHistorial.usuarioId : true;
      const c2 = this.filtrosHistorial.equipoId ? h.equipo?.equipoId == this.filtrosHistorial.equipoId : true;
      return c1 && c2;
    });
  }

  limpiarFiltros() {
    this.filtrosEquipos = { estadoId: null, tipoId: null, donanteId: null };
    this.filtroDespachos = { institucionId: null };
    this.filtrosHistorial = { usuarioId: null, equipoId: null };

    this.equiposFiltrados = [...this.equipos];
    this.despachosFiltrados = [...this.despachos];
    this.historialFiltrado = [...this.historial];
  }

  exportarPDF() {
    const doc = new jsPDF();
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 15, 28);

    if (this.tipoReporte === 'equipos') {
      doc.setFontSize(18); doc.setTextColor(40, 116, 166);
      doc.text('Reporte de Inventario de Equipos', 105, 20, { align: 'center' });
      const body = this.equiposFiltrados.map((eq, i) => [ i + 1, eq.numeroSerie || 'S/N', `${eq.marca} ${eq.modelo}`, eq.tipoEquipo?.nombreTipo || 'N/A', eq.estadoActual?.nombreEstado || 'N/A', eq.donante?.razonSocial || 'N/A' ]);
      autoTable(doc, { startY: 35, head: [['N°', 'N° Serie', 'Marca/Modelo', 'Tipo', 'Estado', 'Donante']], body: body, theme: 'grid' });
      doc.save('Reporte_Equipos.pdf');

    } else if (this.tipoReporte === 'despachos') {
      doc.setFontSize(18); doc.setTextColor(40, 116, 166);
      doc.text('Reporte de Guías de Despacho', 105, 20, { align: 'center' });
      const body = this.despachosFiltrados.map((d, i) => [ i + 1, d.numeroGuiaRemision || 'S/N', new Date(d.fechaEnvio).toLocaleDateString(), d.institucion?.nombreColegio || 'N/A', d.equipos?.length || 0, d.usuarioResponsable?.nombre || 'N/A' ]);
      autoTable(doc, { startY: 35, head: [['N°', 'Guía', 'Fecha', 'Colegio Destino', 'Cant. Equipos', 'Responsable']], body: body, theme: 'grid' });
      doc.save('Reporte_Despachos.pdf');

    } else if (this.tipoReporte === 'instituciones') {
      doc.setFontSize(18); doc.setTextColor(40, 116, 166);
      doc.text('Directorio de Instituciones Beneficiarias', 105, 20, { align: 'center' });
      const body = this.institucionesFiltradas.map((inst, i) => [ i + 1, inst.nombreColegio, inst.director || 'N/A', inst.telefonoContacto || 'N/A', inst.ugel || 'N/A' ]);
      autoTable(doc, { startY: 35, head: [['N°', 'Colegio', 'Director', 'Teléfono', 'UGEL']], body: body, theme: 'grid' });
      doc.save('Reporte_Instituciones.pdf');

    } else if (this.tipoReporte === 'historial') {
      doc.setFontSize(18); doc.setTextColor(40, 116, 166);
      doc.text('Reporte de Trazabilidad Técnica', 105, 20, { align: 'center' });
      const body = this.historialFiltrado.map((h, i) => [
        i + 1,
        h.equipo?.numeroSerie || 'S/N',
        h.usuarioResponsable?.nombre || 'N/A',
        h.estadoAnterior?.nombreEstado || 'Ingreso',
        h.estadoNuevo?.nombreEstado || 'N/A',
        h.fechaCambio ? new Date(h.fechaCambio).toLocaleDateString() : 'N/A'
      ]);
      autoTable(doc, { startY: 35, head: [['N°', 'N° Serie', 'Técnico', 'Est. Anterior', 'Est. Nuevo', 'Fecha']], body: body, theme: 'grid' });
      doc.save('Reporte_Trazabilidad.pdf');
    }
  }

  exportarExcel() {
    let csv = '';
    let nombreArchivo = '';

    if (this.tipoReporte === 'equipos') {
      csv = 'Nro Serie,Marca,Modelo,Tipo,Estado,Donante\n';
      this.equiposFiltrados.forEach(eq => {
        let donante = eq.donante?.razonSocial ? `"${eq.donante.razonSocial}"` : 'N/A';
        csv += `${eq.numeroSerie || 'S/N'},${eq.marca || ''},${eq.modelo || ''},${eq.tipoEquipo?.nombreTipo || ''},${eq.estadoActual?.nombreEstado || ''},${donante}\n`;
      });
      nombreArchivo = 'Reporte_Equipos.csv';

    } else if (this.tipoReporte === 'despachos') {
      csv = 'Nro Guia,Fecha Envio,Colegio Destino,Cant Equipos,Responsable\n';
      this.despachosFiltrados.forEach(d => {
        let colegio = d.institucion?.nombreColegio ? `"${d.institucion.nombreColegio}"` : 'N/A';
        csv += `${d.numeroGuiaRemision || 'S/N'},${new Date(d.fechaEnvio).toLocaleDateString()},${colegio},${d.equipos?.length || 0},${d.usuarioResponsable?.nombre || ''}\n`;
      });
      nombreArchivo = 'Reporte_Despachos.csv';

    } else if (this.tipoReporte === 'instituciones') {
      csv = 'Colegio,Director,Telefono,UGEL,Direccion\n';
      this.institucionesFiltradas.forEach(i => {
        let colegio = i.nombreColegio ? `"${i.nombreColegio}"` : '';
        let dir = i.direccion ? `"${i.direccion}"` : '';
        csv += `${colegio},${i.director || ''},${i.telefonoContacto || ''},${i.ugel || ''},${dir}\n`;
      });
      nombreArchivo = 'Reporte_Instituciones.csv';

    } else if (this.tipoReporte === 'historial') {
      csv = 'Nro Serie,Tecnico,Estado Anterior,Estado Nuevo,Fecha,Observaciones\n';
      this.historialFiltrado.forEach(h => {
        let obs = h.observaciones ? `"${h.observaciones}"` : '';
        let fecha = h.fechaCambio ? new Date(h.fechaCambio).toLocaleDateString() : 'N/A';
        csv += `${h.equipo?.numeroSerie || 'S/N'},${h.usuarioResponsable?.nombre || 'N/A'},${h.estadoAnterior?.nombreEstado || 'Ingreso'},${h.estadoNuevo?.nombreEstado || 'N/A'},${fecha},${obs}\n`;
      });
      nombreArchivo = 'Reporte_Trazabilidad.csv';
    }

    const blob = new Blob(["\ufeff", csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nombreArchivo;
    link.click();
  }
}
