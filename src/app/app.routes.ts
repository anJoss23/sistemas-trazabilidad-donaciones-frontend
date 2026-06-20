import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EquiposComponent } from './components/equipos/equipos.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { DonantesComponent } from './components/donantes/donantes.component';
import { InstitucionesComponent } from './components/instituciones/instituciones.component';
import { DespachosComponent } from './components/despachos/despachos.component';
import { HistorialComponent } from './components/historial/historial.component';
import { TipoEquipoComponent } from './components/tipo-equipo/tipo-equipo.component';
import { EstadosEquipoComponent } from './components/estados-equipo/estados-equipo.component';
import { RolesComponent } from './components/roles/roles.component';
// Importamos el nuevo componente de reportes
import { ReportesComponent } from './components/reportes/reportes.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'equipos', component: EquiposComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'donantes', component: DonantesComponent },
  { path: 'instituciones', component: InstitucionesComponent },
  { path: 'despachos', component: DespachosComponent },
  { path: 'historial', component: HistorialComponent },
  { path: 'tipo-equipo', component: TipoEquipoComponent },
  { path: 'estados-equipo', component: EstadosEquipoComponent },
  { path: 'roles', component: RolesComponent },

  // NUEVA RUTA PARA REPORTES
  { path: 'reportes', component: ReportesComponent },

  // Ruta de respaldo (siempre debe ir al final)
  { path: '**', redirectTo: 'login' }
];
