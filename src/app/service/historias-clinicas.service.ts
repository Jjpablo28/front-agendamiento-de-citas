import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface SignosVitales {
  presion?: string;
  ritmo_cardiaco?: number;
  temperatura?: number;
  peso?: number;
  talla?: number;
  [key: string]: any;
}

export interface HistoriaClinica {
  _id?: string;
  id_paciente_sql: number;
  id_cita_sql: number;
  fecha_registro: string;
  medico_tratante: string;
  signos_vitales: SignosVitales;
  motivo_consulta: string;
  diagnostico: string;
  receta_medica: string[];
  archivos_adjuntos: string[];
  incapacidad_dias?: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistoriasClinicasService {

  constructor(private api: ApiService) {}

  listarPorPaciente(idPaciente: number): Observable<HistoriaClinica[]> {
    return this.api.get<HistoriaClinica[]>(`/historias-clinicas/${idPaciente}`);
  }

  crear(historia: HistoriaClinica): Observable<any> {
    return this.api.post('/historias-clinicas', historia);
  }
}
