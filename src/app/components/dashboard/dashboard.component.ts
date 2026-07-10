import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Chart from 'chart.js/auto';
// NUEVO: Importamos el servicio de autenticación para leer el rol y correo
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  @ViewChild('graficoEstados') graficoEstados!: ElementRef;
  chart: any;

  // --- VARIABLES PARA EL DASHBOARD GENERAL (Admin/Registrador) ---
  totalEquipos: number = 0;
  totalDespachos: number = 0;
  totalInstituciones: number = 0;
  totalUsuarios: number = 0;
  equiposRecientes: any[] = [];

  // --- VARIABLES PARA EL DASHBOARD DEL TÉCNICO ---
  rolUsuario: string = '';
  correoUsuario: string = '';
  misEquiposAsignados: number = 0;
  misEquiposReparados: number = 0; // Operativos o listos para donar
  miHistorial: any[] = [];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: AuthService // Inyectamos el servicio
  ) {}

  ngOnInit() {
    // 1. Averiguamos quién está logueado
    const user = this.authService.obtenerDatosUsuario();
    if (user) {
      this.correoUsuario = user.sub; // Guardamos su correo para filtrar luego
      this.rolUsuario = (user.role || user.rol || user.authorities || '').toUpperCase();
    }

    // 2. Decidimos qué dashboard cargar según el rol
    if (this.rolUsuario === 'TECNICO' || this.rolUsuario === 'TÉCNICO') {
      this.cargarEstadisticasTecnico();
    } else {
      this.cargarEstadisticasGeneral();
    }
  }


  // MÉTODO ORIGINAL: CARGA TODO (Administrador/Registrador)

  cargarEstadisticasGeneral() {
    forkJoin({
      equipos: this.http.get<any[]>('https://localhost:8080/api/equipos').pipe(catchError(e => { console.error('Error equipos:', e); return of([]); })),
      despachos: this.http.get<any[]>('https://localhost:8080/api/despachos').pipe(catchError(e => { console.error('Error despachos:', e); return of([]); })),
      instituciones: this.http.get<any[]>('https://localhost:8080/api/instituciones').pipe(catchError(e => { console.error('Error instituciones:', e); return of([]); })),
      usuarios: this.http.get<any[]>('https://localhost:8080/api/usuarios').pipe(catchError(e => { console.error('Error usuarios:', e); return of([]); }))
    }).subscribe({
      next: (data) => {
        this.totalEquipos = data.equipos.length;
        this.totalDespachos = data.despachos.length;
        this.totalInstituciones = data.instituciones.length;
        this.totalUsuarios = data.usuarios.length;
        this.equiposRecientes = data.equipos.slice(-5).reverse();

        this.cdr.detectChanges();

        if (this.totalEquipos > 0) {
          this.generarGrafico(data.equipos);
        }
      },
      error: (err) => console.error("Error crítico en Dashboard", err)
    });
  }


  //  CARGA SOLO LO DEL TÉCNICO (Con datos reales)

  cargarEstadisticasTecnico() {
    forkJoin({
      equipos: this.http.get<any[]>('https://localhost:8080/api/equipos').pipe(
        catchError(e => {
          console.error('Dashboard Técnico -> Error al traer equipos:', e);
          return of([]);
        })
      ),
      historial: this.http.get<any[]>('https://localhost:8080/api/historial-cambios').pipe(
        catchError(e => {
          console.error('Dashboard Técnico -> Error al traer historial:', e);
          return of([]);
        })
      )
    }).subscribe({
      next: (data) => {
        // 1. Filtrado de Equipos Asignados

        const misEquipos = data.equipos.filter(eq => eq.usuarioResponsable?.correo === this.correoUsuario);
        this.misEquiposAsignados = misEquipos.length;

        // 2. Filtrado de Equipos Operativos o Listos para Donación

        this.misEquiposReparados = misEquipos.filter(eq =>
          eq.estadoActual?.nombreEstado === 'Operativo' ||
          eq.estadoActual?.nombreEstado === 'Listo para Donación' ||
          eq.estadoActual?.nombreEstado === 'Donado'
        ).length;

        // 3. Filtrado de Historial del Técnico
        // Filtramos por  correo, ordena los últimos y tomamos 5
        this.miHistorial = data.historial
          .filter(h => h.usuarioResponsable?.correo === this.correoUsuario)
          .slice(-5)
          .reverse();

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error crítico en el suscriptor del Dashboard Técnico", err);
      }
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
              // AQUÍ ESTÁ EL CAMBIO: Colores modernos alineados al rediseño
              backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'],
              borderWidth: 0, // Quitamos el borde para que se vea más limpio
              hoverOffset: 4
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
