import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {

  nombreUsuario = '';
  rolUsuario    = '';
  iniciales     = '';
  menuAbierto   = false;

  private routerSub: Subscription | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();

    // Recarga los datos del usuario en cada navegación,
    // así si cambia el token (nuevo login) el header siempre refleja al usuario actual
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.cargarDatosUsuario());
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private cargarDatosUsuario(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.nombreUsuario = payload.nombre_completo ?? 'Usuario';
        this.rolUsuario    = payload.rol === 'medico' ? 'Médico' : 'Paciente';
        this.iniciales     = this.nombreUsuario
          .split(' ')
          .slice(0, 2)
          .map((p: string) => p[0]?.toUpperCase() ?? '')
          .join('');
      } catch {
        this.nombreUsuario = 'Usuario';
        this.rolUsuario    = '';
        this.iniciales     = 'U';
      }
    } else {
      this.nombreUsuario = '';
      this.rolUsuario    = '';
      this.iniciales     = '';
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
