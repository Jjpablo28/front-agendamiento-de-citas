import { Component } from '@angular/core';
import { HistoriasClinicasService, HistoriaClinica } from '../service/historias-clinicas.service';

@Component({
  selector: 'app-historias-clinicas',
  standalone: false,
  templateUrl: './historias-clinicas.html',
  styleUrls: ['./historias-clinicas.scss']
})
export class HistoriasClinicasComponent {

  idPacienteBusqueda: number | null = null;
  historias: HistoriaClinica[] = [];
  cargando = false;
  error = '';
  exito = '';

  // Modal nueva historia
  modalAbierto = false;
  recetaInput = '';
  nueva: HistoriaClinica = this.formularioVacio();

  constructor(private historiasService: HistoriasClinicasService) {}

  formularioVacio(): HistoriaClinica {
    return {
      id_paciente_sql: 0,
      id_cita_sql: 0,
      fecha_registro: new Date().toISOString().slice(0, 10),
      medico_tratante: '',
      signos_vitales: { presion: '', ritmo_cardiaco: 0, temperatura: 0 },
      motivo_consulta: '',
      diagnostico: '',
      receta_medica: [],
      archivos_adjuntos: [],
      incapacidad_dias: undefined
    };
  }

  buscar(): void {
    if (!this.idPacienteBusqueda) return;
    this.cargando = true;
    this.error = '';
    this.historias = [];

    this.historiasService.listarPorPaciente(this.idPacienteBusqueda).subscribe({
      next: (data) => { this.historias = data; this.cargando = false; },
      error: () => { this.error = 'No se encontraron historias para ese paciente.'; this.cargando = false; }
    });
  }

  abrirModalCrear(): void {
    this.nueva = this.formularioVacio();
    this.recetaInput = '';
    this.modalAbierto = true;
    this.error = '';
    this.exito = '';
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  agregarReceta(): void {
    const item = this.recetaInput.trim();
    if (item) {
      this.nueva.receta_medica.push(item);
      this.recetaInput = '';
    }
  }

  quitarReceta(i: number): void {
    this.nueva.receta_medica.splice(i, 1);
  }

  guardar(): void {
    const { id_paciente_sql, id_cita_sql, medico_tratante, motivo_consulta, diagnostico, fecha_registro } = this.nueva;
    if (!id_paciente_sql || !id_cita_sql || !medico_tratante || !motivo_consulta || !diagnostico || !fecha_registro) {
      this.error = 'Todos los campos obligatorios deben completarse.';
      return;
    }

    this.cargando = true;
    this.historiasService.crear(this.nueva).subscribe({
      next: () => {
        this.exito = 'Historia clínica creada exitosamente en MongoDB.';
        this.cerrarModal();
        if (this.idPacienteBusqueda) this.buscar();
        else this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        this.error = err?.error?.detail || 'Error al crear la historia clínica.';
      }
    });
  }
}
