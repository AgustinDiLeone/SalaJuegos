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
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  usuarios: Usuario[] = [];

  constructor(private firestore: Firestore) {}

  agregarUsuario(user: Usuario) {
    const colUsuarios = collection(this.firestore, 'usuarios');
    const usuarioDoc = doc(colUsuarios, user.uid); // Aquí especificas el ID que deseas usar (user.uid en este caso)

    return setDoc(usuarioDoc, { ...user });
  }
  async obtenerNombrePorUid(uid: string): Promise<string | null> {
    try {
      const usuarioDocRef = doc(this.firestore, 'usuarios', uid);
      const usuarioDoc = await getDoc(usuarioDocRef);

      if (usuarioDoc.exists()) {
        const usuarioData = usuarioDoc.data();
        return usuarioData ? usuarioData['nombre'] : null; // Accedemos a 'name' usando la notación de corchetes
      } else {
        console.error('No existe un usuario con ese UID');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return null;
    }
  }

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
