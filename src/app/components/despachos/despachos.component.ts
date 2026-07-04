import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DespachoService } from '../../services/despacho.service';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-despachos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './despachos.component.html'
})
export class DespachosComponent implements OnInit {
  despacho: any = {
    donacionId: null,
    institucion: { institucionId: null },
    usuarioResponsable: { usuarioId: null },
    fechaEnvio: '',
    numeroGuiaRemision: '',
    documentoReferenciaGuia: '',
    equipos: []
  };

  listaDespachos: any[] = [];
  listaInstituciones: any[] = [];
  listaUsuarios: any[] = [];
  listaEquipos: any[] = [];

  mensajeExito: boolean = false;
  mensajeAccion: string = 'registrado';

  // Variable para controlar el Modal
  despachoModal: any = null;

  constructor(
    private despachoService: DespachoService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.despachoService.listar().subscribe((data: any) => {
      this.listaDespachos = data;
      this.cdr.detectChanges();
    });
    this.http.get('https://localhost:8080/api/instituciones').subscribe((data: any) => this.listaInstituciones = data);
    this.http.get('https://localhost:8080/api/usuarios').subscribe((data: any) => this.listaUsuarios = data);
    this.http.get('https://localhost:8080/api/equipos').subscribe((data: any) => this.listaEquipos = data);
  }

  // --- LÓGICA DE CHECKBOXES ---
  isEquipoSeleccionado(equipo: any): boolean {
    return this.despacho.equipos.some((e: any) => e.equipoId === equipo.equipoId);
  }

  isEquipoDespachadoEnOtro(equipo: any): boolean {
    if (!this.despacho.donacionId) {
      return this.listaDespachos.some(d => d.equipos.some((e: any) => e.equipoId === equipo.equipoId));
    } else {
      return this.listaDespachos.some(d =>
        d.donacionId !== this.despacho.donacionId &&
        d.equipos.some((e: any) => e.equipoId === equipo.equipoId)
      );
    }
  }

  toggleEquipo(equipo: any, event: any) {
    if (event.target.checked) {
      this.despacho.equipos.push(equipo);
    } else {
      this.despacho.equipos = this.despacho.equipos.filter((e: any) => e.equipoId !== equipo.equipoId);
    }
  }

  guardar() {
    if (this.despacho.equipos.length === 0) {
      alert("Por favor, seleccione al menos un equipo para despachar.");
      return;
    }

    this.mensajeAccion = this.despacho.donacionId ? 'actualizado' : 'registrado';
    this.despachoService.guardar(this.despacho).subscribe({
      next: () => {
        this.cargarDatos();
        this.limpiar();
        this.mensajeExito = true;
        setTimeout(() => this.mensajeExito = false, 3000);
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Error al registrar despacho:", err)
    });
  }

  limpiar() {
    this.despacho = {
      donacionId: null, institucion: { institucionId: null }, usuarioResponsable: { usuarioId: null },
      fechaEnvio: '', numeroGuiaRemision: '', documentoReferenciaGuia: '', equipos: []
    };
  }

  editar(d: any) {
    this.despacho = {
      ...d,
      institucion: d.institucion ? { ...d.institucion } : { institucionId: null },
      usuarioResponsable: d.usuarioResponsable ? { ...d.usuarioResponsable } : { usuarioId: null },
      equipos: d.equipos ? [...d.equipos] : []
    };
    if (this.despacho.fechaEnvio) {
      this.despacho.fechaEnvio = this.despacho.fechaEnvio.split('T')[0];
    }
    this.cdr.detectChanges();
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que deseas eliminar esta guía de despacho? Los equipos volverán a estar disponibles.')) {
      this.despachoService.eliminar(id).subscribe(() => this.cargarDatos());
    }
  }

  // --- LÓGICA DEL MODAL ---
  abrirModal(despacho: any) {
    this.despachoModal = despacho;
  }

  cerrarModal() {
    this.despachoModal = null;
  }

  // --- LÓGICA DEL PDF (GUÍA DE REMISIÓN) ---
  generarPDF(d: any) {
    const doc = new jsPDF();

    // Título principal
    doc.setFontSize(22);
    doc.setTextColor(40, 116, 166); // Color azul verdoso
    doc.text('GUÍA DE REMISIÓN / DONACIÓN', 105, 20, { align: 'center' });

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(15, 25, 195, 25);

    // Datos del Despacho
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    // Formatear la fecha
    let fechaFormat = d.fechaEnvio ? new Date(d.fechaEnvio).toLocaleDateString() : 'N/A';

    doc.text(`N° de Guía: ${d.numeroGuiaRemision || 'S/N'}`, 15, 35);
    doc.text(`Fecha de Envío: ${fechaFormat}`, 130, 35);
    doc.text(`Institución Destino: ${d.institucion?.nombreColegio || 'N/A'}`, 15, 45);
    doc.text(`Doc. Referencia: ${d.documentoReferenciaGuia || 'N/A'}`, 130, 45);
    doc.text(`Responsable Técnico: ${d.usuarioResponsable?.nombre || 'N/A'}`, 15, 55);

    // Mapear los equipos para la tabla
    const bodyTabla = d.equipos ? d.equipos.map((eq: any, index: number) => [
      index + 1,
      eq.numeroSerie || 'S/N',
      eq.marca || 'N/A',
      eq.modelo || 'N/A',
      eq.tipoEquipo?.nombreTipo || 'N/A'
    ]) : [];

    // Dibujar la tabla
    autoTable(doc, {
      startY: 65,
      head: [['N°', 'Número de Serie', 'Marca', 'Modelo', 'Tipo de Equipo']],
      body: bodyTabla,
      theme: 'grid',
      headStyles: { fillColor: [40, 116, 166] },
      margin: { top: 10 }
    });

    // Firmas al final de la página
    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.text('_________________________', 40, finalY + 40, { align: 'center' });
    doc.text('Entregué Conforme', 40, finalY + 48, { align: 'center' });

    doc.text('_________________________', 170, finalY + 40, { align: 'center' });
    doc.text('Recibí Conforme', 170, finalY + 48, { align: 'center' });

    // Guardar y descargar
    doc.save(`Guia_Remision_${d.numeroGuiaRemision || 'Documento'}.pdf`);
  }
}
