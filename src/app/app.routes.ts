import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegistroComponent } from './pages/auth/registro/registro.component';
import { AhorcadoComponent } from './pages/games/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './pages/games/mayor-menor/mayor-menor.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/auth.component').then((c) => c.AuthComponent),
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'registro',
        component: RegistroComponent,
      },
    ],
  },
  {
    path: 'games',
    children: [
      {
        path: '',
        component: AhorcadoComponent,
      },
      {
        path: 'ahorcado',
        component: AhorcadoComponent,
      },
      {
        path: 'mayor-menor',
        component: MayorMenorComponent,
      },
    ],
  },
  {
    path: 'quien-soy',
    loadComponent: () =>
      import('./pages/quien-soy/quien-soy.component').then(
        (c) => c.QuienSoyComponent
      ),
  },
];
