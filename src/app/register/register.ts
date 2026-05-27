import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PacientesService, PacienteCreate } from '../service/pacientes.service';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {

  form: PacienteCreate = {
    documento: '',
    nombres: '',
    apellidos: '',
    email: '',
    password: ''
  };

  cargando = false;
  error = '';
  exito = '';

  constructor(private pacientesService: PacientesService, private router: Router) {}

  registrar(): void {
    const { documento, nombres, apellidos, email, password } = this.form;
    if (!documento || !nombres || !apellidos || !email || !password) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }

    this.cargando = true;
    this.error = '';
    this.exito = '';

    this.pacientesService.crear(this.form).subscribe({
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
}

