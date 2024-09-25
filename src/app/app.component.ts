import { Component, Inject, inject, Injector } from '@angular/core';
import { Auth, Unsubscribe } from '@angular/fire/auth';
import { Router, RouterOutlet } from '@angular/router';
import Swal from 'sweetalert2';
import { DatabaseService } from './services/database.service';
import { Usuario } from './classes/usuario';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor() {}

  private router = inject(Router);
  private db = inject(DatabaseService);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);
  logueado = false;
  authSubscription?: Unsubscribe;
  emailPrefix: string = '';
  titulo: string = 'Sala de juego';

  async ngOnInit() {
    this.authSubscription = this.auth.onAuthStateChanged(async (auth) => {
      if (auth?.email) {
        this.logueado = true;
        // Intentamos agregar el nombre al título
        await this.agregarNombreAlTitulo(auth.uid, auth.email);

        this.router.navigateByUrl('');
      }
    });
  }

  private async agregarNombreAlTitulo(
    uid: string,
    email: string
  ): Promise<void> {
    try {
      const usuario = await this.db.obtenerUsuarioPorUid(uid);
      if (usuario) {
        this.titulo += ' - ' + usuario.nombre;
      } else {
        this.agregarEmailAlTitulo(email);
      }
      this.cdr.detectChanges(); // Forzar la detección de cambios
    } catch (error) {
      console.error('Error al obtener el nombre del usuario:', error);
      this.agregarEmailAlTitulo(email);
      this.cdr.detectChanges(); // Forzar la detección de cambios
    }
  }

  private agregarEmailAlTitulo(email: string): void {
    const emailPrefix = email.split('@')[0];
    this.titulo += ' - ' + emailPrefix;
  }

  ngOnDestroy() {
    if (this.authSubscription !== undefined) {
      this.authSubscription();
    }
  }

  irAlHome() {
    this.router.navigateByUrl('');
  }
  irAlChat() {
    this.router.navigateByUrl('chat');
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
    this.titulo = 'Sala de juego';
    window.location.reload();
  }
}
