import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsistenciareportebasicoComponent } from './asistenciareportebasico.component';

@NgModule({
    imports:[RouterModule.forChild([
        {path:'', component:AsistenciareportebasicoComponent}
    ])], 
    exports:[RouterModule]
})

export class AsistenciaReporteBasicoRoutingModule{

}