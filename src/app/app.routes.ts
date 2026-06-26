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
import { ReportesComponent } from './components/reportes/reportes.component';
import { AuthGuard } from './auth.guard';
//  Importamos el Guardián
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }, // El login es público

  // TODAS ESTAS RUTAS ESTÁN PROTEGIDAS POR EL GUARD
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'equipos', component: EquiposComponent, canActivate: [AuthGuard] },
  //{ path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
  // MODIFICADO: Protegido contra REGISTRADOR
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [RoleGuard],
    data: { rolesDenegados: ['REGISTRADOR'] }
  },
  { path: 'donantes', component: DonantesComponent, canActivate: [AuthGuard] },
  { path: 'instituciones', component: InstitucionesComponent, canActivate: [AuthGuard] },
  { path: 'despachos', component: DespachosComponent, canActivate: [AuthGuard] },
  //{ path: 'historial', component: HistorialComponent, canActivate: [AuthGuard] },

  // MODIFICADO: Agregamos el Guard y la "Lista Negra" (rolesDenegados)
  {
    path: 'historial',
    component: HistorialComponent,
    canActivate: [RoleGuard],
    data: { rolesDenegados: ['ADMINISTRADOR'] }
  },

  { path: 'tipo-equipo', component: TipoEquipoComponent, canActivate: [AuthGuard] },
  { path: 'estados-equipo', component: EstadosEquipoComponent, canActivate: [AuthGuard] },
  //{ path: 'roles', component: RolesComponent, canActivate: [AuthGuard] },
  // MODIFICADO: Protegido contra REGISTRADOR
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [RoleGuard],
    data: { rolesDenegados: ['REGISTRADOR'] }
  },
  { path: 'reportes', component: ReportesComponent, canActivate: [AuthGuard] },

  // Ruta de respaldo (siempre debe ir al final)
  { path: '**', redirectTo: 'login' }
];
