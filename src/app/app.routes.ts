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
        path: "login",
        loadComponent: () =>
            import('./pages/login/login.component').then((c) => c.LoginComponent),
        children: [
            {
                path: "",
                component: LoginComponent
            },
            {
                path: "registro",
                component: RegistroComponent
            },
        ]

    },
];
