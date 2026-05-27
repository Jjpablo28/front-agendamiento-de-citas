import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AgendamientoCitasComponent} from './agendamiento-citas/agendamiento-citas';
import {Pacientes} from './pacientes/pacientes';
import {HistoriasClinicasComponent} from './historias-clinicas/historias-clinicas';
import {Login} from "./login/login";
import {Register} from "./register/register";
import {Dashboard} from "./dashboard/dashboard";
import {MedicosComponent} from "./medicos-component/medicos-component";
import {Citas} from "./citas/citas";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'home', component: HomeComponent},
  {path: 'dashboard', component: Dashboard},
  {path:'citasq', component:AgendamientoCitasComponent},
  {path:'citas', component:Citas},
  {path:'pacientes',component:Pacientes},
  {path:'medicos',component:MedicosComponent},
  {path:'historias-clinicas',component:HistoriasClinicasComponent},
  {path:'login', component:Login},
  {path:'register', component:Register},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {  }
