import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, Unsubscribe } from '@angular/fire/auth';
import { databaseInstance$ } from '@angular/fire/database';
import { DatabaseService } from '../../services/database.service';
import { Usuario } from '../../classes/usuario';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  private auth = inject(Auth);
  private db = inject(DatabaseService);

  usuario: Usuario | any;
  logueado = false;
  authSubscription?: Unsubscribe;
  mensajes: { usuario: Usuario; texto: string }[] = []; // Lista de mensajes
  mensaje: string = ''; // Mensaje actual que se va a enviar

  ngOnInit(): void {
    this.authSubscription = this.auth.onAuthStateChanged((auth) => {
      if (auth?.email) {
        this.logueado = true;
        this.cargarMensajes(); // Cargar mensajes al iniciar sesión
        this.cargarUsuario(auth.uid); // Carga el usuario autenticado
      }
    });
  }
  async cargarUsuario(uid: string) {
    // Cargar información del usuario autenticado
    try {
      this.usuario = await this.db.obtenerUsuarioPorUid(uid); // Obtén el usuario por su UID
      if (!this.usuario) {
        console.error('Error al obtener el usuario.');
      }
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
    }
  }

  async cargarMensajes() {
    // Suponiendo que tienes un método en tu DatabaseService para obtener mensajes
    this.mensajes = await this.db.obtenerMensajes();
  }

  async enviar() {
    // Método para enviar un mensaje
    if (this.mensaje.trim() === '' || !this.usuario) return; // Evitar enviar mensajes vacíos o sin usuario

    try {
      await this.db.enviarMensaje(this.usuario, this.mensaje); // Llama al método para enviar el mensaje
      console.log('Mensaje enviado correctamente:', this.mensaje);
      this.mensajes.push({ usuario: this.usuario, texto: this.mensaje }); // Agrega el mensaje a la lista
      this.mensaje = ''; // Limpiar el campo de entrada
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }

  ngOnDestroy() {
    // Desuscribirse para evitar fugas de memoria
    if (this.authSubscription) {
      this.authSubscription();
    }
  }
}
