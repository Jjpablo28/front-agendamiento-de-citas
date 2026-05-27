import { Component, OnInit } from '@angular/core';
import { PacientesService, Paciente, PacienteCreate } from '../service/pacientes.service';

@Component({
  selector: 'app-pacientes',
  standalone: false,
  templateUrl: './pacientes.html',
  styleUrls: ['./pacientes.scss']
})
export class Pacientes implements OnInit {

  pacientes: Paciente[] = [];
  cargando = false;
  error = '';
  exito = '';

  // Búsqueda
  busquedaDocumento = '';
  pacienteBuscado: Paciente | null = null;
  errorBusqueda = '';

  // Modal para crear / editar
  modalAbierto = false;
  modoEdicion = false;
  pacienteSeleccionado: PacienteCreate & { id_paciente?: number } = this.formularioVacio();

  // Confirmación eliminación
  confirmandoEliminar: number | null = null;

  constructor(private pacientesService: PacientesService) {}

  ngOnInit(): void {
    this.cargarPacientes();
  }

  formularioVacio(): PacienteCreate & { id_paciente?: number } {
    return { documento: '', nombres: '', apellidos: '', email: '', password: '' };
  }

  cargarPacientes(): void {
    this.cargando = true;
    this.pacientesService.listar().subscribe({
      next: (data) => { this.pacientes = data; this.cargando = false; },
      error: () => { this.error = 'No se pudo cargar la lista de pacientes.'; this.cargando = false; }
    });
  }

  buscarPorDocumento(): void {
    if (!this.busquedaDocumento.trim()) return;
    this.errorBusqueda = '';
    this.pacienteBuscado = null;
    this.pacientesService.obtenerPorDocumento(this.busquedaDocumento.trim()).subscribe({
      next: (p) => this.pacienteBuscado = p,
      error: () => this.errorBusqueda = 'Paciente no encontrado con ese documento.'
    });
  }

  abrirModalCrear(): void {
    this.pacienteSeleccionado = this.formularioVacio();
    this.modoEdicion = false;
    this.modalAbierto = true;
    this.exito = '';
    this.error = '';
  }

  abrirModalEditar(p: Paciente): void {
    this.pacienteSeleccionado = { ...p, password: '' };
    this.modoEdicion = true;
    this.modalAbierto = true;
    this.exito = '';
    this.error = '';
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  guardar(): void {
    const { documento, nombres, apellidos, email } = this.pacienteSeleccionado;
    if (!documento || !nombres || !apellidos || !email) {
      this.error = 'Todos los campos marcados son obligatorios.';
      return;
    }

    this.cargando = true;

    if (this.modoEdicion && this.pacienteSeleccionado.id_paciente) {
      this.pacientesService.actualizar(this.pacienteSeleccionado.id_paciente, this.pacienteSeleccionado).subscribe({
        next: () => {
          this.exito = 'Paciente actualizado correctamente.';
          this.cerrarModal();
          this.cargarPacientes();
        },
        error: (err) => { this.cargando = false; this.error = err?.error?.detail || 'Error al actualizar.'; }
      });
    } else {
      if (!this.pacienteSeleccionado.password) {
        this.error = 'La contraseña es obligatoria para crear un paciente.';
        this.cargando = false;
        return;
      }
      this.pacientesService.crear(this.pacienteSeleccionado).subscribe({
        next: () => {
          this.exito = 'Paciente creado exitosamente.';
          this.cerrarModal();
          this.cargarPacientes();
        },
        error: (err) => { this.cargando = false; this.error = err?.error?.detail || 'Error al crear el paciente.'; }
      });
    }
  }

  confirmarEliminar(id: number): void {
    this.confirmandoEliminar = id;
  }

  cancelarEliminar(): void {
    this.confirmandoEliminar = null;
  }

  eliminar(id: number): void {
    this.pacientesService.eliminar(id).subscribe({
      next: () => {
        this.exito = 'Paciente eliminado correctamente.';
        this.confirmandoEliminar = null;
        this.cargarPacientes();
      },
      error: (err) => {
        this.error = err?.error?.detail || 'No se pudo eliminar el paciente.';
        this.confirmandoEliminar = null;
      }
    });
  }

  limpiarBusqueda(): void {
    this.busquedaDocumento = '';
    this.pacienteBuscado = null;
    this.errorBusqueda = '';
  }
}
