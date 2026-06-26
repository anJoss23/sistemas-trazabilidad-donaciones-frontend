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
// Importamos el Guardián de Roles para la seguridad de URLs (RBAC)
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }, // El login es la única ruta pública

  // DASHBOARD: Ruta de acceso global para todos los usuarios autenticados
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // EQUIPOS: Permitido para Administrador y Registrador. Bloqueado para el Técnico.
  {
    path: 'equipos',
    component: EquiposComponent,
    canActivate: [RoleGuard],
    data: { rolesDenegados: ['TECNICO', 'TÉCNICO'] }
  },

  // USUARIOS: Acceso exclusivo del Administrador. Bloqueado para Registrador y Técnico.
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [RoleGuard],
    data: { rolesDenegados: ['REGISTRADOR', 'TECNICO', 'TÉCNICO'] }
  },

  // DONANTES: Permitido para Administrador y Registrador. Bloqueado para el Técnico.
  {
    path: 'donantes',
    component: DonantesComponent,
    canActivate: [RoleGuard],
    data: { rolesDenegados: ['TECNICO', 'TÉCNICO'] }
  },

  // INSTITUCIONES: Permitido para Administrador y Registrador. Bloqueado para el Técnico.
  {
    path: 'instituciones',
    component: InstitucionesComponent,
    canActivate: [RoleGuard],
    data: { rolesDenegados: ['TECNICO', 'TÉCNICO'] }
  },

  // DESPACHOS: Permitido para Administrador y Registrador. Bloqueado para el Técnico.
  {
    path: 'despachos',
    component: DespachosComponent,
    canActivate: [RoleGuard],
    data: { rolesDenegados: ['TECNICO', 'TÉCNICO'] }
  },

  // HISTORIAL: Acceso exclusivo del Técnico. Bloqueado para Administrador y Registrador.
  {
    path: 'historial',
    component: HistorialComponent,
    canActivate: [RoleGuard],
    data: { rolesDenegados: ['ADMINISTRADOR', 'REGISTRADOR'] }
  },

  // TIPOS DE EQUIPO: Permitido para Administrador y Registrador. Bloqueado para el Técnico.
  {
    path: 'tipo-equipo',
    component: TipoEquipoComponent,
    canActivate: [RoleGuard],
    data: { rolesDenegados: ['TECNICO', 'TÉCNICO'] }
  },

  // ESTADOS DE EQUIPO: Permitido para Administrador y Registrador. Bloqueado para el Técnico.
  {
    path: 'estados-equipo',
    component: EstadosEquipoComponent,
    canActivate: [RoleGuard],
    data: { rolesDenegados: ['TECNICO', 'TÉCNICO'] }
  },

  // ROLES DE USUARIO: Acceso exclusivo del Administrador. Bloqueado para Registrador y Técnico.
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [RoleGuard],
    data: { rolesDenegados: ['REGISTRADOR', 'TECNICO', 'TÉCNICO'] }
  },

  // REPORTES: Permitido para Administrador y Registrador. Bloqueado para el Técnico.
  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [RoleGuard],
    data: { rolesDenegados: ['TECNICO', 'TÉCNICO'] }
  },

  // Ruta comodín para redireccionar cualquier dirección inválida al login
  { path: '**', redirectTo: 'login' }
];
