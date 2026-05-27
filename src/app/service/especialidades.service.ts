import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Especialidad {
  id_especialidad?: number;
  nombre_specialidad: string;
  tarifa_base: number;
}

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  constructor(private api: ApiService) {}

  listar(): Observable<Especialidad[]> {
    return this.api.get<Especialidad[]>('/especialidades');
  }

  obtenerPorId(id: number): Observable<Especialidad> {
    return this.api.get<Especialidad>(`/especialidades/${id}`);
  }

  crear(especialidad: Especialidad): Observable<Especialidad> {
    return this.api.post<Especialidad>('/especialidades', especialidad);
  }

  actualizar(id: number, especialidad: Especialidad): Observable<Especialidad> {
    return this.api.put<Especialidad>(`/especialidades/${id}`, especialidad);
  }

  eliminar(id: number): Observable<any> {
    return this.api.delete(`/especialidades/${id}`);
  }
}
