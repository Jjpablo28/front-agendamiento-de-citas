import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PacientesService, PacienteCreate } from '../service/pacientes.service';
import { MedicosService, MedicoCreate } from '../service/medicos.service';
import { EspecialidadesService, Especialidad } from '../service/especialidades.service';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register implements OnInit {

  // Controla qué tab está activa: 'paciente' o 'medico'
  tabActiva: 'paciente' | 'medico' = 'paciente';

  // Formulario para paciente
  formPaciente: PacienteCreate = {
    documento: '',
    nombres: '',
    apellidos: '',
    email: '',
    password: ''
  };

  // Formulario para médico
  formMedico: MedicoCreate = {
    documento: '',
    nombre_completo: '',
    id_especialidad: 0,
    password: ''
  };

  especialidades: Especialidad[] = [];

  cargando = false;
  error = '';
  exito = '';

  constructor(
    private pacientesService: PacientesService,
    private medicosService: MedicosService,
    private especialidadesService: EspecialidadesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Cargamos las especialidades al iniciar para el select del médico
    this.especialidadesService.listar().subscribe({
      next: (data) => this.especialidades = data,
      error: () => this.especialidades = []
    });
  }

  cambiarTab(tab: 'paciente' | 'medico'): void {
    this.tabActiva = tab;
    this.error = '';
    this.exito = '';
  }

  registrar(): void {
    this.error = '';
    this.exito = '';

    if (this.tabActiva === 'paciente') {
      this.registrarPaciente();
    } else {
      this.registrarMedico();
    }
  }

  private registrarPaciente(): void {
    const { documento, nombres, apellidos, email, password } = this.formPaciente;
    if (!documento || !nombres || !apellidos || !email || !password) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }

    this.cargando = true;
    this.pacientesService.crear(this.formPaciente).subscribe({
      next: () => {
        this.cargando = false;
        this.exito = '✅ Registro exitoso. Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err?.error?.detail || 'No se pudo completar el registro. Verifica los datos.';
      }
    });
  }

  private registrarMedico(): void {
    const { documento, nombre_completo, id_especialidad, password } = this.formMedico;
    if (!documento || !nombre_completo || !id_especialidad || !password) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }

    this.cargando = true;
    this.medicosService.crear(this.formMedico).subscribe({
      next: () => {
        this.cargando = false;
        this.exito = '✅ Médico registrado correctamente. Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err?.error?.detail || 'No se pudo registrar el médico. Verifica los datos.';
      }
    });
  }
}
