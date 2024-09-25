import { Injectable } from '@angular/core';
import { Usuario } from '../classes/usuario';
import {
  Firestore,
  getFirestore,
  setDoc,
  doc,
  collectionData,
  collection,
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { Mensaje } from '../classes/mensajes';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  usuarios: Usuario[] = [];

  constructor(private firestore: Firestore) {}

  //#region Usuarios

  agregarUsuario(user: Usuario) {
    const colUsuarios = collection(this.firestore, 'usuarios');
    const usuarioDoc = doc(colUsuarios, user.uid); // Aquí especificas el ID que deseas usar (user.uid en este caso)

    return setDoc(usuarioDoc, { ...user });
  }
  async obtenerUsuarioPorUid(uid: string): Promise<Usuario | null> {
    try {
      const usuarioDocRef = doc(this.firestore, 'usuarios', uid);
      const usuarioDoc = await getDoc(usuarioDocRef);

      if (usuarioDoc.exists()) {
        const usuarioData = usuarioDoc.data(); // Aseguramos que se interprete como tipo Usuario
        return new Usuario(
          usuarioData['uid'],
          usuarioData['nombre'],
          usuarioData['email']
        );
      } else {
        console.error('No existe un usuario con ese UID');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return null;
    }
  }

  logInUsuario(user: Usuario) {
    const colUsuarios = collection(this.firestore, 'login');

    // Crea un nuevo documento con un ID aleatorio
    const usuarioDoc = doc(colUsuarios); // Firestore generará un ID único automáticamente

    // Formatear la fecha y hora actuales
    const fechaHoraFormateada = this.formatFechaHora(new Date());

    // Agrega la fecha y hora al objeto que se va a guardar
    const usuarioConFecha = {
      ...user,
      fechaHora: fechaHoraFormateada, // Guarda la fecha y hora en el formato deseado
    };

    return setDoc(usuarioDoc, usuarioConFecha);
  }

  //#endregion

  //#region FormatoFecha
  formatFechaHora(date: Date): string {
    const dia = String(date.getDate()).padStart(2, '0'); // Día
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Mes (los meses empiezan en 0)
    const anio = String(date.getFullYear()).slice(-2); // Obtener los últimos 2 dígitos del año
    const horas = String(date.getHours()).padStart(2, '0'); // Horas
    const minutos = String(date.getMinutes()).padStart(2, '0'); // Minutos

    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }
  //#endregion

  //#region Chats

  async enviarMensaje(mensaje: Mensaje) {
    const colChat = collection(this.firestore, 'chat');

    // Crear el objeto que se enviará a Firestore
    const mensajeChat = {
      usuario: {
        uid: mensaje.usuario.uid,
        nombre: mensaje.usuario.nombre,
        email: mensaje.usuario.email,
      },
      texto: mensaje.texto, // Mensaje del usuario
      fechaHora: String(mensaje.fechaHora), // Fecha y hora formateadas
    };

    try {
      // Enviar el mensaje a Firestore
      await addDoc(colChat, mensajeChat);
      console.log('Mensaje enviado correctamente:', mensajeChat);
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  }
  // Método para obtener mensajes
  obtenerMensajes(): Observable<Mensaje[]> {
    const mensajesCollection = collection(this.firestore, 'chat');
    const mensajesQuery = query(mensajesCollection, orderBy('fechaHora')); // Ordenar por fechaHora

    return collectionData(mensajesQuery, { idField: 'id' }).pipe(
      map((mensajes: Mensaje[]) => {
        // Parsear fechaHora a Date
        return mensajes.map((msg: any) => ({
          ...msg,
          fechaHora: new Date(msg.fechaHora), // Asegúrate de que fechaHora sea un Date
        }));
      })
    );
  }

  //#endregion

  traerUsuarios(): Observable<Usuario[]> {
    const colUsuarios = collection(this.firestore, 'usuarios');
    return collectionData(colUsuarios, { idField: 'id' }) as Observable<
      Usuario[]
    >;
  }

  modificar(usuario: Usuario) {}

  eliminarUsuario(usuario: Usuario) {
    const colUsuarios = doc(this.firestore, `usuarios/${usuario.uid}`);
    return deleteDoc(colUsuarios);
  }
}
