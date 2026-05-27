import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  identificador: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  rol: 'paciente' | 'medico';
  id: number;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = 'https://agendamientocitasmongoback.onrender.com';

  constructor(private http: HttpClient, private router: Router) {}

  login(credenciales: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credenciales).pipe(
      tap(res => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('rol', res.rol);
        localStorage.setItem('user_id', String(res.id));
        localStorage.setItem('mensaje', res.mensaje);
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getRol(): string | null {
    return localStorage.getItem('rol');
  }

  getUserId(): number | null {
    const id = localStorage.getItem('user_id');
    return id ? parseInt(id, 10) : null;
  }
}
