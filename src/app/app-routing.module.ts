import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { ConsultaAsistenciaComponent } from './demo/components/consulta-asistencia/consulta-asistencia/consulta-asistencia.component';
import { AutorizacionComponent } from './demo/components/autorizacion/autorizacion.component';
import { AuthGuard } from './demo/service/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', redirectTo: 'Inicio_Sesion', pathMatch: 'full'
            },
            {
                path: 'Inicio_Sesion', component: AutorizacionComponent,
                children: [
                    { path: '', loadChildren: () => import('./demo/components/autorizacion/autorizacion.module').then(m => m.AutorizacionModule) },
                ]
            },
            {
                path: 'Menu', component: AppLayoutComponent, canActivate: [AuthGuard],
                children: [
                    {
                        path: '', redirectTo: 'asistenciageneral', pathMatch: 'full'
                    },
                    { path: 'asistencia', loadChildren: () => import('./demo/components/consulta-asistencia/asistencia.module').then(m => m.AsistenciaModule) },
                    { path: 'marcaciones', loadChildren: () => import('./demo/components/consulta-marcaciones/marcaciones.module').then(m => m.MarcacionesModule) },
                    { path: 'marcadores', loadChildren: () => import('./demo/components/mantenimiento-marcadores/marcadores.module').then(m => m.MarcadoresModule) },
                    { path: 'asistenciageneral', loadChildren: () => import('./demo/components/asistenciageneral/asistenciageneral.module').then(m => m.AsistenciGeneralModule) },
                    { path: 'usuarios', loadChildren: () => import('./demo/components/usuarios/usuarios.module').then(m => m.UsuariosModule) },
                    { path: 'anio', loadChildren: () => import('./demo/components/anio/anio.module').then(m => m.AnioModule) },
                    { path: 'asignarpermiso', loadChildren: () => import('./demo/components/permisosxperfilxtodo/permisosxperfilxtodo.module').then(m => m.PermisosxPerfilxTodoModule) },
                    { path: 'perfil', loadChildren: () => import('./demo/components/perfil/perfil.module').then(m => m.PerfilModule) },////
                    { path: 'asistenciageneral', loadChildren: () => import('./demo/components/asistenciageneral/asistenciageneral.module').then(m => m.AsistenciGeneralModule) },////
                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
                    { path: 'motivohorario', loadChildren: () => import('./demo/components/motivo-horario/motivo-horario.module').then(m => m.MotivoHorarioModule)},
                    { path: 'horariopersonal', loadChildren: () => import('./demo/components/horariopersonal/horariopersonal.module').then(m => m.HorariopersonalModule)},
                    {path:'asistenciareporte', loadChildren: () => import('./demo/components/asistenciareporte/asistenciareporte.module').then(m => m.AsistenciaReporteModule)}
                ]
            },

            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: 'motivo-horario', loadChildren: () => import('./demo/components/motivo-horario/motivo-horario.module').then(m => m.MotivoHorarioModule) },
            { path: 'horariopersonal', loadChildren: () => import('./demo/components/horariopersonal/horariopersonal.module').then(m => m.HorariopersonalModule) },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
