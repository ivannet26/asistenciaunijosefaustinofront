import { Component, OnInit,ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { AsistenciaGeneralService } from '../../service/asistenciageneral.service';
import { asistenciareporte } from '../../model/asistenciareporte';
import { AsistenciaService } from '../../service/asistencia.service';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { RouterLink } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar'; // Importa el módulo de PrimeNG

import * as XLSX from 'xlsx';

//datos para el excel
type AsistenciaReporteExport = {
  codigo: string;
  nombre: string;
  fecha: string;
  ingreso1: string;
  salida1: string;
  ingreso2: string;
  salida2: string;
  ingreso3: string;
  salida3: string;
  ingreso4: string;
  salida4: string;
};

@Component({
  selector: 'app-asistenciareporte',
  standalone: true,
  imports: [TableModule,CommonModule, 
            FormsModule,
            ReactiveFormsModule,
            ToastModule,PanelModule,BreadcrumbModule
            ,CalendarModule
            

  ],
  templateUrl: './asistenciareporte.component.html',
  styleUrl: './asistenciareporte.component.scss',
  providers:[MessageService,ConfirmationService],
})


export class AsistenciareporteComponent implements OnInit{
  asistenciaReporteLista:asistenciareporte[] = [];
  items: any[] = [];
  loading: boolean = true;
  startDate: Date | null = null;
  endDate: Date | null = null;
  minStartDate: Date | null = null;
  maxEndDate: Date | null = null;
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
          routerLink:'/Menu/asistenciareporte'
        }
      ]);
      this.bs.currentBreadcrumbs$.subscribe((bc)=>{
        this.items = bc;
      });
      this.loadAsistenciaReporte();
  }

  loadAsistenciaReporte():void{
    this.loading = true;
    console.log("valores de reporte asistencia");
    let fechaInicio :string = '01/11/2025';
    let fechaFin: string = '30/11/2025';
    this.asistenciaService.getReporte(this.stardate,
      this.enddate).subscribe({
          next:(data) =>{
            this.asistenciaReporteLista = data;
            console.log(data);

            this.asistenciaReporteLista.forEach(
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
  Buscar():void{
     this.loading = true;

        //this.validateDates();

        if (this.startDate && this.endDate) {
            this.stardate = this.formatDateAAAAMMDD(this.startDate);
            this.enddate = this.formatDateAAAAMMDD(this.endDate);

            this.loadAsistenciaReporte();
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Completar los campos de la fecha',
            });

            this.loading = false;
        }
  }
  generarArchivoCarga():void {
    
  }
  validateDates() {
        if (this.startDate && this.endDate) {
            if (this.startDate > this.endDate) {
                // La fecha de inicio no puede ser posterior a la fecha de fin
                this.endDate = null; // Limpiamos la fecha de fin si ocurre este caso
            }
            if (this.endDate > this.maxEndDate) {
                // La fecha de fin no puede ser posterior a la fecha máxima permitida
                this.endDate = this.maxEndDate;
            }
        }
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

     formatDateAAAAMMDD(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes en formato MM
        const day = date.getDate().toString().padStart(2, '0'); // Día en formato DD

        return `${year}${month}${day}`; //formato AAAAMMDD
    }
    
    generateEXCEL() {
      const data = this.asistenciaReporteLista ?? [];
      
      const exportData: AsistenciaReporteExport[] =
      data.length > 0 ? data.map((item: any) => ({
        //filas a exportar
          codigo: item.codigo ?? '',
          nombre: item.nombre ?? '',
          fecha: item.fecha ?? '',
          ingreso1: item.ingreso1 ?? '',
          salida1: item.salida1 ?? '',
          ingreso2: item.ingreso2 ?? '',
          salida2: item.salida2 ?? '',
          ingreso3: item.ingreso3 ?? '',
          salida3: item.salida3 ?? '',
          ingreso4: item.ingreso4 ?? '',
          salida4: item.salida4 ?? ''
        }))
      : []; 
      
      //creando las filas en excel
      const ws = XLSX.utils.json_to_sheet(exportData, {
        
        header: [
          'codigo','nombre','fecha',
          'ingreso1','salida1',
          'ingreso2','salida2',
          'ingreso3','salida3',
          'ingreso4','salida4'
        ]
      });
      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
      XLSX.writeFile(wb, 'AsistenciaReporte.xlsx');
}



}
