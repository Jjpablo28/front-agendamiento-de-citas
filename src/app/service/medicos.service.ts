import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Medico {
  id_medico?: number;
  documento: string;
  nombre_completo: string;
  id_especialidad: number;
}

export interface MedicoCreate extends Medico {
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicosService {

  constructor(private api: ApiService) {}

  listar(): Observable<Medico[]> {
    return this.api.get<Medico[]>('/medicos');
  }

  obtenerPorDocumento(documento: string): Observable<Medico> {
    return this.api.get<Medico>(`/medicos/${documento}`);
  }

  crear(medico: MedicoCreate): Observable<Medico> {
    return this.api.post<Medico>('/medicos', medico);
  }

  actualizar(id: number, medico: MedicoCreate): Observable<Medico> {
    return this.api.put<Medico>(`/medicos/${id}`, medico);
  }
}
