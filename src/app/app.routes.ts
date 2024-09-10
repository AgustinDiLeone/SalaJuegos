import { Routes } from '@angular/router';
import { RegistroComponent } from './pages/login/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [

    {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
    },
    {
        path: "home",
        loadComponent: () =>
            import('./pages/home/home.component').then((c) => c.HomeComponent)
    },
    {
        path: "auth",
        loadComponent: () =>
            import('./pages/auth/auth.component').then((c) => c.AuthComponent),
        children: [
            {
                path: "",
                component: LoginComponent
            },
            {
                path: "login",
                component: LoginComponent
            },
            {
                path: "registro",
                component: RegistroComponent
            },
        ]

    },
    {
        path: "quien-soy",
        loadComponent: () =>
            import('./pages/quien-soy/quien-soy.component').then((c) => c.QuienSoyComponent)
    },
];
