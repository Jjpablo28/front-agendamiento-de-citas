import { Component, OnInit } from '@angular/core';
import { MedicosService, Medico, MedicoCreate } from '../service/medicos.service';

@Component({
  selector: 'app-medicos',
  standalone: false,
  templateUrl: './medicos-component.html',
  styleUrls: ['./medicos-component.scss']
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  cargando = false;
  error = '';
  exito = '';

  busquedaDocumento = '';
  medicoBuscado: Medico | null = null;
  errorBusqueda = '';

  modalAbierto = false;
  modoEdicion = false;
  medicoSeleccionado: MedicoCreate & { id_medico?: number } = this.formularioVacio();

  constructor(private medicosService: MedicosService) {}

  ngOnInit(): void {
    this.cargarMedicos();
  }

  formularioVacio(): MedicoCreate & { id_medico?: number } {
    return { documento: '', nombre_completo: '', id_especialidad: 0, password: '' };
  }

  cargarMedicos(): void {
    this.cargando = true;
    this.medicosService.listar().subscribe({
      next: (data) => { this.medicos = data; this.cargando = false; },
      error: () => { this.error = 'Error al cargar los médicos.'; this.cargando = false; }
    });
  }

  buscarPorDocumento(): void {
    if (!this.busquedaDocumento.trim()) return;
    this.errorBusqueda = '';
    this.medicoBuscado = null;
    this.medicosService.obtenerPorDocumento(this.busquedaDocumento.trim()).subscribe({
      next: (m) => this.medicoBuscado = m,
      error: () => this.errorBusqueda = 'Médico no encontrado con ese documento.'
    });
  }

  limpiarBusqueda(): void {
    this.busquedaDocumento = '';
    this.medicoBuscado = null;
    this.errorBusqueda = '';
  }

  abrirModalCrear(): void {
    this.medicoSeleccionado = this.formularioVacio();
    this.modoEdicion = false;
    this.modalAbierto = true;
    this.error = '';
    this.exito = '';
  }

  abrirModalEditar(m: Medico): void {
    this.medicoSeleccionado = { ...m, password: '' };
    this.modoEdicion = true;
    this.modalAbierto = true;
    this.error = '';
    this.exito = '';
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  guardar(): void {
    const { documento, nombre_completo, id_especialidad } = this.medicoSeleccionado;
    if (!documento || !nombre_completo || !id_especialidad) {
      this.error = 'Documento, nombre y especialidad son obligatorios.';
      return;
    }

    this.cargando = true;

    if (this.modoEdicion && this.medicoSeleccionado.id_medico) {
      this.medicosService.actualizar(this.medicoSeleccionado.id_medico, this.medicoSeleccionado).subscribe({
        next: () => {
          this.exito = 'Médico actualizado correctamente.';
          this.cerrarModal();
          this.cargarMedicos();
        },
        error: (err) => { this.cargando = false; this.error = err?.error?.detail || 'Error al actualizar.'; }
      });
    } else {
      if (!this.medicoSeleccionado.password) {
        this.error = 'La contraseña es obligatoria para crear un médico.';
        this.cargando = false;
        return;
      }
      this.medicosService.crear(this.medicoSeleccionado).subscribe({
        next: () => {
          this.exito = 'Médico creado exitosamente.';
          this.cerrarModal();
          this.cargarMedicos();
        },
        error: (err) => { this.cargando = false; this.error = err?.error?.detail || 'Error al crear el médico.'; }
      });
    }
  }
}
