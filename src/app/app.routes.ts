import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegistroComponent } from './pages/auth/registro/registro.component';
import { canActivate } from '@angular/fire/auth-guard';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { Auth } from '@angular/fire/auth';

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
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'ahorcado',
        loadComponent: () =>
          import('./pages/games/ahorcado/ahorcado.component').then(
            (c) => c.AhorcadoComponent
          ),
      },
      {
        path: 'mayor-menor',
        loadComponent: () =>
          import('./pages/games/mayor-menor/mayor-menor.component').then(
            (c) => c.MayorMenorComponent
          ),
      },
      {
        path: 'preguntados',
        loadComponent: () =>
          import('./pages/games/preguntados/preguntados.component').then(
            (c) => c.PreguntadosComponent
          ),
      },
      {
        path: 'buscaminas',
        loadComponent: () =>
          import('./pages/games/buscaminas/buscaminas.component').then(
            (c) => c.BuscaminasComponent
          ),
      },
    ],
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
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
