import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Paciente {
  id_paciente?: number;
  documento: string;
  nombres: string;
  apellidos: string;
  email: string;
}

export interface PacienteCreate extends Paciente {
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  constructor(private api: ApiService) {}

  listar(): Observable<Paciente[]> {
    return this.api.get<Paciente[]>('/pacientes');
  }

  obtenerPorDocumento(documento: string): Observable<Paciente> {
    return this.api.get<Paciente>(`/pacientes/${documento}`);
  }

  crear(paciente: PacienteCreate): Observable<Paciente> {
    return this.api.post<Paciente>('/pacientes', paciente);
  }

  actualizar(id: number, paciente: PacienteCreate): Observable<Paciente> {
    return this.api.put<Paciente>(`/pacientes/${id}`, paciente);
  }

  eliminar(id: number): Observable<any> {
    return this.api.delete(`/pacientes/${id}`);
  }
}
