import { Component, OnInit } from '@angular/core';
import { CitasService, Cita } from '../service/citas.service';

@Component({
  selector: 'app-citas',
  standalone: false,
  templateUrl: './citas.html',
  styleUrls: ['./citas.scss']
})
export class Citas implements OnInit {

  citas: Cita[] = [];
  cargando = false;
  error = '';
  exito = '';

  modalAbierto = false;
  modoEdicion = false;
  citaSeleccionada: Cita = this.formularioVacio();

  // Cambio de estado rápido
  modalEstado = false;
  idCitaEstado: number | null = null;
  nuevoEstado: number | null = null;

  confirmandoFinalizar: number | null = null;

  constructor(private citasService: CitasService) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  formularioVacio(): Cita {
    return {
      id_paciente: 0,
      id_medico: 0,
      id_estado: 1,
      fecha_hora: '',
      consultorio: ''
    };
  }

  cargarCitas(): void {
    this.cargando = true;
    this.citasService.listar().subscribe({
      next: (data) => { this.citas = data; this.cargando = false; },
      error: () => { this.error = 'No se pudieron cargar las citas.'; this.cargando = false; }
    });
  }

  abrirModalCrear(): void {
    this.citaSeleccionada = this.formularioVacio();
    this.modoEdicion = false;
    this.modalAbierto = true;
    this.error = '';
    this.exito = '';
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  guardar(): void {
    const { id_paciente, id_medico, id_estado, fecha_hora } = this.citaSeleccionada;
    if (!id_paciente || !id_medico || !id_estado || !fecha_hora) {
      this.error = 'Paciente, médico, estado y fecha son obligatorios.';
      return;
    }

    this.cargando = true;
    this.citasService.crear(this.citaSeleccionada).subscribe({
      next: () => {
        this.exito = 'Cita agendada correctamente.';
        this.cerrarModal();
        this.cargarCitas();
      },
      error: (err) => {
        this.cargando = false;
        this.error = err?.error?.detail || 'Error al agendar la cita.';
      }
    });
  }

  abrirModalEstado(cita: Cita): void {
    this.idCitaEstado = cita.id_cita!;
    this.nuevoEstado = cita.id_estado;
    this.modalEstado = true;
  }

  cerrarModalEstado(): void {
    this.modalEstado = false;
    this.idCitaEstado = null;
    this.nuevoEstado = null;
  }

  cambiarEstado(): void {
    if (!this.idCitaEstado || !this.nuevoEstado) return;
    this.citasService.cambiarEstado(this.idCitaEstado, this.nuevoEstado).subscribe({
      next: () => {
        this.exito = 'Estado de la cita actualizado.';
        this.cerrarModalEstado();
        this.cargarCitas();
      },
      error: (err) => { this.error = err?.error?.detail || 'Error al cambiar el estado.'; }
    });
  }

  confirmarFinalizar(id: number): void {
    this.confirmandoFinalizar = id;
  }

  cancelarFinalizar(): void {
    this.confirmandoFinalizar = null;
  }

  finalizarCita(id: number): void {
    this.citasService.finalizarYCrearHistoria(id).subscribe({
      next: () => {
        this.exito = 'Cita finalizada y expediente clínico creado en MongoDB.';
        this.confirmandoFinalizar = null;
        this.cargarCitas();
      },
      error: (err) => {
        this.error = err?.error?.detail || 'Error al finalizar la cita.';
        this.confirmandoFinalizar = null;
      }
    });
  }

  getNombreEstado(id: number): string {
    const estados: Record<number, string> = { 1: 'Pendiente', 2: 'Confirmada', 3: 'Cancelada', 4: 'Finalizada' };
    return estados[id] ?? `Estado ${id}`;
  }

  getBadgeClass(id: number): string {
    const clases: Record<number, string> = { 1: 'badge-pending', 2: 'badge-confirmed', 3: 'badge-cancelled', 4: 'badge-done' };
    return clases[id] ?? 'badge-pending';
  }
}
