import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor() {}

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  // =========================  Autenticacion ===================
  SignUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }
  // =================== Ingreso===========================

  SignIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // =================== Cerrar Sesion ===========================

  SignOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    routerLink('/auth');
  }

  //============= BASE DE DATOS =====================================
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }
}
