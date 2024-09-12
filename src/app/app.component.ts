import { Component, inject } from '@angular/core';
import { Auth, Unsubscribe } from '@angular/fire/auth';
import { Router, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'SalaJuegos-DiLeone';

  constructor() {}

  //  constructor(private router: Router, private firebase: Firebase) {}
  private router = inject(Router);
  private auth = inject(Auth);
  logueado = false;
  authSubscription?: Unsubscribe;

  ngOnInit() {
    this.authSubscription = this.auth.onAuthStateChanged((auth) => {
      if (auth?.email) {
        this.logueado = true;
        this.router.navigateByUrl('');
      }
    });
  }
  ngOnDestroy() {
    if (this.authSubscription !== undefined) {
      this.authSubscription();
    }
  }

  irAlHome() {
    this.router.navigateByUrl('');
  }
  irAlLogin() {
    this.router.navigateByUrl('auth');
  }
  irAlRegistro() {
    this.router.navigateByUrl('auth/registro');
  }
  irAlQuienSoy() {
    this.router.navigateByUrl('quien-soy');
  }
  cerrarSesion() {
    this.auth.signOut();
    this.logueado = false;
  }
  mostrarAlerta() {
    Swal.fire({
      title: '¡Hola!',
      text: 'Esta es una alerta de ejemplo en Angular con SweetAlert2 al inicializar el componente',
      icon: 'success', // Icono de éxito
      confirmButtonText: 'Aceptar',
    });
  }
}
