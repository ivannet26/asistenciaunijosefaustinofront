import { Component, OnInit,ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { AsistenciaService } from '../../service/asistencia.service';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar'; // Importa el módulo de PrimeNG

import * as XLSX from 'xlsx';
import { asistenciareportebasico } from '../../model/asistenciareportebasico';

//datos para el excel
type AsistenciaReporteBasicoExport = {
  codigoEmpleado:string;
  nombreEmpleado:string;
  unidadDepartamento:string;
  fechaFormateada:string;
  dia:string;
  ingreso:string;
  salida:string;
  tiempoTotal:string;
};

@Component({
  selector: 'app-asistenciareportebasico',
  standalone: true,
   imports: [TableModule,CommonModule, 
            FormsModule,
            ReactiveFormsModule,
            ToastModule,PanelModule,BreadcrumbModule
            ,CalendarModule
            

  ],
  templateUrl: './asistenciareportebasico.component.html',
  styleUrl: './asistenciareportebasico.component.scss',
  providers:[MessageService,ConfirmationService]
})
export class AsistenciareportebasicoComponent implements OnInit{
  asistenciaReporteBasicoLista: asistenciareportebasico[]=[];
  items: any[] = [];
  loading: boolean = true;
  startDate: Date | null = null;
  endDate: Date | null = null;
  stardate: string;
  enddate: string;

  @ViewChild('dt1') dt1: Table | undefined; // Referencia a p-table

  constructor(
    private asistenciaService:AsistenciaService,
    private bs:BreadcrumbService,
    private messageService:MessageService
  ){
    this.stardate = this.getStartOfMonth();
    this.enddate = this.getToday();
    this.startDate = new Date();
    this.startDate.setDate(1);
    this.endDate = new Date();
  }

  ngOnInit(): void {
    this.bs.setBreadcrumbs([
      {icon:'pi pi-home', routerLink:'/Menu'},
      {
        label:'Asistencia detallado',
        routerLink:'/Menu/asistenciareportebasico'
      }
    ]);
    
    this.bs.currentBreadcrumbs$.subscribe((bc)=>{
      this.items = bc;
    });
  }

  loadAsistenciaReporteBasico():void{
    this.loading = true;
    console.log("valores de reporte asistencia basico");
    let fechaInicio :string = '01/11/2025';
    let fechaFin: string = '30/11/2025';
    this.asistenciaService.getReporteBasico(this.stardate,
      this.enddate).subscribe({
          next:(data) =>{
            this.asistenciaReporteBasicoLista = data;
            console.log(data);

            this.asistenciaReporteBasicoLista.forEach(
              (item, index) =>{
                item["id"]= index +1;              
              }
              
            );
            this.loading = false;
          }, error:(err) =>{
              console.log("Error al cargar datos:", err );
          }, 
          complete:()=>{
            this.loading = false;
          }
      });
    
  }

  getStartOfMonth(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato MM
        return `${year}${month}01`; // Primer día del mes
    }

  getToday(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato MM
        const day = now.getDate().toString().padStart(2, '0'); // Día en formato DD
        return `${year}${month}${day}`;
  }

  Buscar():void{
     this.loading = true;

        if (this.startDate && this.endDate) {
            this.stardate = this.formatDateAAAAMMDD(this.startDate);
            this.enddate = this.formatDateAAAAMMDD(this.endDate);

            this.loadAsistenciaReporteBasico();
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Completar los campos de la fecha',
            });

            this.loading = false;
        }
  }

  formatDateAAAAMMDD(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato MM
        const day = date.getDate().toString().padStart(2, '0'); // Día en formato DD

        return `${year}${month}${day}`; //formato AAAAMMDD
    }

    generateEXCEL() {
          const data = this.asistenciaReporteBasicoLista ?? [];
          
          const exportData = (Array.isArray(data) 
          ? data : []).map((item: any) => ({
            'Id del Empleado': item.codigoEmpleado ?? '',
            'Nombres': item.nombreEmpleado ?? '',
            'Departamento': item.unidadDepartamento ?? '',
            'Fecha': item.fechaFormateada ?? '',
            'Asistencia Diaria': item.dia ?? '',
            'Primera Marcación': item.ingreso ?? '',
            'Última Marcación': item.salida ?? '',
            'Tiempo Total': item.tiempoTotal ?? ''
          }));
          
          //creando las filas en excel
          const ws = XLSX.utils.json_to_sheet(exportData);
          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'ReporteBasico');
          XLSX.writeFile(wb, 'AsistenciaReporteBasico.xlsx');
          }
}
