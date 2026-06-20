import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  @ViewChild('graficoEstados') graficoEstados!: ElementRef;
  chart: any;

  totalEquipos: number = 0;
  totalDespachos: number = 0;
  totalInstituciones: number = 0;
  totalUsuarios: number = 0;
  equiposRecientes: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef // Inyectamos el detector de cambios
  ) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    forkJoin({
      // Si falla, ahora imprimirá el error exacto en consola antes de devolver el array vacío
      equipos: this.http.get<any[]>('http://localhost:8080/api/equipos').pipe(catchError(e => { console.error('Error al traer equipos:', e); return of([]); })),
      despachos: this.http.get<any[]>('http://localhost:8080/api/despachos').pipe(catchError(e => { console.error('Error al traer despachos:', e); return of([]); })),
      instituciones: this.http.get<any[]>('http://localhost:8080/api/instituciones').pipe(catchError(e => { console.error('Error al traer instituciones:', e); return of([]); })),
      usuarios: this.http.get<any[]>('http://localhost:8080/api/usuarios').pipe(catchError(e => { console.error('Error al traer usuarios:', e); return of([]); }))
    }).subscribe({
      next: (data) => {
        this.totalEquipos = data.equipos.length;
        this.totalDespachos = data.despachos.length;
        this.totalInstituciones = data.instituciones.length;
        this.totalUsuarios = data.usuarios.length;

        this.equiposRecientes = data.equipos.slice(-5).reverse();

        // Forzamos a Angular a "despertar" y dibujar los números en el HTML
        this.cdr.detectChanges();

        if (this.totalEquipos > 0) {
          this.generarGrafico(data.equipos);
        }
      },
      error: (err) => console.error("Error crítico en el Dashboard", err)
    });
  }

  generarGrafico(equipos: any[]) {
    const conteoEstados: any = {};
    equipos.forEach(eq => {
      const estado = eq.estadoActual?.nombreEstado || 'Sin Estado';
      conteoEstados[estado] = (conteoEstados[estado] || 0) + 1;
    });

    const labels = Object.keys(conteoEstados);
    const datos = Object.values(conteoEstados);

    if (this.chart) {
      this.chart.destroy();
    }

    setTimeout(() => {
      if (this.graficoEstados && this.graficoEstados.nativeElement) {
        this.chart = new Chart(this.graficoEstados.nativeElement, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              data: datos,
              backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#0dcaf0', '#6c757d'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
          }
        });
      }
    }, 100);
  }
}
