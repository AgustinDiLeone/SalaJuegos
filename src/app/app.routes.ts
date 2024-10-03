import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegistroComponent } from './pages/auth/registro/registro.component';
import { AhorcadoComponent } from './pages/games/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './pages/games/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from './pages/games/preguntados/preguntados.component';
import { BuscaminasComponent } from './pages/games/buscaminas/buscaminas.component';
import { canActivate } from '@angular/fire/auth-guard';
import { authGuard } from './guards/auth.guard';

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
    canActivate: [authGuard],
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
        canActivate: [authGuard],
      },
      {
        path: 'ahorcado',
        component: AhorcadoComponent,
        canActivate: [authGuard],
      },
      {
        path: 'mayor-menor',
        component: MayorMenorComponent,
        canActivate: [authGuard],
      },
      {
        path: 'preguntados',
        component: PreguntadosComponent,
        canActivate: [authGuard],
      },
      {
        path: 'buscaminas',
        component: BuscaminasComponent,
        canActivate: [authGuard],
      },
    ],
    canActivate: [authGuard],
  },
  {
    path: 'quien-soy',
    loadComponent: () =>
      import('./pages/quien-soy/quien-soy.component').then(
        (c) => c.QuienSoyComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./pages/chat/chat.component').then((c) => c.ChatComponent),
    canActivate: [authGuard],
  },
];
