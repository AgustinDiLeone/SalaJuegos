import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc } from '@angular/fire/firestore';
import { Usuario } from '../classes/usuario';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor() {}

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  // =========================  Autenticacion ===================
  /*
  SignUp(user: Usuario) {
    return createUserWithEmailAndPassword(getAuth(), user.mail, user.password);
  }
  /*
  // =================== Ingreso===========================
  /*
  SignIn(user: Usuario) {
    return signInWithEmailAndPassword(getAuth(), user.mail, user.nombre);
  }
  */
  // =================== Cerrar Sesion ===========================
  /*
  SignOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    routerLink('/auth');
  }
  */
  //============= BASE DE DATOS =====================================
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }
}
