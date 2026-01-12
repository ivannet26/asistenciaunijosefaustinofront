import { HttpClient, HttpHeaders, HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Asistencia, AsistenciaDetalle, PLanilla_Combo } from '../model/Asistencia';
import { ApiResponse } from '../model/api_response';
import { GlobalserviceService } from './globalservice.service';
import { ConfigService } from './config.service';
import { asistenciareporte } from '../model/asistenciareporte';
import { asistenciareportebasico } from '../model/asistenciareportebasico';
@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
    // private apiUrl='http://localhost:2060/Asistencia';
    // private apiUrl='http://104.225.142.105:2060/Asistencia';
    private apiUrl='';

    constructor(private http: HttpClient,  private gs:GlobalserviceService, private configService: ConfigService) {
        this.apiUrl = `${this.configService.getApiUrl()}/Asistencia`;

    }

    //listar las asistencias
    getCalculoResumen(fechainicio:string,fechafin:string,
        codigoplanilla:string):Observable<ApiResponse<Asistencia>>{

        const params=new HttpParams()
        .set('fechainicio', fechainicio)
        .set('fechafin', fechafin)
        .set('codigoplanilla', codigoplanilla);

            console.log(fechafin);
            console.log(fechainicio);



        return this.http.get<ApiResponse<Asistencia>>(`${this.apiUrl}/SpListCalculoResumen`, { params });
    }

    formatDateForApi(date: Date): string {
        const adjustedDate = new Date(date);
        //adjustedDate.setDate(adjustedDate.getDate() + 1);

        const year = adjustedDate.getFullYear();
        const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
        const day = String(adjustedDate.getDate()).padStart(2, '0');
        console.log(`${year}${month}${day}`);
        return `${year}${month}${day}`;
    }

    parseApiDate(dateStr: string): Date {
        return new Date(dateStr);
    }

    //planilla

    getPlanillaCombo():Observable<PLanilla_Combo[]>{
            return this.http.get<ApiResponse<PLanilla_Combo>>(`${this.apiUrl}/SpListPlanilla`).pipe(map(response => response.data));
    }

    getCalculoDetalle(fechaInicio:string,fechaFin:string,
        codigoEmpleado:string):Observable<ApiResponse<AsistenciaDetalle>>{
        const params=new HttpParams()
        .set('fechainicio', fechaInicio)
        .set('fechafin', fechaFin)
        .set('codigoempleado',codigoEmpleado);
        return this.http.get<ApiResponse<AsistenciaDetalle>>(`${this.apiUrl}/SpListCalculoDetalle`,{params});
    }
    getReporte(fechaInicio:string,fechaFin:string):Observable<asistenciareporte[]>
    {
            let urlConsulta = `${this.apiUrl}/SpListaReporte?fechainicio=${fechaInicio}&fechafin=${fechaFin}`

        const params = new HttpParams()
        .set('fechainicio', fechaInicio)
        .set('fechafin',fechaFin);
        return this.http.get<ApiResponse<asistenciareporte>>(urlConsulta).pipe(map(response => response.data));

    }

    getReporteBasico(fechaInicio:string,fechaFin:string):Observable<asistenciareportebasico[]>{
        let urlConsulta = `${this.apiUrl}/SpListaReporteBasico?fechainicio=${fechaInicio}&fechafin=${fechaFin}`

        const params = new HttpParams()
        .set('fechainicio', fechaInicio)
        .set('fechafin',fechaFin);
        return this.http.get<ApiResponse<asistenciareportebasico>>(urlConsulta).pipe(map(response => response.data));

    }

}
