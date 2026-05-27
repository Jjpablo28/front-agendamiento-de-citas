import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { HomeComponent } from './home/home.component';
import { HistoriasClinicasComponent } from './historias-clinicas/historias-clinicas';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgendamientoCitasComponent } from './agendamiento-citas/agendamiento-citas';
import { Pacientes } from './pacientes/pacientes';
import { Footer } from './core/footer/footer';
import { Header } from './core/header/header';
import { Login } from './login/login';
import { Register } from './register/register';
import { MedicosComponent } from './medicos-component/medicos-component';
import { Citas } from './citas/citas';

@NgModule({
  declarations: [
    App,
    HomeComponent,
    HistoriasClinicasComponent,
    AgendamientoCitasComponent,
    Pacientes,
    Footer,
    Header,
    Login,
    Register,
    MedicosComponent,
    Citas,
  ],
  imports: [
    BrowserModule,
    CommonModule, // Activa pipes nativas como | date
    FormsModule, // Activa [(ngModel)]
    ReactiveFormsModule, // Activa [formGroup]
    AppRoutingModule, // 💡 DEJA SOLO ESTE. Él ya contiene la configuración de las URL
  ],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
