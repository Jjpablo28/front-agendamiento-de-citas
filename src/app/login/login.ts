import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  identificador = '';
  password = '';
  cargando = false;
  error = '';
  mostrarPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion(): void {
    if (!this.identificador || !this.password) {
      this.error = 'Por favor completa todos los campos.';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.authService.login({ identificador: this.identificador, password: this.password })
      .subscribe({
        next: (res) => {
          this.cargando = false;
          // Redirigir según el rol
          if (res.rol === 'medico') {
            this.router.navigate(['/citas']);
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          this.cargando = false;
          if (err.status === 401) {
            this.error = 'Contraseña incorrecta.';
          } else if (err.status === 404) {
            this.error = 'Usuario no encontrado en el sistema.';
          } else {
            this.error = 'Error al conectar con el servidor. Intenta de nuevo.';
          }
        }
      });
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
