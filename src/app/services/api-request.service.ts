import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestService {
  http = inject(HttpClient);
  dato: any = {};
  constructor() {}

  apiUrl = 'https://api.github.com/users/';
  traerUsuario(usuario: string) {
    //
    const peticion = this.http.get(this.apiUrl + usuario, {
      responseType: 'json',
      params: {
        ejemplo: 'labo4',
      },
    });
    peticion.subscribe((respuesta) => {
      console.log(respuesta);
      this.dato = respuesta;
    });
  }
}
