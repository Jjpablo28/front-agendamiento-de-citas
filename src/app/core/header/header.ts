import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {

  nombreUsuario = '';
  rolUsuario    = '';
  iniciales     = '';
  menuAbierto   = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  private cargarDatosUsuario(): void {
    // El AuthService guarda el mensaje "Bienvenido, paciente Carlos" o "Bienvenido, Dr/Dra. ..."
    // Extraemos el nombre completo desde el token JWT decodificado
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        // Decodificamos el payload del JWT (parte central en base64)
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.nombreUsuario = payload.nombre_completo ?? 'Usuario';
        this.rolUsuario    = payload.rol === 'medico' ? 'Médico' : 'Paciente';
        // Generamos las iniciales para el avatar (ej: "Carlos Pérez" → "CP")
        this.iniciales = this.nombreUsuario
          .split(' ')
          .slice(0, 2)
          .map((p: string) => p[0]?.toUpperCase() ?? '')
          .join('');
      } catch {
        this.nombreUsuario = 'Usuario';
        this.rolUsuario    = '';
        this.iniciales     = 'U';
      }
    }
  }

  cerrarSesion(): void {
    this.authService.logout();
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  get estaLogueado(): boolean {
    return this.authService.isLoggedIn();
  }
}
