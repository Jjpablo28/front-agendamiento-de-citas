import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Cita {
  id_cita?: number;
  id_paciente: number;
  id_medico: number;
  id_estado: number;
  fecha_hora: string;
  consultorio?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  constructor(private api: ApiService) {}

  listar(): Observable<Cita[]> {
    return this.api.get<Cita[]>('/citas');
  }

  obtener(id: number): Observable<Cita> {
    return this.api.get<Cita>(`/citas/${id}`);
  }

  crear(cita: Cita): Observable<Cita> {
    return this.api.post<Cita>('/citas', cita);
  }

  cambiarEstado(idCita: number, nuevoIdEstado: number): Observable<any> {
    return this.api.put(`/citas/${idCita}/estado`, { nuevo_id_estado: nuevoIdEstado });
  }

  finalizarYCrearHistoria(idCita: number): Observable<any> {
    return this.api.post(`/finalizar-cita-y-crear-historia/${idCita}`, {});
  }
}
