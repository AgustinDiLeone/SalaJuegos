export class Usuario {
  uid: string;
  nombre: string;
  email: string;

  constructor(uid: string, nombre: string, email: string) {
    this.uid = uid;
    this.nombre = nombre;
    this.email = email;
  }
}
