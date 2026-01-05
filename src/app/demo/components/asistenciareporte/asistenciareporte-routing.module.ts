import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsistenciareporteComponent } from './asistenciareporte.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component:AsistenciareporteComponent,
        }
    ])],
    exports: [RouterModule]
})
export class AsistenciaReporteRoutingModule { }